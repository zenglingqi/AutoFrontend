'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // 💡 关键：只有在 mounted 变为 true 后（客户端环境），才渲染真实的图标
    // 否则在 SSR 阶段，theme 是 undefined，逻辑会回退到默认值
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // 返回一个占位符，保持占位大小一致，防止页面抖动
        return <div className="w-9 h-9 p-2" />;
    }

    // 💡 更加健壮的判断：显式检查 'dark'
    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="group relative p-2 rounded-full transition-all duration-500 hover:bg-[#F4F0E8] dark:hover:bg-[#1C1A19]"
            aria-label="Toggle Theme"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                {isDark ? (
                    /* 深色模式：显示太阳，准备切回浅色 */
                    <Sun className="w-5 h-5 text-[#C5A059] transition-all duration-500 rotate-0 scale-100" />
                ) : (
                    /* 浅色模式：显示月亮，准备切回深色 */
                    <Moon className="w-5 h-5 text-[#4A443F] transition-all duration-500 rotate-0 scale-100 group-hover:text-[#C5A059]" />
                )}
            </div>

            {/* 饰品感装饰：悬停时的小光圈 */}
            <span className="absolute inset-0 rounded-full border border-transparent group-hover:border-[#C5A059]/30 transition-all duration-500 scale-125 opacity-0 group-hover:scale-100 group-hover:opacity-100" />
        </button>
    );
}