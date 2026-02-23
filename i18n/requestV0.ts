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
 * 1. 通用本地消息加载函数
 * 支持加载指定 locale 的所有 YAML 配置文件
 */
async function loadLocalMessages(locale: string): Promise<Messages> {
    const dir = path.join(process.cwd(), 'messages', locale);
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        const yamlFiles = entries.filter((entry) =>
            entry.isFile() && (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml'))
        );

        const messages: Messages = {};
        for (const file of yamlFiles) {
            const namespace = path.parse(file.name).name;
            const content = await fs.readFile(path.join(dir, file.name), 'utf8');
            messages[namespace] = yaml.load(content) as NamespaceMessages;
        }
        return messages;
    } catch (error) {
        // 如果文件夹不存在或加载失败，返回空对象
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
 * 3. 混合同步逻辑：本地优先 -> 远程补全
 */
async function syncTranslations(
    locale: string,
    baseMessages: Messages,
    localTargetMessages: Messages
): Promise<Messages> {
    const apiBase = process.env.NEXT_PUBLIC_AUTH_URL;

    // 1. 深度合并：先用本地已有的目标语言文案覆盖基准文案
    const mergedMessages: Messages = JSON.parse(JSON.stringify(baseMessages));
    for (const [ns, records] of Object.entries(localTargetMessages)) {
        if (!mergedMessages[ns]) mergedMessages[ns] = {};
        Object.assign(mergedMessages[ns], records);
    }

    // 基准语言或无 API 直接返回
    if (!apiBase || locale === BASE_LOCALE) {
        return mergedMessages;
    }

    const payload: TranslationItem[] = [];
    for (const [namespace, records] of Object.entries(baseMessages)) {
        // --- 核心修复点：这里必须使用 flattenMessages 过滤掉路径 ---
        const filteredItems = flattenMessages(records);

        filteredItems.forEach(item => {
            // 从合并后的对象中取当前值（可能是本地 en.yaml 里的，也可能是默认 zh 的）
            // 我们通过递归路径获取准确的值进行对比
            const currentVal = getDeep(mergedMessages[namespace], item.key);

            // 只有当：
            // 1. 该项不是路径（flattenMessages 已保证）
            // 2. 且当前值等于中文原文（说明本地 target locale 文件里没有这一项）
            // 才提交翻译
            if (currentVal === item.text) {
                payload.push({
                    content_hash: createHash('md5').update(item.text).digest('hex'),
                    text: item.text,
                    namespace,
                    key: item.key
                });
            }
        });
    }

    if (payload.length === 0) return mergedMessages;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
        const response = await fetch(`${apiBase}/api/i18n/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Internal-Service-Token': process.env.I18N_SECRET || '',
                'User-Agent': 'YourShop-Frontend-Server'
            },
            body: JSON.stringify({ lang: locale, items: payload }),
            signal: controller.signal
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const translatedData = await response.json();

        // 将远程翻译回来的内容补全到 mergedMessages
        for (const [ns, flatKeys] of Object.entries(translatedData)) {
            if (!mergedMessages[ns]) mergedMessages[ns] = {};
            for (const [flatKey, text] of Object.entries(flatKeys as any)) {
                setDeep(mergedMessages[ns], flatKey, text as string);
            }
        }

        return mergedMessages;
    } catch (error) {
        console.error("[i18n] Remote Sync Failed, using local fallback:", error);
        return mergedMessages;
    } finally {
        clearTimeout(timeout);
    }
}



// 辅助函数：根据路径获取深层对象的值 (与 setDeep 对应)
function getDeep(obj: any, path: string) {
    return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
}

/**
 * 4. Next-intl 配置导出 (Next.js 15 适配)
 */
export default getRequestConfig(async ({ locale: requestLocalePromise }) => {
    const requestLocale = await requestLocalePromise;

    const locale = (requestLocale && routing.locales.includes(requestLocale as any))
        ? requestLocale
        : routing.defaultLocale;

    // 1. 加载基准语言 (zh) 作为最终兜底
    const baseMessages = await loadLocalMessages(BASE_LOCALE);

    // 2. 尝试加载当前语种的本地配置文件 (例如 /messages/en/*.yaml)
    const localTargetMessages = (locale !== BASE_LOCALE)
        ? await loadLocalMessages(locale)
        : {};

    // 3. 执行同步：本地已有优先，缺失部分去服务器翻译，服务器失败用 zh 兜底
    const messages = await syncTranslations(locale, baseMessages, localTargetMessages);

    return {
        locale,
        messages,
        timeZone: 'Asia/Shanghai'
    };
});