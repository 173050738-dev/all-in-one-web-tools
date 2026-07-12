'use client';

import { KOFI_BASE_URL } from '@/lib/monetization';

interface SupportButtonProps {
  locale: string;
}

export default function SupportButton({ locale }: SupportButtonProps) {
  const isZh = locale === 'zh';
  const title = isZh ? '☕ 支持一下 Korelyy' : '☕ Support Korelyy';
  const subtitle = isZh
    ? '觉得有用就请我喝杯咖啡吧'
    : 'If this tool helped you, buy me a coffee';

  return (
    <div className="w-full flex justify-center my-8 sm:my-10">
      <a
        href={KOFI_BASE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex flex-col items-center justify-center min-h-[44px] px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl border border-amber-200/80 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 via-white to-white dark:from-amber-950/40 dark:via-gray-900 dark:to-gray-900 text-center shadow-sm hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500/50 transition-all no-underline"
      >
        <span className="text-sm sm:text-base font-semibold text-amber-800 dark:text-amber-200 leading-tight">
          {title}
        </span>
        <span className="mt-1 text-[11px] sm:text-xs text-amber-700/80 dark:text-amber-300/80 leading-relaxed">
          {subtitle}
        </span>
      </a>
    </div>
  );
}
