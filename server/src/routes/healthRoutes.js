import express from 'express';
import { testConnection } from '../utils/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

/**
 * 헬스체크 - 서버 및 DB 연결 상태 확인
 */
router.get('/', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    
    return successResponse(res, {
      status: 'ok',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return errorResponse(res, {
      status: 'error',
      database: 'error',
      error: error.message
    }, 500);
  }
});

export default router;

