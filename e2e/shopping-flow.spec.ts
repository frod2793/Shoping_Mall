/**
 * [기능]: 장바구니 및 비회원 결제, 주문 내역 조회 E2E 통합 테스트 시나리오
 * [작성자]: 윤승종
 */
import { test, expect } from '@playwright/test';

test.describe('Shopping & Checkout Flow E2E Tests', () =>
{
    test('should run full shopping, cart, checkout, mock payment, success, and order history flow', async ({ page }) =>
    {
        // 1. 일반 사용자 도메인 홈 접속
        await page.goto('http://localhost:3000/');
        await expect(page).toHaveTitle(/Shopingmall/i);

        // 첫 번째 상품 카드의 상세 보기 클릭
        const firstProductLink = page.locator('a[href^="/products/"]').first();
        await firstProductLink.click();

        // 2. 상품 상세 페이지 진입 확인
        await expect(page).toHaveURL(/\/products\//);

        // 옵션 선택 (첫 번째 select 박스가 있다면)
        const optionSelect = page.locator('select').first();
        if (await optionSelect.isVisible())
        {
            const options = await optionSelect.locator('option').all();
            if (options.length > 1)
            {
                // 두 번째 옵션 선택 (첫 번째는 "선택해주세요" 임시 옵션)
                const val = await options[1].getAttribute('value');
                if (val != null)
                {
                    await optionSelect.selectOption(val);
                }
            }
        }

        // 장바구니 담기 클릭 (장바구니 담기 후 confirm 얼럿이 뜨므로 이를 핸들링)
        page.once('dialog', async (dialog) =>
        {
            expect(dialog.message()).toContain('상품이 장바구니에 담겼습니다');
            await dialog.accept(); // 장바구니로 이동 동의
        });

        // 장바구니 아이콘 버튼 (svg가 들어있는) 클릭
        const cartButton = page.locator('button[aria-label="장바구니 담기"]').first();
        await cartButton.click();

        // 3. 장바구니 페이지(`/cart`)로 정상 이동했는지 검증
        await page.waitForURL('**/cart');
        await expect(page.locator('h1')).toContainText('장바구니');

        // 수량 증가 버튼 클릭 (수량 인풋은 readonly text 타입)
        const initialQuantityText = await page.locator('input[readonly]').first().inputValue();
        const initialQuantity = parseInt(initialQuantityText, 10);
        
        // 수량 증가 (+) 버튼
        const quantityIncreaseBtn = page.locator('button:has-text("+")').first();
        await quantityIncreaseBtn.click();

        // 수량 증가 갱신 대기 및 확인
        const updatedQuantityText = await page.locator('input[readonly]').first().inputValue();
        expect(parseInt(updatedQuantityText, 10)).toBe(initialQuantity + 1);

        // 주문서 작성 페이지로 이동
        const checkoutBtn = page.locator('button:has-text("상품 구매하기")').first();
        await checkoutBtn.click();

        // 4. 주문서 작성 페이지(`/orders/checkout`)
        await page.waitForURL('**/orders/checkout');
        await expect(page.locator('h2:has-text("비회원 구매자 정보")')).toBeVisible();

        // 경고창(Alert) 발생 시 내용을 가로채기 위해 리스너 바인딩
        page.on('dialog', async (dialog) =>
        {
            console.log(`[E2E DIALOG ALERT]: ${dialog.message()}`);
            await dialog.accept();
        });

        // 주문자 정보 기입
        await page.fill('input[placeholder="주문자 이름을 입력하십시오."]', '홍길동');
        await page.fill('input[id="nonMemberPhone"]', '010-1234-5678');
        await page.fill('input[placeholder="주문 조회용 임시 비밀번호"]', '1234');

        // '주문자와 동일' 체크박스 동작 검증 (체크박스를 먼저 채워 수령인 폼을 동기화시킵니다)
        const sameAsOrdererCheckbox = page.locator('input[type="checkbox"]').first();
        await sameAsOrdererCheckbox.check();

        // 수령인 필드가 주문자 필드('홍길동')와 실시간 동기화되었는지 확인
        const shippingNameValue = await page.inputValue('input[placeholder="받으실 분의 이름을 입력하십시오."]');
        expect(shippingNameValue).toBe('홍길동');

        // 배송지 주소 기입 (리렌더링 후 안전하게 입력)
        await page.fill('input[placeholder="상세 주소를 입력하십시오."]', '서울시 강남구 테헤란로 123');

        // 결제하기 버튼 클릭
        const payBtn = page.locator('button:has-text("결제하기")').first();
        await payBtn.click();

        // 5. 가상 결제창(Mock PG Modal) 등장 검증
        const pgModal = page.locator('div:has-text("가상 PG 결제")').first();
        await expect(pgModal).toBeVisible();

        // 가짜 카드번호(16자리) 및 비밀번호(2자리) 입력 (ID 기반 선택자 활용)
        await page.fill('#cardNumber', '1234567812345678');
        await page.fill('#cardPassword', '99');

        // 결제 승인 클릭
        const approveBtn = page.locator('button:has-text("결제 승인")').first();
        await approveBtn.click();

        // 6. 성공 페이지(`/orders/success?orderId=...`) 정상 이동 확인
        await page.waitForURL('**/orders/success*');
        await expect(page.locator('h1')).toContainText('주문이 완료되었습니다');

        // 배송 정보 2차 재확인 영역 검증
        await expect(page.locator('div:has-text("배송지 주소")')).toContainText('서울시 강남구 테헤란로 123');
        await expect(page.locator('div:has-text("받는 사람")')).toContainText('홍길동');

        // 7. 주문 내역 조회 검증을 위해 주문 내역 페이지로 이동
        await page.goto('http://localhost:3000/orders/history');
        await expect(page.locator('h1')).toContainText('주문 조회');

        // 비회원 조회 폼 입력
        await page.fill('input[placeholder="주문자 이름"]', '홍길동');
        await page.fill('input[placeholder="주문자 연락처 (예: 010-1234-5678)"]', '010-1234-5678');
        await page.fill('input[placeholder="주문 비밀번호 4자리"]', '1234');

        // 주문 조회 버튼 클릭
        const trackBtn = page.locator('button:has-text("주문 조회")').first();
        await trackBtn.click();

        // 조회 내역 카드 렌더링 확인
        const orderCard = page.locator('div:has-text("홍길동")').first();
        await expect(orderCard).toBeVisible();

        // 아코디언 토글 클릭 동작 검증
        const accordionToggle = page.locator('button:has-text("▶ 상세보기"), button:has-text("▼ 상세닫기")').first();
        await accordionToggle.click();

        // 아코디언 확장 내의 상품 목록 및 주소 노출 확인
        const detailsContainer = page.locator('div:has-text("배송 주소")').first();
        await expect(detailsContainer).toBeVisible();
    });
});
