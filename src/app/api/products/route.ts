export const runtime = "edge";

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
        console.error("[GET /api/products] ?癒?쑎 獄쏆뮇源?", error);
        return NextResponse.json({ error: "?怨밸? 鈺곌퀬????쎈솭" }, { status: 500 });
    }
}


