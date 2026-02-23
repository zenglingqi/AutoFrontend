// @/components/Header/MobileCurrencyDrawer.tsx
import { X, Check } from 'lucide-react';
import { CURRENCIES } from '@/constants/currencies';
import { useCurrency } from "@/components/Providers/CurrencyProvider";

export default function MobileCurrencyDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { selectedCurrency, setCurrency } = useCurrency();

    return (
        <>
            {/* 遮罩层 */}
            <div
                className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            {/* 抽屉面板 */}
            <div
                className={`fixed bottom-0 left-0 w-full bg-[rgb(var(--background))] rounded-t-[2.5rem] z-[101] transition-transform duration-500 ease-out flex flex-col max-h-[85vh] ${
                    isOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                {/* 固定头部 - 不随滚动条移动 */}
                <div className="flex justify-between items-center p-8 pb-4">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-muted">Select Currency</span>
                    <button onClick={onClose} className="p-2 bg-muted/10 rounded-full"><X size={18} /></button>
                </div>

                {/* 可滚动区域 */}
                <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                    <div className="grid gap-3">
                        {CURRENCIES.map((cur) => (
                            <button
                                key={cur.code}
                                onClick={() => { setCurrency(cur.code); onClose(); }}
                                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                                    selectedCurrency.code === cur.code ? 'border-gold bg-gold/5 shadow-sm' : 'border-border/10 bg-muted/5'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="font-emoji text-xl">{cur.emoji}</span>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-bold">{cur.code}</span>
                                        <span className="text-[10px] text-muted italic font-serif">{cur.symbol}</span>
                                    </div>
                                </div>
                                {selectedCurrency.code === cur.code && <Check size={16} className="text-gold" />}
                            </button>
                        ))}
                    </div>
                    {/* 底部适配全面屏手势的留白 */}
                    <div className="h-4" />
                </div>
            </div>
        </>
    );
}