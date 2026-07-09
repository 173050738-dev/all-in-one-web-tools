﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import createNextIntlPlugin from "next-intl/plugin";

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
