# Admin Dashboard API and UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Admin Dashboard API Route for calculating sales metrics from the database, build a common sidebar layout for administrative pages, and develop a modern Vanilla CSS dashboard UI presenting statistical summaries.

**Architecture:** Extend the Prisma schema with an `Order` model to permit real SQL aggregation of sales figures. The dashboard API compiles overall stats. The frontend uses Next.js Server Components to fetch these metrics and style them with modular CSS.

**Tech Stack:** Next.js (App Router, CSS Modules), TypeScript, Prisma Client, SQLite

---

### Task 1: Update Schema and Run Migration for Orders

**Files:**
- Modify: `/prisma/schema.prisma`
- Modify: `/prisma/seed.ts`

- [ ] **Step 1: Add Order model to schema.prisma**
  Modify: `/prisma/schema.prisma` to append the `Order` model definition.
  Code:
  ```prisma
  model Order {
    id         String   @id @default(uuid())
    userId     String?
    status     String   @default("PAID") // PENDING_PAYMENT, PAID, SHIPPED, DELIVERED
    totalPrice Int
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
  }
  ```

- [ ] **Step 2: Generate and apply migration**
  Run: `npx prisma migrate dev --name add_order`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Schema validated, migration `add_order` applied, database altered, and Prisma client regenerated.

- [ ] **Step 3: Update seed script with dummy orders**
  Modify: `/prisma/seed.ts` to clear and seed Order data.
  Add code block in `main()` function:
  ```typescript
      // 기존 주문 제거
      await prisma.order.deleteMany({});

      // 더미 주문 생성
      await prisma.order.createMany(
      {
          data: [
              { totalPrice: 49000, status: "PAID" },
              { totalPrice: 24500, status: "SHIPPED" },
              { totalPrice: 59000, status: "DELIVERED" },
              { totalPrice: 8900, status: "PENDING_PAYMENT" },
              { totalPrice: 27000, status: "PAID" }
          ]
      });
  ```

- [ ] **Step 4: Seed the database again**
  Run: `npx prisma db seed`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Seed executed successfully populating users, products, options, and orders.

---

### Task 2: Create Admin Dashboard Statistics API Route

**Files:**
- Create: `/src/app/api/admin/dashboard/route.ts`

- [ ] **Step 1: Write API Route to calculate metrics**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/api/admin/dashboard/route.ts` with Allman style, explicit null checking, and Korean logs.
  Code:
  ```typescript
  /**
   * [기능]: 관리자 대시보드 통계 데이터 제공 API 라우터
   * [작성자]: 윤승종
   */
  import { NextResponse } from 'next/server';
  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

  export async function GET()
  {
      try
      {
          // 집계: PENDING_PAYMENT가 아닌 결제된 주문들의 totalPrice 합산
          const paidOrders = await prisma.order.findMany(
          {
              where:
              {
                  NOT:
                  {
                      status: "PENDING_PAYMENT"
                  }
              }
          });

          let totalSales = 0;
          for (let i = 0; i < paidOrders.length; i++)
          {
              totalSales += paidOrders[i].totalPrice;
          }

          // 신규 주문 건수 (상태가 PAID인 주문)
          const newOrdersCount = await prisma.order.count(
          {
              where:
              {
                  status: "PAID"
              }
          });

          // 미배송 주문 건수 (상태가 PAID 또는 SHIPPED인 주문)
          const undeliveredCount = await prisma.order.count(
          {
              where:
              {
                  status:
                  {
                      in: ["PAID", "SHIPPED"]
                  }
              }
          });

          return NextResponse.json(
          {
              totalSales,
              newOrdersCount,
              undeliveredCount
          });
      }
      catch (error: any)
      {
          console.error("[GET /api/admin/dashboard] 에러 발생:", error);
          return NextResponse.json({ error: "통계 데이터 조회 실패" }, { status: 500 });
      }
  }
  ```

---

### Task 3: Implement Dashboard Layout Sidebar Frame

**Files:**
- Create: `/src/app/admin/layout.tsx`

- [ ] **Step 1: Write admin layout template**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/admin/layout.tsx` with sidebar structure and Allman style.
  Code:
  ```tsx
  /**
   * [기능]: 관리자 페이지 공통 레이아웃 (사이드바 및 내용 영역)
   * [작성자]: 윤승종
   */
  'use client';

  import React from 'react';
  import { useRouter } from 'next/navigation';

  export default function AdminLayout(
      {
          children,
      }: Readonly<{
          children: React.ReactNode;
      }>
  )
  {
      const router = useRouter();

      const func_OnLogoutClick = async () =>
      {
          try
          {
              const res = await fetch('/api/admin/logout', { method: 'POST' });
              if (res.ok)
              {
                  alert("로그아웃 되었습니다.");
                  router.push('/');
                  router.refresh();
              }
          }
          catch (e)
          {
              console.error("[AdminLayout] 로그아웃 중 에러 발생:", e);
          }
      };

      return (
          <div style={{ display: 'flex', minHeight: '100vh', marginTop: '-32px' }}>
              {/* 사이드바 */}
              <aside style={
                  {
                      width: '240px',
                      backgroundColor: 'var(--card)',
                      borderRight: '1px solid var(--border)',
                      padding: '24px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                  }
              }>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px', paddingLeft: '8px' }}>
                      관리자 메뉴
                  </div>
                  <a href="/admin" style={{ display: 'block', padding: '12px 16px', borderRadius: '6px', textDecoration: 'none', color: 'var(--foreground)', fontWeight: '600' }}>
                      대시보드
                  </a>
                  <a href="/admin/products" style={{ display: 'block', padding: '12px 16px', borderRadius: '6px', textDecoration: 'none', color: 'var(--foreground)', opacity: 0.7 }}>
                      상품 관리
                  </a>
                  <a href="/admin/orders" style={{ display: 'block', padding: '12px 16px', borderRadius: '6px', textDecoration: 'none', color: 'var(--foreground)', opacity: 0.7 }}>
                      주문 관리
                  </a>
                  <button 
                      onClick={func_OnLogoutClick}
                      style={
                          {
                              marginTop: 'auto',
                              width: '100%',
                              padding: '12px',
                              backgroundColor: 'transparent',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              color: 'var(--foreground)',
                              cursor: 'pointer',
                              fontWeight: '600'
                          }
                      }
                  >
                      로그아웃
                  </button>
              </aside>

              {/* 본문 영역 */}
              <section style={{ flexGrow: 1, padding: '32px 40px', backgroundColor: 'var(--background)' }}>
                  {children}
              </section>
          </div>
      );
  }
  ```

