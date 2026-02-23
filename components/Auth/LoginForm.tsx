'use client';


import {useSearchParams} from "next/navigation";

const SOCIAL_PROVIDERS = [
    { id: 'google', name: 'Google', icon: '/icons/google.svg' },
    { id: 'facebook', name: 'Facebook', icon: '/icons/facebook.svg' }
];

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from '@/i18n/navigation';


export default function LoginForm({ loginMessages, locale }: { loginMessages: any, locale: string }) {
    const t = (key: string) => loginMessages[key] || key;
    const router = useRouter();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || searchParams.get('redirect') || '/shop';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 使用 next-auth 的 credentials 登录 还有googl/facebook
            const result = await signIn('credentials', {
                identifier: formData.identifier.trim(),
                password: formData.password.trim(),
                redirect: false, // 手动处理跳转
            });

            if (result?.error) {
                setError(t('auth_failed')); // 这里的 t 对应登录失败翻译
            } else {

                router.push(callbackUrl);
                // 强制刷新以更新全局 session 状态
                setTimeout(() => {
                    router.refresh();
                }, 100);
            }
        } catch (err) {
            setError(t('network_error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[420px] bg-card border border-border rounded-[2.5rem] p-10 md:p-14 shadow-sm transition-all duration-500">
            <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted font-medium mb-2">Artisanal Jewelry</p>
                <h1 className="text-3xl font-serif text-foreground italic tracking-tight">{t('signin')}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="relative group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold group-focus-within:text-gold transition-colors">Account</label>
                    <input
                        type="text"
                        placeholder={t('email_phone_placeholder')}
                        className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground outline-none focus:border-gold transition-all placeholder:text-muted/40"
                        onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                    />
                </div>

                <div className="relative group">
                    <div className="flex justify-between items-end">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold group-focus-within:text-gold transition-colors">Security</label>
                        <a href="#" className="text-[9px] uppercase tracking-widest text-muted/60 hover:text-gold transition-colors italic font-medium">Forgot?</a>
                    </div>
                    <input
                        type="password"
                        placeholder={t('password_placeholder')}
                        className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground outline-none focus:border-gold transition-all placeholder:text-muted/40"
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                {error && <p className="text-gold text-[10px] text-center font-bold italic tracking-wider">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-foreground text-background text-[11px] uppercase tracking-[0.3em] font-black py-5 rounded-full transition-all hover:opacity-95 active:scale-[0.98] mt-4 shadow-md"
                >
                    {loading ? <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin mx-auto" /> : t('signin_btn')}
                </button>
            </form>

            {/* 修复后的 OR 分割线 */}
            <div className="flex items-center my-12 gap-4">
                <div className="flex-1 h-[1px] bg-border/40"></div>
                <span className="text-[10px] text-muted/50 tracking-[0.4em] font-bold uppercase">OR</span>
                <div className="flex-1 h-[1px] bg-border/40"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {SOCIAL_PROVIDERS.map((plat) => (
                    <button
                        key={plat.id}
                        onClick={() => signIn(plat.id, { callbackUrl: `/${locale}/shop` })}
                        className="flex items-center justify-center gap-3 border border-border/80 rounded-full py-3.5 text-foreground hover:bg-muted/5 transition-all text-[10px] font-black tracking-[0.2em] uppercase shadow-sm group"
                    >
                        <img
                            src={plat.icon}
                            className="w-4 h-4 transition-transform group-hover:scale-110"
                            alt={plat.name}
                        />
                        {plat.name}
                    </button>
                ))}
            </div>

            <p className="mt-14 text-center text-[10px] tracking-widest text-muted uppercase font-medium">
                {t('no_account')}
                <a href={`/${locale}/register`} className="ml-2 text-foreground font-black border-b-2 border-foreground/20 pb-0.5 hover:text-gold hover:border-gold transition-all">{t('register')}</a>
            </p>
        </div>
    );
}