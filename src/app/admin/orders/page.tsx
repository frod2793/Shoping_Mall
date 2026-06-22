/**
 * [기능]: 관리자 주문 관리 화면 컴포넌트
 * [작성자]: 윤승종
 */
'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin-orders.module.css';

interface Order
{
    id: string;
    userId: string | null;
    status: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
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

    const func_FetchOrders = async () =>
    {
        try
        {
            const res = await fetch('/api/admin/orders');
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
            console.error("[AdminOrdersPage] 주문 목록 로드 실패:", e);
        }
    };

    useEffect(() =>
    {
        func_FetchOrders();
    }, []);

    const func_OnStatusChange = async (id: string, newStatus: string) =>
    {
        try
        {
            const res = await fetch(`/api/admin/orders/${id}/status`,
            {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok === true)
            {
                alert("배송 상태가 업데이트되었습니다.");
                func_FetchOrders();
            }
        }
        catch (e)
        {
            console.error("[AdminOrdersPage] 상태 변경 실패:", e);
        }
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
                        return (
                            <tr key={order.id}>
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
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
