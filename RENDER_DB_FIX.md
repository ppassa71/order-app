# Render 데이터베이스 연결 오류 해결 가이드

## 🔴 현재 문제

로그에서 확인된 오류:
```
host: '5432'  // ❌ 잘못됨! 호스트가 포트 번호로 설정됨
port: 5432
```

**원인**: 환경 변수가 잘못 설정되었거나, `DATABASE_URL`을 사용하지 않고 개별 변수를 사용하는데 값이 잘못 매핑됨

---

## ✅ 해결 방법

### 방법 1: DATABASE_URL 사용 (가장 권장)

Render에서 **"Add from Database"** 기능을 사용하면 `DATABASE_URL`이 자동으로 설정됩니다.

1. **Render 대시보드** → **Web Service** 선택
2. **Environment** 탭 이동
3. **기존 DB 관련 환경 변수 모두 삭제**:
   - `DB_HOST` 삭제
   - `DB_PORT` 삭제
   - `DB_NAME` 삭제
   - `DB_USER` 삭제
   - `DB_PASSWORD` 삭제
4. **Add from Database** 버튼 클릭
5. 데이터베이스 선택 (예: `order-app-db`)
6. **Save Changes** 클릭

이렇게 하면 `DATABASE_URL` 하나만 설정되고, 코드가 자동으로 파싱합니다.

---

### 방법 2: 개별 환경 변수 올바르게 설정

`DATABASE_URL`을 사용하지 않는 경우:

1. **Render 대시보드** → **PostgreSQL 데이터베이스** 선택
2. **Connections** 탭에서 **Internal Database URL** 확인
   - 형식: `postgresql://user:password@host:port/database`
3. **Web Service** → **Environment** 탭 이동
4. 환경 변수 설정:

```
DB_HOST=dpg-xxxxx-a.singapore-postgres.render.com  (호스트만!)
DB_PORT=5432
DB_NAME=order_app_db_uykp
DB_USER=order_app_db_uykp_user
DB_PASSWORD=<비밀번호>
DB_SSL=true
```

**중요**: 
- `DB_HOST`는 호스트 이름만 (포트 번호 포함하지 않음)
- `DB_PORT`는 별도로 설정
- `DB_SSL=true` 필수 (Render는 SSL 필요)

---

## 🔍 환경 변수 확인 방법

### Render 대시보드에서 확인

1. **PostgreSQL 데이터베이스** 선택
2. **Connections** 탭
3. **Internal Database URL** 복사
4. URL 파싱:
   ```
   postgresql://user:password@host:port/database
                ↑    ↑        ↑    ↑    ↑
                │    │        │    │    └─ DB_NAME
                │    │        │    └────── DB_PORT
                │    │        └─────────── DB_HOST
                │    └──────────────────── DB_PASSWORD
                └───────────────────────── DB_USER
   ```

### 예시

**Internal Database URL:**
```
postgresql://order_app_db_uykp_user:abc123@dpg-xxxxx-a.singapore-postgres.render.com:5432/order_app_db_uykp
```

**환경 변수로 변환:**
```
DB_HOST=dpg-xxxxx-a.singapore-postgres.render.com
DB_PORT=5432
DB_NAME=order_app_db_uykp
DB_USER=order_app_db_uykp_user
DB_PASSWORD=abc123
DB_SSL=true
```

---

## 🛠️ 코드 개선 사항

다음 개선 사항이 적용되었습니다:

1. ✅ **DATABASE_URL 우선 사용** - Render에서 자동 생성되는 URL 사용
2. ✅ **환경 변수 검증 강화** - 잘못된 설정 감지
3. ✅ **연결 타임아웃 증가** - Render 환경에 맞게 30초로 증가
4. ✅ **상세한 에러 메시지** - 문제 진단이 쉬워짐
5. ✅ **SSL 자동 설정** - 프로덕션 환경에서 자동 활성화

---

## 📝 단계별 수정 가이드

### 1단계: 기존 환경 변수 확인

Render 대시보드에서:
- Web Service → Environment 탭
- 현재 설정된 DB 관련 변수 확인

### 2단계: 환경 변수 수정

**옵션 A: DATABASE_URL 사용 (권장)**
1. 모든 개별 DB 변수 삭제
2. Add from Database 클릭
3. 데이터베이스 선택
4. Save Changes

**옵션 B: 개별 변수 사용**
1. DB_HOST 확인 (호스트만, 포트 제외)
2. DB_PORT = 5432
3. DB_NAME, DB_USER, DB_PASSWORD 확인
4. DB_SSL = true 추가
5. Save Changes

### 3단계: 재배포 확인

1. **Events** 탭에서 재배포 진행 상황 확인
2. **Logs** 탭에서 연결 메시지 확인:
   ```
   DATABASE_URL을 사용하여 연결합니다.
   데이터베이스 연결 테스트 성공
   ```

### 4단계: 헬스체크 확인

```
https://your-service.onrender.com/api/health
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

---

## 🐛 문제 해결 체크리스트

- [ ] `DATABASE_URL`이 설정되어 있거나, 개별 변수가 모두 올바르게 설정됨
- [ ] `DB_HOST`가 호스트 이름만 포함 (포트 번호 없음)
- [ ] `DB_PORT`가 별도로 설정됨 (5432)
- [ ] `DB_SSL=true` 설정됨 (프로덕션 환경)
- [ ] Internal Database URL 사용 (External 아님)
- [ ] 환경 변수 저장 후 재배포 완료됨
- [ ] 로그에서 연결 성공 메시지 확인됨

---

## 💡 권장 사항

**가장 간단한 방법**: Render의 **"Add from Database"** 기능 사용

이 방법을 사용하면:
- ✅ 환경 변수 자동 설정
- ✅ 올바른 형식 보장
- ✅ SSL 자동 설정
- ✅ 실수 방지

코드도 `DATABASE_URL`을 우선적으로 사용하도록 개선되었습니다!

