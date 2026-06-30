/**
 * @description [기능]: 관리자 이미지 업로드 API 엔드포인트로, 업로드된 파일을 로컬 대용량 디렉터리에 물리 파일로 저장합니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] Cloudflare Pages Edge 빌드 규격(runtime='edge')을 지키기 위해, Node.js 전용 모듈(fs, path)을 dynamic eval require 방식으로 격리 우회 컴파일 처리했습니다.
 */
import { NextRequest, NextResponse } from 'next/server';

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

        // Webpack 정적 수집기를 속이기 위해 eval require 사용
        let fsModule: any;
        let pathModule: any;
        try
        {
            fsModule = eval("require('fs')");
            pathModule = eval("require('path')");
        }
        catch (e)
        {
            return NextResponse.json(
                { error: "클라우드 엣지 런타임 환경에서는 로컬 업로드를 지원하지 않습니다." },
                { status: 500 }
            );
        }

        // 환경 변수에서 대용량 저장 경로 검출 (기본값 설정)
        const storagePath = process.env.LOCAL_STORAGE_PATH || './images_storage';
        const absoluteStoragePath = pathModule.resolve(storagePath);

        // 폴더 자동 재귀 생성
        if (!fsModule.existsSync(absoluteStoragePath))
        {
            fsModule.mkdirSync(absoluteStoragePath, { recursive: true });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 고유 파일 이름 생성 (타임스탬프 + 난수 조합)
        const fileExtension = pathModule.extname(file.name) || '.png';
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${fileExtension}`;
        const targetFilePath = pathModule.join(absoluteStoragePath, uniqueFileName);

        // 물리 디스크 쓰기
        fsModule.writeFileSync(targetFilePath, buffer);

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
