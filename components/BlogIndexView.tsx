'use client';

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import type { SeoLocale } from '@/components/seo';
import { getLocalizedText, type BlogPost } from '@/data/blog';
import BlogPostCard from '@/components/BlogPostCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const PAGE_SIZE = 15;

interface Props {
  locale: SeoLocale;
}

export default function BlogIndexView({ locale }: Props) {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<boolean>(false);

  // 懒加载 blog 数据：避免 SSR HTML 内联 ~300KB blog 内容导致 TTFB 7s+
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import('@/data/blog');
      if (cancelled) return;
      const list = (mod.getBlogPostsList || (() => []))(locale, Number.POSITIVE_INFINITY) as BlogPost[];
      setAllPosts(list);
      setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [locale]);

  // 切换搜索/分类/语言时重置可见数量
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    loadingRef.current = false;
  }, [searchQuery, activeCategory, locale]);

  // 下滑自动加载更多（IntersectionObserver sentinel）
  const loadMore = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setVisibleCount((prev) => prev + PAGE_SIZE);
    setTimeout(() => { loadingRef.current = false; }, 120);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const node = sentinelRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadMore();
        });
      },
      { rootMargin: '320px 0px', threshold: 0 }
    );
    observer.observe(node);
    // 数据加载后立即主动检测一次：若 sentinel 已在视口内（首屏未填满），直接触发加载
    requestAnimationFrame(() => {
      try {
        const rect = node.getBoundingClientRect();
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top <= viewportH + 320) loadMore();
      } catch {}
    });
    return () => { observer.disconnect(); };
  }, [loaded, loadMore]);

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
          catSport: '运动健身',
          catDev: '开发技术',
          catOffice: '办公效率',
          catMedia: '设计与多媒体',
          catOps: '运营与增长',
          resultCount: (n: number) => `共 ${n} 篇文章`,
          loadMore: '加载更多',
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
          catSport: 'फिटनेस',
          catDev: 'डेवलपमेंट',
          catOffice: 'ऑफिस प्रोडक्टिविटी',
          catMedia: 'डिज़ाइन & मीडिया',
          catOps: 'ऑपरेशन्स & ग्रोथ',
          resultCount: (n: number) => `${n} पोस्ट`,
          loadMore: 'और लोड करें',
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
          catSport: 'Deporte & Fitness',
          catDev: 'Desarrollo',
          catOffice: 'Productividad',
          catMedia: 'Diseño & Multimedia',
          catOps: 'Operaciones & Crecimiento',
          resultCount: (n: number) => `${n} publicaciones`,
          loadMore: 'Cargar más',
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
          catSport: 'Sport & Fitness',
          catDev: 'Développement',
          catOffice: 'Productivité',
          catMedia: 'Design & Média',
          catOps: 'Ops & Croissance',
          resultCount: (n: number) => `${n} articles`,
          loadMore: 'Charger plus',
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
          catSport: 'الرياضة واللياقة',
          catDev: 'التطوير',
          catOffice: 'الإنتاجية',
          catMedia: 'التصميم والوسائط',
          catOps: 'العمليات والنمو',
          resultCount: (n: number) => `${n} مقالة`,
          loadMore: 'تحميل المزيد',
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
          catSport: 'Fitness',
          catDev: 'Development',
          catOffice: 'Productivity',
          catMedia: 'Design & Media',
          catOps: 'Ops & Growth',
          resultCount: (n: number) => `${n} articles`,
          loadMore: 'Load more',
        };
    }
  }, [locale]);

  const SPORT_TAGS = new Set([
    'Running','Cycling','Hiking','Yoga','Strength','Swimming','Rehab','Nutrition','Racing','Sports Psychology',
    '跑步','骑行','徒步登山','瑜伽','力量训练','游泳','康复','营养','赛事','运动心理',
  ]);
  const DEV_TAGS = new Set([
    'Regex','Regex Patterns','Performance','Security','Base64','Case Conversion','JSON','UUID','Timestamps','Markdown',
    'CSS','JavaScript','Docker','Next.js','API Design',
    '正则表达式','正则模板','性能优化','安全','Base64 编码','大小写转换','JSON 格式化','UUID 生成','时间戳转换','Markdown 预览',
    'CSS新特性','JS性能','API设计',
  ]);
  const OFFICE_TAGS = new Set([
    'PDF Tools','PDF','QR Code','AI Office','Time Management','Project Management',
    'PDF工具','二维码','AI办公','时间管理','项目管理',
  ]);
  const MEDIA_TAGS = new Set([
    'Image','Image Compression','图像处理','图片压缩',
  ]);
  const OPS_TAGS = new Set([
    'SEO','Social Media','Korelyy','Monetization','Compliance','Content Writing',
    '站内SEO','社媒矩阵','Korelyy运营','变现','跨境合规','内容写作',
  ]);
  const primaryTagEn = (p: BlogPost) => String((p.tags[0] as any)?.en || '').trim();
  const primaryTagZh = (p: BlogPost) => String((p.tags[0] as any)?.zh || '').trim();

  const categories = useMemo(() => [
    { id: 'all', label: i18n.catAll, match: () => true },
    { id: 'tutorial', label: i18n.catTutorial, match: (p: BlogPost) => p.tags.some((t) => {
      const v = String(getLocalizedText(t, locale, '')).toLowerCase();
      return v.includes('tutorial') || v.includes('guide') || v.includes('教程') || v.includes('ट्यूटोरियल') || v.includes('guía') || v.includes('tutoriel') || v.includes('درس') || v.includes('指南');
    })},
    { id: 'seo', label: i18n.catSeo, match: (p: BlogPost) => p.tags.some((t) => {
      const v = String(getLocalizedText(t, locale, '')).toLowerCase();
      return v.includes('seo');
    })},
    { id: 'compare', label: i18n.catCompare, match: (p: BlogPost) => p.tags.some((t) => {
      const v = String(getLocalizedText(t, locale, '')).toLowerCase();
      return v.includes('vs') || v.includes('compare') || v.includes('comparison') || v.includes('对比') || v.includes('तुलना') || v.includes('comparativa') || v.includes('comparatif') || v.includes('مقارنة') || v.includes('横评');
    })},
    { id: 'sport', label: i18n.catSport, match: (p: BlogPost) => SPORT_TAGS.has(primaryTagEn(p)) || SPORT_TAGS.has(primaryTagZh(p)) },
    { id: 'dev', label: i18n.catDev, match: (p: BlogPost) => DEV_TAGS.has(primaryTagEn(p)) || DEV_TAGS.has(primaryTagZh(p)) },
    { id: 'office', label: i18n.catOffice, match: (p: BlogPost) => OFFICE_TAGS.has(primaryTagEn(p)) || OFFICE_TAGS.has(primaryTagZh(p)) },
    { id: 'media', label: i18n.catMedia, match: (p: BlogPost) => MEDIA_TAGS.has(primaryTagEn(p)) || MEDIA_TAGS.has(primaryTagZh(p)) },
    { id: 'ops', label: i18n.catOps, match: (p: BlogPost) => OPS_TAGS.has(primaryTagEn(p)) || OPS_TAGS.has(primaryTagZh(p)) },
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
        <>
          <div className="space-y-2.5 sm:space-y-3 lg:space-y-4">
            {(() => {
              const list = filteredPosts.slice(0, visibleCount);
              const first = list[0];
              const rest = list.slice(1);
              return (
                <>
                  {first ? (
                    <BlogPostCard key={first.slug} post={first} locale={locale} layout="feature" />
                  ) : null}
                  {rest.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
                      {rest.map((post) => (
                        <BlogPostCard key={post.slug} post={post} locale={locale} />
                      ))}
                    </div>
                  ) : null}
                </>
              );
            })()}
          </div>
          {visibleCount < filteredPosts.length ? (
            <>
              <div className="flex justify-center mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={loadMore}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 min-h-[44px] rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 text-sm sm:text-[15px] font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-300 hover:shadow-md transition-all active:scale-[0.98] touch-manipulation"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                  {i18n.loadMore}
                  <span className="text-[11px] sm:text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums">
                    ({visibleCount}/{filteredPosts.length})
                  </span>
                </button>
              </div>
              <div ref={sentinelRef} className="mt-4 sm:mt-5" aria-hidden="true">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
                  {Array.from({ length: Math.min(3, filteredPosts.length - visibleCount) }).map((_, i) => (
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
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
