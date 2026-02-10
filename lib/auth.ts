import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"

export const { handlers, auth, signIn, signOut } = NextAuth({
    // 策略建议使用 JWT，这样不需要在前端数据库存 session，性能更好
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
        }),
    ],
    callbacks: {
        // 1. 登录时验证逻辑
        async signIn({ user, account, profile }) {
            if (account?.provider === "google" || account?.provider === "facebook") {
                // 这里的 id_token (Google) 或 access_token (FB) 就是你要发给后端的凭证
                const externalToken = account.id_token || account.access_token;

                try {
                    // 调用你现有的后端接口
                    const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/external-verify`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            token: externalToken,
                            provider: account.provider,
                            email: user.email,
                        }),
                    });

                    const data = await response.json();

                    if (response.ok && data.apiToken) {
                        // 将后端返回的私有 Token 临时挂载到 user 对象上
                        (user as any).backendToken = data.apiToken;
                        (user as any).role = data.role || 'user';
                        return true;
                    } else {
                        console.error("后端验证失败:", data.message);
                        return false; // 返回 false 会跳转到错误页
                    }
                } catch (error) {
                    console.error("连接后端 API 出错:", error);
                    return false;
                }
            }
            return true;
        },

        // 2. 将数据写入 JWT Token (加密的 Cookie)
        async jwt({ token, user, account }) {
            // 只有在登录的那一刻，user 才有值
            if (user) {
                token.backendToken = (user as any).backendToken;
                token.role = (user as any).role;
            }
            return token;
        },

        // 3. 将 JWT 里的数据暴露给前端 useSession 或服务端 auth()
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).backendToken = token.backendToken;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login', // 指定你的自定义登录页
        error: '/auth/error',
    },
})