
'use client';

import React, { useEffect, useState,use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import BlogSearchOverlay from "@/components/Blog/BlogSearchOverlay";
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";

interface Props {
    params: Promise<{ locale: string }>;
}

// 这里的接口请求逻辑应根据你的 API 实际地址进行调整
export default function BlogPage({ params }: Props ) {

    const { locale } = use( params); // 必须 await 才能拿到值



    const [featured, setFeatured] = useState<Record<string, any>>();
    const [posts, setPosts] = useState<Record<string, any>[]>([]);
    const [categories, setCategories] = useState<Record<string, any>[]>([]);
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [loading, setLoading] = useState(true);

    // 监听输入并调用后端 search 接口


    // 3. 初始加载：获取分类和精选文章
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catRes, featuredRes] = await Promise.all([
                    clientAPIFrame(`/api/blog/categories?lang=${locale}`),
                    clientAPIFrame(`/api/blog/featured?lang=${locale}`)
                ]);

                const catData = await catRes.json();
                const featuredData = await featuredRes.json();

                if (catData.code === 200) setCategories(catData.data);
                if (featuredData.code === 200) setFeatured(featuredData.data);
            } catch (error) {
                console.error("Failed to fetch initial blog data:", error);
            }
        };
        fetchInitialData();
    }, [locale]);

    // 4. 列表加载：监听分类变化，获取分页列表
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // 构建查询参数
                let url = `/api/blog/list?lang=${locale}&page=0&size=10`;
                if (activeCategory) {
                    url += `&categoryId=${activeCategory}`;
                }

                const res = await clientAPIFrame(url);
                const data = await res.json();

                if (data.code === 200) {
                    // 后端返回的是 Page 对象，数据在 content 字段中
                    setPosts(data.data.content);
                }
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [locale, activeCategory]);




    return (
        <main className="min-h-screen bg-background pt-32 pb-20 px-6">
            {/* 1. Header & Category Filter */}
            <header className="max-w-[1400px] mx-auto mb-20">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-gold tracking-[0.5em] uppercase text-[10px] mb-4 block font-medium"
                    >
                        The Journal
                    </motion.span>
                    <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight">
                        Stories of <span className="italic font-light text-foreground/80">Lumière</span>
                    </h1>
                </div>

                {/* 动态分类过滤器 */}
                <div className="flex flex-wrap justify-center gap-8 border-b border-border pb-6">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`text-[10px] tracking-[0.3em] uppercase transition-colors ${activeCategory === null ? 'text-gold' : 'text-muted hover:text-foreground'}`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`text-[10px] tracking-[0.3em] uppercase transition-colors ${activeCategory === cat.id ? 'text-gold' : 'text-muted hover:text-foreground'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </header>

            {/* 2. Featured Post - 杂志封面感 */}
            {featured && !activeCategory && (
                <section className="max-w-[1400px] mx-auto mb-32 group">
                    <Link href={`/${locale}/blog/${featured.slug}`} className="grid md:grid-cols-12 gap-12 items-center">
                        <div className="md:col-span-8 overflow-hidden bg-card">
                            <Image
                                src={featured.mainImage}
                                alt={featured.title}
                                width={1200} height={800}
                                className="object-cover aspect-[16/9] transition-transform duration-[3s] group-hover:scale-105"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <span className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4 block italic">{featured.categoryName}</span>
                            <h2 className="text-4xl font-serif text-foreground mb-6 leading-tight group-hover:text-gold transition-colors duration-500">
                                {featured.title}
                            </h2>
                            <p className="text-muted text-sm leading-relaxed mb-8 line-clamp-3 font-light">
                                {featured.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-foreground border-b border-foreground w-fit pb-1">
                                Read Story <ArrowUpRight size={12} />
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* 3. Journal Grid - 非对称瀑布流 */}
            <section className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-24 gap-x-12">
                {posts.map((post, idx) => (
                    <motion.div
                        key={post.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`${
                            idx % 3 === 0 ? 'md:col-span-7' :
                                idx % 3 === 1 ? 'md:col-span-5' : 'md:col-span-12 max-w-4xl mx-auto w-full'
                        }`}
                    >
                        <Link href={`/${locale}/blog/${post.slug}`} className="group block">
                            <div className="relative aspect-[4/5] mb-8 overflow-hidden bg-card shadow-sm">
                                <Image
                                    src={post.mainImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-background/90 backdrop-blur-sm px-4 py-1.5 text-[9px] tracking-[0.2em] uppercase text-foreground shadow-sm">
                                        {post.categoryName}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-serif text-foreground group-hover:text-gold transition-colors duration-500">
                                    {post.title}
                                </h3>
                                <p className="text-muted text-xs leading-relaxed line-clamp-2 max-w-md">
                                    {post.excerpt}
                                </p>
                                <div className="text-[9px] tracking-[0.2em] text-muted/50 uppercase italic">
                                    {new Date(post.createdAt).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US')}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </section>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="fixed bottom-10 right-10 z-50 w-16 h-16 bg-foreground/60
                text-background rounded-full flex items-center
                justify-center shadow-2xl hover:bg-gold transition-colors duration-500"
            >
                <Search size={24} />
            </motion.button>
            <BlogSearchOverlay
                isOpen={isSearchOpen}
                onCloseAction={() => setIsSearchOpen(false)}
                locale={locale}
            />
        </main>
    );
}