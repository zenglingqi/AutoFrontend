import {createHash} from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './navigation';

type NamespaceMessages = Record<string, string>;
type Messages = Record<string, NamespaceMessages>;

type TranslationItem = {
  content_hash: string;
  text: string;
  namespace: string;
  key: string;
};

const BASE_LOCALE = 'zh';

async function loadBaseMessages(): Promise<Messages> {
  const baseDir = path.join(process.cwd(), 'messages', BASE_LOCALE);
  const entries = await fs.readdir(baseDir, {withFileTypes: true});
  const yamlFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.yaml'));

  const messages: Messages = {};

  for (const file of yamlFiles) {
    const namespace = path.parse(file.name).name;
    const content = await fs.readFile(path.join(baseDir, file.name), 'utf8');
    const parsed = yaml.load(content) as NamespaceMessages;
    messages[namespace] = parsed;
  }

  return messages;
}

function buildPayload(baseMessages: Messages): TranslationItem[] {
  const payload: TranslationItem[] = [];

  for (const [namespace, records] of Object.entries(baseMessages)) {
    for (const [key, text] of Object.entries(records)) {
      payload.push({
        content_hash: createHash('md5').update(text).digest('hex'),
        text,
        namespace,
        key
      });
    }
  }

  return payload;
}

function mergeMessages(baseMessages: Messages, translatedData: unknown): Messages {
  if (!translatedData || typeof translatedData !== 'object') {
    return baseMessages;
  }

  const merged: Messages = structuredClone(baseMessages);
  const translatedRecord = translatedData as Record<string, unknown>;

  for (const [namespace, values] of Object.entries(translatedRecord)) {
    if (typeof values !== 'object' || values === null) {
      continue;
    }

    if (!merged[namespace]) {
      merged[namespace] = {};
    }

    Object.assign(merged[namespace], values as NamespaceMessages);
  }

  return merged;
}

async function syncTranslations(locale: string, baseMessages: Messages): Promise<Messages> {
  const apiBase = process.env.BACKEND_API;

  if (!apiBase) {
    return baseMessages;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${apiBase}/i18n/translate`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        lang: locale,
        items: buildPayload(baseMessages)
      }),
      signal: controller.signal,
      cache: 'no-store'
    });

    if (!response.ok) {
      return baseMessages;
    }

    const translatedData = await response.json();
    return mergeMessages(baseMessages, translatedData);
  } catch {
    return baseMessages;
  } finally {
    clearTimeout(timeout);
  }
}

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const baseMessages = await loadBaseMessages();
  const messages = locale === BASE_LOCALE
    ? baseMessages
    : await syncTranslations(locale, baseMessages);

  return {locale, messages};
});
