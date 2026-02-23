import {DefaultSession} from 'next-auth';

import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            accountNo: string;
            displayName: string;
            avatarUrl: string | null;

            accessToken: string | null;
            refreshToken: string | null;

            oauthToken: string;//为绑定已有用户，而非三方注册用户增加
            oauthProvider: string; //为绑定已有用户，而非三方注册用户增加

        } & DefaultSession["user"]
    }
}


declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        accountNo: string;
        displayName: string;
        avatarUrl: string | null;

        accessToken: string | null;
        refreshToken: string | null;

    }
}