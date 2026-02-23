'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { clientAPIFrame } from '@/app/api/frameAPI/clientAPIFrame';
import { PaymentStatusFeedback } from '@/components/Payment/PaymentStatusFeedback';

// 1. 创建一个子组件来处理所有逻辑
function StripeReturnContent() {
    const searchParams = useSearchParams(); // 这里的钩子现在被包裹在 Suspense 下了
    const router = useRouter();
    const clientSecret = searchParams.get('payment_intent_client_secret');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [msg, setMsg] = useState('Verifying your transaction...');

    useEffect(() => {
        if (!clientSecret) return;

        const checkStatus = async () => {
            try {
                const res = await clientAPIFrame(`/api/payments/stripe/check-status/${clientSecret}`, {
                    method: 'POST'
                });
                const data = await res.json();

                if (data.status === 'PAID' || data.success) {
                    setStatus('success');
                    setMsg('Payment secured. Preparing your collection...');
                    setTimeout(() => router.push(`/order/success/${data.orderSn}`), 2500);
                } else {
                    setStatus('error');
                    setMsg(data.message || 'The transaction could not be completed.');
                }
            } catch (err) {
                setStatus('error');
                setMsg('A connection error occurred.');
            }
        };

        checkStatus();
    }, [clientSecret, router]);

    return (
        <div className="w-full max-w-md space-y-8 text-center">
            <header>
                <h2 className="text-3xl font-serif italic text-foreground mb-2">Authenticating</h2>
                <div className="h-px w-12 bg-gold mx-auto" />
            </header>

            <PaymentStatusFeedback
                status={status === 'loading' ? 'processing' : status}
                message={msg}
            />

            {status === 'error' && (
                <button
                    onClick={() => router.push('/checkout')}
                    className="text-[10px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
                >
                    Return to Checkout
                </button>
            )}
        </div>
    );
}

// 2. 主页面只负责 Suspense 边界
export default function StripeReturnPage() {
    return (
        <main className="min-h-[80vh] flex items-center justify-center px-6">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
                    <p className="text-serif italic text-muted">Verifying your payment...</p>
                </div>
            }>
                <StripeReturnContent />
            </Suspense>
        </main>
    );
}