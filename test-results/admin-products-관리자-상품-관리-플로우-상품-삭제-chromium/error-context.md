# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-products.spec.ts >> 관리자 상품 관리 플로우 >> 상품 삭제
- Location: e2e/admin-products.spec.ts:109:9

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  locator('td:has-text("핸드메이드 아크릴 플라워 키링")')
Expected: hidden
Received: visible
Timeout:  5000ms

Call log:
  - Expect "toBeHidden" with timeout 5000ms
  - waiting for locator('td:has-text("핸드메이드 아크릴 플라워 키링")')
    14 × locator resolved to <td>핸드메이드 아크릴 플라워 키링</td>
       - unexpected value "visible"

```

```yaml
- cell "핸드메이드 아크릴 플라워 키링"
```

# Test source

```ts
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
  98  |         await page.selectOption('select', { label: '실버 액세서리' });
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
> 121 |         await expect(page.locator(`td:has-text("${firstProductName}")`)).toBeHidden();
      |                                                                          ^ Error: expect(locator).toBeHidden() failed
  122 |     });
  123 | });
  124 | 
```