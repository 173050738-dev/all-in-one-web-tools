'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Trophy, X, Gift, Star, Heart, Search, Folder, History, Zap, Medal, Crown, Sparkles } from 'lucide-react';
import { usePreferencesStore } from '@/stores/preferences';

interface Achievement {
  id: string;
  icon: React.ReactNode;
  nameKey: string;
  descKey: string;
  check: (state: AchievementState) => boolean;
}

interface AchievementState {
  likedCount: number;
  favoriteCount: number;
  historyCount: number;
  hasSearched: boolean;
  hasUsedAssistant: boolean;
  hasShared: boolean;
}

interface AchievementsPanelProps {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsPanel({ locale, isOpen, onClose }: AchievementsPanelProps) {
  const t = useTranslations('achievements');
  const { likedTools, favoriteTools, history } = usePreferencesStore();
  const panelRef = useRef<HTMLDivElement>(null);
  
  const [showUnlock, setShowUnlock] = useState<Achievement | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  const achievements: Achievement[] = [
    {
      id: 'first-like',
      icon: <Heart className="w-5 h-5" />,
      nameKey: 'first-like-name',
      descKey: 'first-like-desc',
      check: (state) => state.likedCount >= 1,
    },
    {
      id: 'like-master',
      icon: <Heart className="w-5 h-5 fill-current" />,
      nameKey: 'like-master-name',
      descKey: 'like-master-desc',
      check: (state) => state.likedCount >= 10,
    },
    {
      id: 'first-save',
      icon: <Star className="w-5 h-5" />,
      nameKey: 'first-save-name',
      descKey: 'first-save-desc',
      check: (state) => state.favoriteCount >= 1,
    },
    {
      id: 'collector',
      icon: <Folder className="w-5 h-5" />,
      nameKey: 'collector-name',
      descKey: 'collector-desc',
      check: (state) => state.favoriteCount >= 5,
    },
    {
      id: 'first-search',
      icon: <Search className="w-5 h-5" />,
      nameKey: 'first-search-name',
      descKey: 'first-search-desc',
      check: (state) => state.hasSearched,
    },
    {
      id: 'first-history',
      icon: <History className="w-5 h-5" />,
      nameKey: 'first-history-name',
      descKey: 'first-history-desc',
      check: (state) => state.historyCount >= 1,
    },
    {
      id: 'explorer',
      icon: <Zap className="w-5 h-5" />,
      nameKey: 'explorer-name',
      descKey: 'explorer-desc',
      check: (state) => state.historyCount >= 10,
    },
    {
      id: 'social-butterfly',
      icon: <Gift className="w-5 h-5" />,
      nameKey: 'social-name',
      descKey: 'social-desc',
      check: (state) => state.hasShared,
    },
  ];

  const state: AchievementState = {
    likedCount: likedTools.length,
    favoriteCount: favoriteTools.length,
    historyCount: history.length,
    hasSearched: false,
    hasUsedAssistant: false,
    hasShared: false,
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

  useEffect(() => {
    const saved = localStorage.getItem('korelyy-achievements');
    if (saved) {
      setUnlockedAchievements(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    achievements.forEach((achievement) => {
      if (!unlockedAchievements.includes(achievement.id) && achievement.check(state)) {
        setUnlockedAchievements((prev) => [...prev, achievement.id]);
        localStorage.setItem(
          'korelyy-achievements',
          JSON.stringify([...unlockedAchievements, achievement.id])
        );
        setShowUnlock(achievement);
      }
    });
  }, [state.likedCount, state.favoriteCount, state.historyCount]);

  const unlockedCount = achievements.filter((a) => 
    unlockedAchievements.includes(a.id) || a.check(state)
  ).length;

  if (!isOpen) return null;

  return (
    <>
      {showUnlock && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-[90vw] text-center animate-bounce">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white">
            <Crown className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {locale === 'zh' ? '成就解锁！' : 'Achievement Unlocked!'}
          </h3>
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            {showUnlock.icon}
          </div>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{t(`${showUnlock.id}-name`)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t(`${showUnlock.id}-desc`)}</p>
          <button
            onClick={() => setShowUnlock(null)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            {locale === 'zh' ? '太棒了！' : 'Awesome!'}
          </button>
        </div>
      )}

      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div 
        ref={panelRef}
        className="fixed top-20 left-3 right-3 sm:left-auto sm:right-4 lg:right-8 w-auto sm:w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 transition-all duration-300 transform opacity-100 translate-x-0 max-h-[70vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                {locale === 'zh' ? '成就' : 'Achievements'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {unlockedCount} / {achievements.length} {locale === 'zh' ? '已解锁' : 'unlocked'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id) || achievement.check(state);
              return (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    isUnlocked 
                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'border-gray-200 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}>
                      {isUnlocked ? (
                        <Medal className="w-5 h-5" />
                      ) : (
                        achievement.icon
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-sm ${
                        isUnlocked 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {t(`${achievement.id}-name`)}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {t(`${achievement.id}-desc`)}
                      </p>
                    </div>
                    {isUnlocked && (
                      <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
