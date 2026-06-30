# Vitamin Mall - 서버 노트북 배포 & 인프라 셋업 가이드 (DEPLOY_GUIDE)

본 가이드는 서버용 노트북(배포/관리용)에 소스코드를 클론하고, Neon PostgreSQL 데이터베이스 및 Cloudflare Tunnel을 결합하여 무제한 500GB+ 이미지 서빙 인프라를 처음부터 끝까지 무상(0원)으로 셋업하는 매뉴얼입니다.

---

## 1. 사전 준비 사항 (Prerequisites)

배포 대상 서버 노트북에 아래 프로그램들이 설치되어 있어야 합니다.

1.  **Node.js**: LTS 버전(v18 또는 v20 이상)을 설치합니다.
2.  **Git**: 소스코드를 깃허브에서 가져오기 위해 설치합니다.
3.  **Cloudflared (Cloudflare Tunnel CLI)**:
    *   **Windows**: [Cloudflare 공식 설치 가이드](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)에서 설치 바이너리를 받아 시스템 Path에 등록합니다.
    *   **macOS**: 터미널에서 `brew install cloudflared` 명령으로 설치합니다.

---

## 2. 프로젝트 내려받기 및 패키지 설치

서버 노트북의 터미널(혹은 CMD/PowerShell)을 열고 프로젝트를 복제한 후 의존성을 다운로드합니다.

```bash
# 1. 깃허브 저장소 클론
git clone https://github.com/frod2793/Shoping_Mall.git
cd Shoping_Mall

# 2. 패키지 의존성 설치
npm install
```

---

## 3. 데이터베이스 셋업 (Neon PostgreSQL)

1.  [Neon Database 공식 홈페이지](https://neon.tech/)에 접속하여 무료 회원가입을 완료합니다 (신용카드 등록 불필요).
2.  새 프로젝트 `vitamin_mall`을 생성합니다.
3.  대시보드에서 제공하는 **Connection String (PostgreSQL 주소)**을 복사합니다.
    *   형식: `postgresql://[USER]:[PASSWORD]@[HOST]/vitamin_mall?sslmode=require`
4.  프로젝트에 데이터베이스 스키마 구조를 동기화하고 적용합니다:
    ```bash
    npx prisma db push
    ```

---

## 4. 환경 변수 파일 작성 (`.env`)

프로젝트 루트 폴더에 `.env` 파일을 생성하고 아래 서식을 기입합니다.

```env
# 1. 500GB+ 고화질 이미지를 보관할 서버 노트북의 물리 디렉터리 경로
# (예: Windows D드라이브 하위 폴더)
LOCAL_STORAGE_PATH="D:\\vitamin_images_storage"

# 2. Neon PostgreSQL 데이터베이스 연결 주소
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/vitamin_mall?sslmode=require"

# 3. 도메인 보안 격리 가드 설정 (Pages 도메인 기입)
CLIENT_HOST="localhost:3000, vitamin-mall.pages.dev"
ADMIN_HOST="admin.localhost:3000, admin-vitamin-mall.pages.dev"
NEXT_PUBLIC_CLIENT_HOST="localhost:3000, vitamin-mall.pages.dev"
NEXT_PUBLIC_ADMIN_HOST="admin.localhost:3000, admin-vitamin-mall.pages.dev"
```

---

## 5. 서버 가동 및 Cloudflare 터널 기동

### 1) 로컬 Next.js 서버 구동
서버용 노트북에서 다음 명령을 실행하여 Next.js 서비스를 대기 모드로 켭니다.
```bash
# 로컬 개발 서버 기동
npm run dev

# (또는 상용 배포 실행)
# npm run build && npm start
```

### 2) Cloudflare 터널 연결 개방 (외부 연동용)
별도의 터미널 창을 열고, 로컬 서버가 기동 중인 `3000`번 포트를 외부와 중계 연결합니다:
```bash
cloudflared tunnel --url http://localhost:3000
```
*   **결과**: 터미널 로그에 `https://xxxx.trycloudflare.com` 주소가 자동으로 출력됩니다.
*   **주의**: 이 주소는 노트북을 재부팅하거나 터널 명령을 재시작할 때마다 새로이 갱신됩니다.

---

## 6. 테스트 및 실서비스 운영법

1.  사용자들은 **[https://vitamin-mall.pages.dev](https://vitamin-mall.pages.dev)**에 직접 접속하여 쇼핑몰 정적 콘텐츠 및 상품 리스트를 초고속(CDN 캐시)으로 구경합니다.
2.  관리자는 **[https://admin-vitamin-mall.pages.dev](https://admin-vitamin-mall.pages.dev)**에 접속하여 로그인합니다.
    *   **로그인 시 주의**: 로그인 폼 화면의 **API Host** 입력칸에 위 5번 단계에서 발급받은 실시간 터널링 임시 주소(`https://xxxx.trycloudflare.com`)를 그대로 덮어쓰고 로그인해 주셔야 합니다.
3.  어드민 대시보드에서 신규 상품 등록 및 대용량 상세 이미지 업로드를 수행하면, 파일이 서버 노트북의 `LOCAL_STORAGE_PATH` 경로에 즉시 실물 적재되며, 데이터베이스와 연쇄 연동 및 캐싱 스트리밍 준비가 완료됩니다.
