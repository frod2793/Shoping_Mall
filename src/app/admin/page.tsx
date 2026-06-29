/**
 * [기능]: 관리자 대시보드 화면 UI 컴포넌트 (클라이언트)
 * [작성자]: 윤승종
 */
'use client';

import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

export default function AdminDashboardPage()
{
    const [totalSales, setTotalSales] = useState(0);
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [undeliveredCount, setUndeliveredCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        const func_FetchDashboardData = async () =>
        {
            try
            {
                const savedHost = localStorage.getItem('admin_api_host') || '';
                const host = savedHost.replace(/\/$/, '');
                const res = await fetch(`${host}/api/admin/dashboard`);
                if (res.ok === true)
                {
                    const data = await res.json();
                    if (data != null)
                    {
                        setTotalSales(data.totalSales || 0);
                        setNewOrdersCount(data.newOrdersCount || 0);
                        setUndeliveredCount(data.undeliveredCount || 0);
                    }
                }
            }
            catch (e)
            {
                console.error("[AdminDashboardPage] 통계 데이터 로드 실패:", e);
            }
            finally
            {
                setLoading(false);
            }
        };

        func_FetchDashboardData();
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>대시보드</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px', marginBottom: '24px' }}>쇼핑몰 현황 통계 요약</p>

            {loading ? (
                <p>로딩 중...</p>
            ) : (
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <span className={styles.cardLabel}>총 매출액</span>
                        <span className={styles.cardValue} style={{ color: 'var(--accent)' }}>
                            {totalSales.toLocaleString()}원
                        </span>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.cardLabel}>신규 주문 건수</span>
                        <span className={styles.cardValue}>{newOrdersCount}건</span>
                    </div>
                    <div className={styles.card}>
                        <span className={styles.cardLabel}>미배송 주문 건수</span>
                        <span className={styles.cardValue}>{undeliveredCount}건</span>
                    </div>
                </div>
            )}

            <h2 className={styles.sectionTitle}>관리자 시스템 정보</h2>
            <div className={styles.infoBox}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div><strong>역할:</strong> 쇼핑몰 수석 관리자 (ADMIN)</div>
                    <div><strong>DB 종류:</strong> PostgreSQL (Neon Serverless)</div>
                    <div><strong>시스템 환경:</strong> Next.js App Router + Cloudflare Pages</div>
                    <div><strong>터널:</strong> Cloudflare Tunnel (cloudflared)</div>
                </div>
            </div>
        </div>
    );
}
