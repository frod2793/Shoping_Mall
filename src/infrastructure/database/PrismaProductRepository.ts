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

    public async create(data: any): Promise<Product>
    {
        return prisma.product.create(
        {
            data:
            {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                stock: Number(data.stock),
                imageUrl: data.imageUrl,
                options:
                {
                    create: data.options?.map((opt: any) =>
                    {
                        return {
                            name: opt.name,
                            value: opt.value,
                            additionalPrice: Number(opt.additionalPrice || 0),
                            stock: Number(opt.stock || 0)
                        };
                    })
                }
            },
            include: { options: true }
        });
    }

    public async update(id: string, data: any): Promise<Product>
    {
        return prisma.$transaction(async (tx) =>
        {
            await tx.productOption.deleteMany(
            {
                where: { productId: id }
            });

            return tx.product.update(
            {
                where: { id },
                data:
                {
                    name: data.name,
                    description: data.description,
                    price: Number(data.price),
                    stock: Number(data.stock),
                    imageUrl: data.imageUrl,
                    options:
                    {
                        create: data.options?.map((opt: any) =>
                        {
                            return {
                                name: opt.name,
                                value: opt.value,
                                additionalPrice: Number(opt.additionalPrice || 0),
                                stock: Number(opt.stock || 0)
                            };
                        })
                    }
                },
                include: { options: true }
            });
        });
    }

    public async delete(id: string): Promise<boolean>
    {
        const result = await prisma.product.delete(
        {
            where: { id }
        });
        return result != null;
    }
}
