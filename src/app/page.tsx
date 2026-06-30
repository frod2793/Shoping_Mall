export const runtime = 'edge';
/**
 * @description [湲곕뒫]: 硫붿씤 ?섏씠吏 ??而댄룷?뚰듃濡? ?꾩껜 ?곹뭹 紐⑸줉??媛?몄? ?뚮뜑留곹빀?덈떎.
 * @author ?ㅼ듅醫?
 * @date 2026-06-30
 * @lastModifier ?ㅼ듅醫?
 * @lastModifiedDate 2026-06-30
 * @history [?섏젙 ?댁슜]: DB ?ㅼ떆媛??숆린?붾? ?꾪빐 dynamic ?ㅼ젙??'force-dynamic'?쇰줈 蹂듦뎄
 */
import Link from 'next/link';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';
import ProductListClient from './components/ProductListClient';

export const dynamic = 'force-dynamic';

export default async function HomePage()
{
    const productRepo = new PrismaProductRepository();
    const productService = new ProductService(productRepo);
    const products = await productService.getAllProducts();

    return (
        <div className="container">
            {/* 1. 2???≪? ?ㅽ??쇱쓽 ?꾨━誘몄뾼 ?꾨줈紐⑥뀡 諛곕꼫 (?몃옉/遺꾪솉 ?뚯뒪??洹몃씪?붿뼵???곸슜) */}
            <div style={
                {
                    width: '100%',
                    backgroundColor: '#fbece8', // ?고븳 ?쇱튂 ?묓겕 踰좎씠??
                    backgroundImage: 'linear-gradient(135deg, #fbece8 0%, #fbe3cf 50%, #fbf3d5 100%)', // 遺꾪솉-?쇱튂-?몃옉 ?뚯뒪??洹몃씪?붿뼵??
                    borderRadius: '16px',
                    padding: '40px 48px',
                    marginTop: '24px',
                    marginBottom: '40px',
                    border: '1px solid rgba(224, 153, 153, 0.1)',
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '32px',
                    alignItems: 'center'
                }
            } className="heroBanner">
                {/* 醫뚯륫: ??댄? 諛??ㅽ넗由?*/}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={
                        {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'rgba(224, 153, 153, 0.15)', // ?고븳 ?묓겕 罹≪뒓 諭껋?
                            color: 'var(--primary)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700',
                            width: 'fit-content',
                            marginBottom: '16px',
                            letterSpacing: '1px'
                        }
                    }>
                        HANDMADE COLLECTION
                    </div>
                    <h1 style={
                        {
                            fontSize: '32px',
                            fontWeight: '800',
                            color: 'var(--foreground)',
                            margin: '0 0 16px 0',
                            lineHeight: '1.3',
                            letterSpacing: '-0.5px'
                        }
                    }>
                        ?쇱긽??諛섏쭩?꾩쓣 ?뷀븯??<br />
                        ?몃뱶硫붿씠??媛먯꽦 ?뚰뭹
                    </h1>
                    <p style={
                        {
                            fontSize: '14px',
                            color: 'var(--text-muted)',
                            margin: '0 0 24px 0',
                            lineHeight: '1.6',
                            maxWidth: '460px'
                        }
                    }>
                        ?ㅻ?議곕? ?뺤꽦?ㅻ젅 ??뼱???ㅼ콈濡쒖슫 鍮꾩쫰? ?곷”???꾪겕由??ㅻ쭅??留뚮굹蹂댁꽭?? ?뚯냼???쇱긽???뚯??덈뱾???곕쑜?섍퀬 ?꾧린?먭린???됰났???낇? ?쒕┰?덈떎.
                    </p>
                    <div style={{ display: 'flex' }}>
                        <Link href="#product-list" style={
                            {
                                padding: '12px 24px',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                borderRadius: '30px', /* ?κ?寃?源롮븘 ?꾨━誘몄뾼 媛먯꽦 */
                                textDecoration: 'none',
                                fontSize: '13.5px',
                                fontWeight: '600',
                                boxShadow: '0 4px 14px rgba(224, 153, 153, 0.35)', /* ?묓겕鍮?踰꾪듉 諛쒓킅 ?④낵 */
                                transition: 'background-color 0.2s'
                            }
                        }>
                            異붿쿇 ?곹뭹 援ш꼍?섍린
                        </Link>
                    </div>
                </div>

                {/* ?곗륫: ?앹꽦??而ㅼ뒪? ?쇰윭?ㅽ듃 諛곗튂 */}
                <div style={
                    {
                        width: '100%',
                        height: '280px',
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 12px 36px rgba(224, 153, 153, 0.08)'
                    }
                } className="heroImageArea">
                    <img
                        src="/images/keyring_banner.png"
                        alt="Handmade beads keyrings collection"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>

            {/* ?대씪?댁뼵???ъ씠??移댄뀒怨좊━ ??& ?곹뭹 洹몃━??*/}
            <ProductListClient products={products} />

            {/* CSS ?덉씠?꾩썐 ???誘몃뵒??荑쇰━ 二쇱엯 */}
            <style>{`
                @media (min-width: 768px) {
                    .heroBanner {
                        grid-template-columns: 1fr 1fr !important;
                    }
                    .heroImageArea {
                        height: 320px !important;
                    }
                }
            `}</style>
        </div>
    );
}

