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
            description: "<div class=\"product-detail\"><p><strong>[헤리티지 시리즈] 아크릴 플라워 키링</strong></p><p>핸드메이드로 정성껏 제작된 투명하고 영롱한 아크릴 플라워 키링입니다. 실제 생화를 말린 드라이플라워와 미세한 금박 가루를 레진 속에 정성껏 박아 넣어, 보는 각도에 따라 신비롭고 눈부신 광택을 선사합니다.</p><p>에어팟 케이스, 가방 지퍼, 열쇠고리 등 다양한 소지품에 포인트로 매칭하기 좋습니다.</p><img src=\"/images/keyring-detail-01.png\" style=\"width:100%; max-width:600px; margin-top:20px; border-radius:8px; display:block;\" alt=\"상세 정보 이미지\" /></div>",
            price: 8900,
            stock: 150,
            imageUrl: "/images/keyring-01.png",
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
            description: "<div class=\"product-detail\"><p><strong>실버 925 미니 하트 펜던트 목걸이</strong></p><p>심플하고 모던한 하트 모양의 펜던트로 포인트를 준 세련된 데일리 목걸이입니다. 고품질 92.5% 법정 순은 소재를 활용하여 알러지나 자극 없이 민감한 피부에도 부드럽게 매칭됩니다.</p><p>단독 착용은 물론 다른 네크리스와의 레이어드 아이템으로도 훌륭합니다.</p><img src=\"/images/necklace-detail-01.png\" style=\"width:100%; max-width:600px; margin-top:20px; border-radius:8px; display:block;\" alt=\"상세 정보 이미지\" /></div>",
            price: 24000,
            stock: 80,
            imageUrl: "/images/necklace-01.png",
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

    // 샘플 상품 생성 3
    const product3 = await prisma.product.create(
    {
        data:
        {
            name: "모던 파스텔 세라믹 머그컵",
            description: "<div class=\"product-detail\"><p><strong>모던 파스텔 세라믹 머그컵</strong></p><p>우아하고 세련된 파스텔톤 그라데이션 유약을 바른 고온 소성 세라믹 머그입니다. 묵직하고 든든한 그립감을 지닌 핸들 디자인과 따뜻한 온기가 오래도록 지속되는 도톰한 단열 두께를 자랑합니다.</p><p>티타임과 커피 타임을 한층 더 로맨틱하게 감싸줄 것입니다.</p><img src=\"/images/mug-detail-01.png\" style=\"width:100%; max-width:600px; margin-top:20px; border-radius:8px; display:block;\" alt=\"상세 정보 이미지\" /></div>",
            price: 15000,
            stock: 120,
            imageUrl: "/images/mug-01.png",
        }
    });

    await prisma.productOption.createMany(
    {
        data: [
            { productId: product3.id, name: "색상", value: "파스텔 핑크", additionalPrice: 0, stock: 40 },
            { productId: product3.id, name: "색상", value: "파스텔 블루", additionalPrice: 0, stock: 40 },
            { productId: product3.id, name: "색상", value: "파스텔 그린", additionalPrice: 0, stock: 40 },
            { productId: product3.id, name: "용량", value: "350ml", additionalPrice: 0, stock: 60 },
            { productId: product3.id, name: "용량", value: "500ml", additionalPrice: 2000, stock: 60 },
        ]
    });

    // 샘플 상품 생성 4
    const product4 = await prisma.product.create(
    {
        data:
        {
            name: "미니멀 캔버스 에코백",
            description: "<div class=\"product-detail\"><p><strong>미니멀 캔버스 에코백</strong></p><p>내추럴한 무드와 튼튼한 캔버스 직조가 어우러진 베이직 에코 토트백입니다. 어깨 스트랩과 가방 본체의 접합부를 견고한 X자 격자 바느질 방식으로 2중 보강하여 무거운 전공 서적이나 태블릿도 흔들림 없이 편안하게 휴대할 수 있습니다.</p><p>넉넉한 수납 공간으로 일상적인 데일리 백에 최적입니다.</p><img src=\"/images/ecobag-detail-01.png\" style=\"width:100%; max-width:600px; margin-top:20px; border-radius:8px; display:block;\" alt=\"상세 정보 이미지\" /></div>",
            price: 12900,
            stock: 200,
            imageUrl: "/images/ecobag-01.png",
        }
    });

    await prisma.productOption.createMany(
    {
        data: [
            { productId: product4.id, name: "사이즈", value: "M (기본)", additionalPrice: 0, stock: 100 },
            { productId: product4.id, name: "사이즈", value: "L (대용량)", additionalPrice: 1500, stock: 100 },
            { productId: product4.id, name: "원단 두께", value: "10수 (보통)", additionalPrice: 0, stock: 100 },
            { productId: product4.id, name: "원단 두께", value: "8수 (도톰)", additionalPrice: 1000, stock: 100 },
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
