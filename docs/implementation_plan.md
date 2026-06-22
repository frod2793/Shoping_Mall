# 쇼핑몰 Phase 4 구현 계획서 (Implementation Plan)

**Goal:** 
주문서 작성의 편의성을 높이기 위한 '주문자와 동일' 기능과 주문 완료 후의 배송지 2차 확인 정보를 강화합니다. 나아가 회원 및 비회원이 모두 사용할 수 있는 장바구니(Cart) 시스템과 주문 내역 조회(Order History) 시스템을 완벽하게 구축하여 이커머스의 핵심 동선을 완성합니다.

**Architecture:**
* **장바구니(Cart)**: 비회원을 자연스럽게 지원하고 로그인 세션 유무에 따른 전환 오버헤드를 낮추기 위해 브라우저 로컬 스토리지(`cart_items`)를 주 데이터 보관소로 활용합니다. 상품 상세 페이지에서 장바구니에 적재하고, 장바구니 화면(`/cart`)에서 수량 조절 및 개별/선택 삭제를 제어하며, 선택된 품목들을 주문서 작성(`/orders/checkout`) 단계로 안전하게 전달(복수 품목 주문 지원)합니다.
* **주문 내역(Order History)**: 
  * 회원은 현재 로그인 유저 식별자(`userId`)를 기준으로 DB에서 주문 내역을 직접 조회합니다.
  * 비회원은 주문서 작성 시 기입한 **주문자명, 연락처, 주문번호 조회 비밀번호**를 인증 폼에 입력받아 데이터베이스의 암호화된 주문자 데이터와 실시간 매칭 검증 후, 해당 주문자 정보와 일치하는 주문 내역 리스트를 노출합니다.

---

## User Review Required

> [!IMPORTANT]
> - **복수 품목 주문 대응**: 기존 `checkout_item` (단일 품목 직렬화) 형태를 `checkout_items` (배열 형태)로 확장하여 장바구니에서 여러 상품을 일괄 선택해 결제할 수 있도록 백엔드 API 및 프론트엔드 주문 데이터를 보완합니다.
> - **비회원 비밀번호 대조 검증**: 비회원이 자신의 주문 내역을 조회할 때, 비밀번호 대조를 위해 기존 `OrderService`에 구축된 단방향 암호화 해시 비교를 엄격히 수행합니다.
> - **로컬 스토리지 장바구니 통합**: 회원/비회원 구분 없이 브라우저 로컬 스토리지를 이용해 가볍고 빠른 장바구니 처리를 지원하며, 회원인 경우 향후 서버 연동 확장성을 고려한 구조로 작성합니다.

---

## Proposed Changes

### Task 6: 주문서 편의 기능 보완 및 주문 완료 페이지 2차 확인 강화

**Files:**
- Modify: `/src/app/orders/checkout/page.tsx`
- Modify: `/src/app/orders/success/page.tsx`

- [ ] **Step 1: '주문자와 동일' 체크박스 UI 및 동기화 바인딩**
  - Modify: `/src/app/orders/checkout/page.tsx`
  - Content: 
    - 배송지 정보 헤더 옆에 `[ ] 주문자와 동일` 체크박스를 추가합니다.
    - 체크박스 클릭 시 주문자 정보(이름, 연락처) 데이터를 배송 수령인 정보(이름, 연락처) 상태 필드에 실시간 동기화 복사합니다.
    - 주문자 정보가 수정될 때 동일 체크박스가 활성화된 상태라면 수령인 정보도 실시간으로 연동되어 변경되도록 바인딩합니다.
- [ ] **Step 2: 주문 완료 영수증 화면 내 2차 배송 주소 확인 및 정보 강화**
  - Modify: `/src/app/orders/success/page.tsx`
  - Content: 
    - 주문자 정보(주문자명, 연락처) 및 배송지 상세 정보(받는 사람, 주소, 연락처, 배송 메모)가 영수증 카드 영역에 한눈에 들어오는 가독성 높은 표로 출력되도록 레이아웃을 전면 개편합니다.
    - 사용자가 주문 후 본인이 기입한 정보를 2차 검증(오입력 여부 확인)하기 용이하게 시각적 강조 표시를 배치합니다.

---

### Task 7: 장바구니(Cart) 기능 구현 (회원/비회원 공통)

**Files:**
- Modify: `/src/app/products/[id]/ProductDetailClient.tsx` (장바구니 담기 버튼 탑재)
- Create: `/src/app/cart/page.tsx`
- Create: `/src/app/cart/cart.module.css`
- Modify: `/src/app/layout.tsx` (네비게이션 헤더 내 장바구니 카운트 표시 배지 바인딩)

