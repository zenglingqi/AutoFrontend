// @/components/Payment/PayPalPaymentWrapper.tsx
'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PaymentStatusFeedback } from "./PaymentStatusFeedback";
import { useState } from "react";
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";
import {LANGUAGES} from "@/constants/languages";

interface Props {
    orderSn: string;
    currency: string;
    locale: string;
}

export default function PayPalPaymentWrapper({ orderSn, currency, locale }: Props) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    // 用于在 onApprove 阶段获取交易 ID
    const [currentTxnId, setCurrentTxnId] = useState<string>("");

    const getPaypalLocale = (currentLocale: string) => {
        const found = LANGUAGES.find(l => l.code.startsWith(currentLocale)) || LANGUAGES[1];
        return found.code.replace('-', '_');
    };

    const paypalLocale = getPaypalLocale(locale);

    return (
        <div className="w-full space-y-4">
            {status !== 'idle' && (
                <PaymentStatusFeedback
                    status={status === 'processing' ? 'processing' : (status === 'success' ? 'success' : 'error')}
                    message={status === 'processing' ? "Syncing with PayPal..." : (status === 'success' ? "Payment Verified" : "Transaction Failed")}
                />
            )}

            <PayPalScriptProvider options={{
                "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                currency: currency,
                // 注意：intent 通常是 "CAPTURE" 或 "AUTHORIZE"，不是 txnId
                locale: paypalLocale,
                intent: "capture",
            }}>
                <PayPalButtons
                    style={{
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'pill',
                        label: 'paypal',
                        height: 48
                    }}
                    createOrder={async () => {
                        try {
                            // Step 1: 创建支付记录 (Payment Record)
                            const recordRes = await clientAPIFrame('/api/orders/paymentRecord/create', {
                                method: 'POST',
                                body: JSON.stringify({
                                    orderSn: orderSn,
                                    paymentProviderType: 'PAYPAL',
                                    payCurrency: currency,
                                    paymentMethodType: 'PAYPAL',
                                })
                            });

                            const recordData = await recordRes.json();
                            const recordSn = recordData.data?.recordSn || recordData.recordSn;

                            if (!recordSn) throw new Error("Failed to get Record SN");

                            // Step 2: 调用支付接口获取 PayPal 订单 ID (txnId)
                            const payRes = await clientAPIFrame(`/api/orders/${recordSn}/pay`, {
                                method: 'POST',
                                body: JSON.stringify({
                                    paymentProviderType: 'PAYPAL',
                                    returnUrl: `${window.location.origin}/payment/success`,
                                    cancelUrl: `${window.location.origin}/payment/cancel`,
                                })
                            });

                            const payData = await payRes.json();
                            // 假设后端返回的对象中包含 txnId 或 paymentToken
                            const txnId = payData.data?.txnId || payData.txnId || payData.paymentToken;

                            if (!txnId) throw new Error("Failed to get PayPal Transaction ID");

                            // 保存 txnId 供后续 onApprove 使用
                            setCurrentTxnId(txnId);

                            return txnId;
                        } catch (error) {
                            console.error("PayPal Order Creation Error:", error);
                            setStatus('error');
                            throw error;
                        }
                    }}
                    onApprove={async (data, actions) => {
                        setStatus('processing');
                        try {
                            // 使用刚才保存的 currentTxnId 或 PayPal 返回的 data.orderID
                            const targetId = currentTxnId || data.orderID;
                            const res = await clientAPIFrame(`/api/payments/paypal/capture?paypalOrderId=${targetId}`, {
                                method: 'POST'
                            });

                            if (res.ok) {
                                setStatus('success');
                                window.location.href = `/${locale}/order/success/${orderSn}`;
                            } else {
                                setStatus('error');
                            }
                        } catch (err) {
                            setStatus('error');
                        }
                    }}

                    onError={() => setStatus('error')}
                />
            </PayPalScriptProvider>
        </div>
    );
}