# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user-full-flow.spec.ts >> 사용자 전체 쇼핑 플로우 >> 주문 내역(비회원) 조회
- Location: e2e/user-full-flow.spec.ts:113:9

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="주문자명"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "VITAMIN" [ref=e4] [cursor=pointer]:
        - /url: /
      - navigation [ref=e5]:
        - link "주문조회" [ref=e6] [cursor=pointer]:
          - /url: /orders/history
        - link "장바구니" [ref=e7] [cursor=pointer]:
          - /url: /cart
          - generic [ref=e8]: 장바구니
  - main [ref=e9]:
    - generic [ref=e10]:
      - heading "주문 내역 조회" [level=1] [ref=e11]
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]: 주문자 이름
          - textbox "주문자 이름" [ref=e16]:
            - /placeholder: 주문 시 기입하신 이름을 입력해주십시오.
        - generic [ref=e17]:
          - generic [ref=e18]: 연락처
          - textbox "연락처" [ref=e19]:
            - /placeholder: "예: 010-1234-5678"
        - generic [ref=e20]:
          - generic [ref=e21]: 주문번호 조회 비밀번호 (4자리 이상)
          - textbox "주문번호 조회 비밀번호 (4자리 이상)" [ref=e22]:
            - /placeholder: 비회원 주문 비밀번호를 입력해주십시오.
        - button "주문 확인하기" [ref=e23] [cursor=pointer]
  - alert [ref=e24]
