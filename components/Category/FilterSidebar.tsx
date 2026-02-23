'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Search, X } from 'lucide-react';
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame"; // 引入图标库

export default function FilterSidebar({ locale }: { locale: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lang = useLocale();

    // 1. 状态管理
    const [categoryWords, setCategoryWords] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState(searchParams.get('keyword') || '');

    // 2. 数据获取
    useEffect(() => {
        async function fetchCategoryWords() {
            try {
                const res = await clientAPIFrame(`/api/categories/words/${lang}`);
                if (!res || !res.ok) {
                    // 如果响应为空或者 HTTP 状态码不是 2xx
                    console.error('Request failed:', res);
                    return; // 或者根据需求抛出异常
                }

                const data = await res.json();
                setCategoryWords(data);
            } catch (e) { console.error("Fetch categories failed", e); }
        }
        fetchCategoryWords();
    }, [lang]);

    useEffect(() => {
        async function fetchBrands() {
            try {
                const res = await clientAPIFrame("/api/categories/brands");
                if (!res || !res.ok) {
                    // 如果响应为空或者 HTTP 状态码不是 2xx
                    console.error('Request failed:', res);
                    return; // 或者根据需求抛出异常
                }

                const data = await res.json();
                setBrands(data);
            } catch (e) { console.error("Fetch brands failed", e); }
        }
        fetchBrands();
    }, []);

    // 3. 核心筛选逻辑：更新 URL 参数
    const handleFilterChange = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // 每次筛选变动重置为第一页
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // 4. 搜索框提交逻辑
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('keyword', keywordInput);
    };

    return (
        <div className="space-y-12">
            {/* --- 关键词搜索框 (New) --- */}
            <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest mb-6">Search</h4>
                <form onSubmit={handleSearchSubmit} className="relative group">
                    <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Search jewelry..."
                        className="w-full bg-transparent border-b border-border/60 py-2 pr-8 text-[12px] uppercase tracking-tighter outline-none focus:border-gold transition-colors placeholder:text-muted/50"
                    />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {keywordInput && (
                            <button
                                type="button"
                                onClick={() => { setKeywordInput(''); handleFilterChange('keyword', null); }}
                                className="text-muted hover:text-foreground"
                            >
                                <X size={14} />
                            </button>
                        )}
                        <button type="submit" className="text-muted group-hover:text-gold transition-colors">
                            <Search size={16} strokeWidth={1.5} />
                        </button>
                    </div>
                </form>
            </div>

            {/* --- 分类筛选 --- */}
            <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest mb-6">Collections</h4>
                <div className="flex flex-col gap-3">
                    {/* 添加 "All" 选项以便清除分类 */}
                    <button
                        onClick={() => handleFilterChange('category', null)}
                        className={`text-[12px] text-left uppercase tracking-tighter hover:text-gold transition-colors ${!searchParams.get('category') ? 'text-gold font-bold' : 'text-muted'}`}
                    >
                        All Collections
                    </button>
                    {categoryWords.map(word => (
                        <button
                            key={word}
                            onClick={() => handleFilterChange('category', word)}
                            className={`text-[12px] text-left uppercase tracking-tighter hover:text-gold transition-colors ${searchParams.get('category') === word ? 'text-gold font-bold' : 'text-muted'}`}
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- 品牌筛选 --- */}
            <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest mb-6">Brands</h4>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleFilterChange('brands', null)}
                        className={`text-[12px] text-left uppercase tracking-tighter hover:text-gold transition-colors ${!searchParams.get('brands') ? 'text-gold font-bold' : 'text-muted'}`}
                    >
                        All Brands
                    </button>
                    {brands.map(brand => (
                        <button
                            key={brand}
                            onClick={() => handleFilterChange('brands', brand)}
                            className={`text-[12px] text-left uppercase tracking-tighter hover:text-gold transition-colors ${searchParams.get('brands') === brand ? 'text-gold font-bold' : 'text-muted'}`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}