'use client';

import React from 'react';
import Link from 'next/link';
import type { SeoLocale } from '@/components/seo';

export default function BlogPostNotFound({ locale }: { locale: SeoLocale }) {
  const i18n = (() => {
    switch (locale) {
      case 'zh':
        return {
          code: '404',
          title: '这篇文章不存在或已迁移',
          desc: '可能是链接过期、文章已被替换为更新版本，或手滑输错了 slug。',
          back: '← 返回博客列表',
          home: '去首页',
          tip: '提示：可以在博客列表页按关键词搜索你想看的教程。',
          or: '或',
        };
      case 'hi':
        return {
          code: '404',
          title: 'यह पोस्ट मौजूद नहीं है',
          desc: 'लिंक पुराना हो सकता है, पोस्ट अपडेट की गई हो, या slug गलत है।',
          back: '← ब्लॉग लिस्ट पर वापस',
          home: 'होम',
          tip: 'टिप: ब्लॉग लिस्ट पर कीवर्ड से सर्च करें।',
          or: 'या',
        };
      case 'es':
        return {
          code: '404',
          title: 'Este artículo no existe',
          desc: 'El enlace puede estar desactualizado, la publicación se actualizó o el slug es incorrecto.',
          back: '← Volver al blog',
          home: 'Inicio',
          tip: 'Consejo: usa el buscador del blog para localizar el tutorial.',
          or: 'o',
        };
      case 'fr':
        return {
          code: '404',
          title: 'Cet article n’existe pas',
          desc: 'Le lien est peut-être périmé, le billet a été mis à jour, ou le slug est erroné.',
          back: '← Retour au blog',
          home: 'Accueil',
          tip: 'Astuce : utilisez la recherche du blog.',
          or: 'ou',
        };
      case 'ar':
        return {
          code: '404',
          title: 'هذه المقالة غير موجودة',
          desc: 'قد يكون الرابط قديمًا، أو تم تحديث المقال، أو الـ slug غير صحيح.',
          back: '← العودة للمدونة',
          home: 'الرئيسية',
          tip: 'نصيحة: استخدم البحث في المدونة للعثور على الدرس.',
          or: 'أو',
        };
      default:
        return {
          code: '404',
          title: 'This article does not exist',
          desc: 'The link might be outdated, the post was updated, or the slug is incorrect.',
          back: '← Back to blog',
          home: 'Home',
          tip: 'Tip: search the blog for your keyword.',
          or: 'or',
        };
    }
  })();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
      <div className="rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 shadow-xl shadow-indigo-100/20 dark:shadow-black/30 p-6 sm:p-10 lg:p-12 text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-5 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-400 flex items-center justify-center shadow-lg shadow-indigo-500/20"
        >
          <span className="text-white font-black text-2xl sm:text-3xl tracking-tighter">
            {i18n.code}
          </span>
        </div>

        <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
          {i18n.title}
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          {i18n.desc}
        </p>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
          <Link
            href={`/${locale}/blog/`}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 min-h-[44px] rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm sm:text-[15px] font-semibold shadow-sm shadow-indigo-500/20 hover:shadow-md hover:shadow-indigo-500/30 transition-all active:scale-[0.98] touch-manipulation"
          >
            {i18n.back}
          </Link>
          <span className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 sm:px-1.5 hidden sm:inline">
            {i18n.or}
          </span>
          <Link
            href={`/${locale}/`}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 min-h-[44px] rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 text-sm sm:text-[15px] font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-300 hover:shadow-md transition-all active:scale-[0.98] touch-manipulation"
          >
            {i18n.home}
          </Link>
        </div>

        <div className="mt-7 sm:mt-9 inline-flex items-start gap-2 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/60 px-3.5 sm:px-4 py-3 sm:py-3.5 text-left max-w-lg">
          <span aria-hidden="true" className="text-indigo-500 text-base leading-5">💡</span>
          <p className="text-[11px] sm:text-xs leading-relaxed text-indigo-800/90 dark:text-indigo-200/90">
            {i18n.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
