
/**
 * [湲곕뒫]: 愿由ъ옄 ?곹뭹 ?섏젙/??젣 API ?쇱슦??
 * [?묒꽦??: ?ㅼ듅醫?
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
            return NextResponse.json({ error: "?곹뭹 ?섏젙 ?ㅽ뙣" }, { status: 400 });
        }
        return NextResponse.json(product);
    }
    catch (error: any)
    {
        console.error(`[PUT /api/admin/products/${params.id}] ?먮윭 諛쒖깮:`, error);
        return NextResponse.json({ error: "?곹뭹 ?섏젙 ?ㅽ뙣" }, { status: 500 });
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
            return NextResponse.json({ message: "?곹뭹????젣?섏뿀?듬땲??" });
        }
        return NextResponse.json({ error: "?곹뭹 ??젣???ㅽ뙣?덉뒿?덈떎." }, { status: 400 });
    }
    catch (error: any)
    {
        console.error(`[DELETE /api/admin/products/${params.id}] ?먮윭 諛쒖깮:`, error);
        return NextResponse.json({ error: "?곹뭹 ??젣 泥섎━ ?ㅽ뙣" }, { status: 500 });
    }
}

