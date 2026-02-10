import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export const getRequestConfig = async ({ locale }: { locale: string }) => {
    const currentLocale = locale;

    // 1. 读取本地的语言文件（以 'zh' 为例）
    const baseDir = path.join(process.cwd(), 'messages', 'zh'); // 根据当前语言动态选择目录
    const localMessages: any = {};

    if (fs.existsSync(baseDir)) {
        const files = fs.readdirSync(baseDir);
        files.forEach((file) => {
            if (file.endsWith('.yaml')) {
                const content = yaml.load(fs.readFileSync(path.join(baseDir, file), 'utf8'));
                localMessages[path.parse(file).name] = content;
            }
        });
    }

    // 2. 如果语言是中文 'zh'，直接返回本地翻译
    if (currentLocale === 'zh') {
        return { locale: currentLocale, messages: localMessages };
    }

    // 3. 如果是其他语言（如 'en'），则尝试从后端获取翻译
    try {
        const apiBase = process.env.BACKEND_API || 'http://127.0.0.1:8000'; // 默认 URL，若未配置环境变量

        const payload: any[] = [];
        for (const ns in localMessages) {
            for (const key in localMessages[ns]) {
                const text = localMessages[ns][key];
                payload.push({
                    content_hash: CryptoJS.MD5(text).toString(),
                    text: text,
                    namespace: ns,
                    key: key
                });
            }
        }

        // 发起翻译请求
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);  // 设置超时

        const response = await fetch(`${apiBase}/i18n/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lang: currentLocale, items: payload }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);  // 请求成功后清除超时

        const translatedData = response.ok ? await response.json() : {};

        // 合并本地消息和翻译数据
        return {
            locale: currentLocale,
            messages: { ...localMessages, ...translatedData }
        };

    } catch (error) {
        // API 请求失败时，回退到本地翻译
        console.error(`[i18n] API Error for locale: ${currentLocale}, falling back to local:`, error);
        return {
            locale: currentLocale,
            messages: localMessages
        };
    }
};