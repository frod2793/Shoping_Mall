/**
 * @description [기능]: Prisma Client 인스턴스를 싱글톤으로 관리하며, 데이터베이스와의 커넥션 풀 누수를 방지합니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [수정 내용]: 로컬 PC 직접 호스팅 및 Node.js 표준 런타임 구동을 위해 엣지/Neon 관련 종속성 분기를 완전히 정리하고 로컬 PostgreSQL 단일 연결로 복원했습니다.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query', 'error', 'warn']
    });

if (process.env.NODE_ENV !== 'production')
{
    globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;
