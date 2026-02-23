import { getMessages } from "next-intl/server";
import {
    RefreshCw, ShieldCheck, Truck,
    MessageCircle, UserCircle, Mail, Globe,
    Leaf, AlertCircle
} from "lucide-react";

export default async function ReturnPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages({ locale });

    // 按照 LoginPage 相同的取值逻辑提取 return 配置
    const r = (messages as any).return || {};

    return (
        <main className="min-h-screen bg-background py-32 px-6 text-foreground">
            <div className="max-w-4xl mx-auto space-y-20">

                {/* 页面头部 */}
                <header className="space-y-6 text-center">
                    <div className="flex justify-center opacity-40 text-gold mb-4">
                        <RefreshCw size={48} strokeWidth={1} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-serif italic text-4xl md:text-5xl">
                            {r.return_policy}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-green-700/60 uppercase tracking-widest text-[9px] font-bold">
                            <Leaf size={12} /> Carbon Neutral Commitment
                        </div>
                    </div>
                </header>

                {/* 品牌承诺与环保宣言 */}
                <section className="max-w-3xl mx-auto bg-card-soft border border-gold/10 p-10 rounded-sm space-y-6">
                    <p className="text-sm leading-relaxed text-muted font-light text-center italic">
                        "{r.commitment}"
                    </p>
                </section>

                {/* 核心政策：30天无忧退货 */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div className="space-y-6">
                        <h2 className="font-serif italic text-3xl text-foreground">
                            {r.hassle_free_30_days_return?.title}
                        </h2>
                        <p className="text-[13px] leading-relaxed text-muted font-light">
                            {r.hassle_free_30_days_return?.description}
                        </p>
                        <div className="flex gap-4 pt-4 border-t border-gold/5">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-gold">
                                    <Truck size={16} />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Free Shipping</span>
                                </div>
                                <p className="text-xs text-muted font-light">{r.free_shipping}</p>
                            </div>
                        </div>
                    </div>

                    {/* 排除条款 */}
                    <div className="bg-stone-50 p-8 border-l-2 border-gold/20 space-y-4">
                        <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-widest">
                            <AlertCircle size={14} className="text-gold" /> Exclusions
                        </div>
                        <p className="text-[13px] leading-relaxed text-muted font-light">
                            {r.hassle_free_30_days_return?.exclusions}
                        </p>
                    </div>
                </section>

                {/* 如何发起退货 - 选项网格 */}
                <section className="space-y-12">
                    <div className="text-center space-y-2">
                        <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold text-gold">How to Start</h2>
                        <p className="text-sm text-muted">{r.start_return?.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 选项 1: 个人订单页面 */}
                        <div className="p-8 border border-gold/5 hover:border-gold/20 transition-colors space-y-4">
                            <MessageCircle className="text-gold" size={24} strokeWidth={1.5} />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Online Request</h3>
                            <p className="text-[13px] leading-relaxed text-muted font-light">
                                {r.start_return?.options?.chat}
                            </p>
                        </div>

                        {/* 选项 2: 账户登录 */}
                        <div className="p-8 border border-gold/5 hover:border-gold/20 transition-colors space-y-4">
                            <UserCircle className="text-gold" size={24} strokeWidth={1.5} />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Account Login</h3>
                            <p className="text-[13px] leading-relaxed text-muted font-light">
                                {r.start_return?.options?.account_login}
                            </p>
                        </div>
                    </div>

                    {/* 补充说明区域 */}
                    <div className="space-y-6 text-[13px] text-muted font-light max-w-2xl mx-auto border-t border-gold/5 pt-8">
                        <p className="flex gap-3"><Globe size={16} className="shrink-0 text-gold/50" /> {r.start_return?.options?.create_account}</p>
                        <p className="flex gap-3"><Mail size={16} className="shrink-0 text-gold/50" /> {process.env.NEXT_PUBLIC_MAILE_ADDRESS}</p>
                        <p className="text-[11px] text-muted/60 italic pl-7">{r.start_return?.options?.cont_des}</p>
                    </div>
                </section>

                {/* 免费额度与权利滥用防御 */}
                <section className="bg-stone-900 text-stone-100 p-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-gold" size={20} />
                        <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold">Complimentary Returns</h2>
                    </div>
                    <p className="text-[13px] leading-relaxed text-stone-400 font-light">
                        {r.complimentary_returns?.description}
                    </p>
                </section>

                {/* 页脚联系方式 */}
                <footer className="pt-16 border-t border-gold/10 text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Customer Service</p>
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