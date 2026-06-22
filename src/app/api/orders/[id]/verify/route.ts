/**
 * [기능]: 결제 완료 검증 및 재고 차감 처리 API Route 데몬
 * [작성자]: 윤승종
 */
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/core/services/OrderService';

const orderService = new OrderService();

/// <summary>
/// [기능]: 결제 수단 승인 후 거래 키를 주문에 기록하고 상품 재고를 차감합니다.
/// [작성자]: 윤승종
/// [수정 날짜]: 2026-06-22
/// [마지막 수정 작성자]: 윤승종
/// [수정 내용]: 최초 구현
/// </summary>
export async function POST(
    request: NextRequest,
    context: { params: { id: string } }
)
{
    try
    {
        if (context == null)
        {
            return NextResponse.json(
            {
                success: false,
                message: "[api/orders/verify] 잘못된 경로 파라미터 요청입니다."
            },
            {
                status: 400
            });
        }

        const params = context.params;
        if (params == null)
        {
            return NextResponse.json(
            {
                success: false,
                message: "[api/orders/verify] 경로 파라미터가 누락되었습니다."
            },
            {
                status: 400
            });
        }

        const orderId = params.id;
        if (orderId == null || orderId === '')
        {
            return NextResponse.json(
            {
                success: false,
                message: "[api/orders/verify] 주문 식별키(id)가 누락되었습니다."
            },
            {
                status: 400
            });
        }

        const body = await request.json();
        if (body == null)
        {
            return NextResponse.json(
            {
                success: false,
                message: "[api/orders/verify] 결제 검증 바디 정보가 누락되었습니다."
            },
            {
                status: 400
            });
        }

        const paymentKey = body.paymentKey;
        if (paymentKey == null || paymentKey === '')
        {
            return NextResponse.json(
            {
                success: false,
                message: "[api/orders/verify] 결제 거래 키(paymentKey)는 필수 항목입니다."
            },
            {
                status: 400
            });
        }

        const confirmedOrder = await orderService.verifyAndConfirmOrder(orderId, paymentKey);

        return NextResponse.json(
        {
            success: true,
            orderId: confirmedOrder.id,
            status: confirmedOrder.status
        });
    }
    catch (error: any)
    {
        console.error("[api/orders/verify] 결제 확인 에러:", error);

        let errorMessage = "[api/orders/verify] 결제 처리 도중 에러가 발생했습니다.";
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
