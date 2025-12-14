import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL 연결 풀 생성
// Render.com에서는 DATABASE_URL 또는 개별 환경 변수 사용 가능
const getDbConfig = () => {
  // DATABASE_URL이 있으면 사용 (Render에서 자동 생성) - 우선순위 1
  if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL을 사용하여 연결합니다.');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 30000, // Render는 더 긴 타임아웃 필요
    };
  }

  // 개별 환경 변수 사용 - 우선순위 2
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT;
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;

  // 필수 환경 변수 검증
  if (!dbHost || !dbName || !dbUser || !dbPassword) {
    console.error('필수 데이터베이스 환경 변수가 설정되지 않았습니다.');
    console.error('필요한 변수: DB_HOST, DB_NAME, DB_USER, DB_PASSWORD');
    console.error('또는 DATABASE_URL을 설정하세요.');
  }

  // 호스트가 포트 번호로 잘못 설정된 경우 감지
  if (dbHost && !isNaN(dbHost) && dbPort && dbHost === dbPort) {
    console.error('경고: DB_HOST가 포트 번호로 설정되어 있습니다!');
    console.error('DB_HOST와 DB_PORT를 확인하세요.');
  }

  console.log('개별 환경 변수를 사용하여 연결합니다.');
  return {
    host: dbHost || 'localhost',
    port: parseInt(dbPort || '5432', 10),
    database: dbName || 'order_app',
    user: dbUser || 'postgres',
    password: dbPassword || '1234',
    ssl: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: process.env.NODE_ENV === 'production' ? 30000 : 5000,
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
    
    // 환경 변수 확인 및 디버깅 정보 출력
    const config = getDbConfig();
    console.error('\n현재 연결 설정:');
    if (config.connectionString) {
      // DATABASE_URL 사용 시 일부만 표시 (보안)
      const url = new URL(config.connectionString);
      console.error('  Type: DATABASE_URL');
      console.error('  Host:', url.hostname);
      console.error('  Port:', url.port);
      console.error('  Database:', url.pathname.substring(1));
      console.error('  User:', url.username);
    } else {
      console.error('  Type: Individual Environment Variables');
      console.error('  Host:', config.host);
      console.error('  Port:', config.port);
      console.error('  Database:', config.database);
      console.error('  User:', config.user);
      console.error('  SSL:', config.ssl ? 'enabled' : 'disabled');
    }
    
    console.error('\n환경 변수 확인:');
    console.error('  DATABASE_URL:', process.env.DATABASE_URL ? '설정됨' : '없음');
    console.error('  DB_HOST:', process.env.DB_HOST || '없음');
    console.error('  DB_PORT:', process.env.DB_PORT || '없음');
    console.error('  DB_NAME:', process.env.DB_NAME || '없음');
    console.error('  DB_USER:', process.env.DB_USER || '없음');
    console.error('  DB_PASSWORD:', process.env.DB_PASSWORD ? '설정됨' : '없음');
    console.error('  DB_SSL:', process.env.DB_SSL || '없음');
    console.error('  NODE_ENV:', process.env.NODE_ENV || '없음');
    
    throw error;
  }
};

export default pool;
