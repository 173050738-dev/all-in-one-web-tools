import { TOOLS_INDEX } from '@/data/tools-index';
import { BLOG_POSTS_INDEX } from '@/data/blog-index';
import type { SeoLocale } from '@/components/seo';

/**
 * HomeSeoLinks — SSR-only crawlable internal links.
 *
 * 背景(2026-07-14 codex)：首页 HomeDashboardView 是 'use client'，工具卡片全在
 * 客户端渲染，导致爬虫抓取首页 HTML 时看到 0 个 /tool/ 内链，全站权重无法从
 * 首页向工具页/文章页传递（收录与排名受损）。
 *
 * 本组件在服务端直出真实 <a href>，对搜索引擎可见；通过 sr-only 对普通用户视觉隐藏，
 * 不影响现有 UI。仅列出自研工具（无 externalUrl）+ 主题相关的热门文章。
 */

// 与 build-sitemap-robots.mjs 保持一致的跨题排除规则
const OFF_TOPIC = [
  /^cadence-/, /^marathon-/, /^trail-/, /^hrm-/, /^zwift-/, /^bike-/, /^power-meter-/,
  /^tdf-/, /^three-peak-/, /^altitude-/, /^100km-hike-/, /^trekking-/,
  /neck-yoga$/, /^yin-yoga-/, /^pilates-/, /^postpartum-yoga-/, /^beginner-5x5-/,
  /^big-three-/, /^functional-training-/, /^dumbbell-home-/,
  /^swimming-tutorial-/, /^rehab-tutorial-/, /^nutrition-tutorial-/,
  /^racing-tutorial-/, /^mental-tutorial-/,
];

function pickText(field: unknown, locale: SeoLocale): string {
  if (typeof field === 'string') return field;
  if (field && typeof field === 'object') {
    const rec = field as Record<string, string>;
    return rec[locale] || rec.en || Object.values(rec)[0] || '';
  }
  return '';
}

export default function HomeSeoLinks({ locale }: { locale: SeoLocale }) {
  // 自研工具（无 externalUrl），最多 60 个核心工具
  const selfTools = TOOLS_INDEX
    .filter((t) => t && t.slug && !t.externalUrl)
    .slice(0, 60);

  // 主题相关文章（排除运动健身），最多 40 篇
  const posts = BLOG_POSTS_INDEX
    .filter((p) => p.slug && !OFF_TOPIC.some((re) => re.test(p.slug)))
    .slice(0, 40);

  return (
    <nav aria-label="Site directory" className="sr-only">
      <h2>All Tools on Korelyy</h2>
      <ul>
        {selfTools.map((t) => (
          <li key={`tool-${t.slug}`}>
            <a href={`/${locale}/tool/${t.slug}/`}>
              {pickText(t.nameEn || t.name, locale)}
            </a>
          </li>
        ))}
      </ul>
      <h2>Guides & Tutorials</h2>
      <ul>
        {posts.map((p) => (
          <li key={`blog-${p.slug}`}>
            <a href={`/${locale}/blog/${p.slug}/`}>{pickText(p.title, locale)}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

