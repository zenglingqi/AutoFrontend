// @/components/Footer/index.tsx
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getTranslations, getMessages } from 'next-intl/server';
import NextImage from 'next/image';
import NewsletterForm from './NewsletterForm';

// 导入图标（保持不变）
import visaLight from "@/public/icons/Pay/visa.png"
import mastercardLight from "@/public/icons/Pay/Master.png"
import amexLight from "@/public/icons/Pay/AM express.png"
import paypalLight from "@/public/icons/Pay/PayPal.png"
import unionpayLight from "@/public/icons/Pay/UnionPay.png"
import applepayLight from "@/public/icons/Pay/Apple pay light.png"
import cardLight from "@/public/icons/Pay/Card-light.png"
import JCBLight from "@/public/icons/Pay/JCB.png"

export default async function Footer() {
    // 在服务端获取翻译
    const t = await getTranslations('footer');
    const messages = await getMessages() as any;

    const sections = messages.footer?.sections || [];
    const legalBottom = messages.footer?.legal_bottom || [];
    const branding = messages.footer?.branding;
    const currentYear = new Date().getFullYear();

    const paymentIcons: Record<string, any> = {
        Visa: visaLight,
        MasterCard: mastercardLight,
        AMEX: amexLight,
        PayPal: paypalLight,
        UnionPay: unionpayLight,
        ApplePay: applepayLight,
        Card: cardLight,
        JCB: JCBLight
    };

    return (
        <footer className="bg-background border-t border-border/5 pt-24 pb-12 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-8 md:px-16">

                {/* 上层：品牌与导航 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">

                    {/* 品牌描述 (4/12) */}
                    <div className="lg:col-span-4 flex flex-col items-start">
                        <span className="text-xl font-black tracking-[0.2em] mb-8 italic">
                            {branding?.name}
                        </span>
                        <p className="text-muted/60 text-sm leading-relaxed mb-10 max-w-sm font-serif italic">
                            {branding?.description}
                        </p>
                        <div className="flex gap-8">
                            <Instagram size={18} className="text-muted/40 hover:text-gold cursor-pointer transition-colors" />
                            <Facebook size={18} className="text-muted/40 hover:text-gold cursor-pointer transition-colors" />
                            <Twitter size={18} className="text-muted/40 hover:text-gold cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* 动态导航链接 (5/12) */}
                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-12">
                        {sections.map((section: any) => (
                            <div key={section.id} className="flex flex-col gap-6">
                                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-muted/30">
                                    {section.title}
                                </h4>
                                <ul className="flex flex-col gap-4">
                                    {section.links.map((link: any) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className="text-xs text-muted/60 hover:text-gold transition-colors duration-300">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* 订阅区块 (3/12) */}
                    <div className="lg:col-span-3">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-muted/30 mb-8">
                            {t('title')}
                        </h4>
                        <p className="text-xs text-muted/50 mb-8 leading-relaxed">
                            {t('subtitle')}
                        </p>
                        <NewsletterForm t={t} />
                    </div>
                </div>

                {/* 下层：支付图标与版权 */}
                <div className="pt-12 border-t border-border/5">
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
                        {Object.keys(paymentIcons).map((key) => (
                            <div key={key} className="group relative flex flex-col items-center">
                                <NextImage
                                    src={paymentIcons[key]}
                                    alt={key}
                                    height={20}
                                    className="h-5 w-auto grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                />
                                <span className="absolute -bottom-6 text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300 text-muted-foreground">
                                    {key}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="order-3 md:order-1 text-[9px] uppercase tracking-[0.4em] text-muted/40 font-black">
                            © {currentYear} {branding?.name}. All rights reserved.
                        </p>
                        <div className="order-2 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[9px] uppercase tracking-[0.3em] font-black text-muted/60">
                            {legalBottom.map((item: any) => (
                                <Link key={item.href} href={item.href} className="hover:text-gold transition-colors">
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}