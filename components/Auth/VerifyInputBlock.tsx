
'use client';

import { useState, useEffect } from "react"
import { sendVerificationCode, verifyCode} from "@/app/api/functionsUser/user";
import IntlPhoneInput from "@/components/Auth/IntlPhoneInput";

interface Props {
    type: "email" | "phone"

    lang?: string
    onVerified?: () => void
    onCancel?: () => void
}

export default function VerifyInputBlock({ type, lang = "en", onVerified, onCancel }: Props) {
    const [value, setValue] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleSendCode = async () => {
        if (!value) return
        setLoading(true)
        try {
            await sendVerificationCode(
                type === "email" ? value : "",
                type === "phone" ? value : "",
                type.toUpperCase() as "EMAIL" | "PHONE"
            )
            setCountdown(60)
        } catch (err) {
            console.error("Send code error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async () => {
        if (!value || !code) return
        setLoading(true)
        try {
            await verifyCode(
                type === "email" ? value : "",
                type === "phone" ? value : "",
                code,
                type.toUpperCase() as "EMAIL" | "PHONE"
            )
            onVerified?.()
        } catch (err) {
            console.error("Verify error:", err)
        } finally {
            setLoading(false)
        }
    }

    // 统一输入框样式
    const inputBaseClass = `
        w-full h-10 px-4 rounded-xl text-sm transition-all outline-none
        border border-neutral-200 dark:border-zinc-700 
        bg-white dark:bg-zinc-900 dark:text-white
        focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black/5
    `;

    return (
        <div className="space-y-5">
            {/* 头部：标题与取消 */}
            <div className="flex justify-between items-end">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
                    {type === "email" ?  "Email Verification" : "Phone Verification"}
                </h3>
            </div>

            {/* 输入区域 */}
            <div className="space-y-4">
                {/* 1. 邮箱/手机号输入 + 发送按钮 */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-tighter">
                        {type === "email" ?  "Email Address" : "Phone Number"}
                    </label>
                    <div className="relative flex gap-2">
                        <div className="flex-1 [&_input]:h-10 [&_input]:rounded-xl">
                            {type === "email" ? (
                                <input
                                    type="email"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder={"example@ainostore.com"}
                                    className={inputBaseClass}
                                />
                            ) : (
                                <IntlPhoneInput
                                    value={value}
                                    onChangeAction={setValue}
                                />

                            )}
                        </div>
                        <button
                            onClick={handleSendCode}
                            disabled={loading || countdown > 0 || !value}
                            className="h-10 px-4 rounded-xl bg-green-800 dark: text-xs font-semibold text-white dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all disabled:opacity-80 whitespace-nowrap"
                        >
                            {countdown > 0 ? `${countdown}s` : loading ? "..." : "Send"}
                        </button>
                    </div>
                </div>

                {/* 2. 验证码输入 */}
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-500">
                    <label className="text-[11px] font-medium text-neutral-400 uppercase tracking-tighter">
                        {"6-Digit Code"}
                    </label>
                    <input
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={"000000"}
                        className={`${inputBaseClass} tracking-[0.5em] font-mono text-center`}
                    />
                </div>
            </div>

            {/* 底部按钮组 */}
            <div className="pt-2 space-y-2">
                <button
                    onClick={handleVerify}
                    disabled={loading || !code || !value}
                    className="w-full hover:bg-black hover:text-white h-10 bg-green-800 dark: text-white dark:text-black rounded-xl text-sm font-semibold active:scale-[0.98] transition-all disabled:opacity-90"
                >
                    {loading ? "Verifying..." : "Confirm & Link"}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full h-10 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    >
                        {"Cancel"}
                    </button>
                )}
            </div>
        </div>
    )
}