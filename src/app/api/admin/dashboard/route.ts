export const runtime = "edge";

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma';

export async function GET()
{
    try
    {
        // 筌욌쵌?? PENDING_PAYMENT揶쎛 ?袁⑤빒 野껉퀣???雅뚯눖揆??쇱벥 totalPrice ??밴텦
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

        // ?醫됲뇣 雅뚯눖揆 椰꾨똻??(?怨밴묶揶쎛 PAID??雅뚯눖揆)
        const newOrdersCount = await prisma.order.count(
        {
            where:
            {
                status: "PAID"
            }
        });

        // 沃섎챶媛??雅뚯눖揆 椰꾨똻??(?怨밴묶揶쎛 PAID ?癒?뮉 SHIPPED??雅뚯눖揆)
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
        console.error("[GET /api/admin/dashboard] ?癒?쑎 獄쏆뮇源?", error);
        return NextResponse.json({ error: "?????怨쀬뵠??鈺곌퀬????쎈솭" }, { status: 500 });
    }
}


