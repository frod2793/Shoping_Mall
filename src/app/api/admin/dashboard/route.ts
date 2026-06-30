export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma';

export async function GET()
{
    try
    {
        // 吏묎퀎: PENDING_PAYMENT媛 ?꾨땶 寃곗젣??二쇰Ц?ㅼ쓽 totalPrice ?⑹궛
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

        // ?좉퇋 二쇰Ц 嫄댁닔 (?곹깭媛 PAID??二쇰Ц)
        const newOrdersCount = await prisma.order.count(
        {
            where:
            {
                status: "PAID"
            }
        });

        // 誘몃같??二쇰Ц 嫄댁닔 (?곹깭媛 PAID ?먮뒗 SHIPPED??二쇰Ц)
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
        console.error("[GET /api/admin/dashboard] ?먮윭 諛쒖깮:", error);
        return NextResponse.json({ error: "?듦퀎 ?곗씠??議고쉶 ?ㅽ뙣" }, { status: 500 });
    }
}

