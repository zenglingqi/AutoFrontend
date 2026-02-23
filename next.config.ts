import createNextIntlPlugin from 'next-intl/plugin';
import type {NextConfig} from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/requestV0.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
    // 确保在开发环境下对编译内容进行物理标记
    onDemandEntries: {
        // 页面在内存中保留的时间（毫秒）
        maxInactiveAge: 25 * 1000,
        // 同时保留的页面数
        pagesBufferLength: 2,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'gips0.baidu.com', // 兼容你之前接口里出现的百度图片
                pathname: '**',
            },
            {
                protocol: 'https',
                    hostname: 'pics0.baidu.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'your-domain.com', // 兼容你之前接口里出现的百度图片
                pathname: '**',
            },
            // 如果你的 mainImage 存储在其他服务器，也需要在这里添加
        ],
    },

};

export default withNextIntl(nextConfig);



