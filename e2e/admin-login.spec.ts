/**
 * @description [기능]: 관리자 인증 플로우 E2E 테스트 (로그인, 로그아웃, 접근 차단)
 * @author 윤승종
 * @date 2026-06-29
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-29
 * @history [수정 내용]: 최초 작성
 */
import { test, expect } from '@playwright/test';
import { adminLogin } from './helpers/admin-auth';

test.describe('관리자 인증 플로우', () =>
{
    test('올바른 자격증명으로 로그인 시 관리자 페이지로 이동', async ({ page }) =>
    {
        await adminLogin(page);
        
        // 대시보드 또는 상품 관리 페이지에 있는지 확인 (현재 /admin 은 /admin/products 로 리다이렉트되거나 대시보드를 표시함)
        const url = page.url();
        expect(url).toContain('localhost:3000/admin');
        
        // 상품 관리 메뉴가 노출되는지 확인
        await expect(page.locator('text=상품 관리')).toBeVisible();
    });

    test('잘못된 비밀번호로 로그인 시도 시 접근 거부', async ({ page }) =>
    {
        await page.goto('http://localhost:3000/admin/login');
        
        await page.fill('input[type="email"]', 'admin@shop.com');
        await page.fill('input[type="password"]', 'wrong_password_123');

        // alert를 검증
        page.once('dialog', dialog =>
        {
            expect(dialog.message()).toContain('이메일 또는 비밀번호가 올바르지 않거나 권한이 없습니다.');
            dialog.accept();
        });

        await page.click('button[type="submit"]');

        // 로그인 페이지에 머무르는지 확인
        await expect(page).toHaveURL('http://localhost:3000/admin/login');
    });

    test('로그아웃 시 쿠키 소거 및 재접근 차단', async ({ page }) =>
    {
        // 먼저 로그인
        await adminLogin(page);

        // 헤더의 로그아웃 버튼(아이콘) 클릭 (navbar에 로그아웃 기능이 있다고 가정)
        // 현재 코드상 Navbar 컴포넌트에 로그아웃 버튼이 존재함
        await page.click('button[title="로그아웃"], text="로그아웃"');

        // 로그아웃 후 다시 로그인 페이지로 리다이렉트 되는지 확인
        await expect(page).toHaveURL(/.*\/admin\/login.*/);

        // 다시 관리자 페이지 접근 시도
        await page.goto('http://localhost:3000/admin/products');

        // 다시 로그인 페이지로 리다이렉트 되어야 함
        await expect(page).toHaveURL(/.*\/admin\/login.*/);
    });
});
