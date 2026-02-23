import { useState, useCallback } from "react"
import type {ChangeEvent} from "react";
import Cropper from "react-easy-crop"
import type { Area } from "react-easy-crop"
import getCroppedImg from "@/app/api/functionsUser/cropImage"
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";


interface Props {
    onClose: () => void
    onUploaded: () => void
}

export default function AvatarUploadModal({ onClose, onUploaded }: Props) {


    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState<number>(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [loading, setLoading] = useState(false)

    // 裁剪完成回调
    const onCropComplete = useCallback(
        (_: Area, croppedPixels: Area) => {
            setCroppedAreaPixels(croppedPixels)
        },
        []
    )

    // 选择文件
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            setImageSrc(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    // 保存裁剪结果
    const handleSave = async () => {
        if (!croppedAreaPixels || !imageSrc) return

        setLoading(true)

        try {
            const blob = await getCroppedImg(imageSrc, croppedAreaPixels)

            const formData = new FormData()
            formData.append("file", blob, "avatar.jpg")

            const res = await clientAPIFrame("/api/user/upload/avatar", {
                method: "POST",
                body: formData
            })

            if (res.url) {
                onUploaded()
                onClose()
            }
        } catch (err) {
            console.error("Upload error:", err)
        }

        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 w-full max-w-md">

                <h2 className="text-lg font-semibold mb-4 dark:text-white">
                    Change Profile Photo
                </h2>

                {/* 未选择图片时 */}
                {!imageSrc && (
                    <div className="space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm"
                        />

                        <button
                            onClick={onClose}
                            className="w-full py-2 mt-2 text-sm text-gray-500 dark:text-neutral-400"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* 已选择图片，进入裁剪 */}
                {imageSrc && (
                    <>
                        <div className="relative w-full h-64 bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        {/* Zoom */}
                        <div className="mt-4">
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* 按钮 */}
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={onClose}
                                className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:underline"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
