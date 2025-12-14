/**
 * Render.com 데이터베이스 스키마 생성 스크립트
 * 
 * 사용법:
 * node src/scripts/setup-render-db.js
 * 
 * 또는 환경 변수를 직접 지정:
 * DB_HOST=xxx DB_PORT=5432 DB_NAME=xxx DB_USER=xxx DB_PASSWORD=xxx node src/scripts/setup-render-db.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// 데이터베이스 연결 풀 생성
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Render는 좀 더 긴 타임아웃 필요
});

/**
 * 데이터베이스 연결 테스트
 */
async function testConnection() {
  try {
    console.log('데이터베이스 연결 테스트 중...');
    const result = await pool.query('SELECT NOW()');
    console.log('✓ 데이터베이스 연결 성공:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('✗ 데이터베이스 연결 실패:', error.message);
    console.error('\n연결 정보:');
    console.error('  Host:', process.env.DB_HOST);
    console.error('  Port:', process.env.DB_PORT);
    console.error('  Database:', process.env.DB_NAME);
    console.error('  User:', process.env.DB_USER);
    console.error('  Password:', process.env.DB_PASSWORD ? '***' : '없음');
    throw error;
  }
}

/**
 * 스키마 생성
 */
async function createSchema() {
  try {
    console.log('\n스키마 생성 중...');
    
    // SQL 파일 읽기
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // 스키마 실행
    await pool.query(schemaSQL);
    console.log('✓ 데이터베이스 스키마가 성공적으로 생성되었습니다.');
    
    return true;
  } catch (error) {
    console.error('✗ 스키마 생성 실패:', error.message);
    throw error;
  }
}

/**
 * 초기 데이터 삽입
 */
async function seedData() {
  try {
    console.log('\n초기 데이터 삽입 중...');
    
    // 메뉴 데이터 확인
    const menuCheck = await pool.query('SELECT COUNT(*) FROM menus');
    const menuCount = parseInt(menuCheck.rows[0].count);
    
    if (menuCount > 0) {
      console.log(`이미 ${menuCount}개의 메뉴가 존재합니다. 초기 데이터를 건너뜁니다.`);
      return;
    }
    
    console.log('초기 메뉴 데이터를 삽입합니다...');
    
    // 샘플 메뉴 데이터
    const menus = [
      {
        name: '아메리카노(ICE)',
        description: '에스프레소에 물을 넣어 만든 시원한 아메리카노',
        price: 4000,
        image_url: '',
        stock: 10
      },
      {
        name: '아메리카노(HOT)',
        description: '에스프레소에 물을 넣어 만든 따뜻한 아메리카노',
        price: 4000,
        image_url: '',
        stock: 10
      },
      {
        name: '카페라떼',
        description: '에스프레소와 스팀 밀크가 만나 부드러운 맛',
        price: 5000,
        image_url: '',
        stock: 10
      },
      {
        name: '카푸치노',
        description: '에스프레소와 우유 거품이 어우러진 클래식 커피',
        price: 5000,
        image_url: '',
        stock: 8
      },
      {
        name: '카라멜 마키아토',
        description: '카라멜 시럽이 들어간 달콤한 커피',
        price: 5500,
        image_url: '',
        stock: 5
      },
      {
        name: '바닐라 라떼',
        description: '바닐라 시럽이 들어간 부드러운 라떼',
        price: 5500,
        image_url: '',
        stock: 3
      },
      {
        name: '카페모카',
        description: '초콜릿과 커피가 만나 달콤 쌉쌀한 맛',
        price: 5500,
        image_url: '',
        stock: 0
      },
      {
        name: '콜드브루',
        description: '차가운 물로 우려낸 깔끔한 커피',
        price: 4500,
        image_url: '',
        stock: 12
      }
    ];
    
    for (const menu of menus) {
      const result = await pool.query(
        'INSERT INTO menus (name, description, price, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [menu.name, menu.description, menu.price, menu.image_url, menu.stock]
      );
      
      const menuId = result.rows[0].id;
      
      // 옵션 데이터 삽입
      await pool.query(
        'INSERT INTO options (name, price, menu_id) VALUES ($1, $2, $3)',
        ['샷 추가', 500, menuId]
      );
      
      await pool.query(
        'INSERT INTO options (name, price, menu_id) VALUES ($1, $2, $3)',
        ['시럽 추가', 0, menuId]
      );
    }
    
    console.log(`✓ ${menus.length}개의 메뉴와 옵션이 성공적으로 삽입되었습니다.`);
  } catch (error) {
    console.error('✗ 초기 데이터 삽입 실패:', error.message);
    throw error;
  }
}

/**
 * 테이블 목록 확인
 */
async function showTables() {
  try {
    console.log('\n생성된 테이블 확인 중...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('✓ 생성된 테이블:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
  } catch (error) {
    console.error('테이블 목록 조회 실패:', error.message);
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('========================================');
  console.log('Render.com 데이터베이스 스키마 생성');
  console.log('========================================\n');
  
  // 환경 변수 확인
  const requiredEnvVars = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('✗ 필수 환경 변수가 설정되지 않았습니다:');
    missingVars.forEach(varName => console.error(`  - ${varName}`));
    console.error('\n.env 파일을 확인하거나 환경 변수를 설정해주세요.');
    process.exit(1);
  }
  
  try {
    // 1. 연결 테스트
    await testConnection();
    
    // 2. 스키마 생성
    await createSchema();
    
    // 3. 초기 데이터 삽입
    await seedData();
    
    // 4. 테이블 목록 확인
    await showTables();
    
    console.log('\n========================================');
    console.log('✓ 모든 작업이 완료되었습니다!');
    console.log('========================================');
    
  } catch (error) {
    console.error('\n========================================');
    console.error('✗ 오류 발생:', error.message);
    console.error('========================================');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 스크립트 실행
main();

