// 域名白名单：允许跳转的可信第三方域名列表
// 策略：相对路径 / 本站域名直接放行；其他域名需命中白名单，否则弹出二次确认
const TRUSTED_EXTERNAL_DOMAINS = [
  // ---- SaaS 工具主流域名（工具跳转类） ----
  'github.com',
  'www.github.com',
  'figma.com',
  'www.figma.com',
  'canva.com',
  'www.canva.com',
  'notion.so',
  'www.notion.so',
  'vercel.com',
  'www.vercel.com',
  'cloudflare.com',
  'www.cloudflare.com',
  'semrush.com',
  'www.semrush.com',
  'ahrefs.com',
  'www.ahrefs.com',
  'hubspot.com',
  'www.hubspot.com',
  'midjourney.com',
  'www.midjourney.com',
  'openai.com',
  'www.openai.com',
  'chat.openai.com',
  'anthropic.com',
  'www.anthropic.com',
  'copy.ai',
  'www.copy.ai',
  'buffer.com',
  'www.buffer.com',
  'dropbox.com',
  'www.dropbox.com',
  'google.com',
  'www.google.com',
  'docs.google.com',
  'sheets.google.com',
  'drive.google.com',
  'mail.google.com',
  'translate.google.com',
  'bing.com',
  'www.bing.com',
  'baidu.com',
  'www.baidu.com',
  'fanyi.baidu.com',
  'weixin.qq.com',
  'qq.com',
  'www.qq.com',
  'zhihu.com',
  'www.zhihu.com',
  'bilibili.com',
  'www.bilibili.com',
  'douyin.com',
  'www.douyin.com',
  'taobao.com',
  'www.taobao.com',
  'tmall.com',
  'www.tmall.com',
  'jd.com',
  'www.jd.com',
  'miit.gov.cn',
  'beian.miit.gov.cn',
  '12377.cn',
  'www.12377.cn',
];

// 允许的安全协议（禁止javascript:/data:等危险协议；mailto:tel:保留）
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function normalizeHostname(hostname: string): string {
  return hostname.replace(/^\./, '').toLowerCase();
}

/**
 * 判断URL是否是站内链接（相对路径 或 协议相对 或 本站hostname）
 */
export function isInternalUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('#')) return true;
  if (trimmed.startsWith('/')) return true;
  if (trimmed.startsWith('?')) return true;
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return true;
  if (trimmed.startsWith('.')) return true;

  try {
    const u = new URL(trimmed, window.location.origin);
    return normalizeHostname(u.hostname) === normalizeHostname(window.location.hostname);
  } catch {
    return false;
  }
}

/**
 * 判断外部URL是否在可信白名单中
 */
export function isExternalDomainTrusted(url: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url, window.location.origin);
    const protocol = u.protocol.toLowerCase();
    if (!SAFE_PROTOCOLS.has(protocol)) return false;
    if (protocol === 'mailto:' || protocol === 'tel:') return true;
    const host = normalizeHostname(u.hostname);
    if (host === normalizeHostname(window.location.hostname)) return true;
    return TRUSTED_EXTERNAL_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

/**
 * 统一的安全跳转：
 * - 站内链接：直接打开
 * - 白名单域名：直接在新标签打开（noopener,noreferrer）
 * - 非白名单域名：弹窗二次确认，用户确认后才打开
 */
export function safeNavigate(url: string, target: '_blank' | '_self' = '_blank'): boolean {
  if (!url) return false;

  if (isInternalUrl(url)) {
    if (target === '_blank') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
    return true;
  }

  const trusted = isExternalDomainTrusted(url);
  let confirmMsg = '';
  if (!trusted) {
    if (typeof window !== 'undefined' && window.navigator && /zh/i.test(window.navigator.language || 'en')) {
      confirmMsg = `您即将离开本站前往以下地址：\n${url}\n\n该域名未在可信白名单内，是否继续？`;
    } else {
      confirmMsg = `You are about to leave this site and go to:\n${url}\n\nThis domain is not in the trusted whitelist. Continue?`;
    }
    try {
      const ok = window.confirm(confirmMsg);
      if (!ok) return false;
    } catch {
      return false;
    }
  }

  if (target === '_blank') {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = url;
  }
  return true;
}
