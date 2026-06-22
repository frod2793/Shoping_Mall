/**
 * [기능]: AdminService 인증 서비스 단위 테스트
 * [작성자]: 윤승종
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AdminService } from '../AdminService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const adminService = new AdminService();

describe('AdminService', () =>
{
    beforeAll(async () =>
    {
        // Ensure test admin exists in SQLite dev database
        await prisma.user.deleteMany({ where: { email: "test_admin@shop.com" } });
        await prisma.user.create(
        {
            data:
            {
                email: "test_admin@shop.com",
                name: "테스트관리자",
                password: "password_123",
                role: "ADMIN"
            }
        });
    });

    afterAll(async () =>
    {
        await prisma.user.deleteMany({ where: { email: "test_admin@shop.com" } });
        await prisma.$disconnect();
    });

    it('login should succeed and return token for valid ADMIN credentials', async () =>
    {
        const token = await adminService.login("test_admin@shop.com", "password_123");
        expect(token).not.toBeNull();

        if (token != null)
        {
            const session = adminService.verifyToken(token);
            expect(session).not.toBeNull();
            expect(session?.role).toBe("ADMIN");
            expect(session?.email).toBe("test_admin@shop.com");
        }
    });

    it('login should return null for invalid credentials', async () =>
    {
        const token = await adminService.login("test_admin@shop.com", "wrong_password");
        expect(token).toBeNull();
    });

    it('verifyToken should return null for expired or invalid token format', () =>
    {
        const badToken = "invalid-token-string";
        const session = adminService.verifyToken(badToken);
        expect(session).toBeNull();
    });
});
