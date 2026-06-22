/**
 * [기능]: OrderService 주문 관리 비즈니스 로직 단위 테스트
 * [작성자]: 윤승종
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../OrderService';
import { PrismaClient } from '@prisma/client';

describe('OrderService', () =>
{
    let mockPrisma: any;
    let service: OrderService;

    const mockOrder = {
        id: "ord-1",
        userId: "user-1",
        status: "PENDING_PAYMENT",
        totalPrice: 15000,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
            {
                productId: "prod-1",
                productName: "테스트 상품",
                optionInfo: "옵션: 선택1",
                price: 15000,
                quantity: 1
            }
        ]
    };

    beforeEach(() =>
    {
        mockPrisma = {
            order: {
                findMany: vi.fn().mockResolvedValue([mockOrder]),
                findUnique: vi.fn().mockResolvedValue(mockOrder),
                update: vi.fn().mockResolvedValue({ ...mockOrder, status: "PAID", paymentKey: "pay-key-1" }),
                create: vi.fn().mockImplementation((args) =>
                {
                    const itemsCreated = args.data.items.create.map((item: any, idx: number) =>
                    {
                        return {
                            id: `item-${idx}`,
                            ...item
                        };
                    });
                    return Promise.resolve({
                        id: "ord-new",
                        ...args.data,
                        items: itemsCreated,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                })
            },
            product: {
                findUnique: vi.fn().mockResolvedValue({
                    id: "prod-1",
                    name: "테스트 상품",
                    price: 10000,
                    stock: 10
                }),
                update: vi.fn().mockImplementation((args) =>
                {
                    const decVal = args.data.stock.decrement;
                    const nextStock = 10 - decVal;
                    return Promise.resolve({
                        id: args.where.id,
                        stock: nextStock
                    });
                })
            },
            productOption: {
                findUnique: vi.fn().mockResolvedValue({
                    id: "opt-1",
                    productId: "prod-1",
                    name: "옵션",
                    value: "선택1",
                    additionalPrice: 5000,
                    stock: 5
                }),
                findFirst: vi.fn().mockResolvedValue({
                    id: "opt-1",
                    productId: "prod-1",
                    name: "옵션",
                    value: "선택1",
                    additionalPrice: 5000,
                    stock: 5
                }),
                update: vi.fn().mockImplementation((args) =>
                {
                    const decVal = args.data.stock.decrement;
                    return Promise.resolve({
                        id: args.where.id,
                        stock: 5 - decVal
                    });
                })
            },
            $transaction: vi.fn().mockImplementation(async (callback) =>
            {
                return await callback(mockPrisma);
            })
        };

        service = new OrderService(mockPrisma as unknown as PrismaClient);
    });

    it('getAllOrders should return ordered lists', async () =>
    {
        const result = await service.getAllOrders();
        expect(result).toHaveLength(1);
        expect(result[0].status).toBe("PENDING_PAYMENT");
    });

    it('updateOrderStatus should update order status successfully', async () =>
    {
        mockPrisma.order.update.mockResolvedValueOnce({ ...mockOrder, status: "SHIPPED" });
        const result = await service.updateOrderStatus("ord-1", "SHIPPED");
        expect(result.status).toBe("SHIPPED");
    });

    it('updateOrderStatus should throw error when id is empty', async () =>
    {
        await expect(service.updateOrderStatus("", "SHIPPED")).rejects.toThrow("[OrderService] 주문 ID는 필수입니다.");
    });

    describe('createPendingOrder', () =>
    {
        it('should successfully create a pending order with correct price calculation', async () =>
        {
            const orderData = {
                userId: "user-1",
                shippingName: "홍길동",
                shippingPhone: "010-1234-5678",
                shippingAddress: "서울시 강남구",
                totalPrice: 15000,
                items: [
                    {
                        productId: "prod-1",
                        optionId: "opt-1",
                        price: 15000,
                        quantity: 1
                    }
                ]
            };

            const result = await service.createPendingOrder(orderData);
            expect(result.id).toBe("ord-new");
            expect(result.totalPrice).toBe(15000);
            expect(result.status).toBe("PENDING_PAYMENT");
            expect(result.items[0].optionInfo).toBe("옵션: 선택1");
        });

        it('should throw error when product stock is insufficient', async () =>
        {
            mockPrisma.product.findUnique.mockResolvedValueOnce({
                id: "prod-1",
                name: "테스트 상품",
                price: 10000,
                stock: 0
            });

            const orderData = {
                shippingName: "홍길동",
                shippingPhone: "010-1234-5678",
                shippingAddress: "서울시 강남구",
                totalPrice: 10000,
                items: [
                    {
                        productId: "prod-1",
                        price: 10000,
                        quantity: 1
                    }
                ],
                nonMemberName: "비회원",
                nonMemberPhone: "010-1111-2222",
                nonMemberPassword: "password123"
            };

            await expect(service.createPendingOrder(orderData)).rejects.toThrow("[OrderService] 상품 재고가 부족합니다.");
        });

        it('should throw error when option stock is insufficient', async () =>
        {
            mockPrisma.productOption.findUnique.mockResolvedValueOnce({
                id: "opt-1",
                productId: "prod-1",
                name: "옵션",
                value: "선택1",
                additionalPrice: 5000,
                stock: 0
            });

            const orderData = {
                shippingName: "홍길동",
                shippingPhone: "010-1234-5678",
                shippingAddress: "서울시 강남구",
                totalPrice: 15000,
                items: [
                    {
                        productId: "prod-1",
                        optionId: "opt-1",
                        price: 15000,
                        quantity: 1
                    }
                ],
                nonMemberName: "비회원",
                nonMemberPhone: "010-1111-2222",
                nonMemberPassword: "password123"
            };

            await expect(service.createPendingOrder(orderData)).rejects.toThrow("[OrderService] 옵션 재고가 부족합니다.");
        });

        it('should throw error when product price does not match', async () =>
        {
            const orderData = {
                shippingName: "홍길동",
                shippingPhone: "010-1234-5678",
                shippingAddress: "서울시 강남구",
                totalPrice: 12000,
                items: [
                    {
                        productId: "prod-1",
                        optionId: "opt-1",
                        price: 12000,
                        quantity: 1
                    }
                ],
                nonMemberName: "비회원",
                nonMemberPhone: "010-1111-2222",
                nonMemberPassword: "password123"
            };

            await expect(service.createPendingOrder(orderData)).rejects.toThrow("[OrderService] 상품 가격 정보가 일치하지 않습니다.");
        });
    });

    describe('verifyAndConfirmOrder', () =>
    {
        it('should successfully confirm order and decrement stocks within transaction', async () =>
        {
            const result = await service.verifyAndConfirmOrder("ord-1", "pay-key-1");
            expect(result.status).toBe("PAID");
            expect(result.paymentKey).toBe("pay-key-1");
            expect(mockPrisma.$transaction).toHaveBeenCalled();
            expect(mockPrisma.product.update).toHaveBeenCalled();
            expect(mockPrisma.productOption.update).toHaveBeenCalled();
        });

        it('should throw error when order is not pending payment', async () =>
        {
            mockPrisma.order.findUnique.mockResolvedValueOnce({
                ...mockOrder,
                status: "PAID"
            });

            await expect(service.verifyAndConfirmOrder("ord-1", "pay-key-1")).rejects.toThrow("[OrderService] 결제 대기 중인 주문이 아닙니다.");
        });

        it('should rollback transaction if product update results in negative stock', async () =>
        {
            mockPrisma.product.update.mockResolvedValueOnce({
                id: "prod-1",
                stock: -1
            });

            await expect(service.verifyAndConfirmOrder("ord-1", "pay-key-1")).rejects.toThrow("[OrderService] 상품 재고가 부족합니다.");
        });
    });
});
