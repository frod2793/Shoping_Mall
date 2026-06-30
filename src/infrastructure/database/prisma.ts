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

// 로컬 루프백 호스트 주소 검출
const isLocalDB = process.env.DATABASE_URL?.includes('localhost') || 
                  process.env.DATABASE_URL?.includes('127.0.0.1');

if (isEdge) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://dummy:dummy@localhost/dummy" });
    const adapter = new PrismaNeon(pool);
    prismaInstance = new PrismaClient({
        adapter,
        log: ['error', 'warn']
    });
} else {
    prismaInstance =
        globalForPrisma.prisma ??
        new PrismaClient({
            log: ['query', 'error', 'warn']
        });

    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance;
    }
}

export const prisma = prismaInstance;
