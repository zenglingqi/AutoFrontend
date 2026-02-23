'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface BlogShortVO {
    id: number;
    slug: string;
    mainImage: string;
    createdAt: string;
    title: string;
    excerpt?: string;
}

export default function BlogCard({ post, lang }: { post: BlogShortVO, lang: string }) {
    if (!post) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col h-full bg-card rounded-sm overflow-hidden transition-all duration-500 border border-border/40 hover:border-gold/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        >
            {/* 图片容器 */}
            <Link href={`/${lang}/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-foreground/5">
                <Image
                    src={post.mainImage || '/placeholder-blog.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* 悬停时的遮罩 */}
                <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>

            {/* 内容区域 */}
            <div className="flex flex-col flex-grow p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4 text-[10px] tracking-[0.2em] text-gold font-medium uppercase">
                    <span>{new Date(post.createdAt).toLocaleDateString(lang, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <Link href={`/${lang}/blog/${post.slug}`}>
                    <h3 className="text-xl md:text-2xl font-serif text-foreground leading-snug mb-4 group-hover:text-gold transition-colors duration-300 line-clamp-2">
                        {post.title}
                    </h3>
                </Link>

                {post.excerpt && (
                    <p className="text-sm text-muted line-clamp-2 mb-6 font-light leading-relaxed">
                        {post.excerpt}
                    </p>
                )}

                {/* 底部交互 */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-border/30">
                    <Link
                        href={`/${lang}/blog/${post.slug}`}
                        className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold text-foreground group/btn"
                    >
                        READ MORE
                        <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1 text-gold" />
                    </Link>
                </div>
            </div>

            {/* 品牌装饰条 */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gold group-hover:w-full transition-all duration-700" />
        </motion.div>
    );
}