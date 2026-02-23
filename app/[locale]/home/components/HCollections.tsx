import { useState } from 'react';

const collections = [
    {
        id: 1,
        name: 'Face Care',
        image: 'https://ext.same-assets.com/1832031263/2647586545.png',
    },
    {
        id: 2,
        name: 'Lip Care',
        image: 'https://ext.same-assets.com/1832031263/4178479425.png',
    },
    {
        id: 3,
        name: 'Hair Care',
        image: 'https://ext.same-assets.com/1832031263/3742444151.png',
    },
    {
        id: 4,
        name: 'Body Care',
        image: 'https://ext.same-assets.com/1832031263/4147739673.png',
    },
];

export default function HCollections() {
    const [, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % collections.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + collections.length) % collections.length);
    };

    return (
        <section id="collection" className="py-16 lg:py-24 bg-cream-light">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="font-rumraisin text-primary text-lg mb-2">Category</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-secondary flex items-center justify-center gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Shop By Cosmetic Collection
                        <span className="w-2 h-2 bg-primary rounded-full" />
                    </h2>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {collections.map((collection) => (
                        <div
                            key={collection.id}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden bg-white rounded-lg aspect-square flex items-center justify-center p-6 shadow-md hover:shadow-xl transition-shadow">
                                {/* Hexagon Shape Background */}
                                <div className="absolute inset-4 bg-cream-light clip-hexagon" />
                                <img
                                    src={collection.image}
                                    alt={collection.name}
                                    className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <h3 className="text-center font-semibold text-secondary mt-4 group-hover:text-primary transition-colors">
                                {collection.name}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={prevSlide}
                        className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"
                        type="button"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors"
                        type="button"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
