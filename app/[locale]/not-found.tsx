// app/[locale]/not-found.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';

export default function GlobalNotFound() {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
            {/* 品牌装饰底纹 */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <h1 className="text-[30vw] font-serif font-bold whitespace-nowrap">MAISON LUMIÈRE</h1>
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-gold tracking-[0.6em] uppercase text-xs mb-6 block font-medium">
                        Error Code 404
                    </span>

                    <h1 className="text-5xl md:text-8xl font-serif text-foreground mb-8 leading-none tracking-tighter">
                        Lost in <br /><span className="italic font-light">Elegance</span>
                    </h1>

                    <div className="w-12 h-[1px] bg-gold mx-auto mb-10"></div>

                    <p className="text-foreground/60 font-light leading-relaxed mb-12 max-w-md mx-auto text-sm md:text-base">
                        您请求的页面如同过季的华服，已不在当前的陈列之中。
                        请允许我们引导您回到 Maison Lumière 的核心地带。
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-8 py-4 bg-foreground text-background text-xs tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-500 w-full md:w-auto justify-center"
                        >
                            <Home size={14} />
                            返回主页
                        </Link>

                        <Link
                            href="/shop"
                            className="flex items-center gap-3 px-8 py-4 border border-border text-foreground text-xs tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-all duration-500 w-full md:w-auto justify-center group"
                        >
                            探索作品集-iner 404
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* 底部装饰 */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] text-muted uppercase">
                Artisanal Jewelry • Timeless Design
            </div>
        </main>
    );
}