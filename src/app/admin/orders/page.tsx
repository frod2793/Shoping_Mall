/**
 * [기능]: 관리자 주문 관리 화면 컴포넌트
 * [작성자]: 윤승종
 */
'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin-orders.module.css';

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

export default function AdminOrdersPage()
{
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState('ALL');
    const [expandedOrders, setExpandedOrders] = useState<{ [id: string]: boolean }>({});
    const [apiHost, setApiHost] = useState('');

    useEffect(() => {
        const savedHost = localStorage.getItem('admin_api_host') || '';
        setApiHost(savedHost);
    }, []);

    const getFullUrl = (path: string) => {
        const host = apiHost ? apiHost.replace(/\/$/, '') : '';
        return `${host}${path}`;
    };

    /// <summary>
    /// [기능]: 관리자 API로부터 모든 주문(상세 아이템 포함) 리스트를 호출합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 작성
    /// </summary>
    const func_FetchOrders = async () =>
    {
        try
        {
            const res = await fetch(getFullUrl('/api/admin/orders'));
            if (res.ok === true)
            {
                const data = await res.json();
                if (data != null)
                {
                    setOrders(data);
                }
            }
        }
        catch (e)
        {
            console.error("[AdminOrdersPage] 주문 목록 로드 중 오류 발생:", e);
        }
    };

    useEffect(() =>
    {
        func_FetchOrders();
    }, []);

    /// <summary>
    /// [기능]: 특정 주문건의 배송/결제 처리 상태를 변경합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 작성
    /// </summary>
    const func_OnStatusChange = async (id: string, newStatus: string) =>
    {
        try
        {
            const res = await fetch(getFullUrl(`/api/admin/orders/${id}/status`),
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok === true)
            {
                alert("배송 상태가 성공적으로 변경되었습니다.");
                func_FetchOrders();
            }
        }
        catch (e)
        {
            console.error("[AdminOrdersPage] 배송 상태 변경 실패:", e);
        }
    };

    /// <summary>
    /// [기능]: 주문 상세 뷰 아코디언 토글 상태를 반전시킵니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 작성
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

    const filteredOrders = orders.filter((order) =>
    {
        if (filter === 'ALL')
        {
            return true;
        }
        return order.status === filter;
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>주문 관리</h1>

            {/* 필터 탭 */}
            <div className={styles.filterContainer}>
                <button
                    className={filter === 'ALL' ? styles.filterButtonActive : styles.filterButton}
                    onClick={() =>
                    {
                        return setFilter('ALL');
                    }}
                >
                    전체 ({orders.length})
                </button>
                <button
                    className={filter === 'PENDING_PAYMENT' ? styles.filterButtonActive : styles.filterButton}
                    onClick={() =>
                    {
                        return setFilter('PENDING_PAYMENT');
                    }}
                >
                    결제 대기 ({orders.filter((o) => { return o.status === 'PENDING_PAYMENT'; }).length})
                </button>
                <button
                    className={filter === 'PAID' ? styles.filterButtonActive : styles.filterButton}
                    onClick={() =>
                    {
                        return setFilter('PAID');
                    }}
                >
                    결제 완료 ({orders.filter((o) => { return o.status === 'PAID'; }).length})
                </button>
                <button
                    className={filter === 'SHIPPED' ? styles.filterButtonActive : styles.filterButton}
                    onClick={() =>
                    {
                        return setFilter('SHIPPED');
                    }}
                >
                    배송 중 ({orders.filter((o) => { return o.status === 'SHIPPED'; }).length})
                </button>
                <button
                    className={filter === 'DELIVERED' ? styles.filterButtonActive : styles.filterButton}
                    onClick={() =>
                    {
                        return setFilter('DELIVERED');
                    }}
                >
                    배송 완료 ({orders.filter((o) => { return o.status === 'DELIVERED'; }).length})
                </button>
            </div>

            {/* 주문 목록 테이블 */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>상세</th>
                        <th>주문 ID</th>
                        <th>주문 일시</th>
                        <th>총 금액</th>
                        <th>현재 상태</th>
                        <th>상태 변경</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) =>
                    {
                        const isExpanded = expandedOrders[order.id] === true;
                        return (
                            <React.Fragment key={order.id}>
                                <tr>
                                    <td>
                                        <button
                                            type="button"
                                            className={styles.toggleButton}
                                            onClick={() =>
                                            {
                                                return func_ToggleOrderExpand(order.id);
                                            }}
                                        >
                                            {isExpanded ? '▼ 닫기' : '▶ 상세보기'}
                                        </button>
                                    </td>
                                    <td style={{ fontSize: '13px', fontFamily: 'monospace' }}>{order.id}</td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    <td style={{ fontWeight: '600' }}>{order.totalPrice.toLocaleString()}원</td>
                                    <td>
                                        <span className={`${styles.badge} ${func_GetStatusBadgeClass(order.status)}`}>
                                            {STATUS_MAP[order.status]}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className={styles.select}
                                            value={order.status}
                                            onChange={(e) =>
                                            {
                                                return func_OnStatusChange(order.id, e.target.value);
                                            }}
                                        >
                                            <option value="PENDING_PAYMENT">결제 대기</option>
                                            <option value="PAID">결제 완료</option>
                                            <option value="SHIPPED">배송 중</option>
                                            <option value="DELIVERED">배송 완료</option>
                                        </select>
                                    </td>
                                </tr>
                                {isExpanded === true ? (
                                    <tr>
                                        <td colSpan={6} className={styles.detailRow}>
                                            <div className={styles.detailContainer}>
                                                {/* 1. 수령인 및 배송 정보 */}
                                                <div className={styles.detailSection}>
                                                    <h4 className={styles.detailSectionTitle}>수령인 및 배송 정보</h4>
                                                    <div className={styles.detailGrid}>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>주문자명</span>
                                                            <span className={styles.detailValue}>
                                                                {order.nonMemberName != null ? order.nonMemberName : "회원"}
                                                            </span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>주문자 연락처</span>
                                                            <span className={styles.detailValue}>
                                                                {order.nonMemberPhone != null ? order.nonMemberPhone : "-"}
                                                            </span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>수령인명</span>
                                                            <span className={styles.detailValue}>{order.shippingName}</span>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <span className={styles.detailLabel}>수령인 연락처</span>
                                                            <span className={styles.detailValue}>{order.shippingPhone}</span>
                                                        </div>
                                                        <div className={styles.detailItem} style={{ gridColumn: 'span 2' }}>
                                                            <span className={styles.detailLabel}>배송 주소</span>
                                                            <span className={styles.detailValue}>{order.shippingAddress}</span>
                                                        </div>
                                                        {order.shippingMemo != null && order.shippingMemo !== '' ? (
                                                            <div className={styles.detailItem} style={{ gridColumn: 'span 2' }}>
                                                                <span className={styles.detailLabel}>배송 메모</span>
                                                                <span className={styles.detailValue}>{order.shippingMemo}</span>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {/* 2. 주문 상품 품목 목록 */}
                                                <div className={styles.detailSection}>
                                                    <h4 className={styles.detailSectionTitle}>주문 상품 내역</h4>
                                                    <table className={styles.innerTable}>
                                                        <thead>
                                                            <tr>
                                                                <th>상품명</th>
                                                                <th>옵션 정보</th>
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
                                                                        <td style={{ fontWeight: '600' }}>
                                                                            {(item.price * item.quantity).toLocaleString()}원
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : null}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
