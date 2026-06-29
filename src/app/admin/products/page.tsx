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
    const [apiHost, setApiHost] = useState('');

    useEffect(() => {
        const savedHost = localStorage.getItem('admin_api_host') || '';
        setApiHost(savedHost);
    }, []);

    const getFullUrl = (path: string) => {
        const host = apiHost ? apiHost.replace(/\/$/, '') : '';
        return `${host}${path}`;
    };

    // Form States
    const [name, setName] = useState('');
    const [category, setCategory] = useState('아크릴 키링');
    const [description, setDescription] = useState('');
    const [detailImageUrl, setDetailImageUrl] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [options, setOptions] = useState<OptionInput[]>([]);

    /// <summary>
    /// [기능]: HTML 상세 설명 문자열에서 순수 텍스트 설명과 상세 이미지 URL을 분리 추출합니다.
    /// [작성자]: 윤승종
    /// [수정 날짜]: 2026-06-22
    /// [마지막 수정 작성자]: 윤승종
    /// [수정 내용]: 최초 구현
    /// </summary>
    const func_ExtractTextAndImage = (html: string) =>
    {
        if (html == null || html === '')
        {
            return { text: '', detailImageUrl: '' };
        }

        // 래퍼 태그 제거
        let clean = html.replace(/<div class="product-detail">/gi, '');
        clean = clean.replace(/<\/div>\s*$/i, '');

        // br 태그와 p 태그를 개행으로 변환
        clean = clean.replace(/<p>/gi, '');
        clean = clean.replace(/<\/p>/gi, '\n');
        clean = clean.replace(/<br\s*\/?>/gi, '\n');

        // &nbsp; 변환
        clean = clean.replace(/&nbsp;/g, ' ');

        return {
            text: clean.trim(),
            detailImageUrl: '',
        };
    };

    const func_FetchProducts = async () =>
    {
        try
        {
            const res = await fetch(getFullUrl('/api/products'));
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
        setCategory('아크릴 키링');
        setDescription('');
        setDetailImageUrl('');
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
        setCategory(product.category || '아크릴 키링');
        
        // HTML 상세설명에서 일반 텍스트 및 상세 이미지 URL을 파싱하여 세팅
        const parsed = func_ExtractTextAndImage(product.description || '');
        setDescription(parsed.text);
        setDetailImageUrl(parsed.detailImageUrl);
        
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

    const func_HandleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = e.target.files?.[0];
        if (file == null)
        {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try
        {
            const res = await fetch(getFullUrl('/api/admin/upload'), 
            {
                method: 'POST',
                body: formData
            });

            if (res.ok === true)
            {
                const data = await res.json();
                if (data != null && data.url != null)
                {
                    const textarea = document.getElementById('product-description') as HTMLTextAreaElement;
                    if (textarea != null)
                    {
                        const startPos = textarea.selectionStart;
                        const endPos = textarea.selectionEnd;
                        const text = textarea.value;
                        
                        const imgTag = `\n<img src="${data.url}" style="width:100%; max-width:600px; margin-top:20px; border-radius:8px; display:block;" alt="상세 정보 이미지" />\n`;
                        const newText = text.substring(0, startPos) + imgTag + text.substring(endPos);
                        
                        setDescription(newText);
                        
                        // 파일 인풋 비우기
                        e.target.value = '';
                    }
                }
            }
            else
            {
                alert("이미지 업로드에 실패했습니다.");
            }
        }
        catch (err)
        {
            console.error("[AdminProductsPage] 이미지 업로드 에러:", err);
            alert("업로드 중 오류가 발생했습니다.");
        }
    };

    const func_HandleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = e.target.files?.[0];
        if (file == null)
        {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try
        {
            const res = await fetch(getFullUrl('/api/admin/upload'), 
            {
                method: 'POST',
                body: formData
            });

            if (res.ok === true)
            {
                const data = await res.json();
                if (data != null && data.url != null)
                {
                    setImageUrl(data.url);
                    e.target.value = '';
                }
            }
            else
            {
                alert("대표 이미지 업로드에 실패했습니다.");
            }
        }
        catch (err)
        {
            console.error("[AdminProductsPage] 대표 이미지 업로드 에러:", err);
            alert("업로드 중 오류가 발생했습니다.");
        }
    };

    const func_HandleDetailImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = e.target.files?.[0];
        if (file == null)
        {
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try
        {
            const res = await fetch(getFullUrl('/api/admin/upload'), 
            {
                method: 'POST',
                body: formData
            });

            if (res.ok === true)
            {
                const data = await res.json();
                if (data != null && data.url != null)
                {
                    setDetailImageUrl(data.url);
                    e.target.value = '';
                }
            }
            else
            {
                alert("상세 컷 이미지 업로드에 실패했습니다.");
            }
        }
        catch (err)
        {
            console.error("[AdminProductsPage] 상세 컷 이미지 업로드 에러:", err);
            alert("업로드 중 오류가 발생했습니다.");
        }
    };

    const func_OnSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        // 일반 텍스트 설명과 상세 이미지 URL을 결합하여 HTML 마크업 생성
        const packedDescription = `
<div class="product-detail">
    ${description.replace(/\n/g, '<br />')}
    ${detailImageUrl !== '' ? `<img src="${detailImageUrl}" style="width:100%; max-width:600px; margin-top:20px; border-radius:8px; display:block;" alt="상세 정보 이미지" />` : ''}
</div>
        `.trim();

        const payload = {
            name,
            description: packedDescription,
            category,
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
                const res = await fetch(getFullUrl(`/api/admin/products/${editingProduct.id}`),
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
            const res = await fetch(getFullUrl(`/api/admin/products/${id}`), { method: 'DELETE' });
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
                        <th>카테고리</th>
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
                                <td style={{ color: 'var(--primary)', fontWeight: '600' }}>{product.category}</td>
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
                                <label>카테고리</label>
                                <select 
                                    className={styles.input} 
                                    value={category} 
                                    onChange={(e) =>
                                    {
                                        return setCategory(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="아크릴 키링">🌸 아크릴 키링</option>
                                    <option value="비즈 스트랩">✨ 비즈 스트랩</option>
                                    <option value="실버 액세서리">💍 실버 액세서리</option>
                                    <option value="감성 스마트톡">🎀 감성 스마트톡</option>
                                    <option value="오브제 팬시">🧸 오브제 팬시</option>
                                </select>
                            </div>
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
                                <label>대표 이미지</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                      <input 
                                          type="file" 
                                          id="main-image-upload" 
                                          accept="image/*" 
                                          style={{ display: 'none' }} 
                                          onChange={func_HandleMainImageUpload} 
                                      />
                                      <label 
                                          htmlFor="main-image-upload" 
                                          className={styles.actionButton}
                                          style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', display: 'inline-block' }}
                                      >
                                          📁 대표 이미지 선택
                                      </label>
                                      {imageUrl !== '' ? (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                              <img 
                                                  src={imageUrl} 
                                                  alt="대표 이미지 미리보기" 
                                                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} 
                                              />
                                              <button 
                                                  type="button" 
                                                  style={{ padding: '4px 8px', fontSize: '11px', color: '#e53e3e', background: 'transparent', border: '1px solid #e53e3e', borderRadius: '4px', cursor: 'pointer' }}
                                                  onClick={() =>
                                                  {
                                                      return setImageUrl('');
                                                  }}
                                              >
                                                  삭제
                                              </button>
                                          </div>
                                      ) : (
                                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>등록된 이미지가 없습니다.</span>
                                      )}
                                  </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>상세 설명 문구</label>
                                  <textarea 
                                      id="product-description"
                                      className={styles.textarea} 
                                      value={description} 
                                      onChange={(e) =>
                                      {
                                          return setDescription(e.target.value);
                                      }} 
                                      rows={6} 
                                      placeholder="상품에 대한 설명글을 작성해 주세요. (자동 줄바꿈 지원)"
                                      required 
                                  />
                                  <div style={{ marginTop: '8px' }}>
                                      <input 
                                          type="file" 
                                          id="desc-image-upload" 
                                          accept="image/*" 
                                          style={{ display: 'none' }} 
                                          onChange={func_HandleImageUpload} 
                                      />
                                      <label 
                                          htmlFor="desc-image-upload" 
                                          className={styles.actionButton}
                                          style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer', display: 'inline-block' }}
                                      >
                                          📷 본문 중간에 이미지 추가
                                      </label>
                                  </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>상세 컷 이미지 (하단 노출용)</label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                      <input 
                                          type="file" 
                                          id="detail-image-upload" 
                                          accept="image/*" 
                                          style={{ display: 'none' }} 
                                          onChange={func_HandleDetailImageUpload} 
                                      />
                                      <label 
                                          htmlFor="detail-image-upload" 
                                          className={styles.actionButton}
                                          style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', display: 'inline-block' }}
                                      >
                                          📁 상세 컷 이미지 선택
                                      </label>
                                      {detailImageUrl !== '' ? (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                              <img 
                                                  src={detailImageUrl} 
                                                  alt="상세 컷 미리보기" 
                                                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} 
                                              />
                                              <button 
                                                  type="button" 
                                                  style={{ padding: '4px 8px', fontSize: '11px', color: '#e53e3e', background: 'transparent', border: '1px solid #e53e3e', borderRadius: '4px', cursor: 'pointer' }}
                                                  onClick={() =>
                                                  {
                                                      return setDetailImageUrl('');
                                                  }}
                                              >
                                                  삭제
                                              </button>
                                          </div>
                                      ) : (
                                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>등록된 이미지가 없습니다.</span>
                                      )}
                                  </div>
                                  <small style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '6px', display: 'block', lineHeight: '1.4' }}>
                                      * 스크롤을 내렸을 때 제품 소개 페이지 하단에 크게 노출되는 상세 설명용 이미지를 업로드합니다.
                                  </small>
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
