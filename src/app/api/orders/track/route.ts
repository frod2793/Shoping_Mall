export const runtime = "edge";

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma';

/// <summary>
/// [疫꿸퀡??: ??쑵???雅뚯눖揆???類ｋ궖(??已? ?怨뺤뵭筌? 鈺곌퀬????쑬?甕곕뜇????筌띲끉臾??뤿연 ??깊뒄??롫뮉 雅뚯눖揆 筌뤴뫖以??鈺곌퀬???몃빍??
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
                message: "[api/orders/track] 鈺곌퀬???紐꾩쵄 ?類ｋ궖揶쎛 ?袁⑥뵭??뤿???щ빍??"
            },
            {
                status: 400
            });
        }

        const nonMemberName = body.nonMemberName;
        const nonMemberPhone = body.nonMemberPhone;
        const nonMemberPassword = body.nonMemberPassword;

        if (nonMemberName == null || nonMemberName === '')
        {
            return NextResponse.json(
            {
                success: false,
                message: "[api/orders/track] 雅뚯눖揆????已?? ?袁⑸땾??낅빍??"
            },
            {
                status: 400
            });
        }
        if (nonMemberPhone == null || nonMemberPhone === '')
        {
            return NextResponse.json(
            {
                success: false,
                message: "[api/orders/track] 雅뚯눖揆???怨뺤뵭筌ｌ꼶???袁⑸땾??낅빍??"
            },
            {
                status: 400
            });
        }
        if (nonMemberPassword == null || nonMemberPassword === '')
        {
            return NextResponse.json(
            {
                success: false,
                message: "[api/orders/track] 雅뚯눖揆鈺곌퀬????쑬?甕곕뜇????袁⑸땾??낅빍??"
            },
            {
                status: 400
            });
        }

        const orders = await prisma.order.findMany({
            where: {
                nonMemberName: nonMemberName,
                nonMemberPhone: nonMemberPhone,
                nonMemberPassword: nonMemberPassword
            },
            include: {
                items: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`[api/orders/track] ??쑵???雅뚯눖揆鈺곌퀬???源껊궗. 雅뚯눖揆 椰꾨똻?? ${orders.length}`);

        return NextResponse.json({
            success: true,
            orders: orders
        });
    }
    catch (error: any)
    {
        console.error("[api/orders/track] ??쑵???雅뚯눖揆 鈺곌퀬??餓??癒?쑎 獄쏆뮇源?", error);
        let errMsg = "[api/orders/track] ??? 筌ｌ꼶????살첒揶쎛 獄쏆뮇源??됰뮸??덈뼄.";
        if (error != null && error.message != null)
        {
            errMsg = error.message;
        }
        return NextResponse.json(
        {
            success: false,
            message: errMsg
        },
        {
            status: 500
        });
    }
    finally
    {
        await prisma.$disconnect();
    }
}


