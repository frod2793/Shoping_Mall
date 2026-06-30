export const runtime = "edge";

/**
 * [疫꿸퀡??: ?온?귐딆쁽 ?怨밸? ??륁젟/????API ??깆뒭??
 * [?臾믨쉐??: ??쇰뱟??
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
            return NextResponse.json({ error: "?怨밸? ??륁젟 ??쎈솭" }, { status: 400 });
        }
        return NextResponse.json(product);
    }
    catch (error: any)
    {
        console.error(`[PUT /api/admin/products/${params.id}] ?癒?쑎 獄쏆뮇源?`, error);
        return NextResponse.json({ error: "?怨밸? ??륁젟 ??쎈솭" }, { status: 500 });
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
            return NextResponse.json({ message: "?怨밸????????뤿???щ빍??" });
        }
        return NextResponse.json({ error: "?怨밸? ???????쎈솭??됰뮸??덈뼄." }, { status: 400 });
    }
    catch (error: any)
    {
        console.error(`[DELETE /api/admin/products/${params.id}] ?癒?쑎 獄쏆뮇源?`, error);
        return NextResponse.json({ error: "?怨밸? ????筌ｌ꼶????쎈솭" }, { status: 500 });
    }
}


