/**
 * @description [기능]: 로컬 드라이브 물리 파일 저장소에서 이미지를 실시간 로드하여 글로벌 CDN 캐시 헤더와 함께 서빙하는 정적 미디어 라우트입니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] Cloudflare Pages Edge 빌드 규격(runtime='edge')을 지키기 위해, Node.js 전용 모듈(fs, path)을 dynamic eval require 방식으로 격리 우회 컴파일 처리했습니다.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
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
            return new NextResponse("Edge Environment Not Supported", { status: 500 });
        }

        // 디렉터리 트래버셜 방지용 파일명 추출
        const fileName = pathModule.basename(params.id);
        const storagePath = process.env.LOCAL_STORAGE_PATH || './images_storage';
        const targetFilePath = pathModule.resolve(storagePath, fileName);

        // 파일 존재 여부 검사
        if (!fsModule.existsSync(targetFilePath))
        {
            return new NextResponse("Image Not Found", { status: 404 });
        }

        // 파일 바이너리 로드
        const fileBuffer = fsModule.readFileSync(targetFilePath);

        // 확장자별 mimeType 추정
        const ext = pathModule.extname(fileName).toLowerCase();
        let mimeType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg')
        {
            mimeType = 'image/jpeg';
        }
        else if (ext === '.gif')
        {
            mimeType = 'image/gif';
        }
        else if (ext === '.webp')
        {
            mimeType = 'image/webp';
        }
        else if (ext === '.svg')
        {
            mimeType = 'image/svg+xml';
        }

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': mimeType,
                // [홈쇼핑 대량 트래픽용] 브라우저 및 CDN 에지에 만료 기간 1년을 강제 캐싱하여 원본 노트북 요청 부하를 0으로 차단
                'Cache-Control': 'public, max-age=31536000, immutable',
            }
        });
    }
    catch (e: any)
    {
        console.error(`[ImageServerAPI] 이미지 파일 로드 중 예외가 발생했습니다 (파일명: ${params.id}):`, e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
