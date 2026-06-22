/**
 * [기능]: 상품 상세 페이지 라우터 (서버 컴포넌트)
 * [작성자]: 윤승종
 */
import { notFound } from 'next/navigation';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 0;

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