```

# Test source

```ts
  20  |         // 필터링 적용 확인 (상품이 존재할 경우 첫번째 상품 클릭)
  21  |         const productCard = page.locator('.productGrid > div').first();
  22  |         if (await productCard.isVisible()) {
  23  |             await productCard.click();
  24  |             
  25  |             // 상품 상세 페이지 로드 확인
  26  |             await expect(page).toHaveURL(/.*\/products\/.*/);
  27  |             
  28  |             // 상품명, 가격, 장바구니 버튼 가시성 확인
  29  |             await expect(page.locator('h1')).toBeVisible();
  30  |             await expect(page.locator('button:has-text("장바구니 담기")')).toBeVisible();
  31  |         }
  32  |     });
  33  | 
  34  |     test('장바구니 담기 및 결제 진행', async ({ page }) =>
  35  |     {
  36  |         await page.goto('http://localhost:3000');
  37  |         
  38  |         // 상품 클릭
  39  |         const productCard = page.locator('.productGrid > div').first();
  40  |         if (!await productCard.isVisible()) {
  41  |             // 상품이 없으면 테스트 통과 처리 (또는 skip)
  42  |             test.skip();
  43  |             return;
  44  |         }
  45  |         await productCard.click();
  46  | 
  47  |         // 장바구니 담기 얼럿 처리
  48  |         page.once('dialog', dialog => dialog.accept());
  49  |         await page.click('button:has-text("장바구니 담기")');
  50  | 
  51  |         // 장바구니 페이지로 이동
  52  |         await page.goto('http://localhost:3000/cart');
  53  | 
  54  |         // 수량 변경 버튼이 있다면 테스트
  55  |         const plusButton = page.locator('button:has-text("+")').first();
  56  |         if (await plusButton.isVisible()) {
  57  |             await plusButton.click();
  58  |         }
  59  | 
  60  |         // 결제하기 버튼 클릭
  61  |         await page.click('button:has-text("결제하기")');
  62  |         await expect(page).toHaveURL(/.*\/orders\/checkout/);
  63  |     });
  64  | 
  65  |     test('비회원 주문서 작성 및 가상 PG 결제', async ({ page }) =>
  66  |     {
  67  |         // 결제 페이지 진입을 위해 상품을 장바구니에 담고 결제 페이지로 이동
  68  |         await page.goto('http://localhost:3000');
  69  |         const productCard = page.locator('.productGrid > div').first();
  70  |         if (!await productCard.isVisible()) test.skip();
  71  |         await productCard.click();
  72  |         
  73  |         page.once('dialog', dialog => dialog.accept());
  74  |         await page.click('button:has-text("장바구니 담기")');
  75  |         
  76  |         await page.goto('http://localhost:3000/orders/checkout');
  77  | 
  78  |         // 주문자 정보 입력
  79  |         await page.fill('input[name="ordererName"]', 'E2E사용자');
  80  |         await page.fill('input[name="ordererPhone"]', '010-1234-5678');
  81  |         await page.fill('input[name="ordererPassword"]', 'testpass123');
  82  | 
  83  |         // 배송지 정보 입력
  84  |         await page.fill('input[name="shippingName"]', 'E2E수령인');
  85  |         await page.fill('input[name="shippingPhone"]', '010-9876-5432');
  86  |         await page.fill('input[name="shippingAddress"]', '서울시 강남구 테스트동 123');
  87  |         await page.fill('input[name="shippingMemo"]', '문 앞에 두고 가주세요 (E2E)');
  88  | 
  89  |         // 결제 진행
  90  |         await page.click('button:has-text("결제하기")');
  91  | 
  92  |         // 가상 PG 모달이 나타나는지 확인
  93  |         await expect(page.locator('.modalContent')).toBeVisible();
  94  | 
  95  |         // 카드 번호, 비밀번호 입력
  96  |         await page.fill('input[placeholder="0000-0000-0000-0000"]', '1234-5678-1234-5678');
  97  |         await page.fill('input[placeholder="**"]', '12');
  98  | 
  99  |         // 승인 버튼 클릭 (결제 성공 후 주문 완료 페이지로 이동)
  100 |         await page.click('button:has-text("결제 승인 및 결제하기")');
  101 | 
  102 |         // 결제 완료 페이지 이동 확인
  103 |         await expect(page).toHaveURL(/.*\/orders\/success/);
  104 |         await expect(page.locator('text=결제가 성공적으로 완료되었습니다!')).toBeVisible();
  105 | 
  106 |         // 결제 완료 페이지에 표시된 주문 번호 저장
  107 |         const orderIdText = await page.locator('strong:has-text("주문 번호:")').innerText();
  108 |         const orderId = orderIdText.split(': ')[1];
  109 |         
  110 |         expect(orderId).toBeDefined();
  111 |     });
  112 | 
  113 |     test('주문 내역(비회원) 조회', async ({ page }) =>
  114 |     {
  115 |         // 먼저 주문 조회를 하려면 주문 번호가 필요하나, E2E 플로우 독립성 문제로 인해
  116 |         // 잘못된 주문 번호 입력 시의 에러 또는 정상 입력 시의 렌더링을 확인
  117 |         await page.goto('http://localhost:3000/orders/history');
  118 | 
  119 |         // 비회원 주문 조회 탭 활성화 (디폴트라고 가정)
> 120 |         await page.fill('input[placeholder="주문자명"]', 'E2E사용자');
      |                    ^ Error: page.fill: Test timeout of 60000ms exceeded.
  121 |         await page.fill('input[placeholder="연락처 (- 제외)"]', '010-1234-5678');
  122 |         await page.fill('input[placeholder="주문 비밀번호"]', 'testpass123');
  123 | 
  124 |         // 조회 버튼 클릭
  125 |         await page.click('button:has-text("비회원 주문 조회")');
  126 | 
  127 |         // 이전 테스트에서 생성된 주문이 있다면 주문 목록이 표시됨
  128 |         // 없으면 "조회된 주문 내역이 없습니다"가 나옴
  129 |         const noOrderMessage = page.locator('text=조회된 주문 내역이 없습니다.');
  130 |         const orderCard = page.locator('.orderCard').first();
  131 | 
  132 |         // 둘 중 하나는 보여야 함
  133 |         await expect(noOrderMessage.or(orderCard)).toBeVisible();
  134 |     });
  135 | });
  136 | 
```