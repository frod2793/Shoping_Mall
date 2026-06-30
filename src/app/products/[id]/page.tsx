export const runtime = 'edge';
/**
 * @description [湲곕뒫]: ?곹뭹 ?곸꽭 ?섏씠吏 ?쇱슦???쒕쾭 而댄룷?뚰듃?낅땲??
 * @author ?ㅼ듅醫? * @date 2026-06-30
 * @lastModifier ?ㅼ듅醫? * @lastModifiedDate 2026-06-30
 * @history [?섏젙 ?댁슜]: DB ?ㅼ떆媛??숆린?붾? ?꾪빐 dynamic ?ㅼ젙??'force-dynamic'?쇰줈 蹂듦뎄?섍퀬, generateStaticParams ?⑥닔瑜??꾩쟾???쒓굅?섏뿬 鍮뚮뱶 ???DB ?섏〈??李⑤떒
 */
import { notFound } from 'next/navigation';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage(
    {
        params,
    }: {
        params: { id: string };
    }
)
{
    const productRepo = new PrismaProductRepository();
    const productService = new ProductService(productRepo);
    const product = await productService.getProductById(params.id);

    if (product == null)
    {
        return notFound();
    }

    return (
        <div className="container">
            <ProductDetailClient product={product} />
        </div>
    );
}

