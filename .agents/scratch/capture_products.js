/**
 * @description [기능]: 임시 관리자 쿠키를 주입하여 실제 브라우저에서 로그인된 상품 관리 테이블 화면을 캡처하는 스크립트
 * @author 윤승종
 * @date 2026-06-29
 */
const { chromium } = require('@playwright/test');

async function capture()
{
    console.log("[CaptureProducts] Chromium 브라우저를 초기화합니다...");
    const browser = await chromium.launch({ headless: true });
    
    // 쿠키를 담을 브라우저 컨텍스트 설정
    const context = await browser.newContext();

    // 1. 보안 규격을 충족하는 가짜 어드민 Base64 세션 토큰 객체 생성
    const sessionObj = {
        email: "admin@shop.com",
        role: "ADMIN",
        expires: Date.now() + 1000 * 3600 * 24 // 1일 유효 세션
    };
    const rawStr = JSON.stringify(sessionObj);
    const base64Token = Buffer.from(rawStr).toString('base64');

    // 2. 어드민 서브도메인 쿠키 주입
    console.log("[CaptureProducts] 관리자 세션 쿠키(HttpOnly 모방)를 주입합니다...");
    await context.addCookies([
        {
            name: 'admin_token',
            value: base64Token,
            domain: 'admin.localhost',
            path: '/',
            expires: Math.floor(Date.now() / 1000) + 3600 * 24
        }
    ]);

    const page = await context.newPage();

    // 3. 상품 관리 페이지 로드
    const url = 'http://admin.localhost:3001/admin/products';
    console.log(`[CaptureProducts] 관리자 상품 관리 화면으로 진입합니다: ${url}`);
    await page.goto(url);
    await page.waitForTimeout(3000); // DB 및 목록 렌더링 대기 시간 보장

    // 4. 아티팩트 디렉터리에 결과 캡처 이미지 보관
    const savePath = '/Users/woodenshield/.gemini/antigravity-ide/brain/d465281d-17ac-462a-9eea-c0b0dd8b15ae/admin_products.png';
    await page.screenshot({ path: savePath, fullPage: true });

    console.log(`[CaptureProducts] 상품 관리 화면 브라우저 캡처 완료! 저장경로: ${savePath}`);
    await browser.close();
}

capture().catch(err =>
{
    console.error("[CaptureProducts] 실행 중 오류 발생:", err);
    process.exit(1);
});
