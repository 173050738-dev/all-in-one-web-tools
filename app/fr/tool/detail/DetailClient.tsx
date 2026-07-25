'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToolFallbackClient from '@/components/ToolFallbackClient';
import { isInternalTool } from '@/lib/toolLinks';

function DetailContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const slug = sp.get('slug') || '';

  useEffect(() => {
    if (slug && isInternalTool(slug)) {
      router.replace(`/fr/tool/${slug}/`);
    }
  }, [slug, router]);

  if (slug && isInternalTool(slug)) {
    return null;
  }

  return <ToolFallbackClient localeParam="fr" slugParam={slug} />;
}

export default function DetailClient() {
  return <Suspense fallback={null}><DetailContent /></Suspense>;
}
