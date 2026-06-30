export const runtime = "edge";
/**
 * @description [湲곕뒫]: 愿由ъ옄 ?대?吏 ?낅줈??API ?붾뱶?ъ씤?몃줈, ?낅줈?쒕맂 ?뚯씪??濡쒖뺄 ??⑸웾 ?붾젆?곕━??臾쇰━ ?뚯씪濡???ν빀?덈떎.
 * @author ?ㅼ듅醫?
 * @date 2026-06-30
 * @lastModifier ?ㅼ듅醫?
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] Cloudflare Pages Edge 鍮뚮뱶 洹쒓꺽(runtime='edge')??吏?ㅺ린 ?꾪빐, Node.js ?꾩슜 紐⑤뱢(fs, path)??dynamic eval require 諛⑹떇?쇰줈 寃⑸━ ?고쉶 而댄뙆??泥섎━?덉뒿?덈떎.
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
                { error: "?낅줈?쒗븷 ?뚯씪???꾨씫?섏뿀?듬땲??" },
                { status: 400 }
            );
        }

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
            return NextResponse.json(
                { error: "?대씪?곕뱶 ?ｌ? ?고????섍꼍?먯꽌??濡쒖뺄 ?낅줈?쒕? 吏?먰븯吏 ?딆뒿?덈떎." },
                { status: 500 }
            );
        }

        // ?섍꼍 蹂?섏뿉????⑸웾 ???寃쎈줈 寃異?(湲곕낯媛??ㅼ젙)
        const storagePath = process.env.LOCAL_STORAGE_PATH || './images_storage';
        const absoluteStoragePath = pathModule.resolve(storagePath);

        // ?대뜑 ?먮룞 ?ш? ?앹꽦
        if (!fsModule.existsSync(absoluteStoragePath))
        {
            fsModule.mkdirSync(absoluteStoragePath, { recursive: true });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 怨좎쑀 ?뚯씪 ?대쫫 ?앹꽦 (??꾩뒪?ы봽 + ?쒖닔 議고빀)
        const fileExtension = pathModule.extname(file.name) || '.png';
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}${fileExtension}`;
        const targetFilePath = pathModule.join(absoluteStoragePath, uniqueFileName);

        // 臾쇰━ ?붿뒪???곌린
        fsModule.writeFileSync(targetFilePath, buffer);

        console.log(`[UploadAPI] ?좉퇋 ?대?吏 臾쇰━ ????꾨즺: ${targetFilePath}`);

        // ?몃??먯꽌 ?ㅼ슫濡쒕뱶?????덈뒗 ?명솚 ?대?吏 API URL 諛섑솚
        return NextResponse.json(
            { url: `/api/products/image/${uniqueFileName}` }
        );
    }
    catch (e: any)
    {
        console.error("[UploadAPI] ?대?吏 臾쇰━ ?뚯씪 ????묒뾽 以??덉쇅媛 諛쒖깮?덉뒿?덈떎:", e);
        return NextResponse.json(
            { error: "?쒕쾭 ?대? ?먮윭濡??명빐 ?뚯씪 ?낅줈?쒖뿉 ?ㅽ뙣?덉뒿?덈떎." },
            { status: 500 }
        );
    }
}

