/**
 * Cloudflare Pages Advanced Mode Worker — 根据 Accept-Language 或用户手动设置的 Cookie 做边缘重定向
 * 部署方式：Next.js 静态 export 时自动把 public/_worker.js 复制到 out/_worker.js，
 * wrangler pages deploy out/ 会自动识别为 Pages Worker，无需额外创建 Worker 项目。
 *
 * 规则：
 * 1) 对带扩展名的静态资源（.js / .css / .png / .svg …）、/_next/*、/_headers、/_redirects、/robots.txt、/sitemap.xml、/site.webmanifest、/sw.js 直接放行，不重定向。
 * 2) 路径第一段已经是 6 种语言之一（/en /zh /es /hi /fr /ar）→ 直接透传，保持用户访问的语言页。
 * 3) 其他路径（通常是根路径 / 或旧链接）：
 *    a. Cookie `korelyy-locale` 存在且合法 → 307 跳转到 /{该语言}/原路径
 *    b. 否则解析 Accept-Language 头，按质量值 q 的优先级取第一个命中的前缀
 *       zh → zh, fr → fr, es → es, hi → hi, ar → ar, 其它全部 → en
 *       然后 307 跳转到 /{目标语言}/原路径
 *
 * 307（Temporary Redirect）的好处：搜索引擎不会永久缓存跳转结果，用户手动切换语言后下次也能正确进入。
 */

const SUPPORTED_LOCALES = new Set(['en', 'zh', 'es', 'hi', 'fr', 'ar']);
const LOCALE_COOKIE_KEY = 'korelyy-locale';

const STATIC_BYPASS_PREFIXES = ['/_next/', '/_headers', '/_redirects'];
const STATIC_BYPASS_FILES = new Set([
  '/robots.txt',
  '/sitemap.xml',
  '/site.webmanifest',
  '/sw.js',
  '/favicon.svg',
  '/og-image.svg',
]);

function hasStaticExtension(pathname) {
  // 任何匹配 "点 + 1~6 位字母/数字（扩展名）结尾" 的都视为静态文件，不参与语言重定向
  return /\.[a-zA-Z0-9]{1,6}$/.test(pathname);
}

function parsePathLocale(pathname) {
  const first = pathname.split('/').filter(Boolean)[0];
  if (!first) return null;
  return SUPPORTED_LOCALES.has(first) ? first : null;
}

function readCookieLocale(cookieHeader) {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(';');
  for (const p of pairs) {
    const [k, v] = p.trim().split('=');
    if (k === LOCALE_COOKIE_KEY && v && SUPPORTED_LOCALES.has(v)) {
      return v;
    }
  }
  return null;
}

/**
 * RFC 4647 简化版 Accept-Language 解析
 * 输入: "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,fr;q=0.6"
 * 输出: [{tag:"zh-CN",q:1},{tag:"zh",q:0.9},...] 按 q 降序排好
 */
function parseAcceptLanguage(header) {
  if (!header) return [];
  return header
    .split(',')
    .map((raw) => {
      const parts = raw.trim().split(';');
      const tag = parts[0].trim().toLowerCase();
      let q = 1;
      for (let i = 1; i < parts.length; i++) {
        const [k, v] = parts[i].trim().split('=');
        if (k === 'q' && v) {
          const n = parseFloat(v);
          if (!Number.isNaN(n)) q = n;
        }
      }
      return { tag, q };
    })
    .filter((x) => x.tag && x.q > 0)
    .sort((a, b) => b.q - a.q);
}

function pickLocaleFromAccept(header) {
  const entries = parseAcceptLanguage(header);
  for (const { tag } of entries) {
    if (SUPPORTED_LOCALES.has(tag)) return tag;
    const prefix = tag.split('-')[0];
    if (SUPPORTED_LOCALES.has(prefix)) return prefix;
  }
  return 'en';
}

/**
 * @param {Request} request
 * @param {object} env
 * @param {import("@cloudflare/workers-types").ExecutionContext} ctx
 * @returns {Promise<Response>}
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, search } = url;

    // 1) 静态资源白名单：直接放行
    if (
      STATIC_BYPASS_PREFIXES.some((p) => pathname.startsWith(p)) ||
      STATIC_BYPASS_FILES.has(pathname) ||
      hasStaticExtension(pathname)
    ) {
      return env.ASSETS.fetch(request);
    }

    // 2) 已经在带语言前缀的路径下 → 直接透传
    if (parsePathLocale(pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 3) 判断用户手动选择（Cookie）→ 自动检测（Accept-Language）
    const cookie = request.headers.get('Cookie');
    const cookieLocale = readCookieLocale(cookie);
    const accept = request.headers.get('Accept-Language');
    const target = cookieLocale ?? pickLocaleFromAccept(accept);

    // 拼接跳转目标，保留原 query / hash 部分（hash 在服务端不可见，由浏览器保留）
    const rest = pathname === '/' ? '' : pathname;
    const redirectTo = `/${target}${rest}${search}`;

    return Response.redirect(new URL(redirectTo, url).toString(), 307);
  },
};
