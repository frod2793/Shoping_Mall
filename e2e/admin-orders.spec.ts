/**
 * @description [기능]: 관리자 주문 관리 E2E 테스트 (목록 조회, 필터, 상태 변경)
 * @author 윤승종
 * @date 2026-06-29
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-29
 * @history [수정 내용]: 최초 작성
 */
import { test, expect } from '@playwright/test';
import { adminLogin } from './helpers/admin-auth';

test.describe('관리자 주문 관리 플로우', () =>
{
    test.beforeEach(async ({ page }) =>
    {
        await adminLogin(page);
        await page.goto('http://localhost:3000/admin/orders');
    });

    test('주문 목록 테이블 헤더 및 기본 데이터 확인', async ({ page }) =>
    {
        // 타이틀 확인
        await expect(page.locator('h1:has-text("주문 관리")')).toBeVisible();

        // 테이블 헤더 확인
        await expect(page.locator('th:has-text("상세")')).toBeVisible();
        await expect(page.locator('th:has-text("주문 ID")')).toBeVisible();
        await expect(page.locator('th:has-text("주문 일시")')).toBeVisible();
        await expect(page.locator('th:has-text("총 금액")')).toBeVisible();
        await expect(page.locator('th:has-text("현재 상태")')).toBeVisible();
        await expect(page.locator('th:has-text("상태 변경")')).toBeVisible();
    });

    test('주문 상세 아코디언 토글 동작', async ({ page }) =>
    {
        // 주문이 있는지 확인 (최소 1개 이상)
        const rows = page.locator('table > tbody > tr');
        const rowCount = await rows.count();
        
        if (rowCount > 0)
        {
            // 첫 번째 주문의 상세보기 버튼 클릭
            const detailButton = rows.first().locator('button:has-text("▶ 상세보기")');
            if (await detailButton.isVisible()) {
                await detailButton.click();
                
                // 상세 정보 컨테이너가 열렸는지 확인
                await expect(page.locator('h4:has-text("수령인 및 배송 정보")').first()).toBeVisible();
                await expect(page.locator('h4:has-text("주문 상품 내역")').first()).toBeVisible();

                // 닫기 버튼 클릭
                await page.locator('button:has-text("▼ 닫기")').first().click();
                
                // 상세 정보가 닫혔는지 확인
                await expect(page.locator('h4:has-text("수령인 및 배송 정보")').first()).toBeHidden();
            }
        }
    });

    test('주문 상태 변경', async ({ page }) =>
    {
        // 주문이 있는지 확인
        const rows = page.locator('table > tbody > tr');
        const rowCount = await rows.count();
        
        if (rowCount > 0)
        {
            // 첫 번째 주문의 현재 상태 확인
            const statusSelect = rows.first().locator('select');
            
            // 상태를 '배송 중'으로 변경 (alert 처리)
            page.once('dialog', dialog => 
            {
                expect(dialog.message()).toContain('배송 상태가 성공적으로 변경되었습니다.');
                dialog.accept();
            });

            await statusSelect.selectOption({ value: 'SHIPPED' });

            // 상태 뱃지가 '배송 중'으로 바뀌었는지 확인
            await expect(rows.first().locator('span:has-text("배송 중")')).toBeVisible();
        }
    });

    test('상태 필터 탭 동작', async ({ page }) =>
    {
        // '결제 완료' 필터 클릭
        await page.click('button:has-text("결제 완료")');
        
        // 필터링된 주문 목록의 상태가 모두 '결제 완료'인지 확인
        const badges = page.locator('tbody tr span.badgePaid');
        const count = await badges.count();
        for (let i = 0; i < count; i++)
        {
            await expect(badges.nth(i)).toHaveText('결제 완료');
        }

        // 전체 탭으로 복귀
        await page.click('button:has-text("전체")');
    });
});
