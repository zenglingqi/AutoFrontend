import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            backendToken?: string;
            role?: string;
        } & DefaultSession["user"]
    }
}