import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// [locale]/layout.tsx
export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // 1. 先等待 params 解析
    const { locale } = await params;

    // 2. 校验 locale
    if (!routing.locales.includes(locale as any)) notFound();

    // 3. 必须在获取 messages 之前设置
    setRequestLocale(locale);

    // 4. 获取 messages (推荐不传参，让它自动从当前请求上下文中找)
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow min-h-[70vh]">
                    {children}
                </main>
                <Footer />
            </div>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}