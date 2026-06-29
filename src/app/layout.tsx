import type { Metadata } from 'next';
import Header from './components/Header';
import './globals.css';

export const metadata: Metadata = 
{
    title: 'vitamin',
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
                <Header />
                <main style={{ padding: '32px 0' }}>
                    {children}
                </main>
            </body>
        </html>
    );
}
