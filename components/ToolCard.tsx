'use client';

import { useTranslations } from 'next-intl';
import { Code, Image, FileText, Binary, Link, Palette, Type, Video, Terminal, Zap, Heart, Star, ShieldCheck, Key, Smartphone, Home, Shuffle, Volume2, Calendar, Grid3X3, User, MessageCircle, Dices, Shield, Globe, CreditCard, UserPlus } from 'lucide-react';
import type { ToolIndexItem } from '@/data/tools-shared';
import { usePreferencesStore } from '@/stores/preferences';
import SafeLink from './SafeLink';
import { logLike, logFavorite } from '@/utils/audit-log';
import { englishTags, tagZhToEn } from '@/data/english-tags';
import { isTopToolSlug } from '@/lib/topSlugs';
import { isInternalTool } from '@/lib/toolLinks';

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

export default function ToolCard({ tool, locale, selectable = false }: { tool: ToolIndexItem; locale: string; selectable?: boolean }) {
  const t = useTranslations('dashboard');
  const toolsT = useTranslations('tools');
  const tcT = useTranslations('toolcard');
  const { toggleLike, isLiked, toggleFavorite, isFavorite } = usePreferencesStore();

  const safeTranslate = (key: string, altValue: string) => {
    try {
      const translated = toolsT(key);
      if (translated && translated !== key) return translated;
    } catch { /* fallthrough */ }
    return altValue;
  };

  const toolSlug = tool.slug || tool.id || '';
  const toolKeyAlt = tool.id && tool.id !== tool.slug ? tool.id : '';

  const translateField = (
    fieldKey: 'name' | 'description',
    zhField: string,
    enField: string | undefined,
  ): string => {
    if (locale === 'zh') return zhField;
    const primary = safeTranslate(
      `${toolSlug}.${fieldKey}`,
      toolKeyAlt ? safeTranslate(`${toolKeyAlt}.${fieldKey}`, '') : '',
    );
    if (primary) return primary;
    return enField || zhField;
  };

  const toolName = translateField('name', tool.name, tool.nameEn);
  const toolDescription = translateField('description', tool.description, tool.descriptionEn);
  const toolTags = locale === 'zh'
    ? tool.tags
    : (Array.isArray(englishTags[tool.id]) && englishTags[tool.id].length > 0
        ? englishTags[tool.id]
        : (Array.isArray(tool.tagsEn) && tool.tagsEn.length > 0
            ? tool.tagsEn
            : tool.tags.map((tag) => tagZhToEn[tag] || tag)));
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
        return tcT('platform-desktop');
      case 'mobile':
        return tcT('platform-mobile');
      default:
        return tcT('platform-all');
    }
  };

  const getAccessStyle = (tag?: string) => {
    if (tag === 'direct') {
      return 'bg-teal-50 text-teal-700 dark:bg-teal-900/25 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40';
    }
    return 'bg-rose-50 text-rose-700 dark:bg-rose-900/25 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40';
  };

  const getAccessIcon = (tag?: string) => (tag === 'direct' ? Globe : Shield);
  const getAccessText = (tag?: string) =>
    tag === 'direct' ? tcT('access-direct') : tcT('access-vpn-required');

  const localProcessingStyle = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50';

  const extraBadges: Array<{ text: string; style: string }> = [];
  if (locale === 'zh' && tool.accessTag) {
    extraBadges.push({ text: getAccessText(tool.accessTag), style: getAccessStyle(tool.accessTag) });
  }

  const cardContent = (
    <div className='w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-800 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 h-full flex flex-col relative'>
      <div
        className={[
          'h-1.5 flex-shrink-0',
          tool.complianceLevel === 'green'
            ? 'bg-emerald-500 dark:bg-emerald-400'
            : tool.complianceLevel === 'yellow'
              ? 'bg-amber-400 dark:bg-amber-300'
              : tool.complianceLevel === 'red'
                ? 'bg-rose-500 dark:bg-rose-400'
                : 'bg-[#34A89C]',
        ].join(' ')}
        title={
          tool.complianceLevel === 'green'
            ? tcT('compliance-green')
            : tool.complianceLevel === 'yellow'
              ? tcT('compliance-yellow')
              : tool.complianceLevel === 'red'
                ? tcT('compliance-red')
                : tcT('compliance-standard')
        }
      />
      {/* 左上角固定：安全认证徽章（仅顶部角标区，不影响下方标题行） */}
      <span className='absolute left-2.5 top-2.5 z-10 px-1.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 shadow-[0_1px_2px_rgba(16,185,129,0.08)]'>
        <ShieldCheck className='h-2.5 w-2.5' />
        {tcT('verified')}
      </span>
      <div className='p-2.5 sm:p-3 flex-1 flex flex-col min-h-0 w-full'>
        {/* 顶行右上角：收藏 + 点赞（严格等高，点赞带累计数），40px 触控面积 */}
        <div className='flex items-start justify-end mb-1.5 sm:mb-2 gap-1 flex-shrink-0'>
          {/* 收藏/点赞：可见盒子严格 = 难度/免费付费 badge（px-1.5 py-0.5 rounded-md text-[10px]），触控通过 -mx-1.5 外扩 */}
          <div className='flex items-center justify-center min-w-[40px] min-h-[40px] -mx-1 -my-1'>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(tool.id);
                logFavorite(tool.id);
              }}
              className={`px-1.5 py-0.5 rounded-md inline-flex items-center justify-center gap-0.5 transition-all duration-200 hover:scale-105 active:scale-95 ${favorited ? 'bg-orange-100 text-orange-500 dark:bg-orange-900/30' : 'bg-gray-100 text-gray-400 hover:text-orange-500 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-orange-400'}`}
              title={tcT('saveToToolbox')}
            >
              <Star className={`h-3 w-3 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className='flex items-center justify-center min-w-[40px] min-h-[40px] -mx-1 -my-1'>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLike(tool.id);
                logLike(tool.id);
              }}
              className={`px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5 transition-all duration-200 hover:scale-105 active:scale-95 ${liked ? 'bg-red-100 text-red-500 dark:bg-red-900/30' : 'bg-gray-100 text-gray-400 hover:text-red-500 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-red-400'}`}
              title={tcT('like')}
            >
              <Heart className={`h-3 w-3 ${liked ? 'fill-current' : ''}`} />
              <span className='text-[10px] font-medium tabular-nums leading-none tracking-tight'>{formatLikes(totalLikes)}</span>
            </button>
          </div>
        </div>

        {/* 标题行：verified 徽章在顶部角标区，不与标题行重叠，无需左缩进 */}
        <h3 className='font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug mb-1 sm:mb-1.5 whitespace-normal break-words min-w-0'>
          {toolName}
        </h3>

        <div className='flex flex-wrap items-baseline gap-1 mb-1 sm:mb-1.5 flex-shrink-0 min-w-0'>
          {tool.difficulty && (
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap shrink-0 ${getDifficultyStyle(tool.difficulty)}`}>
              {getDifficultyText(tool.difficulty)}
            </span>
          )}
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap shrink-0 ${tool.isLimitedFree ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : tool.isFree ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
            {tool.isLimitedFree ? t('limited-free') : tool.isFree ? t('free') : t('paid')}
          </span>
          {extraBadges.slice(0, 1).map((b, i) => (
            <span key={i} className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap shrink-0 ${b.style}`}>
              {b.text}
            </span>
          ))}
        </div>

        {/* 工具介绍：比工具名小一号 */}
        <p className='text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-400 flex-1 line-clamp-3 leading-relaxed overflow-hidden'>{toolDescription}</p>

        {/* 底部信息行：左侧关键词标签 */}
        <div className='mt-1.5 sm:mt-2 flex-shrink-0'>
          <div className='flex flex-wrap gap-1 h-5 overflow-hidden'>
            {toolTags.slice(0, 2).map((tag: string) => (
              <span key={tag} className='px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 truncate max-w-[80px] sm:max-w-none'>
                {tag}
              </span>
            ))}
          </div>
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

  const toolPath = tool.slug && isInternalTool(tool.slug)
    ? `/${locale}/tool/${tool.slug}`
    : `/${locale}/tool/detail/?slug=${encodeURIComponent(tool.slug || '')}`;

  return (
    <a href={toolPath} className='w-full block group'>
      {cardContent}
    </a>
  );
}
