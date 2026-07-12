'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { SeoLocale } from '@/components/seo';
import type { BlogContentBlock } from '@/data/blog';
import { getLocalizedText } from '@/data/blog';

const AdSlot = dynamic(() => import('@/components/AdSlot').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="w-full min-h-[130px] sm:min-h-[150px] rounded-xl border border-transparent" />
  ),
});

interface Props {
  blocks: BlogContentBlock[];
  locale: SeoLocale;
  className?: string;
}

export default function BlogContentRenderer({ blocks, locale, className = '' }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const renderedNodes: React.ReactNode[] = [];
  let h2Counter = 0;

  blocks.forEach((block, i) => {
    switch (block.type) {
      case 'h2': {
        h2Counter += 1;
        const text = getLocalizedText(block.text, locale);
        renderedNodes.push(
          <h2 id={`blk-${i}`} key={`h-${i}`} className="scroll-mt-24 mt-10 sm:mt-12 text-lg sm:text-xl tracking-tight">
            {text}
          </h2>,
        );
        if (mounted && (h2Counter === 2 || h2Counter === 4)) {
          renderedNodes.push(
            <div key={`ad-h2-${h2Counter}-${i}`} className="not-prose my-8 sm:my-10">
              <AdSlot
                slot={`blog-h2after-${h2Counter}-${locale}`}
                size="in-feed"
                showPlaceholder={true}
              />
            </div>,
          );
        }
        break;
      }
      case 'h3': {
            const text = getLocalizedText(block.text, locale);
            renderedNodes.push(
              <h3 id={`blk-${i}`} key={`h-${i}`} className="scroll-mt-24 mt-8 sm:mt-10 text-lg sm:text-xl tracking-tight">
                {text}
              </h3>,
            );
            break;
          }
          case 'p': {
            const text = getLocalizedText(block.text, locale);
            renderedNodes.push(
              <p
                key={`p-${i}`}
                className="mt-4 sm:mt-5 text-[15px] sm:text-[16px] leading-7 sm:leading-8"
                dangerouslySetInnerHTML={{ __html: simpleBold(text) }}
              />,
            );
            break;
          }
          case 'ul': {
            renderedNodes.push(
              <ul key={`ul-${i}`} className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 list-disc pl-6">
                {block.items.map((it, j) => (
                  <li
                    key={`ul-${i}-${j}`}
                    className="text-[15px] sm:text-[16px] text-gray-700 dark:text-gray-300 leading-7"
                    dangerouslySetInnerHTML={{ __html: simpleBold(getLocalizedText(it, locale)) }}
                  />
                ))}
              </ul>,
            );
            break;
          }
          case 'ol': {
            renderedNodes.push(
              <ol key={`ol-${i}`} className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 list-decimal pl-6">
                {block.items.map((it, j) => (
                  <li
                    key={`ol-${i}-${j}`}
                    className="text-[15px] sm:text-[16px] text-gray-700 dark:text-gray-300 leading-7"
                    dangerouslySetInnerHTML={{ __html: simpleBold(getLocalizedText(it, locale)) }}
                  />
                ))}
              </ol>,
            );
            break;
          }
          case 'code': {
            const text = getLocalizedText(block.text, locale);
            renderedNodes.push(
              <pre
                key={`code-${i}`}
                data-lang={block.lang || 'text'}
                className="mt-5 sm:mt-6 overflow-x-auto rounded-2xl bg-gray-950 dark:bg-black/80 text-gray-100 border border-gray-800/80 shadow-inner"
              >
                <code className="block p-4 sm:p-5 font-mono text-[13px] sm:text-[14px] leading-6 whitespace-pre-wrap break-all">
                  {text}
                </code>
              </pre>,
            );
            break;
          }
          case 'callout': {
            const text = getLocalizedText(block.text, locale);
            const palette = calloutPalette(block.kind);
            renderedNodes.push(
              <aside
                key={`call-${i}`}
                role="note"
                className={`mt-5 sm:mt-6 rounded-2xl border ${palette.border} ${palette.bg} ${palette.text} p-4 sm:p-5 text-[14px] sm:text-[15px] leading-7 shadow-sm`}
                dangerouslySetInnerHTML={{ __html: simpleBold(text) }}
              />,
            );
            break;
          }
          case 'cta': {
            const text = getLocalizedText(block.text, locale);
            const sub = getLocalizedText(block.sub, locale);
            let rawLink = block.link;
            if (!rawLink && block.toolSlug) rawLink = `/tool/${block.toolSlug}`;
            if (!rawLink) rawLink = `/${locale}/blog`;
            const href = rawLink.startsWith('/') ? `/${locale}${rawLink}` : rawLink;
            renderedNodes.push(
              <div
                key={`cta-${i}`}
                className="mt-8 sm:mt-10 rounded-2xl border border-indigo-200/70 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 via-white to-white dark:from-indigo-950/60 dark:via-gray-900 dark:to-gray-900 p-5 sm:p-6 shadow-sm"
              >
                <Link
                  href={href}
                  className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 shadow-sm transition-colors"
                  prefetch={false}
                >
                  {text}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
                {sub && (
                  <p className="mt-3 text-[13px] sm:text-[14px] text-gray-600 dark:text-gray-400 leading-6">
                    {sub}
                  </p>
                )}
              </div>,
            );
            break;
          }
          default:
            break;
        }
      });

      return (
        <article
          className={`prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:underline prose-code:text-sm prose-code:font-mono prose-pre:rounded-xl prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-gray-100 prose-strong:text-gray-900 dark:prose-strong:text-white ${className}`}
        >
          {renderedNodes}
        </article>
      );
    }

function simpleBold(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[0.9em] font-mono text-indigo-600 dark:text-indigo-300 border border-gray-200/80 dark:border-gray-700/60">$1</code>');
}

function calloutPalette(kind: 'tip' | 'info' | 'warn') {
  if (kind === 'tip') {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200/70 dark:border-emerald-500/20',
      text: 'text-emerald-900 dark:text-emerald-200',
    };
  }
  if (kind === 'warn') {
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200/70 dark:border-amber-500/20',
      text: 'text-amber-900 dark:text-amber-200',
    };
  }
  return {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-200/70 dark:border-sky-500/20',
    text: 'text-sky-900 dark:text-sky-200',
  };
}
