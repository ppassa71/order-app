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

// API 라우트
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

app.use('/api/health', healthRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
const server = app.listen(PORT, async () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`환경: ${process.env.NODE_ENV || 'development'}`);
  
  try {
    // 데이터베이스 연결 테스트
    console.log('데이터베이스 연결 테스트 중...');
    await testConnection();
    console.log('✓ 데이터베이스 연결 성공');
    
    // 데이터베이스 스키마 초기화
    console.log('데이터베이스 스키마 초기화 중...');
    await initializeDatabase();
    console.log('✓ 데이터베이스 스키마 초기화 완료');
    
    // 초기 데이터 삽입 (선택 사항)
    console.log('초기 데이터 삽입 중...');
    await seedDatabase();
    console.log('✓ 초기 데이터 삽입 완료');
    
    console.log('========================================');
    console.log('서버가 정상적으로 시작되었습니다.');
    console.log(`서버 주소: http://localhost:${PORT}`);
    console.log(`API 주소: http://localhost:${PORT}/api`);
    console.log(`헬스체크: http://localhost:${PORT}/api/health`);
    console.log('========================================');
  } catch (error) {
    console.error('========================================');
    console.error('서버 시작 중 오류 발생:');
    console.error('에러 메시지:', error.message);
    console.error('에러 스택:', error.stack);
    console.error('========================================');
    console.error('\n확인 사항:');
    console.error('1. PostgreSQL이 실행 중인지 확인하세요');
    console.error('2. 데이터베이스 "order_app"이 생성되어 있는지 확인하세요');
    console.error('3. .env 파일의 DB 설정이 올바른지 확인하세요');
    console.error('4. DB 사용자 권한이 올바른지 확인하세요');
    console.error('========================================');
    server.close();
    process.exit(1);
  }
});

// 서버 에러 핸들링
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('========================================');
    console.error(`포트 ${PORT}가 이미 사용 중입니다.`);
    console.error('========================================');
    console.error('\n해결 방법:');
    console.error(`1. 포트 ${PORT}를 사용하는 프로세스를 종료하세요:`);
    console.error(`   Windows: netstat -ano | findstr :${PORT}`);
    console.error(`   그 다음: taskkill /F /PID <프로세스ID>`);
    console.error(`\n2. 또는 다른 포트를 사용하세요:`);
    console.error(`   PORT=3001 npm start`);
    console.error('========================================');
  } else {
    console.error('서버 시작 중 예상치 못한 오류:', error);
  }
  process.exit(1);
});
