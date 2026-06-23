/**
 * [기능]: 관리자 이미지 업로드 API 엔드포인트
 * [작성자]: 윤승종
 */
import { NextRequest, NextResponse } from 'next/server';

/// <summary>
/// [기능]: POST 요청으로 multipart/form-data 이미지 파일을 수신받아 Base64 Data URL 문자열로 변환하여 반환합니다.
/// [작성자]: 윤승종
/// [수정 날짜]: 2026-06-23
/// [마지막 수정 작성자]: 윤승종
/// [수정 내용]: 디스크 쓰기 제거 및 Base64 Data URL 반환으로 전환
/// </summary>
export async function POST(request: NextRequest)
{
    try
    {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (file == null)
        {
            return NextResponse.json(
                { error: "업로드할 파일이 누락되었습니다." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Base64 Data URL 형태로 가공
        const base64String = buffer.toString('base64');
        const mimeType = file.type || 'image/png';
        const dataUrl = `data:${mimeType};base64,${base64String}`;

        console.log(`[UploadAPI] 신규 이미지를 Base64 Data URL로 인코딩 완료했습니다. 파일명: ${file.name}`);

        return NextResponse.json(
            { url: dataUrl }
        );
    }
    catch (e: any)
    {
        console.error("[UploadAPI] 이미지 파일 Base64 변환 작업 도중 예외가 발생했습니다:", e);
        return NextResponse.json(
            { error: "서버 내부 에러로 인해 파일 업로드 변환에 실패했습니다." },
            { status: 500 }
        );
    }
}
