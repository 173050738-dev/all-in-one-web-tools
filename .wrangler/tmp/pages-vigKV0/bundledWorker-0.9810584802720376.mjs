var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js
var SUPPORTED_LOCALES = /* @__PURE__ */ new Set(["en", "zh", "es", "hi", "fr", "ar"]);
var LOCALE_COOKIE_KEY = "korelyy-locale";
var STATIC_BYPASS_PREFIXES = ["/_next/", "/_headers", "/_redirects"];
var STATIC_BYPASS_FILES = /* @__PURE__ */ new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/site.webmanifest",
  "/sw.js",
  "/favicon.svg",
  "/og-image.svg"
]);
function hasStaticExtension(pathname) {
  return /\.[a-zA-Z0-9]{1,6}$/.test(pathname);
}
__name(hasStaticExtension, "hasStaticExtension");
function parsePathLocale(pathname) {
  const first = pathname.split("/").filter(Boolean)[0];
  if (!first) return null;
  return SUPPORTED_LOCALES.has(first) ? first : null;
}
__name(parsePathLocale, "parsePathLocale");
function readCookieLocale(cookieHeader) {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(";");
  for (const p of pairs) {
    const [k, v] = p.trim().split("=");
    if (k === LOCALE_COOKIE_KEY && v && SUPPORTED_LOCALES.has(v)) {
      return v;
    }
  }
  return null;
}
__name(readCookieLocale, "readCookieLocale");
function parseAcceptLanguage(header) {
  if (!header) return [];
  return header.split(",").map((raw) => {
    const parts = raw.trim().split(";");
    const tag = parts[0].trim().toLowerCase();
    let q = 1;
    for (let i = 1; i < parts.length; i++) {
      const [k, v] = parts[i].trim().split("=");
      if (k === "q" && v) {
        const n = parseFloat(v);
        if (!Number.isNaN(n)) q = n;
      }
    }
    return { tag, q };
  }).filter((x) => x.tag && x.q > 0).sort((a, b) => b.q - a.q);
}
__name(parseAcceptLanguage, "parseAcceptLanguage");
function pickLocaleFromAccept(header) {
  const entries = parseAcceptLanguage(header);
  for (const { tag } of entries) {
    if (SUPPORTED_LOCALES.has(tag)) return tag;
    const prefix = tag.split("-")[0];
    if (SUPPORTED_LOCALES.has(prefix)) return prefix;
  }
  return "en";
}
__name(pickLocaleFromAccept, "pickLocaleFromAccept");
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, search } = url;
    if (STATIC_BYPASS_PREFIXES.some((p) => pathname.startsWith(p)) || STATIC_BYPASS_FILES.has(pathname) || hasStaticExtension(pathname)) {
      return env.ASSETS.fetch(request);
    }
    if (parsePathLocale(pathname)) {
      return env.ASSETS.fetch(request);
    }
    const cookie = request.headers.get("Cookie");
    const cookieLocale = readCookieLocale(cookie);
    const accept = request.headers.get("Accept-Language");
    const target = cookieLocale ?? pickLocaleFromAccept(accept);
    const rest = pathname === "/" ? "" : pathname;
    const redirectTo = `/${target}${rest}${search}`;
    return Response.redirect(new URL(redirectTo, url).toString(), 307);
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=bundledWorker-0.9810584802720376.mjs.map
