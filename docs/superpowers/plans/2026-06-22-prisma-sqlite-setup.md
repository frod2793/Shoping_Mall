# Prisma ORM and SQLite Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish Prisma ORM, configure SQLite schema for Users, Products, and ProductOptions, run the database migrations, set up a seed script using ts-node, and seed the database.

**Architecture:** Use Prisma to generate the client and interface with an SQLite file database (`dev.db`). Use ts-node to run the typescript seeding script and populate initial records.

**Tech Stack:** Prisma, Prisma Client, SQLite, TypeScript, ts-node

---

### Task 1: Install Prisma CLI and Client

**Files:**
- Modify: `/package.json`

- [ ] **Step 1: Install Prisma and Prisma Client packages**
  Run: `npm install prisma @prisma/client`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Installation finishes successfully and lists prisma packages in package.json.

---

### Task 2: Create Prisma Schema

**Files:**
- Create: `/prisma/schema.prisma`

- [ ] **Step 2: Write SQLite-based schema file**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/prisma/schema.prisma`
  Code:
  ```prisma
  datasource db {
    provider = "sqlite"
    url      = "file:./dev.db"
  }

  generator client {
    provider = "prisma-client-js"
  }

  model User {
    id        String   @id @default(uuid())
    email     String?  @unique
    password  String?
    name      String
    role      String   @default("USER") // USER, ADMIN
    provider  String   @default("LOCAL")
    socialId  String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

  model Product {
    id          String          @id @default(uuid())
    name        String
    description String
    price       Int
    stock       Int             @default(0)
    imageUrl    String?
    createdAt   DateTime        @default(now())
    updatedAt   DateTime        @updatedAt
    options     ProductOption[]
  }

  model ProductOption {
    id              String  @id @default(uuid())
    productId       String
    product         Product @relation(fields: [productId], references: [id], onDelete: Cascade)
    name            String
    value           String
    additionalPrice Int      @default(0)
    stock           Int      @default(0)
  }
  ```

---

### Task 3: Create and Run Database Migration

**Files:**
- Create: `/prisma/migrations/*` (automatically generated)

- [ ] **Step 1: Run dev migration**
  Run: `npx prisma migrate dev --name init`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: SQLite database file `prisma/dev.db` created, migration script generated, and prisma-client-js generated successfully.

---

### Task 4: Create Seed Script

**Files:**
- Create: `/prisma/seed.ts`

- [ ] **Step 1: Write database seeding script**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/prisma/seed.ts` with Allman-style braces and 4 spaces indentation.
  Code:
  ```typescript
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
  ```

---

### Task 5: Configure package.json and Seeding Tool

**Files:**
- Modify: `/package.json`

- [ ] **Step 1: Install ts-node development dependencies**
  Run: `npm install -D ts-node typescript @types/node`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`

- [ ] **Step 2: Add prisma seed command to package.json**
  Modify package.json to append:
  ```json
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
  ```

- [ ] **Step 3: Run the seeding command**
  Run: `npx prisma db seed`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Command outputs "[Seed] 시드 데이터 생성이 완료되었습니다."

---

### Task 6: Commit Seeding and Schema Config

**Files:**
- Tracked git changes

- [ ] **Step 1: Commit files to git repository**
  Run: `git add . && git commit -m "feat: Prisma 스키마 설정 및 데이터베이스 초기 시드 등록"`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful commit with the Korean message.
