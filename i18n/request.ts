import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './navigation';

// --- 类型定义 ---
type NamespaceMessages = Record<string, string>;
type Messages = Record<string, NamespaceMessages>;

type TranslationItem = {
    content_hash: string;
    text: string;
    namespace: string;
    key: string;
};

const BASE_LOCALE = 'en';

/**
 * 1. 加载本地基准语言包 (zh)
 * 作为所有翻译的原文来源
 */
async function loadBaseMessages(): Promise<Messages> {
    const baseDir = path.join(process.cwd(), 'messages', BASE_LOCALE);
    try {
        const entries = await fs.readdir(baseDir, { withFileTypes: true });
        const yamlFiles = entries.filter((entry) => entry.isFile() && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')));

        const messages: Messages = {};
        for (const file of yamlFiles) {
            const namespace = path.parse(file.name).name;
            const content = await fs.readFile(path.join(baseDir, file.name), 'utf8');
            messages[namespace] = yaml.load(content) as NamespaceMessages;
        }
        return messages;
    } catch (error) {
        console.error(`[i18n] Failed to load base messages:`, error);
        return {};
    }
}



function setDeep(obj: any, path: string, value: any) {
    const keys = path.split('.');
    let current = obj;
    while (keys.length > 1) {
        const key = keys.shift()!;
        if (!current[key]) current[key] = {};
        current = current[key];
    }
    current[keys[0]] = value;
}

/**
 * 2. 构建发送给后端的 Payload
 * 对应后端的 I18nRequestDTO.I18nItem
 */
function buildPayload(baseMessages: Messages): TranslationItem[] {
    const payload: TranslationItem[] = [];

    // 递归处理嵌套对象
    const flatten = (obj: any, namespace: string, prefix = '') => {
        for (const [key, value] of Object.entries(obj)) {
            const currentKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'string') {
                payload.push({
                    content_hash: createHash('md5').update(value).digest('hex'),
                    text: value,
                    namespace: namespace,
                    key: currentKey // 存储为 "nav.home"
                });
            } else if (typeof value === 'object' && value !== null) {
                flatten(value, namespace, currentKey);
            }
        }
    };

    for (const [namespace, records] of Object.entries(baseMessages)) {
        flatten(records, namespace);
    }

    return payload;
}

// 辅助函数：递归拍平 YAML (解决 Azure 400)
function flattenMessages(obj: any, prefix = ''): { key: string; text: string }[] {
    let items: { key: string; text: string }[] = [];


    // 匹配路径的正则：以 / 开头，且只包含 ASCII 路径字符，不含中文
    const isUrlPath = (str: string) => {
        // ^/ : 以斜杠开头
        // [a-zA-Z0-9\-_/]+ : 只允许英文、数字、中划线、下划线、斜杠
        // $ : 结尾
        const pathRegex = /^\/[a-zA-Z0-9\-_/]*$/;
        // 检查是否包含中文的正则
        const hasChinese = /[\u4e00-\u9fa5]/;

        return pathRegex.test(str) && !hasChinese.test(str);
    };

    for (const [k, v] of Object.entries(obj)) {
        const key = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'string') {
            // 如果判定为纯技术路径，则不加入待翻译列表
            if (isUrlPath(v)) {
                continue;
            }

            items.push({ key, text: v });
        } else if (typeof v === 'object' && v !== null) {
            items = items.concat(flattenMessages(v, key));
        }
    }

    return items;

}

/**
 * 3. 核心同步逻辑
 * 对接后端 Spring Boot: /api/i18n/translate
 */
async function syncTranslations(locale: string, baseMessages: Messages): Promise<Messages> {
    const apiBase = process.env.NEXT_PUBLIC_BACKEND_API;

    // 如果没有 API 地址或当前是基准语言，直接返回本地消息
    if (!apiBase || locale === BASE_LOCALE) {
        return baseMessages;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3秒超时，防止阻塞渲染

    const internalToken = process.env.I18N_SECRET; // 在 .env.local 中定义

    const payload: TranslationItem[] = [];
    for (const [namespace, records] of Object.entries(baseMessages)) {
        const flatItems = flattenMessages(records);
        flatItems.forEach(item => {
            payload.push({
                content_hash: createHash('md5').update(item.text).digest('hex'),
                text: item.text,
                namespace,
                key: item.key
            });
        });
    }

    try {
        const response = await fetch(`${apiBase}/api/i18n/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Internal-Service-Token': internalToken || '',
                'User-Agent': 'YourShop-Frontend-Server'
            },
            body: JSON.stringify({ lang: locale, items: payload }),
            signal: controller.signal
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const translatedData = await response.json();
        //const finalMessages: Messages = {};

        // 这样即便 Blog.href 被跳过翻译，它依然会有原始的 "/blog" 值
        const finalMessages: Messages = JSON.parse(JSON.stringify(baseMessages));

        for (const [ns, flatKeys] of Object.entries(translatedData)) {

            if (!finalMessages[ns]) finalMessages[ns] = {};
            for (const [flatKey, text] of Object.entries(flatKeys as any)) {

                setDeep(finalMessages[ns], flatKey, text as string);
            }
        }

        return finalMessages;

    } catch (error) {
        console.error("[i18n] Sync Error:", error);
        return baseMessages;
    } finally {
        clearTimeout(timeout); // Ensure to clear the timeout after the operation is complete
    }
}

/**
 * 4. Next-intl 配置导出 (Next.js 15 适配)
 */
export default getRequestConfig(async ({ locale: requestLocalePromise }) => {
    // Await the locale promise (Next.js 15 requirement)
    const requestLocale = await requestLocalePromise;

    // 严谨的类型校验与回退机制
    // 确保最终传递给 messages 的 locale 是字符串而非 undefined
    const locale = (requestLocale && routing.locales.includes(requestLocale as any))
        ? requestLocale
        : routing.defaultLocale;

    // 加载基准文案 (zh)
    const baseMessages = await loadBaseMessages();

    // 获取最终翻译消息 (根据 locale 从后端拉取或使用本地)
    const messages = await syncTranslations(locale, baseMessages);

    return {
        locale,    // 此时 locale 确定为 string 类型
        messages,
        timeZone: 'Asia/Shanghai'
    };
});