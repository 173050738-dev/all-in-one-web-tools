'use client';
import HomeDashboardView from '@/components/HomeDashboardView';
import { useParams } from 'next/navigation';

export default function DashboardPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'ar';
  return <HomeDashboardView locale={locale} />;
}
