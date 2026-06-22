/**
 * [기능]: 관리자 상품 관리 화면 컴포넌트
 * [작성자]: 윤승종
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductOption } from '@/core/domains/Product';
import styles from './admin-products.module.css';

interface OptionInput
{
    name: string;
    value: string;
    additionalPrice: string;
    stock: string;
}

export default function AdminProductsPage()
{
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form States
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [options, setOptions] = useState<OptionInput[]>([]);

    const func_FetchProducts = async () =>
    {
        try
        {
            const res = await fetch('/api/products');
            if (res.ok === true)
            {
                const data = await res.json();
                if (data != null)
                {
                    setProducts(data);
                }
            }
        }
        catch (e)
        {
            console.error("[AdminProductsPage] 상품 목록 로딩 실패:", e);
        }
    };

    useEffect(() =>
    {
        func_FetchProducts();
    }, []);

    const func_OpenCreateModal = () =>
    {
        setEditingProduct(null);
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setImageUrl('');
        setOptions([]);
        setIsModalOpen(true);
    };

    const func_OpenEditModal = (product: Product) =>
    {
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setImageUrl(product.imageUrl || '');

        if (product.options != null)
        {
            const mapped = product.options.map((o) =>
            {
                return {
                    name: o.name,
                    value: o.value,
                    additionalPrice: o.additionalPrice.toString(),
                    stock: o.stock.toString()
                };
            });
            setOptions(mapped);
        }
        else
        {
            setOptions([]);
        }
        setIsModalOpen(true);
    };

    const func_CloseModal = () =>
    {
        setIsModalOpen(false);
    };

    const func_AddOptionRow = () =>
    {
        setOptions([...options, { name: '', value: '', additionalPrice: '0', stock: '0' }]);
    };

    const func_RemoveOptionRow = (index: number) =>
    {
        const filtered = options.filter((_, idx) =>
        {
            return idx !== index;
        });
        setOptions(filtered);
    };

    const func_HandleOptionChange = (index: number, field: keyof OptionInput, val: string) =>
    {
        const updated = [...options];
        updated[index][field] = val;
        setOptions(updated);
    };

    const func_OnSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        const payload = {
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            imageUrl,
            options: options.map((o) =>
            {
                return {
                    name: o.name,
                    value: o.value,
                    additionalPrice: Number(o.additionalPrice),
                    stock: Number(o.stock)
                };
            })
        };

        try
        {
            if (editingProduct != null)
            {
                // Update (PUT)
                const res = await fetch(`/api/admin/products/${editingProduct.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok === true)
                {
                    alert("상품이 수정되었습니다.");
                    func_CloseModal();
                    func_FetchProducts();
                }
            }
            else
            {
                // Create (POST)
                const res = await fetch('/api/admin/products',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok === true)
                {
                    alert("상품이 등록되었습니다.");
                    func_CloseModal();
                    func_FetchProducts();
                }
            }
        }
        catch (error)
        {
            console.error("[AdminProductsPage] 저장 중 에러 발생:", error);
        }
    };

    const func_OnDeleteProduct = async (id: string) =>
    {
        if (confirm("정말 이 상품을 삭제하시겠습니까?") === false)
        {
            return;
        }

        try
        {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok === true)
            {
                alert("상품이 삭제되었습니다.");
                func_FetchProducts();
            }
        }
        catch (e)
        {
            console.error("[AdminProductsPage] 삭제 중 에러 발생:", e);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>상품 관리</h1>
                <button className={styles.actionButton} onClick={func_OpenCreateModal}>
                    + 상품 등록
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>재고</th>
                        <th>등록일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) =>
                    {
                        return (
                            <tr key={product.id}>
                                <td style={{ fontWeight: '600' }}>{product.name}</td>
                                <td>{product.price.toLocaleString()}원</td>
                                <td>{product.stock}개</td>
                                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className={styles.btnEdit} onClick={() =>
                                    {
                                        return func_OpenEditModal(product);
                                    }}>
                                        수정
                                    </button>
                                    <button className={styles.btnDelete} onClick={() =>
                                    {
                                        return func_OnDeleteProduct(product.id);
                                    }}>
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {isModalOpen === true && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2 style={{ marginBottom: '24px' }}>
                            {editingProduct != null ? "상품 수정" : "신규 상품 등록"}
                        </h2>
                        <form onSubmit={func_OnSubmit}>
                            <div className={styles.formGroup}>
                                <label>상품명</label>
                                  <input 
                                      type="text" 
                                      className={styles.input} 
                                      value={name} 
                                      onChange={(e) =>
                                      {
                                          return setName(e.target.value);
                                      }} 
                                      required 
                                  />
                            </div>
                            <div className={styles.formGroup}>
                                <label>설명</label>
                                  <textarea 
                                      className={styles.textarea} 
                                      value={description} 
                                      onChange={(e) =>
                                      {
                                          return setDescription(e.target.value);
                                      }} 
                                      rows={3} 
                                      required 
                                  />
                            </div>
                            <div className={styles.formGroup}>
                                <label>기본 가격 (원)</label>
                                  <input 
                                      type="number" 
                                      className={styles.input} 
                                      value={price} 
                                      onChange={(e) =>
                                      {
                                          return setPrice(e.target.value);
                                      }} 
                                      required 
                                  />
                            </div>
                            <div className={styles.formGroup}>
                                <label>기본 재고 (개)</label>
                                  <input 
                                      type="number" 
                                      className={styles.input} 
                                      value={stock} 
                                      onChange={(e) =>
                                      {
                                          return setStock(e.target.value);
                                      }} 
                                      required 
                                  />
                            </div>
                            <div className={styles.formGroup}>
                                <label>이미지 URL</label>
                                  <input 
                                      type="text" 
                                      className={styles.input} 
                                      value={imageUrl} 
                                      onChange={(e) =>
                                      {
                                          return setImageUrl(e.target.value);
                                      }} 
                                  />
                            </div>

                            <div className={styles.formGroup}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label style={{ fontWeight: 'bold' }}>상품 옵션</label>
                                    <button type="button" className={styles.actionButton} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={func_AddOptionRow}>
                                        + 옵션 추가
                                    </button>
                                </div>
                                  
                                {options.map((opt, idx) =>
                                {
                                    return (
                                        <div key={idx} className={styles.optionRow}>
                                            <input 
                                                type="text" 
                                                placeholder="옵션명" 
                                                className={styles.input} 
                                                value={opt.name} 
                                                onChange={(e) =>
                                                {
                                                    return func_HandleOptionChange(idx, 'name', e.target.value);
                                                }} 
                                                required 
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="옵션값" 
                                                className={styles.input} 
                                                value={opt.value} 
                                                onChange={(e) =>
                                                {
                                                    return func_HandleOptionChange(idx, 'value', e.target.value);
                                                }} 
                                                required 
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="추가가격" 
                                                className={styles.input} 
                                                value={opt.additionalPrice} 
                                                onChange={(e) =>
                                                {
                                                    return func_HandleOptionChange(idx, 'additionalPrice', e.target.value);
                                                }} 
                                                required 
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="재고" 
                                                className={styles.input} 
                                                value={opt.stock} 
                                                onChange={(e) =>
                                                {
                                                    return func_HandleOptionChange(idx, 'stock', e.target.value);
                                                }} 
                                                required 
                                            />
                                            <button type="button" className={styles.btnRowAction} onClick={() =>
                                            {
                                                return func_RemoveOptionRow(idx);
                                            }}>
                                                삭제
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button type="submit" className={styles.actionButton} style={{ flexGrow: 1 }}>
                                    저장
                                </button>
                                <button type="button" className={styles.btnRowAction} style={{ flexGrow: 1 }} onClick={func_CloseModal}>
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
