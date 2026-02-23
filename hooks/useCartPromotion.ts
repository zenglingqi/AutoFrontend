// @/hooks/useCartPromotion.ts
import { useState, useEffect } from 'react';
import { clientAPIFrame } from '@/app/api/frameAPI/clientAPIFrame';
import { debounce } from 'lodash';
import {CartPromotionPreview} from "@/types/promotion";

export function useCartPromotion(selectedItems: any[], currency: string) {
    const [promoData, setPromoData] = useState<CartPromotionPreview | null>(null);
    const [loading, setLoading] = useState(false);

    // 使用防抖，避免用户快速点击加减数量时频繁请求接口
    const fetchPreview = debounce(async (items, curr) => {
        if (items.length === 0) {
            setPromoData(null);
            return;
        }
        setLoading(true);
        try {
            const res = await clientAPIFrame(`/api/marketing/preview-cart?currency=${curr}`, {
                method: 'POST',
                body: JSON.stringify(items),
            });
            if (res.ok) {
                const data = await res.json();
                setPromoData(data);
            }
        } catch (err) {
            console.error("Promotion preview failed", err);
        } finally {
            setLoading(false);
        }
    }, 300);

    useEffect(() => {
        fetchPreview(selectedItems, currency);
    }, [selectedItems, currency]);

    return { promoData, loading };
}