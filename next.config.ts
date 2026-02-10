import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
    i18n: {
        locales: ['en', 'zh'],  // Add supported languages
        defaultLocale: 'zh',    // Set default locale
    },
};

export default nextConfig;
