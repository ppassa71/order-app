import express from 'express';
import { getMenus, getStock, updateStock } from '../controllers/menuController.js';

const router = express.Router();

// GET /api/menus - 메뉴 목록 조회
router.get('/', getMenus);

// GET /api/menus/stock - 재고 조회
router.get('/stock', getStock);

// PATCH /api/menus/:menuId/stock - 재고 업데이트
router.patch('/:menuId/stock', updateStock);

export default router;

