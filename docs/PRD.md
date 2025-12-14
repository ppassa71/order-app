# 커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트 명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리 할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면 (재고 관리 및 주문 상태 관리)
- 데이트를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프런트엔드 : HTML, CSS, React, Java Script
- 백엔드 : Node.js, Express
- 데이터베이스 : PostgreSQL

## 3. 기본 사항
- 프론트엔드와 백엔드를 별도로 개발
- 기본적인 웹기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피만 있음

## 4. 주문하기 화면 상세 명세

### 4.1 화면 구성

#### 4.1.1 헤더 영역
- **위치**: 화면 최상단
- **구성 요소**:
  - 좌측: "COZY" 브랜드 로고 (다크 그린 배경)
  - 우측: 네비게이션 버튼 2개
    - "주문하기" 버튼 (라이트 그레이 배경, 다크 그린 테두리)
    - "관리자" 버튼 (라이트 그레이 배경, 다크 그린 테두리)

#### 4.1.2 메뉴 아이템 섹션
- **위치**: 헤더 하단, 장바구니 영역 상단
- **레이아웃**: 메뉴 카드들이 가로로 배치 (그리드 레이아웃)
- **메뉴 카드 구성 요소**:
  - **이미지 영역**: 상단에 메뉴 이미지 표시 (플레이스홀더: 대각선 교차선)
  - **메뉴명**: 굵은 글씨로 표시 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
  - **가격**: 원화 표기 (예: "4,000원", "5,000원")
  - **설명**: 간단한 메뉴 설명 텍스트 (예: "간단한 설명...")
  - **옵션 체크박스**:
    - "샷 추가 (+500원)" - 선택 시 추가 요금 500원
    - "시럽 추가 (+0원)" - 선택 시 추가 요금 없음
  - **"담기" 버튼**: 라이트 그레이 배경, 클릭 시 해당 메뉴를 장바구니에 추가

#### 4.1.3 장바구니 영역
- **위치**: 화면 하단
- **스타일**: 라이트 그레이 배경, 다크 그레이 테두리
- **구성 요소**:
  - **제목**: "장바구니" (좌측 상단)
  - **장바구니 아이템 목록**:
    - 각 아이템은 다음 정보를 표시:
      - 메뉴명 (옵션 포함 표기)
      - 수량 (예: "X 1", "X 2")
      - 가격 (옵션 포함 최종 가격)
    - 예시:
      - "아메리카노(ICE) (샷 추가) X 1" - 4,500원
      - "아메리카노(HOT) X 2" - 8,000원
  - **총 금액**: "총 금액" 레이블과 함께 굵은 글씨로 표시 (예: "총 금액 **12,500원**")
  - **"주문하기" 버튼**: 라이트 그레이 배경, 다크 그레이 테두리, 총 금액 하단에 위치

### 4.2 기능 요구사항

#### 4.2.1 메뉴 표시 기능
- 서버에서 메뉴 목록을 조회하여 화면에 표시
- 각 메뉴는 카드 형태로 표시되며, 이미지, 이름, 가격, 설명이 포함됨
- 메뉴는 가로 스크롤 또는 그리드 레이아웃으로 여러 개를 한 번에 볼 수 있어야 함

#### 4.2.2 옵션 선택 기능
- 각 메뉴 카드에서 옵션을 체크박스로 선택 가능
- "샷 추가" 옵션 선택 시 가격에 500원 추가
- "시럽 추가" 옵션 선택 시 가격 변동 없음
- 옵션 선택 여부는 장바구니에 추가될 때 함께 저장됨

#### 4.2.3 장바구니 기능
- **담기 기능**:
  - "담기" 버튼 클릭 시 선택된 옵션과 함께 장바구니에 추가
  - 동일한 메뉴와 옵션 조합이 이미 장바구니에 있으면 수량 증가
  - 다른 옵션 조합이면 별도 아이템으로 추가
- **장바구니 표시**:
  - 장바구니에 담긴 모든 아이템을 목록으로 표시
  - 각 아이템의 메뉴명, 옵션, 수량, 가격을 표시
  - 옵션이 선택된 경우 메뉴명 옆에 표기 (예: "(샷 추가)")
- **총 금액 계산**:
  - 장바구니의 모든 아이템 가격을 합산하여 실시간으로 표시
  - 옵션 추가 요금도 포함하여 계산

