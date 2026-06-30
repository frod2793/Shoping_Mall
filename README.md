This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Cloudflare Pages 로컬 DB 연동 가이드 (Cloudflare Tunnel 사용)

Cloudflare Pages 배포 환경에서 로컬 데이터베이스를 참조할 수 있도록, Cloudflare TCP 터널을 활용해 연동하는 방법은 다음과 같습니다.

### 1. Cloudflare Tunnel 설치
로컬 머신에 Cloudflare CLI 도구인 `cloudflared`를 설치해야 합니다.

### 2. 로컬 DB TCP 터널 개방
로컬 PostgreSQL 데이터베이스(기본 포트 `5432`)를 외부 터널로 노출하기 위해 아래 명령어를 실행합니다:
```bash
cloudflared tunnel --url tcp://localhost:5432
```
실행 시 Cloudflare 터널링 서비스가 활성화되며, 아래와 같은 TCP 엔드포인트 주소가 콘솔에 출력됩니다:
```
tcp://<random-subdomain>.tcp.cloudflare-tunnel.com:<random-port>
```
이 주소(예: `tcp.cloudflare-tunnel.com:<port>`)를 메모해 둡니다.

### 3. Cloudflare Pages 대시보드 환경 변수 설정
1. Cloudflare Pages 대시보드에 로그인한 후, 해당 프로젝트의 **Settings > Environment variables** 메뉴로 이동합니다.
2. Production 및 Preview 환경 변수에 `DATABASE_URL`을 아래 형식으로 등록합니다:
   ```
   postgresql://<db_user>:<db_password>@<random-subdomain>.tcp.cloudflare-tunnel.com:<random-port>/<db_name>?sslmode=disable
   ```
   * *예시:* `postgresql://postgres:mysecretpassword@tunnel.tcp.cloudflare-tunnel.com:21345/vitamin_mall?sslmode=disable`

### 4. 주의 사항
- `wrangler.toml`에 `DATABASE_URL` 환경 변수가 하드코딩되어 있으면 대시보드 설정이 무시될 수 있습니다. 따라서 `wrangler.toml` 내 `DATABASE_URL` 정의는 제거해야 하며, 대시보드를 통해 환경 변수를 주입받도록 구성해야 합니다.
- 터널을 재시작하면 주소와 포트 번호가 변경될 수 있습니다. 고정된 주소가 필요한 경우 Cloudflare Zero Trust 대시보드에서 정식 Tunnel을 등록하고 네임스페이스를 바인딩하여 사용하십시오.

