﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿'use client';

import { useTranslations } from 'next-intl';
import { Menu, Globe, Sun, Moon, Sparkles, X, RefreshCw, Folder, History, MoreVertical, Settings, Trophy, Accessibility, Bookmark, Share2, ChevronDown, Check, Layers, Home, Key, Image as ImageIcon, Sparkles as SparklesIcon, Lightbulb } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePreferencesStore } from '@/stores/preferences';
import { useLocaleSwitcher } from '@/lib/useLocaleSwitcher';
import { saveLocale, SupportedLocale } from '@/lib/language-detection';
import ShareButton from './ShareButton';
import InstallToHomeButton from './InstallToHomeButton';

// 动态导入面板组件，减少首屏bundle
const ToolBox = dynamic(() => import('./ToolBox'), { loading: () => null });
const HistoryPanel = dynamic(() => import('./HistoryPanel'), { loading: () => null });
const AccessibilitySettings = dynamic(() => import('./AccessibilitySettings'), { loading: () => null });
const AchievementsPanel = dynamic(() => import('./AchievementsPanel'), { loading: () => null });

function Logo() {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 group">
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-[32%] overflow-hidden shadow-lg shadow-indigo-900/25 group-hover:scale-105 transition-all duration-200 border border-white/10">
          <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              {/* 徽章背景：蓝→紫低饱和渐变 */}
              <linearGradient id="badgeBgKT" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B77BA" />
                <stop offset="50%" stopColor="#8378B5" />
                <stop offset="100%" stopColor="#9A8AC6" />
              </linearGradient>
              {/* KT 文字：浅蓝紫渐变，玻璃融合感 */}
              <linearGradient id="ktTextKT" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BECBF2" stopOpacity="0.92" />
                <stop offset="45%" stopColor="#CDBFE8" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#D6C7EF" stopOpacity="0.92" />
              </linearGradient>
              {/* 右上角流光：白→浅蓝紫 扫光渐变 */}
              <linearGradient id="shineGradKT" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="40%" stopColor="#E4E9FB" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              {/* 裁成扇弧形，保证流光只有右上角一段 */}
              <clipPath id="shineClipKT">
                <path d="M 148 20 A 58 58 0 0 1 192 68 L 188 74 A 52 52 0 0 0 154 26 Z" />
              </clipPath>
            </defs>

            {/* 1. 圆角 Squircle 徽章底 */}
            <rect x="0" y="0" width="200" height="200" rx="52" ry="52" fill="url(#badgeBgKT)" />

            {/* 2. 徽章顶部柔光 + 边缘高光 */}
            <rect x="0" y="0" width="200" height="200" rx="52" ry="52" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
            <rect x="10" y="10" width="180" height="90" rx="42" ry="42" fill="rgba(255,255,255,0.06)" />

            {/* ★ 右上角动态流光：绕徽章中心缓慢旋转的扫光带 ★ */}
            <g clipPath="url(#shineClipKT)">
              <g transform="translate(160 45)">
                <rect x="-60" y="-6" width="120" height="12" rx="6" ry="6" fill="url(#shineGradKT)">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="-20"
                    to="40"
                    dur="3.6s"
                    repeatCount="indefinite"
                    values="-20;40;-20"
                    keyTimes="0;0.5;1"
                  />
                </rect>
              </g>
            </g>

            {/* 3. KT 居中主字 + 句号在右侧 */}
            <text
              x="100"
              y="132"
              textAnchor="middle"
              fontFamily="'Quicksand', 'Nunito', 'Varela Round', 'Inter', system-ui, sans-serif"
              fontWeight="700"
              fontSize="100"
              fill="url(#ktTextKT)"
              style={{ letterSpacing: '-0.5px' }}
            >
              KT
            </text>
            <text
              x="146"
              y="132"
              textAnchor="start"
              fontFamily="'Quicksand', 'Nunito', 'Varela Round', 'Inter', system-ui, sans-serif"
              fontWeight="700"
              fontSize="84"
              fill="url(#ktTextKT)"
            >
              。
            </text>
          </svg>
        </div>
      </div>
      {/* 双行结构：Korelyy Tools + korelyy.com */}
      <div className="flex flex-col">
        <span className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Korelyy Tools
        </span>
        <span className="text-[9px] sm:text-[10px] lg:text-[11px] text-white/55 tracking-wide leading-tight lowercase" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          korelyy.com
        </span>
      </div>
    </div>
  );
}

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('header');
  const tNav = useTranslations('nav');
  const tNav2 = useTranslations('nav2');
  const { theme, toggleTheme, setLocale, searchQuery, setSearchQuery, favoriteTools, history } = usePreferencesStore();
  const { switchLocale } = useLocaleSwitcher();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBookmarkToast, setShowBookmarkToast] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showToolBox, setShowToolBox] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const locales = [
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'zh', name: '中', flag: '🇨🇳' },
    { code: 'es', name: 'ES', flag: '🇪🇸' },
    { code: 'hi', name: 'हिं', flag: '🇮🇳' },
    { code: 'fr', name: 'FR', flag: '🇫🇷' },
    { code: 'ar', name: 'ع', flag: '🇸🇦' },
  ];

  // Click outside to close more menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = () => {
    setShowMoreMenu(false);
    setIsUpdating(true);
    try {
      window.location.reload();
    } finally {
      /* no-op: after reload this component unmounts */
    }
  };

  const handleLocaleChange = (code: string) => {
    setLocale(code);
    saveLocale(code as SupportedLocale);
    switchLocale(code as SupportedLocale);
  };

  const handleBookmark = () => {
    setShowMoreMenu(false);
    const title = 'Korelyy Tools';
    const url = 'https://korelyy.com';
    const nav = navigator as unknown as { bookmarks?: { create: (data: { title: string; url: string }) => Promise<void> } };
    if (nav.bookmarks) {
      nav.bookmarks.create({ title, url }).then(() => {
        setShowBookmarkToast(true);
        setTimeout(() => setShowBookmarkToast(false), 2000);
      }).catch(() => {
        manualBookmark();
      });
    } else {
      manualBookmark();
    }
  };

  const manualBookmark = () => {
    const win = window as unknown as { sidebar?: { addPanel: (title: string, url: string, icon: string) => void } };
    const ext = window.external as unknown as { AddFavorite?: (url: string, title: string) => void };
    if (win.sidebar && win.sidebar.addPanel) {
      win.sidebar.addPanel('Korelyy Tools', 'https://korelyy.com', '');
      setShowBookmarkToast(true);
      setTimeout(() => setShowBookmarkToast(false), 2000);
    } else if (ext && ext.AddFavorite) {
      ext.AddFavorite('https://korelyy.com', 'Korelyy Tools');
      setShowBookmarkToast(true);
      setTimeout(() => setShowBookmarkToast(false), 2000);
    } else {
      alert(tNav('bookmarkTip'));
    }
  };

  // More menu items
  const moreMenuItems = [
    { 
      icon: <Layers className="w-4 h-4" />, 
      label: tNav2('workflows'), 
      onClick: () => { window.location.href = `/${locale}/workflows`; } 
    },
    { 
      icon: <SparklesIcon className="w-4 h-4" />, 
      label: tNav2('templates'), 
      onClick: () => { window.location.href = `/${locale}/templates`; } 
    },
    { 
      icon: <ImageIcon className="w-4 h-4" />, 
      label: tNav2('batchProcess'), 
      onClick: () => { window.location.href = `/${locale}/batch-image-processor`; } 
    },
    { 
      icon: <Key className="w-4 h-4" />, 
      label: tNav2('apiKeys'), 
      onClick: () => { window.location.href = `/${locale}/api-keys`; } 
    },
    { 
      icon: <Lightbulb className="w-4 h-4" />, 
      label: tNav2('ideas'), 
      onClick: () => { window.location.href = `/${locale}/ideas`; } 
    },
    { 
      icon: <Folder className="w-4 h-4" />, 
      label: tNav('toolbox'), 
      badge: favoriteTools.length,
      onClick: () => { setShowToolBox(true); setShowMoreMenu(false); } 
    },
    { 
      icon: <History className="w-4 h-4" />, 
      label: tNav('history'), 
      badge: history.length,
      onClick: () => { setShowHistory(true); setShowMoreMenu(false); } 
    },
    { 
      icon: <Trophy className="w-4 h-4" />, 
      label: tNav('achievements'), 
      onClick: () => { setShowAchievements(true); setShowMoreMenu(false); } 
    },
    { 
      icon: hasMounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, 
      label: hasMounted && theme === 'dark' ? tNav('lightMode') : tNav('darkMode'), 
      onClick: () => { toggleTheme(); setShowMoreMenu(false); } 
    },
    { 
      icon: <Accessibility className="w-4 h-4" />, 
      label: tNav('accessibility'), 
      onClick: () => { setShowAccessibility(true); setShowMoreMenu(false); } 
    },
    { 
      icon: <RefreshCw className="w-4 h-4" />, 
      label: tNav('checkUpdate'), 
      onClick: handleUpdate 
    },
    { 
      icon: <Bookmark className="w-4 h-4" />, 
      label: tNav('bookmarkSite'), 
      onClick: handleBookmark 
    },
  ];

  return (
    <header className='sticky top-0 z-50 bg-[#2A3154] border-b border-black/10'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-14 sm:h-16'>
          {/* Left: Logo + Search */}
          <div className='flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0 flex-1'>
            <a href={`/${locale}`} className='flex-shrink-0'><Logo /></a>
          </div>

          {/* Right: Main Actions */}
          <div className='flex items-center gap-1.5 sm:gap-2 md:gap-3'>

            {/* Install / Add to Home Screen */}
            <InstallToHomeButton />

            {/* Share Button */}
            <ShareButton />

            {/* Language Switcher - Dropdown */}
            <div className='hidden sm:block relative' ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-xs'
                title={t('language')}
              >
                <Globe className='h-3.5 w-3.5' />
                <span className='font-medium'>{locales.find(l => l.code === locale)?.name || 'EN'}</span>
                <ChevronDown className='h-3 w-3 opacity-80' />
              </button>
              
              {showLangMenu && (
                <div className='absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
                  {locales.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { handleLocaleChange(l.code); setShowLangMenu(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors ${locale === l.code ? 'bg-primary-50 text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                    >
                      <span className='text-base'>{l.flag}</span>
                      <span className='flex-1 font-medium'>{l.name}</span>
                      {locale === l.code && (
                        <Check className='h-4 w-4 text-primary-600' />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* More Menu (Three dots) */}
            <div className='relative' ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className='p-1.5 sm:p-2 rounded-lg text-white hover:bg-white/10 transition-colors relative'
                aria-label={tNav('moreFeatures')}
                title={tNav('moreFeatures')}
              >
                <MoreVertical className='h-5 w-5' />
                {hasMounted && (favoriteTools.length > 0 || history.length > 0) && (
                  <span className='absolute top-1 right-1 w-2 h-2 bg-[#34A89C] rounded-full' />
                )}
              </button>

              {/* Dropdown Menu */}
              {showMoreMenu && (
                <div className='absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
                  <div className='px-3 py-2 border-b border-gray-100 dark:border-gray-700'>
                    <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                      {tNav('moreFeatures')}
                    </p>
                  </div>
                  <div className='py-1 max-h-[70vh] overflow-y-auto'>
                    {moreMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.onClick}
                        className='w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
                      >
                        <span className='text-gray-500 dark:text-gray-400'>{item.icon}</span>
                        <span className='flex-1'>{item.label}</span>
                        {hasMounted && item.badge !== undefined && item.badge > 0 && (
                          <span className='px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full min-w-[20px] text-center'>
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className='md:hidden p-1.5 sm:p-2 rounded-lg text-white hover:bg-white/10'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label='Menu'
            >
              {mobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>

        {/* Mobile menu - search & language */}
        {mobileMenuOpen && (
          <div className='md:hidden py-3 sm:py-4 border-t border-white/10 space-y-3'>
            {/* 返回首页 */}
            <a
              href={`/${locale}`}
              className='flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors'
            >
              <Home className='h-4 w-4' />
              <span className='text-sm font-medium'>{tNav2('backHome')}</span>
            </a>
            
            {/* 工具工作流 */}
            <a
              href={`/${locale}/workflows`}
              className='flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 text-white hover:bg-white/15 transition-colors'
            >
              <Layers className='h-4 w-4' />
              <span className='text-sm font-medium'>{tNav2('workflows')}</span>
            </a>
            
            {/* 发现模板 */}
            <a
              href={`/${locale}/templates`}
              className='flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 text-white hover:bg-white/15 transition-colors'
            >
              <SparklesIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>{tNav2('templates')}</span>
            </a>
            
            {/* 批量文件处理 */}
            <a
              href={`/${locale}/batch-image-processor`}
              className='flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 text-white hover:bg-white/15 transition-colors'
            >
              <ImageIcon className='h-4 w-4' />
              <span className='text-sm font-medium'>{tNav2('batchProcess')}</span>
            </a>
            
            {/* API密钥 */}
            <a
              href={`/${locale}/api-keys`}
              className='flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 text-white hover:bg-white/15 transition-colors'
            >
              <Key className='h-4 w-4' />
              <span className='text-sm font-medium'>{tNav2('apiKeys')}</span>
            </a>
            
            {/* 创意工坊 */}
            <a
              href={`/${locale}/ideas`}
              className='flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 text-white hover:bg-white/15 transition-colors border border-white/10'
            >
              <Lightbulb className='h-4 w-4' />
              <span className='text-sm font-medium'>{tNav2('ideasBadge')}</span>
            </a>
            <div className='flex items-center gap-2'>
              <Globe className='h-4 w-4 text-white/70' />
              <div className='flex-1 grid grid-cols-6 gap-1'>
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLocaleChange(l.code)}
                    className={`px-1 py-2 rounded-lg text-sm transition-colors flex flex-col items-center ${locale === l.code ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="text-[10px] mt-0.5">{l.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {showBookmarkToast && (
          <div className='fixed top-16 sm:top-20 right-3 sm:right-4 z-50 px-3 sm:px-4 py-2.5 sm:py-3 bg-primary-600 text-white text-sm rounded-lg shadow-lg animate-bounce'>
            {tNav('bookmarked')}
          </div>
        )}
        {showUpdateToast && (
          <div className='fixed top-16 sm:top-20 right-3 sm:right-4 z-50 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#34A89C] text-white text-sm rounded-lg shadow-lg animate-bounce'>
            {tNav('updateComplete')}
          </div>
        )}
      </div>
      
      <ToolBox locale={locale} isOpen={showToolBox} onClose={() => setShowToolBox(false)} />
      <HistoryPanel locale={locale} isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <AccessibilitySettings locale={locale} isOpen={showAccessibility} onClose={() => setShowAccessibility(false)} />
      <AchievementsPanel locale={locale} isOpen={showAchievements} onClose={() => setShowAchievements(false)} />
    </header>
  );
}
