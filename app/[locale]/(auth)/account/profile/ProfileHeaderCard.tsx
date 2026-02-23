import { useState } from "react"
import AvatarUploadModal from "./AvatarUploadModal"
import { updateProfile} from "@/app/api/functionsUser/user";

interface Props {
    data: {
        avatarUrl?: string
        displayName: string
        accountNo: string
        email?: string
        phone?: string
    }
    onUpdated: () => void
}

export default function ProfileHeaderCard({ data, onUpdated }: Props) {
    const [showUpload, setShowUpload] = useState(false)
    const [editingName, setEditingName] = useState(false)
    const [newDisplayName, setNewDisplayName] = useState(data.displayName)

    const handleEditName = () => setEditingName(true)

    const handleSaveName = async () => {
        if (newDisplayName !== data.displayName && newDisplayName.trim() !== "") {
            try {
                await updateProfile({ displayName: newDisplayName, avatarUrl: "" })
                onUpdated()
            } catch (error) {
                console.error("Failed to update username", error)
            }
        }
        setEditingName(false)
    }

    return (
        <div className="
            bg-white dark:bg-zinc-900
            border border-neutral-200 dark:border-zinc-800
            rounded-2xl p-8
            shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]
            flex items-center gap-8
            transition-all duration-300
        ">
            {/* Avatar - 精致双层边框 */}
            <div
                className="relative group cursor-pointer flex-shrink-0"
                onClick={() => setShowUpload(true)}
            >
                <div className="w-24 h-24 rounded-full p-1 bg-neutral-50 dark:bg-zinc-800 border border-neutral-100 dark:border-zinc-700 shadow-inner">
                    <img
                        src={data.avatarUrl || "/default-avatar.png"}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover bg-white"
                    />
                </div>
                {/* 悬停遮罩 */}
                <div className="absolute inset-1 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            </div>

            {/* Text Information */}
            <div className="flex-1 space-y-3">
                {/* Editable Username - 衬线体标题 */}
                <div className="flex items-center gap-3 group/name">
                    {editingName ? (
                        <input
                            type="text"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            onBlur={handleSaveName}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                            autoFocus
                            className="bg-transparent border-b-2 border-black dark:border-white text-2xl font-serif outline-none py-0.5 w-full max-w-xs"
                        />
                    ) : (
                        <h1
                            className="text-2xl font-serif font-medium text-neutral-900 dark:text-white cursor-pointer"
                            onDoubleClick={handleEditName}
                        >
                            {"Account Name"} : {data.displayName}
                        </h1>
                    )}

                    {!editingName && (
                        <button
                            onClick={handleEditName}
                            className="opacity-60 group-hover/name:opacity-100 p-1.5 text-neutral-400 hover:text-black dark:hover:text-white transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Account Details - 标签化展示 */}
                <div className="flex flex-wrap gap-y-2 gap-x-4">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 dark:bg-zinc-800 rounded-full border border-neutral-100 dark:border-zinc-700">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-tighter">ID</span>
                        <span className="text-[12px] font-medium text-neutral-600 dark:text-zinc-300">
                            {data.accountNo}
                        </span>
                    </div>

                    {data.email && (
                        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-zinc-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">{data.email}</span>
                        </div>
                    )}

                    {data.phone && (
                        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-zinc-400">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-xs">{data.phone}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Avatar Upload Modal */}
            {showUpload && (
                <AvatarUploadModal onClose={() => setShowUpload(false)} onUploaded={onUpdated} />
            )}
        </div>
    )
}