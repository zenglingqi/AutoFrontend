const products = [
    {
        id: 1,
        name: 'Gold-Plated Couple Ring',
        price: '$21.00',
        image: 'https://www.ainostore.com/uploads/products/common/e84870c9-8611-4313-961c-d2a5351578af.jpg',
        url: 'https://www.ainostore.com/product/1'
    },
    {
        id: 2,
        name: 'Rose Gold-Plated Geometric Circle Bracelet',
        price: '$23.00',
        image: 'https://www.ainostore.com/uploads/products/common/ae8160b7-96c0-41f1-83cb-2f2235096b48.jpg',
        url: 'https://www.ainostore.com/product/2'
    },

    {
        id: 3,
        name: 'Crystal earrings',
        price: '$16.00',
        image: 'https://www.ainostore.com/uploads/products/common/949ba5b8-9621-4580-9c5e-f4c026e0afeb.jpg',
        url: 'https://www.ainostore.com/product/11'
    },

    {
        id: 4,
        name: 'Handmade ceramic decorative items series',
        price: '$37.00',
        image: 'https://www.ainostore.com//uploads/products/common/85628219-68ea-4352-98db-4c51534e8038.png',
        url: 'https://www.ainostore.com/product/9'
    },
    {
        id: 5,
        name: 'Fashion Two-Tone Leather Tote Bag',
        price: '$ 35.00',
        image: 'https://www.ainostore.com/uploads/products/common/2b277876-624a-4b0c-a0a3-a34ade739053.png',
        url: 'https://www.ainostore.com/product/8'
    },

];

export default function HTopProducts() {
    return (
        <section id="shop" className="py-16 lg:py-24 bg-gray-300 dark:bg-gray-800">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="font-rumraisin  text-lg mb-2">Shop</p>
                    <h2 className="text-3xl lg:text-4xl font-bold  flex items-center justify-center gap-3">
                        <span className="w-2 h-2  rounded-full" />
                        Our Top Selling Product
                        <span className="w-2 h-2  rounded-full" />
                    </h2>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <a href={product.url}>


                        <div
                            key={product.id}
                            className="group bg-white dark:bg-gray-900 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className="relative overflow-hidden bg-cream-light p-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Wishlist Button */}
                                <button
                                    className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    type="button"
                                >
                                    <svg className="w-4 h-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-semibold text-secondary mb-2 group-hover:text-gray-500 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-gray-700 font-bold mb-3">{product.price}</p>
                                <a
                                    href={product.url}
                                    className="inline-block text-sm font-medium text-secondary hover:text-gray-500 transition-colors border-b-2 border-secondary hover:border-primary pb-1"
                                >
                                    Order Now
                                </a>
                            </div>
                        </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
