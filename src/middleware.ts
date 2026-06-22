/**
 * [기능]: 관리자 경로 접근 제어 미들웨어
 * [작성자]: 윤승종
 */
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest)
{
    const path = request.nextUrl.pathname;

    // Exclude login and logout API endpoints to avoid circular locks
    if (path === '/api/admin/login' || path === '/api/admin/logout')
    {
        return NextResponse.next();
    }

    // Check for path matching /admin or /api/admin
    if (path.startsWith('/admin') || path.startsWith('/api/admin'))
    {
        const cookie = request.cookies.get('admin_token');
        const token = cookie?.value;

        if (token == null)
        {
            if (path.startsWith('/api/'))
            {
                return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
            }
            // Redirect webpage request to home
            return NextResponse.redirect(new URL('/', request.url));
        }

        try
        {
            // Edge-safe Base64 parsing (equivalent to AdminService.verifyToken)
            const decodedStr = atob(token);
            const session = JSON.parse(decodedStr);

            if (session.expires == null || session.expires < Date.now() || session.role !== 'ADMIN')
            {
                if (path.startsWith('/api/'))
                {
                    return NextResponse.json({ error: "접근 권한이 없거나 세션이 만료되었습니다." }, { status: 403 });
                }
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
        catch (e)
        {
            if (path.startsWith('/api/'))
            {
                return NextResponse.json({ error: "잘못된 접근 토큰입니다." }, { status: 403 });
            }
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

// Configure Matcher
export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
