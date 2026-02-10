import {getTranslations} from 'next-intl/server';
import {signIn} from '@/auth';
import {Link} from '@/i18n/navigation';

export default async function LoginPage() {
  const tLogin = await getTranslations('login');
  const tCommon = await getTranslations('common');

  async function handleGoogleLogin() {
    'use server';
    await signIn('google', {redirectTo: '/'});
  }

  async function handleFacebookLogin() {
    'use server';
    await signIn('facebook', {redirectTo: '/'});
  }

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold">{tLogin('title')}</h1>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <form action={handleGoogleLogin}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border px-6 py-3 transition-all hover:bg-zinc-50 active:scale-95"
          >
            <span className="font-medium text-zinc-700">{tLogin('google_btn')}</span>
          </button>
        </form>

        <form action={handleFacebookLogin}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1877F2] px-6 py-3 text-white transition-all hover:opacity-90 active:scale-95"
          >
            <span className="font-medium">{tLogin('facebook_btn')}</span>
          </button>
        </form>
      </div>

      <p className="text-sm text-zinc-500">
        <Link href="/">{tCommon('back_home')}</Link>
      </p>
    </main>
  );
}
