/**
 * @description [기능]: 안공사 프리미엄 리디자인이 적용된 메인 상품 목록 화면 컴포넌트
 * @author 윤승종
 * @date 2026-06-29
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-29
 * @history [수정 내용]: 밋밋함을 걷어내고 입체감 있는 2열 배너, 알약 캡슐형 카테고리 탭, 정교한 상품 카드로 고도화 (노랑/분홍 파스텔 색감 적용)
 */
import Link from 'next/link';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';

export const revalidate = 0; // DB의 실시간 데이터를 노출하기 위해 캐시 비활성화

export default async function HomePage({ searchParams }: { searchParams: { category?: string } })
{
    const productRepo = new PrismaProductRepository();
    const productService = new ProductService(productRepo);

    // 카테고리 쿼리 파라미터 수신 및 필터링 적용
    const activeCategory = searchParams?.category || '';
    const products = activeCategory
        ? await productService.getProductsByCategory(activeCategory)
        : await productService.getAllProducts();

    /**
     * @description [기능]: HTML 태그를 지우고 최대 50글자 한도의 텍스트 요약을 생성합니다.
     * @author 윤승종
     * @date 2026-06-29
     */
    const func_GetCleanSummary = (html: string) =>
    {
        const clean = html.replace(/<[^>]*>/g, '');
        return clean.substring(0, 50) + (clean.length > 50 ? '...' : '');
    };

    // 알약형 캡슐 카테고리 탭용 데이터 정의 (이모지 복구)
    const categories = [
        { name: '전체', label: '전체 보기', icon: '🛍️' },
        { name: '아크릴 키링', label: '아크릴 키링', icon: '🌸' },
        { name: '비즈 스트랩', label: '비즈 스트랩', icon: '✨' },
        { name: '실버 액세서리', label: '실버 액세서리', icon: '💍' },
        { name: '감성 스마트톡', label: '스마트톡', icon: '🎀' },
        { name: '오브제 팬시', label: '오브제/팬시', icon: '🧸' }
    ];

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

            {/* 2. 알약(Pill) 형태의 카테고리 탭 내비게이션 */}
            <div style={
                {
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '36px',
                    overflowX: 'auto',
                    padding: '4px 0 12px 0',
                    borderBottom: '1px solid var(--border)'
                }
            }>
                {categories.map((cat, idx) =>
                {
                    const isActive = cat.name === '전체'
                        ? activeCategory === ''
                        : cat.name === activeCategory;

                    return (
                        <Link
                            key={idx}
                            href={cat.name === '전체' ? '/' : `/?category=${encodeURIComponent(cat.name)}`}
                            scroll={false}
                            className={`categoryTab ${isActive ? 'active' : ''}`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* 3. 프리미엄 입체 상품 카드 목록 */}
            <div id="product-list" style={{ paddingBottom: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: 0, letterSpacing: '-0.5px' }}>
                        추천 감성 소품
                    </h2>
                </div>
                
                <div className="productGrid">
                    {products.map((product) =>
                    {
                        return (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="productCard"
                            >
                                {/* 1:1 정사각형 썸네일 영역 */}
                                <div style={
                                    {
                                        width: '100%',
                                        paddingBottom: '100%',
                                        position: 'relative',
                                        backgroundColor: '#fffcf9',
                                        overflow: 'hidden'
                                    }
                                }>
                                    {/* BEST 뱃지 적용 (화사한 레몬 버터 옐로우 그라데이션) */}
                                    <div style={
                                        {
                                            position: 'absolute',
                                            top: '12px',
                                            left: '12px',
                                            backgroundColor: 'var(--accent)',
                                            backgroundImage: 'linear-gradient(135deg, var(--accent) 0%, #f3c25a 100%)',
                                            color: '#ffffff',
                                            fontSize: '10.5px',
                                            fontWeight: '700',
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            boxShadow: '0 2px 8px rgba(224, 153, 153, 0.1)',
                                            zIndex: 2,
                                            letterSpacing: '0.5px'
                                        }
                                    }>
                                        BEST
                                    </div>
                                    
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            style={
                                                {
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }
                                            }
                                        />
                                    ) : (
                                        <div style={
                                            {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--text-muted)',
                                                fontSize: '13px'
                                            }
                                        }>
                                            이미지 준비중
                                        </div>
                                    )}
                                </div>

                                {/* 카드 바디 명세 */}
                                <div style={
                                    {
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1
                                    }
                                }>
                                    {/* 카테고리 태그 분류 (로즈 핑크 매칭) */}
                                    <span style={{ fontSize: '11px', color: 'var(--primary)', marginBottom: '6px', fontWeight: '600', letterSpacing: '0.5px' }}>
                                        {product.category}
                                    </span>
                                    
                                    {/* 상품명 */}
                                    <h3 style={
                                        {
                                            margin: '0 0 8px 0',
                                            fontSize: '14.5px',
                                            fontWeight: '600',
                                            color: 'var(--foreground)',
                                            lineHeight: '1.45',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            height: '42px'
                                        }
                                    }>
                                        {product.name}
                                    </h3>
                                    
                                    {/* 상품 설명 요약 */}
                                    <p style={
                                        {
                                            margin: '0 0 16px 0',
                                            fontSize: '12px',
                                            color: 'var(--text-muted)',
                                            lineHeight: '1.5',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            height: '36px'
                                        }
                                    }>
                                        {func_GetCleanSummary(product.description || '')}
                                    </p>
                                    
                                    {/* 가격 및 할인 포인트 라인 */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px', marginTop: 'auto' }}>
                                        <span style={
                                            {
                                                fontSize: '18px',
                                                fontWeight: '800',
                                                color: 'var(--foreground)',
                                                letterSpacing: '-0.3px'
                                            }
                                        }>
                                            {product.price.toLocaleString()}
                                        </span>
                                        <span style={{ fontSize: '13.5px', color: 'var(--foreground)' }}>원</span>
                                        
                                        {/* 사랑스러운 로즈 핑크 할인 라벨 */}
                                        <span style={
                                            {
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                color: 'var(--primary)',
                                                marginLeft: 'auto'
                                            }
                                        }>
                                            15% OFF
                                        </span>
                                    </div>

                                    {/* 배송 뱃지 + 별점 조화 */}
                                    <div style={
                                        {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderTop: '1px solid var(--border)',
                                            paddingTop: '12px',
                                            marginTop: '4px'
                                        }
                                    }>
                                        {/* 버터 옐로우 별점 적용 */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', color: 'var(--accent)', fontWeight: '700' }}>
                                            <span>★ 4.9</span>
                                            <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '11px' }}>(42)</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {/* 무료배송: 핑크 톤 뱃지 */}
                                            <span style={
                                                {
                                                    fontSize: '9.5px',
                                                    fontWeight: '700',
                                                    color: 'var(--primary)',
                                                    backgroundColor: 'var(--primary-light)',
                                                    borderRadius: '4px',
                                                    padding: '2px 6px',
                                                    lineHeight: 1
                                                }
                                            }>
                                                무료배송
                                            </span>
                                            {/* 적립: 옐로우 톤 뱃지 */}
                                            <span style={
                                                {
                                                    fontSize: '9.5px',
                                                    fontWeight: '700',
                                                    color: 'var(--accent)',
                                                    backgroundColor: 'var(--accent-light)',
                                                    border: '1px solid rgba(223,180,85,0.2)',
                                                    borderRadius: '4px',
                                                    padding: '2px 6px',
                                                    lineHeight: 1
                                                }
                                            }>
                                                적립
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {products.length === 0 ? (
                    <div style={
                        {
                            textAlign: 'center',
                            padding: '100px 0',
                            color: 'var(--text-muted)',
                            fontSize: '14px'
                        }
                    }>
                        🌸 해당 카테고리에 준비된 핸드메이드 제품이 아직 없습니다.
                    </div>
                ) : null}
            </div>

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
