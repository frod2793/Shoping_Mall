/**
 * [기능]: 관리자 상품 등록 API 라우터
 * [작성자]: 윤승종
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
        console.error("[POST /api/admin/products] 에러 발생:", error);
        return NextResponse.json({ error: "상품 등록 실패" }, { status: 500 });
    }
}
