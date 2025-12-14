# 커피 주문 앱 백엔드 서버

Express.js를 사용한 커피 주문 앱의 백엔드 서버입니다.

## 기술 스택

- Node.js
- Express.js
- PostgreSQL
- CORS

## 설치 방법

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
```bash
# server 폴더에 .env 파일을 생성하고 다음 내용을 추가하세요
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=order_app
# DB_USER=postgres
# DB_PASSWORD=1234
# PORT=3000
# NODE_ENV=development
```

또는 환경 변수 없이 기본값을 사용할 수 있습니다 (기본값: localhost:5432, order_app, postgres/1234)

3. 서버 실행:
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

## 프로젝트 구조

```
server/
├── src/
│   ├── index.js          # 서버 진입점
│   ├── routes/           # API 라우트
│   ├── controllers/      # 컨트롤러
│   ├── models/           # 데이터 모델
│   ├── middleware/       # 미들웨어
│   └── utils/            # 유틸리티 함수
├── .env.example          # 환경 변수 예시
├── .gitignore
├── package.json
└── README.md
```

## 데이터베이스 설정

1. PostgreSQL 설치 및 실행
2. 데이터베이스 생성:
```sql
CREATE DATABASE order_app;
```
3. 서버 실행 시 자동으로 테이블이 생성되고 초기 데이터가 삽입됩니다.

## API 엔드포인트

- `GET /` - 서버 상태 확인
- `GET /api/health` - 서버 및 DB 연결 상태 확인
- `GET /api/menus` - 메뉴 목록 조회
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:orderId` - 주문 상세 조회
- `PATCH /api/orders/:orderId/status` - 주문 상태 업데이트
- `GET /api/orders/statistics` - 주문 통계 조회
- `GET /api/menus/stock` - 재고 조회
- `PATCH /api/menus/:menuId/stock` - 재고 업데이트

## 문제 해결

서버 시작 시 오류가 발생하면:
1. PostgreSQL이 실행 중인지 확인
2. 데이터베이스 "order_app"이 생성되어 있는지 확인
3. DB 사용자 권한 확인
4. 포트 3000이 사용 가능한지 확인

## 개발 환경

- Node.js 18 이상 권장
- PostgreSQL 14 이상 권장
