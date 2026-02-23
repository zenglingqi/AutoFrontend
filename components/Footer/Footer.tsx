'use client';

import { Instagram, Facebook, Twitter, Mail, ArrowRight } from 'lucide-react';

import { Link } from '@/i18n/navigation'; // 确保使用带 locale 自动处理的 Link
import { useTranslations, useMessages } from 'next-intl';


import { StaticImageData } from 'next/image';
import NextImage from 'next/image';

import visaLight from "@/public/icons/Pay/visa.png"
import visaDark from "@/public/icons/Pay/visa dark.png"
import mastercardLight from "@/public/icons/Pay/Master.png"
import amexLight from "@/public/icons/Pay/AM express.png"
//import wechatLight from "@/public/icons/Pay/WeChatPay.png"
//import alipayLight from "@/public/icons/Pay/alipay.png"
import paypalLight from "@/public/icons/Pay/PayPal.png"
import paypalDark from "@/public/icons/Pay/PayPal Dark.png"

import unionpayLight from "@/public/icons/Pay/UnionPay.png"
import applepayLight from "@/public/icons/Pay/Apple pay light.png"
import applepaydark from "@/public/icons/Pay/Apple pay dark.png"
import cardLight from "@/public/icons/Pay/Card-light.png"
import cardDark from "@/public/icons/Pay/Card-dark.png"
import JCBLight from "@/public/icons/Pay/JCB.png"
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";





export type PaymentAssetKey =
    | "Visa"
    | "MasterCard"
    | "AMEX"
    | "PayPal"
    | "UnionPay"
    | "ApplePay"
    | "Card"
    | "JCB";
    //| "WeChat Pay"
    //| "Alipay";

export const PAYMENT_ASSETS: Record<
    PaymentAssetKey,
    { light: StaticImageData; dark: StaticImageData; alt: string }
> = {
    Visa: { light: visaLight, dark: visaDark, alt: "Visa" },
    MasterCard: { light: mastercardLight, dark: mastercardLight, alt: "MasterCard" },
    AMEX: { light: amexLight, dark: amexLight, alt: "AMEX" },
    PayPal: { light: paypalLight, dark: paypalDark, alt: "PayPal" },
    UnionPay: { light: unionpayLight, dark: unionpayLight, alt: "UnionPay" },
    ApplePay: { light: applepayLight, dark: applepaydark, alt: "Apple Pay" },
    Card: { light: cardLight, dark: cardDark, alt: "Card" },
    JCB: { light: JCBLight, dark: JCBLight, alt: "JCB" },
    //"WeChat Pay": { light: wechatLight, dark: wechatLight, alt: "WeChat Pay" },
    //Alipay: { light: alipayLight, dark: alipayLight, alt: "Alipay" },
};




