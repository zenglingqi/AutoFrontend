// src/app/[locale]/login/page.tsx
import { getMessages } from 'next-intl/server';
import LoginForm from "@/components/Auth/LoginForm";
import ThemeToggle from "@/components/Header/ThemeButton";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages({ locale });
    const loginMessages = (messages as any).login || {};

    return (
        /* 💡 这里的 bg-black 会强制背景永远是黑色，
           建议改为方案三配色：bg-[#FCFAFA] dark:bg-[#121212] */
        <main className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#121110] transition-colors duration-500">
            {/* 切换按钮可以放在右上角 */}
            <div className="fixed top-8 right-8">
                <ThemeToggle />
            </div>

            {/* 💡 删除了这里的 <ThemeProvider>，因为它在 layout.tsx 里已经有了 */}
            <LoginForm loginMessages={loginMessages} locale={locale} />
        </main>
    );
}