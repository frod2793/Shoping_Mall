/**
 * @description [기능]: 프로젝트 경로 내부에서 Playwright 브라우저를 띄워 관리자 페이지를 캡처하는 스크립트
 * @author 윤승종
 * @date 2026-06-29
 */
const { chromium } = require('@playwright/test');
const path = require('path');

async function capture()
{
    console.log("[CaptureScript] 프로젝트 내부에서 브라우저를 구동하여 관리자 페이지를 로드합니다...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // 포트 3001번의 어드민 서브도메인 관리자 페이지 주입
    const url = 'http://admin.localhost:3001/admin/login';
    await page.goto(url);
    await page.waitForTimeout(2000); // 렌더링 완료 대기

    // 아티팩트 디렉터리 경로에 이미지 저장
    const savePath = '/Users/woodenshield/.gemini/antigravity-ide/brain/d465281d-17ac-462a-9eea-c0b0dd8b15ae/admin_login.png';
    await page.screenshot({ path: savePath, fullPage: true });

    console.log(`[CaptureScript] 실제 브라우저 화면 캡처 완료! 저장경로: ${savePath}`);
    await browser.close();
}

capture().catch(err =>
{
    console.error("[CaptureScript] 캡처 중 오류 발생:", err);
    process.exit(1);
});
