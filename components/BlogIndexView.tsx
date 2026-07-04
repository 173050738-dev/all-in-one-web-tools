'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import type { SeoLocale } from '@/components/seo';
import { getLocalizedText, type BlogPost } from '@/data/blog';
import BlogPostCard from '@/components/BlogPostCard';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Props {
  locale: SeoLocale;
}

export default function BlogIndexView({ locale }: Props) {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // 懒加载 blog 数据：避免 SSR HTML 内联 ~300KB blog 内容导致 TTFB 7s+
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import('@/data/blog');
      if (cancelled) return;
      const list = (mod.getBlogPostsList || (() => []))(locale, 50) as BlogPost[];
      setAllPosts(list);
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [locale]);

  const i18n = useMemo(() => {
    switch (locale) {
      case 'zh':
        return {
          h1: 'Korelyy 博客',
          subtitle: '工具实战教程、可复制的模板、真实性能基准测试。每周更新。',
          backHome: '← 返回首页',
          empty: '暂无文章，更新中。',
          searchCta: '想找哪个工具的教程？',
          searchPlaceholder: '搜索教程关键词：regex / json / qr / pdf',
          catAll: '全部',
          catTutorial: '教程',
          catSeo: 'SEO 指南',
          catCompare: '对比测评',
          resultCount: (n: number) => `共 ${n} 篇文章`,
        };
      case 'hi':
        return {
          h1: 'Korelyy ब्लॉग',
          subtitle: 'टूल के लिए स्टेप-बाय-स्टेप ट्यूटोरियल, कॉपी-पेस्ट पैटर्न और असली बेंचमार्क। हर सप्ताह अपडेट।',
          backHome: '← होम पर वापस',
          empty: 'अभी कोई पोस्ट नहीं, जल्दी आ रहा है।',
          searchCta: 'किस टूल का ट्यूटोरियल ढूंढ रहे हैं?',
          searchPlaceholder: 'कीवर्ड: regex / json / qr / pdf',
          catAll: 'सभी',
          catTutorial: 'ट्यूटोरियल',
          catSeo: 'SEO गाइड',
          catCompare: 'तुलना',
          resultCount: (n: number) => `${n} पोस्ट`,
        };
      case 'es':
        return {
          h1: 'Blog de Korelyy',
          subtitle: 'Tutoriales paso a paso, patrones copiar-pegar y benchmarks reales. Actualizado semanalmente.',
          backHome: '← Volver al inicio',
          empty: 'Aún no hay publicaciones. Próximamente.',
          searchCta: '¿Tutorial de qué herramienta buscas?',
          searchPlaceholder: 'Palabras clave: regex / json / qr / pdf',
          catAll: 'Todas',
          catTutorial: 'Tutoriales',
          catSeo: 'Guías SEO',
          catCompare: 'Comparativas',
          resultCount: (n: number) => `${n} publicaciones`,
        };
      case 'fr':
        return {
          h1: 'Blog Korelyy',
          subtitle: 'Tutoriels pas à pas, modèles copier-coller et benchmarks réels. Mis à jour chaque semaine.',
          backHome: '← Retour à l\'accueil',
          empty: 'Aucun article pour le moment. À venir.',
          searchCta: 'Quel tutoriel d\'outil recherchez-vous ?',
          searchPlaceholder: 'Mots-clés : regex / json / qr / pdf',
          catAll: 'Tous',
          catTutorial: 'Tutoriels',
          catSeo: 'Guides SEO',
          catCompare: 'Comparatifs',
          resultCount: (n: number) => `${n} articles`,
        };
      case 'ar':
        return {
          h1: 'مدونة Korelyy',
          subtitle: 'دروس خطوة بخطوة، نماذج جاهزة للنسخ، واختبارات أداء حقيقية. تحديث أسبوعي.',
          backHome: '← العودة للرئيسية',
          empty: 'لا توجد مقالات حتى الآن. قريباً.',
          searchCta: 'ما هو درس الأداة الذي تبحث عنه؟',
          searchPlaceholder: 'الكلمات المفتاحية: regex / json / qr / pdf',
          catAll: 'الكل',
          catTutorial: 'دروس',
          catSeo: 'أدلة SEO',
          catCompare: 'مقارنات',
          resultCount: (n: number) => `${n} مقالة`,
        };
      default:
        return {
          h1: 'Korelyy Blog',
          subtitle: 'Step-by-step tool tutorials, copy-paste patterns, and real-world performance benchmarks. Updated weekly.',
          backHome: '← Back to home',
          empty: 'No articles yet. Coming soon.',
          searchCta: 'Which tool tutorial are you looking for?',
          searchPlaceholder: 'Search keywords: regex / json / qr / pdf',
          catAll: 'All',
          catTutorial: 'Tutorials',
          catSeo: 'SEO Guides',
          catCompare: 'Comparisons',
          resultCount: (n: number) => `${n} articles`,
        };
    }
  }, [locale]);

  const categories = useMemo(() => [
    { id: 'all', label: i18n.catAll, match: () => true },
    { id: 'tutorial', label: i18n.catTutorial, match: (p: BlogPost) => p.tags.some((t) => {
      const v = String(getLocalizedText(t, locale, '')).toLowerCase();
      return v.includes('tutorial') || v.includes('guide') || v.includes('教程') || v.includes('ट्यूटोरियल') || v.includes('guía') || v.includes('tutoriel') || v.includes('درس');
    })},
    { id: 'seo', label: i18n.catSeo, match: (p: BlogPost) => p.tags.some((t) => {
      const v = String(getLocalizedText(t, locale, '')).toLowerCase();
      return v.includes('seo');
    })},
    { id: 'compare', label: i18n.catCompare, match: (p: BlogPost) => p.tags.some((t) => {
      const v = String(getLocalizedText(t, locale, '')).toLowerCase();
      return v.includes('vs') || v.includes('compare') || v.includes('comparison') || v.includes('对比') || v.includes('compare') || v.includes('तुलना') || v.includes('comparativa') || v.includes('comparatif') || v.includes('مقارنة');
    })},
  ], [locale, i18n]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allPosts.filter((p) => {
      if (!categories.find((c) => c.id === activeCategory)?.match(p)) return false;
      if (!q) return true;
      const title = String(getLocalizedText(p.title, locale, '')).toLowerCase();
      const desc = String(getLocalizedText(p.description, locale, '')).toLowerCase();
      const tagsText = p.tags.map((t) => String(getLocalizedText(t, locale, '')).toLowerCase()).join(' ');
      return title.includes(q) || desc.includes(q) || tagsText.includes(q);
    });
  }, [allPosts, searchQuery, activeCategory, locale, categories]);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-3 sm:mb-4">
        <Link
          href={`/${locale}/`}
          className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
          prefetch={false}
        >
          {i18n.backHome}
        </Link>
      </div>

      <header className="mb-5 sm:mb-7">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {i18n.h1}
        </h1>
        <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400 max-w-3xl">
          {i18n.subtitle}
        </p>
      </header>

      {/* Search & Filter Bar: simple, clean, no complex panels */}
      <section className="mb-5 sm:mb-7 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 p-3 sm:p-4 lg:p-5">
        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2.5 sm:mb-3">
          {i18n.searchCta}
        </p>
        <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={i18n.searchPlaceholder}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 border border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 outline-none text-sm min-h-[44px] transition-all"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mr-0.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </span>
          {categories.map((c) => {
            const active = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`min-h-[32px] min-w-[44px] px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all active:scale-95 ${active ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
              >
                {c.label}
              </button>
            );
          })}
          <div className="ml-auto text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium tabular-nums">
            {i18n.resultCount(filteredPosts.length)}
          </div>
        </div>
      </section>

      {/* Skeleton：首屏不依赖 blog 数据，显示 8 张 shimmer 卡片，避免白屏 */}
      {!loaded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 p-3 sm:p-4 flex flex-col h-full min-h-[260px] animate-pulse">
              <div className="h-32 sm:h-36 rounded-xl bg-gray-200 dark:bg-gray-800 mb-3 sm:mb-4" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
              <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-1.5" />
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded mb-3 mt-auto" />
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 bg-gray-100 dark:bg-gray-800 rounded-full" />
                <div className="h-8 w-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {loaded && filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-6 sm:p-8 text-center">
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">{i18n.empty}</p>
        </div>
      ) : null}

      {loaded && filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
