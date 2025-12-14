import pool from '../utils/db.js';

/**
 * 메뉴 모델
 */
export class Menu {
  /**
   * 모든 메뉴와 옵션 조회
   */
  static async findAll() {
    try {
      console.log('[Menu.findAll] 메뉴 조회 시작');
      // 메뉴 조회
      const menuResult = await pool.query(
        'SELECT id, name, description, price, image_url, stock FROM menus ORDER BY id'
      );
      console.log(`[Menu.findAll] 메뉴 ${menuResult.rows.length}개 발견`);

      // 각 메뉴의 옵션 조회
      const menus = await Promise.all(
        menuResult.rows.map(async (menu) => {
          const optionsResult = await pool.query(
            'SELECT id, name, price FROM options WHERE menu_id = $1 ORDER BY id',
            [menu.id]
          );

          return {
            id: menu.id,
            name: menu.name,
            description: menu.description,
            price: menu.price,
            imageUrl: menu.image_url || '',
            stock: menu.stock,
            options: optionsResult.rows.map(opt => ({
              id: opt.id,
              name: opt.name,
              price: opt.price
            }))
          };
        })
      );

      console.log(`[Menu.findAll] 메뉴 조회 완료: ${menus.length}개`);
      return menus;
    } catch (error) {
      console.error('[Menu.findAll] 에러:', error);
      throw new Error(`메뉴 조회 실패: ${error.message}`);
    }
  }

  /**
   * ID로 메뉴 조회
   */
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT id, name, description, price, image_url, stock FROM menus WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const menu = result.rows[0];

      // 옵션 조회
      const optionsResult = await pool.query(
        'SELECT id, name, price FROM options WHERE menu_id = $1',
        [id]
      );

      return {
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        imageUrl: menu.image_url || '',
        stock: menu.stock,
        options: optionsResult.rows.map(opt => ({
          id: opt.id,
          name: opt.name,
          price: opt.price
        }))
      };
    } catch (error) {
      throw new Error(`메뉴 조회 실패: ${error.message}`);
    }
  }

  /**
   * 재고 조회
   */
  static async findStock() {
    try {
      const result = await pool.query(
        'SELECT id as "menuId", name as "menuName", stock FROM menus ORDER BY id'
      );

      // PostgreSQL이 소문자로 반환할 수 있으므로 명시적으로 변환
      return result.rows.map(row => ({
        menuId: row.menuId || row.menuid || row.id,
        menuName: row.menuName || row.menuname || row.name,
        stock: row.stock
      }));
    } catch (error) {
      throw new Error(`재고 조회 실패: ${error.message}`);
    }
  }

  /**
   * 재고 업데이트
   */
  static async updateStock(menuId, change) {
    try {
      console.log('[Menu.updateStock] 호출:', { menuId, change, menuIdType: typeof menuId, changeType: typeof change });

      // 파라미터 검증
      if (menuId === undefined || menuId === null) {
        throw new Error('메뉴 ID가 필요합니다.');
      }

      if (change === undefined || change === null) {
        throw new Error('변경 값이 필요합니다.');
      }

      const menuIdNum = parseInt(menuId, 10);
      const changeNum = parseInt(change, 10);

      if (isNaN(menuIdNum) || menuIdNum <= 0) {
        console.error('[Menu.updateStock] 유효하지 않은 menuId:', menuId, '->', menuIdNum);
        throw new Error('유효하지 않은 메뉴 ID입니다.');
      }

      if (isNaN(changeNum)) {
        console.error('[Menu.updateStock] 유효하지 않은 change:', change, '->', changeNum);
        throw new Error('유효하지 않은 변경 값입니다.');
      }

      // 현재 재고 조회
      const currentResult = await pool.query(
        'SELECT stock FROM menus WHERE id = $1',
        [menuIdNum]
      );

      if (currentResult.rows.length === 0) {
        throw new Error('메뉴를 찾을 수 없습니다.');
      }

      const currentStock = parseInt(currentResult.rows[0].stock);
      if (isNaN(currentStock)) {
        throw new Error('현재 재고 값이 유효하지 않습니다.');
      }

      const newStock = Math.max(0, currentStock + changeNum);

      // 재고 업데이트
      await pool.query(
        'UPDATE menus SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newStock, menuIdNum]
      );

      // 업데이트된 메뉴 정보 조회
      const menuResult = await pool.query(
        'SELECT id, name FROM menus WHERE id = $1',
        [menuIdNum]
      );

      return {
        menuId: menuResult.rows[0].id,
        menuName: menuResult.rows[0].name,
        stock: newStock
      };
    } catch (error) {
      console.error('[Menu.updateStock] 에러:', error);
      throw new Error(`재고 업데이트 실패: ${error.message}`);
    }
  }

  /**
   * 재고 차감 (주문 시)
   */
  static async decreaseStock(menuId, quantity) {
    try {
      const result = await pool.query(
        'UPDATE menus SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND stock >= $1 RETURNING id, stock',
        [quantity, menuId]
      );

      if (result.rows.length === 0) {
        throw new Error('재고가 부족하거나 메뉴를 찾을 수 없습니다.');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`재고 차감 실패: ${error.message}`);
    }
  }
}

