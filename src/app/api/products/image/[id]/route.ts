export const runtime = "edge";
/**
 * @description [湲곕뒫]: 濡쒖뺄 ?쒕씪?대툕 臾쇰━ ?뚯씪 ??μ냼?먯꽌 ?대?吏瑜??ㅼ떆媛?濡쒕뱶?섏뿬 湲濡쒕쾶 CDN 罹먯떆 ?ㅻ뜑? ?④퍡 ?쒕튃?섎뒗 ?뺤쟻 誘몃뵒???쇱슦?몄엯?덈떎.
 * @author ?ㅼ듅醫?
 * @date 2026-06-30
 * @lastModifier ?ㅼ듅醫?
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] Cloudflare Pages Edge 鍮뚮뱶 洹쒓꺽(runtime='edge')??吏?ㅺ린 ?꾪빐, Node.js ?꾩슜 紐⑤뱢(fs, path)??dynamic eval require 諛⑹떇?쇰줈 寃⑸━ ?고쉶 而댄뙆??泥섎━?덉뒿?덈떎.
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
        // Webpack ?뺤쟻 ?섏쭛湲곕? ?띿씠湲??꾪빐 eval require ?ъ슜
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

        // ?붾젆?곕━ ?몃옒踰꾩뀥 諛⑹????뚯씪紐?異붿텧
        const fileName = pathModule.basename(params.id);
        const storagePath = process.env.LOCAL_STORAGE_PATH || './images_storage';
        const targetFilePath = pathModule.resolve(storagePath, fileName);

        // ?뚯씪 議댁옱 ?щ? 寃??
        if (!fsModule.existsSync(targetFilePath))
        {
            return new NextResponse("Image Not Found", { status: 404 });
        }

        // ?뚯씪 諛붿씠?덈━ 濡쒕뱶
        const fileBuffer = fsModule.readFileSync(targetFilePath);

        // ?뺤옣?먮퀎 mimeType 異붿젙
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
                // [?덉눥??????몃옒?쎌슜] 釉뚮씪?곗? 諛?CDN ?먯???留뚮즺 湲곌컙 1?꾩쓣 媛뺤젣 罹먯떛?섏뿬 ?먮낯 ?명듃遺??붿껌 遺?섎? 0?쇰줈 李⑤떒
                'Cache-Control': 'public, max-age=31536000, immutable',
            }
        });
    }
    catch (e: any)
    {
        console.error(`[ImageServerAPI] ?대?吏 ?뚯씪 濡쒕뱶 以??덉쇅媛 諛쒖깮?덉뒿?덈떎 (?뚯씪紐? ${params.id}):`, e);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

