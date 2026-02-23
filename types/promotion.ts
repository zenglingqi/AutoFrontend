// @/types/promotion.ts
export interface PromotionItem {
    id: number;
    name: string;
    discountAmount: number; // 已转换后的目标币种金额
}

export interface PotentialPromotion {
    name: string;
    minSpend: number;    // 门槛金额
    gapAmount: number;   // 还差多少
    tip: string;         // 后端生成的文案：“再买 $10 即可参加...”
}

export interface CartPromotionPreview {
    appliedPromotions: PromotionItem[];
    upcomingPromotions: PotentialPromotion[];
    totalDiscountAmount: number;
    finalPayAmount: number;
    currency: string;
}