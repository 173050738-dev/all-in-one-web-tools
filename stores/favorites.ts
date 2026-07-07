import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface HistoryItem {
  toolId: string;
  timestamp: number;
}

export type CloudSyncStatus = 'idle' | 'syncing' | 'error';

export interface FavoritesState {
  likedTools: string[];
  recentlyUsedTools: HistoryItem[];
  favoritedTools: string[];
  allTools: any[];
  localLikes: Record<string, boolean>;
  history: HistoryItem[];
  favoriteTools: string[];
  cloudSyncStatus: CloudSyncStatus;
  lastCloudError: string | null;
  initializeAllTools: (tools: any[]) => void;
  updateAllTools: (tools: any[]) => void;
  toggleLike: (toolId: string) => void;
  toggleFavorite: (toolId: string) => Promise<{ favorited: boolean; rolledBack?: boolean }>;
  addRecentlyUsed: (toolId: string) => void;
  isLiked: (toolId: string) => boolean;
  isFavorite: (toolId: string) => boolean;
  clearFavorites: () => void;
  addToHistory: (toolId: string) => void;
  removeFromHistory: (toolId: string) => void;
  clearHistory: () => void;
  setFavoriteTools: (toolIds: string[]) => void;
  getFavoriteSlugs: () => string[];
  mergeFromServer: (serverSlugs: string[]) => void;
  _setCloudStatus: (s: CloudSyncStatus, err?: string | null) => void;
}

const _idToSlug = (allTools: any[], toolId: string): string | null => {
  if (!toolId) return null;
  if (!Array.isArray(allTools)) return toolId;
  const t = allTools.find((x: any) => x.id === toolId);
  if (t?.slug) return t.slug;
  const t2 = allTools.find((x: any) => x.slug === toolId);
  if (t2?.slug) return toolId;
  return toolId;
};

const _slugToId = (allTools: any[], slug: string): string | null => {
  if (!slug) return null;
  if (!Array.isArray(allTools)) return slug;
  const t = allTools.find((x: any) => x.slug === slug);
  if (t?.id) return t.id;
  const t2 = allTools.find((x: any) => x.id === slug);
  if (t2?.id) return slug;
  return slug;
};

const _getAuthStore = () => {
  if (typeof window === 'undefined') return null;
  try {
    const m = require('./auth');
    return (m.useAuthStore as typeof import('./auth').useAuthStore) || null;
  } catch {
    return null;
  }
};

const _emitUnauthToast = () => {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('fav:unauth-toggle', {}));
  } catch { /* ignore */ }
};