export default function Footer() {

    //const [isDarkMode, setIsDarkMode] = useState(false);
    //useEffect(() => {
    //    setIsDarkMode(document.documentElement.classList.contains('dark'));
    //}, []);

    const t = useTranslations('footer');
    const messages = useMessages() as any;
    const currentYear = new Date().getFullYear();

    const paymentKeys = Object.keys(PAYMENT_ASSETS) as PaymentAssetKey[];
    // 直接从 yaml 数据中获取 section 数组
    const sections = messages.footer?.sections || [];
    const legalBottom = messages.footer?.legal_bottom || [];

    // Footer.tsx 内部逻辑
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false); // 新增加载状态

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || loading) return; // 防止重复提交

        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_BACKEND_API || '';

        try {
            // 实现订阅接口调用
            const response = await fetch(`${apiBase}/api/user/subscript/${encodeURIComponent(email)}`, {
                method: 'POST',
            });

            if (response.ok) {
                setSubmitted(true);
                setEmail(""); // 提交成功后清空
                setTimeout(() => setSubmitted(false), 5000); // 5秒后重置成功提示
            }
        } catch (error) {
            console.error("Subscription Error:", error);
        } finally {
            setLoading(false); // 结束加载状态
        }
    };

    // 社交图标映射表（仅内部逻辑使用）
    const IconMap: Record<string, any> = {
        Instagram: Instagram,
        Facebook: Facebook,
        Twitter: Twitter,
    };


    return (
        <footer className="bg-background text-foreground pt-24 pb-12 border-t border-border/20">
            <div className="max-w-[1640px] mx-auto px-9 md:px-12">

                {/* Top Section: Branding & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">

                    {/* Brand Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <h2 className="text-3xl font-serif italic tracking-tighter">
                            Maison <span className="not-italic font-sans font-light tracking-[0.2em]">LUMIÈRE</span>
                        </h2>
                        <p className="text-sm leading-relaxed text-muted/80 max-w-sm font-medium">
                            {t('branding.description')}
                        </p>
                        <div className="flex gap-6 text-foreground/60">
                            {(messages.footer?.branding?.socials || []).map((social: any) => {
                                const Icon = IconMap[social.platform];
                                return (
                                    <a key={social.platform} href={social.href} className="hover:text-gold transition-colors">
                                        {Icon && <Icon size={20} strokeWidth={1.5} />}
                                    </a>
                                );
                            })}
                        </div>

                    </div>


                    {/* Quick Links - 将 col-span 从 3 调整为 5，并优化网格 */}
                    <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
                        {sections.map((section: any) => (
                            <div key={section.id} className="space-y-4">
                                <h3 className="text-[10px]  tracking-[0.4em] font-black text-foreground/40 italic whitespace-nowrap">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link: any) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className="text-[11px] tracking-[0.1em] font-bold text-muted hover:text-gold transition-colors block">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>


                    {/* Newsletter Subscription */}
                    <div className="lg:col-span-4 space-y-3">

                    </div>



                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7 flex flex-col lg:items-end justify-center"
                    >
                        <div className="w-full max-w-md">
                            {/* 1. 标题优化：增加层次感与品牌调性 */}
                            <div className="mb-10">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-foreground/40 block mb-2">
                                    Newsletter
                                </span>
                                <h4 className="text-2xl text-muted font-bold uppercase tracking-tighter leading-none">
                                    {t('newsletter.title')} <br />
                                    <span className="italic font-serif font-light text-xl normal-case tracking-normal opacity-60">
                                        & Exclusive Perks
                                    </span>
                                </h4>
                            </div>

                            <form onSubmit={handleSubscribe} className="relative group">
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        placeholder={t('newsletter.placeholder')}
                                        onChange={e => { setEmail(e.target.value); setSubmitted(false) }}
                                        className="w-full bg-transparent pb-4 text-sm tracking-widest outline-none
                                         border-b border-black/10 dark:border-white/10

                                         placeholder:opacity-30 placeholder:italic"
                                                            />
                                            <motion.div
                                                className="absolute bottom-0 left-0 h-[1px] bg-gold origin-left"
                                                initial={{ scaleX: 0 }}
                                                animate={email ? { scaleX: 1 } : { scaleX: 0 }}
                                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                            />
                                        </div>

                                        {/* 增强点击感的按钮 */}
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileTap={{ scale: 0.95 }} // 点击时的向内缩进效果
                                            className={`absolute right-0 bottom-4 flex items-center gap-2 group/btn 
                                                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <span className="text-[10px] font-black/20 text-foreground/70 block uppercase tracking-[0.2em] transition-all">
                                                {loading ? 'Subscribing...' : t('newsletter.cta')}
                                            </span>

                                    <AnimatePresence mode="wait">
                                        {loading ? (
                                            // 加载中：旋转的小圆圈
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0, rotate: 0 }}
                                                animate={{ opacity: 1, rotate: 360 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="w-3 h-3 border-2 border-gold border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            // 默认状态：带位移动画的箭头
                                            <motion.span
                                                key="arrow"
                                                className="text-lg leading-none text-gold"
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                            >
                                                →
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>

                                {/* 成功状态反馈 */}
                                <AnimatePresence>
                                    {submitted && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -bottom-8 right-0 text-[10px] text-emerald-500 font-bold uppercase tracking-widest"
                                        >
                                            {t('newsletter.success')}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </motion.div>

                </div>






                {/* Bottom Section: Legal & Copyright */}
                <div className="mt-16 pt-12 border-t border-border/10 flex flex-col gap-10">

                    {/* 上层：支付图标展示 - 居中且精致 */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 opacity-40 hover:opacity-100 transition-all duration-700 grayscale/60 hover:grayscale-0">
                        {paymentKeys.map((key) => {
                            const asset = PAYMENT_ASSETS[key];
                            return (
                                <div key={key} className="group relative flex flex-col items-center">
                                    <NextImage
                                        src={asset.light}
                                        alt={asset.alt}
                                        className="block dark:hidden h-3.5 w-auto object-contain"
                                    />
                                    <NextImage
                                        src={asset.dark}
                                        alt={asset.alt}
                                        className="hidden dark:block h-3.5 w-auto object-contain"
                                    />
                                    {/* Tooltip 效果：悬浮显示 YAML 翻译 */}
                                    <span className="absolute -bottom-6 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 text-muted-foreground">
                                        {t(key)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* 下层：法律条款与版权 - 两端对齐或三方分布 */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                        {/* 左侧：版权信息 */}
                        <p className="order-3 md:order-1 text-[9px] uppercase tracking-[0.4em] text-muted/40 font-black">
                            © {currentYear} Maison Lumière. All rights reserved.
                        </p>

                        {/* 右侧：法律链接 */}
                        <div className="order-2 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[9px] uppercase tracking-[0.3em] font-black text-muted/60">
                            {legalBottom.map((item: any) => (
                                <a key={item.href} href={item.href} className="hover:text-gold transition-colors duration-300">
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}