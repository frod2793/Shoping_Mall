export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma';

/// <summary>
/// [湲곕뒫]: 鍮꾪쉶??二쇰Ц???뺣낫(?대쫫, ?곕씫泥? 議고쉶 鍮꾨?踰덊샇)瑜?留ㅼ묶?섏뿬 ?쇱튂?섎뒗 二쇰Ц 紐⑸줉??議고쉶?⑸땲??
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
                message: "[api/orders/track] 議고쉶 ?몄쬆 ?뺣낫媛 ?꾨씫?섏뿀?듬땲??"
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
                message: "[api/orders/track] 二쇰Ц???대쫫? ?꾩닔?낅땲??"
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
                message: "[api/orders/track] 二쇰Ц???곕씫泥섎뒗 ?꾩닔?낅땲??"
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
                message: "[api/orders/track] 二쇰Ц議고쉶 鍮꾨?踰덊샇???꾩닔?낅땲??"
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

        console.log(`[api/orders/track] 鍮꾪쉶??二쇰Ц議고쉶 ?깃났. 二쇰Ц 嫄댁닔: ${orders.length}`);

        return NextResponse.json({
            success: true,
            orders: orders
        });
    }
    catch (error: any)
    {
        console.error("[api/orders/track] 鍮꾪쉶??二쇰Ц 議고쉶 以??먮윭 諛쒖깮:", error);
        let errMsg = "[api/orders/track] ?대? 泥섎━ ?ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.";
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

