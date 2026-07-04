import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SearchPreferencesState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useSearchPreferencesStore = create<SearchPreferencesState>()(
  persist(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: 'tool-hub-search',
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
