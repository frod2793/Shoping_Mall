/**
 * @description [기능]: 일반 사용자 측의 쇼핑 전 과정 E2E 테스트
 * @author 윤승종
 * @date 2026-06-29
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-29
 * @history [수정 내용]: 최초 작성
 */
import { test, expect } from '@playwright/test';

test.describe('사용자 전체 쇼핑 플로우', () =>
{
    test('상품 카테고리 필터링 및 상세 페이지 렌더링', async ({ page }) =>
    {
        await page.goto('http://localhost:3000');

        // 카테고리 탭 클릭 (예: "비즈 스트랩")
        await page.click('button:has-text("비즈 스트랩")');

        // 필터링 적용 확인 (상품이 존재할 경우 첫번째 상품 클릭)
        const productCard = page.locator('.productGrid > div').first();
        if (await productCard.isVisible()) {
            await productCard.click();
            
            // 상품 상세 페이지 로드 확인
            await expect(page).toHaveURL(/.*\/products\/.*/);
            
            // 상품명, 가격, 장바구니 버튼 가시성 확인
            await expect(page.locator('h1')).toBeVisible();
            await expect(page.locator('button:has-text("장바구니 담기")')).toBeVisible();
        }
    });

    test('장바구니 담기 및 결제 진행', async ({ page }) =>
    {
        await page.goto('http://localhost:3000');
        
        // 상품 클릭
        const productCard = page.locator('.productGrid > div').first();
        if (!await productCard.isVisible()) {
            // 상품이 없으면 테스트 통과 처리 (또는 skip)
            test.skip();
            return;
        }
        await productCard.click();

        // 장바구니 담기 얼럿 처리
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("장바구니 담기")');

        // 장바구니 페이지로 이동
        await page.goto('http://localhost:3000/cart');

        // 수량 변경 버튼이 있다면 테스트
        const plusButton = page.locator('button:has-text("+")').first();
        if (await plusButton.isVisible()) {
            await plusButton.click();
        }

        // 결제하기 버튼 클릭
        await page.click('button:has-text("결제하기")');
        await expect(page).toHaveURL(/.*\/orders\/checkout/);
    });

    test('비회원 주문서 작성 및 가상 PG 결제', async ({ page }) =>
    {
        // 결제 페이지 진입을 위해 상품을 장바구니에 담고 결제 페이지로 이동
        await page.goto('http://localhost:3000');
        const productCard = page.locator('.productGrid > div').first();
        if (!await productCard.isVisible()) test.skip();
        await productCard.click();
        
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("장바구니 담기")');
        
        await page.goto('http://localhost:3000/orders/checkout');

        // 주문자 정보 입력
        await page.fill('input[name="ordererName"]', 'E2E사용자');
        await page.fill('input[name="ordererPhone"]', '010-1234-5678');
        await page.fill('input[name="ordererPassword"]', 'testpass123');

        // 배송지 정보 입력
        await page.fill('input[name="shippingName"]', 'E2E수령인');
        await page.fill('input[name="shippingPhone"]', '010-9876-5432');
        await page.fill('input[name="shippingAddress"]', '서울시 강남구 테스트동 123');
        await page.fill('input[name="shippingMemo"]', '문 앞에 두고 가주세요 (E2E)');

        // 결제 진행
        await page.click('button:has-text("결제하기")');

        // 가상 PG 모달이 나타나는지 확인
        await expect(page.locator('.modalContent')).toBeVisible();

        // 카드 번호, 비밀번호 입력
        await page.fill('input[placeholder="0000-0000-0000-0000"]', '1234-5678-1234-5678');
        await page.fill('input[placeholder="**"]', '12');

        // 승인 버튼 클릭 (결제 성공 후 주문 완료 페이지로 이동)
        await page.click('button:has-text("결제 승인 및 결제하기")');

        // 결제 완료 페이지 이동 확인
        await expect(page).toHaveURL(/.*\/orders\/success/);
        await expect(page.locator('text=결제가 성공적으로 완료되었습니다!')).toBeVisible();

        // 결제 완료 페이지에 표시된 주문 번호 저장
        const orderIdText = await page.locator('strong:has-text("주문 번호:")').innerText();
        const orderId = orderIdText.split(': ')[1];
        
        expect(orderId).toBeDefined();
    });

    test('주문 내역(비회원) 조회', async ({ page }) =>
    {
        // 먼저 주문 조회를 하려면 주문 번호가 필요하나, E2E 플로우 독립성 문제로 인해
        // 잘못된 주문 번호 입력 시의 에러 또는 정상 입력 시의 렌더링을 확인
        await page.goto('http://localhost:3000/orders/history');

        // 비회원 주문 조회 탭 활성화 (디폴트라고 가정)
        await page.fill('input[placeholder="주문자명"]', 'E2E사용자');
        await page.fill('input[placeholder="연락처 (- 제외)"]', '010-1234-5678');
        await page.fill('input[placeholder="주문 비밀번호"]', 'testpass123');

        // 조회 버튼 클릭
        await page.click('button:has-text("비회원 주문 조회")');

        // 이전 테스트에서 생성된 주문이 있다면 주문 목록이 표시됨
        // 없으면 "조회된 주문 내역이 없습니다"가 나옴
        const noOrderMessage = page.locator('text=조회된 주문 내역이 없습니다.');
        const orderCard = page.locator('.orderCard').first();

        // 둘 중 하나는 보여야 함
        await expect(noOrderMessage.or(orderCard)).toBeVisible();
    });
});