- [ ] **Step 1: 상품 상세 페이지 내 '장바구니 담기' 기능 추가**
  - Modify: `/src/app/products/[id]/ProductDetailClient.tsx`
  - Content: 
    - 바로 구매하기 버튼 옆에 '장바구니 담기' 버튼을 배치합니다.
    - 클릭 시 로컬 스토리지의 `cart_items` 배열에 { productId, productName, optionId, optionName, price, quantity, imageUrl } 형태로 보관합니다.
    - 동일한 상품 및 동일 옵션이 이미 장바구니에 존재하는 경우 수량만 가산하며, 담기 성공 시 '장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?' 확인 얼럿을 노출합니다.
- [ ] **Step 2: 장바구니 목록 페이지 (`/cart`) 개발**
  - Create: `/src/app/cart/page.tsx`
  - Content: 
    - 장바구니 목록 리스트 렌더링. 상품별 썸네일, 상품명, 선택 옵션 정보, 단가, 수량 변경 컨트롤러(증가/감소), 개별 삭제(X) 버튼 노출.
    - 전체 선택 / 선택 해제 체크박스 기능 구현.
    - 선택 품목들의 총 합계 금액, 최종 주문 금액 요약 정보 표시.
    - '선택 상품 주문하기' 클릭 시 선택된 품목들만 `checkout_items` 로컬 스토리지에 담아 `/orders/checkout` 페이지로 연동.
- [ ] **Step 3: 장바구니 Vanilla CSS 스타일링**
  - Create: `/src/app/cart/cart.module.css`
  - Content: 테이블 및 목록 그리드를 모바일/PC 반응형으로 프리미엄하게 연출하는 스타일시트 작성.
- [ ] **Step 4: 네비게이션 헤더 내 실시간 장바구니 아이템 개수 배지 추가**
  - Modify: `/src/app/layout.tsx` (또는 공통 헤더 컴포넌트)
  - Content: 우측 상단 네비게이션 영역에 장바구니 아이콘 및 현재 담긴 고유 아이템의 개수 배지(Badge) 노출 연동.

---

### Task 8: 주문 내역(Order History) 조회 기능 구현 (회원/비회원 공통)

**Files:**
- Create: `/src/app/orders/history/page.tsx`
- Create: `/src/app/orders/history/history.module.css`
- Create: `/src/app/api/orders/track/route.ts` (비회원 주문 조회 API 데몬)
- Modify: `/src/app/layout.tsx` (네비게이션 헤더 내 '주문 조회' 링크 연결)

- [ ] **Step 1: 비회원 주문조회 인증 API 구현**
  - Create: `/src/app/api/orders/track/route.ts`
  - Content: POST 요청으로 `nonMemberName`, `nonMemberPhone`, `nonMemberPassword`를 받아 DB 대조 작업을 거친 후 일치하는 주문들(`items` 관계 포함)을 안전하게 조회하여 리스트로 반환.
- [ ] **Step 2: 회원/비회원 통합 주문 내역 조회 페이지 UI 개발**
  - Create: `/src/app/orders/history/page.tsx`
  - Content:
    - **회원 로그인 시**: 세션 정보 기반으로 DB 주문 내역 즉시 로드하여 노출.
    - **비로그인(비회원) 시**: 비회원 주문 조회 인증 폼 노출 (이름, 연락처, 조회 비밀번호 기입란).
    - 인증 완료 시, 조회된 비회원 주문 목록 리스트 렌더링.
    - 각 주문 리스트 행에는 주문번호, 일시, 상품 요약, 결제총액, 배송 단계(`STATUS_MAP`) 표시 및 '상세보기 아코디언'을 통해 본인이 적은 수령인명, 주소, 배송 메모 및 세부 품목 2차 재확인 가능하도록 구현.
- [ ] **Step 3: 주문 내역 페이지 반응형 스타일링**
  - Create: `/src/app/orders/history/history.module.css`
  - Content: 깔끔한 입력 폼 및 시간순 정렬 카드/테이블 뷰 레이아웃 스타일시트 개발.

---

### Task 9: 전체 빌드 및 회귀 테스트 검증

- [ ] **Step 1: 단위 테스트 동작 체크**
  - CommandLine: `npx vitest run`
  - Expected: 100% PASS
