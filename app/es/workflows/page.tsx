import type { Metadata } from 'next';
import {
  workflowsIndexGenerateMetadataSync,
  WorkflowsIndexJsonLd,
  type SeoLocale,
} from '@/components/seo';
import ClientPage from './client';

const LOCALE: SeoLocale = 'es';
const PATH_WITHOUT_LOCALE = "/workflows";
const TITLE_SEGMENT = "Flujos";
const DESC_SEGMENT = "";
const SELF_BREADCRUMB_NAME = "Flujos IA";

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
