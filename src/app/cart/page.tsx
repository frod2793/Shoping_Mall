/**
 * [기능]: 장바구니 목록 및 수량 제어 클라이언트 페이지
 * [작성자]: 윤승종
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './cart.module.css';

interface CartItem
{
    productId: string;
    productName: string;
    imageUrl: string | null;
    optionId: string | null;
    optionName: string | null;
    price: number;
    quantity: number;
}

/// <summary>
/// [기능]: 로컬 스토리지와 연동하여 사용자의 장바구니 품목들을 제어하고 주문서 작성으로 전달하는 뷰 페이지를 구성합니다.
/// [작성자]: 윤승종
/// [수정 날짜]: 2026-06-22
/// [마지막 수정 작성자]: 윤승종
/// [수정 내용]: 최초 구현
/// </summary>
export default function CartPage()
{
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    /// <summary>
    /// [기능]: 로컬 스토리지로부터 장바구니 리스트를 안전하게 불러오고 인덱스 선택 상태를 초기화합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_LoadCartItems = () =>
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
                        setCartItems(parsed);
                        // 최초 로딩 시 모든 아이템을 선택 상태로 설정
                        const indices = [];
                        for (let i = 0; i < parsed.length; i++)
                        {
                            indices.push(i);
                        }
                        setSelectedIndices(indices);
                    }
                }
                catch (error)
                {
                    console.error("[CartPage] 장바구니 정보 파싱 중 에러 발생:", error);
                }
            }
            setIsLoaded(true);
        }
    };

    useEffect(() =>
    {
        func_LoadCartItems();
    }, []);

    /// <summary>
    /// [기능]: 장바구니 변경 사항을 로컬 스토리지에 업데이트하고 실시간 배지 이벤트를 발신합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_SaveCartItems = (updated: CartItem[]) =>
    {
        setCartItems(updated);
        if (typeof window !== 'undefined' && window.localStorage != null)
        {
            window.localStorage.setItem('cart_items', JSON.stringify(updated));
            window.dispatchEvent(new Event('cart-updated'));
        }
    };

    /// <summary>
    /// [기능]: 특정 품목의 주문 희망 수량을 가산하거나 감산합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_OnQuantityChange = (index: number, diff: number) =>
    {
        const updated = [];
        for (let i = 0; i < cartItems.length; i++)
        {
            const item = cartItems[i];
            if (item != null)
            {
                if (i === index)
                {
                    const newQty = item.quantity + diff;
                    if (newQty < 1)
                    {
                        continue;
                    }
                    updated.push({
                        ...item,
                        quantity: newQty
                    });
                }
                else
                {
                    updated.push(item);
                }
            }
        }
        func_SaveCartItems(updated);
    };

    /// <summary>
    /// [기능]: 장바구니에서 특정 상품 품목을 제거합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_OnDeleteItem = (index: number) =>
    {
        const updated = [];
        for (let i = 0; i < cartItems.length; i++)
        {
            const item = cartItems[i];
            if (item != null)
            {
                if (i !== index)
                {
                    updated.push(item);
                }
            }
        }

        // 선택 인덱스 배열 동기화 조절
        const newSelected = [];
        for (let i = 0; i < selectedIndices.length; i++)
        {
            const val = selectedIndices[i];
            if (val != null)
            {
                if (val < index)
                {
                    newSelected.push(val);
                }
                else if (val > index)
                {
                    newSelected.push(val - 1);
                }
            }
        }

        setSelectedIndices(newSelected);
        func_SaveCartItems(updated);
    };

    /// <summary>
    /// [기능]: 장바구니에 적재된 모든 목록을 비웁니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_OnClearCart = () =>
    {
        if (confirm("장바구니를 완전히 비우시겠습니까?"))
        {
            func_SaveCartItems([]);
            setSelectedIndices([]);
        }
    };

    /// <summary>
    /// [기능]: 장바구니 내 개별 체크박스 토글을 제어합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_ToggleSelect = (index: number) =>
    {
        if (selectedIndices.includes(index) === true)
        {
            setSelectedIndices(selectedIndices.filter((i) => { return i !== index; }));
        }
        else
        {
            setSelectedIndices([...selectedIndices, index]);
        }
    };

    /// <summary>
    /// [기능]: 장바구니 내 전체 품목 선택/선택해제를 반전시킵니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_ToggleSelectAll = (checked: boolean) =>
    {
        if (checked === true)
        {
            const indices = [];
            for (let i = 0; i < cartItems.length; i++)
            {
                indices.push(i);
            }
            setSelectedIndices(indices);
        }
        else
        {
            setSelectedIndices([]);
        }
    };

    /// <summary>
    /// [기능]: 선택한 상품 목록을 복수 구매 배열(checkout_items)로 만들어 결제서 작성 화면으로 넘깁니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_OnCheckout = () =>
    {
        if (selectedIndices.length === 0)
        {
            alert("결제하실 상품을 최소 1개 이상 선택해주십시오.");
            return;
        }

        const checkoutItems = [];
        for (let i = 0; i < cartItems.length; i++)
        {
            const item = cartItems[i];
            if (item != null && selectedIndices.includes(i) === true)
            {
                checkoutItems.push(item);
            }
        }

        if (typeof window !== 'undefined' && window.localStorage != null)
        {
            window.localStorage.setItem('checkout_items', JSON.stringify(checkoutItems));
        }

        console.log(`[CartPage] ${checkoutItems.length}개의 품목 주문서 작성 이동.`);
        router.push('/orders/checkout');
    };

    if (isLoaded === false)
    {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>장바구니</h1>
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <p>장바구니 리스트를 불러오고 있습니다...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0)
    {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>장바구니</h1>
                <div className={styles.emptyCart}>
                    <p className={styles.emptyText}>장바구니가 비어 있습니다.</p>
                    <Link href="/" className={styles.shopButton}>
                        상품 구경하러 가기
                    </Link>
                </div>
            </div>
        );
    }

    // 선택된 아이템들의 가격 합산
    let selectedTotalPrice = 0;
    for (let i = 0; i < cartItems.length; i++)
    {
        const item = cartItems[i];
        if (item != null && selectedIndices.includes(i) === true)
        {
            selectedTotalPrice += item.price * item.quantity;
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>장바구니</h1>

            <div className={styles.cartLayout}>
                {/* 왼쪽: 장바구니 리스트 */}
                <div className={styles.cartListSection}>
                    <div className={styles.actionRow}>
                        <label className={styles.selectAllLabel}>
                            <input
                                type="checkbox"
                                className={styles.itemCheckbox}
                                checked={selectedIndices.length === cartItems.length}
                                onChange={(e) =>
                                {
                                    return func_ToggleSelectAll(e.target.checked);
                                }}
                            />
                            <span>전체 선택 ({selectedIndices.length}/{cartItems.length})</span>
                        </label>
                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={func_OnClearCart}
                        >
                            장바구니 비우기
                        </button>
                    </div>

                    {cartItems.map((item, index) =>
                    {
                        const isSelected = selectedIndices.includes(index);
                        return (
                            <div key={`${item.productId}-${item.optionId || ''}-${index}`} className={styles.itemCard}>
                                <input
                                    type="checkbox"
                                    className={styles.itemCheckbox}
                                    checked={isSelected}
                                    onChange={() =>
                                    {
                                        return func_ToggleSelect(index);
                                    }}
                                />
                                {item.imageUrl != null ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className={styles.itemImage}
                                    />
                                ) : (
                                    <div className={styles.itemImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#edf2f7', fontSize: '0.8rem' }}>
                                        이미지 없음
                                    </div>
                                )}
                                <div className={styles.itemInfo}>
                                    <Link href={`/products/${item.productId}`} className={styles.itemName}>
                                        {item.productName}
                                    </Link>
                                    {item.optionName != null && item.optionName !== '' ? (
                                        <div className={styles.itemOption}>옵션: {item.optionName}</div>
                                    ) : null}
                                    <div className={styles.itemPrice}>{item.price.toLocaleString()}원</div>
                                    <div className={styles.quantityControl}>
                                        <button
                                            type="button"
                                            className={styles.qtyButton}
                                            onClick={() =>
                                            {
                                                return func_OnQuantityChange(index, -1);
                                            }}
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="text"
                                            className={styles.qtyInput}
                                            value={item.quantity}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className={styles.qtyButton}
                                            onClick={() =>
                                            {
                                                return func_OnQuantityChange(index, 1);
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className={styles.deleteButton}
                                    onClick={() =>
                                    {
                                        return func_OnDeleteItem(index);
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* 오른쪽: 최종 주문 정보 */}
                <div className={styles.summarySection}>
                    <div className={styles.summaryCard}>
                        <h2 className={styles.summaryTitle}>주문 요약</h2>
                        <div className={styles.summaryRow}>
                            <span>선택한 상품 수</span>
                            <span>{selectedIndices.length}개</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>배송비</span>
                            <span>무료</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>총 결제금액</span>
                            <span className={styles.totalPrice}>{selectedTotalPrice.toLocaleString()}원</span>
                        </div>
                        <button
                            type="button"
                            className={styles.checkoutButton}
                            onClick={func_OnCheckout}
                            disabled={selectedIndices.length === 0}
                        >
                            {selectedIndices.length}개 상품 구매하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
