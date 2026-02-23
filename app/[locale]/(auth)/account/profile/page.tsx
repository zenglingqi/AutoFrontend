// @/app/[locale]/account/profile/page.tsx
'use client';

import {useEffect, useState, useCallback, useRef} from 'react';
import {signIn, useSession} from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";
import AddAddressModal from "@/components/Auth/AddAddressModal";
import {
    User, Mail, Phone, MapPin, CreditCard,
    ShieldCheck, Plus, Trash2, CheckCircle2,
    LogOut, Camera, ChevronRight,Link as LinkIcon, Globe,Unlink
} from 'lucide-react';

import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";
// 导入你的类型和逻辑
import { UserInfo } from "@/types/userProfileTypes";
import {
    getAddressList, deleteAddress, setDefaultAddress,
    getPaymentList, deletePayment
} from "@/app/api/functionsUser/user";
import {globalSignOut} from "@/app/api/functionsUser/globalSignOut";
import{AddressForm} from "@/types/userProfileTypes"
import {UserCard} from "@/types/paymenth";



const PROVIDER_CONFIG: Record<string, { name: string; icon: string }> = {
    google: { name: 'Google', icon: '/icons/google.svg' },
    facebook: { name: 'Facebook', icon: '/icons/facebook.svg' },
    tiktok: { name: 'TikTok', icon: '/icons/tiktok.png' },
    instagram: { name: 'Instagram', icon: '/icons/instagram.png' }
};




