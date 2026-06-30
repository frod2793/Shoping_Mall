export const runtime = 'edge';
/**
 * [湲곕뒫]: 愿由ъ옄 濡쒓렇?꾩썐 泥섎━ API ?쇱슦??
 * [?묒꽦??: ?ㅼ듅醫?
 */
import { NextResponse } from 'next/server';

export async function POST()
{
    const response = NextResponse.json({ message: "濡쒓렇?꾩썐 ?깃났" });
    // Clear cookie by setting maxAge: 0
    response.cookies.set('admin_token', '',
    {
        httpOnly: true,
        path: '/',
        maxAge: 0
    });

    return response;
}