- [ ] **Step 2: Next.js 프로덕션 컴파일 빌드**
  - CommandLine: `npm run build`
  - Expected: `Compiled successfully` 및 정적 파일 최적화 완료
- [ ] **Step 3: Git 최종 커밋 (한글 필수)**
  - CommandLine: `git add . && git commit -m "feat: 장바구니 및 회원/비회원 주문 내역 조회 기능 구현"`

---

### Task 10: 관리자 및 일반 사용자 도메인 격리 시스템 구축 (보안 강화)

**Files:**
- Modify: `/.env` (또는 신규 생성)
- Modify: `/src/middleware.ts` (도메인 감지 및 차단 로직 추가)
- Modify: `/src/app/components/Header.tsx` (일반 사용자 도메인 시 관리자 링크 비노출)

- [ ] **Step 1: 호스트 격리 환경 변수 바인딩**
  - Modify: `/.env`
  - Content:
    - 로컬 환경 테스트용 `CLIENT_HOST` 및 `ADMIN_HOST` 변수를 추가합니다.
    ```env
    CLIENT_HOST=localhost:3000
    ADMIN_HOST=admin.localhost:3000
    ```
- [ ] **Step 2: Next.js 미들웨어 도메인 기반 라우팅 가드 구축**
  - Modify: `/src/middleware.ts`
  - Content:
    - 요청의 `host` 헤더를 획득하여 `request.headers.get('host')` 값을 추출합니다.
    - 현재의 요청 호스트가 `process.env.ADMIN_HOST`가 아니며, 요청 경로가 `/admin` 또는 `/api/admin`으로 시작되는 관리자 경로인 경우, 세션 여부와 무관하게 즉시 `404 Not Found` 응답 또는 해당 페이지 차단 응답을 반환합니다.
    - Edge 런타임 환경에서 환경 변수 대조 작업이 안전하게 수행되도록 구현합니다.
- [ ] **Step 3: 공통 헤더 내 도메인 기반 관리자 메뉴 노출 격리**
  - Modify: `/src/app/components/Header.tsx`
  - Content:
    - 렌더링 시 `window.location.host`가 일반 사용자 도메인(`CLIENT_HOST`)과 같은 경우 헤더에서 **'관리자'** 바로가기 메뉴 자체를 노출하지 않고 보이지 않게 처리합니다.
    - 서버 사이드 렌더링(SSR) 및 클라이언트 마운트 시 하이드레이션(Hydration) 에러가 발생하지 않도록 `useEffect` 내부에서 도메인을 확인하고 렌더링 상태를 갱신하도록 설계합니다.
- [ ] **Step 4: 로컬 통합 검증**
  - CommandLine: `npm run build && npx vitest run`
  - Expected: 빌드 에러 없이 성공 및 기존 단위 테스트 통과.

---

### Task 11: E2E 기능 테스트 자동화 환경 및 시나리오 구축 (Playwright)

**Files:**
- Create: `/playwright.config.ts` (E2E 테스트 구동 설정)
- Create: `/e2e/shopping-flow.spec.ts` (장바구니/결제/주문내역 E2E 시나리오)
- Create: `/e2e/domain-isolation.spec.ts` (다중 도메인 차단 보안 시나리오)
- Modify: `/package.json` (Playwright 스크립트 추가)

- [ ] **Step 1: E2E 테스트 의존성 패키지 설치**
  - CommandLine: `npm install -D @playwright/test`
  - Expected: `@playwright/test` 패키지 설치 완료
- [ ] **Step 2: Playwright 다중 도메인 대응 환경 설정**
  - Create: `/playwright.config.ts`
  - Content:
    - `localhost:3000`을 베이스로 설정하되, 클라이언트와 어드민 다중 컨텍스트 호스트 검증이 가능하도록 브라우저 설정을 세팅합니다.
    - 로컬 가동 편의를 위해 `webServer` 옵션에 `npm run dev` 구동 스크립트를 연결하여 테스트 시작 시 자동으로 개발 서버를 초기 가동하도록 구성합니다.
