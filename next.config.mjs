/**
 * @description [기능]: Next.js 빌드 설정을 담당합니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [수정 내용]: 빌드에서 제외할 외부 패키지 지정
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@neondatabase/serverless']
    }
};

export default nextConfig;
