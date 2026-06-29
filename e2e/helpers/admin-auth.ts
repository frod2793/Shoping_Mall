/**
 * @description [기능]: E2E 테스트 공용 헬퍼 유틸리티 (관리자 인증 및 이미지 생성)
 * @author 윤승종
 * @date 2026-06-29
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-29
 * @history [수정 내용]: 최초 작성
 */
import { Page, expect } from '@playwright/test';

// 관리자 로그인을 수행하고 쿠키를 설정하는 헬퍼 함수
export async function adminLogin(page: Page)
{
    await page.goto('http://localhost:3000/admin/login');
    
    // 이메일과 비밀번호 입력 (기본값인 경우 덮어쓰기)
    await page.fill('input[type="email"]', 'admin@shop.com');
    await page.fill('input[type="password"]', 'hashed_admin_password_123');

    // alert 처리
    page.once('dialog', dialog => dialog.accept());

    // 폼 제출
    await page.click('button[type="submit"]');

    // 로그인 후 /admin으로 리다이렉션 되는지 확인
    await page.waitForURL('http://localhost:3000/admin');
    
    // 쿠키에 admin_token이 설정되었는지 확인
    const cookies = await page.context().cookies();
    const adminToken = cookies.find(c => c.name === 'admin_token');
    expect(adminToken).toBeDefined();
}

// 테스트용 1x1 픽셀 투명 PNG 이미지를 생성하는 헬퍼 함수
export function createTestImageBuffer(): Buffer
{
    // 1x1 PNG Transparent
    const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    return Buffer.from(base64, 'base64');
}
