import type { SeoLocale } from '@/components/seo';
import HomeSeoLinks from '@/components/HomeSeoLinks';
import HomeDashboardView from '@/components/HomeDashboardView';

// FIX(2026-07-14 codex): 首页改为 Server Component 外壳。
// 原实现是 'use client'，工具卡片全客户端渲染，爬虫抓取首页 HTML 时看不到任何
// /tool/ 与 /blog/ 内链，首页权重无法向下传递。现在先在服务端直出可爬取的内链
// (HomeSeoLinks)，再渲染原有的客户端交互面板 (HomeDashboardView)，UI 不变。
const LOCALE: SeoLocale = 'hi';

export default function DashboardPage() {
  return (
    <>
      <HomeSeoLinks locale={LOCALE} />
      <HomeDashboardView locale={LOCALE} />
    </>
  );
}
