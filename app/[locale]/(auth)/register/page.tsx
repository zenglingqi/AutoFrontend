import { getMessages } from 'next-intl/server';
import RegisterForm from '@/components/Auth/RegisterForm';




export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // 仅获取 login 命名空间的 JSON 数据，解决序列化报错
    const messages = await getMessages({ locale });
    //const loginMessages = (messages as any).login || {};
    const loginMessages = (messages as Record<string, unknown>).login || {};

    return (
        <main className="min-h-screen flex flex-col bg-background transition-colors duration-500">

            {/* 2. 中间内容区：flex-1 会撑满剩余空间，items-center justify-center 负责居中表单 */}
            <section className="flex-1 flex items-center justify-center p-6 py-20">
                <RegisterForm loginMessages={loginMessages} locale={locale} />
            </section>


        </main>
    );
}