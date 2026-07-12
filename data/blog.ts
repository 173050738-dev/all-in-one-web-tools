import type { BlogContentBlock, BlogPost } from '@/data/blog-shared';
import {
  getBlogReadingTime,
  getLocalizedNumber,
  getLocalizedText,
} from '@/data/blog-shared';
import type { SeoLocale } from '@/components/seo';
import { BLOG_POSTS_INDEX } from '@/data/blog-index';
import { BLOG_CONTENT_MAP } from '@/data/blog-detail';

/**
 * 兼容层：把拆分后的薄索引 + 正文 map 合并回原结构。
 * 任何仍从 @/data/blog 导入的代码（seo.tsx / BlogPostCard 等）都无需改动。
 * BlogIndexView / BlogPostView 应改为从 blog-index.ts / blog-detail.ts 动态导入，
 * 避免把整包 2.93MB 打进首屏。
 */
export const BLOG_POSTS: BlogPost[] = BLOG_POSTS_INDEX.map((p) => ({
  ...p,
  content: BLOG_CONTENT_MAP[p.slug] || [],
}));

export { getLocalizedText, getLocalizedNumber, getBlogReadingTime };
export type { BlogContentBlock, BlogPost };

/** 排序 + 切片缓存：避免详情页 3 次调用 getBlogPostsList 重复 O(n log n) */
let _sortedCache: BlogPost[] | null = null;
function sortedAll(): BlogPost[] {
  if (!_sortedCache) {
    _sortedCache = [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }
  return _sortedCache;
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPostsByToolSlug(toolSlug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.relatedToolSlugs.includes(toolSlug));
}

export function getBlogPostsList(locale: SeoLocale, limit = 20): Array<BlogPost> {
  const n = typeof limit === 'number' && isFinite(limit) ? limit : BLOG_POSTS.length;
  return sortedAll().slice(0, n);
}
