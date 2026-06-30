/**
 * @description [기능]: 관리자 이미지 업로드 API 엔드포인트로, 업로드된 파일을 로컬 대용량 디렉터리에 물리 파일로 저장합니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] 로컬 대용량 스토리지(LOCAL_STORAGE_PATH) 저장 로직 도입 및 Edge 런타임 제거
 */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

        // 환경 변수에서 대용량 저장 경로 검출 (기본값 설정)
        const storagePath = process.env.LOCAL_STORAGE_PATH || './images_storage';
        const absoluteStoragePath = path.resolve(storagePath);

        // 폴더 자동 재귀 생성
        if (!fs.existsSync(absoluteStoragePath))
        {
            fs.mkdirSync(absoluteStoragePath, { recursive: true });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 고유 파일 이름 생성 (타임스탬프 + 난수 조합)
        const fileExtension = path.extname(file.name) || '.png';
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${fileExtension}`;
        const targetFilePath = path.join(absoluteStoragePath, uniqueFileName);

        // 물리 디스크 쓰기
        fs.writeFileSync(targetFilePath, buffer);

        console.log(`[UploadAPI] 신규 이미지 물리 저장 완료: ${targetFilePath}`);

        // 외부에서 다운로드할 수 있는 호환 이미지 API URL 반환
        return NextResponse.json(
            { url: `/api/products/image/${uniqueFileName}` }
        );
    }
    catch (e: any)
    {
        console.error("[UploadAPI] 이미지 물리 파일 저장 작업 중 예외가 발생했습니다:", e);
        return NextResponse.json(
            { error: "서버 내부 에러로 인해 파일 업로드에 실패했습니다." },
            { status: 500 }
        );
    }
}
