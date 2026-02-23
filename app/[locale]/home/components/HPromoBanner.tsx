export default function HPromoBanner() {
    return (
        <section className="relative bg-secondary py-16 lg:py-20 overflow-hidden">
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                    backgroundImage: `url('https://ext.same-assets.com/1832031263/2529125607.png')`,
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Left - Discount */}
                    <div className="lg:w-1/4 text-center lg:text-left">
                        <div className="text-white">
                            <span className="text-6xl lg:text-8xl font-bold">20%</span>
                            <p className="text-xl uppercase tracking-wider">OFF</p>
                        </div>
                    </div>

                    {/* Center - Text */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                            Sweet Savings: Enjoy 20% Off on All Cosmetic Product - Limited Time Offer!
                        </h2>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 bg-white text-secondary px-6 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
                        >
                            More About Us
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>

                    {/* Right - Product Images */}
                    <div className="lg:w-1/4 hidden lg:block">
                        <img
                            src="https://ext.same-assets.com/1832031263/1822711672.png"
                            alt="Cosmetic Products"
                            className="max-w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
