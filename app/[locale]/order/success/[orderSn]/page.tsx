'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Star, Loader2, Package, MapPin, CreditCard } from 'lucide-react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";

// 定义后端返回的 DTO 结构
interface OrderDetail {
    orderSn: string;
    totalAmount: string;
    currencyCode: string;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    addressSnapshot: {
        firstName: string;
        lastName: string;
        addressLine1: string;
        city: string;
    };
    items: Array<{
        id: number;
        imageUrl: string;
        productCode: string;
        quantity: number;
        unitPrice: number;
    }>;
}

export default function OrderSuccessPage() {
    const params = useParams();
    const orderSn = params.orderSn as string;
    const locale = params.locale as string;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndVerifyOrder = async () => {
            try {
                // 调用后端详情接口进行核验
                const res = await clientAPIFrame(`/api/orders/detail/${orderSn}`);
                const result = await res.json();
                const data = result.data || result;

                // 核心验证逻辑：只有状态为 PAID 才展示成功 UI
                if (data && data.status === 'PAID') {
                    setOrder(data);
                }
            } catch (err) {
                console.error("Verification failed", err);
            } finally {
                setLoading(false);
            }
        };

        if (orderSn) fetchAndVerifyOrder();
    }, [orderSn]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <Loader2 className="w-6 h-6 text-gold animate-spin mb-4" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Securing Sanctuary Details...</p>
            </div>
        );
    }

    // 如果未找到订单或未支付，显示优雅的错误提示
    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
                <h2 className="font-serif italic text-3xl mb-4">Awaiting Confirmation</h2>
                <p className="text-muted text-xs max-w-xs mb-8 leading-relaxed">
                    Your transaction is being synchronized. Please refresh in a moment or visit your profile.
                </p>
                <Link href={`/${locale}/profile/orders`} className="text-gold text-[10px] uppercase tracking-[0.2em] border border-gold/20 px-8 py-4 rounded-full hover:bg-gold/5 transition-all">
                    View Order History
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16">

                {/* 1. 成功头部公告 */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="w-20 h-20 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mx-auto"
                    >
                        <Check size={32} className="text-gold" />
                    </motion.div>
                    <div className="space-y-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="font-serif italic text-5xl text-foreground"
                        >
                            Sanctuary Secured.
                        </motion.h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
                            Confirmation No: {order.orderSn}
                        </p>
                    </div>
                </div>

                {/* 2. 订单详细卡片 - 左右布局 */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 border-t border-gold/10 pt-16">

                    {/* 左侧：商品清单 (占 3 份) */}
                    <div className="lg:col-span-3 space-y-8">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted flex items-center gap-2">
                            <Package size={14} /> Your Selection
                        </h3>
                        <div className="space-y-6">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center group">
                                    <div className="relative w-20 h-24 bg-card-soft overflow-hidden rounded-sm">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.productCode}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="text-xs font-medium text-foreground">{item.productCode}</h4>
                                        <p className="text-[10px] text-muted uppercase tracking-wider">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-xs font-serif italic text-gold">
                                        {order.currencyCode} {item.unitPrice.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 右侧：配送与支付信息 (占 2 份) */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* 配送地址 */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted flex items-center gap-2">
                                <MapPin size={14} /> Destination
                            </h3>
                            <div className="text-xs text-foreground leading-relaxed font-light">
                                <p className="font-medium mb-1">{order.addressSnapshot.firstName} {order.addressSnapshot.lastName}</p>
                                <p className="opacity-70">{order.addressSnapshot.addressLine1}</p>
                                <p className="opacity-70">{order.addressSnapshot.city}</p>
                            </div>
                        </div>

                        {/* 费用总结 */}
                        <div className="space-y-4 pt-6 border-t border-gold/5">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] uppercase tracking-widest text-muted">Total Paid</span>
                                <span className="text-2xl font-serif italic text-gold">
                                    {order.currencyCode} {parseFloat(order.totalAmount).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] text-green-600 uppercase tracking-widest">
                                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                Payment Authorized via Stripe/PayPal
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. 底部操作 */}
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-8 border-t border-gold/10">
                    <Link href={`/${locale}/account/orders`} className="w-full md:w-auto px-10 py-5 rounded-full border border-gold/20 text-[10px] uppercase tracking-widest text-gold hover:bg-gold/5 transition-all text-center">
                        Track Order
                    </Link>
                    <Link href={`/${locale}/shop`} className="w-full md:w-auto px-10 py-5 rounded-full bg-foreground text-background text-[10px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3 hover:bg-gold transition-all">
                        Continue Exploring <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="flex justify-center gap-8 text-gold/10 pt-4">
                    <Star size={16} /> <Star size={16} /> <Star size={16} />
                </div>
            </div>
        </main>
    );
}