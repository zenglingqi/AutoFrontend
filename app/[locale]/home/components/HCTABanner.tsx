import Link from "next/link";

export default function HCTABanner() {
    return (
        <section className="relative py-20 lg:py-28 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('https://ext.same-assets.com/1832031263/650731246.png')`,
                }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 text-secondary" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                        Explore Our Full Range of Products and Perfect Cosmetic Combos!
                    </h2>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-white text-secondary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
                    >
                        Shop Now
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
