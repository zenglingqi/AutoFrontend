import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function HomePage() {
  const t = await getTranslations('common');

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-semibold">{t('app_title')}</h1>
      <p className="text-zinc-600">{t('app_description')}</p>
      <Link
        href="/login"
        className="rounded-lg bg-black px-4 py-2 text-white transition hover:opacity-90"
      >
        {t('go_login')}
      </Link>
    </main>
  );
}
