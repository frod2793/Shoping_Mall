/**
 * [기능]: 관리자 로그인 처리 API 라우터
 * [작성자]: 윤승종
 */
import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/core/services/AdminService';

const adminService = new AdminService();

export async function POST(request: NextRequest)
{
    try
    {
        const { email, password } = await request.json();
        const token = await adminService.login(email, password);

        if (token == null)
        {
            return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않거나 권한이 없습니다." }, { status: 401 });
        }

        const response = NextResponse.json({ message: "로그인 성공" });
        // Set HttpOnly cookie
        response.cookies.set('admin_token', token,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 2 // 2 hours
        });

        return response;
    }
    catch (error: any)
    {
        console.error("[POST /api/admin/login] 에러 발생:", error);
        return NextResponse.json({ error: "로그인 중 서버 에러가 발생했습니다." }, { status: 500 });
    }
}
