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

    // 가상 결제 모달 관련 상태
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentOrderId, setPaymentOrderId] = useState('');
    const [paymentTotalPrice, setPaymentTotalPrice] = useState(0);
    const [cardNumber, setCardNumber] = useState('');
    const [cardPassword, setCardPassword] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
                    console.log(`[CheckoutPage] 임시 주문이 성공적으로 생성되었습니다. 주문 ID: ${result.orderId}`);
                    setPaymentOrderId(result.orderId);
                    setPaymentTotalPrice(result.totalPrice);
                    setShowPaymentModal(true);
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

    /// <summary>
    /// [기능]: 가상 결제 모달에서 '결제 승인'을 누르면 결제 검증 API를 호출하고 성공 시 완료 페이지로 리다이렉트합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_OnConfirmPayment = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        if (paymentOrderId === '')
        {
            alert("결제할 주문 식별키가 누락되었습니다.");
            return;
        }

        if (cardNumber.length < 16)
        {
            alert("카드 번호 16자리를 올바르게 입력해주십시오.");
            return;
        }

        if (cardPassword.length < 2)
        {
            alert("카드 비밀번호 앞 2자리를 입력해주십시오.");
            return;
        }

        setIsProcessingPayment(true);

        try
        {
            const verifyPayload = {
                paymentKey: `MOCK_PG_${Date.now()}`
            };

            const response = await fetch(`/api/orders/${paymentOrderId}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(verifyPayload)
            });

            const result = await response.json();
            if (result != null)
            {
                if (result.success === true)
                {
                    console.log(`[CheckoutPage] 결제 승인이 완료되었습니다. 주문 ID: ${result.orderId}`);
                    
                    if (typeof window !== 'undefined' && window.localStorage != null)
                    {
                        window.localStorage.removeItem('checkout_item');
                    }

                    setShowPaymentModal(false);
                    router.push(`/orders/success?orderId=${paymentOrderId}`);
                }
                else
                {
                    let errorMsg = "결제 승인 처리에 실패했습니다.";
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
            console.error("[CheckoutPage] 결제 승인 검증 중 네트워크 에러 발생:", error);
            let errMsg = "결제 승인 중 예기치 못한 에러가 발생했습니다.";
            if (error != null && error.message != null)
            {
                errMsg = error.message;
            }
            alert(errMsg);
        }
        finally
        {
            setIsProcessingPayment(false);
        }
    };

    /// <summary>
    /// [기능]: 가상 결제창 모달을 닫고 상태를 초기화합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_OnClosePaymentModal = () =>
    {
        if (isProcessingPayment === true)
        {
            alert("결제가 진행 중입니다. 잠시만 기다려주십시오.");
            return;
        }
        setShowPaymentModal(false);
        setCardNumber('');
        setCardPassword('');
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

            {/* 가상 결제창(Mock PG) 모달 */}
            {showPaymentModal === true ? (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <h3>가상 PG 결제 승인창</h3>
                            <button
                                type="button"
                                className={styles.modalCloseButton}
                                onClick={func_OnClosePaymentModal}
                            >
                                &times;
                            </button>
                        </div>
                        <div className={styles.modalInfoBox}>
                            <div className={styles.modalInfoRow}>
                                <span>가맹점</span>
                                <span>다용도 악세사리/키링 샵</span>
                            </div>
                            <div className={styles.modalInfoRow}>
                                <span>주문 번호</span>
                                <span style={{ fontSize: '0.85rem', color: '#718096' }}>{paymentOrderId}</span>
                            </div>
                            <div className={styles.modalInfoRow}>
                                <span>결제 금액</span>
                                <span className={styles.modalPrice}>{paymentTotalPrice.toLocaleString()}원</span>
                            </div>
                        </div>
                        <form className={styles.modalForm} onSubmit={func_OnConfirmPayment}>
                            <div className={styles.modalFormGroup}>
                                <label htmlFor="cardNumber">카드번호 (16자리 입력)</label>
                                <input
                                    id="cardNumber"
                                    type="text"
                                    maxLength={16}
                                    placeholder="1234567812345678"
                                    className={styles.modalInput}
                                    value={cardNumber}
                                    onChange={(e) =>
                                    {
                                        return setCardNumber(e.target.value.replace(/[^0-9]/g, ''));
                                    }}
                                    required
                                />
                            </div>
                            <div className={styles.modalFormGroup}>
                                <label htmlFor="cardPassword">비밀번호 앞 2자리</label>
                                <input
                                    id="cardPassword"
                                    type="password"
                                    maxLength={2}
                                    placeholder="●●"
                                    className={styles.modalInput}
                                    value={cardPassword}
                                    onChange={(e) =>
                                    {
                                        return setCardPassword(e.target.value.replace(/[^0-9]/g, ''));
                                    }}
                                    required
                                />
                            </div>
                            <div className={styles.modalButtonGroup}>
                                <button
                                    type="submit"
                                    className={styles.modalConfirmBtn}
                                    disabled={isProcessingPayment}
                                >
                                    {isProcessingPayment === true ? '결제 승인 중...' : '결제 승인'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.modalCancelBtn}
                                    onClick={func_OnClosePaymentModal}
                                    disabled={isProcessingPayment}
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </form>
    );
}
