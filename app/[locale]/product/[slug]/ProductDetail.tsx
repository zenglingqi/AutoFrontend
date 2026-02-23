'use client';

import { useState } from 'react';
import { ProductDetailData, ProductVariant } from '@/types/product'; // 导入刚才定义的类型
import { ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import ProductDetailRenderer from "@/app/[locale]/product/[slug]/ProductDetailRenderer";
import { useCart } from '@/components/Context/CartContext'; //

interface Props {
    product: ProductDetailData;
}


export default function ProductDetail({ product }: Props) {
    const { addToCart } = useCart(); //
    // 默认选中第一个变体
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    // 媒体资源切换
    const [activeMedia, setActiveMedia] = useState(product.mediaList[0].url);



    // 处理添加到购物车
    const handleAddToCart = () => {
        if (selectedVariant.stock > 0) {
            // 注意：currencyCode 应根据你系统的当前币种逻辑传入，这里暂用变体自带的
            addToCart(product, selectedVariant, selectedVariant.currencyCode); //
        }
    };


    return (
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* 左侧：视觉呈现 (7/12) */}
            <div className="lg:col-span-7 space-y-6">
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-card border border-border/40 relative">
                    {/* 判断当前媒体是否为视频 (Youtube 示例) */}
                    {activeMedia.includes('youtube') ? (
                        <iframe
                            src={activeMedia.replace('shorts/', 'embed/')}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    ) : (
                        <img src={activeMedia} className="w-full h-full object-cover animate-in fade-in duration-700" alt={product.name} />
                    )}

                    {/* 促销浮标 */}
                    {selectedVariant.hasPromotion && (
                        <div className="absolute top-8 left-8 bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                            Special Offer - Save {selectedVariant.currencyCode} {selectedVariant.promoValue}
                        </div>
                    )}
                </div>

                {/* 缩略图列表 */}
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {product.mediaList.map((m: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setActiveMedia(m.url)}
                            className={`w-20 h-24 flex-shrink-0 rounded-2xl border-2 transition-all overflow-hidden ${activeMedia === m.url ? 'border-gold' : 'border-transparent opacity-60'}`}
                        >
                            <img src={m.coverUrl || m.url} className="w-full h-full object-cover" alt="thumbnail" />
                        </button>
                    ))}
                </div>
            </div>

            {/* 右侧：详情与交互 (5/12) */}
            <div className="lg:col-span-5 flex flex-col pt-4">
                <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-muted mb-6 font-bold">
                    {product.categories.map((c: any) => (
                        <span key={c.categoryCode} className={c.primary ? "text-gold" : ""}>{c.name}</span>
                    ))}
                </nav>

                <h1 className="text-4xl md:text-5xl font-serif italic text-foreground leading-tight mb-4">
                    {product.name}
                </h1>
                <p className="text-muted text-sm tracking-wide leading-relaxed mb-8">
                    {product.description}
                </p>

                {/* 价格区域 */}
                <div className="flex items-baseline gap-4 mb-10 pb-10 border-b border-border/40">
                    <span className="text-3xl font-serif text-gold italic">
                        {selectedVariant.currencyCode} {selectedVariant.promotionPrice || selectedVariant.price}
                    </span>
                    {selectedVariant.compareAtPrice > selectedVariant.price && (
                        <span className="text-lg text-muted line-through opacity-50">
                            {selectedVariant.currencyCode} {selectedVariant.compareAtPrice}
                        </span>
                    )}
                </div>

                {/* 规格选择 (Attributes) */}
                <div className="space-y-8 mb-12">
                    {Object.entries(product.attributeKeyDisplays).map(([key, label]: [string, any]) => (
                        <div key={key}>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-4">{label}</p>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((v: any) => {
                                    const attr = v.attributeDisplays[key];
                                    const isSelected = selectedVariant.skuCode === v.skuCode;
                                    return (
                                        <button
                                            key={v.skuCode}
                                            onClick={() => {
                                                setSelectedVariant(v);
                                                // 自动切换对应的媒体图
                                                const relatedMedia = product.mediaList.find((m: any) => m.variantCode === v.skuCode);
                                                if (relatedMedia) setActiveMedia(relatedMedia.url);
                                            }}
                                            className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase transition-all border ${
                                                isSelected
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "bg-transparent border-border hover:border-gold text-foreground"
                                            }`}
                                        >
                                            {attr.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>


                {/* 购买按钮区域 */}
                <div className="flex flex-col gap-4 mb-12">
                    <button
                        onClick={handleAddToCart}
                        disabled={selectedVariant.stock <= 0}
                        className={`w-full py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl group ${
                            selectedVariant.stock > 0
                                ? "bg-foreground text-background hover:bg-gold shadow-foreground/10"
                                : "bg-muted text-background cursor-not-allowed opacity-50 shadow-none"
                        }`}
                    >
                        <ShoppingBag size={16} className={selectedVariant.stock > 0 ? "group-hover:-translate-y-1 transition-transform" : ""} />
                        {selectedVariant.stock > 0 ? "Add to Sanctuary" : "Currently Unavailable"}
                    </button>

                    <p className="text-center text-[9px] text-muted uppercase tracking-widest">
                        {selectedVariant.stock > 0
                            ? `Limited Selection: ${selectedVariant.skuCode}`
                            : "We are currently out of stock for this variant"}
                    </p>
                </div>

                {/* 品牌承诺 */}
                <div className="grid grid-cols-3 gap-4 pt-10 border-t border-border/40">
                    <div className="text-center">
                        <div className="flex justify-center mb-2 text-gold"><ShieldCheck size={20} strokeWidth={1} /></div>
                        <p className="text-[8px] uppercase font-black tracking-widest text-foreground">Authentic</p>
                    </div>
                    <div className="text-center">
                        <div className="flex justify-center mb-2 text-gold"><Truck size={20} strokeWidth={1} /></div>
                        <p className="text-[8px] uppercase font-black tracking-widest text-foreground">Global Delivery</p>
                    </div>
                    <div className="text-center">
                        <div className="flex justify-center mb-2 text-gold"><RotateCcw size={20} strokeWidth={1} /></div>
                        <p className="text-[8px] uppercase font-black tracking-widest text-foreground">Exchanges</p>
                    </div>
                </div>
            </div>

            {/* 详情描述 HTML */}

            {/* 详情描述区块 - 核心升级 */}
            <section className="lg:col-span-12 mt-24 pt-24 border-t border-border/40">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-[10px] tracking-[0.5em] uppercase text-gold mb-16 text-center font-bold">
                        The Art of Craftsmanship
                    </h2>

                    <ProductDetailRenderer content={product.detailHtml} />
                </div>
            </section>
        </div>
    );
}