# Admin Orders Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `OrderService` for managing order listing and status changes, write unit tests, expose endpoints for order list retrieval and shipping status patching, and build a tabular administration UI containing tab-based filtering and status combobox controls.

**Architecture:** `OrderService` accepts an optional `PrismaClient` to facilitate dependency injection and mock testing. Next.js API Routes expose GET (list) and PATCH (status update) methods. The frontend uses a React Client Component for tab-filters and live updates.

**Tech Stack:** Next.js (App Router, CSS Modules), TypeScript, Prisma Client, SQLite, Vitest

---

### Task 1: Create OrderService Business Logic

**Files:**
- Create: `/src/core/services/OrderService.ts`

- [ ] **Step 1: Write OrderService class**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/core/services/OrderService.ts` with optional Prisma injection, Allman style, and explicit null checks.
  Code:
  ```typescript
  /**
   * [기능]: 주문 관리 처리 비즈니스 로직 서비스 클래스
   * [작성자]: 윤승종
   */
  import { PrismaClient } from '@prisma/client';

  export class OrderService
  {
      private readonly m_prisma: PrismaClient;

      constructor(prisma?: PrismaClient)
      {
          this.m_prisma = prisma ?? new PrismaClient();
      }

      public async getAllOrders()
      {
          // Fetch orders sorted by creation date descending
          return this.m_prisma.order.findMany(
          {
              orderBy:
              {
                  createdAt: 'desc'
              }
          });
      }

      public async updateOrderStatus(id: string, status: string)
      {
          if (id == null || id === '')
          {
              throw new Error("[OrderService] 주문 ID는 필수입니다.");
          }
          if (status == null || status === '')
          {
              throw new Error("[OrderService] 변경할 주문 상태는 필수입니다.");
          }

          // Check if order exists
          const existing = await this.m_prisma.order.findUnique(
          {
              where: { id }
          });

          if (existing == null)
          {
              throw new Error("[OrderService] 존재하지 않는 주문입니다.");
          }

          return this.m_prisma.order.update(
          {
              where: { id },
              data: { status }
          });
      }
  }
  ```

---

### Task 2: Write Unit Tests for OrderService

**Files:**
- Create: `/src/core/services/__tests__/OrderService.test.ts`

- [ ] **Step 1: Write OrderService test suite**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/core/services/__tests__/OrderService.test.ts` mocking PrismaClient.
  Code:
  ```typescript
  /**
   * [기능]: OrderService 주문 관리 비즈니스 로직 단위 테스트
   * [작성자]: 윤승종
   */
  import { describe, it, expect, vi } from 'vitest';
  import { OrderService } from '../OrderService';
  import { PrismaClient } from '@prisma/client';

  describe('OrderService', () =>
  {
      const mockOrder = {
          id: "ord-1",
          userId: "user-1",
          status: "PAID",
          totalPrice: 15000,
          createdAt: new Date(),
          updatedAt: new Date()
      };

      const mockPrisma = {
          order:
          {
              findMany: vi.fn().mockResolvedValue([mockOrder]),
              findUnique: vi.fn().mockResolvedValue(mockOrder),
              update: vi.fn().mockResolvedValue({ ...mockOrder, status: "SHIPPED" })
          }
      } as unknown as PrismaClient;

      const service = new OrderService(mockPrisma);

      it('getAllOrders should return ordered lists', async () =>
      {
          const result = await service.getAllOrders();
          expect(result).toHaveLength(1);
          expect(result[0].status).toBe("PAID");
      });

      it('updateOrderStatus should update order status successfully', async () =>
      {
          const result = await service.updateOrderStatus("ord-1", "SHIPPED");
          expect(result.status).toBe("SHIPPED");
      });

      it('updateOrderStatus should throw error when id is empty', async () =>
      {
          await expect(service.updateOrderStatus("", "SHIPPED")).rejects.toThrow("[OrderService] 주문 ID는 필수입니다.");
      });
  });
  ```

- [ ] **Step 2: Run tests**
  Run: `npx vitest run`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: All tests pass successfully.

---

### Task 3: Implement Admin Orders API Routes

**Files:**
- Create: `/src/app/api/admin/orders/route.ts`
- Create: `/src/app/api/admin/orders/[id]/status/route.ts`

