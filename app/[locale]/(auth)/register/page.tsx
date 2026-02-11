import { getMessages } from 'next-intl/server';
import RegisterForm from '@/components/Auth/RegisterForm';
import LoginForm from "@/components/Auth/LoginForm";


export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // 仅获取 login 命名空间的 JSON 数据，解决序列化报错
    const messages = await getMessages({ locale });
    const loginMessages = (messages as any).login || {};

    return (
        <main className="min-h-screen flex items-center justify-center bg-black">
            <RegisterForm loginMessages={loginMessages} locale={locale} />
        </main>
    );
}