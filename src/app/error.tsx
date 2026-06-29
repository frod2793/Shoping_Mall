/**
 * @description [기능]: Next.js App Router 공통 에러 바운더리 클라이언트 컴포넌트
 * @author 윤승종
 * @date 2026-06-29
 */
'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[GlobalError] 런타임 예외 감지:", error);
    }, [error]);

    return (
        <div style={
            {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                backgroundColor: 'var(--background)',
                padding: '24px',
                textAlign: 'center'
            }
        }>
            <div style={
                {
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '40px 32px',
                    boxShadow: '0 12px 30px rgba(224, 153, 153, 0.06)',
                    maxWidth: '440px',
                    width: '100%'
                }
            }>
                <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>
                    🌸
                </span>
                <h2 style={
                    {
                        fontSize: '20px',
                        fontWeight: '800',
                        color: 'var(--foreground)',
                        margin: '0 0 12px 0',
                        letterSpacing: '-0.5px'
                    }
                }>
                    페이지 로드 중 에러가 발생했습니다
                </h2>
                <p style={
                    {
                        fontSize: '13.5px',
                        color: 'var(--text-muted)',
                        margin: '0 0 28px 0',
                        lineHeight: '1.6'
                    }
                }>
                    일시적인 연결 지연이거나 시스템 오류일 수 있습니다. 아래 버튼을 눌러 다시 로드해 주세요.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => reset()}
                        style={
                            {
                                flexGrow: 1,
                                padding: '12px 20px',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '30px',
                                fontSize: '13.5px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(224, 153, 153, 0.3)',
                                transition: 'opacity 0.2s'
                            }
                        }
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                    >
                        다시 시도하기
                    </button>
                    <a
                        href="/"
                        style={
                            {
                                flexGrow: 1,
                                padding: '12px 20px',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                borderRadius: '30px',
                                fontSize: '13.5px',
                                fontWeight: '600',
                                display: 'inline-block',
                                border: '1px solid rgba(224, 153, 153, 0.15)'
                            }
                        }
                    >
                        메인으로 가기
                    </a>
                </div>
            </div>
        </div>
    );
}
