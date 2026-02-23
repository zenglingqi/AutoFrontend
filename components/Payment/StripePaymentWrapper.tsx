// @/components/Payment/StripePaymentWrapper.tsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';
import { Appearance } from '@stripe/stripe-js';
import {useEffect, useState} from "react";
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


export const getStripeAppearance = (isDarkMode: boolean): Appearance => ({



    theme: isDarkMode ? 'night' : 'flat',
    variables: {
        colorPrimary: isDarkMode ? '#BFAF99' : '#8C7E6D', // 暮色香槟 : 哑光香槟
        colorBackground: isDarkMode ? '#141312' : '#FDFBF7', // --background
        colorText: isDarkMode ? '#D9D2C9' : '#3D3834',       // --foreground
        colorDanger: '#B45309',
        fontFamily: 'serif',
        spacingUnit: '4px',
        borderRadius: '8px',
    },
    rules: {
        '.Input': {
            backgroundColor: 'transparent',
            // 使用 line-light 对应的颜色，保持极细边框
            borderColor: isDarkMode ? '#262422' : '#EEEAE4',
            borderWidth: '1px',
            boxShadow: 'none',
        },
        '.Input:focus': {
            borderColor: '#8C7E6D', // gold
        },
        '.Label': {
            color: isDarkMode ? '#82786E' : '#A69B8F', // muted
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '10px',
            fontWeight: '500',
        },
        '.Tab': {
            backgroundColor: isDarkMode ? '#1C1A19' : '#F8F5EF', // card-soft
            border: '0',
            boxShadow: 'none',
        },
        '.Tab--selected': {
            backgroundColor: isDarkMode ? '#262422' : '#E5E0D8', // active-bg
        }
    }
});

export default function StripePaymentWrapper({ currency, orderSn,locale }: { currency: string, orderSn: string, locale? :string }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    const appearance = getStripeAppearance(isDarkMode);

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const preparePayment = async () => {
            try {
                // Step 1: 创建支付记录
                const recordRes = await clientAPIFrame('/api/orders/paymentRecord/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        orderSn: orderSn,
                        paymentProviderType: 'STRIPE',
                        payCurrency: currency,
                        paymentMethodType: 'CARD',
                    })
                });
                const recordData = await recordRes.json();
                const recordSn = recordData?.data?.recordSn || recordData?.recordSn;

                // Step 2: 获取支付令牌
                const payRes = await clientAPIFrame(`/api/orders/${recordSn}/pay`, {
                    method: 'POST',
                    body: JSON.stringify({
                        paymentProviderType: 'CARD',
                        returnUrl: `${window.location.origin}/payment/success`,
                        cancelUrl: `${window.location.origin}/payment/cancel`,
                    })
                });
                const payData = await payRes.json();

                // 兼容不同后端的字段名
                const secret = payData?.data?.paymentToken || payData?.paymentToken || payData?.txnId;

                if (secret) {
                    setClientSecret(secret);
                }
            } catch (err) {
                console.error("Stripe Preparation Error:", err);
            } finally {
                setLoading(false);
            }
        };

        preparePayment();
    }, [orderSn, currency]);

    if (loading) return <div className="p-10 text-center text-[10px] uppercase tracking-widest text-gold animate-pulse">Initializing Secure Vault...</div>;
    if (!clientSecret) return <div className="p-10 text-center text-[10px] text-red-400">Failed to initialize payment.</div>;



    return (
        <div className="w-full bg-background animate-in fade-in duration-700">
            <Elements stripe={stripePromise} options={{ clientSecret, appearance,locale: (locale as any) || 'auto' }}>
                <StripeCheckoutForm
                    orderSn={orderSn}
                    clientSecret={clientSecret} // 传递 Secret 供 Check 接口使用
                />
            </Elements>

            <div className="flex flex-col items-center p-9 gap-2 animate-in fade-in duration-700">
                <div className="flex items-center gap-4 opacity-30 grayscale contrast-125">
                    {/* 这里可以放微小的支付图标，如 Visa/Mastercard/PayPal 的极简版 */}
                    <div className="w-8 h-4 bg-neutral-400 rounded-sm" />
                    <div className="w-8 h-4 bg-neutral-400 rounded-sm" />
                    <div className="w-8 h-4 bg-neutral-400 rounded-sm" />
                </div>
                <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-[0.1em] text-center">
                    Total security with end-to-end encryption. <br/>
                    By clicking, you agree to our Terms of Service.
                </p>
            </div>
            {/* 底部保障 */}
            <footer className="mt-8 text-center">
                <p className="text-[9px] uppercase tracking-widest text-muted/60 flex items-center justify-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-green-500/50" />
                    Encrypted SSL Connection · Stripe Secured
                </p>
            </footer>
        </div>
    );
}