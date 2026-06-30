export const runtime = "edge";

/**
 * [疫꿸퀡??: ?諭??ID ?怨밸? ?怨멸쉭 ?類ｋ궖 鈺곌퀬??API ??깆뒭??
 * [?臾믨쉐??: ??쇰뱟??
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
            return NextResponse.json({ error: "鈺곕똻???? ??낅뮉 ?怨밸???낅빍??" }, { status: 404 });
        }
        return NextResponse.json(product);
    }
    catch (error: any)
    {
        console.error(`[GET /api/products/${params.id}] ?癒?쑎 獄쏆뮇源?`, error);
        return NextResponse.json({ error: "?怨밸? ?怨멸쉭 鈺곌퀬????쎈솭" }, { status: 500 });
    }
}


