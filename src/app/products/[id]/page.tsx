/**
 * @description [기능]: 상품 상세 페이지 라우터 서버 컴포넌트입니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [수정 내용]: DB 실시간 동기화를 위해 dynamic 설정을 'force-dynamic'으로 복구하고, generateStaticParams 내 중괄호 누락 및 Allman Style 교정
 */
import { notFound } from 'next/navigation';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export async function generateStaticParams()
{
    const productRepo = new PrismaProductRepository();
    const productService = new ProductService(productRepo);
    const products = await productService.getAllProducts();
    if (products == null)
    {
        return [];
    }
    return products.map((product) =>
    {
        return {
            id: product.id,
        };
    });
}

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
