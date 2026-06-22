/**
 * [기능]: 관리자 상품 수정/삭제 API 라우터
 * [작성자]: 윤승종
 */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';

const productRepo = new PrismaProductRepository();
const productService = new ProductService(productRepo);

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
        const id = params.id;
        const data = await request.json();
        const product = await productService.updateProduct(id, data);
        if (product == null)
        {
            return NextResponse.json({ error: "상품 수정 실패" }, { status: 400 });
        }
        return NextResponse.json(product);
    }
    catch (error: any)
    {
        console.error(`[PUT /api/admin/products/${params.id}] 에러 발생:`, error);
        return NextResponse.json({ error: "상품 수정 실패" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
)
{
    try
    {
        const id = params.id;
        const success = await productService.deleteProduct(id);
        if (success === true)
        {
            return NextResponse.json({ message: "상품이 삭제되었습니다." });
        }
        return NextResponse.json({ error: "상품 삭제에 실패했습니다." }, { status: 400 });
    }
    catch (error: any)
    {
        console.error(`[DELETE /api/admin/products/${params.id}] 에러 발생:`, error);
        return NextResponse.json({ error: "상품 삭제 처리 실패" }, { status: 500 });
    }
}
