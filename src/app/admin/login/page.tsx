/**
 * [기능]: 관리자 로그인 화면 UI 컴포넌트
 * [작성자]: 윤승종
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function AdminLoginPage()
{
    const router = useRouter();
    const [email, setEmail] = useState('admin@shop.com');
    const [password, setPassword] = useState('hashed_admin_password_123');

    const func_OnSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        try
        {
            const res = await fetch('https://wise-wasp-66.loca.lt/api/admin/login',
            {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Bypass-Tunnel-Reminder': 'true'
                },
                body: JSON.stringify({ email, password })
            });

            if (res.ok === true)
            {
                alert("관리자 인증에 성공하였습니다.");
                router.push('/admin');
                router.refresh();
            }
            else
            {
                const data = await res.json();
                alert(data.error || "로그인 실패");
            }
        }
        catch (err)
        {
            console.error("[AdminLoginPage] 로그인 중 에러 발생:", err);
            alert("서버 연결에 실패하였습니다.");
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>관리자 로그인</h1>
                <p className={styles.subtitle}>쇼핑몰 시스템 관리를 위한 인증</p>

                <form onSubmit={func_OnSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>이메일</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) =>
                            {
                                return setEmail(e.target.value);
                            }}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>비밀번호</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) =>
                            {
                                return setPassword(e.target.value);
                            }}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.button}>
                        로그인
                    </button>
                </form>

                <div className={styles.hintBox}>
                    <strong>💡 데모 로그인 힌트:</strong>
                    <div style={{ marginTop: '4px' }}>이메일: admin@shop.com</div>
                    <div>비밀번호: hashed_admin_password_123</div>
                </div>
            </div>
        </div>
    );
}
