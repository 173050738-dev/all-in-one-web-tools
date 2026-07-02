'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WorkflowDetail from '@/components/WorkflowDetail';
import { usePreferencesStore } from '@/stores/preferences';
import { Code } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function CustomWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const { customWorkflows } = usePreferencesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const id = params?.id as string;
  const locale = params?.locale as string || 'zh';
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

  if (!customWorkflow) {
    return (
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
          <Sidebar locale={locale} activePage='workflows' />
          <div className='flex-1'>
            <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center'>
              <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center'>
                <Code className='w-8 h-8 text-red-500' />
              </div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                工作流不存在
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                可能已被删除或链接无效
              </p>
              <button
                onClick={() => router.push(`/${locale}/workflows`)}
                className='inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors'
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
      slug={customWorkflow.id}
      locale={locale}
      workflow={undefined}
      isCustom={true}
      customWorkflow={customWorkflow}
    />
  );
}
