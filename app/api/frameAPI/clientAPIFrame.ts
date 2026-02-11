// src/api/client.ts
import { auth } from "@/lib/auth"; // 引入你上传的 Auth.js 配置




export async function clientAPIFrame(path: string, options: RequestInit = {}) {
    const apiBase = process.env.BACKEND_API || "http://localhost:8081";

    let token = null;

    // --- 改进点 1: 增加防御性判断 ---
    // 如果是登录或注册路径，直接跳过 auth()，避免死循环或上下文报错
    const isAuthPath = path.includes('/api/auth/login') || path.includes('/api/auth/register');

    if (!isAuthPath) {
        try {
            const session = await auth();
            token = session?.user?.backendToken;
        } catch (e) {
            // 如果取 session 失败，只记录警告，不阻塞 fetch
            console.warn(`[AUTH SKIP] 无法获取 Session: ${path}`);
        }
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0...",
        "X-Request-Source": "Nextjs-Server-Side",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        console.log(`>>>> [FETCH] 发起请求: ${apiBase}${path}`);
        const res = await fetch(`${apiBase}${path}`, {
            cache: options.cache || 'no-store',
            ...options,
            headers,
        });

        if (!res.ok) {
            // 这里建议打印出具体状态码，方便排查 400/403
            console.error(`[API ERROR] ${path} -> Status: ${res.status}`);
        }

        return res;
    } catch (err) {
        // 如果这里报错，说明是真正的网络不通（比如 URL 拼错了，或者后端没开）
        console.error(`[REAL NETWORK FAILED] ${path}:`, err);
        throw err;
    }
}