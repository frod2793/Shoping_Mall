/**
 * @description [기능]: 중복 생성 방지를 위한 글로벌 Prisma Client 싱글톤 인스턴스 헬퍼
 * @author 윤승종
 * @date 2026-06-29
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query', 'error', 'warn']
    });

if (process.env.NODE_ENV !== 'production')
{
    globalForPrisma.prisma = prisma;
}
