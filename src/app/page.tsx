/**
 * @description [기능]: 메인 페이지 홈 컴포넌트로, 전체 상품 목록을 가져와 렌더링합니다.
 * @author 윤승종
 * @date 2026-06-30
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-30
 * @history [수정 내용]: DB 실시간 동기화를 위해 dynamic 설정을 'force-dynamic'으로 복구
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
            {/* 1. 2열 잡지 스타일의 프리미엄 프로모션 배너 (노랑/분홍 파스텔 그라디언트 적용) */}
            <div style={
                {
                    width: '100%',
                    backgroundColor: '#fbece8', // 연한 피치 핑크 베이스
                    backgroundImage: 'linear-gradient(135deg, #fbece8 0%, #fbe3cf 50%, #fbf3d5 100%)', // 분홍-피치-노랑 파스텔 그라디언트
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
                {/* 좌측: 타이틀 및 스토리 */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={
                        {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'rgba(224, 153, 153, 0.15)', // 연한 핑크 캡슐 뱃지
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
                        일상에 반짝임을 더하는,<br />
                        핸드메이드 감성 소품
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
                        오밀조밀 정성스레 엮어낸 다채로운 비즈와 영롱한 아크릴 키링을 만나보세요. 소소한 일상의 소지품들에 따뜻하고 아기자기한 행복을 입혀 드립니다.
                    </p>
                    <div style={{ display: 'flex' }}>
                        <Link href="#product-list" style={
                            {
                                padding: '12px 24px',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                borderRadius: '30px', /* 둥글게 깎아 프리미엄 감성 */
                                textDecoration: 'none',
                                fontSize: '13.5px',
                                fontWeight: '600',
                                boxShadow: '0 4px 14px rgba(224, 153, 153, 0.35)', /* 핑크빛 버튼 발광 효과 */
                                transition: 'background-color 0.2s'
                            }
                        }>
                            추천 상품 구경하기
                        </Link>
                    </div>
                </div>

                {/* 우측: 생성한 커스텀 일러스트 배치 */}
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

            {/* 클라이언트 사이드 카테고리 탭 & 상품 그리드 */}
            <ProductListClient products={products} />

            {/* CSS 레이아웃 대응 미디어 쿼리 주입 */}
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
