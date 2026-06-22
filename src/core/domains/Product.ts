/**
 * [기능]: 상품 도메인 모델 인터페이스 정의
 * [작성자]: 윤승종
 */

export interface ProductOption
{
    id: string;
    productId: string;
    name: string;
    value: string;
    additionalPrice: number;
    stock: number;
}

export interface Product
{
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
    options?: ProductOption[];
}
