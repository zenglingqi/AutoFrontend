// @/components/Payment/StripeCheckoutForm.tsx
'use client';

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";

export default function StripeCheckoutForm({ orderSn, clientSecret }: { orderSn: string, clientSecret: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);
        setMessage("Verifying with sanctuary vaults...");

        // 1. 调用 Stripe 确认支付
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // 作为兜底跳转地址
                return_url: `${window.location.origin}/${locale}/order/success/${orderSn}`,
            },
            redirect: 'if_required', // 不让 Stripe 自动刷新页面，由我们接管
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsLoading(false);
            return;
        }

        // 2. 如果 Stripe 返回成功，或者处于处理中，则调用后端 check-status 接口
        if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
            setMessage("Finalizing your order...");

            try {
                // 调用你提供的后端核验接口
                const verifyRes = await clientAPIFrame(`/api/payments/stripe/check-status/${clientSecret}`, {
                    method: 'POST'
                });

                const verifyResult = await verifyRes.json();

                // 假设 PayResultDTO 中包含 success 字段或类似逻辑
                if (verifyRes.ok && verifyResult.success) {
                    setMessage("Order Secured. Redirecting...");
                    // 支付成功，跳转到你刚才建立的成功页
                    router.push(`/${locale}/order/success/${orderSn}`);
                } else {
                    setMessage(verifyResult.message || "Payment verification failed.");
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Status check failed:", err);
                setMessage("Could not confirm status with server.");
                setIsLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full bg-gold text-background py-4 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all disabled:opacity-50"
            >
                {isLoading ? "Synchronizing..." : "Confirm & Pay"}
            </button>

            {message && (
                <p className="text-[10px] text-center uppercase tracking-widest text-gold animate-pulse">
                    {message}
                </p>
            )}
        </form>
    );
}