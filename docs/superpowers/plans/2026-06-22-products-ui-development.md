# Products UI Development Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean dependencies to resolve Next.js startup issues, modify default styling to Vanilla CSS theme, implement responsive main page showing products list, and add interactive product detail page with reactive options & dynamic pricing calculations.

**Architecture:** Use Next.js Server Components for data fetching to render lists/details quickly. Implement Client Component logic only where state interactivity is needed (e.g., product option selections and pricing calculations in the detail page).

**Tech Stack:** Next.js (App Router), TypeScript, Vanilla CSS Modules, Prisma Client

---

### Task 1: Clean and Restore Dependencies

**Files:**
- Modify: `node_modules/*`, `package-lock.json`

- [ ] **Step 1: Delete node_modules and lock file, and run clean install**
  Run: `rm -rf node_modules package-lock.json && npm install`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Clean npm dependency tree reconstructed.

- [ ] **Step 2: Verify setup compilation**
  Run: `npm run build`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful Next.js build verification before doing UI changes.

---

### Task 2: Style Global Design System and Main Layout

**Files:**
- Modify: `/src/app/globals.css`
- Modify: `/src/app/layout.tsx`

- [ ] **Step 1: Write globals.css**
  Modify: `/src/app/globals.css` with Allman style, responsive colors, and clean layout rules.
  Code:
  ```css
  :root {
      --background: hsl(220, 20%, 97%);
      --foreground: hsl(220, 20%, 10%);
      --card: hsl(0, 0%, 100%);
      --card-foreground: hsl(220, 20%, 10%);
      --primary: hsl(220, 80%, 50%);
      --primary-hover: hsl(220, 80%, 40%);
      --border: hsl(220, 20%, 90%);
      --text-muted: hsl(220, 10%, 45%);
      --accent: hsl(25, 95%, 50%);
  }

  body {
      background-color: var(--background);
      color: var(--foreground);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
  }

  .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
  }
  ```

- [ ] **Step 2: Update layout.tsx with Navigation Header**
  Modify: `/src/app/layout.tsx` with navigation header, Allman style braces, and standard header.
  Code:
  ```tsx
  /**
   * [기능]: 공통 레이아웃 컴포넌트
   * [작성자]: 윤승종
   */
  import type { Metadata } from 'next';
  import './globals.css';

  export const metadata: Metadata = {
      title: 'Shopingmall',
      description: '반응형 쇼핑몰 프로젝트',
  };

  export default function RootLayout(
      {
          children,
      }: Readonly<{
          children: React.ReactNode;
      }>
  )
  {
      return (
          <html lang="ko">
              <body>
                  <header style={
                      {
                          backgroundColor: 'var(--card)',
                          borderBottom: '1px solid var(--border)',
                          padding: '16px 0',
                          position: 'sticky',
                          top: 0,
                          zIndex: 100
                      }
                  }>
                      <div className="container" style={
                          {
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                          }
                      }>
                          <a href="/" style={
                              {
                                  fontSize: '24px',
                                  fontWeight: 'bold',
                                  color: 'var(--foreground)',
                                  textDecoration: 'none'
                              }
                          }>
                              SHOPPINGMALL
                          </a>
                      </div>
                  </header>
                  <main style={{ padding: '32px 0' }}>
                      {children}
                  </main>
              </body>
          </html>
      );
  }
  ```

---

### Task 3: Build Responsive Product List Main Page

**Files:**
- Modify: `/src/app/page.tsx`

- [ ] **Step 1: Write main page logic displaying responsive Grid UI**
  Modify: `/src/app/page.tsx` utilizing Prisma client directly or fetching products. I will import `PrismaProductRepository` and fetch.
  Code:
  ```tsx
  /**
   * [기능]: 메인 상품 목록 화면 컴포넌트
   * [작성자]: 윤승종
   */
  import Link from 'next/link';
  import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
  import { ProductService } from '@/core/services/ProductService';

  export const revalidate = 0; // Disable caching to always read fresh DB data

  export default async function HomePage()
  {
      const productRepo = new PrismaProductRepository();
      const productService = new ProductService(productRepo);
      const products = await productService.getAllProducts();

      return (
          <div className="container">
              <h1 style={{ marginBottom: '24px' }}>추천 상품</h1>
              <div style={
                  {
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '24px'
                  }
              }>
                  {products.map((product) =>
                  {
                      return (
                          <Link
                              key={product.id}
                              href={`/products/${product.id}`}
                              style={
                                  {
                                      textDecoration: 'none',
                                      color: 'inherit',
                                      backgroundColor: 'var(--card)',
                                      borderRadius: '8px',
                                      border: '1px solid var(--border)',
                                      overflow: 'hidden',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      transition: 'transform 0.2s'
                                  }
                              }
                          >
                              <div style={
                                  {
                                      width: '100%',
                                      height: '200px',
                                      backgroundColor: '#eaeaea',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'var(--text-muted)'
                                  }
                              }>
                                  {product.imageUrl ? (
                                      <img
                                          src={product.imageUrl}
                                          alt={product.name}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      />
                                  ) : (
                                      <span>이미지 없음</span>
                                  )}
                              </div>
                              <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{product.name}</h3>
                                  <p style={
                                      {
                                          margin: '0 0 16px 0',
                                          fontSize: '14px',
                                          color: 'var(--text-muted)',
                                          flexGrow: 1
                                      }
                                  }>
                                      {product.description}
                                  </p>
                                  <div style={
                                      {
                                          fontWeight: 'bold',
                                          fontSize: '16px',
                                          color: 'var(--accent)'
                                      }
                                  }>
                                      {product.price.toLocaleString()}원
                                  </div>
                              </div>
                          </Link>
                      );
                  })}
              </div>
          </div>
      );
  }
  ```

