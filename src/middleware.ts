/**
 * @description [기능]: Next.js 라우트 미들웨어로, 어드민 권한 체크 및 도메인 격리 가드를 수행합니다.
 * @author 윤승종
 * @date 2026-06-23
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] Cloudflare Tunnel(.trycloudflare.com) 및 localhost 도메인 예외 허용 로직 보완
 */
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest)
{
    const path = request.nextUrl.pathname;
    const host = request.headers.get('host');
    const hostWithoutPort = host ? host.split(':')[0] : '';
    const adminHost = process.env.ADMIN_HOST || 'admin-vitamin-mall.pages.dev, admin.localhost:3000, admin.localhost:3001';
    const allowedAdminHosts = adminHost.split(',').map(h => h.trim());
    const allowedHostsClean = allowedAdminHosts.map(h => h.split(':')[0].trim());

    // OPTIONS preflight request handling
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 204 });
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Bypass-Tunnel-Reminder, bypass-tunnel-reminder');
        return response;
    }

    // 1. 도메인 격리 검증: 요청 호스트가 ADMIN_HOST 목록에 없으면 무단 접근으로 판단하여 404 Not Found 반환
    if (path.startsWith('/admin') || path.startsWith('/api/admin'))
    {
        // 환경 변수 ADMIN_HOST에 등록된 정확한 도메인과만 일치해야 허용 (하위 경로 격리 누수 차단)
        console.log(`[Middleware] Path: ${path}, Host: ${host}, hostWithoutPort: ${hostWithoutPort}`);
        
        // Cloudflare Tunnel 임시 도메인(*.trycloudflare.com) 및 기본 로컬 환경 통과 예외 처리
        const isTunnelHost = hostWithoutPort.endsWith('.trycloudflare.com');
        const isLocalhost = hostWithoutPort === 'localhost' || hostWithoutPort === '127.0.0.1';

        if (!allowedAdminHosts.includes(host || '') && 
            !allowedHostsClean.includes(hostWithoutPort) &&
            !isTunnelHost &&
            !isLocalhost)
        {
            console.log(`[Middleware] 격리 누수 차단됨 - 404 반환. (Host: ${host})`);
            return new NextResponse(null, { status: 404 });
        }
    }

    // Exclude login page and logout API endpoints to avoid circular locks
    if (path === '/admin/login' || path === '/api/admin/login' || path === '/api/admin/logout')
    {
        const response = NextResponse.next();
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Bypass-Tunnel-Reminder, bypass-tunnel-reminder');
        return response;
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
                const response = NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
                response.headers.set('Access-Control-Allow-Origin', '*');
                return response;
            }
            // Redirect webpage request to admin login
            return NextResponse.redirect(new URL('/admin/login', request.url));
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
                    const response = NextResponse.json({ error: "접근 권한이 없거나 세션이 만료되었습니다." }, { status: 403 });
                    response.headers.set('Access-Control-Allow-Origin', '*');
                    return response;
                }
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        }
        catch (e)
        {
            if (path.startsWith('/api/'))
            {
                const response = NextResponse.json({ error: "잘못된 접근 토큰입니다." }, { status: 403 });
                response.headers.set('Access-Control-Allow-Origin', '*');
                return response;
            }
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Bypass-Tunnel-Reminder, bypass-tunnel-reminder');
    return response;
}

// Configure Matcher
export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
