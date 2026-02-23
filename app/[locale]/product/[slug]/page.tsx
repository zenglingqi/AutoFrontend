// @/app/[locale]/product/[slug]/page.tsx
import { Suspense } from 'react';
import ProductDetail from "./ProductDetail";
import { ProductDetailData } from "@/types/product";
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import {serverAPIFrame} from "@/app/api/frameAPI/serverAPIFrame";
import { cookies } from 'next/headers'; // 必须从 next/headers 导入

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export default async function ProductPage({ params }: Props) {
    const { slug, locale } = await params;
    const cookieStore = await cookies();
    const currencyCode = cookieStore.get('user_currency')?.value || 'USD'; // 默认 USD

    try {

        const res=await  serverAPIFrame(
            `/api/products/${slug}?lang=${locale}&currency=${currencyCode}`,
            { next: { revalidate: 3600 } });

        if (!res.ok) return <ProductNotFound locale={locale} />;

        const product: ProductDetailData = await res.json();

        return (
            <main className="min-h-screen bg-background pt-24 pb-12">
                <Suspense fallback={<ProductLoader />}>
                    <ProductDetail product={product} />
                </Suspense>
            </main>
        );
    } catch (error) {
        return <ProductNotFound locale={locale} />;
    }
}

// 优雅的“未找到”状态组件
function ProductNotFound({ locale }: { locale: string }) {
    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="relative inline-block">
                    <ShoppingBag size={80} strokeWidth={0.5} className="text-gold opacity-20 mx-auto" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.3em] font-black text-gold">
                        Lost
                    </span>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-serif italic text-foreground">Piece Not Found</h1>
                    <p className="text-muted text-xs uppercase tracking-widest leading-loose">
                        The exquisite piece you are looking for might have been moved or is currently unavailable in our sanctuary.
                    </p>
                </div>

                <Link
                    href={`/${locale}/shop`}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gold transition-all group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Collection
                </Link>
            </div>
        </main>
    );
}

// 骨架屏加载状态（可选）
function ProductLoader() {
    return (
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse p-6">
            <div className="lg:col-span-7 aspect-[4/5] bg-card rounded-[2.5rem]" />
            <div className="lg:col-span-5 space-y-8 pt-10">
                <div className="h-4 w-24 bg-card rounded" />
                <div className="h-12 w-full bg-card rounded" />
                <div className="h-20 w-full bg-card rounded" />
            </div>
        </div>
    );
}