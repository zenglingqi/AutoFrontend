'use client';

import { useState } from 'react';
import IntlPhoneInput from "./IntlPhoneInput";

export default function RegisterForm({ loginMessages, locale }: any) {
    const [regType, setRegType] = useState<'EMAIL' | 'PHONE'>('EMAIL');
    const [formData, setFormData] = useState({ identifier: '', password: '', code: '' });

    return (
        <div className="w-full max-w-[420px] bg-card border border-border rounded-[2.5rem] p-10 md:p-14 shadow-sm transition-all duration-500">
            <div className="text-center mb-10">
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted font-bold mb-2">Maison Collection</p>
                <h1 className="text-3xl font-serif text-foreground italic tracking-tight">Create Account</h1>
            </div>

            <div className="flex justify-center gap-10 mb-12 border-b border-border/40">
                {['EMAIL', 'PHONE'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setRegType(type as any)}
                        className={`pb-3 text-[10px] uppercase tracking-[0.3em] transition-all relative font-black ${
                            regType === type ? 'text-gold' : 'text-muted/40 hover:text-muted'
                        }`}
                    >
                        {type}
                        {regType === type && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gold" />}
                    </button>
                ))}
            </div>

            <form className="space-y-12">
                <div className="relative group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold group-focus-within:text-gold transition-colors">Identification</label>
                    <div className="mt-2">
                        {regType === 'PHONE' ? (
                            <IntlPhoneInput value={formData.identifier} onChangeAction={(v: any) => setFormData({...formData, identifier: v})} />
                        ) : (
                            <input
                                type="email"
                                className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground outline-none focus:border-gold transition-all placeholder:text-muted/40 font-medium"
                                placeholder="Email Address"
                            />
                        )}
                    </div>
                </div>

                <div className="relative group">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted font-bold group-focus-within:text-gold transition-colors">Security</label>
                    <input
                        type="password"
                        className="w-full bg-transparent border-b border-border py-2.5 text-sm text-foreground outline-none focus:border-gold transition-all placeholder:text-muted/40 font-medium"
                        placeholder="Create Password"
                    />
                </div>

                <button className="w-full bg-foreground text-background text-[11px] uppercase tracking-[0.3em] font-black py-5 rounded-full transition-all hover:opacity-95 active:scale-[0.98] shadow-lg mt-4">
                    Join Collection
                </button>
            </form>

            <p className="mt-14 text-center text-[10px] tracking-widest text-muted uppercase font-bold">
                Existing Member? <a href={`/${locale}/login`} className="text-gold ml-1 hover:underline decoration-gold/30">Log In</a>
            </p>
        </div>
    );
}