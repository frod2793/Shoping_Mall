/**
 * [기능]: ProductService의 상품 조회 비즈니스 로직 단위 테스트
 * [작성자]: 윤승종
 */
import { describe, it, expect, vi } from 'vitest';
import { ProductService } from '../ProductService';
import { IProductRepository } from '../../repositories/IProductRepository';
import { Product } from '../../domains/Product';

describe('ProductService', () =>
{
    const mockProduct: Product = {
        id: "prod-1",
        name: "테스트 상품",
        description: "설명",
        price: 1000,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockRepo: IProductRepository = {
        findAll: vi.fn().mockResolvedValue([mockProduct]),
        findById: vi.fn().mockResolvedValue(mockProduct),
    };

    const service = new ProductService(mockRepo);

    it('getAllProducts should return product array', async () =>
    {
        const result = await service.getAllProducts();
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("테스트 상품");
    });

    it('getProductById should throw error when id is empty', async () =>
    {
        await expect(service.getProductById("")).rejects.toThrow("[ProductService] 상품 ID는 필수입니다.");
    });
});
