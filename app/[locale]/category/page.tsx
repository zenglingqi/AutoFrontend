


import { Metadata } from 'next';
import ProductGrid from '@/components/Category/ProductGrid';
import FilterSidebar from '@/components/Category/FilterSidebar';


import { setRequestLocale } from 'next-intl/server';
import {use} from "react"; // 导入这个


interface Props {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 2. 将 any 替换为刚才定义的 Props
export default function CategoryPage({ params, searchParams }: Props) {
    //const { locale } = await params;
    const { locale } = use( params); // 必须 await 才能拿到值

    setRequestLocale(locale);
    //const filters = await searchParams;
    const filters = use(searchParams);


    return (
        <main className="min-h-screen bg-background pt-24 pb-20">

            <div className="container mx-auto px-4 lg:px-8">
                {/* 页面标题区 */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-serif italic mb-4 uppercase tracking-widest">
                        {filters.keyword ? `Search: ${filters.keyword}` : (filters.category || 'All Collections')}
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* 侧边栏筛选：传入初始数据 */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <FilterSidebar locale={locale} />
                    </aside>

                    {/* 商品展示区：处理无限加载 */}
                    <section className="flex-2 min-h-[800px]">
                        <ProductGrid
                            initialFilters={{
                                lang: locale,
                                category: filters.category || '',
                                brands: filters.brands || '',
                                keyword: filters.keyword || '',
                                page: 1
                            }}
                        />
                    </section>
                </div>
            </div>

        </main>
    );
}

