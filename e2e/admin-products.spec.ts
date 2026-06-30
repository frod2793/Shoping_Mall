/**
 * @description [기능]: 관리자 상품 관리(CRUD 및 이미지 업로드) E2E 테스트
 * @author 윤승종
 * @date 2026-06-29
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-29
 * @history [수정 내용]: 최초 작성
 */
import { test, expect } from '@playwright/test';
import { adminLogin, createTestImageBuffer } from './helpers/admin-auth';

test.describe('관리자 상품 관리 플로우', () =>
{
    test.beforeEach(async ({ page }) =>
    {
        await adminLogin(page);
        await page.goto('http://admin.localhost:3000/admin/products');
    });

    test('새 상품 등록 및 카테고리/이미지/옵션 설정', async ({ page }) =>
    {
        const productName = `E2E 테스트 상품 ${Date.now()}`;
        
        // 새 상품 등록 버튼 클릭
        await page.click('button:has-text("새 상품 등록")');

        // 모달이 열렸는지 확인
        await expect(page.locator('.modalContainer')).toBeVisible();

        // 1. 카테고리 선택
        await page.selectOption('select', { label: '비즈 스트랩' });

        // 2. 기본 정보 입력
        await page.fill('input[type="text"]', productName);
        // 가격 필드가 여러개일 수 있으므로 label이나 특정 selector로 찾음
        // 여기서는 부모 label의 텍스트 등으로 특정
        await page.locator('label:has-text("가격") + input').fill('15000');
        await page.locator('label:has-text("재고") + input').fill('100');
        
        // 3. 대표 이미지 업로드 (파일 인풋이 여러개이므로 첫번째 것)
        const imageBuffer = createTestImageBuffer();
        const fileChooserPromise = page.waitForEvent('filechooser');
        // 대표 이미지 아래의 파일 인풋 또는 업로드 영역 클릭
        await page.locator('label:has-text("대표 이미지") + div input[type="file"]').setInputFiles({
            name: 'test-main.png',
            mimeType: 'image/png',
            buffer: imageBuffer,
        });

        // 썸네일 노출 대기
        await expect(page.locator('label:has-text("대표 이미지") + div img')).toBeVisible();

        // 4. 상세 컷 이미지 업로드
        await page.locator('label:has-text("상세 컷 이미지 (최대 5장)") + div input[type="file"]').setInputFiles({
            name: 'test-detail.png',
            mimeType: 'image/png',
            buffer: imageBuffer,
        });
        await expect(page.locator('label:has-text("상세 컷 이미지 (최대 5장)") + div img')).toBeVisible();

        // 5. 상품 설명 및 본문 이미지 삽입
        await page.fill('textarea', '이것은 E2E 테스트에서 작성된 설명입니다.');
        await page.locator('button[title="본문에 이미지 삽입"]').click();
        await page.locator('input[type="file"]').last().setInputFiles({
            name: 'test-body.png',
            mimeType: 'image/png',
            buffer: imageBuffer,
        });
        // 본문에 이미지 태그가 삽입되었는지 확인
        await expect(page.locator('textarea')).toHaveValue(/<img/);

        // 6. 상품 옵션 추가
        await page.click('button:has-text("옵션 추가")');
        // 옵션 입력 (마지막에 추가된 행)
        const optionRows = page.locator('label:has-text("상품 옵션") + div > div');
        await optionRows.last().locator('input[placeholder="옵션명"]').fill('색상');
        await optionRows.last().locator('input[placeholder="옵션값"]').fill('빨강');
        await optionRows.last().locator('input[placeholder="추가 가격"]').fill('1000');
        await optionRows.last().locator('input[placeholder="재고"]').fill('50');

        // 7. 저장
        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("저장")');

        // 모달 닫힘 확인
        await expect(page.locator('.modalContainer')).toBeHidden();

        // 테이블에 신규 상품이 추가되었는지 확인
        await expect(page.locator(`td:has-text("${productName}")`)).toBeVisible();
    });

    test('상품 카테고리 수정 및 반영', async ({ page }) =>
    {
        // 테이블 첫번째 행의 "수정" 버튼 클릭
        await page.locator('button:has-text("수정")').first().click();

        // 모달에서 카테고리 변경
        await page.selectOption('select', { label: '실버 액세서리' });

        page.once('dialog', dialog => dialog.accept());
        await page.click('button:has-text("저장")');

        await expect(page.locator('.modalContainer')).toBeHidden();

        // 카테고리가 반영되었는지 확인 (첫번째 행)
        await expect(page.locator('tbody tr').first().locator('td:nth-child(4)')).toContainText('실버 액세서리');
    });

    test('상품 삭제', async ({ page }) =>
    {
        const firstProductName = await page.locator('tbody tr').first().locator('td').nth(1).innerText();

        // 삭제 확인 대화상자 처리
        page.once('dialog', dialog => dialog.accept());
        await page.locator('button:has-text("삭제")').first().click();

        // 얼럿 처리
        page.once('dialog', dialog => dialog.accept());

        // 해당 상품명이 더 이상 보이지 않는지 확인
        await expect(page.locator(`td:has-text("${firstProductName}")`)).toBeHidden();
    });
});
