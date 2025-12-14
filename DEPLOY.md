# Render.com 배포 가이드

## 배포 순서

### 1단계: PostgreSQL 데이터베이스 배포

1. Render.com에 로그인 후 **New +** → **PostgreSQL** 선택
2. 설정:
   - **Name**: `order-app-db`
   - **Database**: `order_app`
   - **User**: `order_app_user`
   - **Region**: 가장 가까운 지역 선택
   - **Plan**: Free (또는 원하는 플랜)
3. **Create Database** 클릭
4. 데이터베이스가 생성되면 **Connections** 탭에서 연결 정보 확인:
   - **Internal Database URL**: 백엔드에서 사용
   - **External Database URL**: 로컬에서 접속 시 사용

### 2단계: 백엔드 서버 배포

1. **New +** → **Web Service** 선택
2. GitHub 저장소 연결:
   - 저장소를 선택하거나 연결
   - **Root Directory**: `server` 지정
3. 설정:
   - **Name**: `order-app-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (또는 원하는 플랜)
4. 환경 변수 설정 (Environment Variables):
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<데이터베이스의 Internal Database URL에서 추출>
   DB_PORT=5432
   DB_NAME=order_app
   DB_USER=<데이터베이스 사용자명>
   DB_PASSWORD=<데이터베이스 비밀번호>
   ```
   또는 **Add from Database** 버튼으로 자동 연결 가능
5. **Create Web Service** 클릭
6. 배포 완료 후 **Settings** → **Health Check Path**에 `/api/health` 설정

### 3단계: 프론트엔드 배포

#### 방법 1: Static Site로 배포 (권장)

1. **New +** → **Static Site** 선택
2. GitHub 저장소 연결:
   - 같은 저장소 선택
   - **Root Directory**: `ui` 지정
3. 설정:
   - **Name**: `order-app-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. 환경 변수 설정:
   ```
   VITE_API_BASE_URL=https://order-app-backend.onrender.com/api
   ```
   (백엔드 서비스의 실제 URL로 변경)
5. **Create Static Site** 클릭

#### 방법 2: Web Service로 배포

1. **New +** → **Web Service** 선택
2. GitHub 저장소 연결:
   - 같은 저장소 선택
   - **Root Directory**: `ui` 지정
3. 설정:
   - **Name**: `order-app-frontend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l 10000`
   - **Plan**: Free
4. 환경 변수 설정:
   ```
   VITE_API_BASE_URL=https://order-app-backend.onrender.com/api
   ```
5. **Create Web Service** 클릭

## 환경 변수 설정 요약

### 백엔드 환경 변수
```
NODE_ENV=production
PORT=10000
DB_HOST=<데이터베이스 호스트>
DB_PORT=5432
DB_NAME=order_app
DB_USER=<데이터베이스 사용자>
DB_PASSWORD=<데이터베이스 비밀번호>
```

### 프론트엔드 환경 변수
```
VITE_API_BASE_URL=https://order-app-backend.onrender.com/api
```

## 배포 후 확인 사항

1. **백엔드 헬스체크**: `https://order-app-backend.onrender.com/api/health`
2. **프론트엔드 접속**: `https://order-app-frontend.onrender.com`
3. **데이터베이스 연결 확인**: 백엔드 로그에서 확인
4. **CORS 설정**: 백엔드에서 프론트엔드 도메인 허용 확인

## 문제 해결

### 백엔드가 데이터베이스에 연결되지 않는 경우
- Internal Database URL 사용 확인
- 환경 변수가 올바르게 설정되었는지 확인
- 데이터베이스가 실행 중인지 확인

### 프론트엔드가 백엔드에 연결되지 않는 경우
- `VITE_API_BASE_URL`이 올바른지 확인
- CORS 설정 확인
- 백엔드 URL이 올바른지 확인 (https:// 포함)

### 빌드 실패
- Node.js 버전 확인 (Render는 기본적으로 최신 LTS 사용)
- package.json의 scripts 확인
- 빌드 로그 확인

## 참고사항

- Render.com의 Free 플랜은 15분간 비활성 시 자동으로 sleep됩니다
- 첫 요청 시 깨어나는데 시간이 걸릴 수 있습니다
- 프로덕션 환경에서는 유료 플랜 사용을 권장합니다

