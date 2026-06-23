# 이미지 업로드 및 로컬 SQLite 연동 기능 명세서 (Specification)

본 문서는 최근 업데이트된 로컬 SQLite 데이터베이스 연동 복구 내용과 상품 관리자 화면 내 이미지 파일 업로드 기능의 구현 스펙에 대해 상세히 기술합니다.

---

## 1. 데이터베이스 아키텍처 변경 (SQLite 복구)

로컬 개발 환경의 신속한 테스트 및 경량성 확보를 위해 기존 PostgreSQL 연결에서 파일 기반의 **SQLite** 데이터베이스로 연동을 전환(복구)하였습니다.

* **설정 파일 변경**:
  * **[Prisma Schema](file:///D:/fork/Shoping_Mall/prisma/schema.prisma)**: 
    * `provider`가 `"postgresql"`에서 `"sqlite"`로 변경되었습니다.
    * 데이터베이스 파일 경로는 `env("DATABASE_URL")`을 가리킵니다.
  * **[.env](file:///D:/fork/Shoping_Mall/.env)**:
    * `DATABASE_URL`이 `"file:./dev.db"`로 지정되었습니다.
    * 로컬 루트 경로에 `dev.db` 파일이 생성되어 모든 상품 및 주문 관련 스키마 데이터가 저장됩니다.

---

## 2. 이미지 파일 업로드 API 스펙

관리자 페이지에서 상품 이미지(대표 이미지, 본문 삽입 이미지, 상세 이미지)를 직접 업로드할 수 있는 서버사이드 API 엔드포인트를 구축하였습니다.

### 2.1. API 개요
* **경로(Route)**: `/api/admin/upload` (물리 파일: [route.ts](file:///D:/fork/Shoping_Mall/src/app/api/admin/upload/route.ts))
* **HTTP 메서드**: `POST`
* **Content-Type**: `multipart/form-data`

### 2.2. 요청 및 응답 포맷
* **Request Body**:
  * `file`: 바이너리 이미지 파일 (필수)
* **Response Body (성공 - 200 OK)**:
  ```json
  {
    "url": "/uploads/1782200632457-841933748-qUZE.png"
  }
  ```
* **Response Body (에러 - 400 Bad Request)**:
  ```json
  {
    "error": "업로드할 파일이 누락되었습니다."
  }
  ```
* **Response Body (에러 - 500 Internal Server Error)**:
  ```json
  {
    "error": "서버 내부 디스크 에러로 인해 파일 업로드에 실패했습니다."
  }
  ```

### 2.3. 파일 저장 메커니즘
1. 클라이언트가 전송한 `multipart/form-data` 바디에서 `file` 필드를 추출합니다.
2. 바이너리 `ArrayBuffer` 데이터를 Node.js `Buffer` 객체로 변환합니다.
3. 프로젝트 루트 하위의 `public/uploads` 디렉토리에 물리적으로 저장합니다. (디렉토리가 없는 경우 재귀적으로 자동 생성)
4. 파일 이름 충돌을 방지하기 위해 고유 파일명 식별 규칙을 적용합니다:
   * 파일명 규칙: `${Date.now()}-${Math.round(Math.random() * 1e9)}-${original_filename}`
5. 클라이언트가 웹 브라우저를 통해 직접 이미지 파일에 정적 경로로 접근할 수 있는 상대 경로 URL(`/uploads/파일명`)을 반환합니다.

### 2.4. 테스트 자동화 구축 ([route.test.ts](file:///D:/fork/Shoping_Mall/src/app/api/admin/upload/route.test.ts))
* `fs/promises` 모듈의 `writeFile` 및 `mkdir` 함수를 모킹(Mocking)하여 실제 디스크 쓰기 연동 없이 API 유효성을 독립적으로 검증합니다.
* **테스트 시나리오**:
  1. `이미지 업로드 API 테스트 - 파일 포함 시 성공`: 폼 데이터에 정상 파일을 실어 요청 시 `200 OK` 응답 및 `/uploads/` 포맷의 이미지 URL 반환을 확인합니다.
  2. `이미지 업로드 API 테스트 - 파일 미포함 시 400 에러 리턴`: 파일 객체 누락 시 `400 Bad Request` 에러 코드 및 적절한 에러 메시지 반환 여부를 검증합니다.
* **⚠️ 로컬 테스트 실행 시의 Node.js 버전 제약 사항**:
  * 최근 업데이트된 `rolldown` 번들러 패키지는 Node.js의 native `styleText` API를 호출합니다. 이 과정에서 Node.js `v20.19.0` 미만 또는 `v22.12.0` 미만 환경에서는 `ERR_INVALID_ARG_VALUE` 관련 런타임 타입 에러가 발생하여 `vitest` 구동이 실패할 수 있습니다.
  * 해결을 위해서는 로컬 Node.js 버전을 **`v20.19.0` 이상** 또는 **`v22.12.0` 이상**으로 업그레이드할 것을 권장합니다.

---

## 3. 관리자 상품 등록/수정 화면 이미지 업로드 UI 스펙 ([page.tsx](file:///D:/fork/Shoping_Mall/src/app/admin/products/page.tsx))

기존의 텍스트 타이핑식 이미지 주소 입력 방식을 전면 배제하고, 직관적인 파일 드롭 및 업로드 인터페이스를 통합했습니다.

### 3.1. 대표 이미지 업로드 (Main Image)
* **UI**: "📁 대표 이미지 선택" 버튼을 노출합니다.
* **동작**: 파일이 선택되면 `func_HandleMainImageUpload` 함수가 가동되어 서버에 업로드하고, 반환된 경로로 `imageUrl` 상태를 업데이트합니다.
* **미리보기**: 업로드가 완료되면 작은 크기의 썸네일 이미지 및 "삭제" 버튼이 나타납니다. 삭제 시 `imageUrl` 상태는 초기화됩니다.

### 3.2. 본문 중간 이미지 삽입 (Inline Image in Description)
* **UI**: 상세 설명 텍스트 입력창 하단에 "📷 본문 중간에 이미지 추가" 버튼을 노출합니다.
* **동작**: 파일을 업로드하면 `func_HandleImageUpload` 함수가 동작합니다. 업로드 성공 시 반환된 이미지 URL을 토대로 다음 형식의 HTML 마크업 태그를 생성합니다:
  ```html
  <img src="/uploads/파일명" style="width:100%; max-width:600px; margin-top:20px; border-radius:8px; display:block;" alt="상세 정보 이미지" />
  ```
* **삽입 로직**: 사용자의 현재 텍스트 캐럿(커서) 입력 포커스 위치(`textarea.selectionStart` 및 `endPos`)를 자동으로 검출하여 본문 중간에 해당 HTML 이미지 코드를 즉시 삽입(Insert)합니다.

### 3.3. 상세 컷 이미지 업로드 (Detail Image)
* **UI**: "📁 상세 컷 이미지 선택" 버튼을 제공합니다.
* **동작**: `func_HandleDetailImageUpload` 함수를 통해 업로드된 결과를 미리보기 썸네일과 삭제 기능으로 관리합니다.
* **최종 데이터 결합 (Submit)**: 상품 등록/수정 폼 제출 시(`func_OnSubmit`), 본문 상세 설명(`description`)과 하단 노출용 상세 이미지(`detailImageUrl`)를 구조화된 템플릿으로 통합 결합하여 데이터베이스에 저장합니다:
  ```html
  <div class="product-detail">
      {개행 문자를 <br />로 변환한 상세 설명 텍스트}
      {상세 컷 이미지가 등록된 경우 추가되는 <img> 태그}
  </div>
  ```