#### 4.2.4 주문하기 기능
- 장바구니에 아이템이 있을 때만 "주문하기" 버튼 활성화
- "주문하기" 버튼 클릭 시:
  - 장바구니의 모든 아이템과 수량, 옵션 정보를 서버로 전송
  - 주문이 성공적으로 생성되면 장바구니 초기화
  - 주문 완료 메시지 표시 (선택 사항)

#### 4.2.5 네비게이션 기능
- 헤더의 "주문하기" 버튼: 주문하기 화면으로 이동 (현재 화면이면 무시)
- 헤더의 "관리자" 버튼: 관리자 화면으로 이동

### 4.3 사용자 플로우

1. 사용자가 주문하기 화면에 진입
2. 메뉴 카드에서 원하는 메뉴 확인
3. 필요시 옵션 체크박스 선택 (샷 추가, 시럽 추가)
4. "담기" 버튼 클릭하여 장바구니에 추가
5. 장바구니 영역에서 담긴 아이템과 총 금액 확인
6. 추가 메뉴를 담거나 주문 진행 결정
7. "주문하기" 버튼 클릭하여 주문 완료

### 4.4 데이터 구조

#### 4.4.1 메뉴 아이템 데이터
```javascript
{
  id: number,              // 메뉴 고유 ID
  name: string,            // 메뉴명 (예: "아메리카노(ICE)")
  price: number,           // 기본 가격 (예: 4000)
  description: string,      // 메뉴 설명
  imageUrl: string         // 이미지 URL
}
```

#### 4.4.2 장바구니 아이템 데이터
```javascript
{
  menuId: number,          // 메뉴 ID
  menuName: string,         // 메뉴명
  basePrice: number,        // 기본 가격
  options: {
    addShot: boolean,       // 샷 추가 여부
    addSyrup: boolean       // 시럽 추가 여부
  },
  quantity: number,         // 수량
  totalPrice: number        // 총 가격 (기본 가격 + 옵션 가격) * 수량
}
```

#### 4.4.3 주문 요청 데이터
```javascript
{
  items: [
    {
      menuId: number,
      menuName: string,
      basePrice: number,
      options: {
        addShot: boolean,
        addSyrup: boolean
      },
      quantity: number,
      totalPrice: number
    }
  ],
  totalAmount: number       // 전체 주문 금액
}
```

## 5. 관리자 화면 상세 명세

### 5.1 화면 구성

#### 5.1.1 헤더 영역
- **위치**: 화면 최상단
- **구성 요소**:
  - 좌측: "COZY" 브랜드 로고 (다크 테두리)
  - 우측: 네비게이션 버튼 2개
    - "주문하기" 버튼 (다크 테두리)
    - "관리자" 버튼 (다크 테두리, 현재 활성화된 화면임을 표시하는 스타일)

#### 5.1.2 관리자 대시보드 섹션
- **위치**: 헤더 하단
- **제목**: "관리자 대시보드"
- **구성 요소**: 주문 통계 요약 정보
  - **총 주문**: 전체 주문 건수
  - **주문 접수**: 접수된 주문 건수
  - **제조 중**: 현재 제조 중인 주문 건수
  - **제조 완료**: 제조가 완료된 주문 건수
  - 표시 형식: "총 주문 1 / 주문 접수 1 / 제조 중 0 / 제조 완료 0"

