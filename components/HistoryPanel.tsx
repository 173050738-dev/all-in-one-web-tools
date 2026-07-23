'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { History, X, Clock, Trash2, ExternalLink, ArrowRight } from 'lucide-react';
import { getToolIndexById, type ToolIndexItem } from '@/data/tools';
import { useFavoritesStore, HistoryItem } from '@/stores/favorites';
import SafeLink from './SafeLink';
import { resolveToolLink } from '@/lib/toolLinks';

interface HistoryPanelProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}

function formatTime(timestamp: number, locale: string): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) {
    return locale === 'zh' ? '刚刚' : 'Just now';
  } else if (minutes < 60) {
    return locale === 'zh' ? `${minutes} 分钟前` : `${minutes}m ago`;
  } else if (hours < 24) {
    return locale === 'zh' ? `${hours} 小时前` : `${hours}h ago`;
  } else if (days < 7) {
    return locale === 'zh' ? `${days} 天前` : `${days}d ago`;
  } else {
    const date = new Date(timestamp);
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
}

export default function HistoryPanel({ locale, isOpen, onClose }: HistoryPanelProps) {
  const t = useTranslations('history');
  const toolsT = useTranslations('tools');
  const history = useFavoritesStore((s) => s.history);
  const removeFromHistory = useFavoritesStore((s) => s.removeFromHistory);
  const clearHistory = useFavoritesStore((s) => s.clearHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  const safeTranslate = (key: string, fallback: string) => {
    try {
      const translated = toolsT(key);
      if (translated && translated !== key && !translated.startsWith('tools.')) return translated;
    } catch { /* fallthrough */ }
    return fallback;
  };

  const getToolDisplayName = (tool: ToolIndexItem): string => {
    if (locale === 'zh') return tool.name;
    const slug = tool.slug || tool.id || '';
    const keyAlt = tool.id && tool.id !== slug ? tool.id : '';
    const en = (tool as any).nameEn || tool.name;
    const v = safeTranslate(`${slug}.name`, keyAlt ? safeTranslate(`${keyAlt}.name`, '') : '');
    return v || en;
  };

  const getToolDisplayDesc = (tool: ToolIndexItem): string => {
    if (locale === 'zh') return tool.description;
    const slug = tool.slug || tool.id || '';
    const keyAlt = tool.id && tool.id !== slug ? tool.id : '';
    const en = (tool as any).descriptionEn || tool.description;
    const v = safeTranslate(`${slug}.description`, keyAlt ? safeTranslate(`${keyAlt}.description`, '') : '');
    return v || en;
  };

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

  const historyWithTools = history.map(item => {
    const tool = getToolIndexById(item.toolId);
    return { ...item, tool };
  }).filter(item => item.tool) as Array<HistoryItem & { tool: ToolIndexItem }>;

  const filteredHistory = historyWithTools.filter(item => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      getToolDisplayName(item.tool!).toLowerCase().includes(q) ||
      getToolDisplayDesc(item.tool!).toLowerCase().includes(q)
    );
  });

  const groupedHistory = filteredHistory.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, typeof filteredHistory>);

  const handleNavigate = (toolId: string) => {
    const tool = getToolIndexById(toolId);
    if (tool) {
      const link = resolveToolLink(tool.slug || tool.id, locale);
      if (link.type === 'external') {
        window.open(link.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = link.url;
      }
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {locale === 'zh' ? '使用历史' : 'History'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {locale === 'zh' ? `${history.length} 条记录` : `${history.length} records`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                title={locale === 'zh' ? '清空历史' : 'Clear history'}
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
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
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'zh' ? '搜索历史记录...' : 'Search history...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {Object.keys(groupedHistory).length > 0 ? (
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date}>
                  <h3 className="text-xs font-medium text-gray-400 mb-2 px-1">
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.timestamp}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                        onClick={() => handleNavigate(item.toolId)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <History className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {getToolDisplayName(item.tool!)}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(item.timestamp, locale)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromHistory(item.toolId);
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {locale === 'zh' ? '还没有使用记录' : 'No history yet'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {locale === 'zh' ? '使用工具后会自动记录在这里' : 'Your tool usage will be recorded automatically'}
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
