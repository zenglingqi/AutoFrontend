import { useState } from 'react';

const navLinks = [
    { name: 'Home', href: '#', active: true },
    { name: 'Shop', href: '#shop' },
    { name: 'Collection', href: '#collection' },
    { name: 'Pages', href: '#', hasDropdown: true },
    { name: 'Blog', href: '#blog', hasDropdown: true },
];

export default function HHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount] = useState(0);

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2">
                        <img
                            src="https://ext.same-assets.com/1832031263/2375831501.png"
                            alt="Cosmetic Shop"
                            className="h-10"
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group">
                                <a
                                    href={link.href}
                                    className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                                        link.active ? 'text-primary' : 'text-secondary'
                                    }`}
                                >
                                    {link.active && <span className="w-2 h-2 bg-primary rounded-full" />}
                                    {link.name}
                                    {link.hasDropdown && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </a>
                            </div>
                        ))}
                        <a
                            href="#"
                            className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
                        >
                            Buy Now
                        </a>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <button className="p-2 hover:text-primary transition-colors" type="button">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>

                        {/* Cart */}
                        <button className="p-2 hover:text-primary transition-colors relative" type="button">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
                        </button>

                        {/* Account */}
                        <button className="p-2 hover:text-primary transition-colors hidden sm:block" type="button">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-primary ${
                                        link.active ? 'text-primary' : 'text-secondary'
                                    }`}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href="#"
                                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors text-center"
                            >
                                Buy Now
                            </a>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
