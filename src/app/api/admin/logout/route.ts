export const runtime = "edge";

/**
 * [疫꿸퀡??: ?온?귐딆쁽 嚥≪뮄??袁⑹뜍 筌ｌ꼶??API ??깆뒭??
 * [?臾믨쉐??: ??쇰뱟??
 */
import { NextResponse } from 'next/server';

export async function POST()
{
    const response = NextResponse.json({ message: "嚥≪뮄??袁⑹뜍 ?源껊궗" });
    // Clear cookie by setting maxAge: 0
    response.cookies.set('admin_token', '',
    {
        httpOnly: true,
        path: '/',
        maxAge: 0
    });

    return response;
}


