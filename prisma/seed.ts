/**
 * [기능]: 데이터베이스 초기 더미 데이터를 기입하는 시드 스크립트
 * [작성자]: 윤승종
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main()
{
    // 기존 데이터 제거
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
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
            name: "핸드메이드 아크릴 플라워 키링",
            description: "핸드메이드로 정성껏 제작된 투명하고 영롱한 아크릴 플라워 키링입니다. 에어팟, 백팩 등에 연출하기 좋습니다.",
            price: 8900,
            stock: 150,
            imageUrl: "/images/keyring-01.jpg",
        }
    });

    await prisma.productOption.createMany(
    {
        data: [
            { productId: product1.id, name: "고리 종류", value: "D자고리", additionalPrice: 0, stock: 50 },
            { productId: product1.id, name: "고리 종류", value: "하트고리", additionalPrice: 500, stock: 50 },
            { productId: product1.id, name: "고리 종류", value: "붕어고리", additionalPrice: 300, stock: 50 },
        ]
    });

    // 샘플 상품 생성 2
    const product2 = await prisma.product.create(
    {
        data:
        {
            name: "실버 925 미니 하트 펜던트 목걸이",
            description: "세련되고 심플한 미니 하트 펜던트가 돋보이는 실버 925 목걸이입니다. 알러지 걱정 없이 착용 가능합니다.",
            price: 24000,
            stock: 80,
            imageUrl: "/images/necklace-01.jpg",
        }
    });

    await prisma.productOption.createMany(
    {
        data: [
            { productId: product2.id, name: "줄 길이", value: "40cm", additionalPrice: 0, stock: 30 },
            { productId: product2.id, name: "줄 길이", value: "45cm", additionalPrice: 1000, stock: 30 },
            { productId: product2.id, name: "줄 길이", value: "50cm", additionalPrice: 2000, stock: 20 },
            { productId: product2.id, name: "도금 여부", value: "실버", additionalPrice: 0, stock: 40 },
            { productId: product2.id, name: "도금 여부", value: "18K 골드도금", additionalPrice: 3000, stock: 40 },
        ]
    });

    // 더미 주문 및 상세 아이템 연동 생성
    await prisma.order.create(
    {
        data:
        {
            totalPrice: 8900,
            status: "PAID",
            shippingName: "홍길동",
            shippingPhone: "010-1234-5678",
            shippingAddress: "서울시 강남구 역삼동 123-45",
            shippingMemo: "문 앞에 놔주세요.",
            items:
            {
                create: [
                    {
                        productId: product1.id,
                        productName: product1.name,
                        optionInfo: "고리 종류: D자고리",
                        price: 8900,
                        quantity: 1
                    }
                ]
            }
        }
    });

    await prisma.order.create(
    {
        data:
        {
            totalPrice: 27000,
            status: "SHIPPED",
            shippingName: "김철수",
            shippingPhone: "010-9876-5432",
            shippingAddress: "부산시 해운대구 우동 987",
            shippingMemo: "배송 전 연락바랍니다.",
            items:
            {
                create: [
                    {
                        productId: product2.id,
                        productName: product2.name,
                        optionInfo: "줄 길이: 45cm, 도금 여부: 실버",
                        price: 25000,
                        quantity: 1
                    },
                    {
                        productId: product1.id,
                        productName: product1.name,
                        optionInfo: "고리 종류: D자고리",
                        price: 2000, // 임시
                        quantity: 1
                    }
                ]
            }
        }
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
