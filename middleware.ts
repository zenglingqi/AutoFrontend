// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';

export default createMiddleware(routing);

export const config = {
    // 重点：排除所有的 API 路由、静态资源后缀和内部路径
    matcher: [
        // 1. 匹配所有路径，除非包含以下关键词
        '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)',
        // 2. 显式匹配根路径和多语言前缀
        '/',
        '/(zh|en)/:path*'
    ]
};
