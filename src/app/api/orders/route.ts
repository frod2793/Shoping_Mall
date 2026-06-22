/**
 * [기능]: 임시 주문 생성 API Route 데몬
 * [작성자]: 윤승종
 */
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/core/services/OrderService';

const orderService = new OrderService();

/// <summary>
/// [기능]: 임시 주문(결제 대기) 요청을 처리하고 생성 정보를 반환합니다.
/// [작성자]: 윤승종
/// [수정 날짜]: 2026-06-22
/// [마지막 수정 작성자]: 윤승종
/// [수정 내용]: 최초 구현
/// </summary>
export async function POST(request: NextRequest)
{
    try
    {
        const body = await request.json();
        if (body == null)
        {
            return NextResponse.json(
            {
                success: false,
                message: "[api/orders] 주문 생성 바디 정보가 누락되었습니다."
            },
            {
                status: 400
            });
        }

        const pendingOrder = await orderService.createPendingOrder(body);

        return NextResponse.json(
        {
            success: true,
            orderId: pendingOrder.id,
            totalPrice: pendingOrder.totalPrice
        });
    }
    catch (error: any)
    {
        console.error("[api/orders] 임시 주문 생성 에러:", error);

        let errorMessage = "[api/orders] 알 수 없는 내부 에러가 발생했습니다.";
        if (error != null)
        {
            if (error.message != null)
            {
                errorMessage = error.message;
            }
        }

        return NextResponse.json(
        {
            success: false,
            message: errorMessage
        },
        {
            status: 400
        });
    }
}
