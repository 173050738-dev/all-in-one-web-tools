/**
 * lib/load-messages.ts
 * 服务端加载翻译消息，剥离 tools 命名空间（229KB）以减少 RSC payload。
 * 非英文语言会与英文做深度合并 fallback，保证缺失 key 有值。
 */

type Messages = Record<string, any>;

const LOADERS: Record<string, () => Promise<{ default: Messages }>> = {
  en: () => import('@/public/locales/en/translation.json'),
  zh: () => import('@/public/locales/zh/translation.json'),
  es: () => import('@/public/locales/es/translation.json'),
  hi: () => import('@/public/locales/hi/translation.json'),
  fr: () => import('@/public/locales/fr/translation.json'),
  ar: () => import('@/public/locales/ar/translation.json'),
};

function deepMergeFallback(target: any, fallback: any): any {
  if (target === null || target === undefined) return fallback;
  if (fallback === null || typeof fallback !== 'object' || Array.isArray(fallback)) return target;
  if (typeof target !== 'object' || Array.isArray(target)) return target;
  if (Object.keys(target).length === 0) return fallback;
  const out: any = { ...target };
  for (const k of Object.keys(fallback)) {
    const tv = out[k];
    const fv = fallback[k];
    if (tv !== null && typeof tv === 'object' && !Array.isArray(tv) && fv !== null && typeof fv === 'object' && !Array.isArray(fv)) {
      out[k] = deepMergeFallback(tv, fv);
    } else if (tv === undefined || tv === null || (typeof tv === 'object' && !Array.isArray(tv) && Object.keys(tv).length === 0)) {
      out[k] = fv;
    }
  }
  return out;
}

export async function loadMessages(locale: string): Promise<Messages> {
  const loader = LOADERS[locale] || LOADERS.en;
  const localeMessages = (await loader()).default;

  if (locale === 'en') {
    const { tools: _tools, ...rest } = localeMessages;
    return rest;
  }

  const enMessages = (await LOADERS.en()).default;
  const { tools: _enTools, ...enCore } = enMessages;
  const { tools: _localeTools, ...localeCore } = localeMessages;
  return deepMergeFallback(localeCore, enCore);
}
