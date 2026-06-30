/**
 * @description [기능]: Next.js 빌드 설정을 담당하며, CORS 전역 허용 설정을 관리합니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [수정 내용]: 원격 Pages 및 외부 연동을 원활히 지원하기 위해 전역 API 경로(/api/:path*) 대상 CORS 헤더 허용 설정을 주입했습니다.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@neondatabase/serverless']
    },
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    async headers()
    {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Bypass-Tunnel-Reminder, bypass-tunnel-reminder" }
                ]
            }
        ];
    }
};

export default nextConfig;
