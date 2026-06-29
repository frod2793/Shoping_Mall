# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-orders.spec.ts >> 관리자 주문 관리 플로우 >> 주문 목록 테이블 헤더 및 기본 데이터 확인
- Location: e2e/admin-orders.spec.ts:20:9

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Test source

```ts
  1  | /**
  2  |  * @description [기능]: E2E 테스트 공용 헬퍼 유틸리티 (관리자 인증 및 이미지 생성)
  3  |  * @author 윤승종
  4  |  * @date 2026-06-29
  5  |  * @lastModifier 윤승종
  6  |  * @lastModifiedDate 2026-06-29
  7  |  * @history [수정 내용]: 최초 작성
  8  |  */
  9  | import { Page, expect } from '@playwright/test';
  10 | 
  11 | // 관리자 로그인을 수행하고 쿠키를 설정하는 헬퍼 함수
  12 | export async function adminLogin(page: Page)
  13 | {
  14 |     await page.goto('http://localhost:3000/admin/login');
  15 |     
  16 |     // 이메일과 비밀번호 입력 (기본값인 경우 덮어쓰기)
> 17 |     await page.fill('input[type="email"]', 'admin@shop.com');
     |                ^ Error: page.fill: Test timeout of 60000ms exceeded.
  18 |     await page.fill('input[type="password"]', 'hashed_admin_password_123');
  19 | 
  20 |     // alert 처리
  21 |     page.once('dialog', dialog => dialog.accept());
  22 | 
  23 |     // 폼 제출
  24 |     await page.click('button[type="submit"]');
  25 | 
  26 |     // 로그인 후 /admin으로 리다이렉션 되는지 확인
  27 |     await page.waitForURL('http://localhost:3000/admin');
  28 |     
  29 |     // 쿠키에 admin_token이 설정되었는지 확인
  30 |     const cookies = await page.context().cookies();
  31 |     const adminToken = cookies.find(c => c.name === 'admin_token');
  32 |     expect(adminToken).toBeDefined();
  33 | }
  34 | 
  35 | // 테스트용 1x1 픽셀 투명 PNG 이미지를 생성하는 헬퍼 함수
  36 | export function createTestImageBuffer(): Buffer
  37 | {
  38 |     // 1x1 PNG Transparent
  39 |     const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  40 |     return Buffer.from(base64, 'base64');
  41 | }
  42 | 
```