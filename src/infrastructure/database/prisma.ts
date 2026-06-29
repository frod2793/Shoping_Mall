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

if (isEdge && process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
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

