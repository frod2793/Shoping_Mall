/**
 * @description [기능]: 아기자기한 감성 키링 및 패션 악세사리 모의 더미 데이터를 기입하는 시드 스크립트
 * @author 윤승종
 * @date 2026-06-29
 * @lastModifier 윤승종
 * @lastModifiedDate 2026-06-29
 * @history [수정 내용]: 머그컵/에코백 데이터를 감성 스마트톡/비즈 폰스트랩 액세서리 품목으로 전면 개정
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

    // 샘플 상품 생성 1: 키링 (아크릴 키링)
    const product1 = await prisma.product.create(
    {
        data:
        {
            name: "핸드메이드 아크릴 플라워 키링",
            category: "아크릴 키링",
            description: "<div class=\"product-detail\"><p><strong>[헤리티지 시리즈] 아크릴 플라워 키링</strong></p><p>핸드메이드로 정성껏 제작된 투명하고 영롱한 아크릴 플라워 키링입니다. 실제 생화를 말린 드라이플라워와 미세한 금박 가루를 레진 속에 정성껏 박아 넣어, 보는 각도에 따라 신비롭고 눈부신 광택을 선사합니다.</p><p>에어팟 케이스, 가방 지퍼, 열쇠고리 등 다양한 소지품에 포인트로 매칭하기 좋습니다.</p></div>",
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

    // 샘플 상품 생성 2: 목걸이 (실버 액세서리)
    const product2 = await prisma.product.create(
    {
        data:
        {
            name: "실버 925 미니 하트 펜던트 목걸이",
            category: "실버 액세서리",
            description: "<div class=\"product-detail\"><p><strong>실버 925 미니 하트 펜던트 목걸이</strong></p><p>심플하고 모던한 하트 모양의 펜던트로 포인트를 준 세련된 데일리 목걸이입니다. 고품질 92.5% 법정 순은 소재를 활용하여 알러지나 자극 없이 민감한 피부에도 부드럽게 매칭됩니다.</p><p>단독 착용은 물론 다른 네크리스와의 레이어드 아이템으로도 훌륭합니다.</p></div>",
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

    // 샘플 상품 생성 3: 폰스트랩 (비즈 스트랩)
    const product3 = await prisma.product.create(
    {
        data:
        {
            name: "파스텔 데이지 비즈 폰스트랩",
            category: "비즈 스트랩",
            description: "<div class=\"product-detail\"><p><strong>[핸드메이드] 파스텔 데이지 비즈 폰스트랩</strong></p><p>영롱한 파스텔톤 꽃 비즈와 담수진주를 오밀조밀하게 엮어 만든 사랑스러운 비즈 폰스트랩입니다. 손목에 가볍게 걸쳐 낙하를 방지할 수 있으며, 기기 종류에 구애받지 않고 스트랩 홀더에 걸어 스마트폰에 감성 포인트를 가볍게 부여할 수 있습니다.</p></div>",
            price: 8500,
            stock: 120,
            imageUrl: "/images/strap-01.png",
        }
    });

    await prisma.productOption.createMany(
    {
        data: [
            { productId: product3.id, name: "스트랩 컬러", value: "스카이 블루", additionalPrice: 0, stock: 40 },
            { productId: product3.id, name: "스트랩 컬러", value: "파스텔 핑크", additionalPrice: 0, stock: 40 },
            { productId: product3.id, name: "스트랩 컬러", value: "민트 그린", additionalPrice: 0, stock: 40 },
        ]
    });

    // 샘플 상품 생성 4: 스마트톡 (감성 스마트톡)
    const product4 = await prisma.product.create(
    {
        data:
        {
            name: "로맨틱 벨벳 리본 폰그립 스마트톡",
            category: "감성 스마트톡",
            description: "<div class=\"product-detail\"><p><strong>로맨틱 벨벳 리본 폰그립 스마트톡</strong></p><p>부드럽고 포근한 벨벳 리본에 클래식한 진주 파츠를 얹어 완성한 감성 폰그립입니다. 3단계 높이 조절이 가능한 튼튼한 그립 바디를 채택하여, 스마트폰 거치 및 안정적인 타이핑 그립감을 우아하게 선사합니다.</p></div>",
            price: 11000,
            stock: 200,
            imageUrl: "/images/smarttok-01.png",
        }
    });

    await prisma.productOption.createMany(
    {
        data: [
            { productId: product4.id, name: "리본 컬러", value: "시크 블랙", additionalPrice: 0, stock: 70 },
            { productId: product4.id, name: "리본 컬러", value: "밀크 베이지", additionalPrice: 0, stock: 70 },
            { productId: product4.id, name: "리본 컬러", value: "프렌치 로즈", additionalPrice: 500, stock: 60 },
        ]
    });

    // 샘플 상품 생성 5: 엽서 (오브제 팬시)
    const product5 = await prisma.product.create(
    {
        data:
        {
            name: "감성 일러스트 데코 엽서 5종 세트",
            category: "오브제 팬시",
            description: "<div class=\"product-detail\"><p><strong>감성 일러스트 데코 엽서 5종 세트</strong></p><p>따뜻한 크림톤 머메이드 종이에 아날로그 수채화 일러스트를 담아낸 인테리어 데코 엽서 세트입니다. 홈 카페 벽면에 가볍게 마스킹 테이프로 붙여 연출하거나, 소중한 이에게 손 편지를 적어 마음을 전할 때 유용하게 쓰입니다.</p></div>",
            price: 8000,
            stock: 300,
            imageUrl: "/images/postcard-01.png",
        }
    });

    await prisma.productOption.createMany(
    {
        data: [
            { productId: product5.id, name: "종이 재질", value: "일반 머메이드지", additionalPrice: 0, stock: 150 },
            { productId: product5.id, name: "종이 재질", value: "도톰한 반누보지", additionalPrice: 500, stock: 150 },
        ]
    });

    // 더미 주문 생성 1
    await prisma.order.create(
    {
        data:
        {
            id: "20260629-0001",
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

    // 더미 주문 생성 2
    await prisma.order.create(
    {
        data:
        {
            id: "20260629-0002",
            totalPrice: 32500,
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
                        optionInfo: "줄 길이: 40cm, 도금 여부: 실버",
                        price: 24000,
                        quantity: 1
                    },
                    {
                        productId: product3.id,
                        productName: product3.name,
                        optionInfo: "스트랩 컬러: 파스텔 핑크",
                        price: 8500,
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
