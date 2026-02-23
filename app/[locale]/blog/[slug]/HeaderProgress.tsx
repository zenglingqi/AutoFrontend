"use client";
import { useEffect, useState } from "react";

export default function HeaderProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercent = (window.scrollY / (documentHeight - windowHeight)) * 100;
            setProgress(scrollPercent);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        /* z-index 设为 101 确保在 Header (通常为 100) 之上 */
        /* 使用 h-[2px] 保持纤细，不遮挡文字 */
        <div className="fixed top-0 left-0 w-full h-[2px] z-[101] pointer-events-none">
            <div
                className="h-full bg-[rgb(var(--accent-main))] shadow-[0_0_10px_rgba(var(--accent-main),0.4)] transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}