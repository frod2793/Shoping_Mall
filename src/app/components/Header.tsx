/**
 * [기능]: 네비게이션 공통 헤더 클라이언트 컴포넌트
 * [작성자]: 윤승종
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/// <summary>
/// [기능]: 공통 상단 네비게이션바를 렌더링하고, 로컬 스토리지 장바구니 수량을 실시간 동기화하여 배지로 노출합니다.
/// [작성자]: 윤승종
/// [수정 날짜]: 2026-06-22
/// [마지막 수정 작성자]: 윤승종
/// [수정 내용]: 최초 구현
/// </summary>
export default function Header()
{
    const [cartCount, setCartCount] = useState(0);
    const [isAdminHost, setIsAdminHost] = useState(false);

    /// <summary>
    /// [기능]: 로컬 스토리지의 장바구니 목록으로부터 고유 아이템 수를 집계하여 상태에 갱신합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_UpdateCartCount = () =>
    {
        if (typeof window !== 'undefined' && window.localStorage != null)
        {
            const stored = window.localStorage.getItem('cart_items');
            if (stored != null && stored !== '')
            {
                try
                {
                    const parsed = JSON.parse(stored);
                    if (parsed != null && Array.isArray(parsed))
                    {
                        setCartCount(parsed.length);
                    }
                    else
                    {
                        setCartCount(0);
                    }
                }
                catch (e)
                {
                    console.error("[Header] 장바구니 정보 파싱 중 에러 발생:", e);
                    setCartCount(0);
                }
            }
            else
            {
                setCartCount(0);
            }
        }
    };

    useEffect(() =>
    {
        func_UpdateCartCount();

        // 관리자 호스트 여부 체크 (하이드레이션 불일치 방지)
        if (typeof window !== 'undefined')
        {
            const currentHost = window.location.host;
            const adminHost = process.env.NEXT_PUBLIC_ADMIN_HOST || 'admin.localhost:3000';
            if (currentHost === adminHost)
            {
                setIsAdminHost(true);
            }
        }

        // 장바구니 변동 커스텀 이벤트 구독
        if (typeof window !== 'undefined')
        {
            window.addEventListener('cart-updated', func_UpdateCartCount);
        }

        return () =>
        {
            if (typeof window !== 'undefined')
            {
                window.removeEventListener('cart-updated', func_UpdateCartCount);
            }
        };
    }, []);

    return (
        <header style={
            {
                backgroundColor: 'var(--card)',
                borderBottom: '1px solid var(--border)',
                padding: '16px 0',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }
        }>
            <div className="container" style={
                {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }
            }>
                <Link href="/" style={
                    {
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: 'var(--foreground)',
                        textDecoration: 'none'
                    }
                }>
                    SHOPPINGMALL
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link href="/orders/history" style={
                        {
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#4a5568',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                        }
                    }>
                        주문 조회
                    </Link>
                    <Link href="/cart" style={
                        {
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#4a5568',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'color 0.2s'
                        }
                    }>
                        <span>장바구니</span>
                        {cartCount > 0 ? (
                            <span style={
                                {
                                    backgroundColor: '#e53e3e',
                                    color: '#ffffff',
                                    borderRadius: '50%',
                                    padding: '2px 6px',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    lineHeight: 1
                                }
                            }>
                                {cartCount}
                            </span>
                        ) : null}
                    </Link>
                    {isAdminHost ? (
                        <Link href="/admin" style={
                            {
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#4a5568',
                                textDecoration: 'none',
                                transition: 'color 0.2s'
                            }
                        }>
                            관리자
                        </Link>
                    ) : null}
                </nav>
            </div>
        </header>
    );
}
