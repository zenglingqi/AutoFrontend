// @/app/api/frameAPI/clientAPIFrame.ts
import { signOut, getSession } from "next-auth/react";

function getBaseHeaders(accessToken?: string | null): Record<string, string> {
    const headers: Record<string, string> = {
        "User-Agent": "ainostore.com/front",
        "X-Request-Source": "Nextjs-App",
    };
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return headers;
}

export async function clientAPIFrame(path: string, options: RequestInit = {}) {
    const apiBase = process.env.NEXT_PUBLIC_BACKEND_API;

    let accessToken: string | null = null;
    let refreshToken: string | null = null;

    try {
        const session = await getSession();
        // 修复 any：使用类型断言
        accessToken = (session?.user as { accessToken?: string })?.accessToken || null;
        refreshToken = (session?.user as { refreshToken?: string })?.refreshToken || null;
    } catch {
        // 修复 unused-vars：移除未使用的 (e)
        console.warn("[AUTH] Failed to fetch session.");
    }

    const headers: Record<string, string> = {
        ...getBaseHeaders(accessToken),
        ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    const requestOptions = { ...options, headers };

    try {
        // 修复 prefer-const：let 改为 const
        const res = await fetch(`${apiBase}${path}`, requestOptions);

        if (res.status === 401 && !path.includes('/api/backend-auth/refresh')) {
            if (refreshToken) {
                const refreshRes = await fetch(`${apiBase}/api/backend-auth/refresh`, {
                    method: 'POST',
                    headers: getBaseHeaders(),
                    body: JSON.stringify({ refreshToken }),
                    credentials: 'include'
                });

                if (refreshRes.ok) {
                    const newTokens = await refreshRes.json();
                    const newAccessToken = newTokens.accessToken;

                    const retryHeaders = {
                        ...headers,
                        "Authorization": `Bearer ${newAccessToken}`
                    };

                    return await fetch(`${apiBase}${path}`, {
                        ...requestOptions,
                        headers: retryHeaders,
                    });
                } else {
                    handleUnauthenticated();
                }
            } else {
                handleUnauthenticated();
            }
        }

        return res;
    } catch (err) {
        console.error(`[FETCH ERROR] ${path}`, err);
        throw err;
    }
}

function handleUnauthenticated() {
    if (typeof window !== 'undefined') {
        signOut({ callbackUrl: '/login' });
    }
}