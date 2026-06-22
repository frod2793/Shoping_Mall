/**
 * [기능]: 주문 관리 처리 비즈니스 로직 서비스 클래스
 * [작성자]: 윤승종
 */
import { PrismaClient } from '@prisma/client';

export class OrderService
{
    private readonly m_prisma: PrismaClient;

    constructor(prisma?: PrismaClient)
    {
        this.m_prisma = prisma ?? new PrismaClient();
    }

    public async getAllOrders()
    {
        return this.m_prisma.order.findMany(
        {
            orderBy:
            {
                createdAt: 'desc'
            }
        });
    }

    public async updateOrderStatus(id: string, status: string)
    {
        if (id == null || id === '')
        {
            throw new Error("[OrderService] 주문 ID는 필수입니다.");
        }
        if (status == null || status === '')
        {
            throw new Error("[OrderService] 변경할 주문 상태는 필수입니다.");
        }

        const existing = await this.m_prisma.order.findUnique(
        {
            where: { id }
        });

        if (existing == null)
        {
            throw new Error("[OrderService] 존재하지 않는 주문입니다.");
        }

        return this.m_prisma.order.update(
        {
            where: { id },
            data: { status }
        });
    }
}
