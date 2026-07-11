import type { BlogPost } from '@/data/blog';

// 方案 A：零图片、纯 CSS 渐变"封面"。按 slug 稳定取色，同一篇文章封面固定不变。
// 复用站点靛蓝/青绿主色系家族，杂志式分区配色，不引入刺眼色。
const GRADIENTS: string[] = [
  'from-indigo-500 via-violet-500 to-fuchsia-500',
  'from-emerald-500 via-teal-500 to-cyan-500',
  'from-sky-500 via-blue-500 to-indigo-600',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-fuchsia-500 via-purple-500 to-indigo-600',
  'from-teal-500 via-emerald-500 to-green-500',
  'from-rose-500 via-pink-500 to-fuchsia-500',
  'from-cyan-500 via-sky-500 to-blue-600',
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getCoverGradient(post: BlogPost): string {
  return GRADIENTS[hashString(post.slug) % GRADIENTS.length];
}

// 装饰用大字母（取标题/slug 首字符，语言无关）
export function getCoverInitial(post: BlogPost, title: string): string {
  const src = (title || post.slug || '?').trim();
  const ch = src.charAt(0).toUpperCase();
  return ch || '#';
}