/**
 * [기능]: 관리자 이미지 업로드 API 엔드포인트
 * [작성자]: 윤승종
 */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/// <summary>
/// [기능]: POST 요청으로 multipart/form-data 이미지 파일을 수신받아 로컬 public/uploads 디렉토리에 저장하고 접근 URL을 반환합니다.
/// [작성자]: 윤승종
/// [수정 날짜]: 2026-06-23
/// [마지막 수정 작성자]: 윤승종
/// [수정 내용]: 최초 개발 및 바이너리 파일 저장 구현
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

        // 로컬 업로드 디렉토리 경로 지정
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        
        // 디렉토리가 부재할 경우 재귀 생성
        await mkdir(uploadDir, { recursive: true });

        // 고유 파일 식별을 위한 타임스탬프 결합 파일명 생성
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}-${file.name}`;
        const filePath = join(uploadDir, filename);

        // 파일 물리 디스크 쓰기 수행
        await writeFile(filePath, buffer);

        console.log(`[UploadAPI] 신규 이미지 파일이 정상 저장되었습니다. 파일명: ${filename}`);

        // 클라이언트 웹 루트 접근용 URL 리턴
        return NextResponse.json(
            { url: `/uploads/${filename}` }
        );
    }
    catch (e: any)
    {
        console.error("[UploadAPI] 이미지 파일 저장 작업 도중 예외가 발생했습니다:", e);
        return NextResponse.json(
            { error: "서버 내부 디스크 에러로 인해 파일 업로드에 실패했습니다." },
            { status: 500 }
        );
    }
}
