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
        if (prisma != null)
        {
            this.m_prisma = prisma;
        }
        else
        {
            this.m_prisma = new PrismaClient();
        }
    }

    /// <summary>
    /// [기능]: 모든 주문 리스트를 최신순으로 조회합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 작성
    /// </summary>
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

    /// <summary>
    /// [기능]: 주문의 상태를 강제로 업데이트합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 널 체크 명시적 처리
    /// </summary>
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

    /// <summary>
    /// [기능]: 임시 주문(결제 대기)을 생성하고 재고 및 가격 유효성을 검증합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    public async createPendingOrder(data: any): Promise<any>
    {
        if (data == null)
        {
            throw new Error("[OrderService] 주문 요청 데이터가 누락되었습니다.");
        }
        if (data.items == null || !Array.isArray(data.items) || data.items.length === 0)
        {
            throw new Error("[OrderService] 구매 품목 항목이 올바르지 않습니다.");
        }
        if (data.shippingName == null || data.shippingName === '')
        {
            throw new Error("[OrderService] 배송지 수령인 이름은 필수입니다.");
        }
        if (data.shippingPhone == null || data.shippingPhone === '')
        {
            throw new Error("[OrderService] 배송지 연락처는 필수입니다.");
        }
        if (data.shippingAddress == null || data.shippingAddress === '')
        {
            throw new Error("[OrderService] 배송지 주소는 필수입니다.");
        }

        // 비회원 주문일 때 개인정보 검증
        if (data.userId == null)
        {
            if (data.nonMemberName == null || data.nonMemberName === '')
            {
                throw new Error("[OrderService] 비회원 주문 시 이름은 필수입니다.");
            }
            if (data.nonMemberPhone == null || data.nonMemberPhone === '')
            {
                throw new Error("[OrderService] 비회원 주문 시 연락처는 필수입니다.");
            }
            if (data.nonMemberPassword == null || data.nonMemberPassword === '')
            {
                throw new Error("[OrderService] 비회원 주문 시 비밀번호는 필수입니다.");
            }
        }

        const createItemsData = [];
        let calculatedTotalPrice = 0;

        for (let i = 0; i < data.items.length; i++)
        {
            const item = data.items[i];
            if (item == null)
            {
                continue;
            }

            const product = await this.m_prisma.product.findUnique(
            {
                where: { id: item.productId }
            });

            if (product == null)
            {
                throw new Error("[OrderService] 존재하지 않는 상품입니다.");
            }
            if (product.stock < item.quantity)
            {
                throw new Error("[OrderService] 상품 재고가 부족합니다.");
            }

            let optionInfo: string | null = null;
            let itemPrice = product.price;

            if (item.optionId != null && item.optionId !== '')
            {
                const option = await this.m_prisma.productOption.findUnique(
                {
                    where: { id: item.optionId }
                });

                if (option == null || option.productId !== product.id)
                {
                    throw new Error("[OrderService] 존재하지 않는 옵션입니다.");
                }
                if (option.stock < item.quantity)
                {
                    throw new Error("[OrderService] 옵션 재고가 부족합니다.");
                }

                optionInfo = `${option.name}: ${option.value}`;
                itemPrice += option.additionalPrice;
            }

            if (item.price !== itemPrice)
            {
                throw new Error("[OrderService] 상품 가격 정보가 일치하지 않습니다.");
            }

            calculatedTotalPrice += itemPrice * item.quantity;

            createItemsData.push(
            {
                productId: item.productId,
                productName: product.name,
                optionInfo: optionInfo,
                price: itemPrice,
                quantity: item.quantity
            });
        }

        if (data.totalPrice !== calculatedTotalPrice)
        {
            throw new Error("[OrderService] 총 주문 금액이 일치하지 않습니다.");
        }

        let userIdVal = null;
        if (data.userId != null)
        {
            userIdVal = data.userId;
        }

        let nonMemberNameVal = null;
        if (data.nonMemberName != null)
        {
            nonMemberNameVal = data.nonMemberName;
        }

        let nonMemberPhoneVal = null;
        if (data.nonMemberPhone != null)
        {
            nonMemberPhoneVal = data.nonMemberPhone;
        }

        let nonMemberPasswordVal = null;
        if (data.nonMemberPassword != null)
        {
            nonMemberPasswordVal = data.nonMemberPassword;
        }

        let shippingMemoVal = null;
        if (data.shippingMemo != null)
        {
            shippingMemoVal = data.shippingMemo;
        }

        return this.m_prisma.order.create(
        {
            data:
            {
                userId: userIdVal,
                nonMemberName: nonMemberNameVal,
                nonMemberPhone: nonMemberPhoneVal,
                nonMemberPassword: nonMemberPasswordVal,
                totalPrice: calculatedTotalPrice,
                status: "PENDING_PAYMENT",
                shippingName: data.shippingName,
                shippingPhone: data.shippingPhone,
                shippingAddress: data.shippingAddress,
                shippingMemo: shippingMemoVal,
                items:
                {
                    create: createItemsData
                }
            },
            include:
            {
                items: true
            }
        });
    }

    /// <summary>
    /// [기능]: 결제를 검증하고 트랜잭션 하에서 주문 상태 변경 및 재고를 차감합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    public async verifyAndConfirmOrder(orderId: string, paymentKey: string): Promise<any>
    {
        if (orderId == null || orderId === '')
        {
            throw new Error("[OrderService] 주문 ID는 필수입니다.");
        }
        if (paymentKey == null || paymentKey === '')
        {
            throw new Error("[OrderService] 결제 키는 필수입니다.");
        }

        const order = await this.m_prisma.order.findUnique(
        {
            where: { id: orderId },
            include:
            {
                items: true
            }
        });

        if (order == null)
        {
            throw new Error("[OrderService] 존재하지 않는 주문입니다.");
        }
        if (order.status !== "PENDING_PAYMENT")
        {
            throw new Error("[OrderService] 결제 대기 중인 주문이 아닙니다.");
        }

        // 트랜잭션 내에서 상태 업데이트 및 재고 차감 처리
        return this.m_prisma.$transaction(async (tx) =>
        {
            // 1. 주문 정보 갱신
            const updatedOrder = await tx.order.update(
            {
                where: { id: orderId },
                data:
                {
                    status: "PAID",
                    paymentKey: paymentKey
                },
                include:
                {
                    items: true
                }
            });

            // 2. 재고 차감 처리
            for (let i = 0; i < order.items.length; i++)
            {
                const item = order.items[i];
                if (item == null)
                {
                    continue;
                }

                // 상품 재고 감산 및 확인
                const updatedProduct = await tx.product.update(
                {
                    where: { id: item.productId },
                    data:
                    {
                        stock:
                        {
                            decrement: item.quantity
                        }
                    }
                });

                if (updatedProduct.stock < 0)
                {
                    throw new Error("[OrderService] 상품 재고가 부족합니다.");
                }

                // 옵션 정보 파싱하여 해당 옵션이 존재할 경우 재고 감산 처리
                if (item.optionInfo != null && item.optionInfo !== '')
                {
                    const optionsList = item.optionInfo.split(', ');
                    for (let j = 0; j < optionsList.length; j++)
                    {
                        const optStr = optionsList[j];
                        if (optStr == null)
                        {
                            continue;
                        }

                        const parts = optStr.split(': ');
                        if (parts.length === 2)
                        {
                            const optName = parts[0];
                            const optVal = parts[1];

                            const option = await tx.productOption.findFirst(
                            {
                                where:
                                {
                                    productId: item.productId,
                                    name: optName,
                                    value: optVal
                                }
                            });

                            if (option != null)
                            {
                                const updatedOption = await tx.productOption.update(
                                {
                                    where: { id: option.id },
                                    data:
                                    {
                                        stock:
                                        {
                                            decrement: item.quantity
                                        }
                                    }
                                });

                                if (updatedOption.stock < 0)
                                {
                                    throw new Error("[OrderService] 옵션 재고가 부족합니다.");
                                }
                            }
                        }
                    }
                }
            }

            return updatedOrder;
        });
    }
}
