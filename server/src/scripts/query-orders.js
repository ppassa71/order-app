import pool from '../utils/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function queryOrders() {
  try {
    console.log('========================================');
    console.log('Orders 테이블 전체 조회');
    console.log('========================================\n');

    // Orders 테이블 조회
    const ordersResult = await pool.query(`
      SELECT 
        id,
        order_time,
        status,
        total_amount,
        created_at,
        updated_at
      FROM orders
      ORDER BY order_time DESC
    `);

    console.log(`총 주문 수: ${ordersResult.rows.length}개\n`);

    if (ordersResult.rows.length === 0) {
      console.log('주문 데이터가 없습니다.');
      await pool.end();
      return;
    }

    // 각 주문의 상세 정보 조회
    for (const order of ordersResult.rows) {
      console.log('----------------------------------------');
      console.log(`주문 ID: ${order.id}`);
      console.log(`주문 시간: ${order.order_time}`);
      console.log(`상태: ${order.status}`);
      console.log(`총 금액: ${order.total_amount.toLocaleString()}원`);
      console.log(`생성일: ${order.created_at}`);
      console.log(`수정일: ${order.updated_at}`);

      // 주문 상세 조회
      const itemsResult = await pool.query(`
        SELECT 
          id,
          menu_id,
          menu_name,
          quantity,
          options,
          item_price
        FROM order_items
        WHERE order_id = $1
        ORDER BY id
      `, [order.id]);

      console.log(`\n주문 상세 (${itemsResult.rows.length}개 항목):`);
      itemsResult.rows.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.menu_name} x ${item.quantity}`);
        console.log(`     메뉴 ID: ${item.menu_id}`);
        console.log(`     옵션: ${JSON.stringify(item.options)}`);
        console.log(`     가격: ${item.item_price.toLocaleString()}원`);
      });
      console.log('');
    }

    console.log('========================================');
    await pool.end();
  } catch (error) {
    console.error('오류 발생:', error);
    await pool.end();
    process.exit(1);
  }
}

queryOrders();

