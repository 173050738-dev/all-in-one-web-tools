﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿'use client';

import { useTranslations } from 'next-intl';
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
    <aside className='hidden lg:block w-48 flex-shrink-0 min-w-0'>
      <div className='sticky top-20'>
        <div className='space-y-0.5 mb-3'>
          <a
            href={`/${locale}`}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${activePage === 'home' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-2'>
              <Home className='h-3 w-3' />
              <span className='text-xs font-medium'>{t2('home')}</span>
            </div>
            <ChevronRight className='h-3 w-3' />
          </a>
          <a
            href={`/${locale}/workflows`}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${activePage === 'workflows' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-2'>
              <Layers className='h-3 w-3' />
              <span className='text-xs font-medium'>{t2('workflows')}</span>
            </div>
            <ChevronRight className='h-3 w-3' />
          </a>
          <a
            href={`/${locale}/templates`}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${activePage === 'templates' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-2'>
              <Sparkles className='h-3 w-3' />
              <span className='text-xs font-medium'>{t2('templates')}</span>
            </div>
            <ChevronRight className='h-3 w-3' />
          </a>
          <a
            href={`/${locale}/api-keys`}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${activePage === 'api-keys' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-2'>
              <Key className='h-3 w-3' />
              <span className='text-xs font-medium'>{t2('apiKeys')}</span>
            </div>
            <ChevronRight className='h-3 w-3' />
          </a>
          <a
            href={`/${locale}/ideas`}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${activePage === 'ideas' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <div className='flex items-center gap-2'>
              <Lightbulb className='h-3 w-3' />
              <span className='text-xs font-medium'>{t2('ideas')}</span>
            </div>
            <ChevronRight className='h-3 w-3' />
          </a>
        </div>
        <div className='border-t border-gray-200 dark:border-gray-700 pt-3'>
          <p className='text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2.5 mb-1.5'>
            {t2('categories')}
          </p>
          <div className='space-y-0.5'>
            {onCategoryChange && (
              <button
                onClick={() => onCategoryChange('all')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors text-xs ${selectedCategory === 'all' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <span className='truncate'>{t('all-tools')}</span>
                <ChevronRight className='h-3 w-3 shrink-0' />
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
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors text-xs ${selectedCategory === category.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <div className='flex items-center gap-2 min-w-0'>
                    <Icon className='h-3 w-3 shrink-0' />
                    <span className='truncate'>{t(category.id)}</span>
                  </div>
                  <span className='text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 tabular-nums shrink-0'>
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
