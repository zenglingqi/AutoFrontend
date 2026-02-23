'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/Context/CartContext';
import { useRouter } from 'next/navigation'; // 使用 Next.js 路由
import {
    X, ShoppingBag, ArrowRight, Heart,
    User, LogIn, UserPlus, ClipboardList,
    Settings, LogOut
} from 'lucide-react';
import { useCurrency } from "@/components/Providers/CurrencyProvider";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import{globalSignOut} from "@/app/api/functionsUser/globalSignOut";
import Link from 'next/link';

export default function CartDrawer() {

    const { data: session, status } = useSession(); // 获取登录状态
    const [mounted, setMounted] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const lang = useLocale();
    const t = useTranslations('Cart'); // 假设你有 Cart 命名空间的国际化配置
    const isLoggedIn = status === "authenticated";
    const user = session?.user as any; // 对应你提供的 user 数据结构


    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, toggleSelect } = useCart();
    const { selectedCurrency, setCurrency } = useCurrency(); // 假设 setCurrency 可以切换 Header 币种
    // ... 原有的状态和动画逻辑 ...

    // --- 数据处理逻辑 ---
    const currentCurrencyCode = selectedCurrency.code;

    // 当前币种组
    const activeItems = cartItems.filter(item => item.currencyCode === currentCurrencyCode);
    // 其他币种组
    const otherCurrencyItems = cartItems.filter(item => item.currencyCode !== currentCurrencyCode);

    // 计算当前选中总额
    const selectedTotal = activeItems
        .filter(item => item.selected)
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const router = useRouter();
    //去结算
    const handleProceed = () => {
        if (selectedTotal > 0) {
            setIsCartOpen(false); // 关闭侧边栏避免视觉遮挡
            router.push('/checkout'); // 跳转到结账路由
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);



    // 延迟卸载逻辑，确保退出动画能播完
    useEffect(() => {
        let timer: NodeJS.Timeout;
        let frameId: number;

        if (isCartOpen) {
            setShouldRender(true);

            // 使用 double requestAnimationFrame 确保浏览器感知到初始位置
            frameId = requestAnimationFrame(() => {
                frameId = requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        } else {
            setIsAnimating(false);
            // 退出动画：500ms 后卸载组件
            timer = setTimeout(() => {
                setShouldRender(false);
            }, 500);
        }

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(frameId);
        };
    }, [isCartOpen]);

    // 锁定背景滚动
    useEffect(() => {
        if (isCartOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isCartOpen]);

    if (!shouldRender) return null;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden">
            {/* 背景遮罩 */}
            <div
                className={`fixed inset-0 bg-[rgb(var(--background))]/90 backdrop-blur-sm transition-opacity duration-300 ease-linear ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* 侧边面板 */}
            <div
                className={`relative h-[100dvh] w-full max-w-md bg-background shadow-[0_0_50px_rgba(0,0,0,0.1)] 
                transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${
                    isAnimating ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header 优化 */}
                <div className="p-8 border-b border-border/40 flex items-center justify-between bg-muted/5">
                    <div className={`flex items-center gap-4 transition-all duration-700 delay-100 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        {/* 用户头像与信息 */}
                        {isLoggedIn && user?.avatarUrl ? (
                            <div className="w-10 h-10 rounded-full border border-gold/30 overflow-hidden shadow-sm">
                                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center border border-border/40 text-muted">
                                <User size={20} strokeWidth={1.5} />
                            </div>
                        )}
                        <div className="flex flex-col text-left">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em]">
                                {isLoggedIn ? user.displayName : 'Guest Session'}
                            </h2>
                            {isLoggedIn && (
                                <span className="text-[9px] text-gold/80 font-mono tracking-tighter">
                                    ID: {user.accountNo}
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:rotate-90 transition-transform duration-500 text-muted hover:text-foreground"
                    >
                        <X size={24} strokeWidth={1} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">

                    {/* 1. 当前币种结算区 */}
                    <section className="p-8">

                        <div className="flex justify-between items-end mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gold">
                                Current Checkout ({currentCurrencyCode})
                            </h3>
                            <span className="text-[10px] font-serif italic text-gold">{activeItems.length} items</span>
                        </div>

                        {activeItems.length > 0 ? (
                            <div className="space-y-6">
                                {activeItems.map((item) => (
                                    <div key={item.cartItemId} className="flex items-center gap-4 group">
                                        {/* 自定义 Checkbox */}
                                        <button
                                            onClick={() => toggleSelect(item.cartItemId)}
                                            className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center shrink-0
                                                ${item.selected ? 'bg-gold border-gold' : 'border-border bg-transparent'}`}
                                        >
                                            {item.selected && <div className="w-2 h-2 bg-background rounded-full" />}
                                        </button>

                                        {/* 商品内容卡片 */}
                                        <div className={`flex flex-1 gap-4 transition-opacity ${!item.selected ? 'opacity-40' : ''}`}>
                                            <div className="w-20 h-24 bg-muted/10 rounded-lg overflow-hidden shrink-0">
                                                <img src={item.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider">{item.name}</h4>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {item.selectedAttributes.map((attr, i) => (
                                                            <span key={i} className="text-[9px] text-muted uppercase">
                                                                {attr.keyLabel} {attr.valueLabel}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    {/* 数量调节器 */}
                                                    <div className="flex items-center gap-3 border border-border/40 rounded-full px-2 py-1">
                                                        <button onClick={() => updateQuantity(item.cartItemId, -1)} className="text-muted hover:text-foreground">-</button>
                                                        <span className="text-[10px] font-mono w-4 text-center">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.cartItemId, 1)} className="text-muted hover:text-foreground">+</button>
                                                    </div>
                                                    <p className="font-serif italic text-sm text-gold">{item.currencyCode} {item.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center border border-dashed border-border/20 rounded-2xl opacity-40">
                                <p className="text-[9px] uppercase tracking-widest">No items for this currency</p>
                            </div>
                        )}
                    </section>

                    {/* 2. 跨币种暂存区 (分区显示) */}
                    {otherCurrencyItems.length > 0 && (
                        <section className="p-8 bg-muted/5 border-t border-border">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted mb-6">
                                Saved in other currencies
                            </h3>
                            <div className="space-y-4">
                                {otherCurrencyItems.map((item) => (
                                    <div key={item.cartItemId} className="flex items-center gap-4 opacity-50 grayscale">
                                        <div className="w-12 h-14 bg-muted/20 rounded shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold uppercase">{item.name}</p>
                                            <p className="text-[9px] text-gold">{item.currencyCode} {item.price}</p>
                                        </div>
                                        {/* 引导切换币种的按钮 */}
                                        <button
                                            onClick={() => {/* 逻辑：设置全局币种为 item.currencyCode */}}
                                            className="text-[8px] border border-gold/30 text-gold px-2 py-1 rounded-full hover:bg-gold hover:text-background transition-all"
                                        >
                                            Switch to {item.currencyCode}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="px-8"><hr className="border-border" /></div>

                    {/* 2. 账户与功能区 (Grid Menu) */}
                    <section className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted">Personal Space</h3>

                            {isLoggedIn && (
                                <span className="text-[9px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                    Member
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {/* 动态显示：登录/注册 或 账户/注销 */}
                            {!isLoggedIn ? (
                                <>
                                    <Link href={`/${lang}/login`} onClick={() => setIsCartOpen(false)} className="flex flex-col items-center justify-center p-6 bg-muted/5 border border-border/40 rounded-2xl hover:border-gold transition-all group">
                                        <LogIn size={22} strokeWidth={1.5} className="text-muted group-hover:text-gold mb-3" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Sign In</span>
                                    </Link>
                                    <Link href={`/${lang}/register`} onClick={() => setIsCartOpen(false)} className="flex flex-col items-center justify-center p-6 bg-muted/5 border border-border/40 rounded-2xl hover:border-gold transition-all group">
                                        <UserPlus size={22} strokeWidth={1.5} className="text-muted group-hover:text-gold mb-3" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Join Us</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={`/${lang}/account/profile`} onClick={() => setIsCartOpen(false)} className="flex flex-col items-center justify-center p-6 bg-muted/5 border border-border/40 rounded-2xl hover:border-gold transition-all group">
                                        <User size={22} strokeWidth={1.5} className="text-muted group-hover:text-gold mb-3" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Profile</span>
                                    </Link>
                                    <button onClick={() => globalSignOut()} className="flex flex-col items-center justify-center p-6 bg-muted/5 border border-border/40 rounded-2xl hover:border-red-400 transition-all group">
                                        <LogOut size={22} strokeWidth={1.5} className="text-muted group-hover:text-red-400 mb-3" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter">Log Out</span>
                                    </button>
                                </>
                            )}

                            {/* 收藏与订单 - 始终显示 */}
                            <Link href={`/${lang}/account/wishlist`} onClick={() => setIsCartOpen(false)} className="flex flex-col items-center justify-center p-6 bg-muted/5 border border-border/40 rounded-2xl hover:border-gold transition-all group">
                                <Heart size={22} strokeWidth={1.5} className="text-muted group-hover:text-gold mb-3" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Wishlist</span>
                            </Link>
                            <Link href={`/${lang}/account/orders`} onClick={() => setIsCartOpen(false)} className="flex flex-col items-center justify-center p-6 bg-muted/5 border border-border/40 rounded-2xl hover:border-gold transition-all group">
                                <ClipboardList size={22} strokeWidth={1.5} className="text-muted group-hover:text-gold mb-3" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Orders</span>
                            </Link>
                        </div>
                    </section>
                </div>

                {/* Footer 仅针对当前选中的 active + selected 结算 */}
                {activeItems.length > 0 && (
                    <div className="p-8 border-t border-border/40 bg-background">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted">Estimated Total</span>
                                <span className="text-[9px] text-gold/60 uppercase">Currency: {currentCurrencyCode}</span>
                            </div>
                            <span className="text-xl font-serif italic text-gold">
                                {selectedCurrency.symbol}{selectedTotal.toLocaleString()}
                            </span>
                        </div>
                        <button
                            onClick={handleProceed}
                            disabled={selectedTotal === 0}
                            className="w-full bg-foreground text-background py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold disabled:bg-muted disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                        >
                            Proceed with {currentCurrencyCode} {selectedTotal > 0 && `(${selectedTotal})`}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}