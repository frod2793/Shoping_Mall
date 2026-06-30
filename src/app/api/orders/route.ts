export const runtime = "edge";

/**
 * [疫꿸퀡??: ?袁⑸뻻 雅뚯눖揆 ??밴쉐 API Route ?怨뺛걣
 * [?臾믨쉐??: ??쇰뱟??
 */
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/core/services/OrderService';

const orderService = new OrderService();

/// <summary>
/// [疫꿸퀡??: ?袁⑸뻻 雅뚯눖揆(野껉퀣????疫? ?遺욧퍕??筌ｌ꼶???랁???밴쉐 ?類ｋ궖??獄쏆꼹???몃빍??
/// [?臾믨쉐??: ??쇰뱟??
/// [??륁젟 ?醫롮?]: 2026-06-22
/// [筌띾뜆?筌???륁젟 ?臾믨쉐??: ??쇰뱟??
/// [??륁젟 ??곸뒠]: 筌ㅼ뮇???닌뗭겱
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
                message: "[api/orders] 雅뚯눖揆 ??밴쉐 獄쏅뗀逾??類ｋ궖揶쎛 ?袁⑥뵭??뤿???щ빍??"
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
        console.error("[api/orders] ?袁⑸뻻 雅뚯눖揆 ??밴쉐 ?癒?쑎:", error);

        let errorMessage = "[api/orders] ??????용뮉 ??? ?癒?쑎揶쎛 獄쏆뮇源??됰뮸??덈뼄.";
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


