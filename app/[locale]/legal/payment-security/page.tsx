import { getMessages } from "next-intl/server";
import { ShieldCheck, Lock, CreditCard, Eye, HelpCircle, Mail, Globe, CheckCircle } from "lucide-react";

export default async function PaymentSecurityPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages({ locale });

    // 按照 LoginPage 相同的取值逻辑
    const paymentMessages = (messages as any).payment || {};

    return (
        <main className="min-h-screen bg-background py-32 px-6">
            <div className="max-w-4xl mx-auto space-y-20">

                {/* 头部装饰 - 强调安全与保护 */}
                <header className="space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="relative">
                            <ShieldCheck size={48} strokeWidth={1} className="text-gold" />
                            <Lock size={16} className="absolute bottom-0 right-0 text-gold bg-background rounded-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-serif italic text-4xl md:text-5xl text-foreground">
                            {paymentMessages.title}
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
                            {paymentMessages.subtitle}
                        </p>
                    </div>
                </header>

                {/* 概述 */}
                <section className="max-w-2xl mx-auto text-center space-y-4">
                    <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold">
                        {paymentMessages.intro?.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted font-light">
                        {paymentMessages.intro?.body}
                    </p>
                </section>

                {/* 核心安全措施 - 网格展示 */}
                <section className="space-y-12">
                    <h2 className="font-serif italic text-2xl text-foreground text-center">
                        {paymentMessages.how?.title}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {/* 加密传输 */}
                        <div className="space-y-3 group">
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                                    {paymentMessages.how?.encryption?.title}
                                </h3>
                            </div>
                            <p className="text-[13px] leading-relaxed text-muted font-light">
                                {paymentMessages.how?.encryption?.body}
                            </p>
                        </div>

                        {/* 令牌化 */}
                        <div className="space-y-3 group">
                            <div className="flex items-center gap-3">
                                <CreditCard size={18} className="text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                                    {paymentMessages.how?.tokenization?.title}
                                </h3>
                            </div>
                            <p className="text-[13px] leading-relaxed text-muted font-light">
                                {paymentMessages.how?.tokenization?.body}
                            </p>
                        </div>

                        {/* 合规标准 */}
                        <div className="space-y-3 group">
                            <div className="flex items-center gap-3">
                                <CheckCircle size={18} className="text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                                    {paymentMessages.how?.compliance?.title}
                                </h3>
                            </div>
                            <p className="text-[13px] leading-relaxed text-muted font-light">
                                {paymentMessages.how?.compliance?.body}
                            </p>
                        </div>

                        {/* 风控监测 */}
                        <div className="space-y-3 group">
                            <div className="flex items-center gap-3">
                                <Eye size={18} className="text-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                                    {paymentMessages.how?.monitoring?.title}
                                </h3>
                            </div>
                            <p className="text-[13px] leading-relaxed text-muted font-light">
                                {paymentMessages.how?.monitoring?.body}
                            </p>
                        </div>
                    </div>
                </section>

                {/* 支付安全建议 - 侧重操作性 */}
                <section className="bg-card-soft border border-gold/10 p-10 rounded-sm space-y-8">
                    <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-gold text-center">
                        {paymentMessages.tips?.title}
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            paymentMessages.tips?.use_secure_network,
                            paymentMessages.tips?.verify_url,
                            paymentMessages.tips?.strong_password,
                            paymentMessages.tips?.enable_2fa
                        ].map((tip, index) => (
                            <li key={index} className="flex items-start gap-3 text-[13px] text-muted font-light leading-relaxed">
                                <span className="text-gold mt-1">/</span> {tip}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* FAQ 部分 */}
                <section className="space-y-10 max-w-2xl mx-auto">
                    <h2 className="font-serif italic text-2xl text-foreground text-center flex items-center justify-center gap-3">
                        <HelpCircle size={20} className="text-gold" /> {paymentMessages.faq?.title}
                    </h2>
                    <div className="space-y-8">
                        <div className="space-y-2 border-l border-gold/20 pl-6">
                            <p className="text-xs font-bold text-foreground">Q: {paymentMessages.faq?.q1}</p>
                            <p className="text-[13px] text-muted font-light italic">A: {paymentMessages.faq?.a1}</p>
                        </div>
                        <div className="space-y-2 border-l border-gold/20 pl-6">
                            <p className="text-xs font-bold text-foreground">Q: {paymentMessages.faq?.q2}</p>
                            <p className="text-[13px] text-muted font-light italic">A: {paymentMessages.faq?.a2}</p>
                        </div>
                    </div>
                </section>

                {/* 页脚联系信息 */}
                <footer className="pt-16 border-t border-gold/10 text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                            {paymentMessages.contact?.title}
                        </p>
                        <a
                            href={`mailto:${process.env.NEXT_PUBLIC_MAILE_ADDRESS}`}
                            className="text-serif italic text-gold text-xl hover:text-foreground transition-colors inline-flex items-center gap-2"
                        >
                            <Mail size={16} /> {process.env.NEXT_PUBLIC_MAILE_ADDRESS}
                        </a>
                    </div>
                </footer>
            </div>
        </main>
    );
}