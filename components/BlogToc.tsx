'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { SeoLocale } from '@/components/seo';
import type { BlogContentBlock } from '@/data/blog';
import { getLocalizedText } from '@/data/blog';

interface TocItem { id: string; text: string; level: 2 | 3; }

interface Props {
  blocks: BlogContentBlock[];
  locale: SeoLocale;
  variant?: 'mobile' | 'desktop';
}

// 文章内悬浮目录。variant=mobile -> 正文顶部可折叠；variant=desktop -> 右侧 sticky。
// id 与 BlogContentRenderer 的 `blk-${i}` 严格对应。
export default function BlogToc({ blocks, locale, variant = 'desktop' }: Props) {
  const items = useMemo<TocItem[]>(() => {
    const out: TocItem[] = [];
    blocks.forEach((b, i) => {
      if (b.type === 'h2' || b.type === 'h3') {
        const text = getLocalizedText(b.text, locale, '');
        if (text) out.push({ id: `blk-${i}`, text, level: b.type === 'h2' ? 2 : 3 });
      }
    });
    return out;
  }, [blocks, locale]);

  const [activeId, setActiveId] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (variant !== 'desktop' || items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items, variant]);

  if (items.length < 2) return null;

  const label = tocLabel(locale);

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setOpen(false);
    }
  };

  const list = (
    <ul className="space-y-1.5">
      {items.map((it) => (
        <li key={it.id} className={it.level === 3 ? 'ml-3' : ''}>
          <a
            href={`#${it.id}`}
            onClick={(e) => handleClick(e, it.id)}
            className={`block py-1 text-[13px] leading-snug transition-colors border-l-2 pl-2.5 ${
              activeId === it.id
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {it.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === 'mobile') {
    return (
      <div className="lg:hidden not-prose mb-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] text-sm font-semibold text-gray-800 dark:text-gray-100"
          aria-expanded={open}
        >
          <span>{label}</span>
          <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        {open && <nav className="px-4 pb-4" aria-label={label}>{list}</nav>}
      </div>
    );
  }

  return (
    <nav
      aria-label={label}
      className="hidden lg:block not-prose sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">{label}</p>
      {list}
    </nav>
  );
}

function tocLabel(locale: SeoLocale): string {
  switch (locale) {
    case 'zh': return '目录';
    case 'hi': return 'विषय-सूची';
    case 'es': return 'Contenido';
    case 'fr': return 'Sommaire';
    case 'ar': return 'المحتويات';
    default: return 'Contents';
  }
}