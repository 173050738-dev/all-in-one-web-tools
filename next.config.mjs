﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.tsx");

/** @type {import('next').NextConfig} */
const USE_STATIC_EXPORT = process.env.USE_STATIC_EXPORT === 'true' || process.env.USE_STATIC_EXPORT === '1';
const nextConfig = {
  ...(USE_STATIC_EXPORT ? { output: 'export' } : {}),
  trailingSlash: true,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 10,
  },
  // ============================================================
  // 本地开发代理：/api/auth/* → 本地 Cloudflare Worker (端口 8787)
  // 生产环境由 Cloudflare 路由规则（wrangler.auth.jsonc -> routes）直接接管，
  // 不依赖本 rewrites（静态导出 output: export 不会跑 rewrites）。
  // ============================================================
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:8787/api/auth/:path*",
      },
      {
        source: "/api/ai-recommend",
        destination: "http://localhost:8787/api/ai-recommend",
      },
      {
        source: "/api/ai-workflow",
        destination: "http://localhost:8787/api/ai-workflow",
      },
      {
        source: "/api/kofi/:path*",
        destination: "http://localhost:8787/api/kofi/:path*",
      },
    ];
  },
  async headers() {
    const STATIC_CACHE =
      "public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=2592000, stale-if-error=604800, immutable";
    const HTML_SOFT_CACHE =
      "public, max-age=600, s-maxage=600, stale-while-revalidate=86400, stale-if-error=604800";
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE }],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|otf|eot)",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE }],
      },
      {
        source: "/:path*.css",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE }],
      },
      {
        source: "/:path*.js",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE }],
      },
      {
        source: "/locales/:path*",
        headers: [{ key: "Cache-Control", value: STATIC_CACHE }],
      },
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: HTML_SOFT_CACHE }],
      },
      {
        source: "/:locale(zh|en|es|fr|hi|ar)",
        headers: [{ key: "Cache-Control", value: HTML_SOFT_CACHE }],
      },
      {
        source: "/:locale(zh|en|es|fr|hi|ar)/",
        headers: [{ key: "Cache-Control", value: HTML_SOFT_CACHE }],
      },
      {
        source: "/(zh|en|es|fr|hi|ar)/tool/:slug*",
        headers: [{ key: "Cache-Control", value: HTML_SOFT_CACHE }],
      },
      {
        source: "/(zh|en|es|fr|hi|ar)/workflow/:slug*",
        headers: [{ key: "Cache-Control", value: HTML_SOFT_CACHE }],
      },
      {
        source: "/(zh|en|es|fr|hi|ar)/tools/:slug*",
        headers: [{ key: "Cache-Control", value: HTML_SOFT_CACHE }],
      },
    ];
  },
  // ============================================================
  // 构建优化：
  // optimizePackageImports 减少 lucide-react / zustand 等大库体积
  // 避免自定义 splitChunks 破坏 Next.js 内部 chunk 共享（会导致
  // Collecting page data 阶段 server 端找不到 chunk id 如 74411.js）。
  // ============================================================
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'zustand',
      'date-fns',
      'next-intl',
    ],
  },
};

export default withNextIntl(nextConfig);
