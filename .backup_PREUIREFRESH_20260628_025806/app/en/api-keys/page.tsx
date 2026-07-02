'use client';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import ApiKeysManager from '@/components/ApiKeysManager';

export default function ApiKeysPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
        <Sidebar locale={locale} activePage='api-keys' />
        <ApiKeysManager locale={locale} />
      </div>
    </div>
  );
}
