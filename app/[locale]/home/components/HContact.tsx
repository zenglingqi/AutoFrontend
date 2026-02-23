import { useState } from 'react';

export default function HContact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        country: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="py-16 lg:py-24 bg-cream-light relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Form Side */}
                    <div className="lg:w-1/2">
                        <p className="font-rumraisin text-primary text-lg mb-2">Write Us</p>
                        <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-8 flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary rounded-full" />
                            Contact Us
                            <span className="w-2 h-2 bg-primary rounded-full" />
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                                />
                                <input
                                    type="text"
                                    name="country"
                                    placeholder="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-full font-medium hover:bg-primary transition-colors"
                            >
                                Submit
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Image Side */}
                    <div className="lg:w-1/2 relative">
                        {/* Decorative hexagon */}
                        <div className="absolute -top-10 right-10 w-20 h-20 bg-secondary/10 rotate-45" />
                        <img
                            src="https://ext.same-assets.com/1832031263/2026803172.png"
                            alt="Contact Us"
                            className="w-full max-w-lg mx-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
