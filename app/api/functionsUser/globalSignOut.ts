// 建议在 /lib/auth-utils.ts
import { signOut as nextSignOut } from "next-auth/react";
import {clientAPIFrame} from "@/app/api/frameAPI/clientAPIFrame";

export const globalSignOut = async () => {
    // 1. 通知后端清除数据库中的 token 并抹掉浏览器 Cookie
    await clientAPIFrame('/api/backend-auth/logout', { method: 'POST' });
    // 2. 清除 Next-Auth 的 Session 并跳转
    await nextSignOut({ callbackUrl: '/login' });
};