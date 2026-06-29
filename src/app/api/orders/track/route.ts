export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/database/prisma';

/// <summary>
/// [기능]: 비회원 주문자 정보(이름, 연락처, 조회 비밀번호)를 매칭하여 일치하는 주문 목록을 조회합니다.
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
                message: "[api/orders/track] 조회 인증 정보가 누락되었습니다."
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
                message: "[api/orders/track] 주문자 이름은 필수입니다."
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
                message: "[api/orders/track] 주문자 연락처는 필수입니다."
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
                message: "[api/orders/track] 주문조회 비밀번호는 필수입니다."
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

        console.log(`[api/orders/track] 비회원 주문조회 성공. 주문 건수: ${orders.length}`);

        return NextResponse.json({
            success: true,
            orders: orders
        });
    }
    catch (error: any)
    {
        console.error("[api/orders/track] 비회원 주문 조회 중 에러 발생:", error);
        let errMsg = "[api/orders/track] 내부 처리 오류가 발생했습니다.";
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
