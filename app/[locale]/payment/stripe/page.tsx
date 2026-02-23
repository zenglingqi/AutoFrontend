'use client';

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from 'next/navigation';
import StripePaymentWrapper from '@/components/Payment/StripePaymentWrapper';
import { useCurrency } from "@/components/Providers/CurrencyProvider";

// 1. 抽离逻辑子组件
function StripePaymentContent() {
    const currency = useCurrency()?.selectedCurrency.code;
    const searchParams = useSearchParams(); // 💡 这里的调用现在安全了
    const params = useParams();
    const locale = params.locale as string;

    const clientSecret = searchParams.get('secret');
    const orderSn = searchParams.get('orderSn');

    if (!clientSecret || !orderSn) {
        return (
            <div className="flex items-center justify-center text-muted py-20">
                <p className="text-[10px] uppercase tracking-[0.3em]">Invalid Payment Session</p>
            </div>
        );
    }

    return (
        <div className="max-w-[480px] mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-3xl font-serif italic text-foreground mb-4">Secure Checkout</h1>
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Order Reference</span>
                    <span className="text-xs font-medium text-gold tracking-widest">{orderSn}</span>
                </div>
                <div className="h-px w-12 bg-line-light mx-auto mt-8" />
            </header>

            <section className="bg-card-soft p-8 rounded-2xl border border-line-light shadow-sm">
                <StripePaymentWrapper
                    currency={currency}
                    orderSn={orderSn}
                    locale={locale}
                />
            </section>
        </div>
    );
}

// 2. 主页面只负责提供渲染环境
export default function StripePaymentPage() {
    return (
        <main className="min-h-screen bg-background pt-24 pb-12 px-6 animate-in fade-in duration-1000">
            {/* 💡 Suspense 必须包裹包含 useSearchParams 的组件 */}
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
                    <p className="text-serif italic text-muted">Stripe support SSL payment...</p>
                </div>
            }>
                <StripePaymentContent />
            </Suspense>
        </main>
    );
}