
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { OrderService } from '@/core/services/OrderService';

const orderService = new OrderService();

export async function GET()
{
    try
    {
        const orders = await orderService.getAllOrders();
        return NextResponse.json(orders);
    }
    catch (error: any)
    {
        console.error("[GET /api/admin/orders] ?먮윭 諛쒖깮:", error);
        return NextResponse.json({ error: "二쇰Ц 紐⑸줉 議고쉶 ?ㅽ뙣" }, { status: 500 });
    }
}

