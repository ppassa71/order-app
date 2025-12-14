# Render.com 배포 가이드

## 📋 배포 순서

### 1️⃣ PostgreSQL 데이터베이스 배포

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com 접속 및 로그인

2. **새 PostgreSQL 생성**
   - **New +** 버튼 클릭 → **PostgreSQL** 선택

3. **데이터베이스 설정**
   ```
   Name: order-app-db
   Database: order_app
   User: order_app_user
   Region: 가장 가까운 지역 선택 (예: Singapore)
   PostgreSQL Version: 16 (또는 최신 버전)
   Plan: Free (또는 원하는 플랜)
   ```

4. **Create Database** 클릭

5. **연결 정보 확인**
   - 데이터베이스 생성 후 **Connections** 탭에서 확인
   - **Internal Database URL** 복사 (백엔드에서 사용)

---

### 2️⃣ 백엔드 서버 배포

1. **새 Web Service 생성**
   - **New +** 버튼 클릭 → **Web Service** 선택

2. **GitHub 저장소 연결**
   - GitHub 계정 연결 (처음이면)
   - 저장소 선택: `order-app`
   - **Root Directory**: `server` 입력

3. **서비스 설정**
   ```
   Name: order-app-backend
   Environment: Node
   Region: 데이터베이스와 같은 지역 선택
   Branch: main (또는 기본 브랜치)
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   Plan: Free (또는 원하는 플랜)
   ```

4. **환경 변수 설정** (Environment Variables)
   
   방법 1: 데이터베이스에서 자동 가져오기
   - **Add from Database** 버튼 클릭
   - `order-app-db` 선택
   - 자동으로 다음 변수들이 추가됨:
     - `DATABASE_URL`
     - `DB_HOST`
     - `DB_PORT`
     - `DB_NAME`
     - `DB_USER`
     - `DB_PASSWORD`

   방법 2: 수동 설정
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<데이터베이스 Internal Database URL의 호스트>
   DB_PORT=5432
   DB_NAME=order_app
   DB_USER=<데이터베이스 사용자명>
   DB_PASSWORD=<데이터베이스 비밀번호>
   ```

5. **고급 설정** (Advanced)
   - **Health Check Path**: `/api/health` 입력

6. **Create Web Service** 클릭

7. **배포 완료 후**
   - 백엔드 URL 확인: `https://order-app-backend.onrender.com`
   - 헬스체크 확인: `https://order-app-backend.onrender.com/api/health`

---

### 3️⃣ 프론트엔드 배포

#### 방법 A: Static Site로 배포 (권장)

1. **새 Static Site 생성**
   - **New +** 버튼 클릭 → **Static Site** 선택

2. **GitHub 저장소 연결**
   - 같은 저장소 선택: `order-app`
   - **Root Directory**: `ui` 입력

