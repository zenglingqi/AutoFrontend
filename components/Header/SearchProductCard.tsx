'use client';

interface SearchProduct {
    productCode: string;
    name: string;
    slug: string;
    mainImage: string;
    minPrice: number;
    originalPrice: number;
    currencyCode: string;
    brandName: string;
    discountLabel?: string;
    hasPromotion: boolean;
}

export default function SearchProductCard({ product, locale }: { product: SearchProduct, locale: string }) {
    return (
        <a
            href={`/${locale}/product/${product.slug}`}
            className="flex items-center gap-4 p-2 hover:bg-muted/5 rounded-xl transition-all group"
        >
            {/* 图片预览 */}
            <div className="relative w-16 h-20 bg-muted/10 rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.hasPromotion && (
                    <span className="absolute top-1 left-1 bg-gold text-white text-[8px] font-bold px-1 rounded-sm">
                        {product.discountLabel}
                    </span>
                )}
            </div>

            {/* 信息区域 */}
            <div className="flex flex-col justify-center min-w-0">
                <p className="text-[9px] uppercase tracking-widest text-muted/60 mb-1">{product.brandName}</p>
                <h4 className="text-[13px] font-bold text-foreground truncate group-hover:text-gold transition-colors">
                    {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] font-serif italic text-foreground">
                        {product.currencyCode === 'USD' ? '$' : product.currencyCode} {product.minPrice}
                    </span>
                    {product.hasPromotion && (
                        <span className="text-[10px] text-muted/40 line-through">
                            {product.originalPrice}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}