'use client';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="text-center max-w-lg w-full">
        <div className="mb-6 sm:mb-8">
          <p className="text-7xl sm:text-9xl font-black text-primary-500 dark:text-primary-400 leading-none select-none">
            404
          </p>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
          页面未找到
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
          您访问的页面不存在或已被移动。
          您可以搜索工具或返回首页继续浏览。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/zh"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md touch-manipulation"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上一页
          </button>

          <Link
            href="/zh/blog"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation"
          >
            <Search className="w-4 h-4" />
            浏览博客
          </Link>
        </div>
      </div>
    </div>
  );
}
