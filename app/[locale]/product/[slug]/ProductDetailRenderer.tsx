'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';


interface Block {
    type: 'heading' | 'text' | 'image_parallax' | 'quote' |'accent_paragraph' | 'image_grid' | 'comparison_table' | 'video_block' | 'spacer';
    data: any;
}

interface ContentRendererProps {
    content: string;
    relatedProducts?: any[]; // 从父组件传下来的完整商品列表
}

export default function ProductDetailRenderer({ content, relatedProducts = [] }: ContentRendererProps) {
    const blocks: Block[] = React.useMemo(() => {
        if (!content || content === "{}") return []; // 增加对 "{}" 的判断
        try {

            const parsed = JSON.parse(content);
            // 核心防御：只有当解析结果是数组时才返回，否则返回空数组
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse blog content JSON", e);
            return [];
        }
    }, [content]);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: {
            duration: 0.8,
            ease: "easeOut"
        } as const // 关键修复：强制转换为常量类型
    };

    return (
        <div className="w-full space-y-12">
            {blocks.map((block, index) => (
                <motion.section key={index} {...fadeIn} className="w-full">
                    {renderBlock(block, relatedProducts)}
                </motion.section>
            ))}
        </div>
    );
}

function renderBlock(block: Block, relatedProducts: any[]) {
    switch (block.type) {
        case 'heading':
            return (
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mt-16 mb-8 tracking-tight">
                    {block.data}
                </h2>
            );

        case 'text':
            return (
                <div className="prose prose-lg max-w-none">
                    {block.data.split('\n').map((p: string, i: number) => (
                        <p key={i} className="text-foreground/80 leading-relaxed mb-6 font-light">
                            {p}
                        </p>
                    ))}
                </div>
            );

        case 'image_parallax':
            return (
                <div className="relative aspect-[16/10] md:aspect-[21/9] w-full overflow-hidden rounded-sm my-12 group">
                    <Image
                        src={block.data}
                        alt="Article Visual"
                        fill
                        className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                        sizes="100vw"
                    />
                </div>
            );

        case 'quote':
            return (
                <div className="relative py-12 px-8 my-12 border-y border-border/50 text-center">
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-gold/20 text-6xl font-serif">“</span>
                    <p className="text-2xl md:text-3xl font-serif italic text-gold leading-snug">
                        {block.data}
                    </p>
                </div>
            );



        case 'accent_paragraph':
            // 带有金色首字母的首段，提升高级感
            return (
                <div className="relative pl-8 border-l-2 border-gold/30 my-8">
                    <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed italic">
                        {block.data}
                    </p>
                </div>
            );

        case 'image_grid':
            // 双图并排，适合展示工艺细节对比
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
                    {block.data.map((img: string, i: number) => (
                        <div key={i} className="relative aspect-square overflow-hidden bg-card">
                            <Image
                                src={img}
                                alt="Detail view"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                    ))}
                </div>
            );

        case 'comparison_table':
            // 专业深度体现：产区或参数对比表
            const { columns, rows } = block.data;
            return (
                <div className="my-16 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-gold/20">
                            {columns.map((col: string, i: number) => (
                                <th key={i} className="py-4 px-2 text-[10px] tracking-widest uppercase text-gold font-medium">
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                        {rows.map((row: any[], i: number) => (
                            <tr key={i} className="group hover:bg-gold/[0.02] transition-colors">
                                {row.map((cell: string, j: number) => (
                                    <td key={j} className="py-6 px-2 text-sm font-light text-foreground/80">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            );

        case 'video_block':
            return (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm my-16 bg-card">
                    <video
                        src={block.data}
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover opacity-80"
                    />
                    {/* 柔和的遮罩，确保符合暗色主题 */}
                    <div className="absolute inset-0 bg-background/10 mix-blend-multiply" />
                </div>
            );

        case 'spacer':
            // 灵活控制区块间的留白，高度由 block.data 决定 (如 "h-24")
            return <div className={block.data} />;

        default:
            return null;
    }
}