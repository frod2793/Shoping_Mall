import { prisma } from '@/infrastructure/database/prisma';
import styles from './dashboard.module.css';

export const revalidate = 0; // 대시보드 데이터 실시간 반영을 위해 캐시 비활성화

export default async function AdminDashboardPage()
{
    let totalSales = 0;
    let newOrdersCount = 0;
    let undeliveredCount = 0;

    try
    {
        // 집계: PENDING_PAYMENT가 아닌 결제된 주문들의 totalPrice 합산
        const paidOrders = await prisma.order.findMany(
        {
            where:
            {
                NOT:
                {
                    status: "PENDING_PAYMENT"
                }
            }
        });

        if (paidOrders != null)
        {
            for (let i = 0; i < paidOrders.length; i++)
            {
                totalSales += paidOrders[i].totalPrice;
            }
        }

        // 신규 주문 건수 (상태가 PAID인 주문)
        newOrdersCount = await prisma.order.count(
        {
            where:
            {
                status: "PAID"
            }
        });

        // 미배송 주문 건수 (상태가 PAID 또는 SHIPPED인 주문)
        undeliveredCount = await prisma.order.count(
        {
            where:
            {
                status:
                {
                    in: ["PAID", "SHIPPED"]
                }
            }
        });
    }
    catch (error)
    {
        console.error("[AdminDashboardPage] 데이터베이스 통계 조회 중 에러 발생:", error);
    }

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>대시보드</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px', marginBottom: '24px' }}>쇼핑몰 현황 통계 요약</p>

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

            <h2 className={styles.sectionTitle}>관리자 시스템 정보</h2>
            <div className={styles.infoBox}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div><strong>역할:</strong> 쇼핑몰 수석 관리자 (ADMIN)</div>
                    <div><strong>DB 종류:</strong> SQLite 파일 데이터베이스</div>
                    <div><strong>시스템 환경:</strong> Next.js App Router (Production Mode ready)</div>
                </div>
            </div>
        </div>
    );
}
