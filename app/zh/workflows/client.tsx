'use client';
import { useParams } from 'next/navigation';
import WorkflowListEnhanced from '@/components/WorkflowListEnhanced';

export default function WorkflowsPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'zh';

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <WorkflowListEnhanced locale={locale} />
    </div>
  );
}
