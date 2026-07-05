'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolFallbackClient from '@/components/ToolFallbackClient';

const LOCALE = 'ar';

export default function ToolDetailClientPage() {
  const search = useSearchParams();
  const slug = search.get('slug') || '';

  useEffect(() => {
    if (slug) return;
    const fallback = window.location.pathname.match(/\/tool\/detail\/?/) &&
      (new URLSearchParams(window.location.search)).get('slug');
    if (!fallback) {
      window.location.href = '/' + LOCALE + '/';
    }
  }, [slug]);

  if (!slug) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    );
  }

  return <ToolFallbackClient localeParam={LOCALE} slugParam={slug} />;
}
