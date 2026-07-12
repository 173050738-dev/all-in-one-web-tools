/**
 * scripts/split-blog-data.cjs
 * -------------------------------------------------------
 * 把 data/blog.ts（~3MB）拆成：
 *   1) data/blog-index.ts   薄索引（无 content，首屏可懒加载）
 *   2) data/blog-detail.ts  slug → content[] 正文 map（只在详情页懒加载）
 *   3) 重写 data/blog.ts    向后兼容：合并 + 原样再导出
 *
 * 用法：node scripts/split-blog-data.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'data', 'blog.ts');

console.log('[split-blog] Reading source:', path.relative(ROOT, SRC));
const srcRaw = fs.readFileSync(SRC, 'utf8');
console.log('[split-blog] Source size:', Math.round(srcRaw.length / 1024), 'KB');

/* ---------------------------------------------------------------- */
/* 1) 借助 TypeScript Compiler 把 TS 转成纯 JS，拿到运行时数组         */
/* ---------------------------------------------------------------- */
const transpiled = ts.transpileModule(srcRaw, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    removeComments: false,
  },
}).outputText;

/* 从转译后的 JS 里取出 BLOG_POSTS 的赋值内容（`exports.BLOG_POSTS = [` ... `];`） */
const anchorStart = 'exports.BLOG_POSTS = [';
const i0 = transpiled.indexOf(anchorStart);
if (i0 < 0) {
  const tmp = path.join(ROOT, 'scripts', '_debug_transpiled.js');
  fs.writeFileSync(tmp, transpiled);
  console.error('[split-blog] FATAL: could not locate BLOG_POSTS start. Transpiled output dumped to:', path.relative(ROOT, tmp));
  process.exit(1);
}
/* 找结尾：从 `exports.getAllBlogSlugs =` 或 `exports.BLOG_POSTS = [` 之后最后一个匹配 `];`（匹配括号对更稳） */
let depth = 1;
let p = i0 + anchorStart.length;
while (p < transpiled.length && depth > 0) {
  const c = transpiled[p];
  if (c === '[') depth++;
  else if (c === ']') depth--;
  /* 跳过字符串字面量（避免里面误匹配 [/]） */
  else if (c === '"' || c === "'" || c === '`') {
    const quote = c;
    p++;
    while (p < transpiled.length) {
      const ch = transpiled[p];
      if (ch === '\\') { p += 2; continue; }
      if (ch === quote) break;
      p++;
    }
  }
  p++;
}
const i1 = p;  /* 指向 '];' 之后的位置（实际是闭合 `]` 之后的 +1，slice 用 +1） */
if (depth !== 0) {
  console.error('[split-blog] FATAL: unbalanced brackets in BLOG_POSTS literal');
  process.exit(1);
}
const arrLiteral = transpiled.slice(i0 + anchorStart.length, i1 - 1); /* 去掉末尾 `]` 本身（后面在 new Function 里再加 []） */
/* 现在把字符串当作 JS 执行得到真正的数组 */
const BLOG_POSTS = (new Function('return [' + arrLiteral + ']'))();
console.log('[split-blog] Parsed posts:', BLOG_POSTS.length);

/* ---------------------------------------------------------------- */
/* 2) 生成薄索引 / 正文 map                                          */
/* ---------------------------------------------------------------- */
const INDEX_KEYS = [
  'slug','coverImage','author','publishedAt','updatedAt','tags',
  'relatedToolSlugs','readingMinutes','title','description','keywords'
];

function toIndex(p) {
  const o = {};
  INDEX_KEYS.forEach((k) => { if (k in p) o[k] = p[k]; });
  return o;
}

const indexArr = BLOG_POSTS.map(toIndex);
const detailMap = Object.fromEntries(BLOG_POSTS.map((p) => [p.slug, p.content || []]));

console.log('[split-blog] Index entries:', indexArr.length);
console.log('[split-blog] Detail map keys:', Object.keys(detailMap).length);

/* ---------------------------------------------------------------- */
/* 3) data/blog-index.ts                                             */
/* ---------------------------------------------------------------- */
const INDEX_HEADER = `import type { SeoLocale } from '@/components/seo';

export type BlogContentBlock =
  | { type: 'h2'; text: Partial<Record<SeoLocale, string>> }
  | { type: 'h3'; text: Partial<Record<SeoLocale, string>> }
  | { type: 'p'; text: Partial<Record<SeoLocale, string>> }
  | { type: 'ul'; items: Array<Partial<Record<SeoLocale, string>>> }
  | { type: 'ol'; items: Array<Partial<Record<SeoLocale, string>>> }
  | { type: 'code'; lang?: string; text: Partial<Record<SeoLocale, string>> }
  | { type: 'callout'; kind: 'tip' | 'info' | 'warn'; text: Partial<Record<SeoLocale, string>> }
  | {
      type: 'cta';
      link: string;
      text: Partial<Record<SeoLocale, string>>;
      sub?: Partial<Record<SeoLocale, string>>;
    }
  | {
      type: 'image';
      src: string;
      alt?: Partial<Record<SeoLocale, string>>;
      caption?: Partial<Record<SeoLocale, string>>;
    };

export interface BlogPostIndex {
  slug: string;
  coverImage?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: Array<Partial<Record<SeoLocale, string>>>;
  relatedToolSlugs: string[];
  readingMinutes: Partial<Record<SeoLocale, number>>;
  title: Partial<Record<SeoLocale, string>>;
  description: Partial<Record<SeoLocale, string>>;
  keywords: Partial<Record<SeoLocale, string[]>>;
}

/* 薄索引：不含正文 content，code-split 后 ~300–500 KB（原 2.93MB 的 15%） */
export const BLOG_POSTS_INDEX: BlogPostIndex[] = `;

