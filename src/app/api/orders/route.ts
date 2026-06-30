
/**
 * [湲곕뒫]: ?꾩떆 二쇰Ц ?앹꽦 API Route ?곕が
 * [?묒꽦??: ?ㅼ듅醫?
 */
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/core/services/OrderService';

const orderService = new OrderService();

/// <summary>
/// [湲곕뒫]: ?꾩떆 二쇰Ц(寃곗젣 ?湲? ?붿껌??泥섎━?섍퀬 ?앹꽦 ?뺣낫瑜?諛섑솚?⑸땲??
/// [?묒꽦??: ?ㅼ듅醫?
/// [?섏젙 ?좎쭨]: 2026-06-22
/// [留덉?留??섏젙 ?묒꽦??: ?ㅼ듅醫?
/// [?섏젙 ?댁슜]: 理쒖큹 援ы쁽
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
                message: "[api/orders] 二쇰Ц ?앹꽦 諛붾뵒 ?뺣낫媛 ?꾨씫?섏뿀?듬땲??"
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
        console.error("[api/orders] ?꾩떆 二쇰Ц ?앹꽦 ?먮윭:", error);

        let errorMessage = "[api/orders] ?????녿뒗 ?대? ?먮윭媛 諛쒖깮?덉뒿?덈떎.";
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

