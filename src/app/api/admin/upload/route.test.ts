/**
 * @description [기능]: 이미지 업로드 API 단위 테스트
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] fs 동기식 API 모킹 적용 및 이미지 API 서빙 경로 검증 로직으로 전격 개정
 */
// @vitest-environment node
import { POST } from './route';
import { NextRequest } from 'next/server';
import { expect, test, vi } from 'vitest';
import { File } from 'buffer'; // Node.js 네이티브 File 주입

// 디스크 실제 쓰기를 유발하지 않도록 fs 모듈 동기식 메서드 모킹
vi.mock('fs', async () =>
{
    return {
        default: {
            existsSync: vi.fn().mockReturnValue(true),
            mkdirSync: vi.fn(),
            writeFileSync: vi.fn()
        },
        existsSync: vi.fn().mockReturnValue(true),
        mkdirSync: vi.fn(),
        writeFileSync: vi.fn()
    };
});

test('이미지 업로드 API 테스트 - 파일 포함 시 성공', async () => 
{
    const formData = new FormData();
    const mockFile = new File(['dummy bytes'], 'test-image.png', { type: 'image/png' });
    formData.append('file', mockFile);

    const request = new NextRequest('http://localhost:3000/api/admin/upload', 
    {
        method: 'POST',
        body: formData
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    // 신규 로컬 이미지 API 서빙 규격 검증
    expect(data.url).toContain('/api/products/image/');
    expect(data.url).toMatch(/\.png$/);
});

test('이미지 업로드 API 테스트 - 파일 미포함 시 400 에러 리턴', async () => 
{
    const formData = new FormData(); // 빈 폼 데이터 전송

    const request = new NextRequest('http://localhost:3000/api/admin/upload', 
    {
        method: 'POST',
        body: formData
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('업로드할 파일이 누락되었습니다.');
});
