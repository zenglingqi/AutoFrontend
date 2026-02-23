// @/components/Providers/CurrencyProvider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES } from '@/constants/currencies';
import Cookies from 'js-cookie'; // 引入 js-cookie

interface Currency {
    code: string;
    symbol: string;
    iso2: string;
    emoji: string;
}

interface CurrencyContextType {
    selectedCurrency: Currency;
    setCurrency: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    // 初始状态尝试从 Cookie 读取（避免 Hydration 错误，初始设为默认值，useEffect 再校准）
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);

    useEffect(() => {
        // 客户端挂载后从 Cookie 读取
        const saved = Cookies.get('user_currency');
        if (saved) {
            const found = CURRENCIES.find(c => c.code === saved);
            if (found) setSelectedCurrency(found);
        }
    }, []);

    const setCurrency = (code: string) => {
        const found = CURRENCIES.find(c => c.code === code);
        if (found) {
            setSelectedCurrency(found);
            // 写入 Cookie，有效期设为 7 天，确保服务端能读到
            Cookies.set('user_currency', code, { expires: 365, path: '/' });
        }
    };

    return (
        <CurrencyContext.Provider value={{ selectedCurrency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
    return context;
};