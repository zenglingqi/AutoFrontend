'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (nextLocale: string) => {
        startTransition(() => {
            // 逻辑：将路径中的 /en/... 替换为 /zh/...
            const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
            router.replace(newPath);
        });
    };

    return (
        <div className={`flex gap-2 ${isPending ? 'opacity-50' : ''}`}>
            {['en', 'zh', 'ko'].map((l) => (
                <button
                    key={l}
                    onClick={() => onSelectChange(l)}
                    className={`px-2 py-1 text-xs rounded ${locale === l ? 'bg-zinc-200 dark:bg-zinc-800' : ''}`}
                >
                    {l.toUpperCase()}
                </button>
            ))}
        </div>
    );
}