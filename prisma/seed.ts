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

    // ==========================================
    // 카테고리 1: 아크릴 키링
    // ==========================================
    const keyring1 = await prisma.product.create(
    {
        data:
        {
            name: "핸드메이드 아크릴 플라워 키링",
            category: "아크릴 키링",
            description: "<div class=\"product-detail\"><p><strong>[헤리티지 시리즈] 아크릴 플라워 키링</strong></p><p>핸드메이드로 정성껏 제작된 투명하고 영롱한 아크릴 플라워 키링입니다. 실제 생화를 말린 드라이플라워와 미세한 금박 가루를 레진 속에 정성껏 박아 넣어, 보는 각도에 따라 신비롭고 눈부신 광택을 선사합니다.</p></div>",
            price: 8900,
            stock: 150,
            imageUrl: "/images/keyring-01.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: keyring1.id, name: "고리 종류", value: "D자고리", additionalPrice: 0, stock: 50 },
            { productId: keyring1.id, name: "고리 종류", value: "하트고리", additionalPrice: 500, stock: 50 },
        ]
    });

    const keyring2 = await prisma.product.create(
    {
        data:
        {
            name: "밤하늘 별무리 야광 아크릴 키링",
            category: "아크릴 키링",
            description: "<div class=\"product-detail\"><p><strong>[코스믹 시리즈] 밤하늘 별무리 아크릴 키링</strong></p><p>은은한 야광 글리터 펄과 입체적인 달, 그리고 아기자기한 별참 파츠들이 다단으로 레이어드된 몽환적 디자인의 키링입니다. 어두운 곳에서 은은하게 빛나는 밤하늘 감성을 담았습니다.</p></div>",
            price: 9500,
            stock: 100,
            imageUrl: "/images/keyring-02.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: keyring2.id, name: "고리 종류", value: "실버 기본 D형", additionalPrice: 0, stock: 50 },
            { productId: keyring2.id, name: "고리 종류", value: "골드 트윈스타", additionalPrice: 800, stock: 50 },
        ]
    });

    const keyring3 = await prisma.product.create(
    {
        data:
        {
            name: "파스텔 솜방망이 젤리캣 키링",
            category: "아크릴 키링",
            description: "<div class=\"product-detail\"><p><strong>[캣앤미 시리즈] 파스텔 젤리캣 키링</strong></p><p>귀여운 파스텔 톤 아기 고양이 일러스트가 프린팅된 이중 코팅 아크릴과, 말랑하고 쫀득한 솜방망이 젤리 모양 참 파츠를 매치한 시그니처 베스트셀러 키링입니다.</p></div>",
            price: 7900,
            stock: 120,
            imageUrl: "/images/keyring-03.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: keyring3.id, name: "고양이 컬러", value: "치즈 옐로우", additionalPrice: 0, stock: 60 },
            { productId: keyring3.id, name: "고양이 컬러", value: "러시안 블루", additionalPrice: 0, stock: 60 },
        ]
    });


    // ==========================================
    // 카테고리 2: 비즈 스트랩
    // ==========================================
    const strap1 = await prisma.product.create(
    {
        data:
        {
            name: "파스텔 데이지 진주 비즈 폰스트랩",
            category: "비즈 스트랩",
            description: "<div class=\"product-detail\"><p><strong>[핸드메이드] 파스텔 데이지 비즈 폰스트랩</strong></p><p>영롱한 파스텔톤 꽃 비즈와 담수진주를 오밀조밀하게 엮어 만든 사랑스러운 비즈 폰스트랩입니다. 손목에 걸쳐 스마트폰 낙하 방지 및 그립감을 우수하게 향상시킵니다.</p></div>",
            price: 8500,
            stock: 120,
            imageUrl: "/images/strap-01.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: strap1.id, name: "스트랩 컬러", value: "스카이 블루", additionalPrice: 0, stock: 60 },
            { productId: strap1.id, name: "스트랩 컬러", value: "파스텔 핑크", additionalPrice: 0, stock: 60 },
        ]
    });

    const strap2 = await prisma.product.create(
    {
        data:
        {
            name: "솜사탕 체리 레인보우 비즈 스트랩",
            category: "비즈 스트랩",
            description: "<div class=\"product-detail\"><p><strong>[핸드메이드] 솜사탕 체리 레인보우 비즈 스트랩</strong></p><p>달콤하고 상큼한 솜사탕 느낌의 파스텔 레인보우 비즈 배색에, 입체적인 미니 체리 파츠를 얹어 싱그럽고 발랄한 에너지를 채워넣은 비즈 스트랩입니다.</p></div>",
            price: 9800,
            stock: 90,
            imageUrl: "/images/strap-02.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: strap2.id, name: "길이 타입", value: "기본 숏 15cm", additionalPrice: 0, stock: 45 },
            { productId: strap2.id, name: "길이 타입", value: "크로스 바디 120cm", additionalPrice: 5000, stock: 45 },
        ]
    });

    const strap3 = await prisma.product.create(
    {
        data:
        {
            name: "클래식 천연 담수진주 폰스트랩",
            category: "비즈 스트랩",
            description: "<div class=\"product-detail\"><p><strong>[핸드메이드] 클래식 천연 담수진주 폰스트랩</strong></p><p>울퉁불퉁 매력적인 천연 담수진주와 깔끔한 14K 골드 필드 볼 비즈들을 엮어, 고급스럽고 미니멀하며 차분한 어른스러운 감성을 더해낸 진주 스트랩입니다.</p></div>",
            price: 12000,
            stock: 80,
            imageUrl: "/images/strap-03.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: strap3.id, name: "금속 마감 종류", value: "14K 골드필드", additionalPrice: 0, stock: 40 },
            { productId: strap3.id, name: "금속 마감 종류", value: "실버 925", additionalPrice: 0, stock: 40 },
        ]
    });


    // ==========================================
    // 카테고리 3: 실버 액세서리
    // ==========================================
    const silver1 = await prisma.product.create(
    {
        data:
        {
            name: "실버 925 미니 하트 펜던트 목걸이",
            category: "실버 액세서리",
            description: "<div class=\"product-detail\"><p><strong>실버 925 미니 하트 펜던트 목걸이</strong></p><p>심플하고 모던한 하트 모양의 펜던트로 포인트를 준 세련된 데일리 목걸이입니다. 고품질 92.5% 법정 순은 소재를 활용하여 피부 자극이 없으며, 레이어드 코디로도 안성맞춤입니다.</p></div>",
            price: 24000,
            stock: 80,
            imageUrl: "/images/necklace-01.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: silver1.id, name: "줄 길이", value: "40cm", additionalPrice: 0, stock: 40 },
            { productId: silver1.id, name: "줄 길이", value: "45cm", additionalPrice: 1000, stock: 40 },
        ]
    });

    const silver2 = await prisma.product.create(
    {
        data:
        {
            name: "실버 925 레이어드 트위스트 실반지",
            category: "실버 액세서리",
            description: "<div class=\"product-detail\"><p><strong>실버 925 레이어드 트위스트 반지</strong></p><p>부드럽게 꼬인 은실 디테일로 빛을 받을 때 은은하고 섬세하게 반짝이는 실버 반지입니다. 단독 착용하여 미니멀한 감성을 연출하거나 가드링으로 활용하기 좋습니다.</p></div>",
            price: 18000,
            stock: 150,
            imageUrl: "/images/ring-01.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: silver2.id, name: "호수", value: "11호", additionalPrice: 0, stock: 50 },
            { productId: silver2.id, name: "호수", value: "13호", additionalPrice: 0, stock: 50 },
            { productId: silver2.id, name: "호수", value: "15호", additionalPrice: 0, stock: 50 },
        ]
    });

    const silver3 = await prisma.product.create(
    {
        data:
        {
            name: "미니 스타 원터치 링 귀걸이",
            category: "실버 액세서리",
            description: "<div class=\"product-detail\"><p><strong>[실버 925] 미니 스타 원터치 귀걸이</strong></p><p>착용이 간편한 원터치 실버 링에 앙증맞은 미니 스타 펜던트가 흔들리는 귀걸이입니다. 알러지 방지 처리가 되어 있으며 데일리 착용으로 매우 가볍고 편안합니다.</p></div>",
            price: 15500,
            stock: 90,
            imageUrl: "/images/earring-01.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: silver3.id, name: "금속 컬러", value: "내추럴 실버", additionalPrice: 0, stock: 45 },
            { productId: silver3.id, name: "금속 컬러", value: "18K 골드도금", additionalPrice: 2000, stock: 45 },
        ]
    });


    // ==========================================
    // 카테고리 4: 감성 스마트톡
    // ==========================================
    const tok1 = await prisma.product.create(
    {
        data:
        {
            name: "로맨틱 벨벳 리본 폰그립 스마트톡",
            category: "감성 스마트톡",
            description: "<div class=\"product-detail\"><p><strong>로맨틱 벨벳 리본 폰그립 스마트톡</strong></p><p>포근하고 부드러운 고급 벨벳 리본 리 디자인에 클래식한 진주 비즈 파츠를 결합한 우아한 그립톡입니다. 3단 높이 조절로 편안한 손가락 그립감과 거치 기능을 선사합니다.</p></div>",
            price: 11000,
            stock: 200,
            imageUrl: "/images/smarttok-01.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: tok1.id, name: "리본 컬러", value: "시크 블랙", additionalPrice: 0, stock: 100 },
            { productId: tok1.id, name: "리본 컬러", value: "밀크 베이지", additionalPrice: 0, stock: 100 },
        ]
    });

    const tok2 = await prisma.product.create(
    {
        data:
        {
            name: "오로라 클리어 하트 곰돌이 스마트톡",
            category: "감성 스마트톡",
            description: "<div class=\"product-detail\"><p><strong>[오로라 펄] 클리어 곰돌이 스마트톡</strong></p><p>투명하고 맑은 하트를 껴안고 있는 입체 곰돌이 피규어 스마트톡입니다. 오로라 특수 코팅 마감으로 햇빛이나 형광등 각도에 따라 신비로운 무지갯빛 입체 반사를 뽐냅니다.</p></div>",
            price: 9900,
            stock: 140,
            imageUrl: "/images/smarttok-02.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: tok2.id, name: "바디 컬러", value: "클리어 핑크", additionalPrice: 0, stock: 70 },
            { productId: tok2.id, name: "바디 컬러", value: "오팔 투명", additionalPrice: 0, stock: 70 },
        ]
    });

    const tok3 = await prisma.product.create(
    {
        data:
        {
            name: "크림 버터 튤립 하트 에폭시 스마트톡",
            category: "감성 스마트톡",
            description: "<div class=\"product-detail\"><p><strong>크림 버터 튤립 하트 에폭시 스마트톡</strong></p><p>화사하고 따뜻한 버터 옐로우 컬러와 레트로 빈티지 튤립 드로잉에 도톰하고 맑은 에폭시 코팅을 얹어, 스크래치에 강하고 그립감이 뛰어난 플랫 스마트톡입니다.</p></div>",
            price: 10500,
            stock: 110,
            imageUrl: "/images/smarttok-03.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: tok3.id, name: "에폭시 쉐입", value: "하트형", additionalPrice: 0, stock: 55 },
            { productId: tok3.id, name: "에폭시 쉐입", value: "둥근원형", additionalPrice: 0, stock: 55 },
        ]
    });


    // ==========================================
    // 카테고리 5: 오브제 팬시
    // ==========================================
    const fancy1 = await prisma.product.create(
    {
        data:
        {
            name: "감성 일러스트 데코 엽서 5종 세트",
            category: "오브제 팬시",
            description: "<div class=\"product-detail\"><p><strong>감성 일러스트 데코 엽서 5종 세트</strong></p><p>아늑하고 따뜻한 홈 카페 및 리빙 테마 수채화 일러스트를 도톰한 수입 머메이드지에 인쇄한 아트 엽서 세트입니다. 마스킹 테이프로 벽면 인테리어용 데코에 아주 좋습니다.</p></div>",
            price: 8000,
            stock: 300,
            imageUrl: "/images/postcard-01.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: fancy1.id, name: "종이 재질", value: "일반 수입 머메이드지", additionalPrice: 0, stock: 150 },
            { productId: fancy1.id, name: "종이 재질", value: "프리미엄 반누보", additionalPrice: 500, stock: 150 },
        ]
    });

    const fancy2 = await prisma.product.create(
    {
        data:
        {
            name: "빈티지 린넨 내추럴 패브릭 포스터",
            category: "오브제 팬시",
            description: "<div class=\"product-detail\"><p><strong>빈티지 린넨 패브릭 포스터 [M]</strong></p><p>내추럴한 아이보리 린넨 패브릭 원단 위에 모던하고 내추럴한 드로잉 아트워크를 나염 인쇄한 인테리어 포스터입니다. 방문이나 빈 벽면에 걸어 감성 무드를 연출하기 좋습니다.</p></div>",
            price: 14000,
            stock: 80,
            imageUrl: "/images/poster-01.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: fancy2.id, name: "고정 도구 동봉", value: "미동봉", additionalPrice: 0, stock: 40 },
            { productId: fancy2.id, name: "고정 도구 동봉", value: "나무 우드 행거 세트", additionalPrice: 4000, stock: 40 },
        ]
    });

    const fancy3 = await prisma.product.create(
    {
        data:
        {
            name: "톰과제리 스마일 에멘탈 치즈 캔들",
            category: "오브제 팬시",
            description: "<div class=\"product-detail\"><p><strong>천연 소이 왁스 치즈 캔들</strong></p><p>구멍이 숭숭 뚫린 노란 스마일 에멘탈 치즈 쉐입을 귀엽게 구현한 캔들입니다. 100% 천연 소이 왁스를 채택하여 인체에 무해하며, 불을 켜지 않아도 은은한 레몬버베나 향이 솔솔 납니다.</p></div>",
            price: 6900,
            stock: 250,
            imageUrl: "/images/candle-01.png",
        }
    });
    await prisma.productOption.createMany({
        data: [
            { productId: fancy3.id, name: "치즈 사이즈", value: "미니 6cm", additionalPrice: 0, stock: 125 },
            { productId: fancy3.id, name: "치즈 사이즈", value: "점보 9cm", additionalPrice: 3000, stock: 125 },
        ]
    });


    // ==========================================
    // 더미 주문 생성
    // ==========================================
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
                        productId: keyring1.id,
                        productName: keyring1.name,
                        optionInfo: "고리 종류: D자고리",
                        price: 8900,
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
