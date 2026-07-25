'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface CompareTool {
  slug: string;
  name: string;
  nameEn?: string;
  description?: string;
  category?: string;
  platform?: string;
  isFree?: boolean;
  difficulty?: string;
  likes?: number;
  externalUrl?: string;
}

interface ComparePairData {
  slug: string;
  keyword: Record<string, string>;
  title: Record<string, string>;
  description: Record<string, string>;
}

interface Props {
  locale: string;
  pairSlug: string;
  toolsData: CompareTool[];
  pairData: ComparePairData;
}

const METRICS: Array<{ key: string; icon: string; label: Record<string, string> }> = [
  {
    key: 'isFree',
    icon: '🆓',
    label: { en: 'Free', zh: '免费', es: 'Gratis', fr: 'Gratuit', hi: 'मुफ्त', ar: 'مجاني' },
  },
  {
    key: 'difficulty',
    icon: '📊',
    label: { en: 'Difficulty', zh: '难度', es: 'Dificultad', fr: 'Difficulté', hi: 'कठिनाई', ar: 'الصعوبة' },
  },
  {
    key: 'likes',
    icon: '⭐',
    label: { en: 'Users', zh: '用户数', es: 'Usuarios', fr: 'Utilisateurs', hi: 'उपयोगकर्ते', ar: 'المستخدمون' },
  },
  {
    key: 'platform',
    icon: '💻',
    label: { en: 'Platform', zh: '平台', es: 'Plataforma', fr: 'Plateforme', hi: 'प्लेटफ़ॉर्म', ar: 'المنصة' },
  },
];

function getMetricValue(tool: CompareTool, key: string, locale: string): string {
  const l = locale as keyof typeof METRICS[0]['label'];
  switch (key) {
    case 'isFree':
      return tool.isFree ? '✓' : '—';
    case 'difficulty': {
      const d = tool.difficulty || '';
      const map: Record<string, Record<string, string>> = {
        easy: { en: 'Easy', zh: '简单', es: 'Fácil', fr: 'Facile', hi: 'आसान', ar: 'سهل' },
        medium: { en: 'Medium', zh: '中等', es: 'Medio', fr: 'Moyen', hi: 'मध्यम', ar: 'متوسط' },
        hard: { en: 'Advanced', zh: '高级', es: 'Avanzado', fr: 'Avancé', hi: 'उन्नत', ar: 'متقدم' },
      };
      return map[d]?.[l] || d || '—';
    }
    case 'likes':
      return tool.likes ? String(tool.likes) : '—';
    case 'platform':
      return tool.platform || 'Web';
    default:
      return '—';
  }
}

export default function CompareClient({ locale, pairSlug, toolsData, pairData }: Props) {
  const t = useTranslations('common');
  const [toolA, toolB] = toolsData;

  const title = useMemo(
    () => pairData.title?.[locale] || pairData.title?.en || `${toolA.name} vs ${toolB.name}`,
    [pairData, locale, toolA, toolB],
  );

  const description = useMemo(
    () => pairData.description?.[locale] || pairData.description?.en || '',
    [pairData, locale],
  );

  const keyword = useMemo(
    () => pairData.keyword?.[locale] || pairData.keyword?.en || '',
    [pairData, locale],
  );

  const crumb = (key: string) => {
    const labels: Record<string, Record<string, string>> = {
      home: { en: 'Home', zh: '首页', es: 'Inicio', fr: 'Accueil', hi: 'होम', ar: 'الرئيسية' },
      tools: { en: 'Tools', zh: '工具', es: 'Herramientas', fr: 'Outils', hi: 'टूल्स', ar: 'الأدوات' },
      compare: { en: 'Compare', zh: '对比', es: 'Comparar', fr: 'Comparer', hi: 'तुलना', ar: 'مقارنة' },
    };
    return labels[key]?.[locale] || key;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
        <Link href={`/${locale}/`} className="hover:text-indigo-600">
          {crumb('home')}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/tools/`} className="hover:text-indigo-600">
          {crumb('tools')}
        </Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-300">{crumb('compare')}</span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
        {title}
      </h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      {keyword && (
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm px-3 py-1.5 rounded-full mb-8">
          <span>🎯</span>
          <span>{keyword}</span>
        </div>
      )}

      {/* Comparison Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
        {[toolA, toolB].map((tool, idx) => (
          <div
            key={tool.slug}
            className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 sm:p-6 bg-white dark:bg-gray-950"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </h2>
                {tool.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                )}
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                #{idx + 1}
              </span>
            </div>

            {/* Metrics */}
            <dl className="space-y-2.5 mb-5">
              {METRICS.map((m) => (
                <div
                  key={m.key}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 dark:border-gray-900 last:border-0"
                >
                  <dt className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <span>{m.icon}</span>
                    <span>{m.label[locale]}</span>
                  </dt>
                  <dd className="text-gray-900 dark:text-gray-100 font-medium">
                    {getMetricValue(tool, m.key, locale)}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href={`/${locale}/tool/${tool.slug}/`}
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Open {tool.name} →
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Verdict */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 sm:p-6 bg-gray-50 dark:bg-gray-900 mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {locale === 'zh' ? '快速结论' : locale === 'es' ? 'Conclusión Rápida' : locale === 'fr' ? 'Conclusion Rapide' : locale === 'hi' ? 'त्वरित निष्कर्ष' : locale === 'ar' ? 'الخلاصة السريعة' : 'Quick Verdict'}
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong className="text-gray-900 dark:text-white">{toolA.name}</strong>{' '}
            {locale === 'zh' ? '最适合' : 'is best for'}{' '}
            {toolA.difficulty === 'easy'
              ? locale === 'zh'
                ? '初学者和快速任务'
                : 'beginners and quick tasks'
              : locale === 'zh'
                ? '进阶用户和复杂任务'
                : 'advanced users and complex tasks'}
            .
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">{toolB.name}</strong>{' '}
            {locale === 'zh' ? '最适合' : 'is best for'}{' '}
            {toolB.difficulty === 'easy'
              ? locale === 'zh'
                ? '日常使用和批量操作'
                : 'everyday use and batch operations'
              : locale === 'zh'
                ? '专业需求和精细控制'
                : 'professional needs and fine control'}
            .
          </p>
          <p className="pt-2 text-gray-500 dark:text-gray-500">
            {locale === 'zh'
              ? '两个工具都免费使用，直接点击链接即可开始。'
              : locale === 'es'
                ? 'Ambas herramientas son gratuitas. Haz clic para empezar.'
                : locale === 'fr'
                  ? 'Les deux outils sont gratuits. Cliquez pour commencer.'
                  : locale === 'hi'
                    ? 'दोनों टूल मुफ्त हैं। शुरू करने के लिए क्लिक करें।'
                    : locale === 'ar'
                      ? 'كلا الأدوات مجانية. انقر للبدء.'
                      : 'Both tools are free to use. Click to get started.'}
          </p>
        </div>
      </div>

      {/* Related Comparisons */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {locale === 'zh'
            ? '更多对比'
            : locale === 'es'
              ? 'Más Comparaciones'
              : locale === 'fr'
                ? 'Plus de Comparaisons'
                : locale === 'hi'
                  ? 'अधिक तुलनाएँ'
                  : locale === 'ar'
                    ? 'مزيد من المقارنات'
                    : 'More Comparisons'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[toolA, toolB].map((tool) => (
            <Link
              key={tool.slug}
              href={`/${locale}/tool/${tool.slug}/`}
              className="block p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {tool.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 line-clamp-1">
                {tool.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}