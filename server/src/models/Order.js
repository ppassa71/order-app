import pool from '../utils/db.js';

/**
 * 주문 모델
 */
export class Order {
  /**
   * 주문 생성
   */
  static async create(orderData) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Orders 테이블에 주문 생성
      const orderResult = await client.query(
        `INSERT INTO orders (order_time, status, total_amount) 
         VALUES (CURRENT_TIMESTAMP, '주문 접수', $1) 
         RETURNING id, order_time, status, total_amount`,
        [orderData.totalAmount]
      );

      const order = orderResult.rows[0];
      const orderId = order.id;

      // OrderItems 테이블에 주문 상세 생성
      const orderItems = [];
      for (const item of orderData.items) {
        const itemResult = await client.query(
          `INSERT INTO order_items (order_id, menu_id, menu_name, quantity, options, item_price)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, menu_id, menu_name, quantity, options, item_price`,
          [
            orderId,
            item.menuId,
            item.menuName,
            item.quantity,
            JSON.stringify(item.options),
            item.itemPrice || item.totalPrice
          ]
        );

        // 재고 차감
        const stockUpdateResult = await client.query(
          'UPDATE menus SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND stock >= $1 RETURNING id',
          [item.quantity, item.menuId]
        );

        if (stockUpdateResult.rows.length === 0) {
          throw new Error(`${item.menuName}의 재고가 부족합니다.`);
        }

        orderItems.push({
          id: itemResult.rows[0].id,
          menuId: item.menuId,
          menuName: item.menuName,
          quantity: item.quantity,
          options: item.options,
          itemPrice: item.itemPrice || item.totalPrice
        });
      }

      await client.query('COMMIT');

      return {
        id: order.id,
        orderTime: order.order_time,
        status: order.status,
        totalAmount: order.total_amount,
        items: orderItems
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * ID로 주문 조회
   */
  static async findById(orderId) {
    try {
      // 주문 조회
      const orderResult = await pool.query(
        'SELECT id, order_time, status, total_amount FROM orders WHERE id = $1',
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        return null;
      }

      const order = orderResult.rows[0];

      // 주문 상세 조회
      const itemsResult = await pool.query(
        `SELECT id, menu_id, menu_name, quantity, options, item_price 
         FROM order_items 
         WHERE order_id = $1 
         ORDER BY id`,
        [orderId]
      );

      return {
        id: order.id,
        orderTime: order.order_time,
        status: order.status,
        totalAmount: order.total_amount,
        items: itemsResult.rows.map(item => ({
          id: item.id,
          menuId: item.menu_id,
          menuName: item.menu_name,
          quantity: item.quantity,
          options: item.options,
          itemPrice: item.item_price
        }))
      };
    } catch (error) {
      throw new Error(`주문 조회 실패: ${error.message}`);
    }
  }

  /**
   * 주문 목록 조회
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT id, order_time, status, total_amount FROM orders';
      const params = [];
      const conditions = [];

      // 상태 필터
      if (filters.status) {
        params.push(filters.status);
        conditions.push(`status = $${params.length}`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY order_time DESC';

      // Limit과 Offset
      if (filters.limit) {
        params.push(filters.limit);
        query += ` LIMIT $${params.length}`;
      }

      if (filters.offset) {
        params.push(filters.offset);
        query += ` OFFSET $${params.length}`;
      }

      const ordersResult = await pool.query(query, params);

      // 각 주문의 상세 정보 조회
      const orders = await Promise.all(
        ordersResult.rows.map(async (order) => {
          const itemsResult = await pool.query(
            `SELECT id, menu_id, menu_name, quantity, options, item_price 
             FROM order_items 
             WHERE order_id = $1 
             ORDER BY id`,
            [order.id]
          );

          return {
            id: order.id,
            orderTime: order.order_time,
            status: order.status,
            totalAmount: order.total_amount,
            items: itemsResult.rows.map(item => ({
              menuId: item.menu_id,
              menuName: item.menu_name,
              quantity: item.quantity,
              options: item.options,
              itemPrice: item.item_price
            }))
          };
        })
      );

      // 전체 주문 수 조회
      const countResult = await pool.query('SELECT COUNT(*) FROM orders');
      const total = parseInt(countResult.rows[0].count);

      return { orders, total };
    } catch (error) {
      throw new Error(`주문 목록 조회 실패: ${error.message}`);
    }
  }

  /**
   * 주문 상태 업데이트
   */
  static async updateStatus(orderId, status) {
    try {
      const validStatuses = ['주문 접수', '제조 중', '완료'];
      if (!validStatuses.includes(status)) {
        throw new Error('유효하지 않은 주문 상태입니다.');
      }

      const result = await pool.query(
        `UPDATE orders 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING id, order_time, status, total_amount`,
        [status, orderId]
      );

      if (result.rows.length === 0) {
        throw new Error('주문을 찾을 수 없습니다.');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`주문 상태 업데이트 실패: ${error.message}`);
    }
  }

  /**
   * 주문 통계 조회
   */
  static async getStatistics() {
    try {
      const result = await pool.query(
        `SELECT 
          COUNT(*) as total_orders,
          COUNT(*) FILTER (WHERE status = '주문 접수') as received_orders,
          COUNT(*) FILTER (WHERE status = '제조 중') as in_progress_orders,
          COUNT(*) FILTER (WHERE status = '완료') as completed_orders
         FROM orders`
      );

      const stats = result.rows[0];

      return {
        totalOrders: parseInt(stats.total_orders),
        receivedOrders: parseInt(stats.received_orders),
        inProgressOrders: parseInt(stats.in_progress_orders),
        completedOrders: parseInt(stats.completed_orders)
      };
    } catch (error) {
      throw new Error(`주문 통계 조회 실패: ${error.message}`);
    }
  }
}

