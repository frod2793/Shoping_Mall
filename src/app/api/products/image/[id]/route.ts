export const runtime = 'edge';
/**
 * [湲곕뒫]: PostgreSQL 諛붿씠?덈━ ?대?吏 ?숈쟻 ?쒕튃 API ?붾뱶?ъ씤??
 * [?묒꽦??: ?ㅼ듅醫?
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma';

/// <summary>
/// [湲곕뒫]: GET ?붿껌?쇰줈 ?곹뭹 ID瑜??섏떊諛쏆븘 PostgreSQL??imageBytes瑜??쎌? ??Content-Type??留욎떠 ?대?吏 諛붿씠?덈━瑜??쒕튃?⑸땲??
/// [?묒꽦??: ?ㅼ듅醫?
/// [?섏젙 ?좎쭨]: 2026-06-23
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
                // 釉뚮씪?곗? 1??濡깊? 罹먯떛???곸슜?섏뿬 DB ?붿껌 ?잛닔瑜??띻린?곸쑝濡?以꾩엫
                'Cache-Control': 'public, max-age=31536000, immutable',
            }
        });
    }
    catch (e: any)
    {
        console.error(`[ImageServerAPI] ?대?吏 濡쒕뱶 以??덉쇅媛 諛쒖깮?덉뒿?덈떎 (ID: ${params.id}):`, e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

