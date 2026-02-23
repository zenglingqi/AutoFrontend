// @/app/api/frameAPI/serverAPIFrame.ts
import { auth, refreshAccessToken } from "@/lib/auth";

function getServerHeaders(accessToken?: string | null, customHeaders: Record<string, string> = {}): Record<string, string> {
    return {
        "User-Agent": "ainostore.com/front",
        "X-Request-Source": "Nextjs-Server",
        ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
        ...customHeaders,
    };
}

export async function serverAPIFrame(path: string, options: RequestInit = {}) {
    const apiBase = process.env.NEXT_PUBLIC_AUTH_URL;
    const session = await auth();
    // 修复 prefer-const 和 any
    const accessToken = (session?.user as { accessToken?: string })?.accessToken || null;

    const headers = getServerHeaders(accessToken, options.headers as Record<string, string>);

    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
    }

    try {
        // 修复 prefer-const
        const res = await fetch(`${apiBase}${path}`, {
            ...options,
            headers,
            referrerPolicy: "no-referrer"
        });

        if (res.status === 401 && !path.includes('/api/backend-auth/refresh')) {
            const refreshToken = (session?.user as { refreshToken?: string })?.refreshToken;

            if (refreshToken) {
                const newTokens = await refreshAccessToken(refreshToken);

                if (newTokens?.accessToken) {
                    const retryHeaders = getServerHeaders(newTokens.accessToken, options.headers as Record<string, string>);
                    if (!(options.body instanceof FormData)) {
                        retryHeaders["Content-Type"] = "application/json";
                    }

                    return await fetch(`${apiBase}${path}`, {
                        ...options,
                        headers: retryHeaders
                    });
                }
            }
        }
        return res;
    } catch (err) {
        console.error(`[SERVER FETCH ERROR] ${path}`, err);
        throw err;
    }
}