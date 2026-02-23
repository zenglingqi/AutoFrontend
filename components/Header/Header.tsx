'use client';

import { useState, useEffect } from 'react';
import {ShoppingBag, Search, Moon, Sun, Menu, X, Globe, DollarSign, ChevronRight, ChevronDown} from 'lucide-react';
import { useTheme } from 'next-themes';
import CurrencySelector from "@/components/Header/CurrencySelector";
import LanguageSelector from "@/components/Header/LanguageSelector";
import SearchOverlay from "@/components/Header/SearchOverlay";
import { useCart } from '@/components/Context/CartContext';
import CartDrawer from "@/components/Header/CartDrawer";
import {useParams} from "next/navigation";
import MobileNavSearch from "@/components/Header/Mobile/MobileNavSearch";
import MobileCurrencyDrawer from "@/components/Header/Mobile/MobileCurrencyDrawer";
import {useCurrency} from "@/components/Providers/CurrencyProvider";
import {LANGUAGES} from "@/constants/languages";
import MobileLanguageDrawer from "@/components/Header/Mobile/MobileLanguageDrawer";
import {useLocale,useTranslations} from "next-intl";



export default function Header( ) {
    const [mounted, setMounted] = useState(false); // Add this
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { setIsCartOpen, cartItems } = useCart();
    const [showMobileCurrency, setShowMobileCurrency] = useState(false);
    const [showMobileLanguage, setShowMobileLanguage] = useState(false);

    const {selectedCurrency}=useCurrency();

    const currentLocale = useParams()?.local as string;
    const currentLang = LANGUAGES.find(l => l.code.startsWith(currentLocale)) || LANGUAGES[0];

    const locale = useLocale();




    const t = useTranslations('Navigation');


    const menuItems = Array.isArray(t.raw('items')) ? t.raw('items') : [];

    // 状态管理：记录当前哪个菜单是展开的
    const [expandedId, setExpandedId] = useState<string | null>(null);



    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // 阻止 A 标签跳转
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        setMounted(true);
    }, []);





    useEffect(() => {
        if (mobileMenuOpen) {
            // 弹出菜单时禁止滚动
            document.body.style.overflow = 'hidden';
        } else {
            // 关闭菜单时恢复滚动
            document.body.style.overflow = 'unset';
        }
        // 组件卸载时确保恢复滚动
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    // 滚动监听：改变 Header 透明度
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);




    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            isScrolled ? 'bg-background backdrop-blur-md py-3 shadow-sm' : 'bg-background py-6'
        }`}>


            <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">

                {/* Left: Desktop Navigation with Hover Submenu */}
                <nav className="hidden md:flex items-center gap-10">
                    {menuItems.map((link: any, index: number) => (
                        <div key={link.id || index} className="relative group py-2">
                            <a
                                href={(link.href)}
                                className="text-[10px] uppercase tracking-[0.3em] text-foreground/70 hover:text-gold transition-colors font-bold flex items-center gap-1"
                            >
                                {link.name}
                                {/* 只要有 children 字段，就自动渲染箭头 */}
                                {link.children && <ChevronDown size={10} className="opacity-50 group-hover:rotate-180 transition-transform" />}
                            </a>

                            {/* 自动渲染二级菜单（如果有） */}
                            {link.children && Array.isArray(link.children) && (
                                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="bg-card border border-border/40 shadow-xl p-4 min-w-[200px] rounded-2xl backdrop-blur-xl">
                                        {link.children.map((sub: any, subIndex: number) => (
                                            <a
                                                key={sub.name || subIndex}
                                                href={(sub.href)}
                                                className="block py-2 text-[10px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
                                            >
                                                {sub.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Left: Mobile Menu Trigger */}
                <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(true)}>
                    <Menu size={22} strokeWidth={1.5} />
                </button>

                {/* Center: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 text-center">
                    <h1 className="text-xl md:text-2xl font-serif italic tracking-tighter text-foreground">
                        Maison <span className="not-italic font-sans font-light tracking-[0.2em] ml-1">LUMIÈRE</span>
                    </h1>
                </div>

                {/* Right: Functional Icons */}
                <div className="flex items-center gap-3 md:gap-5">
                    {/* Search - Desktop */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden sm:block text-foreground/80 hover:text-gold transition-colors">
                        <Search size={18} strokeWidth={1.5} />
                    </button>

                    {/* 核心选择器组：语言与货币 */}
                    <div className="hidden lg:flex items-center gap-5 border-x border-border/40 px-6 mx-2">
                        {/* 语言选择器：显示 旗标 + ISO代码 */}
                        <LanguageSelector />

                        {/* 微小的垂直分割线，增加精致感 */}
                        <div className="w-[1px] h-3 bg-border/40" />

                        {/* 货币选择器：显示 DollarSign图标 + 货币代码 */}
                        <CurrencySelector />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="text-foreground/80 hover:text-gold transition-all"
                    >
                        {/* Only render the icon once we know we are on the client */}
                        {mounted ? (
                            theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />
                        ) : (
                            <div className="w-[18px] h-[18px]" /> // Invisible placeholder of the same size
                        )}
                    </button>

                    {/* Shopping Bag */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative text-foreground hover:text-gold transition-all ml-1">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-2 bg-gold text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                {cartItems.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}

            <div className={`fixed inset-0 top-0 left-0 w-full h-screen bg-[rgb(var(--background))]/96 z-[70] flex flex-col transition-transform duration-500 ease-in-out ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>

                {/* Header in Sidebar */}
                <div className="p-6 flex justify-between items-center border-b border-border/10">
                    <h1 className="text-lg font-serif italic tracking-tighter">
                        Maison <span className="not-italic font-sans font-light tracking-widest ml-1">LUMIÈRE</span>
                    </h1>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-foreground p-2">
                        <X size={24} strokeWidth={1} />
                    </button>
                </div>

                {/* Scrollable Content */}
                {/* 2. 搜索框提权到顶层 (MobileNavSearch) */}
                <MobileNavSearch onOpenSearch={() => { setIsSearchOpen(true); setMobileMenuOpen(false); }} />

                <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-10">
                    {/* 3. 导航链接 */}
                    <nav className="grid gap-5">
                        {menuItems.map((item: any, idx: number) => {
                            const hasChildren = item.children && Array.isArray(item.children);
                            const itemId = item.id || `menu-${idx}`;

                            return (
                                <div key={itemId} className="flex flex-col border-b border-border/5 pb-4">
                                    <div className="flex items-center justify-between">
                                        {/* 点击文字：跳转功能 */}
                                        <a
                                            href={`/${locale}${item.href}`}
                                            className="text-3xl font-serif italic text-foreground hover:text-gold transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </a>

                                        {/* 点击图标：展开功能 */}
                                        {hasChildren && (
                                            <button
                                                onClick={(e) => toggleExpand(itemId, e)}
                                                className="p-2 text-foreground/50 hover:text-gold"
                                            >
                                                <ChevronDown
                                                    size={24}
                                                    className={`transition-transform duration-300 ${expandedId === itemId ? 'rotate-180' : ''}`}
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {/* 二级菜单内容 */}
                                    {hasChildren && (
                                        <div className={`overflow-hidden transition-all duration-300 ${
                                            expandedId === itemId ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                            <div className="flex flex-col gap-4 pl-4 border-l border-gold/30">
                                                {item.children.map((sub: any, sIdx: number) => (
                                                    <a
                                                        key={sIdx}
                                                        href={`/${locale}${sub.href}`}
                                                        className="text-lg text-muted hover:text-gold"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {sub.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* 4. 偏好设置区域 */}
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] uppercase tracking-[0.4em] text-muted font-bold opacity-50">Preferences</p>

                        <div className="bg-muted/5 rounded-3xl p-6 border border-border/10 space-y-6">
                            {/* 语言触发项 */}
                            <button
                                onClick={() => setShowMobileLanguage(true)}
                                className="flex justify-between items-center w-full group"
                            >
                                    <span className="text-sm uppercase tracking-widest flex items-center gap-3">
                                        <Globe size={16} /> Language
                                    </span>
                                <div className="flex items-center gap-2">
                                    <span className="font-emoji text-[14px]">{currentLang.emoji}</span>
                                    <span className="text-xs font-bold text-gold uppercase">{currentLang.iso2}</span>
                                    <ChevronRight size={14} className="text-muted" />
                                </div>
                            </button>

                            <div className="h-[1px] bg-border/10 w-full" />

                            {/* 点击触发移动端专用抽屉 */}
                            <button
                                onClick={() => setShowMobileCurrency(true)}
                                className="flex justify-between items-center w-full"
                            >
                                <span className="text-sm uppercase tracking-widest flex items-center gap-3"><DollarSign size={16} /> Currency</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gold">{selectedCurrency.code}</span>
                                    <ChevronRight size={14} className="text-muted" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 移动端专属货币抽屉 */}
                <MobileLanguageDrawer
                    isOpen={showMobileLanguage}
                    onCloseAction={() => setShowMobileLanguage(false)}
                />
                <MobileCurrencyDrawer
                    isOpen={showMobileCurrency}
                    onClose={() => setShowMobileCurrency(false)}
                />



                {/* Footer in Sidebar */}
                <div className="p-8 text-center border-t border-border/10">
                    <p className="text-[9px] uppercase tracking-[0.5em] text-muted">© 2026 MAISON LUMIÈRE</p>
                </div>
            </div>

            <SearchOverlay isOpen={isSearchOpen} onCloseAction={() => setIsSearchOpen(false)} />
            <CartDrawer />
        </header>
    );
}