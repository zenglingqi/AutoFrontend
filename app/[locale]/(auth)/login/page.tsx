import { useTranslations } from 'next-intl';
import { signIn } from "@/lib/auth"; // 注意：这是从服务端组件直接调用的
import { Link } from '@/i18n/navigation';

export default function LoginPage() {
    const t = useTranslations('login');

    // 定义一个 Server Action 来处理点击
    async function handleGoogleLogin() {
        "use server";
        await signIn("google", { redirectTo: "/" });
    }

    return (

        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <h1 className="text-3xl font-bold">{t('title')}</h1>

            <div className="flex flex-col gap-4 w-full max-w-sm">
                {/* Google 登录 */}
                <form action={handleGoogleLogin}>
                    <button className="w-full flex items-center justify-center gap-3 px-6 py-3 border rounded-xl hover:bg-zinc-50 transition-all active:scale-95">
                        <img src="/icons/google.svg" className="w-5 h-5" alt="Google" />
                        <span className="font-medium text-zinc-700">{t('google_btn')}</span>
                    </button>
                </form>

                {/* Facebook 登录 */}
                <form action={async () => { "use server"; await signIn("facebook"); }}>
                    <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#1877F2] text-white rounded-xl hover:opacity-90 transition-all active:scale-95">
                        <span className="font-medium">{t('facebook_btn')}</span>
                    </button>
                </form>
            </div>

            <p className="text-sm text-zinc-500">
                <Link href="/">{t('facebook_btn', { defaultValue: 'Back to Home' })}</Link>
            </p>
        </div>
    );
}