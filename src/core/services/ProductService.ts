/**
 * [기능]: 상품 비즈니스 로직 서비스 클래스
 * [작성자]: 윤승종
 */
import { IProductRepository } from '../repositories/IProductRepository';
import { Product } from '../domains/Product';

export class ProductService
{
    private readonly m_productRepository: IProductRepository;

    constructor(productRepository: IProductRepository)
    {
        this.m_productRepository = productRepository;
    }

    public async getAllProducts(): Promise<Product[]>
    {
        return this.m_productRepository.findAll();
    }

    public async getProductById(id: string): Promise<Product | null>
    {
        if (!id)
        {
            throw new Error("[ProductService] 상품 ID는 필수입니다.");
        }
        return this.m_productRepository.findById(id);
    }
}
