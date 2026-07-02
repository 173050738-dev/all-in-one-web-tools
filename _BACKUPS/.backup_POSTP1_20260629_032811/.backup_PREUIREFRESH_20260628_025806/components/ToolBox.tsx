'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Folder, X, Search, Star, Trash2, ExternalLink, ArrowRight } from 'lucide-react';
import { tools } from '@/data/tools';
import { useFavoritesStore } from '@/stores/favorites';
import SafeLink from './SafeLink';

interface ToolBoxProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolBox({ locale, isOpen, onClose }: ToolBoxProps) {
  const t = useTranslations('toolbox');
  const favoriteTools = useFavoritesStore((s) => s.favoriteTools);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const removeFromHistory = useFavoritesStore((s) => s.removeFromHistory);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);
  const [searchQuery, setSearchQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const favoriteToolList = tools.filter(tool => favoriteTools.includes(tool.id));
  
  const filteredTools = favoriteToolList.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (tool: typeof tools[0]) => {
    if (tool.externalUrl) {
      window.open(tool.externalUrl, '_blank');
    } else {
      window.location.href = `/${locale}/tool/${tool.slug}`;
    }
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}
      
      <div 
        className={`fixed top-20 left-3 right-3 sm:left-auto sm:right-4 lg:right-8 w-auto sm:w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 transition-all duration-300 transform ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        } max-h-[70vh] flex flex-col`}
        ref={panelRef}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {locale === 'zh' ? '我的工具箱' : 'My Toolbox'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {locale === 'zh' ? `${favoriteToolList.length} 个收藏工具` : `${favoriteToolList.length} saved tools`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {favoriteToolList.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm(locale === 'zh' ? '确定要清空所有收藏吗？此操作不可撤销。' : 'Clear all saved tools? This cannot be undone.')) {
                    clearFavorites();
                  }
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors"
                title={locale === 'zh' ? '清空收藏' : 'Clear all'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative mb-4 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'zh' ? '搜索收藏的工具...' : 'Search saved tools...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {filteredTools.length > 0 ? (
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                  onClick={() => handleNavigate(tool)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-orange-500" fill="currentColor" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {tool.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {locale === 'zh' ? '还没有收藏任何工具' : 'No saved tools yet'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {locale === 'zh' ? '点击工具卡片上的星标按钮来收藏' : 'Click the star button on tool cards to save them'}
              </p>
              <button
                onClick={() => { onClose(); window.location.href = `/${locale}`; }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors min-h-[40px]"
              >
                {locale === 'zh' ? '去发现工具' : 'Discover tools'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
