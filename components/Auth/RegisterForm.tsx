'use client';

import { useState } from 'react';
import IntlPhoneInput from "./IntlPhoneInput";

export default function RegisterForm({ loginMessages, locale }: any) {
    const [regType, setRegType] = useState<'EMAIL' | 'PHONE'>('EMAIL');
    const [formData, setFormData] = useState({ identifier: '', password: '', code: '' });

    return (
        /* 背景色随模式切换：奶油米 -> 暖熏黑 */
        <div className="w-full max-w-[420px] bg-[#FDFBF7] dark:bg-[#121110] border border-[#E5E0D8] dark:border-[#2A2826] rounded-[2rem] p-10 md:p-14 shadow-sm">

            <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#A89F91] mb-2">Artisanal Jewelry</p>
                <h1 className="text-2xl font-serif text-[#4A443F] dark:text-[#E5E0D8] italic">Create Account</h1>
            </div>

            {/* 切换器：无框，仅靠文字和下划线 */}
            <div className="flex justify-center gap-8 mb-10 border-b border-[#E5E0D8]/50 dark:border-[#2A2826]/50">
                {['EMAIL', 'PHONE'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setRegType(type as any)}
                        className={`pb-2 text-[10px] uppercase tracking-widest transition-all relative ${
                            regType === type ? 'text-[#C5A059] font-bold' : 'text-[#BCB5AC]'
                        }`}
                    >
                        {type}
                        {regType === type && <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059]" />}
                    </button>
                ))}
            </div>

            <form className="space-y-10">
                <div className="relative group">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-[#A89F91]">Identification</label>
                    {regType === 'PHONE' ? (
                        <div className="pt-2"><IntlPhoneInput value={formData.identifier} onChange={(v: any) => setFormData({...formData, identifier: v})} /></div>
                    ) : (
                        <input type="email" className="w-full bg-transparent border-b border-[#E5E0D8] dark:border-[#2A2826] py-2 text-sm text-[#4A443F] dark:text-[#E5E0D8] outline-none focus:border-[#C5A059] transition-colors" placeholder="Email Address" />
                    )}
                </div>

                <div className="relative group">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-[#A89F91]">Security</label>
                    <input type="password" className="w-full bg-transparent border-b border-[#E5E0D8] dark:border-[#2A2826] py-2 text-sm text-[#4A443F] dark:text-[#E5E0D8] outline-none focus:border-[#C5A059] transition-colors" placeholder="Password" />
                </div>

                {/* 注册按钮：在浅色下是深褐色，深色下是柔金色 */}
                <button className="w-full bg-[#4A443F] dark:bg-[#C5A059] text-[#FDFBF7] dark:text-[#121110] text-[11px] uppercase tracking-[0.3em] font-bold py-4 rounded-full transition-all hover:opacity-90 active:scale-[0.98]">
                    Join Collection
                </button>
            </form>

            <p className="mt-12 text-center text-[10px] tracking-widest text-[#BCB5AC] uppercase">
                Existing Member? <a href={`/${locale}/login`} className="text-[#C5A059] font-bold ml-1 hover:underline">Log In</a>
            </p>
        </div>
    );
}