---

### Task 4: Build Product Detail Page and Styling

**Files:**
- Create: `/src/app/products/[id]/page.tsx`
- Create: `/src/app/products/[id]/product-detail.module.css`

- [ ] **Step 1: Write product-detail.module.css**
  Create: `/src/app/products/[id]/product-detail.module.css` containing visual styling rules for the details template, image display, option selects, floating action bar for mobile, and summary details.
  Code:
  ```css
  .wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 20px;
  }

  @media (max-width: 768px) {
      .wrapper {
          grid-template-columns: 1fr;
          gap: 20px;
          padding-bottom: 80px; /* Space for mobile floating action bar */
      }
  }

  .imageContainer {
      width: 100%;
      height: 400px;
      background-color: #eaeaea;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      alignItems: center;
      justifyContent: center;
  }

  .detailContainer {
      display: flex;
      flex-direction: column;
  }

  .name {
      font-size: 28px;
      margin: 0 0 8px 0;
  }

  .price {
      font-size: 24px;
      font-weight: bold;
      color: var(--accent);
      margin-bottom: 16px;
  }

  .description {
      font-size: 16px;
      line-height: 1.6;
      color: var(--text-muted);
      margin-bottom: 24px;
  }

  .optionSection {
      margin-bottom: 24px;
  }

  .optionTitle {
      font-weight: bold;
      margin-bottom: 8px;
  }

  .select {
      width: 100%;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background-color: var(--card);
      font-size: 16px;
      outline: none;
  }

  .totalPriceContainer {
      margin-top: auto;
      padding: 16px 0;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .totalPriceLabel {
      font-size: 18px;
      font-weight: bold;
  }

  .totalPrice {
      font-size: 28px;
      font-weight: bold;
      color: var(--accent);
  }

  .buyButton {
      width: 100%;
      padding: 16px;
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 16px;
      transition: background-color 0.2s;
  }

  .buyButton:hover {
      background-color: var(--primary-hover);
  }

  /* Mobile floating action bar */
  .floatingBar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: var(--card);
      border-top: 1px solid var(--border);
      padding: 12px 16px;
      z-index: 100;
  }

  @media (max-width: 768px) {
      .floatingBar {
          display: flex;
          gap: 12px;
          align-items: center;
      }
  }
  ```