- [ ] **Step 3: 장바구니/결제/주문내역 핵심 E2E 통합 시나리오 작성**
  - Create: `/e2e/shopping-flow.spec.ts`
  - Content:
    1. 일반 도메인(`http://localhost:3000`)에 접속하여 첫 번째 상품의 상세 페이지로 이동합니다.
    2. 옵션을 올바르게 선택한 뒤 '장바구니'에 담고, 장바구니 페이지(`/cart`)로 매끄럽게 라우팅되는지 검사합니다.
    3. 장바구니 내 수량 증가 컨트롤 및 실시간 가격 합계 갱신 여부를 브라우저 돔(DOM) 상에서 대조 검증합니다.
    4. 장바구니에서 '선택 주문하기'를 클릭하여 주문서(`/orders/checkout`)로 진입 후, 주문자 이름/연락처 기입 및 **'주문자와 동일'** 체크박스를 틱하여 수령인 폼으로 실시간 동기화되는지 인풋 필드 값을 테스트합니다.
    5. 결제 모달을 트리거하여 모의 카드 번호를 입력하고 '결제 승인'을 버튼 클릭하여 성공 화면(`/orders/success`)으로 리다이렉션 및 영수증 내역에 배송 주소지가 제대로 출력되는지 확인합니다.
    6. 주문 정보(주문자명, 연락처)를 기억해 `/orders/history`에서 비회원 주문 조회를 요청하고, 주문 상세 아코디언 카드가 잘 열려 배송 메모 등이 올바르게 확인되는지 체크합니다.
- [ ] **Step 4: 다중 도메인 격리 및 보안 가드 검증 시나리오 작성**
  - Create: `/e2e/domain-isolation.spec.ts`
  - Content:
    1. 일반 도메인 주소(`http://localhost:3000/admin`)로 관리자 하위 리소스 진입을 강제 시도하고, 응답 코드가 `404` 혹은 차단 페이지 화면이 나타나는지 헤더 타이틀 및 DOM 콘텐츠를 검증합니다.
    2. 어드민 전용 호스트(`http://admin.localhost:3000/admin`)로 진입을 시도하여, 404 차단 없이 정상적으로 `/admin/login` 화면으로 리다이렉션 처리되어 로그인 폼 입력 상자(이메일, 비밀번호)가 화면에 올바르게 노출되는지 검증합니다.
- [ ] **Step 5: package.json 실행 스크립트 매핑 및 테스트 구동 검증**
  - Modify: `/package.json`
  - Content: `"test:e2e": "playwright test"` 스크립트를 추가합니다.
  - CommandLine: `npx playwright install chromium && npm run test:e2e`
  - Expected: 모든 E2E 자동화 시나리오 통과 (All Tests Passed)

---

## Verification Plan

### Automated Tests
* Vitest 비즈니스 유효성 테스트 실행: `npx vitest run`
* 프로덕션 빌드 성공 여부 검사: `npm run build`
* Playwright E2E 통합 시나리오 및 보안 가드 검사: `npm run test:e2e`

### Manual Verification
1. **주문자와 동일 테스트**: `/orders/checkout`에서 주문자 이름 '홍길동' 기입 후 '주문자와 동일' 체크 시 수령인명도 실시간으로 '홍길동'으로 연동되는지 체크.
2. **장바구니 담기**: 상품 페이지에서 '장바구니 담기' 클릭 후 `/cart` 페이지로 이동해 물건 확인 및 수량 증가 조절 검증.
3. **장바구니 결제 연동**: 장바구니에서 여러 개의 상품(또는 옵션) 선택 후 결제하기 클릭 시, 주문서 화면에 복수 상품 내역이 바르게 연합하여 출력되는지 확인.
4. **2차 확인 영수증**: 결제 성공 후 `/orders/success` 영수증 카드에서 본인이 기입한 수령인 주소, 주문자 연락처 등이 올바르게 2차 노출되는지 정합성 체크.
5. **주문 내역(회원/비회원) 조회**: 로그아웃 상태에서 `/orders/history`로 접근해 비회원 조회 폼에 주문 당시 입력했던 정보 기입 시, 방금 전 구매한 주문 일자가 아코디언 상세 보기와 함께 출력되는지 최종 확인.
6. **클라이언트 도메인 관리자 차단 검증**: `http://localhost:3000/admin` 접속 시, 404 Not Found 응답이 표시되며 헤더 상단에 '관리자' 링크가 노출되지 않는 것을 검증.
7. **관리자 도메인 정상 인가 검증**: `http://admin.localhost:3000/admin` 접속 시, 정상적으로 어드민 로그인 페이지(`/admin/login`)로 진입하는지 확인.
8. **E2E 자동화 테스트 최종 통과 검증**: 로컬 CLI 상에서 `npm run test:e2e`를 기동하여 작성한 2가지 E2E 파일(쇼핑 통합 시나리오, 보안 격리 차단 시나리오)이 헤드리스 크롬 상에서 100% 통과하는지 확인.
