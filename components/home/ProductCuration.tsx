// components/home/ProductCuration.tsx
import ProductCard from "@/components/shop/ProductCard";

export default function ProductCuration({ products, title }: { products: any[], title: string }) {
    return (
        <section className="py-32 bg-background">
            <div className="max-w-[1400px] mx-auto px-6">
                <header className="flex justify-between items-end mb-16">
                    <div>
                        <span className="text-gold tracking-[0.4em] uppercase text-[10px] block mb-2">Curated</span>
                        <h2 className="text-4xl font-serif italic text-foreground">{title}</h2>
                    </div>
                    <button className="text-[10px] uppercase tracking-widest border-b border-border pb-1 hover:text-gold transition-colors">
                        Explore All
                    </button>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.productCode} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}