---

### Task 4: Develop Dashboard UI and CSS Styles

**Files:**
- Create: `/src/app/admin/dashboard.module.css`
- Create: `/src/app/admin/page.tsx`

- [ ] **Step 1: Write dashboard.module.css**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/admin/dashboard.module.css` using Allman style braces.
  Code:
  ```css
  .grid
  {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 24px;
  }

  @media (max-width: 768px)
  {
      .grid
      {
          grid-template-columns: 1fr;
          gap: 16px;
      }
  }

  .card
  {
      background-color: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .cardLabel
  {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 500;
  }

  .cardValue
  {
      font-size: 32px;
      font-weight: 800;
      color: var(--foreground);
  }

  .sectionTitle
  {
      font-size: 20px;
      font-weight: 700;
      margin-top: 40px;
      margin-bottom: 16px;
  }

  .infoBox
  {
      background-color: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
  }
  ```

- [ ] **Step 2: Write admin/page.tsx**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/admin/page.tsx` fetching metrics from the dashboard route.
  Code:
  ```tsx
  /**
   * [기능]: 관리자 대시보드 화면 컴포넌트
   * [작성자]: 윤승종
   */
  import styles from './dashboard.module.css';

  interface DashboardData
  {
      totalSales: number;
      newOrdersCount: number;
      undeliveredCount: number;
  }

  async function fetchDashboardData(): Promise<DashboardData>
  {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/admin/dashboard`, { cache: 'no-store' });
      if (!res.ok)
      {
          throw new Error("[DashboardPage] 통계 데이터를 가져오는데 실패했습니다.");
      }
      return res.json();
  }

  export default async function AdminDashboardPage()
  {
      let data: DashboardData = { totalSales: 0, newOrdersCount: 0, undeliveredCount: 0 };
      
      try
      {
          data = await fetchDashboardData();
      }
      catch (e)
      {
          console.error("[DashboardPage] 데이터 바인딩 중 에러 발생:", e);
      }

      return (
          <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>대시보드</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>쇼핑몰 현황 통계 요약</p>

              <div className={styles.grid}>
                  <div className={styles.card}>
                      <span className={styles.cardLabel}>총 매출액</span>
                      <span className={styles.cardValue} style={{ color: 'var(--accent)' }}>
                          {data.totalSales.toLocaleString()}원
                      </span>
                  </div>
                  <div className={styles.card}>
                      <span className={styles.cardLabel}>신규 주문 건수</span>
                      <span className={styles.cardValue}>{data.newOrdersCount}건</span>
                  </div>
                  <div className={styles.card}>
                      <span className={styles.cardLabel}>미배송 주문 건수</span>
                      <span className={styles.cardValue}>{data.undeliveredCount}건</span>
                  </div>
              </div>

              <h2 className={styles.sectionTitle}>관리자 시스템 정보</h2>
              <div className={styles.infoBox}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div><strong>역할:</strong> 쇼핑몰 수석 관리자 (ADMIN)</div>
                      <div><strong>DB 종류:</strong> SQLite 파일 데이터베이스</div>
                      <div><strong>시스템 환경:</strong> Next.js App Router (Production Mode ready)</div>
                  </div>
              </div>
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
  Expected: Successful compilation including admin components.

---

### Task 6: Commit Changes

**Files:**
- Tracked git changes

- [ ] **Step 1: Commit files to git repository**
  Run: `git add . && git commit -m "feat: 관리자 대시보드 통계 API 및 화면 개발"`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful commit with the Korean message.
