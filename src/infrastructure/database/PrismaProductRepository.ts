/**
 * [기능]: Prisma 기반의 상품 리포지토리 구현체
 * [작성자]: 윤승종
 */
import { IProductRepository } from '@/core/repositories/IProductRepository';
import { Product } from '@/core/domains/Product';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Base64 Data URL 파싱 헬퍼
function parseBase64Image(dataUrl: string) {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        return null;
    }
    return {
        mimeType: matches[1],
        buffer: Buffer.from(matches[2], 'base64')
    };
}

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
        const productId = randomUUID();
        let imageBytes: Buffer | null = null;
        let imageMime: string | null = null;
        let finalImageUrl: string | null = null;

        if (data.imageUrl && data.imageUrl.startsWith('data:image/')) {
            const parsed = parseBase64Image(data.imageUrl);
            if (parsed) {
                imageBytes = parsed.buffer;
                imageMime = parsed.mimeType;
                finalImageUrl = `/api/products/image/${productId}`;
            }
        } else {
            finalImageUrl = data.imageUrl || null;
        }

        return prisma.product.create(
        {
            data:
            {
                id: productId,
                name: data.name,
                description: data.description,
                price: Number(data.price),
                stock: Number(data.stock),
                imageUrl: finalImageUrl,
                imageBytes: imageBytes,
                imageMime: imageMime,
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

            const updateData: any = {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                stock: Number(data.stock),
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
            };

            if (data.imageUrl) {
                if (data.imageUrl.startsWith('data:image/')) {
                    const parsed = parseBase64Image(data.imageUrl);
                    if (parsed) {
                        updateData.imageBytes = parsed.buffer;
                        updateData.imageMime = parsed.mimeType;
                        updateData.imageUrl = `/api/products/image/${id}`;
                    }
                } else {
                    updateData.imageUrl = data.imageUrl;
                }
            } else {
                updateData.imageBytes = null;
                updateData.imageMime = null;
                updateData.imageUrl = null;
            }

            return tx.product.update(
            {
                where: { id },
                data: updateData,
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