#### 5.1.3 재고 현황 섹션
- **위치**: 관리자 대시보드 섹션 하단
- **제목**: "재고 현황"
- **레이아웃**: 메뉴별 재고 카드들이 가로로 배치
- **재고 카드 구성 요소**:
  - **메뉴명**: 메뉴 이름 표시 (예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼")
  - **재고 수량**: 현재 재고 수량 표시 (예: "10개")
  - **재고 조정 버튼**:
    - "+" 버튼: 재고 증가 (작은 사각형 버튼)
    - "-" 버튼: 재고 감소 (작은 사각형 버튼)

#### 5.1.4 주문 현황 섹션
- **위치**: 화면 하단
- **제목**: "주문 현황"
- **구성 요소**: 주문 목록 표시
  - **주문 아이템 카드**:
    - **주문 시간**: 주문 일시 표시 (예: "7월 31일 13:00")
    - **주문 내역**: 메뉴명과 수량 표시 (예: "아메리카노(ICE) x 1")
    - **주문 금액**: 주문 가격 표시 (예: "4,000원")
    - **"주문 접수" 버튼**: 주문을 접수하여 제조 프로세스에 진입시키는 버튼
  - 주문 목록은 최신 주문이 상단에 표시되도록 정렬

### 5.2 기능 요구사항

#### 5.2.1 대시보드 통계 기능
- **실시간 통계 업데이트**:
  - 서버에서 주문 상태별 통계를 조회하여 표시
  - 주문 상태가 변경될 때마다 통계 자동 업데이트
- **통계 항목**:
  - 총 주문: 모든 상태의 주문 합계
  - 주문 접수: "접수됨" 상태의 주문 수
  - 제조 중: "제조 중" 상태의 주문 수
  - 제조 완료: "제조 완료" 상태의 주문 수

#### 5.2.2 재고 관리 기능
- **재고 조회**:
  - 서버에서 각 메뉴별 현재 재고 수량을 조회하여 표시
  - 모든 메뉴의 재고 정보를 카드 형태로 표시
- **재고 증가 기능**:
  - "+" 버튼 클릭 시 해당 메뉴의 재고 수량 1 증가
  - 변경된 재고 수량을 서버에 저장
  - 화면에 즉시 반영
- **재고 감소 기능**:
  - "-" 버튼 클릭 시 해당 메뉴의 재고 수량 1 감소
  - 재고가 0 이하로 내려가지 않도록 제한 (선택 사항)
  - 변경된 재고 수량을 서버에 저장
  - 화면에 즉시 반영

#### 5.2.3 주문 현황 관리 기능
- **주문 목록 표시**:
  - 서버에서 주문 목록을 조회하여 표시
  - 주문 상태가 "대기 중" 또는 "접수됨"인 주문을 우선 표시
  - 각 주문 카드에 주문 시간, 메뉴 정보, 수량, 금액 표시
- **주문 접수 기능**:
  - "주문 접수" 버튼 클릭 시:
    - 해당 주문의 상태를 "접수됨" 또는 "제조 중"으로 변경
    - 서버에 주문 상태 업데이트 요청
    - 대시보드 통계 자동 업데이트
    - 주문 현황 목록에서 해당 주문의 상태 표시 변경
- **주문 상태 표시**:
  - 각 주문의 현재 상태를 시각적으로 구분하여 표시 (선택 사항)
  - 주문 상태에 따라 다른 액션 버튼 표시 가능 (예: "제조 완료" 버튼)

#### 5.2.4 네비게이션 기능
- 헤더의 "주문하기" 버튼: 주문하기 화면으로 이동
- 헤더의 "관리자" 버튼: 관리자 화면으로 이동 (현재 화면이면 활성화 상태 표시)

### 5.3 사용자 플로우

1. 관리자가 관리자 화면에 진입
2. 대시보드에서 전체 주문 통계 확인
3. 재고 현황 섹션에서 각 메뉴의 재고 수량 확인
4. 필요시 "+" 또는 "-" 버튼으로 재고 수량 조정
5. 주문 현황 섹션에서 대기 중인 주문 확인
6. "주문 접수" 버튼 클릭하여 주문을 접수하고 제조 프로세스 시작
7. 주문 상태 변경에 따라 대시보드 통계 자동 업데이트 확인

### 5.4 데이터 구조

#### 5.4.1 대시보드 통계 데이터
```javascript
{
  totalOrders: number,      // 총 주문 수
  receivedOrders: number,   // 주문 접수 수
  inProgressOrders: number, // 제조 중 주문 수
  completedOrders: number  // 제조 완료 주문 수
}
```

#### 5.4.2 재고 데이터
```javascript
{
  menuId: number,           // 메뉴 ID
  menuName: string,         // 메뉴명
  stock: number             // 현재 재고 수량
}
```

#### 5.4.3 재고 업데이트 요청 데이터
```javascript
{
  menuId: number,           // 메뉴 ID
  change: number            // 변경량 (+1 또는 -1)
}
```

#### 5.4.4 주문 현황 데이터
```javascript
{
  orderId: number,          // 주문 ID
  orderTime: string,         // 주문 시간 (예: "7월 31일 13:00")
  items: [
    {
      menuId: number,
      menuName: string,
      quantity: number,
      price: number
    }
  ],
  totalAmount: number,       // 총 주문 금액
  status: string            // 주문 상태 ("대기 중", "접수됨", "제조 중", "제조 완료")
}
```

#### 5.4.5 주문 상태 업데이트 요청 데이터
```javascript
{
  orderId: number,          // 주문 ID
  status: string           // 변경할 주문 상태 ("접수됨", "제조 중", "제조 완료")
}
```

## 6. 백엔드 개발 명세

### 6.1 데이터 모델

#### 6.1.1 Menus (메뉴)
메뉴 정보를 저장하는 테이블

**필드 구성**:
- `id` (number, Primary Key): 메뉴 고유 ID
- `name` (string): 커피 이름 (예: "아메리카노(ICE)", "카페라떼")
- `description` (string): 메뉴 설명
- `price` (number): 가격 (원 단위)
- `imageUrl` (string): 이미지 URL
- `stock` (number): 재고 수량

**제약 조건**:
- `name`, `price`, `stock`은 필수 필드
- `price`는 0 이상의 정수
- `stock`은 0 이상의 정수

#### 6.1.2 Options (옵션)
메뉴 옵션 정보를 저장하는 테이블

**필드 구성**:
- `id` (number, Primary Key): 옵션 고유 ID
- `name` (string): 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price` (number): 옵션 가격 (원 단위, 0 이상)
- `menuId` (number, Foreign Key): 연결할 메뉴 ID (Menus 테이블 참조)

**제약 조건**:
- `name`, `price`, `menuId`는 필수 필드
- `price`는 0 이상의 정수
- `menuId`는 Menus 테이블의 존재하는 ID여야 함

#### 6.1.3 Orders (주문)
주문 정보를 저장하는 테이블

**필드 구성**:
- `id` (number, Primary Key): 주문 고유 ID
- `orderTime` (datetime): 주문일시
- `status` (string): 주문 상태 ("주문 접수", "제조 중", "완료")
- `totalAmount` (number): 총 주문 금액 (원 단위)

**제약 조건**:
- `orderTime`, `status`, `totalAmount`는 필수 필드
- `status`는 "주문 접수", "제조 중", "완료" 중 하나여야 함
- `totalAmount`는 0 이상의 정수
- 기본 상태는 "주문 접수"

#### 6.1.4 OrderItems (주문 상세)
주문 내역 상세 정보를 저장하는 테이블 (Orders와 1:N 관계)

**필드 구성**:
- `id` (number, Primary Key): 주문 상세 고유 ID
- `orderId` (number, Foreign Key): 주문 ID (Orders 테이블 참조)
- `menuId` (number, Foreign Key): 메뉴 ID (Menus 테이블 참조)
- `menuName` (string): 메뉴 이름 (주문 시점의 메뉴명 저장)
- `quantity` (number): 수량
- `options` (json/string): 선택된 옵션 정보 (JSON 형태로 저장)
- `itemPrice` (number): 해당 아이템의 가격 (메뉴 가격 + 옵션 가격)

**제약 조건**:
- 모든 필드는 필수 필드
- `quantity`는 1 이상의 정수
- `itemPrice`는 0 이상의 정수
- `orderId`는 Orders 테이블의 존재하는 ID여야 함
- `menuId`는 Menus 테이블의 존재하는 ID여야 함

### 6.2 데이터 스키마를 위한 사용자 흐름

#### 6.2.1 메뉴 조회 및 표시 흐름
1. **프론트엔드 요청**: 주문하기 화면 진입 시 메뉴 목록 조회 API 호출
2. **백엔드 처리**: 
   - Menus 테이블에서 모든 메뉴 정보 조회
   - 각 메뉴에 연결된 Options 정보 조회 (JOIN 또는 별도 쿼리)
   - 재고 수량(`stock`) 정보는 포함하되, 프론트엔드에서 일반 사용자 화면에는 표시하지 않음
3. **응답 데이터**: 메뉴 목록과 옵션 정보를 JSON 형태로 반환
4. **프론트엔드 표시**: 
   - 일반 사용자 화면: 메뉴명, 설명, 가격, 이미지만 표시
   - 관리자 화면: 재고 수량도 함께 표시

#### 6.2.2 장바구니 및 주문 생성 흐름
1. **사용자 액션**: 사용자가 메뉴 선택 후 "담기" 버튼 클릭
2. **프론트엔드 처리**: 
   - 선택된 메뉴, 옵션, 수량 정보를 장바구니에 추가 (로컬 상태 관리)
   - 장바구니 화면에 표시
3. **주문 요청**: 사용자가 "주문하기" 버튼 클릭
4. **백엔드 처리**:
   - Orders 테이블에 주문 레코드 생성
     - `orderTime`: 현재 시간
     - `status`: "주문 접수" (기본값)
     - `totalAmount`: 주문 총액 계산
   - OrderItems 테이블에 주문 상세 레코드 생성 (주문 내 각 메뉴별로)
     - `orderId`: 생성된 주문 ID
     - `menuId`: 메뉴 ID
     - `menuName`: 메뉴명
     - `quantity`: 수량
     - `options`: 선택된 옵션 정보 (JSON)
     - `itemPrice`: 아이템 가격
   - Menus 테이블의 재고 수량 업데이트
     - 주문된 각 메뉴의 `stock`에서 주문 수량만큼 차감
     - 재고가 부족한 경우 에러 반환 (선택 사항)
5. **응답**: 생성된 주문 ID와 주문 정보 반환
6. **프론트엔드 처리**: 장바구니 초기화 및 주문 완료 메시지 표시

#### 6.2.3 주문 현황 조회 및 상태 변경 흐름
1. **관리자 화면 진입**: 관리자가 관리자 화면 접근
2. **주문 목록 조회**:
   - Orders 테이블에서 모든 주문 조회 (최신순 정렬)
   - 각 주문의 OrderItems 조회
   - 주문 상태별 통계 계산
3. **주문 현황 표시**: 
   - 주문 시간, 주문 내역(메뉴, 수량, 옵션), 금액 표시
   - 각 주문의 현재 상태 표시
4. **주문 상태 변경**:
   - 관리자가 "주문 접수" 버튼 클릭
   - 백엔드에서 Orders 테이블의 `status` 필드 업데이트
   - 상태 변경 순서: "주문 접수" → "제조 중" → "완료"
   - 각 상태 변경 시 해당 상태로 업데이트
5. **통계 업데이트**: 주문 상태 변경 시 대시보드 통계 자동 업데이트

### 6.3 API 설계

#### 6.3.1 메뉴 목록 조회 API

**엔드포인트**: `GET /api/menus`

**설명**: 주문하기 화면 진입 시 커피 목록을 데이터베이스에서 불러와서 보여주는 API

**요청**:
- 파라미터: 없음
- 헤더: 없음 (인증 제외)

**응답**:
```javascript
{
  success: boolean,
  data: [
    {
      id: number,
      name: string,
      description: string,
      price: number,
      imageUrl: string,
      stock: number,        // 관리자 화면에서만 사용
      options: [            // 해당 메뉴에 연결된 옵션 목록
        {
          id: number,
          name: string,
          price: number
        }
      ]
    }
  ]
}
```

**에러 응답**:
```javascript
{
  success: false,
  error: string
}
```

#### 6.3.2 주문 생성 API

**엔드포인트**: `POST /api/orders`

**설명**: 사용자가 주문하기 버튼을 누르면 주문 정보를 데이터베이스에 저장하고, 주문 정보에 따라 메뉴 목록의 재고도 수정하는 API

**요청 본문**:
```javascript
{
  items: [
    {
      menuId: number,
      menuName: string,
      quantity: number,
      options: {
        addShot: boolean,    // 또는 옵션 ID 배열
        addSyrup: boolean
      },
      itemPrice: number      // (메뉴 가격 + 옵션 가격) * 수량
    }
  ],
  totalAmount: number
}
```

**응답**:
```javascript
{
  success: boolean,
  data: {
    orderId: number,
    orderTime: string,
    status: string,
    totalAmount: number,
    items: [
      {
        menuId: number,
        menuName: string,
        quantity: number,
        options: object,
        itemPrice: number
      }
    ]
  }
}
```

**처리 로직**:
1. Orders 테이블에 주문 레코드 생성
2. OrderItems 테이블에 주문 상세 레코드 생성 (각 아이템별로)
3. Menus 테이블의 재고 수량 업데이트 (주문 수량만큼 차감)
4. 재고 부족 시 에러 반환 (선택 사항)

**에러 응답**:
```javascript
{
  success: false,
  error: string  // 예: "재고가 부족합니다", "주문 정보가 올바르지 않습니다"
}
```

#### 6.3.3 주문 정보 조회 API

**엔드포인트**: `GET /api/orders/:orderId`

**설명**: 주문 ID를 전달하면 해당 주문 정보를 보여주는 API

**요청**:
- 경로 파라미터: `orderId` (number)

**응답**:
```javascript
{
  success: boolean,
  data: {
    id: number,
    orderTime: string,
    status: string,
    totalAmount: number,
    items: [
      {
        id: number,
        menuId: number,
        menuName: string,
        quantity: number,
        options: object,
        itemPrice: number
      }
    ]
  }
}
```

**에러 응답**:
```javascript
{
  success: false,
  error: string  // 예: "주문을 찾을 수 없습니다"
}
```

#### 6.3.4 주문 목록 조회 API

**엔드포인트**: `GET /api/orders`

**설명**: 관리자 화면의 주문 현황에 표시할 주문 목록을 조회하는 API

**요청**:
- 쿼리 파라미터 (선택):
  - `status` (string): 주문 상태 필터링 ("주문 접수", "제조 중", "완료")
  - `limit` (number): 조회할 주문 수 제한
  - `offset` (number): 페이지네이션 오프셋

**응답**:
```javascript
{
  success: boolean,
  data: [
    {
      id: number,
      orderTime: string,
      status: string,
      totalAmount: number,
      items: [
        {
          menuId: number,
          menuName: string,
          quantity: number,
          options: object,
          itemPrice: number
        }
      ]
    }
  ],
  total: number  // 전체 주문 수
}
```

#### 6.3.5 주문 상태 업데이트 API

**엔드포인트**: `PATCH /api/orders/:orderId/status`

**설명**: 주문 상태를 변경하는 API ("주문 접수" → "제조 중" → "완료")

**요청 본문**:
```javascript
{
  status: string  // "주문 접수", "제조 중", "완료"
}
```

**응답**:
```javascript
{
  success: boolean,
  data: {
    id: number,
    orderTime: string,
    status: string,
    totalAmount: number
  }
}
```

**에러 응답**:
```javascript
{
  success: false,
  error: string  // 예: "유효하지 않은 상태입니다", "주문을 찾을 수 없습니다"
}
```

#### 6.3.6 주문 통계 조회 API

**엔드포인트**: `GET /api/orders/statistics`

**설명**: 관리자 대시보드에 표시할 주문 통계를 조회하는 API

**요청**: 없음

**응답**:
```javascript
{
  success: boolean,
  data: {
    totalOrders: number,      // 총 주문 수
    receivedOrders: number,   // 주문 접수 수
    inProgressOrders: number, // 제조 중 주문 수
    completedOrders: number   // 제조 완료 주문 수
  }
}
```

#### 6.3.7 재고 조회 API

**엔드포인트**: `GET /api/menus/stock`

**설명**: 관리자 화면의 재고 현황에 표시할 메뉴별 재고 정보를 조회하는 API

**요청**: 없음

**응답**:
```javascript
{
  success: boolean,
  data: [
    {
      menuId: number,
      menuName: string,
      stock: number
    }
  ]
}
```

#### 6.3.8 재고 업데이트 API

**엔드포인트**: `PATCH /api/menus/:menuId/stock`

**설명**: 관리자가 재고를 수동으로 조정하는 API

**요청 본문**:
```javascript
{
  change: number  // 변경량 (+1 또는 -1, 또는 절대값)
}
```

**또는**:
```javascript
{
  stock: number   // 새로운 재고 수량 (절대값)
}
```

**응답**:
```javascript
{
  success: boolean,
  data: {
    menuId: number,
    menuName: string,
    stock: number
  }
}
```

**에러 응답**:
```javascript
{
  success: false,
  error: string  // 예: "재고는 0 이상이어야 합니다", "메뉴를 찾을 수 없습니다"
}
```

### 6.4 데이터베이스 스키마 예시

#### 6.4.1 PostgreSQL DDL 예시

```sql
-- Menus 테이블
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  image_url VARCHAR(500),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders 테이블
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT '주문 접수' CHECK (status IN ('주문 접수', '제조 중', '완료')),
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderItems 테이블
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_id INTEGER NOT NULL REFERENCES menus(id),
  menu_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  options JSONB,
  item_price INTEGER NOT NULL CHECK (item_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_options_menu_id ON options(menu_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_time ON orders(order_time DESC);
```

### 6.5 에러 처리

#### 6.5.1 공통 에러 응답 형식
모든 API는 일관된 에러 응답 형식을 사용합니다:

```javascript
{
  success: false,
  error: string,           // 에러 메시지
  code?: string            // 에러 코드 (선택 사항)
}
```

#### 6.5.2 주요 에러 케이스
- **400 Bad Request**: 잘못된 요청 데이터
- **404 Not Found**: 리소스를 찾을 수 없음 (주문, 메뉴 등)
- **409 Conflict**: 재고 부족 등 비즈니스 로직 위반
- **500 Internal Server Error**: 서버 내부 오류

### 6.6 보안 고려사항

- 입력 데이터 검증 (SQL Injection 방지)
- CORS 설정 (프론트엔드 도메인만 허용)
- 요청 크기 제한 (Rate Limiting, 선택 사항)
- 데이터베이스 연결 풀 관리