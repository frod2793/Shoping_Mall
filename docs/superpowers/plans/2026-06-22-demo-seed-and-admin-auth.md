# Demo Seeding and Admin Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up clothing seed data to replace it with accessories/keyrings, implement `AdminService` for validating credentials and encoding/decoding role-based session tokens, set up login/logout API endpoints managing HttpOnly cookies, restrict `/admin/*` and `/api/admin/*` access via Next.js Middleware, verify with unit tests/build verification, and commit.

**Architecture:** Use a Base64 encoded session token structure (`{ email, role, expires }`) to serve as the user session. This avoids Node-only crypto issues inside the Next.js Edge Middleware environment. `AdminService` handles validation against database records using Prisma.

**Tech Stack:** Next.js (App Router, Middleware), TypeScript, Prisma Client, Vitest

---

### Task 1: Update Seeding Script with Accessories and Keyrings

**Files:**
- Modify: `/prisma/seed.ts`

- [ ] **Step 1: Replace apparel seed data with keyrings and necklaces**
  Modify: `/prisma/seed.ts` to include the requested accessory products and option values.
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

- [ ] **Step 2: Run seed command**
  Run: `npx prisma db seed`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Database seed successfully populated with the new demo products.

---

### Task 2: Create AdminService

**Files:**
- Create: `/src/core/services/AdminService.ts`

- [ ] **Step 1: Write AdminService logic**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/core/services/AdminService.ts` with Allman style, explicit null checking, and base64 token generation.
  Code:
  ```typescript
  /**
   * [기능]: 관리자 인증 처리 비즈니스 로직 서비스 클래스
   * [작성자]: 윤승종
   */
  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();

  export interface AdminSession
  {
      email: string;
      role: string;
      expires: number;
  }

  export class AdminService
  {
      public async login(email: string, password: string): Promise<string | null>
      {
          if (!email || !password)
          {
              throw new Error("[AdminService] 이메일과 비밀번호는 필수 입력 항목입니다.");
          }

          const user = await prisma.user.findUnique(
          {
              where: { email }
          });

          if (user == null)
          {
              return null;
          }

          if (user.password !== password)
          {
              return null;
          }

          if (user.role !== 'ADMIN')
          {
              return null;
          }

          // Generate simple token: JSON string encoded as Base64 (expires in 2 hours)
          const session: AdminSession = {
              email: user.email || '',
              role: user.role,
              expires: Date.now() + 1000 * 60 * 60 * 2
          };

          const token = Buffer.from(JSON.stringify(session)).toString('base64');
          return token;
      }

      public verifyToken(token: string): AdminSession | null
      {
          if (!token)
          {
              return null;
          }

          try
          {
              const decodedStr = Buffer.from(token, 'base64').toString('utf-8');
              const session = JSON.parse(decodedStr) as AdminSession;

              if (session.expires < Date.now())
              {
                  return null; // Expired
              }

              if (session.role !== 'ADMIN')
              {
                  return null;
              }

              return session;
          }
          catch (error)
          {
              console.error("[AdminService] 토큰 검증 중 에러 발생:", error);
              return null;
          }
      }
  }
  ```

---

### Task 3: Write Unit Tests for AdminService

**Files:**
- Create: `/src/core/services/__tests__/AdminService.test.ts`

- [ ] **Step 1: Write AdminService unit test**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/core/services/__tests__/AdminService.test.ts` with Allman style.
  Code:
  ```typescript
  /**
   * [기능]: AdminService 인증 서비스 단위 테스트
   * [작성자]: 윤승종
   */
  import { describe, it, expect, beforeAll, afterAll } from 'vitest';
  import { AdminService } from '../AdminService';
  import { PrismaClient } from '@prisma/client';

  const prisma = new PrismaClient();
  const adminService = new AdminService();

  describe('AdminService', () =>
  {
      beforeAll(async () =>
      {
          // Ensure test admin exists in SQLite dev database
          await prisma.user.deleteMany({ where: { email: "test_admin@shop.com" } });
          await prisma.user.create(
          {
              data:
              {
                  email: "test_admin@shop.com",
                  name: "테스트관리자",
                  password: "password_123",
                  role: "ADMIN"
              }
          });
      });

      afterAll(async () =>
      {
          await prisma.user.deleteMany({ where: { email: "test_admin@shop.com" } });
          await prisma.$disconnect();
      });

      it('login should succeed and return token for valid ADMIN credentials', async () =>
      {
          const token = await adminService.login("test_admin@shop.com", "password_123");
          expect(token).not.toBeNull();
          
          if (token != null)
          {
              const session = adminService.verifyToken(token);
              expect(session).not.toBeNull();
              expect(session?.role).toBe("ADMIN");
              expect(session?.email).toBe("test_admin@shop.com");
          }
      });

      it('login should return null for invalid credentials', async () =>
      {
          const token = await adminService.login("test_admin@shop.com", "wrong_password");
          expect(token).toBeNull();
      });

      it('verifyToken should return null for expired or invalid token format', () =>
      {
          const badToken = "invalid-token-string";
          const session = adminService.verifyToken(badToken);
          expect(session).toBeNull();
      });
  });
  ```

