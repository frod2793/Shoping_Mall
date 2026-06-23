# 프로젝트 작업 현황 및 로드맵

본 문서는 PostgreSQL 마이그레이션 작업 결과, 무비용/무가입 자체 터널링(UPnP) 구축 과정, 그리고 Vercel 배포를 위해 앞으로 진행해야 할 작업을 기록한 문서입니다.

---

## 1. 지금까지 진행된 작업 이력 (History)

### 🗄️ PostgreSQL 데이터베이스 로컬 마이그레이션 완료
* **로컬 서비스 설정**: PostgreSQL 17 서비스를 C 드라이브가 아닌 **D 드라이브(`D:\Program Files\PostgreSQL\17\data`)**에 데이터 디렉터리를 구축하여 연동 완료했습니다.
* **인증 방식 개선**: 로컬 개발 편의를 위해 `pg_hba.conf` 파일의 로컬 접속(IPv4/IPv6) 인증 방식을 `scram-sha-256`에서 `trust`로 변경했습니다. 이로 인해 비밀번호 없이 편리하게 접속 가능합니다.
* **데이터베이스 및 테이블 생성**: `vitamin_mall` 데이터베이스를 생성하고, Prisma Schema(`schema.prisma`)를 기반으로 마이그레이션 및 빌드를 성공시켜 `User`, `Product`, `ProductOption`, `Order`, `OrderItem` 테이블 생성을 완료했습니다.

### 💻 애플리케이션 빌드 검증 완료
* **빌드 성공**: 로컬 Node.js(`D:\fork\node\node-v20.12.2-win-x64`) 환경 하에서 `npm run build`를 성공적으로 통과하였습니다. (Prisma Client 자동 생성 및 Next.js Static Page 빌드가 정상 완료됨을 확인했습니다.)

### 🌐 외부 접속 터널링 도구 설치 및 설정 시도
* **ngrok**: `winget`을 통해 최신 버전(3.39.8)으로 업데이트 완료하고 토큰 등록까지 마쳤으나, ngrok 정책상 무료 계정의 TCP 터널 개방(포트 5432)에 신용카드 인증이 필수로 요구되어 사용을 중단했습니다.
* **playit.gg**: D 드라이브(`D:\fork\Shoping_Mall\.agents\playit`)로 실행 파일 및 환경 설정 파일 경로를 격리하여 구동을 시도했습니다. 하지만 playit.gg 역시 최신 정책상 TCP 포트 포워딩 시 결제(유료 플랜)를 요구하도록 변경되어 사용을 중단했습니다.

### 🔌 UPnP 기반 100% 자체 터널링 구축 완료 (신규)
* **공유기 포트 포워딩 자동 제어**: 외부 서비스의 가입/비용 결제/시간 제한 등 4가지 제약 조건을 완벽히 회피하기 위해, 윈도우 OS API(HNetCfg.NATUPnP)를 이용하여 로컬 공유기의 UPnP 설정을 직접 조작했습니다.
  * **할당된 공인 IP**: `222.108.208.204`
  * **포트 포워딩 규칙**: 외부 `222.108.208.204:5432` ➡️ 로컬 `172.30.1.69:5432` (PostgreSQL 기본 포트)
* **PostgreSQL 외부 접속 허용 설정**: `D:\Program Files\PostgreSQL\17\data\pg_hba.conf` 파일에 외부 접근(`0.0.0.0/0` 및 `::/0`)을 `trust` 인증 방식으로 허용하는 구성을 추가했습니다.
* **무중단 설정 반영**: 데이터베이스 내부 슈퍼유저 권한을 활용하여 `SELECT pg_reload_conf();` 쿼리를 실행해 PostgreSQL 서비스를 재부팅하지 않고 즉시 적용했습니다.

---

## 2. 현재 시스템 상태 (Current Status)

| 구분 | 상태 | 세부 내용 |
| :--- | :--- | :--- |
| **로컬 DB** | 🟢 정상 작동 | `postgresql-x64-17` 서비스 실행 중, 비밀번호 없음 (`trust`) |
| **빌드 & 컴파일** | 🟢 정상 완료 | `npm run build` 에러 없이 빌드 성공 확인 |
| **도메인 격리** | 🟢 설정 완료 | 일반몰(`localhost:3000`), 관리자몰(`admin.localhost:3000`) 분리 |
| **외부 터널링** | 🟢 개통 완료 | UPnP 규칙을 통해 외부 공인 IP `222.108.208.204:5432`가 로컬 PC 포트 `5432`로 연결됨 |
| **로컬 방화벽** | 🟡 대기 중 | 윈도우 디펜더 방화벽에서 포트 `5432` 인바운드 허용 규칙 등록 필요 |

---

## 3. 앞으로 진행해야 할 작업 (To-Do List)

Vercel 배포를 완수하고 외부에서 로컬 DB를 연결하기 위해 다음 단계들을 순차적으로 진행해야 합니다.

### [ ] 1단계: 윈도우 방화벽 인바운드 규칙 등록 (사용자 직접 실행 필요)
외부의 Vercel 서버에서 사용자 로컬 PC의 포트 5432로 들어오는 네트워크 패킷을 방화벽이 차단하지 않도록 허용 규칙을 추가해야 합니다.
1. Windows 검색창에 **PowerShell**을 검색한 뒤 마우스 우클릭하여 **[관리자 권한으로 실행]**을 선택합니다.
2. 아래 명령어를 실행하여 5432 TCP 포트를 오픈합니다.
   ```powershell
   New-NetFirewallRule -Name "PostgreSQL-External" -DisplayName "PostgreSQL-External" -Direction Inbound -Protocol TCP -LocalPort 5432 -Action Allow
   ```

### [ ] 2단계: Vercel 환경 변수 등록 및 구성
Vercel 프로젝트 대시보드의 Environment Variables 세팅 메뉴에 아래의 변수들을 정확히 입력합니다:
* **`DATABASE_URL`**: `postgresql://postgres@222.108.208.204:5432/vitamin_mall`
* **`CLIENT_HOST`**: (Vercel 기본 배포 도메인 또는 개인 도메인)
* **`ADMIN_HOST`**: `admin.`을 붙인 서브도메인 주소
* **`NEXT_PUBLIC_CLIENT_HOST`**: (일반몰 도메인)
* **`NEXT_PUBLIC_ADMIN_HOST`**: (관리자몰 도메인)

### [ ] 3단계: 배포 테스트 및 도메인 매핑 검증
1. Vercel 배포를 진행하여 빌드가 정상적으로 완료되고, 발급받은 도메인으로 접속 가능한지 확인합니다.
2. 일반 사용자 몰과 관리자 몰이 각기 서브도메인(예: `admin.your-domain.vercel.app`) 분리 상태에서 사용자 PC의 로컬 PostgreSQL DB와 완벽히 실시간 통신을 수행하는지 최종 점검합니다.
