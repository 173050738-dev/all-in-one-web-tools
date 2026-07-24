'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolFallbackClient from '@/components/ToolFallbackClient';

function DetailContent() {
  const sp = useSearchParams();
  const slug = sp.get('slug') || '';
  return <ToolFallbackClient localeParam="es" slugParam={slug} />;
}

export default function DetailClient() {
  return <Suspense fallback={null}><DetailContent /></Suspense>;
}
