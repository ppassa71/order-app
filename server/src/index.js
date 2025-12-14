import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { testConnection } from './utils/db.js';
import { initializeDatabase, seedDatabase } from './database/init.js';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '커피 주문 앱 백엔드 서버가 실행 중입니다.',
    version: '1.0.0'
  });
});

// API 라우트 (추후 구현)
// app.use('/api/menus', menuRoutes);
// app.use('/api/orders', orderRoutes);

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(PORT, async () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
  
  try {
    // 데이터베이스 연결 테스트
    await testConnection();
    
    // 데이터베이스 스키마 초기화
    await initializeDatabase();
    
    // 초기 데이터 삽입 (선택 사항)
    await seedDatabase();
    
    console.log('서버가 정상적으로 시작되었습니다.');
  } catch (error) {
    console.error('서버 시작 중 오류 발생:', error);
    process.exit(1);
  }
});
