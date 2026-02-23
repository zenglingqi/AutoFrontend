// src/app/[locale]/login/page.tsx
import { getMessages } from 'next-intl/server';
import LoginForm from "@/components/Auth/LoginForm";
import {Suspense} from "react";


export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages({ locale });

    // 💡 修复点：断言为含有 login 属性的对象，或者 Record 类型
    const loginMessages = (messages as Record<string, unknown>).login || {};

    return (
        /* 💡 这里的 bg-black 会强制背景永远是黑色，
           建议改为方案三配色：bg-[#FCFAFA] dark:bg-[#121212] */
        <main className="min-h-screen flex flex-col bg-background transition-colors duration-500">

            {/* 2. 中间内容区：flex-1 会撑满剩余空间，items-center justify-center 负责居中表单 */}
            <section className="flex-1 flex items-center justify-center p-6 py-20">
                <Suspense fallback={<div className="animate-pulse text-muted">Loading...</div>}>
                <LoginForm loginMessages={loginMessages} locale={locale} />
                </Suspense>
            </section>

        </main>
    );
}