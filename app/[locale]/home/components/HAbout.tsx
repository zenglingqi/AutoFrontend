const checkpoints = [
    'We believe that meeting user needs is of utmost importance.',
    'The products are exactly as advertised.',
    'All user information is stored encrypted, using HTTPS secure connections.',
    'Stripe payment processing is supported. aino store will never collect users bank card information.',
];

export default function HAbout() {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Image Side */}
                    <div className="lg:w-1/2 relative">
                        <img
                            src="/Home/aboutus.png"
                            alt="About Us"
                            className="w-full max-w-md mx-auto rounded-lg"
                        />
                        {/* Experience Badge */}
                        <div className="absolute bottom-8 left-8 bg-primary text-white p-4 rounded-lg shadow-lg">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">5+</span>
                                <div className="text-sm">
                                    <p>Years of</p>
                                    <p>Experience</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:w-1/2">
                        <p className="font-rumraisin text-primary text-lg mb-2">About Us</p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-6">
                            Fostering connections among like-minded individuals across borders as we move forward together.
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Aino Store is a company registered in Hong Kong. Hong Kong has a long history and rich culture and is a world-renowned metropolis. The products offered by the company are carefully selected to ensure that our customers receive exactly what they see on our website. We are committed to providing excellent service to every customer. We serve customers from different countries around the world, thereby building close and mutually beneficial relationships.
                        </p>

                        {/* Checkpoints */}
                        <div className="space-y-3 mb-8">
                            {checkpoints.map((point, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-primary rounded flex items-center justify-center shrink-0 mt-0.5">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">{point}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-full font-medium hover:bg-primary transition-colors"
                        >
                            More About Us
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
