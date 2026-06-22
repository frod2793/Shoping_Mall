/**
 * [기능]: 상품 리포지토리 인터페이스 정의 (DIP 적용)
 * [작성자]: 윤승종
 */
import { Product } from '../domains/Product';

export interface IProductRepository
{
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
}
