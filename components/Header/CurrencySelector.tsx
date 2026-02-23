'use client';
import { useState } from 'react';
import { CURRENCIES } from '@/constants/currencies';
import { DollarSign } from "lucide-react";
import {useCurrency} from "@/components/Providers/CurrencyProvider";

export default function CurrencySelector() {
    const [isOpen, setIsOpen] = useState(false);
    // 从 Context 获取全局状态和设置函数
    const { selectedCurrency, setCurrency } = useCurrency();

    return (
        <div className="relative font-sans">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1.5 group outline-none">
                <DollarSign size={13} strokeWidth={2.5} className="text-muted group-hover:text-gold transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-gold transition-colors">
                    {selectedCurrency.code}
                </span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-10 left-0 w-40 bg-card border border-border/60 rounded-2xl shadow-xl z-[70] p-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                        {CURRENCIES.map((cur) => (
                            <button
                                key={cur.code}
                                onClick={() => {
                                    setCurrency(cur.code); // 更新全局货币
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between p-3 hover:bg-muted/5 rounded-xl transition-all group ${
                                    selectedCurrency.code === cur.code ? 'bg-muted/5 text-gold' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-emoji text-base">{cur.emoji}</span>
                                    <span className="text-[10px] font-black text-foreground group-hover:text-gold">{cur.code}</span>
                                </div>
                                <span className="text-[10px] text-muted/40 font-serif italic">{cur.symbol}</span>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}











