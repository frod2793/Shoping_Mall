# Admin Products CRUD API and UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full CRUD logic for products and product options, configure the admin product control endpoints, and build a client-side management interface with dynamic fields and modally nested editing tools.

**Architecture:** Use transaction blocks in the database repository layer to preserve option integrity (e.g. deleting old options and recreating during updates). Expose standard JSON endpoints and implement a React Client Component for the product grid table, modals, and dynamic dynamic forms.

**Tech Stack:** Next.js (App Router, CSS Modules), TypeScript, Prisma Client, SQLite, Vitest

---

### Task 1: Update Repository and Service for CRUD Operations

**Files:**
- Modify: `/src/core/repositories/IProductRepository.ts`
- Modify: `/src/infrastructure/database/PrismaProductRepository.ts`
- Modify: `/src/core/services/ProductService.ts`

- [ ] **Step 1: Update IProductRepository.ts interface**
  Modify: `/src/core/repositories/IProductRepository.ts` to declare `create`, `update`, and `delete`.
  Code:
  ```typescript
  import { Product } from '../domains/Product';

  export interface IProductRepository
  {
      findAll(): Promise<Product[]>;
      findById(id: string): Promise<Product | null>;
      create(data: any): Promise<Product>;
      update(id: string, data: any): Promise<Product>;
      delete(id: string): Promise<boolean>;
  }
  ```

- [ ] **Step 2: Update PrismaProductRepository.ts implementation**
  Modify: `/src/infrastructure/database/PrismaProductRepository.ts` with transactions for options sync.
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
                      create: data.options?.map((opt: any) => (
                      {
                          name: opt.name,
                          value: opt.value,
                          additionalPrice: Number(opt.additionalPrice || 0),
                          stock: Number(opt.stock || 0)
                      }))
                  }
              },
              include: { options: true }
          });
      }

      public async update(id: string, data: any): Promise<Product>
      {
          // Run option recreation inside a transaction block
          return prisma.$transaction(async (tx) =>
          {
              // Clear previous options
              await tx.productOption.deleteMany(
              {
                  where: { productId: id }
              });

              // Update product and recreate options
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
                          create: data.options?.map((opt: any) => (
                          {
                              name: opt.name,
                              value: opt.value,
                              additionalPrice: Number(opt.additionalPrice || 0),
                              stock: Number(opt.stock || 0)
                          }))
                      }
                  },
                  include: { options: true }
              });
          });
      }

      public async delete(id: string): Promise<boolean>
      {
          // Options cascade delete automatically due to schema definitions
          const result = await prisma.product.delete(
          {
              where: { id }
          });
          return result != null;
      }
  }
  ```

- [ ] **Step 3: Update ProductService.ts with CRUD methods**
  Modify: `/src/core/services/ProductService.ts` to add service methods wrapping repo actions.
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

      public async createProduct(data: any): Promise<Product>
      {
          if (!data.name || data.price == null)
          {
              throw new Error("[ProductService] 상품명과 가격은 필수입니다.");
          }
          return this.m_productRepository.create(data);
      }

      public async updateProduct(id: string, data: any): Promise<Product>
      {
          if (!id)
          {
              throw new Error("[ProductService] 상품 ID는 필수입니다.");
          }
          return this.m_productRepository.update(id, data);
      }

      public async deleteProduct(id: string): Promise<boolean>
      {
          if (!id)
          {
              throw new Error("[ProductService] 상품 ID는 필수입니다.");
          }
          return this.m_productRepository.delete(id);
      }
  }
  ```

---

### Task 2: Extend ProductService Unit Tests

**Files:**
- Modify: `/src/core/services/__tests__/ProductService.test.ts`

- [ ] **Step 1: Write additional test cases**
  Modify `/src/core/services/__tests__/ProductService.test.ts` to mock and check `createProduct`, `updateProduct`, and `deleteProduct`.
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
          create: vi.fn().mockResolvedValue(mockProduct),
          update: vi.fn().mockResolvedValue(mockProduct),
          delete: vi.fn().mockResolvedValue(true)
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

      it('createProduct should create and return product', async () =>
      {
          const result = await service.createProduct({ name: "새 상품", price: 5000 });
          expect(result.name).toBe("테스트 상품");
      });

      it('updateProduct should update product correctly', async () =>
      {
          const result = await service.updateProduct("prod-1", { name: "수정 상품" });
          expect(result.id).toBe("prod-1");
      });

      it('deleteProduct should delete product and return true', async () =>
      {
          const result = await service.deleteProduct("prod-1");
          expect(result).toBe(true);
      });
  });
  ```

- [ ] **Step 2: Run Vitest**
  Run: `npx vitest run`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: All tests pass.

---

### Task 3: Implement Admin Products API Routes

**Files:**
- Create: `/src/app/api/admin/products/route.ts`
- Create: `/src/app/api/admin/products/[id]/route.ts`

- [ ] **Step 1: Write admin product creation route**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/api/admin/products/route.ts`
  Code:
  ```typescript
  /**
   * [기능]: 관리자 상품 등록 API 라우터
   * [작성자]: 윤승종
   */
  import { NextRequest, NextResponse } from 'next/server';
  import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
  import { ProductService } from '@/core/services/ProductService';

  const productRepo = new PrismaProductRepository();
  const productService = new ProductService(productRepo);

  export async function POST(request: NextRequest)
  {
      try
      {
          const data = await request.json();
          const product = await productService.createProduct(data);
          return NextResponse.json(product, { status: 210 }); // 201 Created
      }
      catch (error: any)
      {
          console.error("[POST /api/admin/products] 에러 발생:", error);
          return NextResponse.json({ error: "상품 등록 실패" }, { status: 500 });
      }
  }
  ```

