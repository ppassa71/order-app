import { Order } from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * 주문 생성
 */
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // 입력 검증
    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, '주문 항목이 필요합니다.', 400);
    }

    if (totalAmount === undefined || totalAmount < 0) {
      return errorResponse(res, '유효한 총 금액이 필요합니다.', 400);
    }

    // 각 아이템 검증
    for (const item of items) {
      if (!item.menuId || !item.menuName || !item.quantity || item.quantity <= 0) {
        return errorResponse(res, '주문 항목 정보가 올바르지 않습니다.', 400);
      }
    }

    const order = await Order.create({ items, totalAmount });
    return successResponse(res, order, 201);
  } catch (error) {
    if (error.message.includes('재고')) {
      return errorResponse(res, error.message, 409);
    }
    return errorResponse(res, error.message, 500);
  }
};

/**
 * 주문 조회
 */
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(parseInt(orderId));

    if (!order) {
      return errorResponse(res, '주문을 찾을 수 없습니다.', 404);
    }

    return successResponse(res, order);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * 주문 목록 조회
 */
export const getOrders = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined
    };

    const { orders, total } = await Order.findAll(filters);
    return successResponse(res, orders, 200, { total });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * 주문 상태 업데이트
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return errorResponse(res, '주문 상태가 필요합니다.', 400);
    }

    const order = await Order.updateStatus(parseInt(orderId), status);
    return successResponse(res, {
      id: order.id,
      orderTime: order.order_time,
      status: order.status,
      totalAmount: order.total_amount
    });
  } catch (error) {
    if (error.message.includes('찾을 수 없습니다') || error.message.includes('유효하지 않은')) {
      return errorResponse(res, error.message, 400);
    }
    return errorResponse(res, error.message, 500);
  }
};

/**
 * 주문 통계 조회
 */
export const getOrderStatistics = async (req, res) => {
  try {
    const statistics = await Order.getStatistics();
    return successResponse(res, statistics);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

