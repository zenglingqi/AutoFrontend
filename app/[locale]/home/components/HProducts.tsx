const products = [
    { id: 1, name: 'Dry Shampoo', price: '$37.00', image: 'https://ext.same-assets.com/1832031263/3637268924.png' },
    { id: 2, name: 'Velora Shampoo', price: '$23.00', image: 'https://ext.same-assets.com/1832031263/202622520.png' },
    { id: 3, name: 'Eterna Shampoo', price: '$69.00', image: 'https://ext.same-assets.com/1832031263/1367968164.png' },
    { id: 4, name: 'Nude Latte', price: '$73.00', image: 'https://ext.same-assets.com/1832031263/1057142081.png' },
    { id: 5, name: 'Pink Pop', price: '$8.00', image: 'https://ext.same-assets.com/1832031263/2229079556.png' },
    { id: 6, name: 'Winter Breeze', price: '$39.00', image: 'https://ext.same-assets.com/1832031263/3149045222.png' },
    { id: 7, name: 'Velvet Bloom', price: '$10.00', image: 'https://ext.same-assets.com/1832031263/4128322580.png' },
    { id: 8, name: 'LumiSkin Glow Serum', price: '$85.00', image: 'https://ext.same-assets.com/1832031263/2571673597.png' },
    { id: 9, name: 'SilkMist Hydrating Spray', price: '$88.00', image: 'https://ext.same-assets.com/1832031263/2510741175.png' },
    { id: 10, name: 'Flora Glow Blush', price: '$32.00', image: 'https://ext.same-assets.com/1832031263/3696131544.png' },
];

export default function HProducts() {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="font-rumraisin text-primary text-lg mb-2">Shop</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-secondary flex items-center justify-center gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Our Products
                        <span className="w-2 h-2 bg-primary rounded-full" />
                    </h2>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-b from-cream to-white p-4 aspect-square">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Quick Actions */}
                                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors"
                                        type="button"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                    <button
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors"
                                        type="button"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-3 text-center">
                                <h3 className="font-medium text-secondary text-sm mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-primary font-bold text-sm mb-2">{product.price}</p>
                                <a
                                    href="#"
                                    className="inline-block text-xs font-medium text-secondary hover:text-primary transition-colors border-b border-secondary hover:border-primary pb-0.5"
                                >
                                    Order Now
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
