/**
 * [기능]: 데이터베이스 초기 더미 데이터를 기입하는 시드 스크립트
 * [작성자]: 윤승종
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main()
{
    // 기존 데이터 제거
    await prisma.productOption.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    // 더미 관리자 계정 생성
    await prisma.user.create(
    {
        data:
        {
            email: "admin@shop.com",
            name: "관리자",
            password: "hashed_admin_password_123",
            role: "ADMIN",
        }
    });

    // 샘플 상품 생성 1
    const product1 = await prisma.product.create(
    {
        data:
        {
            name: "모던 오버핏 코튼 셔츠",
            description: "고급 면 소재로 제작되어 부드럽고 통기성이 우수한 데일리 코튼 셔츠입니다.",
            price: 49000,
            stock: 100,
            imageUrl: "/images/shirts-01.jpg",
        }
    });

    await prisma.productOption.createMany(
    {
        data: [
            { productId: product1.id, name: "색상", value: "화이트", additionalPrice: 0, stock: 50 },
            { productId: product1.id, name: "색상", value: "블루", additionalPrice: 0, stock: 50 },
            { productId: product1.id, name: "사이즈", value: "M", additionalPrice: 0, stock: 40 },
            { productId: product1.id, name: "사이즈", value: "L", additionalPrice: 2000, stock: 60 },
        ]
    });

    // 샘플 상품 생성 2
    const product2 = await prisma.product.create(
    {
        data:
        {
            name: "슬림핏 데님 팬츠",
            description: "자연스러운 워싱과 뛰어난 신축성으로 편안한 착용감을 제공하는 팬츠입니다.",
            price: 59000,
            stock: 50,
            imageUrl: "/images/denim-01.jpg",
        }
    });

    await prisma.productOption.createMany(
    {
        data: [
            { productId: product2.id, name: "사이즈", value: "30", additionalPrice: 0, stock: 25 },
            { productId: product2.id, name: "사이즈", value: "32", additionalPrice: 0, stock: 25 },
        ]
    });

    console.log("[Seed] 시드 데이터 생성이 완료되었습니다.");
}

main()
    .catch((e) =>
    {
        console.error("[Seed] 에러 발생:", e);
        process.exit(1);
    })
    .finally(async () =>
    {
        await prisma.$disconnect();
    });
