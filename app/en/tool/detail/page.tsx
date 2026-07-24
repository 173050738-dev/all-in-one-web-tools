import type { Metadata } from 'next';
import DetailClient from './DetailClient';

export const metadata: Metadata = {
  title: 'Tool - Korelyy',
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function ToolDetailPage() {
  return <DetailClient />;
}
