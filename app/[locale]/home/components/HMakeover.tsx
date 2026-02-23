import { useState } from 'react';

const makeovers = [
    {
        id: 1,
        image: 'https://ext.same-assets.com/1832031263/2756534360.png',
        bg: 'bg-blue-100',
    },
    {
        id: 2,
        image: 'https://ext.same-assets.com/1832031263/1066719753.png',
        bg: 'bg-pink-100',
    },
    {
        id: 3,
        image: 'https://ext.same-assets.com/1832031263/2622445697.png',
        bg: 'bg-orange-100',
    },
    {
        id: 4,
        image: 'https://ext.same-assets.com/1832031263/3018548768.png',
        bg: 'bg-rose-100',
    },
];

export default function HMakeover() {
    const [, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % makeovers.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + makeovers.length) % makeovers.length);
    };

    return (
        <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 border-4 border-primary-dark/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-4 border-primary-dark/20 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="font-rumraisin text-primary text-lg mb-2">Team</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-secondary flex items-center justify-center gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Our Best makeover
                        <span className="w-2 h-2 bg-primary rounded-full" />
                    </h2>
                </div>

                {/* Makeover Gallery */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                    {makeovers.map((makeover) => (
                        <div
                            key={makeover.id}
                            className={`group relative overflow-hidden rounded-2xl aspect-[3/4] ${makeover.bg}`}
                        >
                            <img
                                src={makeover.image}
                                alt="Beauty Makeover"
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Decorative border */}
                            <div className="absolute bottom-0 left-0 w-full h-1/3 border-l-4 border-b-4 border-primary-dark/30 rounded-bl-3xl" />
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
