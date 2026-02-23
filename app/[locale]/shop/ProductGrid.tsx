'use client';

import { useEffect, useState, useRef } from 'react';
import { useCurrency } from "@/components/Providers/CurrencyProvider";
import ProductCard from "../../../components/shop/ProductCard";
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame"; // 假设你已有该组件

export default function ProductGrid({ initialFilters }: { initialFilters: any }) {
    const { selectedCurrency } = useCurrency();
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isLast, setIsLast] = useState(false);
    const loaderRef = useRef(null);

    const fetchProducts = async (pageNum: number, isNewSearch: boolean = false) => {
        // 如果已经确定是最后一页，且不是新搜索，直接拦截
        if (isLast && !isNewSearch) return;

        setLoading(true);
        try {
            const query = new URLSearchParams({
                lang: initialFilters.lang,
                currency: selectedCurrency.code,
                category: initialFilters.category || '',
                brands: initialFilters.brands || '',
                keyword: initialFilters.keyword || '',
                page: pageNum.toString(),
                size: '9'
            });

            const res = await clientAPIFrame(`/api/products?${query.toString()}`);

            // 处理异常状态（如 404）
            if (!res.ok) {
                setIsLast(true); // 出错后停止继续滚动加载
                return;
            }

            const data = await res.json();

            // 这里的 data.content 可能是空数组，或者是 null
            const newProducts = data.content || [];

            setProducts(prev => isNewSearch ? newProducts : [...prev, ...newProducts]);

            // 关键：后端返回的 last 标志位
            setIsLast(data.last === true || newProducts.length === 0);

        } catch (err) {
            console.error("Fetch products error:", err);
            setIsLast(true); // 发生网络错误时也停止监听
        } finally {
            setLoading(false);
        }
    };

    // 当筛选条件变化时重置
    useEffect(() => {
        setPage(1);
        fetchProducts(1, true);
    }, [initialFilters, selectedCurrency]);

    // 监听滚动到底部
    // @/components/Product/ProductGrid.tsx

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];

            // 核心修正：只有当：
            // 1. 元素进入视口
            // 2. 当前不在加载中
            // 3. 确定还有下一页 (isLast 为 false)
            // 4. products 数组不为空（防止初始化瞬间触发）
            if (target.isIntersecting && !loading && !isLast && products.length > 0) {
                console.log("Triggering next page:", page + 1);
                const nextPage = page + 1;
                setPage(nextPage);
                fetchProducts(nextPage);
            }
        }, {
            threshold: 0.1, // 只要露出一丁点就触发
            rootMargin: '100px' // 提前 100px 加载，用户感官更丝滑
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [loading, isLast, page, products.length]); // 必须包含这些依赖项

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {products.map((product, idx) => (
                    <ProductCard key={`${product.productCode}-${idx}`} product={product} />
                ))}
            </div>

            {/* 底部加载指示器 */}
            <div ref={loaderRef} className="py-20 flex justify-center">
                {loading && (
                    <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                )}
                {isLast && products.length > 0 && (
                    <p className="text-[10px] uppercase tracking-widest text-muted font-bold">End of Collection</p>
                )}
            </div>
        </div>
    );
}