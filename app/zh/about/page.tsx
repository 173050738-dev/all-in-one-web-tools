import type { Metadata } from 'next';
import {
  pageGenerateMetadataSync,
  PageBreadcrumbJsonLd,
  type SeoLocale,
} from '@/components/seo';
import InnerPage from './inner';

const LOCALE: SeoLocale = 'zh';
const PATH_WITHOUT_LOCALE = "/about";
const TITLE_SEGMENT = "关于我们";
const DESC_SEGMENT = "了解 Korelyy 团队与使命。我们是一家专注浏览器端即用型免费工具的全球聚合平台，已上线 900+ 工具，覆盖 AI、图像处理、格式转换、办公文案等 6 大场景，支持 6 种语言、服务全球 180+ 国家与地区用户。";

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
