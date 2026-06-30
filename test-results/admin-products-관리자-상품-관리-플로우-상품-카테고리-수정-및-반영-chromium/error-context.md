# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-products.spec.ts >> 관리자 상품 관리 플로우 >> 상품 카테고리 수정 및 반영
- Location: e2e/admin-products.spec.ts:92:9

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.selectOption: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('select')
    - locator resolved to <select required="" class="admin-products_input__TU6Eo">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    112 × waiting for element to be visible and enabled
        - did not find some options
      - retrying select option action
        - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
        - link "관리자" [ref=e9] [cursor=pointer]:
          - /url: /admin
  - main [ref=e10]:
    - generic [ref=e11]:
      - complementary [ref=e12]:
        - generic [ref=e13]: 관리자 메뉴
        - link "대시보드" [ref=e14] [cursor=pointer]:
          - /url: /admin
        - link "상품 관리" [ref=e15] [cursor=pointer]:
          - /url: /admin/products
        - link "주문 관리" [ref=e16] [cursor=pointer]:
          - /url: /admin/orders
        - button "로그아웃" [ref=e17] [cursor=pointer]
      - generic [ref=e19]:
        - generic [ref=e20]:
          - heading "상품 관리" [level=1] [ref=e21]
          - button "+ 상품 등록" [ref=e22] [cursor=pointer]
        - table [ref=e23]:
          - rowgroup [ref=e24]:
            - row "카테고리 상품명 가격 재고 등록일 관리" [ref=e25]:
              - columnheader "카테고리" [ref=e26]
              - columnheader "상품명" [ref=e27]
              - columnheader "가격" [ref=e28]
              - columnheader "재고" [ref=e29]
              - columnheader "등록일" [ref=e30]
              - columnheader "관리" [ref=e31]
          - rowgroup [ref=e32]:
            - row "아크릴 키링 핸드메이드 아크릴 플라워 키링 8,900원 150개 6/30/2026 수정 삭제" [ref=e33]:
              - cell "아크릴 키링" [ref=e34]
              - cell "핸드메이드 아크릴 플라워 키링" [ref=e35]
              - cell "8,900원" [ref=e36]
              - cell "150개" [ref=e37]
              - cell "6/30/2026" [ref=e38]
              - cell "수정 삭제" [ref=e39]:
                - button "수정" [active] [ref=e40] [cursor=pointer]
                - button "삭제" [ref=e41] [cursor=pointer]
            - row "아크릴 키링 밤하늘 별무리 야광 아크릴 키링 9,500원 100개 6/30/2026 수정 삭제" [ref=e42]:
              - cell "아크릴 키링" [ref=e43]
              - cell "밤하늘 별무리 야광 아크릴 키링" [ref=e44]
              - cell "9,500원" [ref=e45]
              - cell "100개" [ref=e46]
              - cell "6/30/2026" [ref=e47]
              - cell "수정 삭제" [ref=e48]:
                - button "수정" [ref=e49] [cursor=pointer]
                - button "삭제" [ref=e50] [cursor=pointer]
            - row "아크릴 키링 파스텔 솜방망이 젤리캣 키링 7,900원 120개 6/30/2026 수정 삭제" [ref=e51]:
              - cell "아크릴 키링" [ref=e52]
              - cell "파스텔 솜방망이 젤리캣 키링" [ref=e53]
              - cell "7,900원" [ref=e54]
              - cell "120개" [ref=e55]
              - cell "6/30/2026" [ref=e56]
              - cell "수정 삭제" [ref=e57]:
                - button "수정" [ref=e58] [cursor=pointer]
                - button "삭제" [ref=e59] [cursor=pointer]
            - row "비즈 스트랩 파스텔 데이지 진주 비즈 폰스트랩 8,500원 120개 6/30/2026 수정 삭제" [ref=e60]:
              - cell "비즈 스트랩" [ref=e61]
              - cell "파스텔 데이지 진주 비즈 폰스트랩" [ref=e62]
              - cell "8,500원" [ref=e63]
              - cell "120개" [ref=e64]
              - cell "6/30/2026" [ref=e65]
              - cell "수정 삭제" [ref=e66]:
                - button "수정" [ref=e67] [cursor=pointer]
                - button "삭제" [ref=e68] [cursor=pointer]
            - row "비즈 스트랩 솜사탕 체리 레인보우 비즈 스트랩 9,800원 90개 6/30/2026 수정 삭제" [ref=e69]:
              - cell "비즈 스트랩" [ref=e70]
              - cell "솜사탕 체리 레인보우 비즈 스트랩" [ref=e71]
              - cell "9,800원" [ref=e72]
              - cell "90개" [ref=e73]
              - cell "6/30/2026" [ref=e74]
              - cell "수정 삭제" [ref=e75]:
                - button "수정" [ref=e76] [cursor=pointer]
                - button "삭제" [ref=e77] [cursor=pointer]
            - row "비즈 스트랩 클래식 천연 담수진주 폰스트랩 12,000원 80개 6/30/2026 수정 삭제" [ref=e78]:
              - cell "비즈 스트랩" [ref=e79]
              - cell "클래식 천연 담수진주 폰스트랩" [ref=e80]
              - cell "12,000원" [ref=e81]
              - cell "80개" [ref=e82]
              - cell "6/30/2026" [ref=e83]
              - cell "수정 삭제" [ref=e84]:
                - button "수정" [ref=e85] [cursor=pointer]
                - button "삭제" [ref=e86] [cursor=pointer]
            - row "실버 액세서리 실버 925 미니 하트 펜던트 목걸이 24,000원 80개 6/30/2026 수정 삭제" [ref=e87]:
              - cell "실버 액세서리" [ref=e88]
              - cell "실버 925 미니 하트 펜던트 목걸이" [ref=e89]
              - cell "24,000원" [ref=e90]
              - cell "80개" [ref=e91]
              - cell "6/30/2026" [ref=e92]
              - cell "수정 삭제" [ref=e93]:
                - button "수정" [ref=e94] [cursor=pointer]
                - button "삭제" [ref=e95] [cursor=pointer]
            - row "실버 액세서리 실버 925 레이어드 트위스트 실반지 18,000원 150개 6/30/2026 수정 삭제" [ref=e96]:
              - cell "실버 액세서리" [ref=e97]
              - cell "실버 925 레이어드 트위스트 실반지" [ref=e98]
              - cell "18,000원" [ref=e99]
              - cell "150개" [ref=e100]
              - cell "6/30/2026" [ref=e101]
              - cell "수정 삭제" [ref=e102]:
                - button "수정" [ref=e103] [cursor=pointer]
                - button "삭제" [ref=e104] [cursor=pointer]
            - row "실버 액세서리 미니 스타 원터치 링 귀걸이 15,500원 90개 6/30/2026 수정 삭제" [ref=e105]:
              - cell "실버 액세서리" [ref=e106]
              - cell "미니 스타 원터치 링 귀걸이" [ref=e107]
              - cell "15,500원" [ref=e108]
              - cell "90개" [ref=e109]
              - cell "6/30/2026" [ref=e110]
              - cell "수정 삭제" [ref=e111]:
                - button "수정" [ref=e112] [cursor=pointer]
                - button "삭제" [ref=e113] [cursor=pointer]
            - row "감성 스마트톡 로맨틱 벨벳 리본 폰그립 스마트톡 11,000원 200개 6/30/2026 수정 삭제" [ref=e114]:
              - cell "감성 스마트톡" [ref=e115]
              - cell "로맨틱 벨벳 리본 폰그립 스마트톡" [ref=e116]
              - cell "11,000원" [ref=e117]
              - cell "200개" [ref=e118]
              - cell "6/30/2026" [ref=e119]
              - cell "수정 삭제" [ref=e120]:
                - button "수정" [ref=e121] [cursor=pointer]
                - button "삭제" [ref=e122] [cursor=pointer]
            - row "감성 스마트톡 오로라 클리어 하트 곰돌이 스마트톡 9,900원 140개 6/30/2026 수정 삭제" [ref=e123]:
              - cell "감성 스마트톡" [ref=e124]
              - cell "오로라 클리어 하트 곰돌이 스마트톡" [ref=e125]
              - cell "9,900원" [ref=e126]
              - cell "140개" [ref=e127]
              - cell "6/30/2026" [ref=e128]
              - cell "수정 삭제" [ref=e129]:
                - button "수정" [ref=e130] [cursor=pointer]
                - button "삭제" [ref=e131] [cursor=pointer]
            - row "감성 스마트톡 크림 버터 튤립 하트 에폭시 스마트톡 10,500원 110개 6/30/2026 수정 삭제" [ref=e132]:
              - cell "감성 스마트톡" [ref=e133]
              - cell "크림 버터 튤립 하트 에폭시 스마트톡" [ref=e134]
              - cell "10,500원" [ref=e135]
              - cell "110개" [ref=e136]
              - cell "6/30/2026" [ref=e137]
              - cell "수정 삭제" [ref=e138]:
                - button "수정" [ref=e139] [cursor=pointer]
                - button "삭제" [ref=e140] [cursor=pointer]
            - row "오브제 팬시 감성 일러스트 데코 엽서 5종 세트 8,000원 300개 6/30/2026 수정 삭제" [ref=e141]:
              - cell "오브제 팬시" [ref=e142]
              - cell "감성 일러스트 데코 엽서 5종 세트" [ref=e143]
              - cell "8,000원" [ref=e144]
              - cell "300개" [ref=e145]
              - cell "6/30/2026" [ref=e146]
              - cell "수정 삭제" [ref=e147]:
                - button "수정" [ref=e148] [cursor=pointer]
                - button "삭제" [ref=e149] [cursor=pointer]
            - row "오브제 팬시 빈티지 린넨 내추럴 패브릭 포스터 14,000원 80개 6/30/2026 수정 삭제" [ref=e150]:
              - cell "오브제 팬시" [ref=e151]
              - cell "빈티지 린넨 내추럴 패브릭 포스터" [ref=e152]
              - cell "14,000원" [ref=e153]
              - cell "80개" [ref=e154]
              - cell "6/30/2026" [ref=e155]
              - cell "수정 삭제" [ref=e156]:
                - button "수정" [ref=e157] [cursor=pointer]
                - button "삭제" [ref=e158] [cursor=pointer]
            - row "오브제 팬시 톰과제리 스마일 에멘탈 치즈 캔들 6,900원 250개 6/30/2026 수정 삭제" [ref=e159]:
              - cell "오브제 팬시" [ref=e160]
              - cell "톰과제리 스마일 에멘탈 치즈 캔들" [ref=e161]
              - cell "6,900원" [ref=e162]
              - cell "250개" [ref=e163]
              - cell "6/30/2026" [ref=e164]
              - cell "수정 삭제" [ref=e165]:
                - button "수정" [ref=e166] [cursor=pointer]
                - button "삭제" [ref=e167] [cursor=pointer]
        - generic [ref=e169]:
          - heading "상품 수정" [level=2] [ref=e170]
          - generic [ref=e171]:
            - generic [ref=e172]:
              - generic [ref=e173]: 카테고리
              - combobox [ref=e174]:
                - option "🌸 아크릴 키링" [selected]
                - option "✨ 비즈 스트랩"
                - option "💍 실버 액세서리"
                - option "🎀 감성 스마트톡"
                - option "🧸 오브제 팬시"
            - generic [ref=e175]:
              - generic [ref=e176]: 상품명
              - textbox [ref=e177]: 핸드메이드 아크릴 플라워 키링
            - generic [ref=e178]:
              - generic [ref=e179]: 대표 이미지
              - generic [ref=e180]:
                - generic [ref=e181] [cursor=pointer]: 📁 대표 이미지 선택
                - generic [ref=e182]:
                  - img "대표 이미지 미리보기" [ref=e183]
                  - button "삭제" [ref=e184] [cursor=pointer]
            - generic [ref=e185]:
              - generic [ref=e186]: 상세 설명 문구
              - textbox "상품에 대한 설명글을 작성해 주세요. (자동 줄바꿈 지원)" [ref=e187]: <strong>[헤리티지 시리즈] 아크릴 플라워 키링</strong> 핸드메이드로 정성껏 제작된 투명하고 영롱한 아크릴 플라워 키링입니다. 실제 생화를 말린 드라이플라워와 미세한 금박 가루를 레진 속에 정성껏 박아 넣어, 보는 각도에 따라 신비롭고 눈부신 광택을 선사합니다.
              - generic [ref=e189] [cursor=pointer]: 📷 본문 중간에 이미지 추가
            - generic [ref=e190]:
              - generic [ref=e191]: 상세 컷 이미지 (하단 노출용)
              - generic [ref=e192]:
                - generic [ref=e193] [cursor=pointer]: 📁 상세 컷 이미지 선택
                - generic [ref=e194]: 등록된 이미지가 없습니다.
              - generic [ref=e195]: "* 스크롤을 내렸을 때 제품 소개 페이지 하단에 크게 노출되는 상세 설명용 이미지를 업로드합니다."
            - generic [ref=e196]:
              - generic [ref=e197]: 기본 가격 (원)
              - spinbutton [ref=e198]: "8900"
            - generic [ref=e199]:
              - generic [ref=e200]: 기본 재고 (개)
              - spinbutton [ref=e201]: "150"
            - generic [ref=e202]:
              - generic [ref=e203]:
                - generic [ref=e204]: 상품 옵션
                - button "+ 옵션 추가" [ref=e205] [cursor=pointer]
              - generic [ref=e206]:
                - textbox "옵션명" [ref=e207]: 고리 종류
                - textbox "옵션값" [ref=e208]: D자고리
                - spinbutton [ref=e209]: "0"
                - spinbutton [ref=e210]: "50"
                - button "삭제" [ref=e211] [cursor=pointer]
              - generic [ref=e212]:
                - textbox "옵션명" [ref=e213]: 고리 종류
                - textbox "옵션값" [ref=e214]: 하트고리
                - spinbutton [ref=e215]: "500"
                - spinbutton [ref=e216]: "50"
                - button "삭제" [ref=e217] [cursor=pointer]
            - generic [ref=e218]:
              - button "저장" [ref=e219] [cursor=pointer]
              - button "취소" [ref=e220] [cursor=pointer]
  - alert [ref=e221]
