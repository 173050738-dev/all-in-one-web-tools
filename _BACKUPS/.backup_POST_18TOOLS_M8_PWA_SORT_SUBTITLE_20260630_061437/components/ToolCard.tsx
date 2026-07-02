﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿import { useTranslations } from 'next-intl';
import { Code, Image, FileText, Binary, Link, Palette, Type, Video, Terminal, Zap, Heart, Star, ShieldCheck, Key, Smartphone, Home, Shuffle, Volume2, Calendar, Grid3X3, User, MessageCircle, Dices } from 'lucide-react';
import type { Tool } from '@/data/tools';
import { usePreferencesStore } from '@/stores/preferences';
import SafeLink from './SafeLink';
import { logLike, logFavorite } from '@/utils/audit-log';
import { englishTags } from '@/data/english-tags';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Image,
  FileText,
  Binary,
  Link,
  Palette,
  Type,
  Video,
  Terminal,
  Zap,
  Key,
  Smartphone,
  Home,
  Shuffle,
  Volume2,
  Calendar,
  Grid3X3,
  User,
  MessageCircle,
  Dices,
};

function formatLikes(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

export default function ToolCard({ tool, locale }: { tool: Tool; locale: string }) {
  const t = useTranslations('dashboard');
  const toolsT = useTranslations('tools');
  const tcT = useTranslations('toolcard');
  const { toggleLike, isLiked, toggleFavorite, isFavorite } = usePreferencesStore();

  const toolName = locale === 'zh' ? tool.name : (englishTags[tool.id] ? toolsT(`${tool.id}.name`) : tool.name);
  const toolDescription = locale === 'zh' ? tool.description : (englishTags[tool.id] ? toolsT(`${tool.id}.description`) : tool.description);
  const toolTags = locale === 'zh' ? tool.tags : (englishTags[tool.id] || tool.tags);
  const liked = isLiked(tool.id);
  const favorited = isFavorite(tool.id);
  const totalLikes = (tool.likes || 0) + (liked ? 1 : 0);

  const getDifficultyStyle = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getDifficultyText = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return tcT('easy');
      case 'medium':
        return tcT('medium');
      case 'advanced':
        return tcT('advanced');
      default:
        return '';
    }
  };

  const getPlatformStyle = (platform?: string) => {
    switch (platform) {
      case 'desktop':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/25 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40';
      case 'mobile':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-900/25 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40';
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
    }
  };

  const getPlatformText = (platform?: string) => {
    switch (platform) {
      case 'desktop':
        return '电脑端';
      case 'mobile':
        return '手机端';
      default:
        return '所有端';
    }
  };

  const cardContent = (
    <div className='w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 h-full flex flex-col relative'>
      <div className='h-1 bg-[#34A89C] flex-shrink-0' />
      {/* 左上角固定：安全认证徽章（统一标签尺寸） */}
      <span className='absolute left-3 top-[14px] z-10 px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 shadow-[0_1px_2px_rgba(16,185,129,0.08)]'>
        <ShieldCheck className='h-3 w-3' />
        {tcT('verified')}
      </span>
      <div className='p-3 sm:p-4 flex-1 flex flex-col min-h-0 w-full'>
        {/* 顶行右上角：收藏 + 点赞（严格等高，点赞带累计数） */}
        <div className='flex items-start justify-end mb-2 sm:mb-2.5 gap-1 flex-shrink-0'>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(tool.id);
              logFavorite(tool.id);
            }}
            className={`px-1.5 py-1.5 rounded-lg flex-shrink-0 inline-flex items-center justify-center transition-all duration-200 hover:scale-105 ${favorited ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30' : 'bg-gray-100 text-gray-400 hover:text-orange-500 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-orange-400'}`}
            title={tcT('saveToToolbox')}
          >
            <Star className={`h-3.5 w-3.5 ${favorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleLike(tool.id);
              logLike(tool.id);
            }}
            className={`px-2 py-1.5 rounded-lg flex-shrink-0 inline-flex items-center gap-1 transition-all duration-200 hover:scale-105 ${liked ? 'bg-red-100 text-red-500 dark:bg-red-900/30' : 'bg-gray-100 text-gray-400 hover:text-red-500 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-red-400'}`}
            title={tcT('like')}
          >
            <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
            <span className='text-[11px] font-semibold tabular-nums leading-none tracking-tight'>{formatLikes(totalLikes)}</span>
          </button>
        </div>

        {/* 标题行：工具名 + 标签 inline（全部统一标签尺寸） */}
        <div className='flex flex-wrap items-baseline gap-1.5 mb-1.5 sm:mb-2 flex-shrink-0 min-w-0'>
          <h3 className='font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight shrink-0'>
            {toolName}
          </h3>
          {tool.difficulty && (
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 ${getDifficultyStyle(tool.difficulty)}`}>
              {getDifficultyText(tool.difficulty)}
            </span>
          )}
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 ${tool.isLimitedFree ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : tool.isFree ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
            {tool.isLimitedFree ? t('limited-free') : tool.isFree ? t('free') : t('paid')}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap shrink-0 ${getPlatformStyle(tool.platform)}`}>
            {getPlatformText(tool.platform)}
          </span>
        </div>

        {/* 工具介绍：比工具名小一号 */}
        <p className='text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 flex-1 line-clamp-3 leading-relaxed overflow-hidden'>{toolDescription}</p>

        {/* 底部关键词标签：统一尺寸 */}
        <div className='mt-2 sm:mt-2.5 flex flex-wrap gap-1.5 flex-shrink-0 h-6 overflow-hidden'>
          {toolTags.slice(0, 2).map((tag) => (
            <span key={tag} className='px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 truncate max-w-[80px] sm:max-w-none'>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (tool.externalUrl) {
    return (
      <SafeLink href={tool.externalUrl} locale={locale} className='w-full block group'>
        {cardContent}
      </SafeLink>
    );
  }

  return (
    <a href={`/${locale}/tool/${tool.slug}`} className='w-full block group'>
      {cardContent}
    </a>
  );
}
