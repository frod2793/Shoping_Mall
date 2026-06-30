# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shopping-flow.spec.ts >> Shopping & Checkout Flow E2E Tests >> should run full shopping, cart, checkout, mock payment, success, and order history flow
- Location: e2e/shopping-flow.spec.ts:9:9

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Shopingmall/i
Received string:  "vitamin"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × unexpected value "vitamin"

```

```yaml
- banner:
  - link "VITAMIN":
    - /url: /
  - navigation:
    - link "주문조회":
      - /url: /orders/history
    - link "장바구니":
      - /url: /cart
- main:
  - text: HANDMADE COLLECTION
  - heading "?쇱긽??諛섏쭩?꾩쓣 ?뷀븯?? ?몃뱶硫붿씠??媛먯꽦 ?뚰뭹" [level=1]
  - paragraph: "?ㅻ?議곕? ?뺤꽦?ㅻ젅 ??뼱???ㅼ콈濡쒖슫 鍮꾩쫰?\x80 ?곷”???꾪겕由??ㅻ쭅??留뚮굹蹂댁꽭?? ?뚯냼???쇱긽???뚯??덈뱾???곕쑜?섍퀬 ?꾧린?먭린???됰났???낇? ?쒕┰?덈떎."
  - link "異붿쿇 ?곹뭹 援ш꼍?섍린":
    - /url: "#product-list"
  - img "Handmade beads keyrings collection"
  - button "🛍️ 전체 보기"
  - button "🌸 아크릴 키링"
  - button "✨ 비즈 스트랩"
  - button "💍 실버 액세서리"
  - button "🎀 스마트톡"
  - button "🧸 오브제/팬시"
  - heading "추천 감성 소품" [level=2]
  - link "BEST 밤하늘 별무리 야광 아크릴 키링 아크릴 키링 밤하늘 별무리 야광 아크릴 키링 [코스믹 시리즈] 밤하늘 별무리 아크릴 키링은은한 야광 글리터 펄과 입체적인 달, 그리고 ... 9,500 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/d5481d93-bf60-45c0-8f2b-aeb2161e2f2c
    - text: BEST
    - img "밤하늘 별무리 야광 아크릴 키링"
    - text: 아크릴 키링
    - heading "밤하늘 별무리 야광 아크릴 키링" [level=3]
    - paragraph: "[코스믹 시리즈] 밤하늘 별무리 아크릴 키링은은한 야광 글리터 펄과 입체적인 달, 그리고 ..."
    - text: 9,500 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 파스텔 솜방망이 젤리캣 키링 아크릴 키링 파스텔 솜방망이 젤리캣 키링 [캣앤미 시리즈] 파스텔 젤리캣 키링귀여운 파스텔 톤 아기 고양이 일러스트가 프린팅된 이중... 7,900 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/26599879-6068-4ef4-bc6c-601a34460fa9
    - text: BEST
    - img "파스텔 솜방망이 젤리캣 키링"
    - text: 아크릴 키링
    - heading "파스텔 솜방망이 젤리캣 키링" [level=3]
    - paragraph: "[캣앤미 시리즈] 파스텔 젤리캣 키링귀여운 파스텔 톤 아기 고양이 일러스트가 프린팅된 이중..."
    - text: 7,900 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 파스텔 데이지 진주 비즈 폰스트랩 비즈 스트랩 파스텔 데이지 진주 비즈 폰스트랩 [핸드메이드] 파스텔 데이지 비즈 폰스트랩영롱한 파스텔톤 꽃 비즈와 담수진주를 오밀조밀하게... 8,500 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/ec73aaa2-795b-4760-bb7b-b5ebb15b6d7f
    - text: BEST
    - img "파스텔 데이지 진주 비즈 폰스트랩"
    - text: 비즈 스트랩
    - heading "파스텔 데이지 진주 비즈 폰스트랩" [level=3]
    - paragraph: "[핸드메이드] 파스텔 데이지 비즈 폰스트랩영롱한 파스텔톤 꽃 비즈와 담수진주를 오밀조밀하게..."
    - text: 8,500 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 솜사탕 체리 레인보우 비즈 스트랩 비즈 스트랩 솜사탕 체리 레인보우 비즈 스트랩 [핸드메이드] 솜사탕 체리 레인보우 비즈 스트랩달콤하고 상큼한 솜사탕 느낌의 파스텔 레인보... 9,800 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/8522954d-b3b2-4077-ad5d-a2064d526557
    - text: BEST
    - img "솜사탕 체리 레인보우 비즈 스트랩"
    - text: 비즈 스트랩
    - heading "솜사탕 체리 레인보우 비즈 스트랩" [level=3]
    - paragraph: "[핸드메이드] 솜사탕 체리 레인보우 비즈 스트랩달콤하고 상큼한 솜사탕 느낌의 파스텔 레인보..."
    - text: 9,800 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 클래식 천연 담수진주 폰스트랩 비즈 스트랩 클래식 천연 담수진주 폰스트랩 [핸드메이드] 클래식 천연 담수진주 폰스트랩울퉁불퉁 매력적인 천연 담수진주와 깔끔한 14K... 12,000 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/458e765c-2aa2-4378-b7dc-c51f7537310e
    - text: BEST
    - img "클래식 천연 담수진주 폰스트랩"
    - text: 비즈 스트랩
    - heading "클래식 천연 담수진주 폰스트랩" [level=3]
    - paragraph: "[핸드메이드] 클래식 천연 담수진주 폰스트랩울퉁불퉁 매력적인 천연 담수진주와 깔끔한 14K..."
    - text: 12,000 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 실버 925 미니 하트 펜던트 목걸이 실버 액세서리 실버 925 미니 하트 펜던트 목걸이 실버 925 미니 하트 펜던트 목걸이심플하고 모던한 하트 모양의 펜던트로 포인트를 준 세련... 24,000 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/35537fd8-7c74-44b8-9997-28a9992b65cc
    - text: BEST
    - img "실버 925 미니 하트 펜던트 목걸이"
    - text: 실버 액세서리
    - heading "실버 925 미니 하트 펜던트 목걸이" [level=3]
    - paragraph: 실버 925 미니 하트 펜던트 목걸이심플하고 모던한 하트 모양의 펜던트로 포인트를 준 세련...
    - text: 24,000 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 실버 925 레이어드 트위스트 실반지 실버 액세서리 실버 925 레이어드 트위스트 실반지 실버 925 레이어드 트위스트 반지부드럽게 꼬인 은실 디테일로 빛을 받을 때 은은하고 섬세... 18,000 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/add18081-6492-4414-be05-e19bcdbb2c8c
    - text: BEST
    - img "실버 925 레이어드 트위스트 실반지"
    - text: 실버 액세서리
    - heading "실버 925 레이어드 트위스트 실반지" [level=3]
    - paragraph: 실버 925 레이어드 트위스트 반지부드럽게 꼬인 은실 디테일로 빛을 받을 때 은은하고 섬세...
    - text: 18,000 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 미니 스타 원터치 링 귀걸이 실버 액세서리 미니 스타 원터치 링 귀걸이 [실버 925] 미니 스타 원터치 귀걸이착용이 간편한 원터치 실버 링에 앙증맞은 미니 스타... 15,500 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/3eef01fa-1c25-4de2-b6b1-44affa5112e2
    - text: BEST
    - img "미니 스타 원터치 링 귀걸이"
    - text: 실버 액세서리
    - heading "미니 스타 원터치 링 귀걸이" [level=3]
    - paragraph: "[실버 925] 미니 스타 원터치 귀걸이착용이 간편한 원터치 실버 링에 앙증맞은 미니 스타..."
    - text: 15,500 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 로맨틱 벨벳 리본 폰그립 스마트톡 감성 스마트톡 로맨틱 벨벳 리본 폰그립 스마트톡 로맨틱 벨벳 리본 폰그립 스마트톡포근하고 부드러운 고급 벨벳 리본 리 디자인에 클래식한 진... 11,000 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/72197668-5536-411a-9916-cfb2e5a77e2a
    - text: BEST
    - img "로맨틱 벨벳 리본 폰그립 스마트톡"
    - text: 감성 스마트톡
    - heading "로맨틱 벨벳 리본 폰그립 스마트톡" [level=3]
    - paragraph: 로맨틱 벨벳 리본 폰그립 스마트톡포근하고 부드러운 고급 벨벳 리본 리 디자인에 클래식한 진...
    - text: 11,000 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 오로라 클리어 하트 곰돌이 스마트톡 감성 스마트톡 오로라 클리어 하트 곰돌이 스마트톡 [오로라 펄] 클리어 곰돌이 스마트톡투명하고 맑은 하트를 껴안고 있는 입체 곰돌이 피규어 ... 9,900 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/a2059c93-22ae-47cd-9288-77752feb9488
    - text: BEST
    - img "오로라 클리어 하트 곰돌이 스마트톡"
    - text: 감성 스마트톡
    - heading "오로라 클리어 하트 곰돌이 스마트톡" [level=3]
    - paragraph: "[오로라 펄] 클리어 곰돌이 스마트톡투명하고 맑은 하트를 껴안고 있는 입체 곰돌이 피규어 ..."
    - text: 9,900 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 크림 버터 튤립 하트 에폭시 스마트톡 감성 스마트톡 크림 버터 튤립 하트 에폭시 스마트톡 크림 버터 튤립 하트 에폭시 스마트톡화사하고 따뜻한 버터 옐로우 컬러와 레트로 빈티지 튤립... 10,500 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/f3f7ba29-e86b-4936-8b48-a39e8d32e6f1
    - text: BEST
    - img "크림 버터 튤립 하트 에폭시 스마트톡"
    - text: 감성 스마트톡
    - heading "크림 버터 튤립 하트 에폭시 스마트톡" [level=3]
    - paragraph: 크림 버터 튤립 하트 에폭시 스마트톡화사하고 따뜻한 버터 옐로우 컬러와 레트로 빈티지 튤립...
    - text: 10,500 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 감성 일러스트 데코 엽서 5종 세트 오브제 팬시 감성 일러스트 데코 엽서 5종 세트 감성 일러스트 데코 엽서 5종 세트아늑하고 따뜻한 홈 카페 및 리빙 테마 수채화 일러스트를... 8,000 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/69f61ad3-8fc9-4b07-b0b6-bd2d53e2e688
    - text: BEST
    - img "감성 일러스트 데코 엽서 5종 세트"
    - text: 오브제 팬시
    - heading "감성 일러스트 데코 엽서 5종 세트" [level=3]
    - paragraph: 감성 일러스트 데코 엽서 5종 세트아늑하고 따뜻한 홈 카페 및 리빙 테마 수채화 일러스트를...
    - text: 8,000 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 빈티지 린넨 내추럴 패브릭 포스터 오브제 팬시 빈티지 린넨 내추럴 패브릭 포스터 빈티지 린넨 패브릭 포스터 [M]내추럴한 아이보리 린넨 패브릭 원단 위에 모던하고 내추럴한... 14,000 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/3ccfa23d-84b4-4113-9592-f5436f305ee0
    - text: BEST
    - img "빈티지 린넨 내추럴 패브릭 포스터"
    - text: 오브제 팬시
    - heading "빈티지 린넨 내추럴 패브릭 포스터" [level=3]
    - paragraph: 빈티지 린넨 패브릭 포스터 [M]내추럴한 아이보리 린넨 패브릭 원단 위에 모던하고 내추럴한...
    - text: 14,000 원 15% OFF ★ 4.9 (42) 무료배송 적립
  - link "BEST 톰과제리 스마일 에멘탈 치즈 캔들 오브제 팬시 톰과제리 스마일 에멘탈 치즈 캔들 천연 소이 왁스 치즈 캔들구멍이 숭숭 뚫린 노란 스마일 에멘탈 치즈 쉐입을 귀엽게 구현한 ... 6,900 원 15% OFF ★ 4.9 (42) 무료배송 적립":
    - /url: /products/5187811c-a442-4b87-9094-b094eeeb736d
    - text: BEST
    - img "톰과제리 스마일 에멘탈 치즈 캔들"
    - text: 오브제 팬시
    - heading "톰과제리 스마일 에멘탈 치즈 캔들" [level=3]
    - paragraph: 천연 소이 왁스 치즈 캔들구멍이 숭숭 뚫린 노란 스마일 에멘탈 치즈 쉐입을 귀엽게 구현한 ...
    - text: 6,900 원 15% OFF ★ 4.9 (42) 무료배송 적립
