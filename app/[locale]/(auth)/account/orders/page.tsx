'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle2, XCircle, CreditCard, AlertCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";

// 对应你提供的后端结构
interface OrderSummary {
    id: number;
    orderSn: string;
    totalAmount: string;
    currencyCode: string;
    paymentMethod: string;
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED'; // 假设包含 EXPIRED
    createdAt: string;
    updatedAt: string;
    expireAt: string; // 用于倒计时
    imageUrl: string; // 第一件商品的缩略图
}

export default function ProfileOrdersPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // 建议接口路径
                const res = await clientAPIFrame('/api/orders/my');
                const result = await res.json();
                setOrders(result);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'PAID': return { icon: <CheckCircle2 size={12} />, color: 'text-green-500', bg: 'bg-green-500/5' };
            case 'PENDING': return { icon: <Clock size={12} />, color: 'text-gold', bg: 'bg-gold/5' };
            case 'CANCELLED': return { icon: <XCircle size={12} />, color: 'text-muted', bg: 'bg-white/5' };
            default: return { icon: <AlertCircle size={12} />, color: 'text-red-400', bg: 'bg-red-400/5' };
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-4 h-4 border border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
    );

    return (


        <main className="min-h-screen bg-background py-24 px-6">


            <div className="max-w-5xl mx-auto space-y-12">

                {/* 页面头部 */}
                <header className="space-y-2 border-b border-gold/10 pb-8">
                    <h1 className="font-serif italic text-4xl text-foreground">My Sanctuaries</h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Your curated acquisition history</p>
                </header>

                {orders.length === 0 ? (
                    <div className="py-20 text-center space-y-6">
                        <Package className="mx-auto text-gold/20" size={48} />
                        <p className="text-sm text-muted font-light">The scrolls are empty. No acquisitions found.</p>
                        <button onClick={() => router.push(`/${locale}/shop`)} className="text-[10px] uppercase tracking-widest text-gold border border-gold/20 px-8 py-4 rounded-full">Explore Shop</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, idx) => {
                            const { icon, color, bg } = getStatusStyles(order.status);

                            return (
                                <motion.div
                                    key={order.orderSn}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => router.push(`/${locale}/order/detail/${order.orderSn}`)}
                                    className="group relative flex flex-col md:flex-row items-center gap-6 p-4 bg-card-soft border border-gold/5 hover:border-gold/20 transition-all cursor-pointer rounded-sm"
                                >
                                    {/* 商品预览图 */}
                                    <div className="relative w-20 h-24 bg-background overflow-hidden border border-gold/10">
                                        {order.imageUrl ? (
                                            <Image
                                                src={order.imageUrl}
                                                alt={order.orderSn}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gold/5 text-gold/20">
                                                <Package size={20} />
                                            </div>
                                        )}
                                    </div>

                                    {/* 核心信息 */}
                                    <div className="flex-1 space-y-3 w-full text-center md:text-left">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                            <span className="text-[11px] font-bold tracking-tighter text-foreground uppercase">
                                                ID: {order.orderSn}
                                            </span>
                                            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${bg} ${color} text-[9px] uppercase tracking-widest font-bold`}>
                                                {icon} {order.status}
                                            </div>
                                        </div>

                                        <div className="text-[10px] text-muted space-x-3 uppercase tracking-tighter">
                                            <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="opacity-30">|</span>
                                            <span>Method: {order.paymentMethod || 'SECURE PAY'}</span>
                                        </div>
                                    </div>

                                    {/* 价格与动态按钮 */}
                                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                                        <div className="text-right">
                                            <p className="text-xl font-serif italic text-gold">
                                                {order.currencyCode} {parseFloat(order.totalAmount).toLocaleString()}
                                            </p>
                                        </div>

                                        {order.status === 'PENDING' ? (
                                            <button className="w-full md:w-auto px-6 py-2.5 bg-gold text-background text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gold/10">
                                                <CreditCard size={12} /> Pay Now
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted group-hover:text-gold transition-all duration-300">
                                                View Archive <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        )}
                                    </div>

                                    {/* 支付截止提示 (如果是 PENDING) */}
                                    {order.status === 'PENDING' && order.expireAt && (
                                        <div className="absolute top-0 right-0 p-1 px-3 bg-red-500/10 text-red-500 text-[8px] uppercase tracking-tighter rounded-bl-sm border-l border-b border-red-500/10">
                                            Expires soon
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}