---

### Task 4: Create Login and Logout API Routes

**Files:**
- Create: `/src/app/api/admin/login/route.ts`
- Create: `/src/app/api/admin/logout/route.ts`

- [ ] **Step 1: Write admin login endpoint**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/api/admin/login/route.ts` managing HttpOnly cookies.
  Code:
  ```typescript
  /**
   * [기능]: 관리자 로그인 처리 API 라우터
   * [작성자]: 윤승종
   */
  import { NextRequest, NextResponse } from 'next/server';
  import { AdminService } from '@/core/services/AdminService';

  const adminService = new AdminService();

  export async function POST(request: NextRequest)
  {
      try
      {
          const { email, password } = await request.json();
          const token = await adminService.login(email, password);

          if (token == null)
          {
              return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않거나 권한이 없습니다." }, { status: 401 });
          }

          const response = NextResponse.json({ message: "로그인 성공" });
          // Set HttpOnly cookie
          response.cookies.set('admin_token', token,
          {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              path: '/',
              maxAge: 60 * 60 * 2 // 2 hours
          });

          return response;
      }
      catch (error: any)
      {
          console.error("[POST /api/admin/login] 에러 발생:", error);
          return NextResponse.json({ error: "로그인 중 서버 에러가 발생했습니다." }, { status: 500 });
      }
  }
  ```

- [ ] **Step 2: Write admin logout endpoint**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/app/api/admin/logout/route.ts` to expire cookies.
  Code:
  ```typescript
  /**
   * [기능]: 관리자 로그아웃 처리 API 라우터
   * [작성자]: 윤승종
   */
  import { NextResponse } from 'next/server';

  export async function POST()
  {
      const response = NextResponse.json({ message: "로그아웃 성공" });
      // Clear cookie by setting maxAge: 0
      response.cookies.set('admin_token', '',
      {
          httpOnly: true,
          path: '/',
          maxAge: 0
      });

      return response;
  }
  ```

---

### Task 5: Configure Admin Access Control Middleware

**Files:**
- Create: `/src/middleware.ts`

- [ ] **Step 1: Write middleware.ts**
  Create: `/Users/woodenshield/Desktop/다용도/Shopingmall/src/middleware.ts` restricting access to `/admin` and `/api/admin` endpoints.
  Code:
  ```typescript
  /**
   * [기능]: 관리자 경로 접근 제어 미들웨어
   * [작성자]: 윤승종
   */
  import { NextRequest, NextResponse } from 'next/server';

  export function middleware(request: NextRequest)
  {
      const path = request.nextUrl.pathname;

      // Exclude login and logout API endpoints to avoid circular locks
      if (path === '/api/admin/login' || path === '/api/admin/logout')
      {
          return NextResponse.next();
      }

      // Check for path matching /admin or /api/admin
      if (path.startsWith('/admin') || path.startsWith('/api/admin'))
      {
          const cookie = request.cookies.get('admin_token');
          const token = cookie?.value;

          if (token == null)
          {
              if (path.startsWith('/api/'))
              {
                  return NextResponse.json({ error: "접근 권한이 없습니다." }, { status: 403 });
              }
              // Redirect webpage request to home (or a login page if existed)
              return NextResponse.redirect(new URL('/', request.url));
          }

          try
          {
              // Edge-safe Base64 parsing (equivalent to AdminService.verifyToken)
              const decodedStr = atob(token);
              const session = JSON.parse(decodedStr);

              if (session.expires == null || session.expires < Date.now() || session.role !== 'ADMIN')
              {
                  if (path.startsWith('/api/'))
                  {
                      return NextResponse.json({ error: "접근 권한이 없거나 세션이 만료되었습니다." }, { status: 403 });
                  }
                  return NextResponse.redirect(new URL('/', request.url));
              }
          }
          catch (e)
          {
              if (path.startsWith('/api/'))
              {
                  return NextResponse.json({ error: "잘못된 접근 토큰입니다." }, { status: 403 });
              }
              return NextResponse.redirect(new URL('/', request.url));
          }
      }

      return NextResponse.next();
  }

  // Configure Matcher
  export const config = {
      matcher: ['/admin/:path*', '/api/admin/:path*'],
  };
  ```

---

### Task 6: Run Tests and Build

**Files:**
- None

- [ ] **Step 1: Run unit tests**
  Run: `npx vitest run`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: All tests pass.

- [ ] **Step 2: Run Next.js production build**
  Run: `npm run build`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful compilation of page endpoints and middleware config.

---

### Task 7: Commit Code Changes

**Files:**
- Tracked git changes

- [ ] **Step 1: Commit files to git repository**
  Run: `git add . && git commit -m "feat: 데모 상품 악세사리/키링류 전면 수정 및 관리자 인증 미들웨어 구축"`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful commit with the Korean message.
