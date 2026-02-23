// @/app/[locale]/order/detail/[orderSn]/page.tsx

interface PaymentRecord {
    recordSn: string;
    orderSn: string;
    amount: string;           // 订单原始金额
    currencyCode: string;     // 订单币种
    payAmount: string;        // 实际支付金额
    payCurrencyCode: string;  // 实际支付币种
    paymentMethodType: string; // 如 CARD, PAYPAL
    paymentProviderType: string; // STRIPE, PAYPAL
    status: 'INIT' | 'CREATED' |'REDIRECT_REQUIRED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELED' | 'EXPIRED';
    providerTxnId?: string;   // 支付网关流水号
    failReason?: string;      // 失败原因
    createdAt: string;
    exchangeRate: string;
    fxFee:string;


}