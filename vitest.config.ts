/**
 * [기능]: Vitest 테스트 실행을 위한 환경 설정 정의
 * [작성자]: 윤승종
 */
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(
{
    plugins: [react()],
    test:
    {
        environment: 'jsdom',
        globals: true,
    },
    resolve:
    {
        alias:
        {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