- [ ] **Step 1: Write admin orders list route**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/api/admin/orders/route.ts`
  Code:
  ```typescript
  /**
   * [기능]: 관리자 주문 전체 목록 조회 API 라우터
   * [작성자]: 윤승종
   */
  import { NextResponse } from 'next/server';
  import { OrderService } from '@/core/services/OrderService';

  const orderService = new OrderService();

  export async function GET()
  {
      try
      {
          const orders = await orderService.getAllOrders();
          return NextResponse.json(orders);
      }
      catch (error: any)
      {
          console.error("[GET /api/admin/orders] 에러 발생:", error);
          return NextResponse.json({ error: "주문 목록 조회 실패" }, { status: 500 });
      }
  }
  ```

- [ ] **Step 2: Write admin order status patch route**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/api/admin/orders/[id]/status/route.ts`
  Code:
  ```typescript
  /**
   * [기능]: 관리자 주문 배송 상태 변경 API 라우터
   * [작성자]: 윤승종
   */
  import { NextRequest, NextResponse } from 'next/server';
  import { OrderService } from '@/core/services/OrderService';

  const orderService = new OrderService();

  export async function PATCH(
      request: NextRequest,
      { params }: { params: { id: string } }
  )
  {
      try
      {
          const id = params.id;
          const { status } = await request.json();
          const updatedOrder = await orderService.updateOrderStatus(id, status);
          if (updatedOrder == null)
          {
              return NextResponse.json({ error: "주문 상태 변경 실패" }, { status: 400 });
          }
          return NextResponse.json(updatedOrder);
      }
      catch (error: any)
      {
          console.error(`[PATCH /api/admin/orders/${params.id}/status] 에러 발생:`, error);
          return NextResponse.json({ error: error.message || "주문 상태 변경 실패" }, { status: 500 });
      }
  }
  ```

---

### Task 4: Design Admin Orders Page and Styles

**Files:**
- Create: `/src/app/admin/orders/admin-orders.module.css`
- Create: `/src/app/admin/orders/page.tsx`