```

# Test source

```ts
  1   | /**
  2   |  * @description [기능]: 관리자 상품 관리(CRUD 및 이미지 업로드) E2E 테스트
  3   |  * @author 윤승종
  4   |  * @date 2026-06-29
  5   |  * @lastModifier 윤승종
  6   |  * @lastModifiedDate 2026-06-29
  7   |  * @history [수정 내용]: 최초 작성
  8   |  */
  9   | import { test, expect } from '@playwright/test';
  10  | import { adminLogin, createTestImageBuffer } from './helpers/admin-auth';
  11  | 
  12  | test.describe('관리자 상품 관리 플로우', () =>
  13  | {
  14  |     test.beforeEach(async ({ page }) =>
  15  |     {
  16  |         await adminLogin(page);
  17  |         await page.goto('http://admin.localhost:3000/admin/products');
  18  |     });
  19  | 
  20  |     test('새 상품 등록 및 카테고리/이미지/옵션 설정', async ({ page }) =>
  21  |     {
  22  |         const productName = `E2E 테스트 상품 ${Date.now()}`;
  23  |         
  24  |         // 새 상품 등록 버튼 클릭
  25  |         await page.click('button:has-text("새 상품 등록")');
  26  | 
  27  |         // 모달이 열렸는지 확인
  28  |         await expect(page.locator('.modalContainer')).toBeVisible();
  29  | 
  30  |         // 1. 카테고리 선택
  31  |         await page.selectOption('select', { label: '비즈 스트랩' });
  32  | 
  33  |         // 2. 기본 정보 입력
  34  |         await page.fill('input[type="text"]', productName);
  35  |         // 가격 필드가 여러개일 수 있으므로 label이나 특정 selector로 찾음
  36  |         // 여기서는 부모 label의 텍스트 등으로 특정
  37  |         await page.locator('label:has-text("가격") + input').fill('15000');
  38  |         await page.locator('label:has-text("재고") + input').fill('100');
  39  |         
  40  |         // 3. 대표 이미지 업로드 (파일 인풋이 여러개이므로 첫번째 것)
  41  |         const imageBuffer = createTestImageBuffer();
  42  |         const fileChooserPromise = page.waitForEvent('filechooser');
  43  |         // 대표 이미지 아래의 파일 인풋 또는 업로드 영역 클릭
  44  |         await page.locator('label:has-text("대표 이미지") + div input[type="file"]').setInputFiles({
  45  |             name: 'test-main.png',
  46  |             mimeType: 'image/png',
  47  |             buffer: imageBuffer,
  48  |         });
  49  | 
  50  |         // 썸네일 노출 대기
  51  |         await expect(page.locator('label:has-text("대표 이미지") + div img')).toBeVisible();
  52  | 
  53  |         // 4. 상세 컷 이미지 업로드
  54  |         await page.locator('label:has-text("상세 컷 이미지 (최대 5장)") + div input[type="file"]').setInputFiles({
  55  |             name: 'test-detail.png',
  56  |             mimeType: 'image/png',
  57  |             buffer: imageBuffer,
  58  |         });
  59  |         await expect(page.locator('label:has-text("상세 컷 이미지 (최대 5장)") + div img')).toBeVisible();
  60  | 
  61  |         // 5. 상품 설명 및 본문 이미지 삽입
  62  |         await page.fill('textarea', '이것은 E2E 테스트에서 작성된 설명입니다.');
  63  |         await page.locator('button[title="본문에 이미지 삽입"]').click();
  64  |         await page.locator('input[type="file"]').last().setInputFiles({
  65  |             name: 'test-body.png',
  66  |             mimeType: 'image/png',
  67  |             buffer: imageBuffer,
  68  |         });
  69  |         // 본문에 이미지 태그가 삽입되었는지 확인
  70  |         await expect(page.locator('textarea')).toHaveValue(/<img/);
  71  | 
  72  |         // 6. 상품 옵션 추가
  73  |         await page.click('button:has-text("옵션 추가")');
  74  |         // 옵션 입력 (마지막에 추가된 행)
  75  |         const optionRows = page.locator('label:has-text("상품 옵션") + div > div');
  76  |         await optionRows.last().locator('input[placeholder="옵션명"]').fill('색상');
  77  |         await optionRows.last().locator('input[placeholder="옵션값"]').fill('빨강');
  78  |         await optionRows.last().locator('input[placeholder="추가 가격"]').fill('1000');
  79  |         await optionRows.last().locator('input[placeholder="재고"]').fill('50');
  80  | 
  81  |         // 7. 저장
  82  |         page.once('dialog', dialog => dialog.accept());
  83  |         await page.click('button:has-text("저장")');
  84  | 
  85  |         // 모달 닫힘 확인
  86  |         await expect(page.locator('.modalContainer')).toBeHidden();
  87  | 
  88  |         // 테이블에 신규 상품이 추가되었는지 확인
  89  |         await expect(page.locator(`td:has-text("${productName}")`)).toBeVisible();
  90  |     });
  91  | 
  92  |     test('상품 카테고리 수정 및 반영', async ({ page }) =>
  93  |     {
  94  |         // 테이블 첫번째 행의 "수정" 버튼 클릭
  95  |         await page.locator('button:has-text("수정")').first().click();
  96  | 
  97  |         // 모달에서 카테고리 변경
> 98  |         await page.selectOption('select', { label: '실버 액세서리' });
      |                    ^ Error: page.selectOption: Test timeout of 60000ms exceeded.
  99  | 
  100 |         page.once('dialog', dialog => dialog.accept());
  101 |         await page.click('button:has-text("저장")');
  102 | 
  103 |         await expect(page.locator('.modalContainer')).toBeHidden();
  104 | 
  105 |         // 카테고리가 반영되었는지 확인 (첫번째 행)
  106 |         await expect(page.locator('tbody tr').first().locator('td:nth-child(4)')).toContainText('실버 액세서리');
  107 |     });
  108 | 
  109 |     test('상품 삭제', async ({ page }) =>
  110 |     {
  111 |         const firstProductName = await page.locator('tbody tr').first().locator('td').nth(1).innerText();
  112 | 
  113 |         // 삭제 확인 대화상자 처리
  114 |         page.once('dialog', dialog => dialog.accept());
  115 |         await page.locator('button:has-text("삭제")').first().click();
  116 | 
  117 |         // 얼럿 처리
  118 |         page.once('dialog', dialog => dialog.accept());
  119 | 
  120 |         // 해당 상품명이 더 이상 보이지 않는지 확인
  121 |         await expect(page.locator(`td:has-text("${firstProductName}")`)).toBeHidden();
  122 |     });
  123 | });
  124 | 
```