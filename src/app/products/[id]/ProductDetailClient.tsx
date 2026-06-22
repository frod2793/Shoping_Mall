/**
 * [기능]: 상품 상세 클라이언트 컴포넌트 (옵션 선택 및 총 가격 계산)
 * [작성자]: 윤승종
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductOption } from '@/core/domains/Product';
import styles from './product-detail.module.css';

interface Props
{
    product: Product;
}

export default function ProductDetailClient(
    {
        product,
    }: Props
)
{
    const router = useRouter();

    // 옵션 이름(예: 색상, 사이즈)을 기준으로 옵션들을 그룹화합니다.
    const groupedOptions: { [key: string]: ProductOption[] } = {};

    if (product.options != null)
    {
        for (let i = 0; i < product.options.length; i++)
        {
            const option = product.options[i];
            if (option != null)
            {
                if (groupedOptions[option.name] == null)
                {
                    groupedOptions[option.name] = [];
                }
                groupedOptions[option.name].push(option);
            }
        }
    }

    // 각 옵션 그룹 이름에 대해 선택된 옵션 ID를 관리합니다.
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

    /// <summary>
    /// [기능]: 옵션 선택 상자의 값이 변경되었을 때 상태를 업데이트합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: func_ 접두사 적용
    /// </summary>
    const func_OnOptionChange = (groupName: string, optionId: string) =>
    {
        setSelectedOptions(
            {
                ...selectedOptions,
                [groupName]: optionId,
            }
        );
    };

    // 총 상품 금액을 계산합니다: 기본 가격 + 선택된 옵션의 추가 금액의 합
    let additionalPriceSum = 0;
    if (product.options != null)
    {
        const keys = Object.keys(groupedOptions);
        for (let i = 0; i < keys.length; i++)
        {
            const groupName = keys[i];
            if (groupName != null)
            {
                const selectedOptionId = selectedOptions[groupName];
                if (selectedOptionId != null && selectedOptionId !== '')
                {
                    const opt = product.options.find((o) =>
                    {
                        return o.id === selectedOptionId;
                    });
                    if (opt != null)
                    {
                        additionalPriceSum += opt.additionalPrice;
                    }
                }
            }
        }
    }
    const totalPrice = product.price + additionalPriceSum;

    /// <summary>
    /// [기능]: 바로 구매 버튼 클릭 시 필수 옵션을 검증하고, 결제 아이템을 저장한 뒤 주문서 작성 페이지로 라우팅합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 로컬 스토리지 연동 및 라우팅 구현
    /// </summary>
    const func_OnBuyButtonClick = () =>
    {
        // 모든 옵션 그룹이 선택되었는지 체크합니다.
        const requiredGroups = Object.keys(groupedOptions);
        for (let i = 0; i < requiredGroups.length; i++)
        {
            const groupName = requiredGroups[i];
            if (groupName != null)
            {
                if (selectedOptions[groupName] == null || selectedOptions[groupName] === '')
                {
                    alert(`${groupName} 옵션을 선택해주십시오.`);
                    return;
                }
            }
        }

        const optionKeys = Object.keys(selectedOptions);
        let selectedOptionId = null;
        if (optionKeys.length > 0)
        {
            const firstKey = optionKeys[0];
            if (firstKey != null)
            {
                selectedOptionId = selectedOptions[firstKey];
            }
        }

        const checkoutItem = {
            productId: product.id,
            productName: product.name,
            imageUrl: product.imageUrl,
            optionId: selectedOptionId,
            price: totalPrice,
            quantity: 1
        };

        if (typeof window !== 'undefined')
        {
            if (window.localStorage != null)
            {
                window.localStorage.setItem('checkout_item', JSON.stringify(checkoutItem));
            }
        }

        router.push('/orders/checkout');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.imageContainer}>
                {product.imageUrl != null ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <span>이미지 없음</span>
                )}
            </div>
            <div className={styles.detailContainer}>
                <h1 className={styles.name}>{product.name}</h1>
                <div className={styles.price}>{product.price.toLocaleString()}원</div>
                <p className={styles.description}>{product.description}</p>

                {Object.keys(groupedOptions).map((groupName) =>
                {
                    return (
                        <div key={groupName} className={styles.optionSection}>
                            <div className={styles.optionTitle}>{groupName} 선택</div>
                            <select
                                className={styles.select}
                                value={selectedOptions[groupName] || ''}
                                onChange={(e) =>
                                {
                                    return func_OnOptionChange(groupName, e.target.value);
                                }}
                            >
                                <option value="">선택해주세요</option>
                                {groupedOptions[groupName].map((opt) =>
                                {
                                    return (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.value} {opt.additionalPrice > 0 ? `(+${opt.additionalPrice.toLocaleString()}원)` : ''} (재고: {opt.stock}개)
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    );
                })}

                <div className={styles.totalPriceContainer}>
                    <span className={styles.totalPriceLabel}>총 상품 금액</span>
                    <span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
                </div>

                <button className={styles.buyButton} onClick={func_OnBuyButtonClick}>
                    바로 구매하기
                </button>
            </div>

            {/* 모바일 전용 하단 플로팅 액션바 */}
            <div className={styles.floatingBar}>
                <div className={styles.floatingPriceInfo}>
                    <span className={styles.floatingPriceLabel}>총 금액</span>
                    <span className={styles.floatingPrice}>{totalPrice.toLocaleString()}원</span>
                </div>
                <button className={styles.floatingBuyButton} onClick={func_OnBuyButtonClick}>
                    구매
                </button>
            </div>
        </div>
    );
}
