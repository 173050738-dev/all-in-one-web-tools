import type { Metadata } from 'next';
import {
  pageGenerateMetadataSync,
  PageBreadcrumbJsonLd,
  type SeoLocale,
} from '@/components/seo';
import InnerPage from './inner';

const LOCALE: SeoLocale = 'hi';
const PATH_WITHOUT_LOCALE = "/about";
const TITLE_SEGMENT = "हमारे बारे में";
const DESC_SEGMENT = "Korelyy टीम और हमारे मिशन से जानिए। हम AI, इमेज, PDF, ऑफिस, डेवलपर और क्रिएटिव श्रेणियों में 900+ ब्राउज़र-रेडी, गोपनीयता-प्रथम मुफ्त टूल चुनते हैं। 6 भाषाओं में 180+ देशों के उपयोगकर्ताओं के लिए उपलब्ध।";

export function generateMetadata(): Metadata {
  return pageGenerateMetadataSync(LOCALE, PATH_WITHOUT_LOCALE, TITLE_SEGMENT, DESC_SEGMENT || undefined);
}

const BREADCRUMB_NAME_MAP: Record<SeoLocale, string> = {
  en: 'Home', zh: '首页', es: 'Inicio', hi: 'होम', fr: 'Accueil', ar: 'الرئيسية',
};
const SELF_NAME_MAP: Record<string, Record<SeoLocale, string>> = {
  '/about': { en: 'About Us', zh: '关于我们', es: 'Sobre nosotros', hi: 'हमारे बारे में', fr: 'À propos', ar: 'من نحن' },
  '/compliance': { en: 'Compliance', zh: '合规透明', es: 'Cumplimiento', hi: 'अनुपालन', fr: 'Conformité', ar: 'الامتثال' },
  '/workflows': { en: 'Workflows', zh: '工作流', es: 'Flujos', hi: 'वर्कफ़्लो', fr: 'Workflows', ar: 'سير العمل' },
  '/workflow/canvas': { en: 'Canvas', zh: '画布', es: 'Lienzo', hi: 'कैनवास', fr: 'Canvas', ar: 'اللوحة' },
  '/workflow/custom': { en: 'Custom Workflow', zh: '自定义工作流', es: 'Personalizado', hi: 'कस्टम', fr: 'Personnalisé', ar: 'مخصص' },
};

export default function StaticPage() {
  return (
    <>
      <PageBreadcrumbJsonLd
        locale={LOCALE}
        segments={[
          { name: BREADCRUMB_NAME_MAP[LOCALE], path: '/' },
          { name: SELF_NAME_MAP[PATH_WITHOUT_LOCALE]?.[LOCALE] || TITLE_SEGMENT },
        ]}
      />
      <InnerPage />
    </>
  );
}
