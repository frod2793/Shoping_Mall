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

    public async getProductsByCategory(category: string): Promise<Product[]>
    {
        if (category == null || category === '')
        {
            throw new Error("[ProductService] 카테고리명은 필수입니다.");
        }
        return this.m_productRepository.findByCategory(category);
    }

    public async getProductById(id: string): Promise<Product | null>
    {
        if (id == null || id === '')
        {
            throw new Error("[ProductService] 상품 ID는 필수입니다.");
        }
        return this.m_productRepository.findById(id);
    }

    public async createProduct(data: any): Promise<Product>
    {
        if (data == null)
        {
            throw new Error("[ProductService] 상품 데이터가 존재하지 않습니다.");
        }
        if (data.name == null || data.name === '')
        {
            throw new Error("[ProductService] 상품명은 필수입니다.");
        }
        if (data.price == null)
        {
            throw new Error("[ProductService] 상품 가격은 필수입니다.");
        }
        return this.m_productRepository.create(data);
    }

    public async updateProduct(id: string, data: any): Promise<Product>
    {
        if (id == null || id === '')
        {
            throw new Error("[ProductService] 상품 ID는 필수입니다.");
        }
        if (data == null)
        {
            throw new Error("[ProductService] 수정 데이터가 존재하지 않습니다.");
        }
        return this.m_productRepository.update(id, data);
    }

    public async deleteProduct(id: string): Promise<boolean>
    {
        if (id == null || id === '')
        {
            throw new Error("[ProductService] 상품 ID는 필수입니다.");
        }
        return this.m_productRepository.delete(id);
    }
}