- [ ] **Step 2: Write admin product update & delete route**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/api/admin/products/[id]/route.ts`
  Code:
  ```typescript
  /**
   * [기능]: 관리자 상품 수정/삭제 API 라우터
   * [작성자]: 윤승종
   */
  import { NextRequest, NextResponse } from 'next/server';
  import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
  import { ProductService } from '@/core/services/ProductService';

  const productRepo = new PrismaProductRepository();
  const productService = new ProductService(productRepo);

  export async function PUT(
      request: NextRequest,
      { params }: { params: { id: string } }
  )
  {
      try
      {
          const id = params.id;
          const data = await request.json();
          const product = await productService.updateProduct(id, data);
          return NextResponse.json(product);
      }
      catch (error: any)
      {
          console.error(`[PUT /api/admin/products/${params.id}] 에러 발생:`, error);
          return NextResponse.json({ error: "상품 수정 실패" }, { status: 500 });
      }
  }

  export async function DELETE(
      request: NextRequest,
      { params }: { params: { id: string } }
  )
  {
      try
      {
          const id = params.id;
          const success = await productService.deleteProduct(id);
          if (success)
          {
              return NextResponse.json({ message: "상품이 삭제되었습니다." });
          }
          return NextResponse.json({ error: "상품 삭제에 실패했습니다." }, { status: 400 });
      }
      catch (error: any)
      {
          console.error(`[DELETE /api/admin/products/${params.id}] 에러 발생:`, error);
          return NextResponse.json({ error: "상품 삭제 처리 실패" }, { status: 500 });
      }
  }
  ```

---

### Task 4: Design Admin Products Page and Styles

**Files:**
- Create: `/src/app/admin/products/admin-products.module.css`
- Create: `/src/app/admin/products/page.tsx`

- [ ] **Step 1: Write modular CSS styling**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/admin/products/admin-products.module.css` with Allman style braces.
  Code:
  ```css
  .container
  {
      display: flex;
      flex-direction: column;
      gap: 24px;
  }

  .headerRow
  {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .title
  {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
  }

  .actionButton
  {
      padding: 10px 20px;
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
  }

  .actionButton:hover
  {
      background-color: var(--primary-hover);
  }

  .table
  {
      width: 100%;
      border-collapse: collapse;
      background-color: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
  }

  .table th, .table td
  {
      padding: 16px;
      text-align: left;
      border-bottom: 1px solid var(--border);
  }

  .table th
  {
      font-weight: bold;
      background-color: var(--background);
  }

  .table tr:last-child td
  {
      border-bottom: none;
  }

  .btnEdit
  {
      padding: 6px 12px;
      background-color: transparent;
      border: 1px solid var(--border);
      border-radius: 4px;
      color: var(--foreground);
      margin-right: 8px;
      cursor: pointer;
  }

  .btnDelete
  {
      padding: 6px 12px;
      background-color: hsl(0, 80%, 60%);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
  }

  /* Modal structure */
  .modalOverlay
  {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
  }

  .modal
  {
      background-color: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      width: 500px;
      max-width: 90%;
      max-height: 90vh;
      overflow-y: auto;
  }

  .formGroup
  {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .input, .textarea
  {
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background-color: var(--card);
      color: var(--foreground);
  }

  .optionRow
  {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr 1fr auto;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
  }

  .btnRowAction
  {
      padding: 8px 12px;
      background-color: var(--border);
      border: none;
      border-radius: 4px;
      cursor: pointer;
  }
  ```

