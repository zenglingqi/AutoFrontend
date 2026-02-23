import { useState, useEffect } from 'react';

const slides = [
    {
        id: 1,
        product: 'Fashion Two-Tone Leather Tote Bag',
        price: '$ 35.00',
        image: '/Home/model-bag.png',
        modelImage: '/Home/watch-big.png',
        url: 'https://www.ainostore.com/product/8'
    },
    {
        id: 2,
        product: 'Santa Claus and Hat Earrings',
        price: '$17.00',
        image: 'https://www.ainostore.com/uploads/products/common/4cfc7e62-faa1-494b-bd34-bf571f83428f.png',
        modelImage: 'https://www.ainostore.com/uploads/products/common/0e443206-6a19-4e33-98fd-9eefa7cac5d1.png',
        url: 'https://www.ainostore.com/product/6'
    },
    {
        id: 3,
        product: 'Fashion Two-Tone Leather Tote Bag',
        price: '$ 35.00',
        image: '/Home/model-bag.png',
        modelImage: '/Home/watch-big.png',
        url: 'https://www.ainostore.com/product/8'
    },
];

export default function HHero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative bg-cream-light overflow-hidden">
            <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[600px]">
                {/* Left Side - Product Info */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start p-8 lg:p-16 relative">
                    {/* Decorative leaf */}
                    <div className="absolute top-10 left-10 opacity-20">
                        <svg className="w-24 h-24 " viewBox="0 0 100 100" fill="currentColor">
                            <path d="M50 5C30 5 15 20 10 40C5 60 15 80 35 90C55 100 75 90 85 70C95 50 85 25 65 15C55 10 50 5 50 5Z" />
                        </svg>
                    </div>

                    <div className="relative z-10 text-center top-3 lg:text-left">
                        <img
                            src={slides[currentSlide].image}
                            alt={slides[currentSlide].product}
                            className="w-48 h-48 lg:w-64 lg:h-64 object-contain mx-auto lg:mx-0 mb-6 transition-all duration-500"
                        />
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-500 mb-2">
                            {slides[currentSlide].product}
                        </h1>
                        <p className="text-xl lg:text-2xl  font-semibold">
                            {slides[currentSlide].price}
                        </p>
                    </div>
                </div>

                {/* Right Side - Model Image */}
                <div className="w-full lg:w-1/2 relative">
                    <img
                        src={slides[currentSlide].modelImage}
                        alt="Beauty Model"
                        className="w-full h-full object-cover object-top min-h-[400px] lg:min-h-full transition-all duration-500"
                    />

                    {/* Shop Now Button */}
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                        <a
                            href={slides[currentSlide].url}
                            className="bg-white text-secondary px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:text-secondary/50 transition-colors shadow-lg"
                        >
                            Shop Now
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-8 h-2 rounded-full transition-all ${
                            index === currentSlide ? 'bg-gray-600 w-12' : 'bg-gray-300'
                        }`}
                        type="button"
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
