/**
 * [기능]: Prisma 기반의 상품 리포지토리 구현체
 * [작성자]: 윤승종
 */
import { IProductRepository } from '@/core/repositories/IProductRepository';
import { Product } from '@/core/domains/Product';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaProductRepository implements IProductRepository
{
    public async findAll(): Promise<Product[]>
    {
        return prisma.product.findMany(
        {
            include:
            {
                options: true
            }
        });
    }

    public async findById(id: string): Promise<Product | null>
    {
        return prisma.product.findUnique(
        {
            where: { id },
            include:
            {
                options: true
            }
        });
    }
}
