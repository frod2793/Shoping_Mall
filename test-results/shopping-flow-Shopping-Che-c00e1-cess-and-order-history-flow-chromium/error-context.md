# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shopping-flow.spec.ts >> Shopping & Checkout Flow E2E Tests >> should run full shopping, cart, checkout, mock payment, success, and order history flow
- Location: e2e/shopping-flow.spec.ts:9:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/orders/success*" until "load"
  navigated to "http://localhost:3000/orders/checkout"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "SHOPPINGMALL" [ref=e4] [cursor=pointer]:
        - /url: /
      - navigation [ref=e5]:
        - link "주문 조회" [ref=e6] [cursor=pointer]:
          - /url: /orders/history
        - link "장바구니 1" [ref=e7] [cursor=pointer]:
          - /url: /cart
          - generic [ref=e8]: 장바구니
          - generic [ref=e9]: "1"
  - main [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - heading "주문 상품 정보" [level=2] [ref=e14]
          - generic [ref=e15]:
            - img "핸드메이드 아크릴 플라워 키링" [ref=e16]
            - generic [ref=e17]:
              - generic [ref=e18]: 핸드메이드 아크릴 플라워 키링
              - generic [ref=e19]: "선택 옵션 ID: 5f604547-4d6b-45fb-9de1-87041f4403da"
              - generic [ref=e20]: 8,900원 / 2개
        - generic [ref=e21]:
          - heading "비회원 구매자 정보" [level=2] [ref=e22]
          - generic [ref=e23]:
            - generic [ref=e24]: 주문자 이름
            - textbox "주문자 이름" [ref=e25]:
              - /placeholder: 주문자 이름을 입력하십시오.
          - generic [ref=e26]:
            - generic [ref=e27]: 연락처
            - textbox "연락처" [ref=e28]:
              - /placeholder: "예: 010-1234-5678"
          - generic [ref=e29]:
            - generic [ref=e30]: 주문번호 조회 비밀번호 (4자리 이상)
            - textbox "주문번호 조회 비밀번호 (4자리 이상)" [ref=e31]:
              - /placeholder: 주문 조회용 임시 비밀번호
        - generic [ref=e32]:
          - generic [ref=e33]:
            - heading "배송지 정보 입력" [level=2] [ref=e34]
            - generic [ref=e35] [cursor=pointer]:
              - checkbox "주문자와 동일" [ref=e36]
              - generic [ref=e37]: 주문자와 동일
          - generic [ref=e38]:
            - generic [ref=e39]: 수령인 이름
            - textbox "수령인 이름" [ref=e40]:
              - /placeholder: 받으실 분의 이름을 입력하십시오.
          - generic [ref=e41]:
            - generic [ref=e42]: 수령인 연락처
            - textbox "수령인 연락처" [ref=e43]:
              - /placeholder: "예: 010-1234-5678"
          - generic [ref=e44]:
            - generic [ref=e45]: 배송지 주소
            - textbox "배송지 주소" [ref=e46]:
              - /placeholder: 상세 주소를 입력하십시오.
          - generic [ref=e47]:
            - generic [ref=e48]: 배송 메모 (선택)
            - textbox "배송 메모 (선택)" [ref=e49]:
              - /placeholder: "예: 부재 시 문 앞에 놓아주세요."
      - generic [ref=e51]:
        - heading "최종 결제 금액" [level=2] [ref=e52]
        - generic [ref=e53]:
          - generic [ref=e54]: 총 주문 품목
          - generic [ref=e55]: 1종
        - generic [ref=e56]:
          - generic [ref=e57]: 합계 금액
          - generic [ref=e58]: 17,800원
        - generic [ref=e59]:
          - heading "결제 수단 선택" [level=3] [ref=e60]
          - generic [ref=e61] [cursor=pointer]:
            - radio "신용카드 (모의 가상 결제)" [checked] [ref=e62]
            - generic [ref=e63]: 신용카드 (모의 가상 결제)
        - button "17,800원 결제하기" [ref=e64] [cursor=pointer]
  - alert [ref=e65]
```

# Test source

```ts
  13  |         await expect(page).toHaveTitle(/Shopingmall/i);
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
> 113 |         await page.waitForURL('**/orders/success*');
      |                    ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  114 |         await expect(page.locator('h1')).toContainText('주문이 완료되었습니다');
  115 | 
  116 |         // 배송 정보 2차 재확인 영역 검증
  117 |         await expect(page.locator('div:has-text("배송지 주소")')).toContainText('서울시 강남구 테헤란로 123');
  118 |         await expect(page.locator('div:has-text("받는 사람")')).toContainText('홍길동');
  119 | 
  120 |         // 7. 주문 내역 조회 검증을 위해 주문 내역 페이지로 이동
  121 |         await page.goto('http://localhost:3000/orders/history');
  122 |         await expect(page.locator('h1')).toContainText('주문 조회');
  123 | 
  124 |         // 비회원 조회 폼 입력
  125 |         await page.fill('input[placeholder="주문자 이름"]', '홍길동');
  126 |         await page.fill('input[placeholder="주문자 연락처 (예: 010-1234-5678)"]', '010-1234-5678');
  127 |         await page.fill('input[placeholder="주문 비밀번호 4자리"]', '1234');
  128 | 
  129 |         // 주문 조회 버튼 클릭
  130 |         const trackBtn = page.locator('button:has-text("주문 조회")').first();
  131 |         await trackBtn.click();
  132 | 
  133 |         // 조회 내역 카드 렌더링 확인
  134 |         const orderCard = page.locator('div:has-text("홍길동")').first();
  135 |         await expect(orderCard).toBeVisible();
  136 | 
  137 |         // 아코디언 토글 클릭 동작 검증
  138 |         const accordionToggle = page.locator('button:has-text("▶ 상세보기"), button:has-text("▼ 상세닫기")').first();
  139 |         await accordionToggle.click();
  140 | 
  141 |         // 아코디언 확장 내의 상품 목록 및 주소 노출 확인
  142 |         const detailsContainer = page.locator('div:has-text("배송 주소")').first();
  143 |         await expect(detailsContainer).toBeVisible();
  144 |     });
  145 | });
  146 | 
```