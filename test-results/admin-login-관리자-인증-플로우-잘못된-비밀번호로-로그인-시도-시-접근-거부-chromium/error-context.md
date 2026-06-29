# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-login.spec.ts >> 관리자 인증 플로우 >> 잘못된 비밀번호로 로그인 시도 시 접근 거부
- Location: e2e/admin-login.spec.ts:26:9

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Test source

```ts
  1  | /**
  2  |  * @description [기능]: 관리자 인증 플로우 E2E 테스트 (로그인, 로그아웃, 접근 차단)
  3  |  * @author 윤승종
  4  |  * @date 2026-06-29
  5  |  * @lastModifier 윤승종
  6  |  * @lastModifiedDate 2026-06-29
  7  |  * @history [수정 내용]: 최초 작성
  8  |  */
  9  | import { test, expect } from '@playwright/test';
  10 | import { adminLogin } from './helpers/admin-auth';
  11 | 
  12 | test.describe('관리자 인증 플로우', () =>
  13 | {
  14 |     test('올바른 자격증명으로 로그인 시 관리자 페이지로 이동', async ({ page }) =>
  15 |     {
  16 |         await adminLogin(page);
  17 |         
  18 |         // 대시보드 또는 상품 관리 페이지에 있는지 확인 (현재 /admin 은 /admin/products 로 리다이렉트되거나 대시보드를 표시함)
  19 |         const url = page.url();
  20 |         expect(url).toContain('admin.localhost:3000/admin');
  21 |         
  22 |         // 상품 관리 메뉴가 노출되는지 확인
  23 |         await expect(page.locator('text=상품 관리')).toBeVisible();
  24 |     });
  25 | 
  26 |     test('잘못된 비밀번호로 로그인 시도 시 접근 거부', async ({ page }) =>
  27 |     {
  28 |         await page.goto('http://admin.localhost:3000/admin/login');
  29 |         
> 30 |         await page.fill('input[type="email"]', 'admin@shop.com');
     |                    ^ Error: page.fill: Test timeout of 60000ms exceeded.
  31 |         await page.fill('input[type="password"]', 'wrong_password_123');
  32 | 
  33 |         // alert를 검증
  34 |         page.once('dialog', dialog =>
  35 |         {
  36 |             expect(dialog.message()).toContain('이메일 또는 비밀번호가 올바르지 않거나 권한이 없습니다.');
  37 |             dialog.accept();
  38 |         });
  39 | 
  40 |         await page.click('button[type="submit"]');
  41 | 
  42 |         // 로그인 페이지에 머무르는지 확인
  43 |         await expect(page).toHaveURL('http://admin.localhost:3000/admin/login');
  44 |     });
  45 | 
  46 |     test('로그아웃 시 쿠키 소거 및 재접근 차단', async ({ page }) =>
  47 |     {
  48 |         // 먼저 로그인
  49 |         await adminLogin(page);
  50 | 
  51 |         // 헤더의 로그아웃 버튼(아이콘) 클릭 (navbar에 로그아웃 기능이 있다고 가정)
  52 |         // 현재 코드상 Navbar 컴포넌트에 로그아웃 버튼이 존재함
  53 |         await page.click('button[title="로그아웃"], text="로그아웃"');
  54 | 
  55 |         // 로그아웃 후 다시 로그인 페이지로 리다이렉트 되는지 확인
  56 |         await expect(page).toHaveURL(/.*\/admin\/login.*/);
  57 | 
  58 |         // 다시 관리자 페이지 접근 시도
  59 |         await page.goto('http://admin.localhost:3000/admin/products');
  60 | 
  61 |         // 다시 로그인 페이지로 리다이렉트 되어야 함
  62 |         await expect(page).toHaveURL(/.*\/admin\/login.*/);
  63 |     });
  64 | });
  65 | 
```