import { Menu } from '../models/Menu.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * 메뉴 목록 조회
 */
export const getMenus = async (req, res) => {
  try {
    console.log('[getMenus] 메뉴 목록 조회 시작');
    const menus = await Menu.findAll();
    console.log(`[getMenus] 메뉴 ${menus.length}개 조회 성공`);
    return successResponse(res, menus);
  } catch (error) {
    console.error('[getMenus] 에러:', error);
    return errorResponse(res, error.message, 500);
  }
};

/**
 * 재고 조회
 */
export const getStock = async (req, res) => {
  try {
    const stock = await Menu.findStock();
    return successResponse(res, stock);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * 재고 업데이트
 */
export const updateStock = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { change, stock } = req.body;

    console.log('[updateStock] 요청 받음:', { menuId, change, stock });

    // menuId 검증
    if (!menuId || menuId === 'undefined' || menuId === 'null') {
      console.error('[updateStock] menuId가 없음:', menuId);
      return errorResponse(res, '메뉴 ID가 필요합니다.', 400);
    }

    const menuIdNum = parseInt(menuId, 10);
    if (isNaN(menuIdNum) || menuIdNum <= 0) {
      console.error('[updateStock] 유효하지 않은 menuId:', menuId, '->', menuIdNum);
      return errorResponse(res, '유효하지 않은 메뉴 ID입니다.', 400);
    }

    if (change === undefined && stock === undefined) {
      return errorResponse(res, 'change 또는 stock 파라미터가 필요합니다.', 400);
    }

    let changeValue;
    if (stock !== undefined) {
      // 절대값으로 설정
      const stockNum = parseInt(stock);
      if (isNaN(stockNum)) {
        return errorResponse(res, '유효하지 않은 재고 값입니다.', 400);
      }

      const currentResult = await Menu.findStock();
      const currentMenu = currentResult.find(m => m.menuId === menuIdNum);
      if (!currentMenu) {
        return errorResponse(res, '메뉴를 찾을 수 없습니다.', 404);
      }
      changeValue = stockNum - currentMenu.stock;
    } else {
      // change 값을 숫자로 변환
      changeValue = parseInt(change);
      if (isNaN(changeValue)) {
        return errorResponse(res, '유효하지 않은 변경 값입니다. 숫자를 입력해주세요.', 400);
      }
    }

    // changeValue가 NaN인지 다시 한번 확인
    if (isNaN(changeValue)) {
      return errorResponse(res, '재고 변경 값이 유효하지 않습니다.', 400);
    }

    const result = await Menu.updateStock(menuIdNum, changeValue);
    return successResponse(res, result);
  } catch (error) {
    console.error('[updateStock] 에러:', error);
    if (error.message.includes('찾을 수 없습니다')) {
      return errorResponse(res, error.message, 404);
    }
    return errorResponse(res, error.message, 500);
  }
};

