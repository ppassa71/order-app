# Render.com 데이터베이스 스키마 생성 가이드

## 📋 사전 준비

1. **Render.com에서 데이터베이스 생성 완료**
2. **.env 파일에 Render 데이터베이스 정보 설정**

## 🔧 .env 파일 설정

`server/.env` 파일에 다음 정보를 설정하세요:

```env
DB_HOST=<Render 데이터베이스 호스트>
DB_PORT=5432
DB_NAME=<데이터베이스 이름>
DB_USER=<데이터베이스 사용자>
DB_PASSWORD=<데이터베이스 비밀번호>
DB_SSL=true
```

### Render 데이터베이스 정보 확인 방법

1. Render.com 대시보드 접속
2. 생성한 PostgreSQL 데이터베이스 선택
3. **Connections** 탭에서 정보 확인:
   - **Internal Database URL** 또는
   - **Host**, **Port**, **Database**, **User**, **Password** 개별 확인

**Internal Database URL 형식:**
```
postgresql://user:password@host:port/database
```

이 URL을 파싱하여 .env 파일에 설정하거나, 개별 값으로 설정할 수 있습니다.

## 🚀 스키마 생성 실행

### 방법 1: npm 스크립트 사용 (권장)

```bash
cd server
npm run setup-render-db
```

### 방법 2: 직접 실행

```bash
cd server
node src/scripts/setup-render-db.js
```

### 방법 3: 환경 변수 직접 지정

```bash
cd server
DB_HOST=xxx DB_PORT=5432 DB_NAME=xxx DB_USER=xxx DB_PASSWORD=xxx node src/scripts/setup-render-db.js
```

## ✅ 실행 결과

스크립트가 성공적으로 실행되면:

1. ✓ 데이터베이스 연결 성공
2. ✓ 데이터베이스 스키마 생성 완료
3. ✓ 초기 메뉴 데이터 삽입 완료
4. ✓ 생성된 테이블 목록 표시

## 📊 생성되는 테이블

- `menus` - 메뉴 정보
- `options` - 메뉴 옵션
- `orders` - 주문 정보
- `order_items` - 주문 상세 정보

## 🔍 문제 해결

### 연결 실패

- `.env` 파일의 정보가 올바른지 확인
- Render 데이터베이스가 실행 중인지 확인
- 방화벽 설정 확인 (Render는 자동으로 처리)

### SSL 오류

- `DB_SSL=true` 설정 확인
- Render 데이터베이스는 SSL 연결이 필요할 수 있습니다

### 권한 오류

- 데이터베이스 사용자에게 충분한 권한이 있는지 확인
- Render에서 생성한 사용자는 기본적으로 모든 권한을 가집니다

## 📝 참고사항

- 스크립트는 기존 테이블이 있으면 건너뜁니다 (IF NOT EXISTS 사용)
- 초기 데이터는 메뉴가 없을 때만 삽입됩니다
- 여러 번 실행해도 안전합니다 (idempotent)

