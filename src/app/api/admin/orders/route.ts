export const runtime = "edge";

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
        console.error("[GET /api/admin/orders] ?癒?쑎 獄쏆뮇源?", error);
        return NextResponse.json({ error: "雅뚯눖揆 筌뤴뫖以?鈺곌퀬????쎈솭" }, { status: 500 });
    }
}


