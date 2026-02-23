import { useState } from 'react';

const reviews = [
    {
        id: 1,
        name: 'David Stuart',
        text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        image: '/avatar/default.png',
        bg: 'bg-cream',
    },
    {
        id: 2,
        name: 'John',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when',
        image: '/avatar/default.png',
        bg: 'bg-primary',
    },
    {
        id: 3,
        name: 'Lisa Nguyen',
        text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        image: '/avatar/default.png',
        bg: 'bg-secondary',
    },
];

export default function HReviews() {
    const [, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="font-rumraisin text-primary text-lg mb-2">Reviews</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-secondary flex items-center justify-center gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        Customer Stories
                        <span className="w-2 h-2 bg-primary rounded-full" />
                    </h2>
                </div>

                {/* Reviews Slider */}
                <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className={`min-w-[300px] lg:min-w-[350px] rounded-2xl p-6 snap-center ${review.bg} ${
                                    review.bg === 'bg-cream' ? 'text-secondary' : 'text-white'
                                }`}
                            >
                                {/* Avatar */}
                                <div className="flex justify-center mb-4">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30">
                                        <img
                                            src={review.image}
                                            alt={review.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Review Text */}
                                <p className="text-center text-sm leading-relaxed mb-4 opacity-90">
                                    {review.text}
                                </p>

                                {/* Name */}
                                <div className="text-center">
                                    <div className="w-12 h-0.5 bg-current mx-auto mb-2 opacity-50" />
                                    <h4 className="font-semibold">{review.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={prevSlide}
                            className="w-10 h-10 bg-white border-2 border-secondary rounded-full flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-colors"
                            type="button"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-10 h-10 bg-white border-2 border-secondary rounded-full flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-colors"
                            type="button"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
