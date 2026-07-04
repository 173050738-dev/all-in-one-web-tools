﻿﻿﻿import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.tsx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