const _emitSyncResult = (kind: 'success' | 'error', payload?: any) => {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('fav:sync-result', { detail: { kind, ...(payload || {}) } }));
  } catch { /* ignore */ }
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      likedTools: [],
      recentlyUsedTools: [],
      favoritedTools: [],
      allTools: [],
      localLikes: {},
      history: [],
      favoriteTools: [],
      cloudSyncStatus: 'idle',
      lastCloudError: null,

      initializeAllTools: (tools) => set({ allTools: tools }),
      updateAllTools: (tools) => set({ allTools: tools }),

      toggleLike: (toolId) =>
        set((state) => ({
          likedTools: state.likedTools.includes(toolId)
            ? state.likedTools.filter((id) => id !== toolId)
            : [...state.likedTools, toolId],
          localLikes: {
            ...state.localLikes,
            [toolId]: !state.likedTools.includes(toolId),
          },
        })),

      toggleFavorite: async (toolId) => {
        const state = get();
        const currentlyFav = state.favoriteTools.includes(toolId);
        const nextFavIds = currentlyFav
          ? state.favoriteTools.filter((id) => id !== toolId)
          : [...state.favoriteTools, toolId];

        set({
          favoriteTools: nextFavIds,
          favoritedTools: nextFavIds,
          cloudSyncStatus: 'idle',
          lastCloudError: null,
        });

        const authStore = _getAuthStore();
        const authState = authStore?.getState?.();
        const isAuthed = authState?.status === 'authed';

        if (!isAuthed) {
          _emitUnauthToast();
          return { favorited: !currentlyFav };
        }

        const slug = _idToSlug(state.allTools, toolId);
        if (!slug) {
          return { favorited: !currentlyFav };
        }

        set({ cloudSyncStatus: 'syncing' });

        try {
          const r = await authState.toggleFavorite(slug);
          const serverNextSlugs: string[] = r.next || [];
          const serverNextIds = serverNextSlugs
            .map((s) => _slugToId(get().allTools, s))
            .filter(Boolean) as string[];

          const merged = Array.from(new Set<string>([...serverNextIds, ...nextFavIds]));
          set({
            favoriteTools: merged,
            favoritedTools: merged,
            cloudSyncStatus: 'idle',
            lastCloudError: null,
          });
          _emitSyncResult('success', { toolId, favorited: !!r.favorited });
          return { favorited: !!r.favorited };
        } catch (e: any) {
          const errMsg = typeof e?.message === 'string' ? e.message : 'SYNC_FAIL';
          set({
            favoriteTools: state.favoriteTools,
            favoritedTools: state.favoritedTools,
            cloudSyncStatus: 'error',
            lastCloudError: errMsg,
          });
          _emitSyncResult('error', { toolId, error: errMsg });
          return { favorited: currentlyFav, rolledBack: true };
        }
      },

      addRecentlyUsed: (toolId) =>
        set((state) => {
          const existingIndex = state.recentlyUsedTools.findIndex((item) => item.toolId === toolId);
          let newRecentlyUsed = existingIndex >= 0
            ? [...state.recentlyUsedTools.slice(0, existingIndex), ...state.recentlyUsedTools.slice(existingIndex + 1)]
            : [...state.recentlyUsedTools];
          newRecentlyUsed.unshift({ toolId, timestamp: Date.now() });
          if (newRecentlyUsed.length > 50) {
            newRecentlyUsed = newRecentlyUsed.slice(0, 50);
          }
          return { recentlyUsedTools: newRecentlyUsed, history: newRecentlyUsed };
        }),

      isLiked: (toolId) => get().likedTools.includes(toolId),
      isFavorite: (toolId) => get().favoriteTools.includes(toolId),

      addToHistory: (toolId) =>
        set((state) => {
          const existingIndex = state.history.findIndex((item) => item.toolId === toolId);
          let newHistory = existingIndex >= 0
            ? [...state.history.slice(0, existingIndex), ...state.history.slice(existingIndex + 1)]
            : [...state.history];
          newHistory.unshift({ toolId, timestamp: Date.now() });
          if (newHistory.length > 50) {
            newHistory = newHistory.slice(0, 50);
          }
          return { history: newHistory, recentlyUsedTools: newHistory };
        }),
      removeFromHistory: (toolId) =>
        set((state) => ({
          history: state.history.filter((item) => item.toolId !== toolId),
          recentlyUsedTools: state.recentlyUsedTools.filter((item) => item.toolId !== toolId),
        })),
      clearHistory: () => set({ history: [], recentlyUsedTools: [] }),
      clearFavorites: () => set({ favoriteTools: [], favoritedTools: [] }),

      setFavoriteTools: (toolIds) => {
        const clean = Array.isArray(toolIds) ? toolIds.filter((x) => x && typeof x === 'string') : [];
        set({ favoriteTools: clean, favoritedTools: clean });
      },

      getFavoriteSlugs: () => {
        const s = get();
        return s.favoriteTools
          .map((id) => _idToSlug(s.allTools, id))
          .filter(Boolean) as string[];
      },

      mergeFromServer: (serverSlugs) => {
        const s = get();
        const serverIds = (serverSlugs || [])
          .map((slug) => _slugToId(s.allTools, slug))
          .filter(Boolean) as string[];
        const localIds = s.favoriteTools || [];
        const merged = Array.from(new Set<string>([...serverIds, ...localIds]));
        set({ favoriteTools: merged, favoritedTools: merged });
      },

      _setCloudStatus: (s, err = null) => set({ cloudSyncStatus: s, lastCloudError: err }),
    }),
    {
      name: 'tool-hub-favorites',
      partialize: (s) => ({
        likedTools: s.likedTools,
        favoritedTools: s.favoritedTools,
        localLikes: s.localLikes,
        history: s.history,
        favoriteTools: s.favoriteTools,
        recentlyUsedTools: s.recentlyUsedTools,
      } as Partial<FavoritesState>),
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        try {
          const __t = '__zustand_ls_probe__';
          localStorage.setItem(__t, '1');
          localStorage.removeItem(__t);
          return {
            getItem: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
            setItem: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
            removeItem: (k) => { try { localStorage.removeItem(k); } catch {} },
          };
        } catch {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
      }),
    }
  )
);
