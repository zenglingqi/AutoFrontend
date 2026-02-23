// @/components/Product/ProductCard.tsx
'use client';

import Link from 'next/link';
import { ShoppingBag, Eye } from 'lucide-react';
import { useLocale } from 'next-intl';

interface ProductCardProps {
    product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
    const lang = useLocale();

    return (
        /* 1. 移除固定的 bg-white，改用 var(--card)
           2. border 颜色使用全局定义好的变量
        */
        <div className="group relative flex flex-col bg-card overflow-hidden transition-all duration-500 hover:shadow-xl rounded-2xl border border-border/40">

            {/* 图片区域 - 移动端减小内边距 */}
            <div className="relative aspect-[3/4] overflow-hidden bg-foreground/[0.02]">
                <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* 促销标签 - 减小移动端字体 */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1.5">
                    {product.hasPromotion && (
                        <span className="bg-red-500 text-white text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 rounded-full shadow-sm uppercase tracking-tighter">
                            {product.discountLabel} {product.currencyCode} {product.promoValue}
                        </span>
                    )}
                    {product.isNewIn && (
                        <span className="bg-gold text-background text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 rounded-full shadow-sm uppercase tracking-tighter">
                            New In
                        </span>
                    )}
                </div>

                {/* 悬浮操作：在移动端可以考虑隐藏，或者改为点击触发 */}
                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 hidden md:flex gap-2">
                    <button className="flex-1 bg-background/90 backdrop-blur-md text-foreground py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gold hover:text-background transition-colors shadow-lg">
                        <Eye size={14} /> Quick View
                    </button>
                </div>
            </div>

            {/* 信息区域 - 调整间距以适配双排布局 */}
            <div className="p-4 md:p-6 flex flex-col flex-1">
                <p className="text-[8px] md:text-[10px] text-muted uppercase tracking-[0.2em] mb-1.5 font-medium">
                    {product.brandName}
                </p>

                <Link href={`/${lang}/product/${product.slug}`} className="hover:text-gold transition-colors">
                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-wide line-clamp-2 leading-relaxed min-h-[2.4rem] md:min-h-[3rem] text-foreground">
                        {product.name}
                    </h3>
                </Link>

                {/* 变体预览 */}
                <div className="flex gap-1 mt-3 mb-3">
                    {product.swatches?.map((color: string) => (
                        <div
                            key={color}
                            className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-border/60 shadow-inner"
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>

                {/* 价格底部 */}
                <div className="mt-auto pt-3 border-t border-border/20 flex flex-col gap-1">
                    <div className="flex flex-col">
                        {product.originalPrice > product.minPrice && (
                            <span className="text-[8px] md:text-[10px] text-muted line-through opacity-60">
                                {product.currencyCode} {product.originalPrice}
                            </span>
                        )}
                        <span className="text-xs md:text-sm font-serif italic text-gold">
                            {product.currencyCode} {product.minPrice}
                        </span>
                    </div>

                    {!product.inStock && (
                        <span className="text-[8px] font-bold text-red-400 uppercase tracking-tighter">
                            Sold Out
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}