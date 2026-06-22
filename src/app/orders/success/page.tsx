/**
 * [기능]: 결제 완료 주문 영수증 확인 서버 컴포넌트
 * [작성자]: 윤승종
 */
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import styles from './success.module.css';

interface SuccessPageProps
{
    searchParams: {
        orderId?: string;
    };
}

/// <summary>
/// [기능]: 결제 승인이 완료된 주문건을 조회하여 영수증 형태로 사용자에게 화면을 렌더링합니다.
/// [작성자]: 윤승종
/// [수정 날짜]: 2026-06-22
/// [마지막 수정 작성자]: 윤승종
/// [수정 내용]: 최초 구현
/// </summary>
export default async function SuccessPage(props: SuccessPageProps)
{
    const searchParams = props.searchParams;
    let orderId: string | undefined = undefined;

    if (searchParams != null)
    {
        orderId = searchParams.orderId;
    }

    if (orderId == null || orderId === '')
    {
        return (
            <div className={styles.container}>
                <div className={styles.errorCard}>
                    <div className={styles.errorIcon}>!</div>
                    <h2 className={styles.title}>주문 정보 오류</h2>
                    <p className={styles.errorText}>유효한 주문 번호가 누락되었습니다.</p>
                    <Link href="/" className={styles.homeButton}>
                        홈으로 가기
                    </Link>
                </div>
            </div>
        );
    }

    const prisma = new PrismaClient();
    let order = null;

    try
    {
        order = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
                items: true
            }
        });
    }
    catch (error)
    {
        console.error(`[SuccessPage] 주문 상세 조회 중 DB 오류가 발생했습니다. ID: ${orderId}`, error);
    }
    finally
    {
        await prisma.$disconnect();
    }

    if (order == null)
    {
        return (
            <div className={styles.container}>
                <div className={styles.errorCard}>
                    <div className={styles.errorIcon}>!</div>
                    <h2 className={styles.title}>주문 내역 없음</h2>
                    <p className={styles.errorText}>
                        요청하신 주문 내역을 찾을 수 없습니다.<br />
                        주문 번호를 다시 확인해주십시오.
                    </p>
                    <Link href="/" className={styles.homeButton}>
                        홈으로 가기
                    </Link>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(order.createdAt).toLocaleString('ko-KR');

    return (
        <div className={styles.container}>
            <div className={styles.receiptCard}>
                <div className={styles.successIconContainer}>
                    <div className={styles.successIcon}>✓</div>
                </div>
                <h2 className={styles.title}>주문이 완료되었습니다!</h2>
                <p className={styles.subtitle}>결제가 성공적으로 처리되었습니다.</p>

                {/* 1. 결제 내역 요약 */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>결제 요약 정보</h3>
                    <div className={styles.row}>
                        <span className={styles.label}>주문 일시</span>
                        <span className={styles.value}>{formattedDate}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>주문 번호</span>
                        <span className={styles.value} style={{ fontSize: '0.85rem' }}>{order.id}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>결제 방식</span>
                        <span className={styles.value}>신용카드 (모의 가상 결제)</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>주문 상태</span>
                        <span className={styles.value} style={{ color: '#38a169', fontWeight: 700 }}>
                            {order.status === 'PAID' ? '결제 완료' : order.status}
                        </span>
                    </div>
                </div>

                {/* 2. 주문 상품 내역 */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>주문 상품 내역</h3>
                    {order.items.map((item) =>
                    {
                        return (
                            <div key={item.id} className={styles.itemRow}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{item.productName}</span>
                                    <span className={styles.itemMeta}>
                                        {item.optionInfo != null && item.optionInfo !== '' ? (
                                            <>옵션: {item.optionInfo} | </>
                                        ) : null}
                                        수량 {item.quantity}개
                                    </span>
                                </div>
                                <span className={styles.itemPrice}>
                                    {(item.price * item.quantity).toLocaleString()}원
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* 3. 배송지 정보 (2차 확인 강화) */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>배송 및 주문 정보 (2차 확인)</h3>
                    <div style={{ backgroundColor: '#fffaf0', border: '1px solid #feebc8', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.85rem', color: '#dd6b20', fontWeight: 600 }}>
                        ⚠ 배송지 주소와 연락처를 잘못 입력하셨는지 다시 한번 확인해주십시오.
                    </div>
                    
                    <div style={{ borderBottom: '1px solid #edf2f7', paddingBottom: '12px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#718096', marginBottom: '8px' }}>[ 주문자 정보 ]</div>
                        <div className={styles.row}>
                            <span className={styles.label}>주문자명</span>
                            <span className={styles.value}>{order.nonMemberName != null ? order.nonMemberName : "회원"}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.label}>연락처</span>
                            <span className={styles.value}>{order.nonMemberPhone != null ? order.nonMemberPhone : "-"}</span>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#718096', marginBottom: '8px' }}>[ 받는 사람 정보 ]</div>
                        <div className={styles.row}>
                            <span className={styles.label}>수령인명</span>
                            <span className={styles.value}>{order.shippingName}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.label}>연락처</span>
                            <span className={styles.value}>{order.shippingPhone}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.label}>배송 주소</span>
                            <span className={styles.value} style={{ fontWeight: 700, color: '#2b6cb0' }}>{order.shippingAddress}</span>
                        </div>
                        {order.shippingMemo != null && order.shippingMemo !== '' ? (
                            <div className={styles.row}>
                                <span className={styles.label}>배송 메모</span>
                                <span className={styles.value}>{order.shippingMemo}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* 최종 합계 */}
                <div className={styles.totalAmountBox}>
                    <span className={styles.totalLabel}>최종 결제 금액</span>
                    <span className={styles.totalPrice}>{order.totalPrice.toLocaleString()}원</span>
                </div>

                {/* 하단 제어 버튼 */}
                <div className={styles.buttonGroup}>
                    <Link href="/" className={styles.homeButton}>
                        계속 쇼핑하기
                    </Link>
                    <Link href="/admin" className={styles.checkOrderButton}>
                        주문 관리 (관리자)
                    </Link>
                </div>
            </div>
        </div>
    );
}
