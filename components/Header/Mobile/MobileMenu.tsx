'use client';


import { useConfig } from "@/context/ConfigContext";
import type { NavItem } from "@/types/navigation";
import { MobileNavItem } from "./MobileNavItem";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { X } from "lucide-react"; // 使用图标库提升精致感
import { motion, AnimatePresence } from "framer-motion"; // 建议使用 framer-motion 处理动效

interface MobileMenuProps {
    visible: boolean;
    onClose: () => void;
}

export function MobileMenu({ visible, onClose }: MobileMenuProps) {
    const { navigation } = useConfig();
    const items: NavItem[] = navigation?.main ?? [];

    // 锁定滚动
    useBodyScrollLock(visible);

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* 背景遮罩：使用更柔和的模糊 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/20 dark:bg-black/40 backdrop-blur-sm"
                    />

                    {/* 侧边抽屉 */}
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 z-[70] w-[280px] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-2xl border-r border-zinc-200/50 dark:border-white/10"
                    >
                        <div className="flex flex-col h-full">
                            {/* 头部：保持规矩的对齐 */}
                            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-white/5">
                                <span className="font-bold text-sm tracking-widest text-zinc-400">MENU</span>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-zinc-500" />
                                </button>
                            </div>

                            {/* 导航内容 */}
                            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                                {items.map((item) => (
                                    <MobileNavItem
                                        key={item.key}
                                        item={item}
                                        onClose={onClose}
                                    />
                                ))}
                            </nav>

                            {/* 底部：可以放置语言切换或登录状态 */}
                            <div className="p-6 border-t border-zinc-100 dark:border-white/5">
                                {/* 这里可以放之前的 LanguageSwitcher */}
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}