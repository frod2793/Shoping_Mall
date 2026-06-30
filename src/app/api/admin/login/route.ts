export const runtime = "edge";

/**
 * [疫꿸퀡??: ?온?귐딆쁽 嚥≪뮄???筌ｌ꼶??API ??깆뒭??
 * [?臾믨쉐??: ??쇰뱟??
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
            return NextResponse.json({ error: "??李???癒?뮉 ??쑬?甕곕뜇?뉐첎? ??而?몴?? ??꾧탢??亦낅슦釉????곷뮸??덈뼄." }, { status: 401 });
        }

        const response = NextResponse.json({ message: "嚥≪뮄????源껊궗" });
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
        console.error("[POST /api/admin/login] ?癒?쑎 獄쏆뮇源?", error);
        return NextResponse.json({ error: "嚥≪뮄???餓???뺤쒔 ?癒?쑎揶쎛 獄쏆뮇源??됰뮸??덈뼄." }, { status: 500 });
    }
}


