export const runtime = 'edge';
/**
 * [湲곕뒫]: ?뱀젙 ID ?곹뭹 ?곸꽭 ?뺣낫 議고쉶 API ?쇱슦??
 * [?묒꽦??: ?ㅼ듅醫?
 */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';

const productRepo = new PrismaProductRepository();
const productService = new ProductService(productRepo);

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
        const id = params.id;
        const product = await productService.getProductById(id);
        if (product == null)
        {
            return NextResponse.json({ error: "議댁옱?섏? ?딅뒗 ?곹뭹?낅땲??" }, { status: 404 });
        }
        return NextResponse.json(product);
    }
    catch (error: any)
    {
        console.error(`[GET /api/products/${params.id}] ?먮윭 諛쒖깮:`, error);
        return NextResponse.json({ error: "?곹뭹 ?곸꽭 議고쉶 ?ㅽ뙣" }, { status: 500 });
    }
}

