/**
 * [기능]: 관리자 주문 배송 상태 변경 API 라우터
 * [작성자]: 윤승종
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
            return NextResponse.json({ error: "주문 상태 변경 실패" }, { status: 400 });
        }
        return NextResponse.json(updatedOrder);
    }
    catch (error: any)
    {
        console.error(`[PATCH /api/admin/orders/${params.id}/status] 에러 발생:`, error);
        return NextResponse.json({ error: error.message || "주문 상태 변경 실패" }, { status: 500 });
    }
}
