export const runtime = "edge";
/**
 * @description [湲곕뒫]: ?곹뭹 ?곸꽭 ?섏씠吏 ?쇱슦???쒕쾭 而댄룷?뚰듃?낅땲??
 * @author ?ㅼ듅醫?
 * @date 2026-06-30
 * @lastModifier ?ㅼ듅醫?
 * @lastModifiedDate 2026-06-30
 * @history [2026-06-30] ?ㅼ꽌踰?500 ?먮윭 ?닿껐???꾪빐 headers??Host ?뺣낫瑜??듯븳 ?ㅼ꽌踰??щ? ?먮퀎 濡쒖쭅 怨좊룄??
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
            console.error(`[ProductDetailPage] ?먭꺽 API ?곕꼸留?議고쉶 ?ㅽ뙣 (ID: ${params.id}):`, err);
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

