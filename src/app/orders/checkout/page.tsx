/**
 * [기능]: 주문서 작성 및 배송지 입력 클라이언트 페이지
 * [작성자]: 윤승종
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './checkout.module.css';

interface CheckoutItem
{
    productId: string;
    productName: string;
    imageUrl: string | null;
    optionId: string | null;
    price: number;
    quantity: number;
}

export default function CheckoutPage()
{
    const router = useRouter();
    const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);

    // 비회원 및 배송지 정보 입력 필드 상태
    const [nonMemberName, setNonMemberName] = useState('');
    const [nonMemberPhone, setNonMemberPhone] = useState('');
    const [nonMemberPassword, setNonMemberPassword] = useState('');

    const [shippingName, setShippingName] = useState('');
    const [shippingPhone, setShippingPhone] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [shippingMemo, setShippingMemo] = useState('');

    const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD'); // 가상 결제 전용 신용카드
    const [isLoading, setIsLoading] = useState(false);

    /// <summary>
    /// [기능]: 로컬 스토리지로부터 임시 저장된 결제 대상 아이템 정보를 불러옵니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_LoadCheckoutItem = () =>
    {
        if (typeof window !== 'undefined')
        {
            if (window.localStorage != null)
            {
                const stored = window.localStorage.getItem('checkout_item');
                if (stored != null && stored !== '')
                {
                    try
                    {
                        const parsed = JSON.parse(stored);
                        if (parsed != null)
                        {
                            setCheckoutItem(parsed);
                        }
                    }
                    catch (error)
                    {
                        console.error("[CheckoutPage] 결제 정보 파싱 중 에러 발생:", error);
                    }
                }
            }
        }
    };

    useEffect(() =>
    {
        func_LoadCheckoutItem();
    }, []);

    /// <summary>
    /// [기능]: 주문서 입력값을 최종 검증하고 임시 주문을 서버에 생성하는 요청을 전송합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_OnSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        if (checkoutItem == null)
        {
            alert("주문할 상품 정보가 없습니다.");
            return;
        }

        if (nonMemberName === '')
        {
            alert("비회원 주문자 이름을 입력해주십시오.");
            return;
        }
        if (nonMemberPhone === '')
        {
            alert("비회원 주문자 연락처를 입력해주십시오.");
            return;
        }
        if (nonMemberPassword === '')
        {
            alert("주문조회 비밀번호를 입력해주십시오.");
            return;
        }

        if (shippingName === '')
        {
            alert("수령인 이름을 입력해주십시오.");
            return;
        }
        if (shippingPhone === '')
        {
            alert("배송지 연락처를 입력해주십시오.");
            return;
        }
        if (shippingAddress === '')
        {
            alert("배송 주소를 입력해주십시오.");
            return;
        }

        setIsLoading(true);

        try
        {
            const orderPayload = {
                nonMemberName: nonMemberName,
                nonMemberPhone: nonMemberPhone,
                nonMemberPassword: nonMemberPassword,
                shippingName: shippingName,
                shippingPhone: shippingPhone,
                shippingAddress: shippingAddress,
                shippingMemo: shippingMemo !== '' ? shippingMemo : null,
                totalPrice: checkoutItem.price * checkoutItem.quantity,
                items: [
                    {
                        productId: checkoutItem.productId,
                        optionId: checkoutItem.optionId,
                        price: checkoutItem.price,
                        quantity: checkoutItem.quantity
                    }
                ]
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderPayload)
            });

            const result = await response.json();
            if (result != null)
            {
                if (result.success === true)
                {
                    console.log("[CheckoutPage] 임시 주문이 생성되었습니다. ID:", result.orderId);
                    
                    // 주문 정보를 결제 확인 페이지로 전달하여 결제 진행
                    // 다음 Task 4의 가상 결제 프로세스 진입을 위해 라우팅 처리
                    router.push(`/orders/payment?orderId=${result.orderId}&totalPrice=${result.totalPrice}`);
                }
                else
                {
                    let errorMsg = "주문 처리에 실패했습니다.";
                    if (result.message != null)
                    {
                        errorMsg = result.message;
                    }
                    alert(errorMsg);
                }
            }
        }
        catch (error: any)
        {
            console.error("[CheckoutPage] 주문 생성 중 네트워크 에러 발생:", error);
            let errMsg = "주문 전송 중 예기치 못한 에러가 발생했습니다.";
            if (error != null)
            {
                if (error.message != null)
                {
                    errMsg = error.message;
                }
            }
            alert(errMsg);
        }
        finally
        {
            setIsLoading(false);
        }
    };

    if (checkoutItem == null)
    {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <p>주문서 정보를 로딩 중이거나 선택된 주문 상품이 없습니다.</p>
                </div>
            </div>
        );
    }

    const calculatedTotalPrice = checkoutItem.price * checkoutItem.quantity;

    return (
        <form className={styles.container} onSubmit={func_OnSubmit}>
            <div className={styles.leftSection}>
                {/* 1. 주문 상품 정보 카드 */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>주문 상품 정보</h2>
                    <div className={styles.productRow}>
                        {checkoutItem.imageUrl != null ? (
                            <img
                                src={checkoutItem.imageUrl}
                                alt={checkoutItem.productName}
                                className={styles.productImage}
                            />
                        ) : (
                            <div className={styles.productImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#edf2f7', fontSize: '0.8rem' }}>
                                이미지 없음
                            </div>
                        )}
                        <div className={styles.productInfo}>
                            <div className={styles.productName}>{checkoutItem.productName}</div>
                            {checkoutItem.optionId != null ? (
                                <div className={styles.optionInfo}>선택 옵션 ID: {checkoutItem.optionId}</div>
                            ) : null}
                            <div className={styles.priceInfo}>
                                {checkoutItem.price.toLocaleString()}원 / {checkoutItem.quantity}개
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 비회원 주문 정보 카드 */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>비회원 구매자 정보</h2>
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
                            placeholder="주문자 이름을 입력하십시오."
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
                            placeholder="주문 조회용 임시 비밀번호"
                            required
                        />
                    </div>
                </div>

                {/* 3. 배송지 입력 카드 */}
                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>배송지 정보 입력</h2>
                    <div className={styles.formGroup}>
                        <label htmlFor="shippingName">수령인 이름</label>
                        <input
                            id="shippingName"
                            type="text"
                            className={styles.input}
                            value={shippingName}
                            onChange={(e) =>
                            {
                                return setShippingName(e.target.value);
                            }}
                            placeholder="받으실 분의 이름을 입력하십시오."
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="shippingPhone">수령인 연락처</label>
                        <input
                            id="shippingPhone"
                            type="tel"
                            className={styles.input}
                            value={shippingPhone}
                            onChange={(e) =>
                            {
                                return setShippingPhone(e.target.value);
                            }}
                            placeholder="예: 010-1234-5678"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="shippingAddress">배송지 주소</label>
                        <input
                            id="shippingAddress"
                            type="text"
                            className={styles.input}
                            value={shippingAddress}
                            onChange={(e) =>
                            {
                                return setShippingAddress(e.target.value);
                            }}
                            placeholder="상세 주소를 입력하십시오."
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="shippingMemo">배송 메모 (선택)</label>
                        <input
                            id="shippingMemo"
                            type="text"
                            className={styles.input}
                            value={shippingMemo}
                            onChange={(e) =>
                            {
                                return setShippingMemo(e.target.value);
                            }}
                            placeholder="예: 부재 시 문 앞에 놓아주세요."
                        />
                    </div>
                </div>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.stickySidebar}>
                    <h2 className={styles.cardTitle}>최종 결제 금액</h2>
                    <div className={styles.summaryRow}>
                        <span>상품 가격</span>
                        <span>{checkoutItem.price.toLocaleString()}원</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>수량</span>
                        <span>{checkoutItem.quantity}개</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>합계 금액</span>
                        <span>{calculatedTotalPrice.toLocaleString()}원</span>
                    </div>

                    <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #edf2f7' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>결제 수단 선택</h3>
                        <label className={styles.paymentOption}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                checked={paymentMethod === 'CREDIT_CARD'}
                                onChange={() =>
                                {
                                    return setPaymentMethod('CREDIT_CARD');
                                }}
                            />
                            <span>신용카드 (모의 가상 결제)</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={styles.checkoutButton}
                        disabled={isLoading}
                    >
                        {isLoading ? '주문 생성 중...' : `${calculatedTotalPrice.toLocaleString()}원 결제하기`}
                    </button>
                </div>
            </div>
        </form>
    );
}
