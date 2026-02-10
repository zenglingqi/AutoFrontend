'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function HeaderNavMain() {
    const t = useTranslations('NAV');
    const pathname = usePathname();

    const navItems = [
        { name: t('home'), path: '/' },
        { name: t('shop'), path: '/shop' },
        { name: t('categories'), path: '/categories' },
    ];

    return (
        <nav className="flex items-center gap-8">
            {navItems.map((item) => {
                // 判断激活状态，增加质感指示器
                const isActive = pathname.endsWith(item.path);
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                            isActive ? 'text-emerald-600' : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}