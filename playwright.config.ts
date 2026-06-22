/**
 * [기능]: Playwright E2E 기능 테스트 자동화 설정 파일
 * [작성자]: 윤승종
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig(
    {
        testDir: './e2e',
        fullyParallel: false,
        forbidOnly: !!process.env.CI,
        retries: process.env.CI ? 2 : 0,
        workers: 1, // 동시성으로 인한 SQLite 파일 락 방지를 위해 1개로 제한
        reporter: 'line',
        use: {
            baseURL: 'http://localhost:3000',
            trace: 'on-first-retry',
            screenshot: 'only-on-failure',
        },
        projects: [
            {
                name: 'chromium',
                use: { ...devices['Desktop Chrome'] },
            },
        ],
        webServer: {
            command: 'npm run dev',
            url: 'http://localhost:3000',
            reuseExistingServer: !process.env.CI,
            timeout: 120 * 1000,
        },
    }
);
