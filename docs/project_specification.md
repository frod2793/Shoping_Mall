# 프로젝트 사양서 (Project Specification)

본 문서는 **Next.js**와 **PostgreSQL**을 기반으로 설계 및 구축된 **비타민 쇼핑몰 (Vitamin Mall)** 프로젝트의 종합 사양서입니다.

---

## 1. 프로젝트 개요
- **프로젝트명**: 비타민 쇼핑몰 (Vitamin Mall)
- **개발 목적**: 클라우드 비용을 최소화하면서도, 상품 관리, 다중 옵션 적용, 주문 및 배송지 정보 관리가 가능한 견고한 커머스 웹 애플리케이션 구축.
- **주요 특징**:
  - Next.js App Router 기반의 고성능 SSR(Server-Side Rendering) 및 Dynamic API Serving 구현.
  - Vercel 서버리스의 휘발성 파일 시스템(Ephemeral File System) 극복을 위해 외부 클라우드 스토리지가 아닌 PostgreSQL 데이터베이스에 이미지 바이너리를 직접 저장하는 독립형 미디어 서빙 아키텍처 탑재.

---

## 2. 시스템 아키텍처
본 프로젝트는 추가적인 인프라 비용(예: AWS S3, Vercel Blob 등)을 완전히 배제하고, 독자 배포를 위해 **Next.js Web Server**와 **PostgreSQL Database** 2계층 아키텍처로 최적화되었습니다.

```mermaid
graph TD
    Client[클라이언트 브라우저] <-->|HTTPS| Vercel[Next.js Web Server on Vercel]
    Vercel <-->|Prisma ORM| DB[(PostgreSQL Database)]
    
    subgraph Web Server Logic
        API_Upload[/api/admin/upload]
        API_Image[/api/products/image/:id]
        PrismaRepo[PrismaProductRepository]
    end

    Vercel -.-> API_Upload
    Vercel -.-> API_Image
    Vercel -.-> PrismaRepo
```

---

## 3. 기술 스택 (Technology Stack)

### 3.1 Core & Framework
- **Next.js (v14.2.3)**: React 기반의 풀스택 프레임워크 (App Router 채택)
- **React (v18.x)**: UI 컴포넌트 라이브러리
- **TypeScript (v5.x)**: 정적 타입 보장 및 안정성 확보

### 3.2 Database & ORM
- **PostgreSQL (v15+)**: 대용량 바이너리(`bytea`) 데이터 처리에 강하며 안정성이 우수한 관계형 데이터베이스
- **Prisma Client & Prisma ORM (v5.22.0)**: 스키마 마이그레이션 및 타입 안전 데이터베이스 쿼리 빌더

### 3.3 Infrastructure & DevOps
- **Vercel**: 웹 애플리케이션 호스팅 및 빌드 배포 플랫폼
- **Node.js (v20.12.2 / v20.19.0+)**: 로컬 개발 및 런타임 구동 엔진

---

## 4. 환경 변수 설정 (.env)
프로젝트 실행 및 빌드를 위해 루트 경로에 `.env` 파일을 설정해야 합니다.

```bash
# 클라이언트 및 관리자 호스트 설정
CLIENT_HOST="localhost:3000"
ADMIN_HOST="admin.localhost:3000"
NEXT_PUBLIC_CLIENT_HOST="localhost:3000"
NEXT_PUBLIC_ADMIN_HOST="admin.localhost:3000"

# 데이터베이스 연결 정보 (PostgreSQL)
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]?sslmode=disable"
```

---

## 5. 프로젝트 빌드 및 실행 방법

### 5.1 패키지 설치
```bash
npm install
```

### 5.2 데이터베이스 스키마 동기화 (Prisma)
로컬 또는 원격 PostgreSQL 데이터베이스에 테이블 스키마를 동기화하고 Prisma Client를 빌드합니다.
```bash
npx prisma db push
```

### 5.3 로컬 개발 서버 실행
```bash
npm run dev
```

### 5.4 프로덕션 빌드 및 실행
```bash
npm run build
npm start
```
