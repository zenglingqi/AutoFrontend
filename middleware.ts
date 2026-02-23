// middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';

export default createMiddleware(routing);


export const config = {
    matcher: [
        // 排除所有不需要多语言处理的路径 (api, 静态文件等)
        '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)',

        // 允许所有根路径下的请求进入中间件，让 next-intl 内部逻辑决定去留
        '/',

        // 动态匹配所有前缀，不再写死 (zh|en)
        //'/:path*'
    ]
};
