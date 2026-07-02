﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import { useTranslations } from 'next-intl';
import { Terminal, Image, FileText, Zap, ChevronRight, Video, Palette, ShoppingCart, TrendingUp, Search, Share2, Headphones, DollarSign, Users, GraduationCap, Heart, Home, Music, Box, Shield, Folder, Code, Layers, Key, Sparkles, Lightbulb } from 'lucide-react';
import { categories, getCategoryCount } from '@/data/categories';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Terminal,
  Image,
  FileText,
  Zap,
  Video,
  Palette,
  ShoppingCart,
  TrendingUp,
  Search,
  Share2,
  Headphones,
  DollarSign,
  Users,
  GraduationCap,
  Heart,
  Home,
  Music,
  Box,
  Shield,
  Folder,
  Code,
  Layers,
};

export default function Sidebar({ 
  selectedCategory, 
  onCategoryChange,
  locale = 'zh',
  activePage = 'home',
}: { 
  selectedCategory?: string; 
  onCategoryChange?: (category: string) => void;
  locale?: string;
  activePage?: string;
}) {
  const t = useTranslations('sidebar');
  const t2 = useTranslations('sidebar2');

  return (
    <aside className='hidden lg:block w-64 flex-shrink-0'>
      <div className='sticky top-20'>
        <div className='space-y-1 mb-4'>
          <a
            href={`/${locale}`}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${activePage === 'home' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-3'>
              <Home className='h-3.5 w-3.5' />
              <span className='text-sm font-medium'>{t2('home')}</span>
            </div>
            <ChevronRight className='h-3.5 w-3.5' />
          </a>
          <a
            href={`/${locale}/workflows`}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${activePage === 'workflows' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-3'>
              <Layers className='h-3.5 w-3.5' />
              <span className='text-sm font-medium'>{t2('workflows')}</span>
            </div>
            <ChevronRight className='h-3.5 w-3.5' />
          </a>
          <a
            href={`/${locale}/templates`}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${activePage === 'templates' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-3'>
              <Sparkles className='h-3.5 w-3.5' />
              <span className='text-sm font-medium'>{t2('templates')}</span>
            </div>
            <ChevronRight className='h-3.5 w-3.5' />
          </a>
          <a
            href={`/${locale}/api-keys`}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${activePage === 'api-keys' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-3'>
              <Key className='h-3.5 w-3.5' />
              <span className='text-sm font-medium'>{t2('apiKeys')}</span>
            </div>
            <ChevronRight className='h-3.5 w-3.5' />
          </a>
          <a
            href={`/${locale}/ideas`}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${activePage === 'ideas' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-3'>
              <Lightbulb className='h-3.5 w-3.5' />
              <span className='text-sm font-medium'>{t2('ideas')}</span>
            </div>
            <ChevronRight className='h-3.5 w-3.5' />
          </a>
        </div>
        <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
          <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2'>
            {t2('categories')}
          </p>
          <div className='space-y-1'>
            {onCategoryChange && (
              <button
                onClick={() => onCategoryChange('all')}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-colors text-sm ${selectedCategory === 'all' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <span>{t('all-tools')}</span>
                <ChevronRight className='h-3.5 w-3.5' />
              </button>
            )}
            {categories.map((category) => {
              const count = getCategoryCount(category.id);
              if (count === 0) return null;
              const Icon = iconMap[category.icon] || Terminal;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange?.(category.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-left transition-colors text-sm ${selectedCategory === category.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <div className='flex items-center gap-3'>
                    <Icon className='h-3.5 w-3.5' />
                    <span>{t(category.id)}</span>
                  </div>
                  <span className='text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
