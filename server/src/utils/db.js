import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL 연결 풀 생성
// Render.com에서는 DATABASE_URL 또는 개별 환경 변수 사용 가능
const getDbConfig = () => {
  // DATABASE_URL이 있으면 사용 (Render에서 자동 생성)
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000, // Render는 좀 더 긴 타임아웃 필요
    };
  }

  // 개별 환경 변수 사용
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'order_app',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    ssl: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: process.env.NODE_ENV === 'production' ? 10000 : 2000,
  };
};

const pool = new Pool(getDbConfig());

// 연결 풀 이벤트 리스너
pool.on('connect', () => {
  console.log('PostgreSQL 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
  console.error('예상치 못한 데이터베이스 연결 오류:', err);
  process.exit(-1);
});

// 연결 테스트 함수
export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('데이터베이스 연결 테스트 성공:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('데이터베이스 연결 테스트 실패:', error.message);
    console.error('연결 설정:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'order_app',
      user: process.env.DB_USER || 'postgres'
    });
    throw error; // 에러를 던져서 상위에서 처리할 수 있도록
  }
};

export default pool;
