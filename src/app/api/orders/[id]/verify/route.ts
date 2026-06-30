export const runtime = "edge";

/**
 * [疫꿸퀡??: 野껉퀣???袁⑥┷ 野꺜筌?獄?????筌△몿而?筌ｌ꼶??API Route ?怨뺛걣
 * [?臾믨쉐??: ??쇰뱟??
 */
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/core/services/OrderService';

const orderService = new OrderService();

/// <summary>
/// [疫꿸퀡??: 野껉퀣????롫뼊 ?諭????椰꾧퀡????? 雅뚯눖揆??疫꿸퀡以??랁??怨밸? ???х몴?筌△몿而??몃빍??
/// [?臾믨쉐??: ??쇰뱟??
/// [??륁젟 ?醫롮?]: 2026-06-22
/// [筌띾뜆?筌???륁젟 ?臾믨쉐??: ??쇰뱟??
/// [??륁젟 ??곸뒠]: 筌ㅼ뮇???닌뗭겱
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
                message: "[api/orders/verify] ??롢걵??野껋럥以????뵬沃섎챸苑??遺욧퍕??낅빍??"
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
                message: "[api/orders/verify] 野껋럥以????뵬沃섎챸苑ｅ첎? ?袁⑥뵭??뤿???щ빍??"
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
                message: "[api/orders/verify] 雅뚯눖揆 ??명??id)揶쎛 ?袁⑥뵭??뤿???щ빍??"
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
                message: "[api/orders/verify] 野껉퀣??野꺜筌?獄쏅뗀逾??類ｋ궖揶쎛 ?袁⑥뵭??뤿???щ빍??"
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
                message: "[api/orders/verify] 野껉퀣??椰꾧퀡????paymentKey)???袁⑸땾 ?????낅빍??"
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
        console.error("[api/orders/verify] 野껉퀣???類ㅼ뵥 ?癒?쑎:", error);

        let errorMessage = "[api/orders/verify] 野껉퀣??筌ｌ꼶???袁⑹㉦ ?癒?쑎揶쎛 獄쏆뮇源??됰뮸??덈뼄.";
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


