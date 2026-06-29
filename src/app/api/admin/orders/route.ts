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
        console.error("[GET /api/admin/orders] 에러 발생:", error);
        return NextResponse.json({ error: "주문 목록 조회 실패" }, { status: 500 });
    }
}
