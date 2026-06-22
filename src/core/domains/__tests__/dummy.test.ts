/**
 * [기능]: Vitest 테스트 환경 작동 여부 검증용 더미 테스트
 * [작성자]: 윤승종
 */
import { describe, it, expect } from 'vitest';

describe('Dummy Test', () =>
{
    it('should pass', () =>
    {
        expect(1 + 1).toBe(2);
    });
});
