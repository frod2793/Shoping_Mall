export const runtime = "edge";

/**
 * [疫꿸퀡??: ?온?귐딆쁽 ?怨밸? ?源낆쨯 API ??깆뒭??
 * [?臾믨쉐??: ??쇰뱟??
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
        console.error("[POST /api/admin/products] ?癒?쑎 獄쏆뮇源?", error);
        return NextResponse.json({ error: "?怨밸? ?源낆쨯 ??쎈솭" }, { status: 500 });
    }
}


