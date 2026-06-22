/**
 * [기능]: 클라이언트 및 어드민 도메인 격리 보안 통제 E2E 테스트 시나리오
 * [작성자]: 윤승종
 */
import { test, expect } from '@playwright/test';

test.describe('Domain Isolation & Security Guard Tests', () =>
{
    test('should block admin routes with 404 on client host domain', async ({ page }) =>
    {
        // 일반 사용자 도메인으로 접속 시도
        const response = await page.goto('http://localhost:3000/admin');
        
        // Next.js 미들웨어 보안 가드 작동으로 404 응답 코드 반환 확인
        expect(response?.status()).toBe(404);
        
        // API 엔드포인트 무단 요청 시도
        const apiResponse = await page.request.get('http://localhost:3000/api/admin/orders');
        expect(apiResponse.status()).toBe(404);
    });

    test('should allow admin routes access on admin sub-domain and redirect to login page', async ({ page }) =>
    {
        // 관리자 도메인으로 접속 시도
        const response = await page.goto('http://admin.localhost:3000/admin');
        
        // 404로 차단되지 않고 리다이렉트 완료 후 최종 로그인 페이지(200) 도달 검증
        expect(response?.status()).toBe(200);
        await expect(page).toHaveURL(/admin\/login/);

        // 로그인 폼 노출 여부 확인
        const emailInput = page.locator('input[type="email"]').first();
        const pwInput = page.locator('input[type="password"]').first();
        await expect(emailInput).toBeVisible();
        await expect(pwInput).toBeVisible();
    });
});
