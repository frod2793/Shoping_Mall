
/**
 * [湲곕뒫]: 愿由ъ옄 ?곹뭹 ?깅줉 API ?쇱슦??
 * [?묒꽦??: ?ㅼ듅醫?
 */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';

const productRepo = new PrismaProductRepository();
const productService = new ProductService(productRepo);

export async function POST(request: NextRequest)
{
    try
    {
        const data = await request.json();
        const product = await productService.createProduct(data);
        return NextResponse.json(product, { status: 201 });
    }
    catch (error: any)
    {
        console.error("[POST /api/admin/products] ?먮윭 諛쒖깮:", error);
        return NextResponse.json({ error: "?곹뭹 ?깅줉 ?ㅽ뙣" }, { status: 500 });
    }
}

