/**
 * [기능]: 회원 및 비회원 주문 내역 조회 통합 페이지
 * [작성자]: 윤승종
 */
'use client';

import React, { useState } from 'react';
import styles from './history.module.css';

interface OrderItem
{
    id: string;
    productId: string;
    productName: string;
    optionInfo: string | null;
    price: number;
    quantity: number;
}

interface Order
{
    id: string;
    userId: string | null;
    nonMemberName: string | null;
    nonMemberPhone: string | null;
    status: string;
    totalPrice: number;
    shippingName: string;
    shippingPhone: string;
    shippingAddress: string;
    shippingMemo: string | null;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

const STATUS_MAP: { [key: string]: string } = {
    PENDING_PAYMENT: "결제 대기",
    PAID: "결제 완료",
    SHIPPED: "배송 중",
    DELIVERED: "배송 완료"
};

/// <summary>
/// [기능]: 이름, 연락처, 비밀번호를 인증 폼에 입력받아 비회원 주문 데이터를 안전하게 대조하여 상세 목록을 출력합니다.
/// [작성자]: 윤승종
/// [수정 날짜]: 2026-06-22
/// [마지막 수정 작성자]: 윤승종
/// [수정 내용]: 최초 구현
/// </summary>
export default function HistoryPage()
{
    const [nonMemberName, setNonMemberName] = useState('');
    const [nonMemberPhone, setNonMemberPhone] = useState('');
    const [nonMemberPassword, setNonMemberPassword] = useState('');

    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrders, setExpandedOrders] = useState<{ [id: string]: boolean }>({});
    const [isSearched, setIsSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /// <summary>
    /// [기능]: 비회원 인증 요청을 백엔드 API에 송신하고 일치하는 주문 배열을 받아 상태에 적재합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_OnSearchSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        if (nonMemberName === '')
        {
            alert("주문자 이름을 입력해주십시오.");
            return;
        }
        if (nonMemberPhone === '')
        {
            alert("주문자 연락처를 입력해주십시오.");
            return;
        }
        if (nonMemberPassword === '')
        {
            alert("조회용 비밀번호를 입력해주십시오.");
            return;
        }

        setIsLoading(true);

        try
        {
            const response = await fetch('/api/orders/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nonMemberName: nonMemberName,
                    nonMemberPhone: nonMemberPhone,
                    nonMemberPassword: nonMemberPassword
                })
            });

            const result = await response.json();
            if (result != null)
            {
                if (result.success === true && result.orders != null)
                {
                    setOrders(result.orders);
                    setIsSearched(true);
                    console.log(`[HistoryPage] 주문조회 인증 성공. 조회된 건수: ${result.orders.length}`);
                }
                else
                {
                    let errorMsg = "조회 처리에 실패했습니다.";
                    if (result.message != null)
                    {
                        errorMsg = result.message;
                    }
                    alert(errorMsg);
                }
            }
        }
        catch (error)
        {
            console.error("[HistoryPage] 주문 내역 조회 연동 실패:", error);
            alert("네트워크 통신 중 에러가 발생했습니다.");
        }
        finally
        {
            setIsLoading(false);
        }
    };

    /// <summary>
    /// [기능]: 각 주문 카드의 세부 사항 영역을 토글하여 렌더링하도록 지시합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_ToggleOrderExpand = (id: string) =>
    {
        setExpandedOrders((prev) =>
        {
            return {
                ...prev,
                [id]: prev[id] === true ? false : true
            };
        });
    };

    const func_GetStatusBadgeClass = (status: string) =>
    {
        if (status === 'PENDING_PAYMENT')
        {
            return styles.badgePending;
        }
        if (status === 'PAID')
        {
            return styles.badgePaid;
        }
        if (status === 'SHIPPED')
        {
            return styles.badgeShipped;
        }
        return styles.badgeDelivered;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>주문 내역 조회</h1>

            {/* 1. 조회 요청 폼 (검색 성공 전 또는 갱신 조회용) */}
            {isSearched === false ? (
                <div className={styles.formCard}>
                    <form onSubmit={func_OnSearchSubmit}>
                        <div className={styles.formGroup}>
                            <label htmlFor="nonMemberName">주문자 이름</label>
                            <input
                                id="nonMemberName"
                                type="text"
                                className={styles.input}
                                value={nonMemberName}
                                onChange={(e) =>
                                {
                                    return setNonMemberName(e.target.value);
                                }}
                                placeholder="주문 시 기입하신 이름을 입력해주십시오."
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="nonMemberPhone">연락처</label>
                            <input
                                id="nonMemberPhone"
                                type="tel"
                                className={styles.input}
                                value={nonMemberPhone}
                                onChange={(e) =>
                                {
                                    return setNonMemberPhone(e.target.value);
                                }}
                                placeholder="예: 010-1234-5678"
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="nonMemberPassword">주문번호 조회 비밀번호 (4자리 이상)</label>
                            <input
                                id="nonMemberPassword"
                                type="password"
                                className={styles.input}
                                value={nonMemberPassword}
                                onChange={(e) =>
                                {
                                    return setNonMemberPassword(e.target.value);
                                }}
                                placeholder="비회원 주문 비밀번호를 입력해주십시오."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading === true ? "주문 내역 조회 중..." : "주문 확인하기"}
                        </button>
                    </form>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <p style={{ color: '#4a5568', fontWeight: 600 }}>총 {orders.length}건의 주문 내역이 조회되었습니다.</p>
                        <button
                            type="button"
                            className={styles.toggleButton}
                            onClick={() =>
                            {
                                return setIsSearched(false);
                            }}
                        >
                            다시 조회하기
                        </button>
                    </div>

                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 0', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                            <p style={{ color: '#718096', fontSize: '1.05rem' }}>입력하신 정보와 일치하는 주문 내역이 존재하지 않습니다.</p>
                        </div>
                    ) : (
                        <div>
                            {orders.map((order) =>
                            {
                                const isExpanded = expandedOrders[order.id] === true;
                                const firstItemName = order.items.length > 0 ? order.items[0].productName : "상품 정보 없음";
                                const totalQty = order.items.reduce((acc, curr) => { return acc + curr.quantity; }, 0);
                                const itemSummary = order.items.length > 1 ? `${firstItemName} 외 ${order.items.length - 1}건 (총 ${totalQty}개)` : `${firstItemName} (총 ${totalQty}개)`;

                                return (
                                    <div key={order.id} className={styles.orderCard}>
                                        <div className={styles.orderHeader}>
                                            <div className={styles.orderMeta}>
                                                <span className={styles.orderId}>주문 번호 : {order.id}</span>
                                                <span className={styles.orderDate}>
                                                    주문 일시 : {new Date(order.createdAt).toLocaleString('ko-KR')}
                                                </span>
                                            </div>
                                            <span className={`${styles.badge} ${func_GetStatusBadgeClass(order.status)}`}>
                                                {STATUS_MAP[order.status]}
                                            </span>
                                        </div>

                                        <div className={styles.itemSummaryRow}>
                                            <span className={styles.itemSummaryText}>{itemSummary}</span>
                                            <span className={styles.totalPrice}>{order.totalPrice.toLocaleString()}원</span>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                                type="button"
                                                className={styles.toggleButton}
                                                onClick={() =>
                                                {
                                                    return func_ToggleOrderExpand(order.id);
                                                }}
                                            >
                                                {isExpanded === true ? "▲ 닫기" : "▶ 상세배송지/품목 보기"}
                                            </button>
                                        </div>

                                        {isExpanded === true ? (
                                            <div className={styles.detailArea}>
                                                <div className={styles.detailGrid}>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>받는 사람 (수령인)</span>
                                                        <span className={styles.detailValue}>{order.shippingName}</span>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>연락처</span>
                                                        <span className={styles.detailValue}>{order.shippingPhone}</span>
                                                    </div>
                                                    <div className={styles.detailItem} style={{ gridColumn: 'span 2' }}>
                                                        <span className={styles.detailLabel}>배송지 주소</span>
                                                        <span className={styles.detailValue} style={{ color: '#2b6cb0', fontWeight: 700 }}>{order.shippingAddress}</span>
                                                    </div>
                                                    {order.shippingMemo != null && order.shippingMemo !== '' ? (
                                                        <div className={styles.detailItem} style={{ gridColumn: 'span 2' }}>
                                                            <span className={styles.detailLabel}>배송 메모</span>
                                                            <span className={styles.detailValue}>{order.shippingMemo}</span>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#4a5568', marginBottom: '10px' }}>[ 결제 상품 목록 ]</h4>
                                                <table className={styles.productTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>상품명</th>
                                                            <th>옵션</th>
                                                            <th>단가</th>
                                                            <th>수량</th>
                                                            <th>소계</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items.map((item) =>
                                                        {
                                                            return (
                                                                <tr key={item.id}>
                                                                    <td>{item.productName}</td>
                                                                    <td>{item.optionInfo != null && item.optionInfo !== '' ? item.optionInfo : "-"}</td>
                                                                    <td>{item.price.toLocaleString()}원</td>
                                                                    <td>{item.quantity}개</td>
                                                                    <td style={{ fontWeight: '600' }}>{(item.price * item.quantity).toLocaleString()}원</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
