'use client';

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Logo from "./Logo";
import { HeaderNavMain } from "./NavMain";
import { HeaderActions } from "./HeaderActions";
import { MobileMenu } from "./Mobile/MobileMenu";

export default function PublicHeader() {
    const t = useTranslations('Header'); // 对应 header.yaml 中的 Header 节点
    const [menuVisible, setMenuVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // 优化：滚动时 Header 变得更透明/紧凑
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header className={`
                fixed top-0 left-0 w-full h-16 z-50 transition-all duration-300
                ${scrolled ? 'bg-white/80 dark:bg-black/80 shadow-sm' : 'bg-white/40 dark:bg-black/20'}
                backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50
            `}>
                <div className="mx-auto h-full flex items-center justify-between px-4 sm:px-8 max-w-[1440px]">
                    {/* 使用 next-intl 的 Link，点击自动维持当前语言 */}
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>

                    {/* 桌面导航：不再需要手动传 lang */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <HeaderNavMain />
                    </div>

                    {/* 动作区 */}
                    <HeaderActions onMobileMenuToggle={() => setMenuVisible(true)} />
                </div>
            </header>

            <MobileMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
        </>
    );
}