- [ ] **Step 2: Write interactive Client Component UI page.tsx**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/admin/products/page.tsx` rendering tables, handling modal logic, and option row additions/deletions. All events start with `func_`.
  Code:
  ```tsx
  /**
   * [기능]: 관리자 상품 관리 화면 컴포넌트
   * [작성자]: 윤승종
   */
  'use client';

  import React, { useState, useEffect } from 'react';
  import { Product, ProductOption } from '@/core/domains/Product';
  import styles from './admin-products.module.css';

  interface OptionInput
  {
      name: string;
      value: string;
      additionalPrice: string;
      stock: string;
  }

  export default function AdminProductsPage()
  {
      const [products, setProducts] = useState<Product[]>([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editingProduct, setEditingProduct] = useState<Product | null>(null);

      // Form States
      const [name, setName] = useState('');
      const [description, setDescription] = useState('');
      const [price, setPrice] = useState('');
      const [stock, setStock] = useState('');
      const [imageUrl, setImageUrl] = useState('');
      const [options, setOptions] = useState<OptionInput[]>([]);

      const func_FetchProducts = async () =>
      {
          try
          {
              const res = await fetch('/api/products');
              if (res.ok)
              {
                  const data = await res.json();
                  setProducts(data);
              }
          }
          catch (e)
          {
              console.error("[AdminProductsPage] 상품 목록 로딩 실패:", e);
          }
      };

      useEffect(() =>
      {
          func_FetchProducts();
      }, []);

      const func_OpenCreateModal = () =>
      {
          setEditingProduct(null);
          setName('');
          setDescription('');
          setPrice('');
          setStock('');
          setImageUrl('');
          setOptions([]);
          setIsModalOpen(true);
      };

      const func_OpenEditModal = (product: Product) =>
      {
          setEditingProduct(product);
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price.toString());
          setStock(product.stock.toString());
          setImageUrl(product.imageUrl || '');
          
          if (product.options != null)
          {
              const mapped = product.options.map((o) => (
              {
                  name: o.name,
                  value: o.value,
                  additionalPrice: o.additionalPrice.toString(),
                  stock: o.stock.toString()
              }));
              setOptions(mapped);
          }
          else
          {
              setOptions([]);
          }
          setIsModalOpen(true);
      };

      const func_CloseModal = () =>
      {
          setIsModalOpen(false);
      };

      const func_AddOptionRow = () =>
      {
          setOptions([...options, { name: '', value: '', additionalPrice: '0', stock: '0' }]);
      };

      const func_RemoveOptionRow = (index: number) =>
      {
          const filtered = options.filter((_, idx) => idx !== index);
          setOptions(filtered);
      };

      const func_HandleOptionChange = (index: number, field: keyof OptionInput, val: string) =>
      {
          const updated = [...options];
          updated[index][field] = val;
          setOptions(updated);
      };

      const func_OnSubmit = async (e: React.FormEvent) =>
      {
          e.preventDefault();

          const payload = {
              name,
              description,
              price: Number(price),
              stock: Number(stock),
              imageUrl,
              options: options.map((o) => (
              {
                  name: o.name,
                  value: o.value,
                  additionalPrice: Number(o.additionalPrice),
                  stock: Number(o.stock)
              }))
          };

          try
          {
              if (editingProduct != null)
              {
                  // Update (PUT)
                  const res = await fetch(`/api/admin/products/${editingProduct.id}`,
                  {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                  });

                  if (res.ok)
                  {
                      alert("상품이 수정되었습니다.");
                      func_CloseModal();
                      func_FetchProducts();
                  }
              }
              else
              {
                  // Create (POST)
                  const res = await fetch('/api/admin/products',
                  {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                  });

                  if (res.ok)
                  {
                      alert("상품이 등록되었습니다.");
                      func_CloseModal();
                      func_FetchProducts();
                  }
              }
          }
          catch (error)
          {
              console.error("[AdminProductsPage] 저장 중 에러 발생:", error);
          }
      };

      const func_OnDeleteProduct = async (id: string) =>
      {
          if (!confirm("정말 이 상품을 삭제하시겠습니까?"))
          {
              return;
          }

          try
          {
              const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
              if (res.ok)
              {
                  alert("상품이 삭제되었습니다.");
                  func_FetchProducts();
              }
          }
          catch (e)
          {
              console.error("[AdminProductsPage] 삭제 중 에러 발생:", e);
          }
      };

      return (
          <div className={styles.container}>
              <div className={styles.headerRow}>
                  <h1 className={styles.title}>상품 관리</h1>
                  <button className={styles.actionButton} onClick={func_OpenCreateModal}>
                      + 상품 등록
                  </button>
              </div>

              <table className={styles.table}>
                  <thead>
                      <tr>
                          <th>상품명</th>
                          <th>가격</th>
                          <th>재고</th>
                          <th>등록일</th>
                          <th>관리</th>
                      </tr>
                  </thead>
                  <tbody>
                      {products.map((product) =>
                      {
                          return (
                              <tr key={product.id}>
                                  <td style={{ fontWeight: '600' }}>{product.name}</td>
                                  <td>{product.price.toLocaleString()}원</td>
                                  <td>{product.stock}개</td>
                                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                  <td>
                                      <button className={styles.btnEdit} onClick={() => func_OpenEditModal(product)}>
                                          수정
                                      </button>
                                      <button className={styles.btnDelete} onClick={() => func_OnDeleteProduct(product.id)}>
                                          삭제
                                      </button>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>

              {isModalOpen && (
                  <div className={styles.modalOverlay}>
                      <div className={styles.modal}>
                          <h2 style={{ marginBottom: '24px' }}>
                              {editingProduct != null ? "상품 수정" : "신규 상품 등록"}
                          </h2>
                          <form onSubmit={func_OnSubmit}>
                              <div className={styles.formGroup}>
                                  <label>상품명</label>
                                  <input 
                                      type="text" 
                                      className={styles.input} 
                                      value={name} 
                                      onChange={(e) => setName(e.target.value)} 
                                      required 
                                  />
                              </div>
                              <div className={styles.formGroup}>
                                  <label>설명</label>
                                  <textarea 
                                      className={styles.textarea} 
                                      value={description} 
                                      onChange={(e) => setDescription(e.target.value)} 
                                      rows={3} 
                                      required 
                                  />
                              </div>
                              <div className={styles.formGroup}>
                                  <label>기본 가격 (원)</label>
                                  <input 
                                      type="number" 
                                      className={styles.input} 
                                      value={price} 
                                      onChange={(e) => setPrice(e.target.value)} 
                                      required 
                                  />
                              </div>
                              <div className={styles.formGroup}>
                                  <label>기본 재고 (개)</label>
                                  <input 
                                      type="number" 
                                      className={styles.input} 
                                      value={stock} 
                                      onChange={(e) => setStock(e.target.value)} 
                                      required 
                                  />
                              </div>
                              <div className={styles.formGroup}>
                                  <label>이미지 URL</label>
                                  <input 
                                      type="text" 
                                      className={styles.input} 
                                      value={imageUrl} 
                                      onChange={(e) => setImageUrl(e.target.value)} 
                                  />
                              </div>

                              <div className={styles.formGroup}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                      <label style={{ fontWeight: 'bold' }}>상품 옵션</label>
                                      <button type="button" className={styles.actionButton} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={func_AddOptionRow}>
                                          + 옵션 추가
                                      </button>
                                  </div>
                                  
                                  {options.map((opt, idx) => (
                                      <div key={idx} className={styles.optionRow}>
                                          <input 
                                              type="text" 
                                              placeholder="옵션명(예: 색상)" 
                                              className={styles.input} 
                                              value={opt.name} 
                                              onChange={(e) => func_HandleOptionChange(idx, 'name', e.target.value)} 
                                              required 
                                          />
                                          <input 
                                              type="text" 
                                              placeholder="옵션값(예: 레드)" 
                                              className={styles.input} 
                                              value={opt.value} 
                                              onChange={(e) => func_HandleOptionChange(idx, 'value', e.target.value)} 
                                              required 
                                          />
                                          <input 
                                              type="number" 
                                              placeholder="추가가격" 
                                              className={styles.input} 
                                              value={opt.additionalPrice} 
                                              onChange={(e) => func_HandleOptionChange(idx, 'additionalPrice', e.target.value)} 
                                              required 
                                          />
                                          <input 
                                              type="number" 
                                              placeholder="재고" 
                                              className={styles.input} 
                                              value={opt.stock} 
                                              onChange={(e) => func_HandleOptionChange(idx, 'stock', e.target.value)} 
                                              required 
                                          />
                                          <button type="button" className={styles.btnRowAction} onClick={() => func_RemoveOptionRow(idx)}>
                                              삭제
                                          </button>
                                      </div>
                                  ))}
                              </div>

                              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                  <button type="submit" className={styles.actionButton} style={{ flexGrow: 1 }}>
                                      저장
                                  </button>
                                  <button type="button" className={styles.btnRowAction} style={{ flexGrow: 1 }} onClick={func_CloseModal}>
                                      취소
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              )}
          </div>
      );
  }
  ```

---

### Task 5: Verify Compilation and Run Tests

**Files:**
- None

- [ ] **Step 1: Run Vitest tests**
  Run: `npx vitest run`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: All unit tests pass.

- [ ] **Step 2: Run Next.js production build**
  Run: `npm run build`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful compilation.

---

### Task 6: Commit Changes

**Files:**
- Tracked git changes

- [ ] **Step 1: Commit files to git repository**
  Run: `git add . && git commit -m "feat: 관리자 상품 등록, 수정, 삭제 API 및 UI 개발"`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful commit with the Korean message.