- alert
```

# Test source

```ts
  1   | /**
  2   |  * [기능]: 장바구니 및 비회원 결제, 주문 내역 조회 E2E 통합 테스트 시나리오
  3   |  * [작성자]: 윤승종
  4   |  */
  5   | import { test, expect } from '@playwright/test';
  6   | 
  7   | test.describe('Shopping & Checkout Flow E2E Tests', () =>
  8   | {
  9   |     test('should run full shopping, cart, checkout, mock payment, success, and order history flow', async ({ page }) =>
  10  |     {
  11  |         // 1. 일반 사용자 도메인 홈 접속
  12  |         await page.goto('http://localhost:3000/');
> 13  |         await expect(page).toHaveTitle(/Shopingmall/i);
      |                            ^ Error: expect(page).toHaveTitle(expected) failed
  14  | 
  15  |         // 첫 번째 상품 카드의 상세 보기 클릭
  16  |         const firstProductLink = page.locator('a[href^="/products/"]').first();
  17  |         await firstProductLink.click();
  18  | 
  19  |         // 2. 상품 상세 페이지 진입 확인
  20  |         await expect(page).toHaveURL(/\/products\//);
  21  | 
  22  |         // 옵션 선택 (첫 번째 select 박스가 있다면)
  23  |         const optionSelect = page.locator('select').first();
  24  |         if (await optionSelect.isVisible())
  25  |         {
  26  |             const options = await optionSelect.locator('option').all();
  27  |             if (options.length > 1)
  28  |             {
  29  |                 // 두 번째 옵션 선택 (첫 번째는 "선택해주세요" 임시 옵션)
  30  |                 const val = await options[1].getAttribute('value');
  31  |                 if (val != null)
  32  |                 {
  33  |                     await optionSelect.selectOption(val);
  34  |                 }
  35  |             }
  36  |         }
  37  | 
  38  |         // 장바구니 담기 클릭 (장바구니 담기 후 confirm 얼럿이 뜨므로 이를 핸들링)
  39  |         page.once('dialog', async (dialog) =>
  40  |         {
  41  |             expect(dialog.message()).toContain('상품이 장바구니에 담겼습니다');
  42  |             await dialog.accept(); // 장바구니로 이동 동의
  43  |         });
  44  | 
  45  |         // 장바구니 아이콘 버튼 (svg가 들어있는) 클릭
  46  |         const cartButton = page.locator('button[aria-label="장바구니 담기"]').first();
  47  |         await cartButton.click();
  48  | 
  49  |         // 3. 장바구니 페이지(`/cart`)로 정상 이동했는지 검증
  50  |         await page.waitForURL('**/cart');
  51  |         await expect(page.locator('h1')).toContainText('장바구니');
  52  | 
  53  |         // 수량 증가 버튼 클릭 (수량 인풋은 readonly text 타입)
  54  |         const initialQuantityText = await page.locator('input[readonly]').first().inputValue();
  55  |         const initialQuantity = parseInt(initialQuantityText, 10);
  56  |         
  57  |         // 수량 증가 (+) 버튼
  58  |         const quantityIncreaseBtn = page.locator('button:has-text("+")').first();
  59  |         await quantityIncreaseBtn.click();
  60  | 
  61  |         // 수량 증가 갱신 대기 및 확인
  62  |         const updatedQuantityText = await page.locator('input[readonly]').first().inputValue();
  63  |         expect(parseInt(updatedQuantityText, 10)).toBe(initialQuantity + 1);
  64  | 
  65  |         // 주문서 작성 페이지로 이동
  66  |         const checkoutBtn = page.locator('button:has-text("상품 구매하기")').first();
  67  |         await checkoutBtn.click();
  68  | 
  69  |         // 4. 주문서 작성 페이지(`/orders/checkout`)
  70  |         await page.waitForURL('**/orders/checkout');
  71  |         await expect(page.locator('h2:has-text("비회원 구매자 정보")')).toBeVisible();
  72  | 
  73  |         // 경고창(Alert) 발생 시 내용을 가로채기 위해 리스너 바인딩
  74  |         page.on('dialog', async (dialog) =>
  75  |         {
  76  |             console.log(`[E2E DIALOG ALERT]: ${dialog.message()}`);
  77  |             await dialog.accept();
  78  |         });
  79  | 
  80  |         // 주문자 정보 기입
  81  |         await page.fill('input[placeholder="주문자 이름을 입력하십시오."]', '홍길동');
  82  |         await page.fill('input[id="nonMemberPhone"]', '010-1234-5678');
  83  |         await page.fill('input[placeholder="주문 조회용 임시 비밀번호"]', '1234');
  84  | 
  85  |         // '주문자와 동일' 체크박스 동작 검증 (체크박스를 먼저 채워 수령인 폼을 동기화시킵니다)
  86  |         const sameAsOrdererCheckbox = page.locator('input[type="checkbox"]').first();
  87  |         await sameAsOrdererCheckbox.check();
  88  | 
  89  |         // 수령인 필드가 주문자 필드('홍길동')와 실시간 동기화되었는지 확인
  90  |         const shippingNameValue = await page.inputValue('input[placeholder="받으실 분의 이름을 입력하십시오."]');
  91  |         expect(shippingNameValue).toBe('홍길동');
  92  | 
  93  |         // 배송지 주소 기입 (리렌더링 후 안전하게 입력)
  94  |         await page.fill('input[placeholder="상세 주소를 입력하십시오."]', '서울시 강남구 테헤란로 123');
  95  | 
  96  |         // 결제하기 버튼 클릭
  97  |         const payBtn = page.locator('button:has-text("결제하기")').first();
  98  |         await payBtn.click();
  99  | 
  100 |         // 5. 가상 결제창(Mock PG Modal) 등장 검증
  101 |         const pgModal = page.locator('div:has-text("가상 PG 결제")').first();
  102 |         await expect(pgModal).toBeVisible();
  103 | 
  104 |         // 가짜 카드번호(16자리) 및 비밀번호(2자리) 입력 (ID 기반 선택자 활용)
  105 |         await page.fill('#cardNumber', '1234567812345678');
  106 |         await page.fill('#cardPassword', '99');
  107 | 
  108 |         // 결제 승인 클릭
  109 |         const approveBtn = page.locator('button:has-text("결제 승인")').first();
  110 |         await approveBtn.click();
  111 | 
  112 |         // 6. 성공 페이지(`/orders/success?orderId=...`) 정상 이동 확인
  113 |         await page.waitForURL('**/orders/success*');
```