/**
 * [기능]: 관리자 페이지 공통 레이아웃 (사이드바 및 내용 영역)
 * [작성자]: 윤승종
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
)
{
    const router = useRouter();
    const pathname = usePathname();
    const [apiHost, setApiHost] = useState('');

    useEffect(() => {
        const savedHost = localStorage.getItem('admin_api_host') || '';
        setApiHost(savedHost);
    }, []);

    const getFullUrl = (path: string) => {
        const host = apiHost ? apiHost.replace(/\/$/, '') : '';
        return `${host}${path}`;
    };

    const func_OnLogoutClick = async () =>
    {
        try
        {
            const res = await fetch(getFullUrl('/api/admin/logout'), { method: 'POST' });
            if (res.ok)
            {
                localStorage.removeItem('admin_api_host');
                alert("로그아웃 되었습니다.");
                router.push('/');
                router.refresh();
            }
        }
        catch (e)
        {
            console.error("[AdminLayout] 로그아웃 중 에러 발생:", e);
        }
    };

    const func_GetLinkStyle = (targetPath: string) =>
    {
        const isActive = pathname === targetPath || (targetPath !== '/admin' && pathname.startsWith(targetPath));

        return {
            display: 'block',
            padding: '12px 16px',
            borderRadius: '6px',
            textDecoration: 'none',
            color: 'var(--foreground)',
            fontWeight: isActive ? '600' : 'normal',
            backgroundColor: isActive ? 'var(--border)' : 'transparent',
            opacity: isActive ? 1 : 0.7,
            transition: 'all 0.2s ease-in-out'
        };
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', marginTop: '-32px' }}>
            {/* 사이드바 */}
            <aside style={
                {
                    width: '240px',
                    backgroundColor: 'var(--card)',
                    borderRight: '1px solid var(--border)',
                    padding: '24px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }
            }>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px', paddingLeft: '8px' }}>
                    관리자 메뉴
                </div>
                <a href="/admin" style={func_GetLinkStyle('/admin')}>
                    대시보드
                </a>
                <a href="/admin/products" style={func_GetLinkStyle('/admin/products')}>
                    상품 관리
                </a>
                <a href="/admin/orders" style={func_GetLinkStyle('/admin/orders')}>
                    주문 관리
                </a>
                <button 
                    onClick={func_OnLogoutClick}
                    style={
                        {
                            marginTop: 'auto',
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            color: 'var(--foreground)',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }
                    }
                >
                    로그아웃
                </button>
            </aside>

            {/* 본문 영역 */}
            <section style={{ flexGrow: 1, padding: '32px 40px', backgroundColor: 'var(--background)' }}>
                {children}
            </section>
        </div>
    );
}
