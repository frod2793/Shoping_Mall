export const runtime = 'edge';
/**
 * [湲곕뒫]: 愿由ъ옄 二쇰Ц 諛곗넚 ?곹깭 蹂寃?API ?쇱슦??
 * [?묒꽦??: ?ㅼ듅醫?
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
            return NextResponse.json({ error: "二쇰Ц ?곹깭 蹂寃??ㅽ뙣" }, { status: 400 });
        }
        return NextResponse.json(updatedOrder);
    }
    catch (error: any)
    {
        console.error(`[PATCH /api/admin/orders/${params.id}/status] ?먮윭 諛쒖깮:`, error);
        return NextResponse.json({ error: error.message || "二쇰Ц ?곹깭 蹂寃??ㅽ뙣" }, { status: 500 });
    }
}

