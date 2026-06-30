# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-login.spec.ts >> 관리자 인증 플로우 >> 로그아웃 시 쿠키 소거 및 재접근 차단
- Location: e2e/admin-login.spec.ts:46:9

# Error details

```
Error: page.click: Unexpected token "=" while parsing css selector "button[title="로그아웃"], text="로그아웃"". Did you mean to CSS.escape it?
Call log:
  - waiting for button[title="로그아웃"], text="로그아웃"

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
        - heading "대시보드" [level=1] [ref=e20]
        - paragraph [ref=e21]: 쇼핑몰 현황 통계 요약
        - paragraph [ref=e22]: 로딩 중...
        - heading "관리자 시스템 정보" [level=2] [ref=e23]
        - generic [ref=e25]:
          - generic [ref=e26]:
            - strong [ref=e27]: "역할:"
            - text: 쇼핑몰 수석 관리자 (ADMIN)
          - generic [ref=e28]:
            - strong [ref=e29]: "DB 종류:"
            - text: PostgreSQL (Neon Serverless)
          - generic [ref=e30]:
            - strong [ref=e31]: "시스템 환경:"
            - text: Next.js App Router + Cloudflare Pages
          - generic [ref=e32]:
            - strong [ref=e33]: "터널:"
            - text: Cloudflare Tunnel (cloudflared)
  - alert [ref=e34]
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
  30 |         await page.fill('input[type="email"]', 'admin@shop.com');
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
> 53 |         await page.click('button[title="로그아웃"], text="로그아웃"');
     |                    ^ Error: page.click: Unexpected token "=" while parsing css selector "button[title="로그아웃"], text="로그아웃"". Did you mean to CSS.escape it?
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