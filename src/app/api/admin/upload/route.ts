export const runtime = 'edge';
/**
 * [湲곕뒫]: 愿由ъ옄 ?대?吏 ?낅줈??API ?붾뱶?ъ씤??
 * [?묒꽦??: ?ㅼ듅醫?
 */
import { NextRequest, NextResponse } from 'next/server';

/// <summary>
/// [湲곕뒫]: POST ?붿껌?쇰줈 multipart/form-data ?대?吏 ?뚯씪???섏떊諛쏆븘 Base64 Data URL 臾몄옄?대줈 蹂?섑븯??諛섑솚?⑸땲??
/// [?묒꽦??: ?ㅼ듅醫?
/// [?섏젙 ?좎쭨]: 2026-06-23
/// [留덉?留??섏젙 ?묒꽦??: ?ㅼ듅醫?
/// [?섏젙 ?댁슜]: ?붿뒪???곌린 ?쒓굅 諛?Base64 Data URL 諛섑솚?쇰줈 ?꾪솚
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
                { error: "?낅줈?쒗븷 ?뚯씪???꾨씫?섏뿀?듬땲??" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Base64 Data URL ?뺥깭濡?媛怨?
        const base64String = buffer.toString('base64');
        const mimeType = file.type || 'image/png';
        const dataUrl = `data:${mimeType};base64,${base64String}`;

        console.log(`[UploadAPI] ?좉퇋 ?대?吏瑜?Base64 Data URL濡??몄퐫???꾨즺?덉뒿?덈떎. ?뚯씪紐? ${file.name}`);

        return NextResponse.json(
            { url: dataUrl }
        );
    }
    catch (e: any)
    {
        console.error("[UploadAPI] ?대?吏 ?뚯씪 Base64 蹂???묒뾽 ?꾩쨷 ?덉쇅媛 諛쒖깮?덉뒿?덈떎:", e);
        return NextResponse.json(
            { error: "?쒕쾭 ?대? ?먮윭濡??명빐 ?뚯씪 ?낅줈??蹂?섏뿉 ?ㅽ뙣?덉뒿?덈떎." },
            { status: 500 }
        );
    }
}

