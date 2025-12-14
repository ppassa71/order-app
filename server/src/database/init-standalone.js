import { initializeDatabase, seedDatabase } from './init.js';

/**
 * 독립 실행형 데이터베이스 초기화 스크립트
 */
const main = async () => {
  try {
    console.log('데이터베이스 초기화를 시작합니다...');
    
    await initializeDatabase();
    await seedDatabase();
    
    console.log('데이터베이스 초기화가 완료되었습니다.');
    process.exit(0);
  } catch (error) {
    console.error('데이터베이스 초기화 실패:', error);
    process.exit(1);
  }
};

main();
