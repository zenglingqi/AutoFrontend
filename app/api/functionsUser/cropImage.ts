import type { Area } from "react-easy-crop"

export default function getCroppedImg(
    imageSrc: string,
    pixelCrop: Area
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = imageSrc
        image.crossOrigin = "anonymous"

        image.onload = () => {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")

            if (!ctx) {
                reject(new Error("Canvas context not available"))
                return
            }

            canvas.width = pixelCrop.width
            canvas.height = pixelCrop.height

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            )

            canvas.toBlob((blob) => {
                if (blob) resolve(blob)
                else reject(new Error("Canvas is empty"))
            }, "image/jpeg")
        }

        image.onerror = () => reject(new Error("Failed to load image"))
    })
}