const INDEX_PATH = path.join(ROOT, 'data', 'blog-index.ts');
fs.writeFileSync(INDEX_PATH, INDEX_HEADER + JSON.stringify(indexArr, null, 2) + ';\n');
console.log('[split-blog] Wrote:', path.relative(ROOT, INDEX_PATH),
            Math.round(fs.statSync(INDEX_PATH).size / 1024), 'KB');

/* ---------------------------------------------------------------- */
/* 4) data/blog-detail.ts                                            */
/* ---------------------------------------------------------------- */
const DETAIL_HEADER = `import type { SeoLocale } from '@/components/seo';
import type { BlogContentBlock } from '@/data/blog-shared';

/**
 * 正文 map：按 slug → content[] 懒加载。
 * 仅详情页 BlogPostView 动态 import，不阻塞列表页/工具页首屏。
 */
export const BLOG_CONTENT_MAP: Record<string, BlogContentBlock[]> = `;

const DETAIL_PATH = path.join(ROOT, 'data', 'blog-detail.ts');
fs.writeFileSync(DETAIL_PATH, DETAIL_HEADER + JSON.stringify(detailMap, null, 2) + ';\n');
console.log('[split-blog] Wrote:', path.relative(ROOT, DETAIL_PATH),
            Math.round(fs.statSync(DETAIL_PATH).size / 1024), 'KB');

/* ---------------------------------------------------------------- */
/* 5) data/blog-shared.ts（公共类型 + 工具函数）                       */
/* ---------------------------------------------------------------- */
const SHARED_TS = `import type { SeoLocale } from '@/components/seo';
import { KNOWN_LOCALES } from '@/components/seo';

export type BlogContentBlock =
  | { type: 'h2'; text: Partial<Record<SeoLocale, string>> }
  | { type: 'h3'; text: Partial<Record<SeoLocale, string>> }
  | { type: 'p'; text: Partial<Record<SeoLocale, string>> }
  | { type: 'ul'; items: Array<Partial<Record<SeoLocale, string>>> }
  | { type: 'ol'; items: Array<Partial<Record<SeoLocale, string>>> }
  | { type: 'code'; lang?: string; text: Partial<Record<SeoLocale, string>> }
  | { type: 'callout'; kind: 'tip' | 'info' | 'warn'; text: Partial<Record<SeoLocale, string>> }
  | {
      type: 'cta';
      link: string;
      text: Partial<Record<SeoLocale, string>>;
      sub?: Partial<Record<SeoLocale, string>>;
    }
  | {
      type: 'image';
      src: string;
      alt?: Partial<Record<SeoLocale, string>>;
      caption?: Partial<Record<SeoLocale, string>>;
    };

export interface BlogPost {
  slug: string;
  coverImage?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: Array<Partial<Record<SeoLocale, string>>>;
  relatedToolSlugs: string[];
  readingMinutes: Partial<Record<SeoLocale, number>>;
  title: Partial<Record<SeoLocale, string>>;
  description: Partial<Record<SeoLocale, string>>;
  keywords: Partial<Record<SeoLocale, string[]>>;
  content: BlogContentBlock[];
}

const fallbackLocale = (l: SeoLocale): SeoLocale => (KNOWN_LOCALES.includes(l) ? l : 'en');

export function getLocalizedText<V>(
  map: Partial<Record<SeoLocale, V>> | undefined,
  locale: SeoLocale,
  fallback: V = '' as V,
): V {
  if (!map) return fallback;
  const l = fallbackLocale(locale);
  if (map[l] !== undefined) return map[l] as V;
  if (map.en !== undefined) return map.en as V;
  const firstKey = Object.keys(map)[0] as SeoLocale | undefined;
  if (firstKey && map[firstKey] !== undefined) return map[firstKey] as V;
  return fallback;
}

export function getLocalizedNumber(
  map: Partial<Record<SeoLocale, number>> | undefined,
  locale: SeoLocale,
  fallback = 5,
): number {
  if (!map) return fallback;
  const l = fallbackLocale(locale);
  if (typeof map[l] === 'number') return map[l] as number;
  if (typeof map.en === 'number') return map.en as number;
  return fallback;
}

export function getBlogReadingTime(post: { readingMinutes: Partial<Record<SeoLocale, number>> }, locale: SeoLocale): number {
  return getLocalizedNumber(post.readingMinutes, locale, 5);
}
`;

const SHARED_PATH = path.join(ROOT, 'data', 'blog-shared.ts');
fs.writeFileSync(SHARED_PATH, SHARED_TS);
console.log('[split-blog] Wrote:', path.relative(ROOT, SHARED_PATH),
            Math.round(fs.statSync(SHARED_PATH).size / 1024), 'KB');

/* ---------------------------------------------------------------- */
/* 6) 重写 data/blog.ts（100% 向后兼容 + 新增拆分版导出）              */
/* ---------------------------------------------------------------- */
const COMPAT_TS = `import type { BlogContentBlock, BlogPost } from '@/data/blog-shared';
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
`;

fs.writeFileSync(SRC, COMPAT_TS);
console.log('[split-blog] Rewrote:', path.relative(ROOT, SRC),
            Math.round(fs.statSync(SRC).size / 1024), 'KB');

console.log('[split-blog] OK. Verify with: pnpm tsc --noEmit -p tsconfig.json 2>&1 | head -20');
