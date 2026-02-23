import { useState } from "react"
import VerifyInputBlock from "@/components/Auth/VerifyInputBlock";

interface EmailItem {
    id: number
    email: string
    verified: boolean
    primary?: boolean
}

interface Props {
    emails: EmailItem[]

    onUpdated?: () => void
}

export default function EmailListCard({ emails, onUpdated }: Props) {
    const [showEmailForm, setShowEmailForm] = useState(false)

    return (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-all">
            {/* 标题部分 */}
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-zinc-800">
                <h2 className="text-lg font-serif font-medium text-neutral-900 dark:text-white tracking-wide">
                    { "Email Settings"}
                </h2>
                <p className="mt-1 text-xs text-neutral-500 font-light">
                    { "Manage your account's primary and recovery emails."}
                </p>
            </div>

            <div className="p-6">
                {/* 邮箱列表 */}
                <div className="space-y-3">
                    {emails.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-4 rounded-xl border border-neutral-50 dark:border-zinc-800 bg-neutral-50/30 dark:bg-zinc-800/20"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-neutral-800 dark:text-zinc-200">
                                    {item.email}
                                </span>

                                <div className="flex items-center gap-1.5">
                                    {/* 状态小圆点 */}
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.verified ? 'bg-green-500' : 'bg-amber-500'}`} />
                                    <span className={`text-[11px] font-medium uppercase tracking-tight ${
                                        item.verified
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-amber-600 dark:text-amber-400"
                                    }`}>
                                        {item.verified ? ("Verified") : ("Action Required")}
                                    </span>
                                </div>
                            </div>

                            {/* 如果是主邮箱，显示一个精致的标签 */}
                            {item.primary && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-neutral-200 dark:border-zinc-700 text-neutral-400 uppercase">
                                    Primary
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* 添加邮箱操作区 */}
                {!showEmailForm ? (
                    <button
                        onClick={() => setShowEmailForm(true)}
                        className="
                            w-full h-10 mt-6 border border-dashed border-neutral-300 dark:border-zinc-700
                            rounded-xl flex items-center justify-center gap-2
                            text-xs font-medium text-neutral-600 dark:text-neutral-400
                            hover:bg-neutral-50 dark:hover:bg-zinc-800 hover:border-neutral-900 dark:hover:border-white transition-all
                        "
                    >
                        <span className="text-lg leading-none mb-0.5">+</span>
                        {"Add New Email"}
                    </button>
                ) : (
                    <div className="mt-6 p-5 border border-neutral-100 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-inner animate-in slide-in-from-top-2 duration-300">
                        <div className="mb-4 flex justify-between items-center">
                            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                                {"Verification"}
                            </span>
                        </div>
                        <VerifyInputBlock
                            type="email"
                            onVerified={() => {
                                setShowEmailForm(false)
                                onUpdated?.()
                            }}
                            onCancel={() => setShowEmailForm(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}