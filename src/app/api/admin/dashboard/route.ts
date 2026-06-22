/**
 * [기능]: 관리자 대시보드 통계 데이터 제공 API 라우터
 * [작성자]: 윤승종
 */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET()
{
    try
    {
        // 집계: PENDING_PAYMENT가 아닌 결제된 주문들의 totalPrice 합산
        const paidOrders = await prisma.order.findMany(
        {
            where:
            {
                NOT:
                {
                    status: "PENDING_PAYMENT"
                }
            }
        });

        let totalSales = 0;
        for (let i = 0; i < paidOrders.length; i++)
        {
            totalSales += paidOrders[i].totalPrice;
        }

        // 신규 주문 건수 (상태가 PAID인 주문)
        const newOrdersCount = await prisma.order.count(
        {
            where:
            {
                status: "PAID"
            }
        });

        // 미배송 주문 건수 (상태가 PAID 또는 SHIPPED인 주문)
        const undeliveredCount = await prisma.order.count(
        {
            where:
            {
                status:
                {
                    in: ["PAID", "SHIPPED"]
                }
            }
        });

        return NextResponse.json(
        {
            totalSales,
            newOrdersCount,
            undeliveredCount
        });
    }
    catch (error: any)
    {
        console.error("[GET /api/admin/dashboard] 에러 발생:", error);
        return NextResponse.json({ error: "통계 데이터 조회 실패" }, { status: 500 });
    }
}
