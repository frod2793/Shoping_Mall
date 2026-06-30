export const runtime = "edge";

/**
 * [疫꿸퀡??: ?온?귐딆쁽 雅뚯눖揆 獄쏄퀣???怨밴묶 癰궰野?API ??깆뒭??
 * [?臾믨쉐??: ??쇰뱟??
 */
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/core/services/OrderService';

const orderService = new OrderService();

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
        const id = params.id;
        const { status } = await request.json();
        const updatedOrder = await orderService.updateOrderStatus(id, status);
        if (updatedOrder == null)
        {
            return NextResponse.json({ error: "雅뚯눖揆 ?怨밴묶 癰궰野???쎈솭" }, { status: 400 });
        }
        return NextResponse.json(updatedOrder);
    }
    catch (error: any)
    {
        console.error(`[PATCH /api/admin/orders/${params.id}/status] ?癒?쑎 獄쏆뮇源?`, error);
        return NextResponse.json({ error: error.message || "雅뚯눖揆 ?怨밴묶 癰궰野???쎈솭" }, { status: 500 });
    }
}


