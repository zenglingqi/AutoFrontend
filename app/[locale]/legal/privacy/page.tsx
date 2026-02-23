import { getMessages } from "next-intl/server";
import {
    ShieldCheck, Database, Facebook, Lock,
    CreditCard, UserCheck, Trash2, Mail, MapPin
} from "lucide-react";

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages({ locale });

    // 按照 LoginPage 相同的取值逻辑提取 privacy 配置
    const p = (messages as any).privacy || {};

    return (
        <main className="min-h-screen bg-background py-32 px-6">
            <div className="max-w-4xl mx-auto space-y-20">

                {/* 页面头部 */}
                <header className="space-y-6 text-center">
                    <div className="flex justify-center">
                        <ShieldCheck size={48} strokeWidth={1} className="text-gold" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-serif italic text-4xl md:text-5xl text-foreground">
                            {p.title}
                        </h1>
                        <p className="max-w-2xl mx-auto text-[10px] uppercase tracking-[0.2em] text-gold font-medium leading-relaxed">
                            {p.subtitle}
                        </p>
                        <p className="text-[10px] text-muted opacity-50">
                            {p.lastUpdated}: 2026-02-17
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* 左侧导航索引 (桌面端显示) */}
                    <aside className="hidden md:block md:col-span-3 sticky top-32 h-fit space-y-4">
                        <nav className="flex flex-col gap-3 text-[10px] uppercase tracking-widest text-muted">
                            <a href="#entity" className="hover:text-gold transition-colors">1. {p.sections?.entity?.title?.split(' ')[1]}</a>
                            <a href="#collection" className="hover:text-gold transition-colors">2. {p.sections?.collection?.title?.split(' ')[1]}</a>
                            <a href="#fb" className="hover:text-gold transition-colors text-blue-500">3. FACEBOOK</a>
                            <a href="#security" className="hover:text-gold transition-colors">4. {p.sections?.security?.title?.split(' ')[1]}</a>
                            <a href="#payment" className="hover:text-gold transition-colors">5. {p.sections?.payment?.title?.split(' ')[1]}</a>
                        </nav>
                    </aside>

                    {/* 右侧正文内容 */}
                    <div className="md:col-span-9 space-y-24">

                        {/* 1. 实体信息 */}
                        <section id="entity" className="space-y-4">
                            <h2 className="font-serif italic text-2xl text-foreground border-b border-gold/10 pb-2">
                                {p.sections?.entity?.title}
                            </h2>
                            <p className="text-sm text-muted leading-relaxed font-light"
                               dangerouslySetInnerHTML={{ __html: p.sections?.entity?.body }} />
                        </section>

                        {/* 2. 数据收集 */}
                        <section id="collection" className="space-y-6">
                            <h2 className="font-serif italic text-2xl text-foreground border-b border-gold/10 pb-2">
                                {p.sections?.collection?.title}
                            </h2>
                            <p className="text-sm text-foreground">{p.sections?.collection?.intro}</p>
                            <ul className="space-y-4 text-sm text-muted font-light">
                                <li className="flex gap-3">
                                    <Database size={16} className="text-gold shrink-0 mt-1" />
                                    <span dangerouslySetInnerHTML={{ __html: p.sections?.collection?.identifiers }} />
                                </li>
                                <li className="flex gap-3">
                                    <UserCheck size={16} className="text-gold shrink-0 mt-1" />
                                    <span dangerouslySetInnerHTML={{ __html: p.sections?.collection?.auth }} />
                                </li>
                            </ul>
                        </section>

                        {/* 3. Facebook 数据删除 (核心合规部分) */}
                        <section id="fb" className="p-8 bg-blue-50/30 border border-blue-100 rounded-sm space-y-6">
                            <div className="flex items-center gap-3 text-blue-600">
                                <Facebook size={24} />
                                <h2 className="font-bold uppercase tracking-widest text-sm">
                                    {p.sections?.fbDeletion?.title}
                                </h2>
                            </div>
                            <p className="text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: p.sections?.fbDeletion?.intro }} />

                            <div className="space-y-4 pt-4">
                                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                    {p.sections?.fbDeletion?.howToTitle}
                                </h3>
                                <div className="space-y-3 text-[13px] text-slate-600">
                                    <p>1. {p.sections?.fbDeletion?.step1}</p>
                                    <p>2. {p.sections?.fbDeletion?.step2}</p>
                                    <p>3. {p.sections?.fbDeletion?.step3}</p>
                                    <p>4. {p.sections?.fbDeletion?.step4}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-blue-100">
                                <h3 className="text-xs font-bold text-slate-800 uppercase mb-2">{p.sections?.fbDeletion?.manualTitle}</h3>
                                <p className="text-[13px] text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: p.sections?.fbDeletion?.manualBody }} />
                            </div>
                        </section>

                        {/* 4. 安全与加密 */}
                        <section id="security" className="space-y-6">
                            <h2 className="font-serif italic text-2xl text-foreground border-b border-gold/10 pb-2">
                                {p.sections?.security?.title}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted font-light">
                                <div className="space-y-2">
                                    <Lock size={18} className="text-gold" />
                                    <p>{p.sections?.security?.storage}</p>
                                </div>
                                <div className="space-y-2">
                                    <ShieldCheck size={18} className="text-gold" />
                                    <p dangerouslySetInnerHTML={{ __html: p.sections?.security?.zeroSale }} />
                                </div>
                            </div>
                        </section>

                        {/* 5. 支付交易 */}
                        <section id="payment" className="space-y-6">
                            <h2 className="font-serif italic text-2xl text-foreground border-b border-gold/10 pb-2">
                                {p.sections?.payment?.title}
                            </h2>
                            <div className="flex items-center gap-6 opacity-60 grayscale mb-4">
                                <CreditCard size={32} />
                                <span className="text-xs uppercase tracking-widest font-bold">Stripe & PayPal Verified</span>
                            </div>
                            <p className="text-sm text-muted italic border-l-2 border-gold/20 pl-6">
                                {p.sections?.payment?.quote}
                            </p>
                        </section>

                        {/* 6. 您的权利 */}
                        <section id="rights" className="space-y-6">
                            <h2 className="font-serif italic text-2xl text-foreground border-b border-gold/10 pb-2">
                                {p.sections?.rights?.title}
                            </h2>
                            <div className="grid gap-4">
                                <div className="p-4 bg-gold/5 border border-gold/10">
                                    <p className="text-sm font-bold text-foreground mb-1">{p.sections?.rights?.erasure?.split('：')[0]}</p>
                                    <p className="text-xs text-muted">{p.sections?.rights?.erasure?.split('：')[1]}</p>
                                </div>
                                <button className="flex items-center gap-2 text-[10px] text-gold uppercase tracking-[0.2em] font-bold hover:underline">
                                    <Trash2 size={12} /> {p.sections?.rights?.linkText}
                                </button>
                            </div>
                        </section>

                        {/* 联系信息 */}
                        <footer className="pt-20 border-t border-gold/10 space-y-10">
                            <div className="text-center">
                                <h2 className="font-serif italic text-2xl text-foreground mb-2">{p.contact?.title}</h2>
                                <p className="text-xs text-muted tracking-widest uppercase">{p.contact?.subtitle}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <MapPin size={18} className="text-gold shrink-0 mt-1" />
                                        <div className="text-[13px] font-light">
                                            <p className="font-bold text-foreground mb-1">{p.contact?.headquarters}</p>
                                            <p className="text-muted leading-relaxed">{p.contact?.addressDetail}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <Mail size={18} className="text-gold shrink-0 mt-1" />
                                        <div className="text-[13px] font-light">
                                            <p className="font-bold text-foreground mb-1">{p.contact?.email}</p>

                                            <a href={`mailto:${process.env.NEXT_PUBLIC_MAILE_ADDRESS}`} className="text-gold hover:underline">{process.env.NEXT_PUBLIC_MAILE_ADDRESS}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-[10px] text-muted opacity-40 pt-10">
                                © 2026 {process.env.NEXT_PUBLIC_COMPANY}. All Rights Reserved.
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </main>
    );
}