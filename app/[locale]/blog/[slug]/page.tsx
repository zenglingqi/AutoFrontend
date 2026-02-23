

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from "next/headers";
import Script from 'next/script';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import ContentRenderer from './ContentRenderer';
import HeaderProgress from './HeaderProgress';
import BlogCard from "./BlogCard";
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";


interface Props {
    params: Promise<{ slug: string; locale: string }>;
}



async function getBlogData(slug: string,locale: string) {


    const cookieStore = await cookies();
    const currencyCode = cookieStore.get('user_currency')?.value || 'USD';
    //const lang=cookieStore.get('NEXT_LOCALE')?.value || 'en';
    const res = await clientAPIFrame(
        `/api/blog/detail/${slug}?lang=${locale}&currency=${currencyCode}`,
        { cache: 'no-store' }
    );

    // 处理 500 或 404 错误
    if (!res.ok) return null;

    const result = await res.json();

    // 处理业务逻辑错误 (例如 code: 404 或 Article not found)
    if (result.code !== 200 || !result.data) return null;

    return result.data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {

    const { locale, slug } = await params;

    const data = await getBlogData(slug, locale);
    if (!data) return { title: 'Article Not Found' };

    return {
        title: data.metaTitle || data.title,
        description: data.metaDescription || data.excerpt,
        openGraph: {
            images: [data.ogImage || data.mainImage],
            title: data.title,
        },
    };
}

export default async function BlogPage({ params }: Props) {

    const { locale, slug } = await params;

    setRequestLocale(locale);

    const data = await getBlogData(slug, locale);
    // 如果接口报错或数据不存在，直接触发 Next.js 404 页面
    if (!data) {
        notFound();
    }

    // 状态 B: 文章不存在，但有推荐内容 (根据你提供的 JSON 结构判断)

    if (!data.title) {
        return (
            <div className="min-h-screen bg-background pt-96 pb-20 px-6">
                <HeaderProgress />
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">Story Not Found</h1>
                    <p className="text-gold tracking-[0.2em] uppercase text-sm mb-16">
                        The requested collection or article could not be located.
                    </p>

                    <div className="border-t border-border/96 pt-16">
                        <h3 className="text-2xl font-serif italic mb-12">Discover Our Latest Collections</h3>
                        <div className="grid md:grid-cols-3 gap-10 text-left">
                            {data.relatedPosts?.map((post: any) => (
                                <BlogCard key={post.id} post={post} lang={locale} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-background text-foreground pb-20">
            <HeaderProgress />

            {/* 顶级 SEO: JSON-LD */}
            {data.jsonLd && (
                <Script
                    id="blog-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(data.jsonLd) }}
                />
            )}

            {/* Hero 区域 - 视觉对齐品牌色 */}
            <header className="w-full h-[60vh] md:h-[75vh] relative overflow-hidden bg-foreground">
                <Image
                    src={data.mainImage}
                    alt={data.imageAlt || data.title}
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center px-4">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-7xl font-serif mb-6 text-background drop-shadow-sm">
                            {data.title}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-background/80 uppercase tracking-[0.2em] text-xs md:text-sm">
                            <span className="w-8 h-[1px] bg-gold" />
                            {new Date(data.createdAt).toLocaleDateString(locale, {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                            <span className="w-8 h-[1px] bg-gold" />
                        </div>
                    </div>
                </div>
            </header>

            {/* 内容容器 */}
            <main className="max-w-4xl mx-auto px-6 -mt-10 relative z-30 bg-background pt-10 shadow-sm">


                {/* 导语/摘要 - 使用 gold 品牌色修饰 */}
                {data.excerpt && (
                    <p className="text-xl md:text-2xl font-serif italic text-gold/90 mb-12 leading-relaxed border-l-2 border-gold/30 pl-6">
                        {data.excerpt}
                    </p>
                )}

                {/* 动态区块渲染器 - 传入关联商品数据供内容内展示 */}
                {data.content && <ContentRenderer content={data.content} relatedProducts={data.relatedProducts} />}

                {/* 文章底部的关联商品区 (闭环转化) */}
                {data.relatedProducts && data.relatedProducts.length > 0 && (
                    <section className="mt-24 pt-16 border-t border-border">
                        <h3 className="text-sm tracking-[0.3em] uppercase text-gold mb-12 text-center">Featured Collection</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {/* 此处可复用你的 ProductCard 组件 */}
                            {data.relatedProducts.map((product: any) => (
                                <div key={product.productCode} className="group cursor-pointer">
                                    <div className="aspect-[3/4] relative overflow-hidden mb-4 bg-card">
                                        <img src={product.mainImage} alt={product.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <h4 className="text-sm font-serif">{product.name}</h4>
                                    <p className="text-xs text-gold mt-1">{product.currencyCode} {product.minPrice}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* 相关阅读推荐 */}
            {data.relatedPosts && data.relatedPosts.length > 0 && (
                <section className="bg-card/30 py-24 mt-24">
                    <div className="max-w-6xl mx-auto px-6">
                        <h3 className="text-2xl font-serif mb-12 text-center italic">More from Maison Lumière</h3>
                        <div className="grid md:grid-cols-3 gap-10">
                            {data.relatedPosts.map((post: any) => (
                                <BlogCard key={post.id} post={post} lang={locale} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
}