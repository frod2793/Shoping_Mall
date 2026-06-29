# Antigravity Rules - Web Shopping Mall Project

## 1. THOUGHT HANGULIZATION RULE (생각 한글화 규칙) - [절대 준수]
- **생각 프로세스 한글화 강제**: 에이전트는 내부 생각(Thought) 프로세스를 포함하여, 사용자에게 출력하지 않는 비가시 영역에서의 추론 및 상태 판단 시에도 반드시 한국어(Korean)로만 생각하고 작성해야 합니다.

---

## 2. CORE ARCHITECTURE RULES (핵심 아키텍처 규칙)

### 2.1. Clean Architecture & Layer Separation (클린 아키텍처 및 레이어 분리)
- **src/core**: Next.js 프레임워크나 외부 데이터베이스(Prisma)에 직접 의존하지 않는 순수 비즈니스 로직 및 도메인 모델, 서비스, 리포지토리 인터페이스를 배치합니다.
- **src/infrastructure**: core에 정의된 리포지토리 인터페이스를 Prisma(SQLite) Client를 활용하여 구현하고, 인증(NextAuth) 및 결제(Mock) 등의 외부 시스템 연동을 수행합니다.
- **src/app**: Next.js App Router 기반의 라우팅 구조(UI 페이지 및 API 엔드포인트)를 통해 클라이언트로 데이터를 배달하는 딜리버리 메커니즘을 담당합니다.

### 2.2. Domain Isolation & Domain Guard (도메인 격리 및 가드)
- **도메인 격리**: 일반 사용자용 `CLIENT_HOST`와 관리자용 `ADMIN_HOST`는 논리적으로 완벽히 분리되어 있어야 합니다.
- **미들웨어 가드**: Next.js Middleware에서 호스트 헤더를 실시간 대조하여, 일반 사용자 도메인으로 `/admin` 또는 `/api/admin` 하위 경로에 진입하려고 하면 세션 유무와 무관하게 즉시 `404 Not Found`를 리턴해야 합니다.

### 2.3. Frontend & Styling Rules (프론트엔드 및 스타일링)
- **Vanilla CSS**: 어설픈 Tailwind CSS의 인라인 사용을 금지하며, `src/styles`에 정의된 일관된 CSS 테마 및 디자인 시스템 토큰을 사용하여 Vanilla CSS로 스타일링을 구현합니다.
- **반응형 대응**: PC와 모바일 해상도 전환에 유연하게 대처할 수 있는 그리드/플렉스 레이아웃을 작성합니다.

### 2.4. Web Design Patterns for Home Shopping (홈쇼핑용 웹 디자인 패턴)
웹 쇼핑몰의 복잡한 로직을 해결하기 위해 다음 패턴을 활용하고, **싱글톤(Singleton)의 과도한 남용은 피하되 필요한 경우로 제한**합니다.
- **A. Creational (생성)**:
  - **Singleton Pattern**: Prisma Client 인스턴스가 런타임에 중복 생성되어 커넥션 풀을 초과하지 않도록, Next.js 글로벌 인스턴스 패턴을 적용하여 단 하나만 보관하고 재사용합니다.
  - **Builder Pattern**: 복잡한 주문 DTO(Order DTO), 결제 요청 객체를 안전하게 가공하고 생성하기 위해 빌더 디자인을 적극 활용합니다.
- **B. Structural (구조)**:
  - **Facade Pattern**: PG사 가상 결제 승인, 포인트 적립 처리, 이메일/알림톡 발송과 같이 서로 다른 외부 인프라 서브시스템들을 단일 진입점 메서드로 호출할 수 있는 통합 결제 퍼사드 서비스를 구축합니다.
  - **Adapter Pattern**: 상이한 PG사 SDK(토스페이먼츠, 포트원 등) 호출 규격을 동일한 결제 인터페이스로 변환하기 위해 어댑터 설계를 도입합니다.
- **C. Behavioral (행동)**:
  - **Strategy Pattern**: 등급별 할인율 적용, 정액/정률 쿠폰 할인, 선적 배송비 산정 등 유연하게 교체되어야 하는 홈쇼핑 할인 정책들을 별도의 전략 클래스로 분리하여 런타임에 동적으로 변경 적용합니다.
  - **Observer Pattern**: 결제가 성공하면 주문 상태를 업데이트하고, 상품 재고를 차감하며, 구매 완료 로그를 적재하는 등 연쇄적으로 발생하는 이벤트들을 구독/발행 구조로 비동기 실행 및 전파합니다.

