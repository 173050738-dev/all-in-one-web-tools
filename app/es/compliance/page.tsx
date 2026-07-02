import type { Metadata } from 'next';
import {
  pageGenerateMetadataSync,
  PageBreadcrumbJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';

const LOCALE: SeoLocale = 'es';
const PATH_WITHOUT_LOCALE = "/compliance";
const TITLE_SEGMENT = "Cumplimiento";
const DESC_SEGMENT = "";
const SELF_BREADCRUMB_NAME = "Cumplimiento";

const HOME_BREADCRUMB: Record<SeoLocale, string> = {
  en: 'Home',
  zh: '首页',
  es: 'Inicio',
  hi: 'होम',
  fr: 'Accueil',
  ar: 'الرئيسية',
};

export function generateMetadata(): Metadata {
  return pageGenerateMetadataSync(LOCALE, PATH_WITHOUT_LOCALE, TITLE_SEGMENT, DESC_SEGMENT || undefined);
}

export default function StaticPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        locale={LOCALE}
        segments={[
          { name: HOME_BREADCRUMB[LOCALE], path: '/' },
          { name: SELF_BREADCRUMB_NAME },
        ]}
      />
      <ClientPage />
    </>
  );
}
