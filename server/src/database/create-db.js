import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

/**
 * 데이터베이스 생성 (postgres 데이터베이스에 연결하여 order_app 데이터베이스 생성)
 */
export const createDatabase = async () => {
  // postgres 기본 데이터베이스에 연결
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // 기본 데이터베이스
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
  });

  try {
    await client.connect();
    console.log('postgres 데이터베이스에 연결되었습니다.');

    // 데이터베이스 존재 여부 확인
    const dbCheck = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'order_app']
    );

    if (dbCheck.rows.length === 0) {
      // 데이터베이스 생성
      await client.query(
        `CREATE DATABASE ${process.env.DB_NAME || 'order_app'}`
      );
      console.log(`데이터베이스 '${process.env.DB_NAME || 'order_app'}'가 생성되었습니다.`);
    } else {
      console.log(`데이터베이스 '${process.env.DB_NAME || 'order_app'}'가 이미 존재합니다.`);
    }

    await client.end();
    return true;
  } catch (error) {
    console.error('데이터베이스 생성 중 오류 발생:', error);
    await client.end();
    throw error;
  }
};

// 독립 실행형 스크립트로 실행
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMainModule || process.argv[1]?.includes('create-db.js')) {
  createDatabase()
    .then(() => {
      console.log('데이터베이스 생성이 완료되었습니다.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('데이터베이스 생성 실패:', error);
      process.exit(1);
    });
}
