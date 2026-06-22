/**
 * [기능]: OrderService 주문 관리 비즈니스 로직 단위 테스트
 * [작성자]: 윤승종
 */
import { describe, it, expect, vi } from 'vitest';
import { OrderService } from '../OrderService';
import { PrismaClient } from '@prisma/client';

describe('OrderService', () =>
{
    const mockOrder = {
        id: "ord-1",
        userId: "user-1",
        status: "PAID",
        totalPrice: 15000,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockPrisma = {
        order:
        {
            findMany: vi.fn().mockResolvedValue([mockOrder]),
            findUnique: vi.fn().mockResolvedValue(mockOrder),
            update: vi.fn().mockResolvedValue({ ...mockOrder, status: "SHIPPED" })
        }
    } as unknown as PrismaClient;

    const service = new OrderService(mockPrisma);

    it('getAllOrders should return ordered lists', async () =>
    {
        const result = await service.getAllOrders();
        expect(result).toHaveLength(1);
        expect(result[0].status).toBe("PAID");
    });

    it('updateOrderStatus should update order status successfully', async () =>
    {
        const result = await service.updateOrderStatus("ord-1", "SHIPPED");
        expect(result.status).toBe("SHIPPED");
    });

    it('updateOrderStatus should throw error when id is empty', async () =>
    {
        await expect(service.updateOrderStatus("", "SHIPPED")).rejects.toThrow("[OrderService] 주문 ID는 필수입니다.");
    });
});
