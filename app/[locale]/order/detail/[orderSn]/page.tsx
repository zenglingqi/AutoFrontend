'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, MapPin, CreditCard, Clock, CheckCircle2,
    Truck, AlertCircle, ChevronLeft, ArrowRight, ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";
import StripePaymentWrapper from "@/components/Payment/StripePaymentWrapper";
import PayPalPaymentWrapper from "@/components/Payment/PayPalPaymentWrapper";

export default function OrderDetailPage() {
    const [shippingList, setShippingList] = useState<ShippingDetails[]>([]);
    const params = useParams();
    const router = useRouter();
    const orderSn = params.orderSn as string;
    const locale = params.locale as string;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPayOptions, setShowPayOptions] = useState(false);
    const [repayMethod, setRepayMethod] = useState<'stripe' | 'paypal'>('stripe');


    const [records, setRecords] = useState<PaymentRecord[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 并发获取订单详情和支付记录
                const [detailRes, recordsRes,shippingRes] = await Promise.all([
                    clientAPIFrame(`/api/orders/detail/${orderSn}`),
                    clientAPIFrame(`/api/payment-records/order/${orderSn}`), // 对应你的后端接口路径
                    clientAPIFrame(`/api/orders/shipping/${orderSn}`), //
                ]);

                const detailData = await detailRes.json();
                const recordsData = await recordsRes.json();
                const shippingData = await shippingRes.json();

                setOrder(detailData);
                setRecords(recordsData);
                setShippingList(shippingData.data || shippingData);

            } catch (err) {
                console.error("Fetch data error", err);
            } finally {
                setLoading(false);
            }
        };

        if (orderSn) fetchData();
    }, [orderSn]);

    // 状态样式映射
    const getStatusConfig = (status: string) => {
        const configs: Record<string, { label: string, icon: any, color: string, desc: string }> = {
            'PENDING': { label: 'Awaiting Payment', icon: Clock, color: 'text-gold', desc: 'Secure your sanctuary before the timer expires.' },
            'PAID': { label: 'Payment Confirmed', icon: ShieldCheck, color: 'text-green-500', desc: 'Your selection is being prepared for transit.' },
            'SHIPPED': { label: 'In Transit', icon: Truck, color: 'text-blue-400', desc: 'Your acquisition is on its way to your destination.' },
            'CANCELED': { label: 'Order Canceled', icon: AlertCircle, color: 'text-muted', desc: 'This transaction has been voided.' },
            'REFUND_REQUEST': { label: 'Refund Processing', icon: Clock, color: 'text-orange-400', desc: 'We are reviewing your return request.' }
        };
        return configs[status] || { label: status, icon: Package, color: 'text-gold', desc: 'Processing...' };
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-gold animate-pulse">RETRIVING ARCHIVES...</div>;
    if (!order) return <div className="min-h-screen flex items-center justify-center bg-background">Order not found.</div>;

    const statusInfo = getStatusConfig(order.status);

    return (
        <main className="min-h-screen bg-background py-24 px-6">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* 顶部导航 */}
                <button
                    onClick={() => router.push(`/${locale}/profile/orders`)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted hover:text-gold transition-colors"
                >
                    <ChevronLeft size={14} /> Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* 左侧：详细内容 */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* 1. 状态展示区 */}
                        <section className="p-8 border border-gold/10 bg-card-soft rounded-sm space-y-4">
                            <div className="flex items-center gap-3">
                                <statusInfo.icon className={statusInfo.color} size={24} />
                                <h2 className={`font-serif italic text-3xl ${statusInfo.color}`}>{statusInfo.label}</h2>
                            </div>
                            <p className="text-xs text-muted leading-relaxed max-w-md">{statusInfo.desc}</p>





                            {/* 核心功能：PENDING 状态下的支付按钮 */}
                            {order.status === 'PENDING' && !showPayOptions && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setShowPayOptions(true)}
                                    className="mt-4 px-10 py-4 bg-gold text-background text-[10px] font-black uppercase tracking-[0.2em] rounded-full"
                                >
                                    Proceed to Payment
                                </motion.button>
                            )}
                        </section>

                        {/* 2. 商品列表 */}
                        <section className="space-y-6">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Items Secured</h3>
                            <div className="divide-y divide-gold/5 border-t border-gold/5">
                                {order.items.map((item) => (
                                    <div key={item.id} className="py-6 flex gap-6 items-center">
                                        <div className="relative w-20 h-24 bg-background border border-gold/5">
                                            <Image src={item.imageUrl} alt={item.productCode} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-xs font-medium uppercase tracking-wider">{item.productCode}</h4>

                                            <p className="text-[10px] text-muted">
                                                {Object.entries(JSON.parse(item.attributesJson))
                                                    .map(([key, val]) => `${key}: ${val}`)
                                                    .join(' / ')}
                                            </p>

                                            <p className="text-[10px] text-muted">QTY: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-serif italic text-gold">{order.currencyCode} {item.unitPrice.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>







                        {/* 支付历史板块 */}
                        <section className="space-y-6 pt-10 border-t border-gold/10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Transaction Logs</h3>
                                <span className="text-[9px] text-muted opacity-50">Audit Trail</span>
                            </div>

                            <div className="space-y-3">
                                {records.length === 0 ? (
                                    <div className="py-4 text-center border border-dashed border-gold/10 rounded-sm">
                                        <p className="text-[9px] text-muted uppercase tracking-widest italic">No transaction records found.</p>
                                    </div>
                                ) : (
                                    records.map((record) => (
                                        <div
                                            key={record.recordSn}
                                            className="group p-4 bg-card-soft border border-gold/5 hover:border-gold/20 transition-all rounded-sm space-y-3"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                                        record.status === 'SUCCESS' ? 'bg-green-500' :
                                                            record.status === 'FAILED' ? 'bg-red-500' : 'bg-gold animate-pulse'
                                                    }`} />
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-bold uppercase tracking-tight text-foreground">
                                                            {record.paymentProviderType} • {record.paymentMethodType}
                                                        </p>
                                                        <p className="text-[8px] text-muted tracking-tighter uppercase">
                                                            {new Date(record.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[11px] font-serif italic text-gold">
                                                        {record.payCurrencyCode} {parseFloat(record.payAmount).toLocaleString()}
                                                    </p>
                                                    <p className="text-[8px] text-muted font-mono opacity-60">
                                                        {record.recordSn.split('-').pop()} {/* 只显示SN后段缩写 */}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 额外信息：流水号或失败原因 */}
                                            {(record.providerTxnId || record.failReason) && (
                                                <div className="pt-2 border-t border-gold/5 flex flex-col gap-1">
                                                    {record.providerTxnId && (
                                                        <p className="text-[8px] text-muted flex items-center gap-1">
                                                            <span className="opacity-50 uppercase">Gateway ID:</span>
                                                            <span className="font-mono">{record.providerTxnId}</span>
                                                        </p>
                                                    )}
                                                    {record.status === 'FAILED' && record.failReason && (
                                                        <p className="text-[8px] text-red-400/80 flex items-center gap-1 italic">
                                                            <AlertCircle size={8} /> {record.failReason}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>




                    </div>

                    {/* 右侧：侧边信息栏 */}
                    <aside className="space-y-8">

                        {/* 3. 支付面板 (如果是 PENDING 且点击了支付) */}
                        <AnimatePresence>
                            {showPayOptions && order.status === 'PENDING' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-6 border border-gold/30 bg-gold/5 rounded-sm space-y-6"
                                >
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-center">Complete Acquisition</h4>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setRepayMethod('stripe')}
                                            className={`flex-1 py-3 text-[9px] uppercase tracking-widest border transition-all ${repayMethod === 'stripe' ? 'bg-gold text-background border-gold' : 'border-gold/20 text-gold'}`}
                                        >
                                            Card
                                        </button>
                                        <button
                                            onClick={() => setRepayMethod('paypal')}
                                            className={`flex-1 py-3 text-[9px] uppercase tracking-widest border transition-all ${repayMethod === 'paypal' ? 'bg-gold text-background border-gold' : 'border-gold/20 text-gold'}`}
                                        >
                                            PayPal
                                        </button>
                                    </div>

                                    {/* 动态加载对应的支付 Wrapper */}
                                    <div className="min-h-[200px]">
                                        {repayMethod === 'stripe' ? (
                                            <StripePaymentWrapper
                                                orderSn={order.orderSn}
                                                currency={order.currencyCode}
                                                locale={locale}
                                            />
                                        ) : (
                                            <PayPalPaymentWrapper
                                                orderSn={order.orderSn}
                                                currency={order.currencyCode}
                                                locale={locale}
                                            />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setShowPayOptions(false)}
                                        className="w-full text-[9px] uppercase tracking-widest text-muted hover:text-foreground pt-4 underline underline-offset-4"
                                    >
                                        Cancel & Review
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 4. 配送与费用汇总 */}
                        <div className="space-y-8 p-6 bg-card-soft border border-gold/5 rounded-sm">
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted flex items-center gap-2"><MapPin size={12}/> Destination</h4>
                                <div className="text-[11px] font-light leading-relaxed">
                                    <p className="font-bold">{order.addressSnapshot.firstName} {order.addressSnapshot.lastName}</p>
                                    <p className="opacity-70">{order.addressSnapshot.addressLine1}</p>
                                    <p className="opacity-70">{order.addressSnapshot.city}</p>
                                    <p className="opacity-70">{order.addressSnapshot.phone}</p>
                                </div>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-gold/10">
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted flex items-center gap-2">
                                    <CreditCard size={12}/> Financial Summary
                                </h4>

                                <div className="space-y-3">
                                    {/* 1. 原始总计 */}
                                    <div className="flex justify-between text-[11px] tracking-tight">
                                        <span className="text-muted/80">Order Subtotal</span>
                                        <span className="text-foreground font-medium">
                                        {order.currencyCode} {parseFloat(order.totalAmount).toLocaleString()}
                                    </span>
                                    </div>

                                    {/* 2. 优惠明细 (仅在有值时显示) */}
                                    {parseFloat(order.couponDiscount) > 0 && (
                                        <div className="flex justify-between text-[11px] tracking-tight text-gold/80 italic">
                                            <span>Coupon Discount</span>
                                            <span>-{order.currencyCode} {parseFloat(order.couponDiscount).toLocaleString()}</span>
                                        </div>
                                    )}

                                    {parseFloat(order.globalDiscount) > 0 && (
                                        <div className="flex justify-between text-[11px] tracking-tight text-gold/80 italic">
                                            <span>Seasonal Offer</span>
                                            <span>-{order.currencyCode} {parseFloat(order.globalDiscount).toLocaleString()}</span>
                                        </div>
                                    )}

                                    {/* 3. 分割线与实付金额 */}
                                    <div className="pt-3 border-t border-gold/5 space-y-3">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[10px] uppercase tracking-widest text-foreground font-bold">Total Paid</span>
                                            <span className="font-serif italic text-gold text-2xl">
                                                {order.currencyCode} {parseFloat(order.actualPayment).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* 4. 状态标签 */}
                                        <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em]">
                                            <span className="opacity-40">Transaction Status</span>
                                            <span className={`px-2 py-0.5 rounded-full font-bold ${
                                                order.status === 'PAID' ? 'bg-green-500/10 text-green-500' : 'bg-gold/10 text-gold'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 操作预留：申请退款接口 */}
                            {order.status === 'PAID' && (
                                <button className="w-full py-4 border border-red-500/20 text-red-500/50 text-[9px] uppercase tracking-widest hover:bg-red-500/5 transition-all">
                                    Request Refund
                                </button>
                            )}
                        </div>


                        {/* 5. 物流追踪板块 (仅在有数据时显示) */}
                        {shippingList && shippingList.length > 0 && (
                            <section className="space-y-8 pt-12 border-t border-gold/10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold flex items-center gap-2">
                                        <Truck size={14} className="animate-pulse" /> Shipment Tracking
                                    </h3>
                                    {shippingList[0].estimatedDeliveryDate && (
                                        <span className="text-[9px] text-muted uppercase tracking-tighter">
                                                Est. Delivery: {new Date(shippingList[0].estimatedDeliveryDate).toLocaleDateString()}
                                            </span>
                                    )}
                                </div>

                                {shippingList.map((shipping) => (
                                    <div key={shipping.id} className="bg-white/5 border border-gold/5 rounded-sm p-6 space-y-8">
                                        {/* 运单头部信息 */}
                                        <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-gold/5 pb-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted uppercase tracking-widest">Carrier</p>
                                                <p className="text-xs font-bold text-foreground">{shipping.provider} ({shipping.carrierCode})</p>
                                            </div>
                                            <div className="space-y-1 md:text-right">
                                                <p className="text-[10px] text-muted uppercase tracking-widest">Tracking Number</p>
                                                <p className="text-xs font-mono text-gold selection:bg-gold selection:text-background">
                                                    {shipping.trackingNumber}
                                                </p>
                                            </div>
                                        </div>

                                        {/* 时间轴详情 */}
                                        <div className="relative space-y-8 pl-6">
                                            {/* 贯穿始终的垂直线 */}
                                            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-gold via-gold/20 to-transparent" />

                                            {shipping.events.map((event, idx) => (
                                                <div key={idx} className="relative group">
                                                    {/* 时间轴圆点 */}
                                                    <div className={`absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full border border-gold bg-background transition-transform group-hover:scale-125 ${
                                                        idx === 0 ? 'bg-gold shadow-[0_0_8px_rgba(191,175,153,0.5)]' : ''
                                                    }`} />

                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-3">
                                                            <p className={`text-[11px] font-bold uppercase tracking-tight ${idx === 0 ? 'text-gold' : 'text-foreground'}`}>
                                                                {event.status}
                                                            </p>
                                                            <span className="text-[8px] text-muted opacity-50 font-mono">
                                        {new Date(event.eventTime).toLocaleString([], {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                                        </div>
                                                        <p className="text-[10px] text-muted leading-relaxed max-w-2xl font-light">
                                                            {event.description}
                                                        </p>
                                                        {event.location && (
                                                            <p className="text-[9px] text-gold/40 flex items-center gap-1 italic">
                                                                <MapPin size={10} /> {event.location}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                    </aside>
                </div>
            </div>
        </main>
    );
}