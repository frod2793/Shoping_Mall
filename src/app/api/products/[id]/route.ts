/**
 * [기능]: 특정 ID 상품 상세 정보 조회 API 라우터
 * [작성자]: 윤승종
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
            return NextResponse.json({ error: "존재하지 않는 상품입니다." }, { status: 404 });
        }
        return NextResponse.json(product);
    }
    catch (error: any)
    {
        console.error(`[GET /api/products/${params.id}] 에러 발생:`, error);
        return NextResponse.json({ error: "상품 상세 조회 실패" }, { status: 500 });
    }
}