- [ ] **Step 2: Create product detail page.tsx**
  Create: `/src/app/products/[id]/page.tsx` as a Next.js Server Component fetching the product, which then passes the product to an interactive Client Component or has client interaction built-in.
  Since we need dynamic option selector state and dynamic pricing calculations on the client side, we will implement this.
  We will write a single file `/src/app/products/[id]/page.tsx` containing the database fetching (Server Component) and imports a Client Component, or uses sub-components.
  Let's separate the client logic into a component or make the page a Client Component that fetches data via our existing API route (or since Next.js server components are easier for direct DB access, we can fetch on server and pass props to a client component).
  Wait, let's create a Client Component inside `/src/app/products/[id]/ProductDetailClient.tsx` and import it in `/src/app/products/[id]/page.tsx`.

  Let's detail `/src/app/products/[id]/ProductDetailClient.tsx`:
  Code:
  ```tsx
  /**
   * [기능]: 상품 상세 클라이언트 컴포넌트 (옵션 선택 및 총 가격 계산)
   * [작성자]: 윤승종
   */
  'use client';

  import { useState } from 'react';
  import { Product, ProductOption } from '@/core/domains/Product';
  import styles from './product-detail.module.css';

  interface Props
  {
      product: Product;
  }

  export default function ProductDetailClient({ product }: Props)
  {
      // Group options by option name (e.g. 색상, 사이즈)
      const groupedOptions: { [key: string]: ProductOption[] } = {};
      
      if (product.options != null)
      {
          for (const option of product.options)
          {
              if (groupedOptions[option.name] == null)
              {
                  groupedOptions[option.name] = [];
              }
              groupedOptions[option.name].push(option);
          }
      }

      // Track selected option id for each option group name
      const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

      const handleOptionChange = (groupName: string, optionId: string) =>
      {
          setSelectedOptions(
              {
                  ...selectedOptions,
                  [groupName]: optionId
              }
          );
      };

      // Calculate total price: base price + sum of additional prices of selected options
      let additionalPriceSum = 0;
      if (product.options != null)
      {
          for (const groupName in groupedOptions)
          {
              const selectedOptionId = selectedOptions[groupName];
              if (selectedOptionId != null)
              {
                  const opt = product.options.find(o => o.id === selectedOptionId);
                  if (opt != null)
                  {
                      additionalPriceSum += opt.additionalPrice;
                  }
              }
          }
      }
      const totalPrice = product.price + additionalPriceSum;

      const handleBuy = () =>
      {
          // Check if all option groups are selected
          const requiredGroups = Object.keys(groupedOptions);
          const selectedGroups = Object.keys(selectedOptions);
          if (selectedGroups.length < requiredGroups.length)
          {
              alert("모든 옵션을 선택해주십시오.");
              return;
          }
          alert(`구매 완료! 총 금액: ${totalPrice.toLocaleString()}원`);
      };

      return (
          <div className={styles.wrapper}>
              <div className={styles.imageContainer}>
                  {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                      <span>이미지 없음</span>
                  )}
              </div>
              <div className={styles.detailContainer}>
                  <h1 className={styles.name}>{product.name}</h1>
                  <div className={styles.price}>{product.price.toLocaleString()}원</div>
                  <p className={styles.description}>{product.description}</p>
                  
                  {Object.keys(groupedOptions).map((groupName) => (
                      <div key={groupName} className={styles.optionSection}>
                          <div className={styles.optionTitle}>{groupName} 선택</div>
                          <select 
                              className={styles.select}
                              value={selectedOptions[groupName] || ''}
                              onChange={(e) => handleOptionChange(groupName, e.target.value)}
                          >
                              <option value="">선택해주세요</option>
                              {groupedOptions[groupName].map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                      {opt.value} {opt.additionalPrice > 0 ? `(+${opt.additionalPrice.toLocaleString()}원)` : ''} (재고: {opt.stock}개)
                                  </option>
                              ))}
                          </select>
                      </div>
                  ))}

                  <div className={styles.totalPriceContainer}>
                      <span className={styles.totalPriceLabel}>총 상품 금액</span>
                      <span className={styles.totalPrice}>{totalPrice.toLocaleString()}원</span>
                  </div>

                  <button className={styles.buyButton} onClick={handleBuy}>바로 구매하기</button>
              </div>

              {/* Mobile floating bar */}
              <div className={styles.floatingBar}>
                  <div style={{ flexGrow: 1 }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>총 금액</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent)' }}>{totalPrice.toLocaleString()}원</div>
                  </div>
                  <button 
                      style={{ padding: '12px 24px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
                      onClick={handleBuy}
                  >
                      구매
                  </button>
              </div>
          </div>
      );
  }
  ```

- [ ] **Step 3: Create Server Component page.tsx**
  Create: `/src/app/products/[id]/page.tsx` loading the product from PrismaProductRepository and passing it to ProductDetailClient.
  Code:
  ```tsx
  /**
   * [기능]: 상품 상세 페이지 라우터 (서버 컴포넌트)
   * [작성자]: 윤승종
   */
  import { notFound } from 'next/navigation';
  import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
  import { ProductService } from '@/core/services/ProductService';
  import ProductDetailClient from './ProductDetailClient';

  export const revalidate = 0;

  export default async function ProductDetailPage(
      {
          params,
      }: {
          params: { id: string };
      }
  )
  {
      const productRepo = new PrismaProductRepository();
      const productService = new ProductService(productRepo);
      const product = await productService.getProductById(params.id);

      if (product == null)
      {
          return notFound();
      }

      return (
          <div className="container">
              <ProductDetailClient product={product} />
          </div>
      );
  }
  ```

---

### Task 5: Build Verification

**Files:**
- None

- [ ] **Step 1: Execute Next.js build compilation**
  Run: `npm run build`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful Next.js build.

---

### Task 6: Commit Changes

**Files:**
- Tracked git changes

- [ ] **Step 1: Commit files to git repository**
  Run: `git add . && git commit -m "feat: 반응형 상품 목록 및 상세 조회 UI 화면 개발"`
  Cwd: `/Users/woodenshield/Desktop/다용도/Shopingmall`
  Expected: Successful commit with the Korean message.
