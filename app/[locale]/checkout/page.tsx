'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/components/Context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check, CreditCard, Wallet, Plus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import{ AddressForm } from '@/types/userProfileTypes'
import AddAddressModal from "@/components/Auth/AddAddressModal";
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";
import StripePaymentWrapper from "@/components/Payment/StripePaymentWrapper";
import {useParams, usePathname, useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import PayPalPaymentWrapper from "@/components/Payment/PayPalPaymentWrapper";



export default function CheckoutPage() {
    const { cartItems } = useCart();
    const [addresses, setAddresses] = useState<AddressForm[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    // 筛选选中商品
    const checkoutItems = cartItems.filter(item => item.selected);
    const subtotal = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const currency = checkoutItems[0]?.currencyCode || 'USD';

    const params = useParams(); // 获取路由参数
    const locale = params.locale as string; // 拿到当前语言，如 'zh', 'en'
    const [, setIsDarkMode] = useState(false);


    const [promoData, setPromoData] = useState<any>(null);


    // @/app/[locale]/checkout/page.tsx 增加以下状态
    const [availableUserCoupons, setAvailableUserCoupons] = useState<any[]>([]);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null); // 存储后端返回的验证结果
    const [isValidating, setIsValidating] = useState(false);
    // 计算最终抵扣金额（由后端根据汇率换算后返回）
    const discountAmount = appliedCoupon?.discountAmount || 0;


    // 2. 修改：最终金额计算逻辑
    const globalDiscount = promoData?.totalDiscountAmount || 0; // 全场活动减免
    const couponDiscount = appliedCoupon?.discountAmount || 0;  // 优惠券减免

    // 最终支付额 = 选中商品总额 - 全场减免 - 优惠券
    const finalTotal = Math.max(0, subtotal - globalDiscount - couponDiscount);



    const[createOrderResult,setCreateOrderResult]=useState<any>();
    const [showPaymentArea,setShowPaymentArea] =useState(false);

    // 3. 新增：调用预览接口获取全场活动
    const fetchGlobalPromotion = async () => {
        if (checkoutItems.length === 0) return;
        try {
            // 构造后端要求的 List<CreateOrderItem> 结构
            const itemsPayload = checkoutItems.map(item => ({
                skuCode: item.skuCode,
                quantity: item.quantity,
                price: item.price // 必须传这个，后端 PromotionEngine 用它算门槛
            }));

            const res = await clientAPIFrame(`/api/marketing/preview-cart?currency=${currency}`, {
                method: 'POST',
                body: JSON.stringify(itemsPayload)
            });
            if (res.ok) {
                const data = await res.json();
                setPromoData(data?.data);
            }
        } catch (e) {

            console.error("Failed to fetch global promotions", e);

        }

    };




    const handleSelectUserCoupon = async (coupon: any) => {
        // 如果已经应用了，再次点击则取消
        if (appliedCoupon?.couponId === coupon.id) {
            setAppliedCoupon(null);
            setCouponCode("");
            return;
        }

        setIsValidating(true);
        try {
            // 直接使用私有券的 Code 进行校验
            const res = await clientAPIFrame(
                `/api/orders/coupons/validate?code=${coupon.couponCode}&orderAmount=${subtotal}&orderCurrency=${currency}`
            );
            const result = await res.json();
            if (res.ok && result.data.valid) {
                setAppliedCoupon(result.data);
                setCouponCode(coupon.couponCode); // 同步输入框
            }
        } finally {
            setIsValidating(false);
        }
    };

    const fetchUserCoupons = async () => {
        try {
            const res = await clientAPIFrame("/api/orders/coupons/my-available");
            if (res.ok) {
                const data = await res.json();
                setAvailableUserCoupons(data.data || []);
            }
        } catch (e) {
            console.error("Failed to fetch user coupons", e);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsValidating(true);
        try {
            // 调用后端校验接口，传入当前订单金额和币种以便后端计算汇率换算
            const res = await clientAPIFrame(
                `/api/orders/coupons/validate?code=${couponCode}&orderAmount=${subtotal}&orderCurrency=${currency}`
            );
            const result = await res.json();

            if (res.ok && result.data.valid) {
                setAppliedCoupon(result.data);
            } else {
                alert(result.message || "Invalid Privilege Code");
                setAppliedCoupon(null);
            }
        } catch (err) {
            console.error("Coupon validation error", err);
        } finally {
            setIsValidating(false);
        }
    };

    //const { data: session, status } = useSession(); // 获取 session 状态
    const { data: session,status } = useSession(); // 获取 session 状态
    const router = useRouter();
    const pathname = usePathname();


    // 1. 获取地址列表 (对接你的后端 API)
    const fetchAddresses = async () => {
        try {
            const res = await clientAPIFrame("/api/user/address/list");
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
                const defaultAddr = data.find((a: AddressForm) => a.default) || data[0];
                if (defaultAddr) setSelectedAddressId(defaultAddr.id);
            }
        } catch (e) {
            console.error("Address fetch failed", e);
        }
    };


    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);


    // 2. 页面加载时自动调用
    useEffect(() => {
        if (status === "unauthenticated") {
            // 未登录：跳转到登录页
            // 注意：Next-Auth 默认登录页通常是 /api/auth/signin 或你自定义的 /login

            const purePathname = pathname.replace(/^\/(?:[a-z]{2}(?:-[A-Z]{2})?)/, '') || '/';
            const loginUrl = `/login?callbackUrl=${encodeURIComponent(purePathname)}`;
            router.push(loginUrl);
            return;
        }




        fetchAddresses();
        fetchUserCoupons(); // 页面加载时自动获取
    }, []);

    // 3. 这里的 handleRefresh 就是供点击事件调用的函数
    const handleRefresh = () => {
        fetchAddresses();
    };


    useEffect(() => {
        fetchGlobalPromotion();
    }, [checkoutItems.length, currency]); // 当选中项数量变化时重算

    // 2. 删除地址
    const handleDeleteAddress = async (id: number) => {
        const res = await clientAPIFrame(`/api/user/address/delete/${id}`, { method: 'DELETE' });
        if (res.ok) setAddresses(prev => prev.filter(a => a.id !== id));
    };

    // 3. 处理结算申请
    // @/app/[locale]/checkout/page.tsx
    const handleCompleteOrder = async () => {
        // 1. 验证地址选择
        if (!selectedAddressId) {
            return alert("Please select a shipping sanctuary.");
        }

        // 2. 获取当前选中的完整地址对象作为快照
        const selectedAddress = addresses.find(a => a.id === selectedAddressId);
        if (!selectedAddress) return;

        setIsSubmitting(true);

        // 3. 构造符合 CreateOrderRequest 结构的 Payload
        const orderPayload = {
            currencyCode: currency, // 对应后端的 currencyCode
            paymentMethod: paymentMethod, // 对应后端的 paymentMethod
            addressCountry: selectedAddress?.countryCode, // 对应后端的 addressCountry
            note: "", // 如果有备注功能可添加
            addressSnapshot: selectedAddress, // 后端要求的 UserAddressDTO 结构

            expectedAmount: finalTotal,       // 传递前端计算的最终金额供后端比对
            beforePromotionAmount:subtotal, //优惠前总价
            discountAmount:discountAmount, //总优惠价
            globalDiscount: globalDiscount, //全场优惠金额
            couponDiscount:couponDiscount, //券优惠价格
            couponId: appliedCoupon?.couponId || null, // 预留优惠券位
            couponCode: appliedCoupon?.couponCode || null, //
            promotionId: promoData?.appliedPromotions?.[0]?.id || null, // 传回后端匹配到的全场活动 ID

            items: checkoutItems.map(item => ({
                // 注意：这里需要根据你之前的 CartItem 数据结构映射
                skuCode: item.skuCode, //
                quantity: item.quantity, //
                // 如果 CartItem 里有 variantId 请加上，否则后端需要通过 skuCode 查找
                imageUrl: item.image, // 推荐的快照图
                price:item.price,//
                // 将选中的属性转回 Map 格式
                attributes: item.selectedAttributes.reduce((acc, attr) => {
                    acc[attr.keyLabel] = attr.valueLabel;
                    return acc;
                }, {} as Record<string, string>) //
            }))

        };

        console.log("Sending Order Payload:", orderPayload);

        try {
            const res = await clientAPIFrame("/api/orders/create", {
                method: 'POST',
                body: JSON.stringify(orderPayload)
            });

            // Step 1: 创建订单 (已完成)
            const orderRes = await res.json();

            const orderData = orderRes?.data;

            setCreateOrderResult(orderData);

            if (orderData?.orderSn) {
                // 只保存 orderSn，触发 Wrapper 的渲染
                setCreateOrderResult(orderData);
                setShowPaymentArea(true);

                // 平滑滚动
                setTimeout(() => {
                    document.getElementById('payment-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }


        } catch (err) {
            console.error("Payment initiation failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (checkoutItems.length === 0) return (
        <div className="h-[60vh] flex items-center justify-center font-serif italic text-muted">Your sanctuary is empty.</div>
    );

    // @ts-ignore
    return (
        <main className="max-w-[1400px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-20">

            {/* 左侧：表单 (7/12) */}
            <div className="lg:col-span-7 space-y-16">

                {/* 配送地址部分 */}
                <section>
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold italic">I. Shipping Sanctuary</h2>
                        <button
                            onClick={() => setShowAddressModal(true)}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted hover:text-gold transition-colors">
                            <Plus size={14} /> New Address
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {addresses.map((addr) => (
                                <motion.div
                                    key={addr.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedAddressId(addr.id)}
                                    className={`p-6 rounded-[2rem] border transition-all cursor-pointer relative group ${
                                        selectedAddressId === addr.id
                                            ? 'border-gold bg-gold/[0.03] shadow-lg shadow-gold/5'
                                            : 'border-border/40 bg-card/20 hover:border-gold/30'
                                    }`}
                                >
                                    {selectedAddressId === addr.id && (
                                        <div className="absolute top-5 right-5 text-gold"><Check size={16} /></div>
                                    )}
                                    <p className="font-serif italic text-lg mb-2 text-foreground">{addr.recipientName}</p>
                                    <p className="text-[11px] text-muted leading-relaxed uppercase tracking-tight">
                                        {addr.addressLine1}<br />
                                        {addr.city}, {addr.province} {addr.postalCode}<br />
                                        {addr.country}
                                    </p>
                                    <p className="text-[10px] mt-4 text-gold/60 font-mono tracking-tighter">{addr.phone}</p>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                                        className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* 支付方式部分 */}
                <section>
                    <h2 className="text-[10px] uppercase tracking-[0.4em] text-gold mb-10 font-bold italic">II. Payment Method</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { id: 'stripe', label: 'Credit Card / Apple Pay', icon: <CreditCard size={18} /> },
                            { id: 'paypal', label: 'PayPal Checkout', icon: <Wallet size={18} /> }
                        ].map((method) => (
                            <div
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id as any)}
                                className={`flex items-center gap-4 p-6 rounded-2xl border transition-all cursor-pointer ${
                                    paymentMethod === method.id ? 'border-gold bg-gold/[0.03]' : 'border-border/40'
                                }`}
                            >
                                <div className={paymentMethod === method.id ? 'text-gold' : 'text-muted'}>{method.icon}</div>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{method.label}</span>
                            </div>
                        ))}
                    </div>
                </section>




                {/* 支付区域：根据选择显示不同的 Wrapper */}
                <div id="payment-anchor" className="mt-8">
                    <AnimatePresence mode="wait">
                        {showPaymentArea && (
                            <motion.div
                                key={paymentMethod}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-card-soft p-6 rounded-2xl border border-line-light shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-foreground">
                                        {paymentMethod === 'stripe' ? 'Credit Card Entry' : 'PayPal Secure Express'}
                                    </h3>
                                    <button onClick={() => setShowPaymentArea(false)} className="text-[9px] text-muted hover:text-gold uppercase tracking-tighter">
                                        [ Change Method ]
                                    </button>


                                </div>

                                {paymentMethod === 'stripe' ? (
                                    <StripePaymentWrapper
                                        currency={currency}
                                        orderSn={createOrderResult?.orderSn}
                                        locale={locale} // 传入当前语言
                                    />
                                ) : (
                                    <PayPalPaymentWrapper
                                        orderSn={createOrderResult?.orderSn}
                                        currency={createOrderResult?.currencyCode} //
                                        locale={locale}
                                    />

                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>


                {/* 原有的结算按钮逻辑需要调整：显示 Stripe 时隐藏原按钮，避免用户重复点击 */}
                {!showPaymentArea && (
                    <button
                        onClick={handleCompleteOrder}
                        disabled={isSubmitting || !selectedAddressId}
                        className="w-full bg-foreground text-background py-6 rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? "Securing Transaction..." : "Complete Sanctuary Order"}
                        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                )}




                {/* 在订单摘要 Aside 部分，优惠券输入框上方插入 */}

                {availableUserCoupons.length > 0 && !showPaymentArea && (
                    <div className="mb-6">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3 font-bold">Available Privileges</p>
                        <div className="flex flex-wrap gap-2">
                            {availableUserCoupons.map((uc) => (
                                <button
                                    key={uc.id}
                                    onClick={() => handleSelectUserCoupon(uc)}
                                    className={`px-4 py-2 rounded-full border text-[10px] uppercase tracking-widest transition-all ${
                                        appliedCoupon?.couponId === uc.couponId
                                            ? 'border-gold bg-gold text-background'
                                            : 'border-gold/30 text-gold hover:bg-gold/5'
                                    }`}
                                >
                                    {uc.couponCode} (Value: {uc.receivedAmount} {uc.receivedCurrency})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 在 aside 的订单列表下方插入优惠券 */}
                { !showPaymentArea && <div className="mt-10 mb-6 p-6 bg-gold/5 rounded-[2rem] border border-gold/10">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4 font-bold">Privilege Code</h4>
                    <div className="flex gap-4">
                        <input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 bg-transparent border-b border-gold/20 outline-none text-sm font-serif italic py-1 focus:border-gold transition-colors"
                            placeholder="Enter Code..."
                            disabled={!!appliedCoupon}
                        />
                        {appliedCoupon ? (
                            <button
                                onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}
                                className="text-[10px] uppercase tracking-widest text-red-400"
                            >
                                Remove
                            </button>
                        ) : (
                            <button
                                onClick={handleApplyCoupon}
                                disabled={isValidating}
                                className="text-[10px] uppercase tracking-widest text-foreground hover:text-gold transition-colors"
                            >
                                {isValidating ? "Checking..." : "Apply"}
                            </button>
                        )}
                    </div>
                    {appliedCoupon && (
                        <p className="mt-3 text-[10px] text-gold uppercase tracking-tighter">
                            {appliedCoupon.name} applied: -{currency} {discountAmount.toLocaleString()}
                        </p>
                    )}
                </div>
                }
            </div>



            {/* 右侧：订单摘要 (5/12) */}
            <aside className="lg:col-span-5">
                <div className="bg-card/30 backdrop-blur-xl p-10 rounded-[2.5rem] border border-border/20 sticky top-24 shadow-sm">
                    <h3 className="font-serif italic text-3xl mb-10 text-foreground">Order Selection</h3>
                    <div className="space-y-8 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {checkoutItems.map(item => (
                            <div key={item.cartItemId} className="flex gap-6 items-center">
                                <div className="relative h-24 w-20 bg-card rounded-2xl overflow-hidden flex-shrink-0 border border-border/10">
                                    <Image src={item.image} fill className="object-cover" alt={item.name} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-serif italic text-lg text-foreground leading-tight mb-1">{item.name}</p>
                                    <div className="flex justify-between items-end">
                                        <p className="text-[9px] text-muted uppercase tracking-[0.2em]">Qty: {item.quantity}</p>
                                        <p className="text-sm font-serif text-gold">{item.currencyCode} {(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gold/10 pt-8 space-y-4">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted">
                            <span>Subtotal</span>
                            <span>{currency} {subtotal.toLocaleString()}</span>
                        </div>

                        {/* A. 展示全场活动减免 */}
                        {globalDiscount > 0 && (
                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gold animate-pulse">
                                <span>{promoData.appliedPromotions[0].name}</span>
                                <span>-{currency} {globalDiscount.toLocaleString()}</span>
                            </div>
                        )}

                        {/* B. 展示凑单进度条 (如果存在) */}
                        {promoData?.upcomingPromotions?.length > 0 && (
                            <div className="p-3 bg-gold/5 border border-gold/20 rounded-xl">
                                <p className="text-[9px] text-gold uppercase tracking-widest">
                                    {promoData.upcomingPromotions[0].tip}
                                </p>
                            </div>
                        )}

                        {appliedCoupon && (
                            <div className="flex justify-between text-[10px] uppercase tracking-widest text-gold">
                                <span>Privilege Discount</span>
                                <span>-{currency} {couponDiscount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted">
                            <span>Complimentary Shipping</span>
                            <span className="text-gold">FREE</span>
                        </div>
                        <div className="flex justify-between text-2xl font-serif italic pt-4 border-t border-gold/5">
                            <span className="text-foreground">Total</span>
                            <span className="text-gold">{currency} {finalTotal.toLocaleString()}</span>
                        </div>
                    </div>

                </div>
            </aside>

            {showAddressModal && (
                <AddAddressModal
                    onCloseAction={() => setShowAddressModal(false)}
                    onAddedAction={handleRefresh} // 这里的 loadData 是你 page.tsx 里定义的
                />
            )}
        </main>
    );
}