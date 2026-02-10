'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';

export default function Logo() {
    const locale = useLocale();

    return (
        <Link
            href={`/${locale}`}
            className="relative flex items-center group transition-transform active:scale-95"
            aria-label="Go to Homepage"
        >
            {/* 质感优化：在 Logo 后方加一个若隐若现的氛围光（仅暗色模式可见） */}
            <div className="absolute -inset-2 bg-emerald-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="relative h-9 w-auto" // 固定高度，宽度自适应
            >
                <Image
                    src="/icons/logo.svg" // 建议放在 public/icons/logo.svg
                    alt="Brand Logo"
                    width={150}
                    height={36}
                    priority // 强制优先加载，避免 Header 出现空白
                    className="h-full w-auto object-contain dark:invert-[0.1]"
                />
            </motion.div>

            {/* 这里的文字 Logo（可选）：如果你的 Logo 只是图标，可以在旁边加文字 */}
            <span className="ml-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 hidden sm:block">
        AINO<span className="text-emerald-600">STORE</span>
      </span>
        </Link>
    );
}