export default function ProfilePage() {
    const { data: session, status,update } = useSession();
    const router = useRouter();
    const lang = useLocale();

    const [user, setUser] = useState<UserInfo | null>(null);
    const [addresses, setAddresses] = useState<AddressForm[]>([]);
    const [payments, setPayments] = useState<UserCard[]>([]);
    const [loading, setLoading] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");
    const [showAddressModal, setShowAddressModal] = useState(false);

    // 初始化编辑状态下的名字
    useEffect(() => {
        if (user?.displayName) setTempName(user.displayName);
    }, [user]);


    // --- 头像上传处理 ---
    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await clientAPIFrame("/api/user/upload/avatar", {
                method: "POST",
                body: formData // clientAPIFrame 会自动处理 FormData 的 Content-Type
            });
            if (res.ok) await loadData();
        } catch (err) {
            console.error("Avatar upload failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- 用户名修改处理 ---
    const handleUpdateName = async () => {
        if (!tempName || tempName === user?.displayName) {
            setIsEditingName(false);
            return;
        }

        try {
            const res = await clientAPIFrame("/api/user/profile", {
                method: "PATCH",
                body: JSON.stringify({ displayName: tempName })
            });
            if (res.ok) {
                setIsEditingName(false);
                await loadData();
                await update(); // 同步更新 NextAuth Session
            }
        } catch (err) {
            console.error("Update name failed:", err);
        }
    };


    // 获取所有支持的渠道名
    const allProviders = Object.keys(PROVIDER_CONFIG);

    // 构造完整的显示数组
    const displayOAuth = allProviders.map(providerKey => {
        // 在用户已绑定列表中查找
        const linkedData = user?.oauth?.find(
            (a) => a.provider.toLowerCase() === providerKey
        );

        return {
            provider: providerKey,
            // 如果能找到 linkedData，说明已绑定，否则未绑定
            linked: !!linkedData,
            linkedAt: linkedData?.linkedAt || null,
            // 可以根据需要保留后端返回的其他字段
        };
    });


    const loadData = useCallback(async () => {
        if (status !== "authenticated") return;
        setLoading(true);
        try {
            const userRes = await clientAPIFrame("/api/user/me");
            if (userRes.ok) setUser(await userRes.json());
            const asss=await  getAddressList();

            const [addr, pay] = await Promise.all([getAddressList(), getPaymentList()]);

            setAddresses(addr || []);
            setPayments(pay || []);
        } catch (e) {
            console.error("Load Profile Failed", e);
        } finally {
            setLoading(false);
        }
    }, [status]);

    /**
     * 处理解绑第三方账号
     * @param provider 平台名称，如 'facebook', 'google'
     */
    const handleOAuthUnlink = async (provider: string) => {
        // 奢侈品风格的确认弹窗（也可以后续替换为自定义 Modal）
        if (!confirm(`Are you sure you want to unlink your ${provider} account?`)) {
            return;
        }

        try {
            // 根据你之前的逻辑，解绑通常使用 DELETE 或指定的解绑接口
            // 这里路径建议与后端约定，例如 /api/user/oauth/unlink/${provider}
            const res = await clientAPIFrame(`/api/backend-auth/unbind-${provider}`, {
                method: 'POST',
            });

            if (res.ok) {
                // 解绑成功后，重新获取最新的用户信息以更新 UI
                await loadData();
                // 可选：添加一个轻量级通知
                console.log(`${provider} unlinked successfully`);
            } else {
                const errorData = await res.json();
                alert(errorData.message || "Failed to unlink account");
            }
        } catch (error) {
            console.error("Unlink error:", error);
            alert("An error occurred while unlinking. Please try again.");
        }
    };


    const handleConnect = async (provider: string) => {
        // 使用 signIn 发起 OAuth 流程。
        // 设置 redirect: false 可以防止页面完全刷新（取决于你的 Auth.js 配置）
        // 但通常绑定流程需要跳转到第三方授权页再跳回来。
        // 授权回来后，Auth.js 会自动更新 Session 里的 Token。
        await signIn(provider, { callbackUrl: window.location.href });
    };


    useEffect(() => {
        const triggerBinding = async () => {
            // 1. 严格匹配你的 next-auth.d.ts 路径：字段在 user 内部
            const oauthToken = session?.user?.oauthToken;
            const provider = session?.user?.oauthProvider;

            // 2. 只有当 session 中存在临时的第三方 token 时才触发后端绑定接口
            if (oauthToken && provider) {
                try {
                    console.log(`Attempting to link ${provider} account...`);

                    const res = await clientAPIFrame(`/api/backend-auth/bind-${provider}`, {
                        method: 'POST',
                        body: JSON.stringify({ token: oauthToken })
                    });

                    if (res.ok) {
                        // 3. 绑定成功后，必须调用 update()
                        // 这会重新触发 auth.ts 里的 jwt/session 回调，从而清除 session 里的临时 token
                        await update();
                        // 4. 刷新页面上的用户信息（显示“已绑定”状态）
                        loadData();
                    }
                } catch (error) {
                    console.error("OAuth binding failed:", error);
                }
            }
        };

        // 仅在已登录状态下尝试绑定
        if (status === "authenticated") {
            triggerBinding();
        }

        // 依赖项：监听 session 对象中 user 下的 token 变化
    }, [session?.user?.oauthToken, status]);

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
        if (status === "authenticated") loadData();
    }, [status, router, loadData]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">

            <div className="max-w-[1400px] mx-auto">

                {/* 顶部标题栏 */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif italic text-foreground tracking-tight italic">Personal Sanctuary</h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-muted mt-4 font-bold">Account Management & Preferences</p>
                    </div>
                    <button
                        onClick={globalSignOut}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/60 hover:text-foreground transition-all group">
                        <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* 左侧栏：基础信息 (4/12) */}
                    <aside className="lg:col-span-4 space-y-10">
                        {/* 用户核心卡片 */}
                        {/* 用户核心卡片 */}
                        <section className="bg-card border border-border p-10 rounded-[2rem] text-center">
                            {/* 头像容器 - 增加点击事件 */}
                            <div
                                className="relative w-28 h-28 mx-auto mb-8 group cursor-pointer"
                                onClick={handleAvatarClick}
                            >
                                <div className="w-full h-full rounded-full overflow-hidden bg-foreground/5 flex items-center justify-center border border-border transition-colors group-hover:border-gold">
                                    {user?.avatarUrl ? (
                                        <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <User size={40} className="text-muted/40" />
                                    )}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                    <Camera size={20} className="text-white" />
                                </div>
                                {/* 隐藏的文件输入框 */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            {/* 用户名展示/编辑逻辑 */}
                            <div className="flex flex-col items-center gap-2">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2 border-b border-gold pb-1">
                                        <input
                                            autoFocus
                                            className="bg-transparent text-center outline-none text-xl font-bold  tracking-tight text-foreground"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            onBlur={handleUpdateName}
                                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                                        />
                                    </div>
                                ) : (
                                    <h2
                                        className="text-xl font-bold  tracking-tight text-foreground cursor-pointer hover:text-gold transition-colors flex items-center gap-2"
                                        onClick={() => setIsEditingName(true)}
                                    >
                                        {user?.displayName || "Set Name"}
                                        <Plus size={12} className="text-gold opacity-0 group-hover:opacity-100" />
                                    </h2>
                                )}
                                <p className="text-[9px] font-black  tracking-[0.2em] text-muted mt-2">Member No. {user?.accountNo}</p>
                            </div>
                            {/* ... 后面部分保持不变 ... */}
                        </section>

                        {/* 社交绑定 */}
                        <section className="bg-card border border-border p-8 rounded-[2rem] shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-8 flex items-center gap-2">
                                <LinkIcon size={12} /> Social Connectivity
                            </h3>
                            <div className="space-y-4">
                                {displayOAuth.map((auth) => {
                                    const config = PROVIDER_CONFIG[auth.provider];
                                    return (
                                        <div key={auth.provider} className="flex items-center justify-between p-4 ...">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 ...">
                                                    <img src={config.icon} className="w-4 h-4 object-contain" alt={config.name} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black uppercase ...">{config.name}</span>
                                                    {/* 修改显示文字：根据 auth.linked 判断 */}
                                                    <span className="text-[8px] text-muted font-medium">
                                                        {auth.linked ? 'Verified Link' : 'Not Connected'}
                                                    </span>
                                                </div>
                                            </div>

                                            {auth.linked ? (
                                                /* 已绑定状态：显示解绑按钮 */
                                                <button
                                                    onClick={() => handleOAuthUnlink(auth.provider)}
                                                    className="p-2 text-muted hover:text-red-400 ..."
                                                >
                                                    <Unlink size={14} />
                                                </button>
                                            ) : (
                                                /* 未绑定状态：显示 Connect 按钮 */
                                                <button
                                                    onClick={() => handleConnect(auth.provider)}
                                                    className="text-[10px] font-black uppercase text-gold ..."
                                                >
                                                    Connect
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </aside>

                    {/* 右侧主区：地址与支付 (8/12) */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* 地址簿 */}
                        <section className="bg-card border border-border p-10 rounded-[2.5rem] relative overflow-hidden">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gold/5 text-gold rounded-full"><MapPin size={22} strokeWidth={1.5} /></div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Address Book</h3>
                                        <p className="text-[9px] text-muted uppercase tracking-widest mt-1">Shipping Sanctuaries</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="bg-foreground text-background px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-all shadow-lg shadow-foreground/5">
                                    New Address
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {addresses.map(addr => (
                                    <div key={addr.id} className={`p-6 rounded-3xl border transition-all group ${addr.default ? 'border-gold bg-gold/[0.03]' : 'border-border/60 hover:border-gold'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${addr.default ? 'text-gold' : 'text-muted/40'}`}>
                                                {addr.default ? 'Primary Hub' : 'Destination'}
                                            </span>
                                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => addr?.id && deleteAddress(addr.id).then(loadData)}
                                                    className="text-muted hover:text-red-400"
                                                >
                                                    <Trash2 size={14}/>
                                                </button>
                                                {!addr.default && (
                                                    <button
                                                        onClick={() => addr?.id && setDefaultAddress(addr.id).then(loadData)}
                                                        className="text-muted hover:text-gold"
                                                    >
                                                        <CheckCircle2 size={14}/>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[13px] font-bold text-foreground mb-1 uppercase tracking-tight">{addr.recipientName}</p>
                                        <p className="text-[11px] text-muted leading-relaxed uppercase">{addr.addressLine1}, {addr.city}, {addr.countryCode}</p>
                                        <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-muted/60">
                                            <Phone size={10} /> {addr.phone}
                                        </div>
                                    </div>
                                ))}
                                {addresses.length === 0 && (
                                    <div className="col-span-full py-16 text-center border border-dashed border-border rounded-[2rem] opacity-40">
                                        <p className="text-[10px] uppercase tracking-widest">Your shipping map is empty</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 支付方式 */}
                        <section className="bg-card border border-border p-10 rounded-[2.5rem]">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-gold/5 text-gold rounded-full"><CreditCard size={22} strokeWidth={1.5} /></div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Financial Vault</h3>
                                    <p className="text-[9px] text-muted uppercase tracking-widest mt-1">Encrypted Payment Methods</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {payments.map(pm => (
                                    <div key={pm.id} className="flex items-center justify-between p-6 rounded-3xl border border-border/60 hover:border-gold transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-9 bg-foreground/[0.03] rounded-lg border border-border/40 flex items-center justify-center font-serif italic text-[10px] text-muted">
                                                {pm.provider}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold tracking-[0.2em] text-foreground">•••• •••• •••• {pm.last4}</p>
                                                <p className="text-[9px] text-muted uppercase mt-1 tracking-widest">Expires {pm.expireMonth}/{pm.expireYear}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deletePayment(pm.id).then(loadData)} className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {payments.length === 0 && (
                                    <div className="py-12 text-center border border-dashed border-border rounded-[2rem] opacity-40">
                                        <p className="text-[10px] uppercase tracking-widest italic">No payment methods stored</p>
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
            {showAddressModal && (
                <AddAddressModal
                    onCloseAction={() => setShowAddressModal(false)}
                    onAddedAction={loadData} // 这里的 loadData 是你 page.tsx 里定义的
                />
            )}
        </main>
    );
}