/**
 * @description [기능]: Prisma Client 인스턴스를 싱글톤으로 관리하며, 데이터베이스와의 커넥션 풀 누수를 방지합니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] 에지 환경에서의 Prisma Client 안전 기동 및 예외 가드 보완
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

try
{
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
}
catch (e)
{
    console.error("[PrismaInit] Prisma Client 초기화 중 예외 발생:", e);
    // 폴백용 더미 인스턴스
    prismaInstance = new PrismaClient({
        log: ['error']
    });
}

export const prisma = prismaInstance;
