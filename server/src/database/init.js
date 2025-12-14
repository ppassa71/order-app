import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { testConnection } from '../utils/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 데이터베이스 스키마 초기화
 */
export const initializeDatabase = async () => {
  try {
    // 연결 테스트
    const connected = await testConnection();
    if (!connected) {
      // 데이터베이스가 없을 수 있으므로 생성 시도
      console.log('데이터베이스 연결 실패. 데이터베이스 생성을 시도합니다...');
      const { createDatabase } = await import('./create-db.js');
      await createDatabase();
      
      // 다시 연결 테스트
      const retryConnected = await testConnection();
      if (!retryConnected) {
        throw new Error('데이터베이스 연결에 실패했습니다.');
      }
    }

    // SQL 파일 읽기
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // 스키마 실행
    await pool.query(schemaSQL);
    console.log('데이터베이스 스키마가 성공적으로 생성되었습니다.');

    return true;
  } catch (error) {
    console.error('데이터베이스 초기화 중 오류 발생:', error);
    throw error;
  }
};

/**
 * 초기 데이터 삽입 (선택 사항)
 */
export const seedDatabase = async () => {
  try {
    // 메뉴 데이터 확인
    const menuCheck = await pool.query('SELECT COUNT(*) FROM menus');
    const menuCount = parseInt(menuCheck.rows[0].count);

    if (menuCount === 0) {
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

      console.log('초기 데이터 삽입이 완료되었습니다.');
    } else {
      console.log('이미 데이터가 존재합니다. 초기 데이터를 건너뜁니다.');
    }
  } catch (error) {
    console.error('초기 데이터 삽입 중 오류 발생:', error);
    throw error;
  }
};
