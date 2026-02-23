'use client';

import React from 'react';
import { Home, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from "next/link";

export default function RootNotFound() {
    return (
        <html lang="en">
        <body className="bg-[#FAF9F6] text-[#2D2926] antialiased">
        <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
            {/* 背景装饰底纹 - Maison Lumière */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <h1 className="text-[25vw] font-serif font-bold whitespace-nowrap tracking-tighter">
                    LUMIÈRE
                </h1>
            </div>

            <div className="relative z-10 max-w-3xl w-full text-center">
                {/* 404 状态标识 */}
                <div className="mb-8 flex items-center justify-center gap-4">
                    <span className="w-8 h-[1px] bg-[#8C7E6D]/30" />
                    <span className="text-[#8C7E6D] tracking-[0.5em] uppercase text-[10px] font-medium">
                                Error 404
                            </span>
                    <span className="w-8 h-[1px] bg-[#8C7E6D]/30" />
                </div>

                {/* 多语言标题展示国际化感 */}
                <div className="space-y-2 mb-10">
                    <h1 className="text-4xl md:text-6xl font-serif leading-tight">
                        Page Not Found
                    </h1>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[#8C7E6D] font-serif italic text-lg md:text-xl opacity-80">
                        <span>页面未找到</span>
                        <span className="text-[#8C7E6D]/30 italic font-sans not-italic mx-1">•</span>
                        <span>Page non trouvée</span>
                        <span className="text-[#8C7E6D]/30 italic font-sans not-italic mx-1">•</span>
                        <span>페이지를 찾을 수 없습니다</span>
                        <span className="text-[#8C7E6D]/30 italic font-sans not-italic mx-1">•</span>
                        Страница није пронађена
                        <span className="text-[#8C7E6D]/30 italic font-sans not-italic mx-1">•</span>
                        Az oldal nem található
                        <span className="text-[#8C7E6D]/30 italic font-sans not-italic mx-1">•</span>
                        Página não encontrada

                    </div>
                </div>

                {/* 品牌风格分割线 */}
                <div className="w-16 h-[1px] bg-[#8C7E6D] mx-auto mb-10 opacity-40" />

                {/* 提示信息 */}
                <p className="text-[#2D2926]/60 font-light leading-relaxed mb-12 max-w-lg mx-auto text-sm md:text-base">
                    The requested collection or story could not be located in our archives.
                    Explore our latest artisanal creations or return to the main hall.
                </p>

                {/* 交互按钮区 */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
                    <Link
                        href="/"
                        className="group flex items-center gap-3 px-10 py-4 bg-[#2D2926] text-[#FAF9F6] text-[10px] tracking-[0.3em] uppercase hover:bg-[#8C7E6D] transition-all duration-500 w-full sm:w-auto justify-center rounded-sm"
                    >
                        <Home size={14} strokeWidth={1.5} />
                        <span>Home </span>
                    </Link>

                    <Link
                        href="/shop"
                        className="group flex items-center gap-3 px-10 py-4 border border-[#2D2926]/10 text-[#2D2926] text-[10px] tracking-[0.3em] uppercase hover:border-[#8C7E6D] hover:text-[#8C7E6D] transition-all duration-500 w-full sm:w-auto justify-center rounded-sm"
                    >
                        <ShoppingBag size={14} strokeWidth={1.5} />
                        <span>Shop </span>
                        <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* 底部装饰文案 */}
            <div className="absolute bottom-12 left-0 w-full text-center">
                <p className="text-[9px] tracking-[0.5em] text-[#8C7E6D]/50 uppercase font-light">
                    Maison Lumière • Global Artisanal Jewelry
                </p>
            </div>
        </main>
        </body>
        </html>
    );
}