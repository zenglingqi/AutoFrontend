// @/components/Header/MobileLanguageDrawer.tsx
'use client';

import { X, Check } from 'lucide-react';
import { LANGUAGES } from '@/constants/languages';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

export default function MobileLanguageDrawer({ isOpen, onCloseAction }: { isOpen: boolean, onCloseAction: () => void }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const currentLocale = params.locale as string;

    const handleLocaleChange = (langCode: string) => {
        onCloseAction();
        // 提取简码，例如从 'en-US' 提取 'en'
        const newLocale = langCode.split('-')[0];
        // 保持路径并切换语言前缀
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <>
            {/* 遮罩层 */}
            <div
                className={`fixed inset-0 bg-black/40 z-[110] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onCloseAction}
            />
            {/* 抽屉面板 - 使用与 globals.css 变量一致的纯色背景 */}
            <div className={`fixed bottom-0 left-0 w-full bg-[rgb(var(--background))] rounded-t-[2.5rem] z-[111] transition-transform duration-500 ease-out p-8 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-muted">Select Language</span>
                    <button onClick={onCloseAction} className="p-2 bg-muted/10 rounded-full">
                        <X size={18} />
                    </button>
                </div>

                <div className="grid gap-3">
                    {LANGUAGES.map((lang) => {
                        const isSelected = lang.code.startsWith(currentLocale);
                        return (
                            <button
                                key={lang.code}
                                onClick={() => handleLocaleChange(lang.code)}
                                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                    isSelected ? 'border-gold bg-gold/5 shadow-sm' : 'border-border/10 bg-muted/5'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="font-emoji text-xl leading-none">{lang.emoji}</span>
                                    <div className="flex flex-col items-start">
                                        <span className={`text-sm font-bold ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                                            {lang.label}
                                        </span>
                                        <span className="text-[10px] text-muted uppercase tracking-widest">
                                            {lang.iso2}
                                        </span>
                                    </div>
                                </div>
                                {isSelected && <Check size={16} className="text-gold" />}
                            </button>
                        );
                    })}
                </div>
                <div className="h-8" /> {/* 适配手机底部安全区域 */}
            </div>
        </>
    );
}