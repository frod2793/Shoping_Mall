/**
 * @description [기능]: 상품 상세 페이지 라우트 서버 컴포넌트입니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [수정 내용]: DB 실시간 동기화를 위해 dynamic 설정을 'force-dynamic'으로 변경하고, 빌드 타임의 불필요한 DB 의존성을 차단하기 위해 generateStaticParams 함수를 영구 제거했습니다.
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
    let product = null;
    const isCloudflarePages = process.env.CF_PAGES === 'true' || typeof (globalThis as any).EdgeRuntime !== 'undefined';

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
