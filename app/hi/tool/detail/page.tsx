'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ToolFallbackClient from '@/components/ToolFallbackClient';

function DetailContent() {
  const sp = useSearchParams();
  const slug = sp.get('slug') || '';
  return <ToolFallbackClient localeParam="hi" slugParam={slug} />;
}

export default function ToolDetailPage() {
  return <Suspense fallback={null}><DetailContent /></Suspense>;
}