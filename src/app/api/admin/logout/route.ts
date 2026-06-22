/**
 * [기능]: 관리자 로그아웃 처리 API 라우터
 * [작성자]: 윤승종
 */
import { NextResponse } from 'next/server';

export async function POST()
{
    const response = NextResponse.json({ message: "로그아웃 성공" });
    // Clear cookie by setting maxAge: 0
    response.cookies.set('admin_token', '',
    {
        httpOnly: true,
        path: '/',
        maxAge: 0
    });

    return response;
}
