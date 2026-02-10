// 必须改为 async 函数
export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>; // 声明为 Promise
}) {
    // 使用 await 获取 locale
    const { locale } = await params;

    return (
        <html lang={locale}>
        <body>{children}</body>
        </html>
    );
}