/**
 * [기능]: 공통 레이아웃 컴포넌트
 * [작성자]: 윤승종
 */
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Shopingmall',
    description: '반응형 쇼핑몰 프로젝트',
};

export default function RootLayout(
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
)
{
    return (
        <html lang="ko">
            <body>
                <header style={
                    {
                        backgroundColor: 'var(--card)',
                        borderBottom: '1px solid var(--border)',
                        padding: '16px 0',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                    }
                }>
                    <div className="container" style={
                        {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }
                    }>
                        <a href="/" style={
                            {
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: 'var(--foreground)',
                                textDecoration: 'none'
                            }
                        }>
                            SHOPPINGMALL
                        </a>
                    </div>
                </header>
                <main style={{ padding: '32px 0' }}>
                    {children}
                </main>
            </body>
        </html>
    );
}
