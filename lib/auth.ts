// @/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import { clientAPIFrame } from "@/app/api/frameAPI/clientAPIFrame";
import {serverAPIFrame} from "@/app/api/frameAPI/serverAPIFrame";




/**
 * 核心刷新逻辑：与后端交互换取新 Token
 * 提取后可供 serverAPIFrame 和 NextAuth 回调共同使用
 */
export async function refreshAccessToken(token: any) {
    try {
        const response = await serverAPIFrame(`/api/backend-auth/refresh`, {
            method: "POST",
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        if (!response.ok) throw new Error("RefreshAccessTokenError");

        const data = await response.json();

        console.log("[AUTH] Token refreshed and persisted to session.");

        return {
            ...token,
            accessToken: data.accessToken,
            // 算出新的过期时间：当前时间 + 后端返回的有效秒数 (例如 3600秒)
            // 建议提前 30 秒刷新以抵消网络延迟
            accessTokenExpires: Date.now() + (data.expiresIn || 3600) * 1000 - 30000,
            refreshToken: data.refreshToken ?? token.refreshToken, // 后端若返回新 RF 则更新
        };
    } catch (error) {
        console.error("[AUTH] Persistent refresh failed:", error);
        return {
            ...token,
            error: "RefreshAccessTokenError", // 标记错误，供前端感知并强制登出
        };
    }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: 'jwt' },

    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                identifier: { label: "Identifier", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) return null;

                try {
                    //const apiBase = process.env.NEXT_PUBLIC_AUTH_URL;
                    // 核心：请求后端登录接口
                    const response = await serverAPIFrame(`/api/backend-auth/login`, {
                        method: 'POST',
                        body: JSON.stringify({
                            identifier: credentials.identifier,
                            password: credentials.password,
                            loginIdentifierType: (credentials.identifier as string).includes('@') ? 'email' : 'phone'
                        }),
                    });

                    if (!response.ok) return null;
                    const data = await response.json();

                    // 映射后端返回的 user 对象结构
                    /**
                     * {
                     *     "accessToken": "eyJhbk",
                     *     "expiresIn": 90000,
                     *     "refreshToken": "eyJhbGciOnkm56Y",
                     *     "refreshExpiresIn": 2592000,
                     *     "user": {
                     *         "id": 1,
                     *         "accountNo": "Uc10b8fe71b8d4752",
                     *         "displayName": "Able KQ",
                     *         "primaryEmail": "curatedunique@gmail.com",
                     *         "emailVerified": true,
                     *         "primaryPhone": "+8532323",
                     *         "phoneVerified": true,
                     *         "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIEXZM8Bk1FnHG6WM_S5modHGCP4XnTTk1nY1q9pHk7Xlkw2Q=s96-c"
                     *     }
                     * }
                     */
                    if (data.user) {
                        return {
                            id: data.user.id.toString(),
                            name: data.user.displayName,
                            email: data.user.primaryEmail,
                            image: data.user.avatarUrl,
                            accountNo: data.user.accountNo,

                            accessToken:data.accessToken,
                            refreshToken:data.refreshToken,

                        };
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            }
        }),
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
        async signIn({user, account }) {
            if (account?.provider === 'credentials') return true;

            // 第三方登录同步给后端，获取后端 Cookie 和用户信息
            if (account?.provider === 'google' || account?.provider === 'facebook') {
                try {

                    //const apiBase = process.env.NEXT_PUBLIC_AUTH_URL;
                    const response = await serverAPIFrame(`/api/backend-auth/login`, {
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

                    // 将后端数据挂载到 NextAuth user 对象
                    /**
                     * {
                     *     "accessToken": "eyJhbk",
                     *     "expiresIn": 90000,
                     *     "refreshToken": "eyJhbGciOnkm56Y",
                     *     "refreshExpiresIn": 2592000,
                     *     "user": {
                     *         "id": 1,
                     *         "accountNo": "Uc10b8fe71b8d4752",
                     *         "displayName": "Able KQ",
                     *         "primaryEmail": "curatedunique@gmail.com",
                     *         "emailVerified": true,
                     *         "primaryPhone": "+8532323",
                     *         "phoneVerified": true,
                     *         "avatarUrl": "https://lh3.googleusercontent.com/a/ACg8ocIEXZM8Bk1FnHG6WM_S5modHGCP4XnTTk1nY1q9pHk7Xlkw2Q=s96-c"
                     *     }
                     * }
                     */
                    (user as any).id = data.user.id.toString();
                    (user as any).accountNo = data.user.accountNo;
                    (user as any).displayName = data.user.displayName;
                    (user as any).avatarUrl = data.user.avatarUrl;
                    (user as any).accessToken=data.accessToken;
                    (user as any).refreshToken=data.refreshToken;

                    return true;
                } catch (error) {
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, account }) {
            // 1. 初始登录 (Initial sign in)
            if (account && user) {
                return {
                    ...token,
                    id: user.id,
                    accountNo: (user as any).accountNo,
                    displayName: (user as any).name || (user as any).displayName,
                    avatarUrl: user.image || (user as any).avatarUrl,
                    accessToken: (user as any).accessToken,
                    refreshToken: (user as any).refreshToken,
                    // 保存过期时间戳
                    accessTokenExpires: Date.now() + ((user as any).expiresIn || 3600) * 1000 - 30000,
                    oauthToken: account.access_token,
                    oauthProvider: account.provider,
                };
            }

            // 2. 如果 Token 尚未过期，直接返回现有 token
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // 3. Token 已过期，尝试持久化刷新并更新 Cookie
            return refreshAccessToken(token);
        },

        async session({ session, token }) {
            if (session.user) {
                const u = session.user as any;
                u.id = token.id;
                u.accountNo = token.accountNo;
                u.displayName = token.displayName;
                u.avatarUrl = token.avatarUrl;
                u.accessToken = token.accessToken;
                u.refreshToken = token.refreshToken;
                u.oauthToken = token.oauthToken;
                u.oauthProvider = token.oauthProvider;
                // 将错误状态暴露给客户端（如：RefreshAccessTokenError）
                u.error = token.error;
            }
            return session;
        },
    },
    pages: { signIn: '/login' },

});