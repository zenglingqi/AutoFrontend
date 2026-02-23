'use client';

import React, { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
// 导入已有的渲染组件和卡片
import ProductCard from '@/components/shop/ProductCard';

import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";
import ProductCuration from "@/components/home/ProductCuration";
import {useTranslations} from "next-intl";

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const [featuredPost, setFeaturedPost] = useState<any>(null);
    const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
    const t = useTranslations('home');
    useEffect(() => {
        // 获取精选博文对接现有的接口
        clientAPIFrame(`/api/blog/featured?lang=${locale}`)
            .then(res => res.json())
            .then(data => data.code === 200 && setFeaturedPost(data.data));


        clientAPIFrame(`/api/products/list`, {
            method: "POST",
            body: JSON.stringify({
                 productCodes : ["BRL-001","BRL-002"],
                lang : locale,
                currency : "USD",
            })
        })
            .then(res => res.json())
            .then(data => data.code === 200 && setTrendingProducts(data.data));

    }, [locale]);

    return (
        <main className="bg-background ">
            {/* 1. Hero Section - 品牌第一印象 */}
            <section className="relative h-[100vh] w-full overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2000" // 建议使用诸暨珍珠系列大图
                        alt="Maison Lumière Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20" /> {/* 柔和遮罩 */}
                </motion.div>

                <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-white/80 tracking-[0.6em] uppercase text-[10px] mb-6 font-medium"
                    >
                        Luminescence in every detail
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-6xl md:text-8xl font-serif italic text-white leading-tight mb-10"
                    >
                        Maison <span className="font-light not-italic">Lumière</span>
                    </motion.h1>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                        <Link href={`/${locale}/shop`} className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500">
                            Explore Sanctuary
                        </Link>
                    </motion.div>
                </div>
            </section>


            <ProductCuration
                products={trendingProducts}
                title={locale === 'zh' ? "蝴蝶序曲系列" : "Butterfly Overture"}
            />

            {/* 2. Featured Journal - 叙事模块 (对接现有博文接口) */}
            {featuredPost && (
                <section className="py-32 px-6 max-w-[1400px] mx-auto">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="relative aspect-[4/5] overflow-hidden group">
                            <Image
                                src={featuredPost.mainImage}
                                alt={featuredPost.title}
                                fill
                                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                            />
                        </div>
                        <div className="space-y-8">
                            <span className="text-gold tracking-[0.3em] uppercase text-[10px] font-black italic">
                                {featuredPost.categoryName}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif italic leading-tight text-foreground">
                                {featuredPost.title}
                            </h2>
                            <p className="text-muted text-sm leading-relaxed max-w-md font-light">
                                {featuredPost.excerpt}
                            </p>
                            <Link href={`/${locale}/blog/${featuredPost.slug}`} className="inline-flex items-center gap-4 text-[10px] uppercase tracking-widest text-foreground border-b border-foreground pb-2 group">
                                Read the Story <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* 3. Global Theme Adaptivity - 主题自适应装饰 */}
            <section className="bg-card py-24 border-y border-border/40">
                <div className="max-w-3xl mx-auto text-center px-6">
                    <p className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed">
                        "Luxury is not the opposite of poverty, but the opposite of vulgarity."
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <div className="w-12 h-[1px] bg-gold/50 self-center" />
                        <span className="text-gold text-[10px] uppercase tracking-widest">The Essence of Lumière</span>
                        <div className="w-12 h-[1px] bg-gold/50 self-center" />
                    </div>
                </div>
            </section>




            {/* 4. 精选 */}
            <section className="py-32 px-6 max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-gold tracking-[0.4em] uppercase text-[10px] mb-4 block font-bold"
                        >
                            Selected Treasures
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-serif italic text-foreground">
                            The Butterfly <span className="not-italic">Overture</span>
                        </h2>
                    </div>
                    <Link
                        href={`/${locale}/shop`}
                        className="text-[10px] uppercase tracking-[0.2em] text-muted hover:text-gold transition-colors border-b border-muted/30 pb-1"
                    >
                        View Full Collection
                    </Link>
                </div>

                {/* 产品网格 - 使用你现有的 ProductCard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
                    {trendingProducts.length > 0 ? (
                        trendingProducts.map((product, idx) => (
                            <motion.div
                                key={product.productCode}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))
                    ) : (
                        // 骨架屏或占位符
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-card animate-pulse rounded-2xl" />
                        ))
                    )}
                </div>
            </section>

            {/* 5. 单品焦点 */}
            <section className="relative w-full h-[80vh] bg-card flex items-center overflow-hidden border-y border-border/20">
                <div className="absolute left-0 w-full md:w-1/2 h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2000" // 蝴蝶手链主图
                        alt="Hero Product"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="container mx-auto grid md:grid-cols-2 ">
                    <div className="md:col-start-2 p-12 md:p-24 space-y-8 bg-background/60 backdrop-blur-xl md:bg-transparent">
                        <h3 className="text-3xl md:text-5xl font-serif italic text-foreground leading-tight">
                            Crafted by Nature, <br/> Refined by Light.
                        </h3>
                        <p className="text-muted text-sm leading-relaxed max-w-sm font-light">
                            {t('singleP.content')}
                        </p>
                        <Link
                            href={`/${locale}/shop/butterfly-bracelet`}
                            className="inline-block bg-foreground text-background px-10 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] hover:bg-gold transition-all"
                        >
                            Discover Details
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}