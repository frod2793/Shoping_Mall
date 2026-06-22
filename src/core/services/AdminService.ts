/**
 * [기능]: 관리자 인증 처리 비즈니스 로직 서비스 클래스
 * [작성자]: 윤승종
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AdminSession
{
    email: string;
    role: string;
    expires: number;
}

export class AdminService
{
    public async login(email: string, password: string): Promise<string | null>
    {
        if (!email || !password)
        {
            throw new Error("[AdminService] 이메일과 비밀번호는 필수 입력 항목입니다.");
        }

        const user = await prisma.user.findUnique(
        {
            where: { email }
        });

        if (user == null)
        {
            return null;
        }

        if (user.password !== password)
        {
            return null;
        }

        if (user.role !== 'ADMIN')
        {
            return null;
        }

        // Generate simple token: JSON string encoded as Base64 (expires in 2 hours)
        const session: AdminSession = {
            email: user.email || '',
            role: user.role,
            expires: Date.now() + 1000 * 60 * 60 * 2
        };

        const token = Buffer.from(JSON.stringify(session)).toString('base64');
        return token;
    }

    public verifyToken(token: string): AdminSession | null
    {
        if (!token)
        {
            return null;
        }

        try
        {
            const decodedStr = Buffer.from(token, 'base64').toString('utf-8');
            const session = JSON.parse(decodedStr) as AdminSession;

            if (session.expires < Date.now())
            {
                return null; // Expired
            }

            if (session.role !== 'ADMIN')
            {
                return null;
            }

            return session;
        }
        catch (error)
        {
            console.error("[AdminService] 토큰 검증 중 에러 발생:", error);
            return null;
        }
    }
}
