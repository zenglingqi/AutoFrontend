import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: 'jwt' },
    secret: process.env.AUTH_SECRET,
    // 强制 Cookie 在根域名下，不带语言后缀
    cookies: {
        pkceCodeVerifier: {
            name: 'next-auth.pkce.code_verifier',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            // 确保授权请求不带任何自定义参数干扰
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== 'google' && account?.provider !== 'facebook') return true;

            try {
                // 将数据发送给你的后台
                const response = await clientAPIFrame("/api/auth/login", {
                    method: 'POST',
                    body: JSON.stringify({
                        loginIdentifierType: account.provider,
                        googleToken: account.id_token,
                        facebookToken: account.access_token,
                        identifier: user.email,
                        password: "",
                    }),
                });

                if (!response.ok) return false;
                const data = await response.json();
                (user as any).backendToken = data.accessToken;
                return true;
            } catch (error) {
                console.error("Backend Auth Error:", error);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) token.backendToken = (user as any).backendToken;
            return token;
        },
        async session({ session, token }) {
            if (session.user) (session.user as any).backendToken = token.backendToken;
            return session;
        },
    },
    // 注意：这里不要在 signIn 路径里带 [locale] 变量，
    // NextAuth 会自动处理内部跳转
    pages: {
        signIn: '/login',
    },
    debug: process.env.NODE_ENV === 'development',
});