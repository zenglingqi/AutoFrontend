// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // 支持的语言列表
    locales: ['en', 'zh'],
    // 默认语言, 'zh','fr','ko'
    defaultLocale: 'en',

    // 开启语言检测，如果路径不匹配，中间件会尝试重定向到最接近的合法语言
    localeDetection: true,

    // 即使是默认语言，也显示 /en 前缀（可选）
    localePrefix: 'always'
});

// 导出导航辅助工具
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);