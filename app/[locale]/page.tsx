// app/[locale]/page.tsx
import { redirect } from 'next/navigation';

// 修改接口定义：params 必须是 Promise
interface Props {
    params: Promise<{ locale: string }>;
}

export default async function LocaleRootPage({ params }: Props) {
    // 这里的 await 是正确的，但上面的类型声明必须是 Promise
    const { locale } = await params;

    redirect(`/${locale}/home`);
    return null;
}