3. **설정**
   ```
   Name: order-app-frontend
   Branch: main
   Root Directory: ui
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **환경 변수 설정**
   ```
   VITE_API_BASE_URL=https://order-app-backend.onrender.com/api
   ```
   ⚠️ 백엔드 서비스의 실제 URL로 변경 필요

5. **Create Static Site** 클릭

#### 방법 B: Web Service로 배포

1. **새 Web Service 생성**
   - **New +** 버튼 클릭 → **Web Service** 선택

2. **GitHub 저장소 연결**
   - 같은 저장소 선택: `order-app`
   - **Root Directory**: `ui` 입력

3. **설정**
   ```
   Name: order-app-frontend
   Environment: Node
   Root Directory: ui
   Build Command: npm install && npm run build
   Start Command: npm start
   Plan: Free
   ```

4. **환경 변수 설정**
   ```
   VITE_API_BASE_URL=https://order-app-backend.onrender.com/api
   ```

5. **Create Web Service** 클릭

---

## 🔧 환경 변수 요약

### 백엔드 환경 변수
```env
NODE_ENV=production
PORT=10000
DB_HOST=<데이터베이스 호스트>
DB_PORT=5432
DB_NAME=order_app
DB_USER=<데이터베이스 사용자>
DB_PASSWORD=<데이터베이스 비밀번호>
```

### 프론트엔드 환경 변수
```env
VITE_API_BASE_URL=https://order-app-backend.onrender.com/api
```

---

## ✅ 배포 후 확인 사항

1. **백엔드 헬스체크**
   ```
   https://order-app-backend.onrender.com/api/health
   ```
   응답 예시:
   ```json
   {
     "success": true,
     "data": {
       "status": "ok",
       "database": "connected"
     }
   }
   ```

2. **프론트엔드 접속**
   ```
   https://order-app-frontend.onrender.com
   ```

3. **데이터베이스 연결 확인**
   - 백엔드 로그에서 확인
   - "데이터베이스 연결 테스트 성공" 메시지 확인

4. **CORS 설정 확인**
   - 프론트엔드에서 API 호출이 정상 작동하는지 확인

---

## 🐛 문제 해결

### 백엔드가 데이터베이스에 연결되지 않는 경우

1. **Internal Database URL 사용 확인**
   - Render 대시보드에서 데이터베이스의 **Internal Database URL** 사용
   - External URL은 외부 접속용

2. **환경 변수 확인**
   - 모든 DB 관련 환경 변수가 올바르게 설정되었는지 확인
   - 특히 `DB_HOST`, `DB_PASSWORD` 확인

3. **데이터베이스 상태 확인**
   - 데이터베이스가 실행 중인지 확인
   - 데이터베이스 로그 확인

### 프론트엔드가 백엔드에 연결되지 않는 경우

1. **VITE_API_BASE_URL 확인**
   - 백엔드 URL이 올바른지 확인
   - `https://`로 시작하는지 확인
   - `/api`로 끝나는지 확인

2. **CORS 오류 확인**
   - 브라우저 콘솔에서 CORS 오류 확인
   - 백엔드 CORS 설정 확인

3. **네트워크 오류 확인**
   - 브라우저 개발자 도구 → Network 탭 확인
   - API 요청이 실패하는지 확인

### 빌드 실패

1. **Node.js 버전 확인**
   - Render는 기본적으로 최신 LTS 사용
   - 필요시 `.nvmrc` 파일로 버전 지정

2. **package.json 확인**
   - scripts가 올바른지 확인
   - dependencies가 모두 포함되었는지 확인

3. **빌드 로그 확인**
   - Render 대시보드의 **Logs** 탭에서 확인
   - 에러 메시지 확인

### Free 플랜 제한사항

- **Sleep 모드**: 15분간 비활성 시 자동 sleep
- **첫 요청 지연**: Sleep에서 깨어날 때 약 30초~1분 소요
- **해결 방법**: 
  - 유료 플랜 사용
  - 또는 외부 서비스로 주기적 ping (예: UptimeRobot)

---

## 📝 추가 설정 파일

프로젝트 루트에 다음 파일들이 생성되었습니다:

- `DEPLOY.md`: 상세 배포 가이드
- `render.yaml`: 전체 서비스 설정 (선택사항)
- `server/render.yaml`: 백엔드 전용 설정
- `ui/render.yaml`: 프론트엔드 전용 설정

---

## 🚀 빠른 배포 체크리스트

- [ ] GitHub에 코드 푸시 완료
- [ ] PostgreSQL 데이터베이스 생성 완료
- [ ] 백엔드 Web Service 생성 및 환경 변수 설정 완료
- [ ] 프론트엔드 Static Site/Web Service 생성 및 환경 변수 설정 완료
- [ ] 백엔드 헬스체크 통과 확인
- [ ] 프론트엔드에서 백엔드 API 호출 확인
- [ ] 모든 기능 정상 작동 확인

---

## 💡 팁

1. **환경 변수는 배포 후에도 수정 가능**
   - Settings → Environment Variables에서 수정
   - 수정 후 자동 재배포됨

2. **로그 확인**
   - 각 서비스의 **Logs** 탭에서 실시간 로그 확인
   - 문제 발생 시 로그를 먼저 확인

3. **도메인 연결**
   - Settings → Custom Domain에서 커스텀 도메인 연결 가능

4. **백업**
   - 데이터베이스는 주기적으로 백업 설정 권장
   - Settings → Backups에서 설정

---

배포 성공을 기원합니다! 🎉

