'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/core/domains/Product';

interface ProductListClientProps {
    products: Product[];
}

export default function ProductListClient({ products }: ProductListClientProps) {
    const [activeCategory, setActiveCategory] = useState<string>('전체');

    const categories = [
        { name: '전체', label: '전체 보기', icon: '🛍️' },
        { name: '아크릴 키링', label: '아크릴 키링', icon: '🌸' },
        { name: '비즈 스트랩', label: '비즈 스트랩', icon: '✨' },
        { name: '실버 액세서리', label: '실버 액세서리', icon: '💍' },
        { name: '감성 스마트톡', label: '스마트톡', icon: '🎀' },
        { name: '오브제 팬시', label: '오브제/팬시', icon: '🧸' }
    ];

    const filteredProducts = activeCategory === '전체'
        ? products
        : products.filter(p => p.category === activeCategory);

    const func_GetCleanSummary = (html: string) => {
        const clean = html.replace(/<[^>]*>/g, '');
        return clean.substring(0, 50) + (clean.length > 50 ? '...' : '');
    };

    return (
        <div>
            {/* 1. 알약(Pill) 형태의 카테고리 탭 내비게이션 */}
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
                {categories.map((cat, idx) => {
                    const isActive = cat.name === activeCategory;

                    return (
                        <button
                            key={idx}
                            onClick={() => setActiveCategory(cat.name)}
                            style={{
                                border: 'none',
                                cursor: 'pointer',
                                background: 'none',
                                outline: 'none'
                            }}
                            className={`categoryTab ${isActive ? 'active' : ''}`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 2. 프리미엄 입체 상품 카드 목록 */}
            <div id="product-list" style={{ paddingBottom: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: 0, letterSpacing: '-0.5px' }}>
                        추천 감성 소품
                    </h2>
                </div>
                
                <div className="productGrid">
                    {filteredProducts.map((product) => {
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

                {filteredProducts.length === 0 ? (
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
        </div>
    );
}
