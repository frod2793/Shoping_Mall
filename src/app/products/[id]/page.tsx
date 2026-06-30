/**
 * @description [기능]: 상품 상세 페이지 라우트 서버 컴포넌트입니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] 실서버 500 에러 해결을 위해 headers의 Host 정보를 통한 실서버 여부 판별 로직 고도화
 */
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
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
    let product = null;
    const headersList = headers();
    const host = headersList.get('host') || '';
    const isCloudflarePages = host.includes('pages.dev') || process.env.CF_PAGES === 'true' || typeof (globalThis as any).EdgeRuntime !== 'undefined';

    if (isCloudflarePages)
    {
        try
        {
            const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'https://pipe-guest-formation-soc.trycloudflare.com';
            const res = await fetch(`${apiHost}/api/products/${params.id}`, { cache: 'no-store' });
            if (res.ok)
            {
                product = await res.json();
            }
        }
        catch (err)
        {
            console.error(`[ProductDetailPage] 원격 API 터널링 조회 실패 (ID: ${params.id}):`, err);
        }
    }
    else
    {
        const productRepo = new PrismaProductRepository();
        const productService = new ProductService(productRepo);
        product = await productService.getProductById(params.id);
    }

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
