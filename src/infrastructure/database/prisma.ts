/**
 * @description [기능]: Prisma Client 인스턴스를 싱글톤으로 관리하며, 데이터베이스와의 커넥션 풀 누수를 방지합니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [수정 내용]: Cloudflare Pages 에지 런타임(Edge Runtime)에서의 DB 쿼리 지원을 위한 Neon Serverless 어댑터 연동 구조 복원
 */
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

// Cloudflare Pages / Workers Edge 환경 감지
const isEdge = process.env.CF_PAGES === 'true' || 
               process.env.NEXT_RUNTIME === 'edge' || 
               typeof (globalThis as any).EdgeRuntime !== 'undefined';

if (isEdge)
{
    const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://dummy:dummy@localhost/dummy" });
    const adapter = new PrismaNeon(pool);
    prismaInstance = new PrismaClient({
        adapter,
        log: ['error', 'warn']
    });
}
else
{
    prismaInstance =
        globalForPrisma.prisma ??
        new PrismaClient({
            log: ['query', 'error', 'warn']
        });

    if (process.env.NODE_ENV !== 'production')
    {
        globalForPrisma.prisma = prismaInstance;
    }
}

export const prisma = prismaInstance;
