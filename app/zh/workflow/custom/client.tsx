'use client';
import { useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import WorkflowDetail from '@/components/WorkflowDetail';
import { usePreferencesStore } from '@/stores/preferences';
import { Code } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function CustomWorkflowPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const { customWorkflows } = usePreferencesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const paramId = params?.id as string | undefined;
  const pathnameId = (() => {
    if (!pathname) return undefined;
    const segs = pathname.split('/').filter(Boolean);
    if (segs.length > 0) {
      const last = segs[segs.length - 1];
      if (last !== 'custom') return last;
    }
    return undefined;
  })();
  const id = paramId || pathnameId || '';
  const locale = (params?.locale as string) || 'zh';
  const customWorkflow = mounted ? customWorkflows.find(w => w.id === id) : undefined;

  if (!mounted) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
          <Sidebar locale={locale} activePage='workflows' />
          <div className='flex-1'>
            <div className='text-center py-20'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-pulse'>
                <Code className='w-8 h-8 text-gray-400' />
              </div>
              <p className='text-gray-500 dark:text-gray-400'>加载中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id && !customWorkflow) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
          <Sidebar locale={locale} activePage='workflows' />
          <div className='flex-1'>
            <div className='text-center py-20'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
                <Code className='w-8 h-8 text-gray-400' />
              </div>
              <p className='text-gray-500 dark:text-gray-400 mb-4'>工作流不存在</p>
              <button
                onClick={() => router.push(`/${locale}/workflows`)}
                className='px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors'
              >
                返回工作流列表
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
          <Sidebar locale={locale} activePage='workflows' />
          <div className='flex-1'>
            <div className='text-center py-20'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
                <Code className='w-8 h-8 text-gray-400' />
              </div>
              <p className='text-gray-500 dark:text-gray-400 mb-4'>缺少工作流 ID</p>
              <button
                onClick={() => router.push(`/${locale}/workflows`)}
                className='px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors'
              >
                返回工作流列表
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WorkflowDetail
      slug={customWorkflow!.id}
      locale={locale}
      isCustom
      customWorkflow={customWorkflow!}
    />
  );
}
