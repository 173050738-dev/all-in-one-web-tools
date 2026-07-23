'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ToolDetailWrapper from '@/components/ToolDetailWrapper';

const WatermarkRemover = dynamic(() => import('@/components/WatermarkRemover'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-primary-500 rounded-full" />
    </div>
  ),
});

export default function ClientPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ToolDetailWrapper slug="watermark-remover" locale="en">
      {mounted && <WatermarkRemover locale="en" />}
    </ToolDetailWrapper>
  );
}
