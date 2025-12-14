# Render.com Web Service 데이터베이스 접속 경로 수정 가이드

## 📋 Render 대시보드에서 환경 변수 수정하기

### 방법 1: 환경 변수 직접 수정 (권장)

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com 접속 및 로그인

2. **Web Service 선택**
   - 배포한 백엔드 서비스 (예: `order-app-backend`) 클릭

3. **Environment 탭 이동**
   - 왼쪽 메뉴에서 **Environment** 클릭

4. **환경 변수 수정/추가**
   - 기존 환경 변수: **Edit** 버튼 클릭하여 수정
   - 새 환경 변수: **Add Environment Variable** 버튼 클릭

5. **데이터베이스 연결 정보 설정**
   ```
   DB_HOST=<데이터베이스 호스트>
   DB_PORT=5432
   DB_NAME=<데이터베이스 이름>
   DB_USER=<데이터베이스 사용자>
   DB_PASSWORD=<데이터베이스 비밀번호>
   ```

6. **저장**
   - **Save Changes** 클릭
   - 자동으로 재배포가 시작됩니다

---

### 방법 2: 데이터베이스에서 자동 가져오기 (가장 쉬움)

1. **Web Service의 Environment 탭 이동**

2. **Add from Database 버튼 클릭**
   - 환경 변수 목록 상단에 있는 버튼

3. **데이터베이스 선택**
   - 드롭다운에서 연결할 데이터베이스 선택 (예: `order-app-db`)

4. **자동 설정 확인**
   - 다음 변수들이 자동으로 추가됩니다:
     - `DATABASE_URL` (전체 연결 문자열)
     - `DB_HOST`
     - `DB_PORT`
     - `DB_NAME`
     - `DB_USER`
     - `DB_PASSWORD`

5. **저장**
   - **Save Changes** 클릭

---

## 🔍 데이터베이스 연결 정보 확인 방법

### Render 대시보드에서 확인

1. **PostgreSQL 데이터베이스 선택**
   - 왼쪽 메뉴에서 데이터베이스 클릭

2. **Connections 탭 확인**
   - **Internal Database URL**: Web Service에서 사용 (같은 네트워크 내)
   - **External Database URL**: 외부에서 접속 시 사용

### Internal Database URL 형식
```
postgresql://user:password@host:port/database
```

이 URL을 파싱하면:
- **Host**: `host` 부분
- **Port**: `port` 부분 (보통 5432)
- **Database**: `database` 부분
- **User**: `user` 부분
- **Password**: `password` 부분

---

## 📝 환경 변수 설정 예시

### 개별 환경 변수로 설정

```
NODE_ENV=production
PORT=10000
DB_HOST=dpg-xxxxx-a.singapore-postgres.render.com
DB_PORT=5432
DB_NAME=order_app_xxxx
DB_USER=order_app_user
DB_PASSWORD=your_password_here
```

### DATABASE_URL 사용 (선택사항)

일부 애플리케이션은 `DATABASE_URL` 하나만 사용할 수도 있습니다:

```
DATABASE_URL=postgresql://user:password@host:port/database
```

---

## ✅ 수정 후 확인 사항

1. **재배포 완료 대기**
   - Environment 저장 후 자동 재배포 시작
   - **Events** 탭에서 배포 진행 상황 확인

2. **로그 확인**
   - **Logs** 탭에서 데이터베이스 연결 메시지 확인
   - 성공 메시지: "데이터베이스 연결 테스트 성공"

3. **헬스체크 확인**
   - 브라우저에서 `https://your-service.onrender.com/api/health` 접속
   - 응답에서 `"database": "connected"` 확인

---

## 🐛 문제 해결

### 연결 실패 시

1. **Internal Database URL 사용 확인**
   - Web Service는 **Internal Database URL** 사용
   - External URL은 외부 접속용이므로 사용하지 않음

2. **환경 변수 이름 확인**
   - 대소문자 구분 확인
   - 오타 확인 (예: `DB_HOST` vs `DBHOST`)

3. **데이터베이스 상태 확인**
   - 데이터베이스가 실행 중인지 확인
   - 데이터베이스 로그 확인

4. **재배포 확인**
   - 환경 변수 저장 후 재배포가 완료되었는지 확인
   - **Events** 탭에서 확인

### SSL 연결 오류

Render 데이터베이스는 SSL 연결이 필요할 수 있습니다. 코드에서 SSL 옵션을 설정해야 할 수 있습니다:

```javascript
// server/src/utils/db.js
const pool = new Pool({
  // ... 기타 설정
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

---

## 💡 팁

1. **환경 변수는 즉시 적용됨**
   - 저장하면 자동으로 재배포 시작
   - 기존 연결은 유지되지만 새 연결은 새 설정 사용

2. **비밀번호는 마스킹됨**
   - Render 대시보드에서 비밀번호는 `***`로 표시
   - 수정하려면 새 값 입력 후 저장

3. **여러 환경 변수 한 번에 수정 가능**
   - 여러 변수를 수정한 후 한 번에 저장 가능

4. **환경 변수 삭제**
   - 각 변수 옆의 **Delete** 버튼으로 삭제 가능

---

## 📸 단계별 스크린샷 가이드

### 1. Web Service 선택
```
Dashboard → Services → order-app-backend 클릭
```

### 2. Environment 탭 이동
```
왼쪽 메뉴: Environment 클릭
```

### 3. 환경 변수 수정
```
기존 변수: Edit 버튼 클릭
새 변수: Add Environment Variable 클릭
```

### 4. 데이터베이스 자동 연결
```
Add from Database → 데이터베이스 선택 → Save Changes
```

---

## 🔄 변경 사항 적용 확인

환경 변수 수정 후:

1. **자동 재배포 시작** (약 1-2분 소요)
2. **로그에서 확인**:
   ```
   데이터베이스 연결 테스트 성공
   데이터베이스 스키마 초기화 완료
   ```
3. **헬스체크 확인**:
   ```bash
   curl https://your-service.onrender.com/api/health
   ```

---

이제 Render에서 데이터베이스 연결 정보를 쉽게 수정할 수 있습니다! 🚀

