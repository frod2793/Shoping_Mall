/**
 * [기능]: 메인 상품 목록 화면 컴포넌트
 * [작성자]: 윤승종
 */
import Link from 'next/link';
import { PrismaProductRepository } from '@/infrastructure/database/PrismaProductRepository';
import { ProductService } from '@/core/services/ProductService';

export const revalidate = 0; // DB의 실시간 데이터를 노출하기 위해 캐시 비활성화

export default async function HomePage()
{
    const productRepo = new PrismaProductRepository();
    const productService = new ProductService(productRepo);
    const products = await productService.getAllProducts();

    return (
        <div className="container">
            <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: 'bold' }}>추천 상품</h1>
            <div className="productGrid">
                {products.map((product) =>
                {
                    return (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="productCard"
                        >
                            <div style={
                                {
                                    width: '100%',
                                    height: '220px',
                                    backgroundColor: 'var(--border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-muted)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }
                            }>
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <span>이미지 준비중</span>
                                )}
                            </div>
                            <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{product.name}</h3>
                                <p style={
                                    {
                                        margin: '0 0 16px 0',
                                        fontSize: '13px',
                                        color: 'var(--text-muted)',
                                        flexGrow: 1,
                                        lineHeight: '1.4'
                                    }
                                }>
                                    {product.description}
                                </p>
                                <div style={
                                    {
                                        fontWeight: '700',
                                        fontSize: '16px',
                                        color: 'var(--accent)',
                                        marginTop: 'auto'
                                    }
                                }>
                                    {product.price.toLocaleString()}원
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
