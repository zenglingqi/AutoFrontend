import { getMessages } from "next-intl/server";
import {
    FileText, User, ShoppingBag, CreditCard,
    Truck, RefreshCcw, ShieldAlert, Scale, Mail
} from "lucide-react";

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages({ locale });

    // 按照与 LoginPage 相同的取值逻辑提取 terms 配置
    const t = (messages as any).terms || {};

    return (
        <main className="min-h-screen bg-background py-32 px-6">
            <div className="max-w-4xl mx-auto space-y-20">

                {/* 页面头部 */}
                <header className="space-y-6 text-center">
                    <div className="flex justify-center opacity-40 text-gold mb-4">
                        <FileText size={48} strokeWidth={1} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-serif italic text-4xl md:text-5xl text-foreground">
                            {t.title}
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
                            {t.subtitle}
                        </p>
                    </div>
                </header>

                {/* 导言部分 */}
                <section className="max-w-2xl mx-auto text-center space-y-4">
                    <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold">
                        {t.intro?.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted font-light italic">
                        "{t.intro?.body}"
                    </p>
                </section>

                {/* 条款正文 - 采用分块布局 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">

                    {/* 适用范围 */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Scale size={14} className="text-gold" /> {t.scope?.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-muted font-light">
                            {t.scope?.body}
                        </p>
                    </div>

                    {/* 账户与资格 */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <User size={14} className="text-gold" /> {t.account?.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-muted font-light">
                            {t.account?.body}
                        </p>
                    </div>

                    {/* 订单接受 */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <ShoppingBag size={14} className="text-gold" /> {t.orders?.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-muted font-light">
                            {t.orders?.body}
                        </p>
                    </div>

                    {/* 价格与税费 */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <CreditCard size={14} className="text-gold" /> {t.pricing?.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-muted font-light">
                            {t.pricing?.body}
                        </p>
                    </div>

                    {/* 运输与交付 */}
                    <div className="space-y-3 border-t border-gold/5 pt-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Truck size={14} className="text-gold" /> {t.shipping?.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-muted font-light">
                            {t.shipping?.body}
                        </p>
                    </div>

                    {/* 退货与退款 */}
                    <div className="space-y-3 border-t border-gold/5 pt-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <RefreshCcw size={14} className="text-gold" /> {t.returns?.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed text-muted font-light">
                            {t.returns?.body}
                        </p>
                    </div>
                </div>

                {/* 法律声明板块 - 使用深色卡片强调 */}
                <section className="bg-card-soft border border-gold/10 p-10 rounded-sm space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold flex items-center gap-2">
                                <ShieldAlert size={14} /> {t.intellectual_property?.title}
                            </h3>
                            <p className="text-[13px] leading-relaxed text-muted font-light">
                                {t.intellectual_property?.body}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold flex items-center gap-2">
                                <Scale size={14} /> {t.limitation?.title}
                            </h3>
                            <p className="text-[13px] leading-relaxed text-muted font-light">
                                {t.limitation?.body}
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gold/5 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold">{t.governing_law?.title}</h3>
                            <p className="text-[13px] leading-relaxed text-muted font-light">{t.governing_law?.body}</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold">{t.changes?.title}</h3>
                            <p className="text-[13px] leading-relaxed text-muted font-light">{t.changes?.body}</p>
                        </div>
                    </div>
                </section>

                {/* 底部联系方式 */}
                <footer className="pt-16 border-t border-gold/10 text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                            {t.contact?.title}
                        </p>

                        <a
                            href={`mailto:${process.env.NEXT_PUBLIC_MAILE_ADDRESS}`}
                            className="text-serif italic text-gold text-1xl hover:text-foreground transition-colors inline-flex items-center gap-3 font-light"
                        >
                            <Mail size={18} /> {process.env.NEXT_PUBLIC_MAILE_ADDRESS}
                        </a>
                    </div>
                    <p className="text-[9px] text-muted opacity-40 uppercase tracking-widest pt-8">
                        © 2026 {process.env.NEXT_PUBLIC_COMPANY}. All Rights Reserved.
                    </p>
                </footer>
            </div>
        </main>
    );
}