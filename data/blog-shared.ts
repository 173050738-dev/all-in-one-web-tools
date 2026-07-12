import type { SeoLocale } from '@/components/seo';
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
      type: 'table';
      headers: Partial<Record<SeoLocale, string[]>>;
      rows: Array<Partial<Record<SeoLocale, string[]>>>;
    }
  | {
      type: 'cta';
      link?: string;
      toolSlug?: string;
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
