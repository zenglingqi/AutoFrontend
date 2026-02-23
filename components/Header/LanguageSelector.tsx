'use client';

import { useState, useEffect } from 'react';
import { LANGUAGES } from '@/constants/languages';
// 注意：必须从你项目配置 next-intl 的 navigation.ts 中引入，而不是 next/navigation
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    // 1. 同步逻辑：当 URL 改变（例如用户手动输入 /ko/register），自动更新选择器状态
    // 从 URL params 中获取当前语言简码 (en, zh, ko)
    const currentLocale = params.locale as string;

    // 状态初始化与同步
    const [selected, setSelected] = useState(
        LANGUAGES.find(l => l.code.startsWith(currentLocale)) || LANGUAGES[0]
    );

    // 监听 URL locale 变化，确保选择器始终与 URL 一致 (解决 SEO 和手动输入 URL 问题)
    useEffect(() => {
        const matched = LANGUAGES.find(l => l.code.startsWith(currentLocale));
        if (matched) {
            setSelected(matched);
        }
    }, [currentLocale]);

    // 2. 切换逻辑：物理跳转 URL
    const handleLocaleChange = (lang: typeof LANGUAGES[0]) => {
        setIsOpen(false);

        // 提取简码，例如从 'en-US' 提取 'en'
        const newLocale = lang.code.split('-')[0];

        // 使用 next-intl 的 router.replace
        // 它会保持当前路径（如 /register）只替换语言前缀（如 /en -> /ko）
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="relative font-sans">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 group outline-none"
            >
                <span className="font-emoji text-[15px] leading-none">{selected.emoji}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted group-hover:text-gold transition-colors">
                    {selected.iso2}
                </span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-10 right-0 w-48 bg-card border border-border/60 rounded-2xl shadow-xl z-[70] p-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLocaleChange(lang)}
                                className={`w-full flex items-center gap-3 p-3 hover:bg-muted/5 rounded-xl transition-all group ${
                                    selected.code === lang.code ? 'bg-muted/5' : ''
                                }`}
                            >
                                <span className="font-emoji text-lg">{lang.emoji}</span>
                                <div className="flex flex-col items-start">
                                    <span className={`text-[10px] font-bold tracking-widest transition-colors ${
                                        selected.code === lang.code ? 'text-gold' : 'text-foreground/70 group-hover:text-gold'
                                    }`}>
                                        {lang.label}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}