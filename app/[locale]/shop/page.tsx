import { Metadata } from 'next';
import ProductGrid from './ProductGrid';
import FilterSidebar from './FilterSidebar';

// 1. 定义符合 Next.js 15 规范的接口
interface Props {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{
        category?: string;
        keyword?: string;
        [key: string]: string | string[] | undefined
    }>;
}

// 2. 在 generateMetadata 中使用该接口
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { category, keyword } = await searchParams; // 必须 await
    return {
        title: `${category || keyword || 'Collection'} | Your Luxury Jewelry`,
        description: `Explore our exclusive ${category || 'jewelry'} collection. Handcrafted elegance.`,
    };
}

// 3. 在页面组件中使用该接口，并移除 any
export default async function CategoryPage({ params, searchParams }: Props) {
    const { locale } = await params;      // 正确：已 await
    const filters = await searchParams;   // 正确：已 await

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
                    <section className="flex-2">
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