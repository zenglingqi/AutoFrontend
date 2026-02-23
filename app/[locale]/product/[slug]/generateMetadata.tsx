// @/app/[locale]/product/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string, locale: string } }): Promise<Metadata> {
    const { slug, locale } = params;
    // 假设这是获取数据的 API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}?lang=${locale}&currency=USD`);
    const product = await res.json();

    return {
        title: product.seoTitle,
        description: product.seoDescription,
        keywords: product.seoKeywords,
        openGraph: {
            title: product.ogTitle,
            description: product.ogDescription,
            images: [{ url: product.ogImage }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.ogTitle,
            description: product.ogDescription,
            images: [product.ogImage],
        },
    };
}