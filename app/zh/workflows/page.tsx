import type { Metadata } from 'next';
import {
  workflowsIndexGenerateMetadataSync,
  WorkflowsIndexJsonLd,
  PageBreadcrumbJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';

const LOCALE: SeoLocale = 'zh';
const PATH_WITHOUT_LOCALE = "/workflows";
const TITLE_SEGMENT = "工作流";
const DESC_SEGMENT = "";
const SELF_BREADCRUMB_NAME = "AI 工作流";

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
      <PageBreadcrumbJsonLd
        locale={LOCALE}
        segments={[
          { name: HOME_BREADCRUMB[LOCALE], path: '/' },
          { name: SELF_BREADCRUMB_NAME, path: '/workflows' },
        ]}
      />
      <WorkflowsIndexJsonLd locale={LOCALE} />
      <ClientPage />
    </>
  );
}
