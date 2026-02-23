import { getMessages } from "next-intl/server";

import { Cookie, ShieldCheck, MousePointerClick, HelpCircle, Mail } from "lucide-react";




export default async function CookiePolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages({ locale });

    // 按照你要求的格式取值
    const cookieMessages = (messages as any).cookie || {};

    return (
        <main className="min-h-screen bg-background py-32 px-6">
            <div className="max-w-3xl mx-auto space-y-16">

                {/* 头部 - 对应 YAML: title, subtitle */}
                <header className="space-y-4 text-center">
                    <div className="flex justify-center opacity-40 text-gold mb-4">
                        <Cookie size={40} strokeWidth={1} />
                    </div>
                    <h1 className="font-serif italic text-4xl md:text-5xl text-foreground">
                        {cookieMessages.title}
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium">
                        {cookieMessages.subtitle}
                    </p>
                </header>

                {/* 概述 - 对应 YAML: intro */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-gold/10" />
                        <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold">
                            {cookieMessages.intro?.title}
                        </h2>
                        <div className="h-[1px] flex-1 bg-gold/10" />
                    </div>
                    <p className="text-sm leading-relaxed text-muted font-light text-center md:text-left">
                        {cookieMessages.intro?.body}
                    </p>
                </section>

                {/* Cookie 类型 - 对应 YAML: types */}
                <section className="space-y-10">
                    <h2 className="font-serif italic text-2xl text-foreground border-b border-gold/5 pb-4">
                        {cookieMessages.types?.title}
                    </h2>

                    <div className="grid gap-12">
                        {/* 必要性 Cookie */}
                        <div className="flex gap-6 group">
                            <ShieldCheck className="text-gold/30 shrink-0 mt-1" size={20} />
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                                    {cookieMessages.types?.essential?.title}
                                </h3>
                                <p className="text-[13px] leading-relaxed text-muted font-light">
                                    {cookieMessages.types?.essential?.body}
                                </p>
                            </div>
                        </div>

                        {/* 性能 Cookie */}
                        <div className="flex gap-6 group">
                            <MousePointerClick className="text-gold/30 shrink-0 mt-1" size={20} />
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                                    {cookieMessages.types?.performance?.title}
                                </h3>
                                <p className="text-[13px] leading-relaxed text-muted font-light">
                                    {cookieMessages.types?.performance?.body}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 常见问题 - 对应 YAML: faq */}
                <section className="space-y-8 p-8 bg-card-soft border border-gold/5 rounded-sm">
                    <h2 className="font-serif italic text-xl text-gold flex items-center gap-2">
                        <HelpCircle size={18} /> {cookieMessages.faq?.title}
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-foreground">Q: {cookieMessages.faq?.q1}</p>
                            <p className="text-sm text-muted font-light">A: {cookieMessages.faq?.a1}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-foreground">Q: {cookieMessages.faq?.q2}</p>
                            <p className="text-sm text-muted font-light">A: {cookieMessages.faq?.a2}</p>
                        </div>
                    </div>
                </section>

                {/* 联系我们 - 对应 YAML: contact */}
                <footer className="pt-12 border-t border-gold/10 text-center space-y-4">
                    <div className="flex justify-center text-gold/40">
                        <a
                            href={`mailto:${process.env.NEXT_PUBLIC_MAILE_ADDRESS}`}
                            className="text-serif italic text-gold text-1xl hover:text-foreground transition-colors inline-flex items-center gap-3 font-light"
                        >
                            <Mail size={18} /> {process.env.NEXT_PUBLIC_MAILE_ADDRESS}
                        </a>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                        {cookieMessages.contact?.title}
                    </p>
                    <p className="text-sm text-foreground font-light">
                        {cookieMessages.contact?.body}
                    </p>
                </footer>
            </div>
        </main>
    );
}