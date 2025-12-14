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
cp .env.example .env
# .env 파일을 열어서 데이터베이스 설정을 수정하세요
```

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

## API 엔드포인트

(추후 구현 예정)

- `GET /api/menus` - 메뉴 목록 조회
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:orderId` - 주문 상세 조회
- `PATCH /api/orders/:orderId/status` - 주문 상태 업데이트
- `GET /api/orders/statistics` - 주문 통계 조회
- `GET /api/menus/stock` - 재고 조회
- `PATCH /api/menus/:menuId/stock` - 재고 업데이트

## 개발 환경

- Node.js 18 이상 권장
- PostgreSQL 14 이상 권장
