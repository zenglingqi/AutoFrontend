'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";

export default function BlogSearchOverlay({ isOpen, onCloseAction, locale }: { isOpen: boolean, onCloseAction: () => void, locale: string }) {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<any[]>([]);

    // 监听输入并调用后端 search 接口
    useEffect(() => {
        if (keyword.length > 1) {
            const timer = setTimeout(async () => {
                const res = await clientAPIFrame(`/api/blog/search?lang=${locale}&keyword=${keyword}`); //
                const data = await res.json();
                if (data.code === 200) setResults(data.data);
            }, 300); // 防抖处理
            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [keyword, locale]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-md flex flex-col p-6 md:p-20"
                >
                    {/* 关闭按钮 */}
                    <button onClick={onCloseAction} className="absolute top-10 right-10 text-foreground hover:rotate-90 transition-transform duration-300">
                        <X size={32} strokeWidth={1} />
                    </button>

                    <div className="max-w-4xl mx-auto w-full mt-20">
                        {/* 搜索输入框 */}
                        <div className="relative border-b border-gold/20 pb-4 mb-12">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search our journal..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full bg-transparent text-3xl md:text-5xl font-serif text-foreground outline-none placeholder:text-muted/30"
                            />
                            <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gold" size={30} />
                        </div>

                        {/* 结果展示区 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto max-h-[60vh] custom-scrollbar pr-4">
                            {results.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/${locale}/blog/${post.slug}`}
                                    onClick={onCloseAction}
                                    className="group flex gap-6 items-start border-b border-border pb-6"
                                >
                                    <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-card">
                                        <Image src={post.mainImage} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" /> {/* */}
                                    </div>
                                    <div>
                                        <span className="text-gold text-[9px] tracking-widest uppercase mb-1 block">{post.categoryName}</span> {/* */}
                                        <h4 className="text-lg font-serif text-foreground leading-tight group-hover:text-gold transition-colors">{post.title}</h4> {/* */}
                                        <p className="text-muted text-xs line-clamp-1 mt-2 font-light">{post.excerpt}</p> {/* */}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {keyword && results.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-muted font-serif italic text-xl">No stories found for "{keyword}"</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}