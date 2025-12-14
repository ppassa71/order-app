import express from 'express';
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrderStatus,
  getOrderStatistics
} from '../controllers/orderController.js';

const router = express.Router();

// GET /api/orders/statistics - 주문 통계 조회
router.get('/statistics', getOrderStatistics);

// GET /api/orders/:orderId - 주문 조회
router.get('/:orderId', getOrder);

// GET /api/orders - 주문 목록 조회
router.get('/', getOrders);

// POST /api/orders - 주문 생성
router.post('/', createOrder);

// PATCH /api/orders/:orderId/status - 주문 상태 업데이트
router.patch('/:orderId/status', updateOrderStatus);

export default router;

