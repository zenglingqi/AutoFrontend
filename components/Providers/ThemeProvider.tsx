'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class" // 通过 HTML class 切换，适配 Tailwind 的 dark: 模式
            defaultTheme="system" // 默认跟随系统
            enableSystem
            disableTransitionOnChange // 切换时防止 CSS 动画闪烁，提升质感
        >
            {children}
        </NextThemesProvider>
    );
}