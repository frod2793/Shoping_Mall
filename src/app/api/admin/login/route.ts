
/**
 * [湲곕뒫]: 愿由ъ옄 濡쒓렇??泥섎━ API ?쇱슦??
 * [?묒꽦??: ?ㅼ듅醫?
 */
import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/core/services/AdminService';

const adminService = new AdminService();

export async function POST(request: NextRequest)
{
    try
    {
        const { email, password } = await request.json();
        const token = await adminService.login(email, password);

        if (token == null)
        {
            return NextResponse.json({ error: "?대찓???먮뒗 鍮꾨?踰덊샇媛 ?щ컮瑜댁? ?딄굅??沅뚰븳???놁뒿?덈떎." }, { status: 401 });
        }

        const response = NextResponse.json({ message: "濡쒓렇???깃났" });
        // Set HttpOnly cookie
        response.cookies.set('admin_token', token,
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 2 // 2 hours
        });

        return response;
    }
    catch (error: any)
    {
        console.error("[POST /api/admin/login] ?먮윭 諛쒖깮:", error);
        return NextResponse.json({ error: "濡쒓렇??以??쒕쾭 ?먮윭媛 諛쒖깮?덉뒿?덈떎." }, { status: 500 });
    }
}

