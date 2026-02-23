// Enum Types (Assumed to be defined elsewhere)
type PaymentMethodType = 'CARD' | 'APPLEPAY' | 'GOOGLEPAY' | 'PAYPAL' | 'WECHATPAY' | 'ALIPAY';
type PaymentProviderType = 'VISA' | 'MASTERCARD' | 'PAYPAL' | 'STRIPE' | 'UNIONPAY' | 'APPLEPAY' | 'GOOGLEPAY' | 'WECHATPAY' | 'ALIPAY';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED' | 'EXPIRED';



export interface PaymentRecord {
    recordSn: string ;                // Unique identifier for the payment record
    orderSn: string ;                 // Order identifier
    userId: number;                  // ID of the user who made the payment
    amount: string;                  // Total amount in the original currency
    currencyCode: string;            // Currency of the amount (e.g., 'CNY', 'USD')
    paymentMethodType: PaymentMethodType; // Method used for payment (e.g., 'CARD', 'PAYPAL')
    paymentProviderType: PaymentProviderType; // Provider handling the payment (e.g., 'VISA', 'PAYPAL')
    payAmount: string;               // Amount paid (could be different from `amount` if there are conversion fees)
    payCurrencyCode: string;         // Currency of the paid amount (e.g., 'CNY', 'USD')
    exchangeRate: string;            // Exchange rate used if currency is converted
    fxFee: string;                   // Foreign exchange fee applied during conversion
    status: PaymentStatus;           // Payment status (e.g., 'PENDING', 'SUCCESS', 'FAILED')
    providerTxnId: string;           // Transaction ID from the payment provider
    failReason: string;              // Reason for failure, if any
    createdAt: string;               // Date and time the record was created
    updatedAt: string;               // Date and time the record was last updated
}





export interface CreatePaymentRecordRequest {
    orderSn: string;
    orderId: string;
    PayCurrency: string;
    paymentProviderType: PaymentProviderType;
    paymentMethodType: PaymentMethodType;

}



export interface PayResultDTO {
    status: PaymentStatus;    // 使用同步后的枚举
    success: boolean;
    orderSn: string;
    message?: string;
    redirectUrl?: string;
    provider: string;
    txnId?: string;
    failReason?: string;
}