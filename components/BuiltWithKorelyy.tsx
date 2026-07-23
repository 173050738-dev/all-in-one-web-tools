'use client';

import { Heart } from 'lucide-react';

const translations: Record<string, { builtWith: string; freeTools: string }> = {
  zh: { builtWith: '基于 Korelyy 构建', freeTools: '免费工具 · 六语言' },
  en: { builtWith: 'Built with Korelyy', freeTools: 'Free Tools · 6 Languages' },
  es: { builtWith: 'Hecho con Korelyy', freeTools: 'Herramientas Gratis · 6 Idiomas' },
  fr: { builtWith: 'Fait avec Korelyy', freeTools: 'Outils Gratuits · 6 Langues' },
  hi: { builtWith: 'Korelyy के साथ बनाया गया', freeTools: 'मुफ्त उपकरण · 6 भाषाएं' },
  ar: { builtWith: 'صنع مع Korelyy', freeTools: 'أدوات مجانية · 6 لغات' },
};

interface BuiltWithKorelyyProps {
  locale?: string;
}

export default function BuiltWithKorelyy({ locale = 'en' }: BuiltWithKorelyyProps) {
  const t = translations[locale] || translations.en;

  return (
    <div className='mt-6 text-center py-4 border-t border-gray-200 dark:border-gray-700'>
      <a
        href='https://korelyy.com'
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex flex-col items-center gap-1 group'
      >
        <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>
          <span>{t.builtWith}</span>
          <Heart className='h-3 w-3 text-red-400 fill-red-400' />
        </div>
        <div className='text-xs text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors font-medium tracking-wide'>
          KORELYY.COM
        </div>
        <div className='text-xs text-gray-400 dark:text-gray-500'>
          {t.freeTools}
        </div>
      </a>
    </div>
  );
}
