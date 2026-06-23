/**
 * [기능]: 이미지 업로드 API 단위 테스트
 * [작성자]: 윤승종
 */
// @vitest-environment node
import { POST } from './route';
import { NextRequest } from 'next/server';
import { expect, test, vi } from 'vitest';
import { File } from 'buffer'; // Node.js 네이티브 File 주입

// 디스크 쓰기 연동을 생략하기 위해 fs/promises 모킹
vi.mock('fs/promises', async () => 
{
    const mockWrite = vi.fn().mockResolvedValue(undefined);
    const mockMkdir = vi.fn().mockResolvedValue(undefined);
    return {
        default: {
            writeFile: mockWrite,
            mkdir: mockMkdir
        },
        writeFile: mockWrite,
        mkdir: mockMkdir
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
    expect(data.url).toContain('/uploads/');
    expect(data.url).toContain('test-image.png');
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
