'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; // 推荐使用 Lucide 图标

export function ThemeButton() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // 只有挂载后才显示，防止服务端与客户端不匹配
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-9 h-9" />; // 占位，防止布局抖动

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-90"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500 transition-all rotate-0 scale-100" />
            ) : (
                <Moon className="w-5 h-5 text-zinc-900 transition-all rotate-0 scale-100" />
            )}
        </button>
    );
}