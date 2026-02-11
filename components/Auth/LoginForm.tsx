'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from '@/i18n/navigation';
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";

export default function LoginForm({ loginMessages, locale }: { loginMessages: any, locale: string }) {
    const t = (key: string) => loginMessages[key] || key;
    const router = useRouter();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await clientAPIFrame('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    identifier: formData.identifier.trim(),
                    password: formData.password.trim(),
                    loginIdentifierType: formData.identifier.includes('@') ? 'EMAIL' : 'PHONE'
                }),
            });

            if (res.ok) {
                router.push('/shop');
                router.refresh();
            } else {
                setError(t('auth_failed'));
            }
        } catch (err) {
            setError(t('network_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        /* 容器：奶油米色背景 (Light) -> 暖深褐色背景 (Dark) */
        <div className="w-full max-w-[420px] bg-[#FDFBF7] dark:bg-[#121110] border border-[#E5E0D8] dark:border-[#2A2826] rounded-[2.5rem] p-10 md:p-14 shadow-sm transition-colors duration-500">

            {/* 品牌页眉 */}
            <div className="text-center mb-12">
                <p className="text-[9px] uppercase tracking-[0.4em] text-[#A89F91] mb-3">The Maison</p>
                <h1 className="text-2xl font-serif text-[#4A443F] dark:text-[#E5E0D8] italic tracking-tight">
                    {t('signin')}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 账号输入 */}
                <div className="group space-y-1 relative">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-[#A89F91] ml-1 transition-colors group-focus-within:text-[#C5A059]">
                        Account
                    </label>
                    <input
                        type="text"
                        placeholder={t('email_phone_placeholder')}
                        className="w-full bg-transparent border-b border-[#E5E0D8] dark:border-[#2A2826] py-2 px-1 text-sm text-[#4A443F] dark:text-[#E5E0D8] outline-none transition-all focus:border-[#C5A059] placeholder:text-[#BCB5AC]/50"
                        onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                    />
                </div>

                {/* 密码输入 */}
                <div className="group space-y-1 relative">
                    <div className="flex justify-between items-end">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-[#A89F91] ml-1 transition-colors group-focus-within:text-[#C5A059]">
                            Security
                        </label>
                        <a href="#" className="text-[9px] uppercase tracking-widest text-[#BCB5AC] hover:text-[#C5A059]">Forgot?</a>
                    </div>
                    <input
                        type="password"
                        placeholder={t('password_placeholder')}
                        className="w-full bg-transparent border-b border-[#E5E0D8] dark:border-[#2A2826] py-2 px-1 text-sm text-[#4A443F] dark:text-[#E5E0D8] outline-none transition-all focus:border-[#C5A059] placeholder:text-[#BCB5AC]/50"
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                {error && <p className="text-[#C5A059] text-[10px] text-center italic tracking-wide">{error}</p>}

                {/* 登录按钮：在米色下是深色，在深色下是金色 */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#4A443F] dark:bg-[#C5A059] text-[#FDFBF7] dark:text-[#121110] text-[11px] uppercase tracking-[0.3em] font-bold py-4 rounded-full transition-all hover:opacity-90 active:scale-[0.98] mt-4"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-[#BCB5AC] border-t-white rounded-full animate-spin mx-auto" />
                    ) : t('signin_btn')}
                </button>
            </form>

            {/* 优雅分割线 */}
            <div className="relative my-12">
                <hr className="border-[#E5E0D8] dark:border-[#2A2826]" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FDFBF7] dark:bg-[#121110] px-4 text-[9px] text-[#BCB5AC] tracking-[0.4em]">OR</span>
            </div>

            {/* 第三方登录：去色化处理以保持统一 */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => signIn('google', { callbackUrl: `/${locale}/shop` })}
                    className="flex items-center justify-center gap-2 border border-[#E5E0D8] dark:border-[#2A2826] rounded-full py-3 text-[#4A443F] dark:text-[#BCB5AC] hover:bg-[#F4F0E8] dark:hover:bg-[#1C1A19] transition-all text-[10px] font-bold tracking-widest"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-3.5 h-3.5 grayscale opacity-50" alt="Google" />
                    GOOGLE
                </button>
                <button
                    onClick={() => signIn('facebook', { callbackUrl: `/${locale}/shop` })}
                    className="flex items-center justify-center gap-2 border border-[#E5E0D8] dark:border-[#2A2826] rounded-full py-3 text-[#4A443F] dark:text-[#BCB5AC] hover:bg-[#F4F0E8] dark:hover:bg-[#1C1A19] transition-all text-[10px] font-bold tracking-widest"
                >
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-3.5 h-3.5 grayscale opacity-50" alt="FB" />
                    FACEBOOK
                </button>
            </div>

            <p className="mt-12 text-center text-[10px] tracking-widest text-[#BCB5AC] uppercase">
                {t('no_account')}
                <a href={`/${locale}/register`} className="ml-2 text-[#4A443F] dark:text-[#E5E0D8] font-bold border-b border-[#4A443F] dark:border-[#E5E0D8] pb-0.5 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors">
                    {t('register')}
                </a>
            </p>
        </div>
    );
}