---

## 3. CODING STANDARDS & SAFETY (코딩 표준 및 안전성)

### 3.1. Naming & Formatting (네이밍 및 포맷팅)
- **UI Event Callbacks**: UI 페이지나 컴포넌트 내에서 이벤트 핸들러(예: onClick, onSubmit 등)에 바인딩되는 메서드/함수명은 반드시 `func_` 접두사를 사용합니다. (예: `func_OnSubmit`, `func_HandleImageUpload`)
- **Brace & Indent**: 중괄호는 줄 바꿈 후 작성하는 Allman Style을 엄격히 준수하며, 들여쓰기는 4개의 공백(Space)을 사용하십시오.
- **중괄호 생략 금지**: 모든 `if`, `for`, `while` 문은 한 줄이더라도 중괄호를 반드시 포함해야 합니다.

### 3.2. C Drive Usage Constraint (C 드라이브 사용 제약)
- C 드라이브 사용을 금지하며, 작업 파일, 데이터베이스, 임시 데이터 등 모든 관련 작업은 D 드라이브를 우선하여 사용해야 합니다.
- 임시 작업 스크립트나 중간 결과 파일 또한 C 드라이브가 아닌 D 드라이브(예: `D:\fork\Shoping_Mall\.agents\scratch\` 등)에 저장하고 실행해야 합니다.

### 3.3. TypeScript Safety (TypeScript 안전성 규정)
- **Strict Null Checks**: `null` 또는 `undefined` 체크 시 널 병합 연산자(`??`), 옵셔널 체이닝(`?.`)을 안전하게 사용하고, 타입 단언(`!`)의 사용을 지양합니다.
- **Type Guard**: 복잡한 주문 DTO 데이터 수신이나 API 응답 분석 시 `typeof`, `instanceof` 또는 사용자 정의 타입 가드(Type Guard) 함수를 명시하여 런타임 예외를 사전에 완전 차단합니다.

### 3.4. Logging Rule (로그 작성 규칙)
- **한글 로그 강제**: `console.log` 또는 백엔드 로그 출력 시 클래스/모듈명을 명시하고 한글로 작성하십시오.
  - 예시: `console.log("[ProductService] 상품 정보가 정상적으로 로드되었습니다.");`

### 3.5. Documentation Standards (문서화 규칙)
모든 소스 코드 파일(TypeScript / React Component)의 클래스, 함수, 또는 모듈 최상단에 동작 설명과 작성/수정 이력을 포함하는 JSDoc / TSDoc 주석을 필수 작성합니다.
```typescript
/**
 * @description [기능]: 이 컴포넌트/함수가 수행하는 주요 역할에 대해 간략히 기술합니다.
 * @author 윤승종
 * @date YYYY-MM-DD
 * @lastModifier 윤승종
 * @lastModifiedDate YYYY-MM-DD
 * @history [수정 내용]: 구체적인 수정 사항 요약
 */
```
*(주의: 작성자 이름은 절대로 에이전트 이름이 될 수 없으며, 반드시 '윤승종'으로만 작성합니다.)*

---

## 4. PERFORMANCE OPTIMIZATION (성능 최적화)

- **React Render Optimization**: 대량의 상품 리스트 렌더링 시 React의 `useMemo` 및 `useCallback`을 적극 활용하여 불필요한 리렌더링 및 메모리 낭비를 제어합니다.
- **Browser Caching**: 이미지 동적 서빙 API 호출 시 브라우저 캐싱(`Cache-Control: public, max-age=31536000, immutable`)을 강제하여 데이터베이스의 부하를 원천 방지합니다.
- **Next.js Optimize**: 이미지 태그 사용 시 Next.js Image Component를 최대한 활용하여 레이아웃 시프트 및 리사이징을 방지합니다.

---

## 5. POST-IMPLEMENTATION GUIDE (코드 작성 완료 후 참조 안내)

코드 작성이 완료된 후 다음 사항을 필수 요약하여 안내합니다.
- **라우팅 경로 매핑 확인**: 신규 추가된 UI 페이지 경로 및 API 엔드포인트의 매핑 상태 요약.
- **Prisma 스키마 변경 필요 목록**: 데이터베이스 테이블 스키마에 추가/수정된 필드가 있어 `prisma db push` 또는 `prisma migrate`가 필요한 목록 명시.
- **웹 환경 변수(.env) 추가 변수 목록**: 작동에 필요한 환경 변수의 템플릿(Key명) 안내.
