


// 支付方式枚举 第一层，（后台也是一样字符
export type PaymentMethodType =
    | 'CARD'
    | 'PAYPAL'
    | 'STRIPE'
    | 'APPLEPAY'
    | 'WECHATPAY'
    | 'ALIPAY';


// 卡品牌枚举
export type ProviderType =
    | 'MOCK'        // 站内模拟支付
    | 'CASH'
    | 'BANKTRANSFER'
    | 'PAYPAL'
    | 'GOOGLEPAY'
    | 'STRIPE'
    | 'CARD'
    | 'APPLEPAY'
    | 'WECHATPAY'
    | 'ALIPAY'
    | 'VISA'
    | 'MASTERCARD'
    | 'AMEX'
    | 'DISCO'
    | 'DINERS'
    | 'UNIONPAY'
    | 'MAESTRO'
    | 'JCB'


// 前端请求类型
export interface UserCard {
    id:number;
    userId:string;
    paymentMethod: PaymentMethodType;   // credit_card / paypal / stripe
    provider: ProviderType;     // Visa / MasterCard...（仅当 type=CARD 时需要）

    holderName: string;
    last4:string;
    number?: string;           // 卡号（仅用于生成 last4，不保存）
    token: string;             // 支付网关 token
    expireMonth:string;
    expireYear:string;
    isDefault: boolean;
}



