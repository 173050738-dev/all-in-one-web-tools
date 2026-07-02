import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface HistoryItem {
  toolId: string;
  timestamp: number;
}

export interface FavoritesState {
  likedTools: string[];
  recentlyUsedTools: HistoryItem[];
  favoritedTools: string[];
  allTools: any[];
  localLikes: Record<string, boolean>;
  history: HistoryItem[];
  favoriteTools: string[];
  initializeAllTools: (tools: any[]) => void;
  updateAllTools: (tools: any[]) => void;
  toggleLike: (toolId: string) => void;
  toggleFavorite: (toolId: string) => void;
  addRecentlyUsed: (toolId: string) => void;
  isLiked: (toolId: string) => boolean;
  isFavorite: (toolId: string) => boolean;
  clearFavorites: () => void;
  addToHistory: (toolId: string) => void;
  removeFromHistory: (toolId: string) => void;
  clearHistory: () => void;
}

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
      toggleFavorite: (toolId) =>
        set((state) => ({
          favoritedTools: state.favoritedTools.includes(toolId)
            ? state.favoritedTools.filter((id) => id !== toolId)
            : [...state.favoritedTools, toolId],
          favoriteTools: state.favoriteTools.includes(toolId)
            ? state.favoriteTools.filter((id) => id !== toolId)
            : [...state.favoriteTools, toolId],
        })),
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
    }),
    {
      name: 'tool-hub-favorites',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        return localStorage;
      }),
    }
  )
);
