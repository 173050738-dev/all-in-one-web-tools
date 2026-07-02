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
      storage: createJSONStorage(() => localStorage),
    }
  )
);
