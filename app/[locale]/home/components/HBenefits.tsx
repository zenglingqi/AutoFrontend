

const benefits = [
    {
        id: 1,
        title: 'Premium Quality Products',
        description: '',
        icon: (
            <svg className="w-6 h-6"  viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
    },
    {
        id: 2,
        title: 'Beauty Guidance',
        description: '',
        icon: (
            <svg className="w-6 h-6"  viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        ),
    },
    {
        id: 3,
        title: 'Cruelty-Free Formulas',
        description: '',
        icon: (
            <svg className="w-6 h-6"  viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        ),
    },
    {
        id: 4,
        title: 'Secure Shopping',
        description: '',
        icon: (
            <svg className="w-6 h-6"  viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
        ),
    },
    {
        id: 5,
        title: 'Reliable Delivery',
        description: '',
        icon: (
            <svg className="w-6 h-6"  viewBox="0 0 24 24">
                <path d="M19 7c0-1.1-.9-2-2-2h-3V3H5v2H2c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2V7zM5 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
            </svg>
        ),
    },
    {
        id: 6,
        title: 'Trusted by Thousands',
        description: '',
        icon: (
            <svg className="w-6 h-6"  viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
        ),
    },
];



export default function HBenefits() {

    return (
        <section className="py-16 lg:py-24 bg-cream-light">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="font-rumraisin  text-lg mb-2">Benefit</p>
                    <h2 className="text-3xl lg:text-4xl font-bold text-secondary flex items-center justify-center gap-3">
                        <span className="w-2 h-2  rounded-full" />
                        Our Cosmetic Benefit
                        <span className="w-2 h-2  rounded-full" />
                    </h2>
                </div>

                {/* Benefits Layout */}
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Left Benefits */}
                    <div className="flex flex-col gap-8 lg:w-1/3">
                        {benefits.slice(0, 3).map((benefit) => (
                            <div key={benefit.id} className="flex items-start gap-4 text-right lg:flex-row-reverse">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-md">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary mb-1">{benefit.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Center Image */}
                    <div className="lg:w-1/3 flex justify-center">
                        <img
                            src="/Home/assurence.png"
                            alt="Beauty Products"
                            className="max-w-full h-auto max-h-96 object-contain"
                        />
                    </div>

                    {/* Right Benefits */}
                    <div className="flex flex-col gap-8 lg:w-1/3">
                        {benefits.slice(3).map((benefit) => (
                            <div key={benefit.id} className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-md">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary mb-1">{benefit.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
