export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';

const productRepo = new PrismaProductRepository();
const productService = new ProductService(productRepo);

export async function GET()
{
    try
    {
        const products = await productService.getAllProducts();
        return NextResponse.json(products);
    }
    catch (error: any)
    {
        console.error("[GET /api/products] 에러 발생:", error);
        return NextResponse.json({ error: "상품 조회 실패" }, { status: 500 });
    }
}
