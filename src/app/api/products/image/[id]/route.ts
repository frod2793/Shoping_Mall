/**
 * [기능]: PostgreSQL 바이너리 이미지 동적 서빙 API 엔드포인트
 * [작성자]: 윤승종
 */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/// <summary>
/// [기능]: GET 요청으로 상품 ID를 수신받아 PostgreSQL의 imageBytes를 읽은 후 Content-Type을 맞춰 이미지 바이너리를 서빙합니다.
/// [작성자]: 윤승종
/// [수정 날짜]: 2026-06-23
/// </summary>
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try
    {
        const product = await prisma.product.findUnique({
            where: { id: params.id },
            select: { imageBytes: true, imageMime: true }
        });

        if (!product || !product.imageBytes)
        {
            return new NextResponse("Image Not Found", { status: 404 });
        }

        const buffer = Buffer.from(product.imageBytes);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': product.imageMime || 'image/png',
                // 브라우저 1년 롱텀 캐싱을 적용하여 DB 요청 횟수를 획기적으로 줄임
                'Cache-Control': 'public, max-age=31536000, immutable',
            }
        });
    }
    catch (e: any)
    {
        console.error(`[ImageServerAPI] 이미지 로드 중 예외가 발생했습니다 (ID: ${params.id}):`, e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
