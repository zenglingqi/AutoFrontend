// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // 支持的语言列表
    locales: ['en', 'zh'],
    // 默认语言
    defaultLocale: 'zh',
    // 即使是默认语言，也显示 /en 前缀（可选）
    localePrefix: 'always'
});

// 导出导航辅助工具
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);