# Product API Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Next.js API Routes for products listing (`/api/products`) and product detail (`/api/products/[id]`) with proper exception handling and strict null checking.

**Architecture:** Utilize App Router's Route Handlers. Re-use `PrismaProductRepository` and `ProductService` created in Task 3 to return JSON payloads.

**Tech Stack:** Next.js (App Router), TypeScript, Prisma Client, Vitest

---

### Task 1: Create Product List API Route

**Files:**
- Create: `/src/app/api/products/route.ts`

- [ ] **Step 1: Write API handler for listing products**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/api/products/route.ts` with Allman style braces, Korean error logs, and the author header.
  Code:
  ```typescript
  /**
   * [기능]: 상품 전체 목록 조회 API 라우터
   * [작성자]: 윤승종
   */
  import { NextResponse } from 'next/server';
  import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
  import { ProductService } from '@/core/services/ProductService';

  const productRepo = new PrismaProductRepository();
  const productService = new ProductService(productRepo);

  export async function GET()
  {
      try
      {
          const products = await productService.getAllProducts();
          return NextResponse.json(products);
      }
      catch (error: any)
      {
          console.error("[GET /api/products] 에러 발생:", error);
          return NextResponse.json({ error: "상품 조회 실패" }, { status: 500 });
      }
  }
  ```

---

### Task 2: Create Product Detail API Route

**Files:**
- Create: `/src/app/api/products/[id]/route.ts`

- [ ] **Step 1: Write API handler for retrieving product details**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/api/products/[id]/route.ts` with Allman style braces, explicit null checking, Korean logs, and the author header.
  Code:
  ```typescript
  /**
   * [기능]: 특정 ID 상품 상세 정보 조회 API 라우터
   * [작성자]: 윤승종
   */
  import { NextRequest, NextResponse } from 'next/server';
  import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
  import { ProductService } from '@/core/services/ProductService';

  const productRepo = new PrismaProductRepository();
  const productService = new ProductService(productRepo);

  export async function GET(
      request: NextRequest,
      { params }: { params: { id: string } }
  )
  {
      try
      {
          const id = params.id;
          const product = await productService.getProductById(id);
          if (product == null)
          {
              return NextResponse.json({ error: "존재하지 않는 상품입니다." }, { status: 404 });
          }
          return NextResponse.json(product);
      }
      catch (error: any)
      {
          console.error(`[GET /api/products/${params.id}] 에러 발생:`, error);
          return NextResponse.json({ error: "상품 상세 조회 실패" }, { status: 500 });
      }
  }
  ```

---

### Task 3: Verify Unit and Integration Tests

**Files:**
- None

- [ ] **Step 1: Run Vitest**
  Run: `npx vitest run`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: All tests pass.

---

### Task 4: Commit Code Changes

**Files:**
- Tracked git changes

- [ ] **Step 1: Commit files to git repository**
  Run: `git add . && git commit -m "feat: 상품 목록 및 상세 조회 API 라우트 구현"`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful commit with the Korean message.
