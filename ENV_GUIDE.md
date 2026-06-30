# Vitamin Mall - 환경 변수 & 인프라 배포 설정 가이드 (ENV_GUIDE)

본 가이드는 **개발용 기기(로컬 노트북)**와 **배포/관리용 실서버 노트북** 각각에 맞추어 환경 변수 및 대용량 사진 데이터 보관 공간을 올바르게 구축하기 위한 지침서입니다.

---

## 1. 핵심 환경 변수 설정 (`.env`)

프로젝트 루트 디렉터리에 `.env` 파일을 생성하고 다음 설정을 기입하십시오.

### 1) 로컬 이미지 저장 공간 (`LOCAL_STORAGE_PATH`)
*   **역할**: 업로드된 고화질 이미지(500GB+ 상당)를 프로젝트 소스 외부의 노트북 드라이브에 안전하게 격리 보관하기 위한 물리적 절대/상대 경로입니다.
*   **개발용 노트북 설정 예시 (상대 경로)**:
    ```env
    LOCAL_STORAGE_PATH="./test_storage"
    ```
*   **배포/관리용 서버 노트북 설정 예시 (대용량 외장 드라이브 또는 D드라이브)**:
    *   **Windows**: `LOCAL_STORAGE_PATH="D:\\vitamin_images_storage"`
    *   **macOS / Linux**: `LOCAL_STORAGE_PATH="/Users/공용계정/vitamin_images_storage"`

### 2) 데이터베이스 주소 (`DATABASE_URL`)
*   **역할**: Neon Serverless PostgreSQL 클라우드 데이터베이스에 연결하기 위한 주소입니다. (카드를 등록하지 않아도 영구 0.5GB 사용 가능)
*   **설정 예시**:
    ```env
    DATABASE_URL="postgres://[USER]:[PASSWORD]@[HOST]/vitamin_mall?sslmode=require"
    ```

### 3) 호스트 매핑 설정 (`CLIENT_HOST`, `ADMIN_HOST`)
*   **역할**: Next.js Middleware에서 사용자와 관리자 도메인을 구분하여 비인가 접근을 실시간 차단하기 위한 설정입니다.
*   **설정 예시**:
    ```env
    CLIENT_HOST="localhost:3000, vitamin-mall.pages.dev"
    ADMIN_HOST="admin.localhost:3000, admin-vitamin-mall.pages.dev"
    NEXT_PUBLIC_CLIENT_HOST="localhost:3000, vitamin-mall.pages.dev"
    NEXT_PUBLIC_ADMIN_HOST="admin.localhost:3000, admin-vitamin-mall.pages.dev"
    ```

---

## 2. Cloudflare Tunnel 및 CDN 프록시 캐싱 설정

노트북에서 직접 이미지를 다운로드받을 시 인터넷 회선 대역폭 포화로 서버가 죽는 현상을 방어하기 위해 다음 조치를 결합합니다.

### 1) Cloudflare Tunnel 연동
배포/관리용 노트북에서 다음 명령을 실행하여 로컬 포트 `3000`을 안전한 HTTPS 주소로 외부 포워딩합니다:
```bash
cloudflared tunnel --url http://localhost:3000
```
발급되는 터널 임시 주소(예: `https://xxxx.trycloudflare.com`)를 어드민 로그인 시 API Host 경로로 지정합니다.

### 2) 글로벌 CDN 캐싱 원리
*   본 프로젝트의 이미지 호출 경로(`/api/products/image/[id]`)는 브라우저 및 CDN 에지 서버가 이미지를 영구적으로 가지고 있게끔 강력한 헤더를 전송합니다:
    `Cache-Control: public, max-age=31536000, immutable`
*   사용자 화면에 상세 페이지가 열리면 **최초 딱 1회만** 터널을 통해 배포 노트북의 하드디스크에서 이미지를 읽어가며, 그 다음 모든 접속자들은 **Cloudflare의 글로벌 에지 캐시망에서 즉시 0원(무상)으로 복사본을 다운로드**하게 됩니다. 이로 인해 배포용 노트북의 부하와 전송 네트워크 비용은 완벽하게 **0원**으로 수렴하게 됩니다.
