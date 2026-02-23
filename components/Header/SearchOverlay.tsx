'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight, Loader2 } from 'lucide-react'; // 引入 Loader2
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";
import SearchProductCard from "@/components/Header/SearchProductCard";
import { useLocale } from "next-intl"; // 修正引用名
import { useCurrency } from "@/components/Providers/CurrencyProvider";

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

export default function SearchOverlay({ isOpen, onCloseAction }: { isOpen: boolean, onCloseAction: () => void }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchProduct[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState(false); // 1. 定义 loading 变量

    const inputRef = useRef<HTMLInputElement>(null);
    const { selectedCurrency } = useCurrency();
    const currency = selectedCurrency.code;
    const lang = useLocale();

    // 加载历史
    useEffect(() => {
        const saved = localStorage.getItem('search_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    // 关闭/打开处理
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            setQuery('');
            setSuggestions([]);
            setLoading(false); // 关闭时重置状态
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // 实时搜索建议
    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            setLoading(false);
            return;
        }

        setLoading(true); // 2. 开始请求前设为 true
        const timer = setTimeout(async () => {
            try {
                const res = await clientAPIFrame(`/api/search/suggest?q=${encodeURIComponent(query)}&lang=${lang}&currency=${currency}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false); // 3. 请求结束（无论成功失败）设为 false
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, lang, currency]);

    const handleSearch = (q: string) => {
        if (!q.trim()) return;
        const newHistory = [q, ...history.filter(i => i !== q)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));
        // 实际跳转逻辑...
    };

    const handleChipClick = (item: string) => {
        setQuery(item);
        handleSearch(item);
    };

    const deleteHistory = (q: string) => {
        const newHistory = history.filter(i => i !== q);
        setHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));
    };

    // SearchOverlay.tsx

    useEffect(() => {
        if (isOpen) {
            // 记录当前滚动位置，防止 iOS 滚动穿透
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // 恢复滚动
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        return () => {
            document.body.style.position = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] bg-background backdrop-blur-xl animate-in fade-in duration-300">
            <div className="max-w-[800px] mx-auto pt-20 px-6">

                {/* 搜索框 */}
                <div className="relative group border-b-2 border-border focus-within:border-gold pb-4">
                    <Search className="absolute left-0 top-1 text-muted" size={24} strokeWidth={1.5} />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                        placeholder="SEARCH THE COLLECTION..."
                        className="w-full pl-10 text-2xl font-serif italic outline-none placeholder:text-muted/20"
                    />

                    {/* 4. 加载中状态显示 */}
                    <div className="absolute right-10 top-1">
                        {loading && <Loader2 size={20} className="animate-spin text-gold/50" />}
                    </div>

                    <button onClick={onCloseAction} className="absolute right-0 top-1 text-muted hover:text-foreground">
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="mt-12 space-y-12 h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar pr-4">
                    {/* 情况 A: 历史记录 (仅在没搜词时显示) */}
                    {query.length === 0 && history.length > 0 && (
                        <div className="animate-in slide-in-from-bottom-2 duration-500">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted font-black mb-6">Recent Searches</h3>
                            <div className="flex flex-wrap gap-3">
                                {history.map(item => (
                                    <div key={item} className="group flex items-center gap-2 bg-muted/5 border border-border/40 px-4 py-2 rounded-full hover:border-gold transition-all cursor-pointer">
                                        <span onClick={() => handleChipClick(item)} className="text-[11px] font-bold uppercase tracking-widest">{item}</span>
                                        <X size={12} className="text-muted/40 hover:text-gold" onClick={(e) => { e.stopPropagation(); deleteHistory(item); }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 情况 B: 有结果列表 */}
                    {query.length >= 2 && suggestions.length > 0 && (
                        <div className="space-y-4 animate-in fade-in">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] text-muted font-black">Suggestions</h3>
                            {suggestions.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSearch(item.name)}
                                    className="flex items-center justify-between py-3 border-b border-border/10 hover:pl-2 transition-all cursor-pointer group"
                                >
                                    <SearchProductCard product={item} locale={lang}/>
                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gold" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 情况 C: 没搜出结果 (且不在加载中) */}
                    {query.length >= 2 && suggestions.length === 0 && !loading && (
                        <div className="py-20 flex flex-col items-center justify-center animate-in fade-in">
                            <div className="mb-4 opacity-10">
                                <Search size={48} strokeWidth={1} />
                            </div>
                            <h3 className="text-lg font-serif italic mb-2 text-foreground/80">
                                No results for "{query}"
                            </h3>
                            <p className="text-[10px] text-muted tracking-widest uppercase">
                                Please try a different keyword or check spelling.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}