# Product Domain Service and Repository Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Core Product domain entities, decoupling repository interfaces (DIP), implementing business logic in ProductService, verifying with unit tests, and implementing infrastructure integration with Prisma.

**Architecture:** Core domains act as POCO-like structures. ProductService holds logic independent of the persistence layer. PrismaProductRepository implements the IProductRepository interface to wrap Prisma queries.

**Tech Stack:** TypeScript, Vitest, Prisma Client

---

### Task 1: Define Product Domain Interface

**Files:**
- Create: `/src/core/domains/Product.ts`

- [ ] **Step 1: Write Product and ProductOption domain interfaces**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/core/domains/Product.ts` with Allman style braces.
  Code:
  ```typescript
  /**
   * [기능]: 상품 도메인 모델 인터페이스 정의
   * [작성자]: 윤승종
   */

  export interface ProductOption
  {
      id: string;
      productId: string;
      name: string;
      value: string;
      additionalPrice: number;
      stock: number;
  }

  export interface Product
  {
      id: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      imageUrl?: string | null;
      createdAt: Date;
      updatedAt: Date;
      options?: ProductOption[];
  }
  ```

---

### Task 2: Define Product Repository Interface

**Files:**
- Create: `/src/core/repositories/IProductRepository.ts`

- [ ] **Step 1: Write repository interface**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/core/repositories/IProductRepository.ts` with Allman style braces.
  Code:
  ```typescript
  /**
   * [기능]: 상품 리포지토리 인터페이스 정의 (DIP 적용)
   * [작성자]: 윤승종
   */
  import { Product } from '../domains/Product';

  export interface IProductRepository
  {
      findAll(): Promise<Product[]>;
      findById(id: string): Promise<Product | null>;
  }
  ```

---

### Task 3: Implement ProductService

**Files:**
- Create: `/src/core/services/ProductService.ts`

- [ ] **Step 1: Write ProductService class**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/core/services/ProductService.ts` with Allman style braces.
  Code:
  ```typescript
  /**
   * [기능]: 상품 비즈니스 로직 서비스 클래스
   * [작성자]: 윤승종
   */
  import { IProductRepository } from '../repositories/IProductRepository';
  import { Product } from '../domains/Product';

  export class ProductService
  {
      private readonly m_productRepository: IProductRepository;

      constructor(productRepository: IProductRepository)
      {
          this.m_productRepository = productRepository;
      }

      public async getAllProducts(): Promise<Product[]>
      {
          return this.m_productRepository.findAll();
      }

      public async getProductById(id: string): Promise<Product | null>
      {
          if (!id)
          {
              throw new Error("[ProductService] 상품 ID는 필수입니다.");
          }
          return this.m_productRepository.findById(id);
      }
  }
  ```

---

### Task 4: Write Unit Tests for ProductService

**Files:**
- Create: `/src/core/services/__tests__/ProductService.test.ts`

- [ ] **Step 1: Write failing and passing test cases**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/core/services/__tests__/ProductService.test.ts` with Allman style braces.
  Code:
  ```typescript
  /**
   * [기능]: ProductService의 상품 조회 비즈니스 로직 단위 테스트
   * [작성자]: 윤승종
   */
  import { describe, it, expect, vi } from 'vitest';
  import { ProductService } from '../ProductService';
  import { IProductRepository } from '../../repositories/IProductRepository';
  import { Product } from '../../domains/Product';

  describe('ProductService', () =>
  {
      const mockProduct: Product = {
          id: "prod-1",
          name: "테스트 상품",
          description: "설명",
          price: 1000,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const mockRepo: IProductRepository = {
          findAll: vi.fn().mockResolvedValue([mockProduct]),
          findById: vi.fn().mockResolvedValue(mockProduct),
      };

      const service = new ProductService(mockRepo);

      it('getAllProducts should return product array', async () =>
      {
          const result = await service.getAllProducts();
          expect(result).toHaveLength(1);
          expect(result[0].name).toBe("테스트 상품");
      });

      it('getProductById should throw error when id is empty', async () =>
      {
          await expect(service.getProductById("")).rejects.toThrow("[ProductService] 상품 ID는 필수입니다.");
      });
  });
  ```

---

### Task 5: Execute Tests and Verify

**Files:**
- None

- [ ] **Step 1: Run Vitest runner**
  Run: `npx vitest run`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Both Dummy Test and ProductService tests pass.

---

### Task 6: Implement Prisma Infrastructure Repository

**Files:**
- Create: `/src/infrastructure/database/PrismaProductRepository.ts`

- [ ] **Step 1: Write PrismaProductRepository implementation**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/infrastructure/database/PrismaProductRepository.ts` with Allman style braces.
  Code:
  ```typescript
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
  ```

---

### Task 7: Commit Code Changes

**Files:**
- Tracked git changes

- [ ] **Step 1: Commit files to git repository**
  Run: `git add . && git commit -m "feat: 상품 도메인 모델, 서비스 및 Prisma 리포지토리 구현"`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful commit with the Korean message.