- [ ] **Step 1: Write CSS layout rules**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/admin/orders/admin-orders.module.css`
  Code:
  ```css
  .container
  {
      display: flex;
      flex-direction: column;
      gap: 24px;
  }

  .title
  {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
  }

  .filterContainer
  {
      display: flex;
      gap: 8px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 12px;
      margin-bottom: 8px;
  }

  .filterButton
  {
      padding: 10px 16px;
      background-color: transparent;
      border: 1px solid var(--border);
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      color: var(--foreground);
      font-size: 14px;
      transition: background-color 0.2s;
  }

  .filterButton:hover
  {
      background-color: var(--border);
  }

  .filterButtonActive
  {
      padding: 10px 16px;
      background-color: var(--primary);
      color: white;
      border: 1px solid var(--primary);
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
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

  .select
  {
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background-color: var(--card);
      color: var(--foreground);
      outline: none;
      cursor: pointer;
  }

  .select:focus
  {
      border-color: var(--primary);
  }

  .badge
  {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
  }

  .badgePending
  {
      background-color: hsl(25, 95%, 90%);
      color: hsl(25, 95%, 40%);
  }

  .badgePaid
  {
      background-color: hsl(120, 80%, 90%);
      color: hsl(120, 80%, 30%);
  }

  .badgeShipped
  {
      background-color: hsl(220, 80%, 90%);
      color: hsl(220, 80%, 40%);
  }

  .badgeDelivered
  {
      background-color: hsl(0, 0%, 90%);
      color: hsl(0, 0%, 30%);
  }
  ```

- [ ] **Step 2: Write AdminOrdersPage client component page.tsx**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/admin/orders/page.tsx`
  Code:
  ```tsx
  /**
   * [기능]: 관리자 주문 관리 화면 컴포넌트
   * [작성자]: 윤승종
   */
  'use client';

  import React, { useState, useEffect } from 'react';
  import styles from './admin-orders.module.css';

  interface Order
  {
      id: string;
      userId: string | null;
      status: string;
      totalPrice: number;
      createdAt: string;
      updatedAt: string;
  }

  const STATUS_MAP: { [key: string]: string } = {
      PENDING_PAYMENT: "결제 대기",
      PAID: "결제 완료",
      SHIPPED: "배송 중",
      DELIVERED: "배송 완료"
  };

  export default function AdminOrdersPage()
  {
      const [orders, setOrders] = useState<Order[]>([]);
      const [filter, setFilter] = useState('ALL');

      const func_FetchOrders = async () =>
      {
          try
          {
              const res = await fetch('/api/admin/orders');
              if (res.ok === true)
              {
                  const data = await res.json();
                  if (data != null)
                  {
                      setOrders(data);
                  }
              }
          }
          catch (e)
          {
              console.error("[AdminOrdersPage] 주문 목록 로드 실패:", e);
          }
      };

      useEffect(() =>
      {
          func_FetchOrders();
      }, []);

      const func_OnStatusChange = async (id: string, newStatus: string) =>
      {
          try
          {
              const res = await fetch(`/api/admin/orders/${id}/status`,
              {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: newStatus })
              });

              if (res.ok === true)
              {
                  alert("배송 상태가 업데이트되었습니다.");
                  func_FetchOrders();
              }
          }
          catch (e)
          {
              console.error("[AdminOrdersPage] 상태 변경 실패:", e);
          }
      };

      const func_GetStatusBadgeClass = (status: string) =>
      {
          if (status === 'PENDING_PAYMENT')
          {
              return styles.badgePending;
          }
          if (status === 'PAID')
          {
              return styles.badgePaid;
          }
          if (status === 'SHIPPED')
          {
              return styles.badgeShipped;
          }
          return styles.badgeDelivered;
      };

      const filteredOrders = orders.filter((order) =>
      {
          if (filter === 'ALL')
          {
              return true;
          }
          return order.status === filter;
      });

      return (
          <div className={styles.container}>
              <h1 className={styles.title}>주문 관리</h1>
              
              <div className={styles.filterContainer}>
                  <button 
                      className={filter === 'ALL' ? styles.filterButtonActive : styles.filterButton} 
                      onClick={() => setFilter('ALL')}
                  >
                      전체 ({orders.length})
                  </button>
                  <button 
                      className={filter === 'PENDING_PAYMENT' ? styles.filterButtonActive : styles.filterButton} 
                      onClick={() => setFilter('PENDING_PAYMENT')}
                  >
                      결제 대기 ({orders.filter(o => o.status === 'PENDING_PAYMENT').length})
                  </button>
                  <button 
                      className={filter === 'PAID' ? styles.filterButtonActive : styles.filterButton} 
                      onClick={() => setFilter('PAID')}
                  >
                      결제 완료 ({orders.filter(o => o.status === 'PAID').length})
                  </button>
                  <button 
                      className={filter === 'SHIPPED' ? styles.filterButtonActive : styles.filterButton} 
                      onClick={() => setFilter('SHIPPED')}
                  >
                      배송 중 ({orders.filter(o => o.status === 'SHIPPED').length})
                  </button>
                  <button 
                      className={filter === 'DELIVERED' ? styles.filterButtonActive : styles.filterButton} 
                      onClick={() => setFilter('DELIVERED')}
                  >
                      배송 완료 ({orders.filter(o => o.status === 'DELIVERED').length})
                  </button>
              </div>

              <table className={styles.table}>
                  <thead>
                      <tr>
                          <th>주문 ID</th>
                          <th>주문 일시</th>
                          <th>총 금액</th>
                          <th>현재 상태</th>
                          <th>상태 변경</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredOrders.map((order) =>
                      {
                          return (
                              <tr key={order.id}>
                                  <td style={{ fontSize: '13px', fontFamily: 'monospace' }}>{order.id}</td>
                                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                                  <td style={{ fontWeight: '600' }}>{order.totalPrice.toLocaleString()}원</td>
                                  <td>
                                      <span className={`${styles.badge} ${func_GetStatusBadgeClass(order.status)}`}>
                                          {STATUS_MAP[order.status]}
                                      </span>
                                  </td>
                                  <td>
                                      <select 
                                          className={styles.select}
                                          value={order.status}
                                          onChange={(e) =>
                                          {
                                              return func_OnStatusChange(order.id, e.target.value);
                                          }}
                                      >
                                          <option value="PENDING_PAYMENT">결제 대기</option>
                                          <option value="PAID">결제 완료</option>
                                          <option value="SHIPPED">배송 중</option>
                                          <option value="DELIVERED">배송 완료</option>
                                      </select>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
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
  Run: `git add . && git commit -m "feat: 관리자 주문 조회 및 배송 상태 변경 기능 구현"`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful commit with the Korean message.
