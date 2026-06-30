
/**
 * [湲곕뒫]: 寃곗젣 ?꾨즺 寃利?諛??ш퀬 李④컧 泥섎━ API Route ?곕が
 * [?묒꽦??: ?ㅼ듅醫?
 */
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/core/services/OrderService';

const orderService = new OrderService();

/// <summary>
/// [湲곕뒫]: 寃곗젣 ?섎떒 ?뱀씤 ??嫄곕옒 ?ㅻ? 二쇰Ц??湲곕줉?섍퀬 ?곹뭹 ?ш퀬瑜?李④컧?⑸땲??
/// [?묒꽦??: ?ㅼ듅醫?
/// [?섏젙 ?좎쭨]: 2026-06-22
/// [留덉?留??섏젙 ?묒꽦??: ?ㅼ듅醫?
/// [?섏젙 ?댁슜]: 理쒖큹 援ы쁽
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
                message: "[api/orders/verify] ?섎せ??寃쎈줈 ?뚮씪誘명꽣 ?붿껌?낅땲??"
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
                message: "[api/orders/verify] 寃쎈줈 ?뚮씪誘명꽣媛 ?꾨씫?섏뿀?듬땲??"
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
                message: "[api/orders/verify] 二쇰Ц ?앸퀎??id)媛 ?꾨씫?섏뿀?듬땲??"
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
                message: "[api/orders/verify] 寃곗젣 寃利?諛붾뵒 ?뺣낫媛 ?꾨씫?섏뿀?듬땲??"
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
                message: "[api/orders/verify] 寃곗젣 嫄곕옒 ??paymentKey)???꾩닔 ??ぉ?낅땲??"
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
        console.error("[api/orders/verify] 寃곗젣 ?뺤씤 ?먮윭:", error);

        let errorMessage = "[api/orders/verify] 寃곗젣 泥섎━ ?꾩쨷 ?먮윭媛 諛쒖깮?덉뒿?덈떎.";
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

