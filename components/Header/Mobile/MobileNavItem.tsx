'use client';

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";
import type { NavItem } from "@/types/navigation";
import { getLabel } from "@/i18n/getLabel.ts";

interface MobileNavItemProps {
    item: NavItem;
    onClose: () => void;
}

export function MobileNavItem({ item, onClose }: MobileNavItemProps) {
    const [open, setOpen] = useState(false);
    const locale = useLocale();
    const hasChildren = item.children && item.children.length > 0;

    // 渲染内容
    const content = (
        <div className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all active:bg-zinc-100 dark:active:bg-zinc-800">
            <span className="text-[15px] font-medium text-zinc-800 dark:text-zinc-200">
                {getLabel(item.label)}
            </span>
            {hasChildren && (
                <ChevronRight
                    size={18}
                    className={`text-zinc-400 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
                />
            )}
        </div>
    );

    return (
        <div className="w-full">
            {hasChildren ? (
                <button onClick={() => setOpen(!open)} className="w-full text-left">
                    {content}
                </button>
            ) : (
                <Link href={`/${locale}${item.path}`} onClick={onClose}>
                    {content}
                </Link>
            )}

            {/* 子菜单：带有精致的左侧引导线 */}
            {hasChildren && open && (
                <div className="ml-6 mt-1 mb-2 border-l border-zinc-100 dark:border-zinc-800 space-y-1">
                    {item.children!.map((child) => (
                        <Link
                            key={child.key}
                            href={`/${locale}${child.path}`}
                            onClick={onClose}
                            className="block px-6 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 transition-colors"
                        >
                            {getLabel(child.label)}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}