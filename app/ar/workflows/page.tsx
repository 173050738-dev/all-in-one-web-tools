import type { Metadata } from 'next';
import {
  workflowsIndexGenerateMetadataSync,
  WorkflowsIndexJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';

const LOCALE: SeoLocale = 'ar';
const PATH_WITHOUT_LOCALE = "/workflows";
const TITLE_SEGMENT = "سير العمل";
const DESC_SEGMENT = "";
const SELF_BREADCRUMB_NAME = "سير عمل الذكاء الاصطناعي";

const HOME_BREADCRUMB: Record<SeoLocale, string> = {
  en: 'Home',
  zh: '首页',
  es: 'Inicio',
  hi: 'होम',
  fr: 'Accueil',
  ar: 'الرئيسية',
};

export function generateMetadata(): Metadata {
  return workflowsIndexGenerateMetadataSync(LOCALE);
}

export default function StaticPage() {
  return (
    <>
      <WorkflowsIndexJsonLd locale={LOCALE} />
      <ClientPage />
    </>
  );
}
