import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UiPreferencesState {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  reduceData: boolean;
  locale: string;
  elderMode: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
  setReduceData: (value: boolean) => void;
  setLocale: (locale: string) => void;
  toggleHighContrast: () => void;
  toggleElderMode: () => void;
  applyAccessibility: () => void;
  resetAccessibility: () => void;
}

export const useUiPreferencesStore = create<UiPreferencesState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      fontSize: 'medium',
      reducedMotion: false,
      highContrast: false,
      reduceData: false,
      locale: 'en',
      elderMode: false,
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
          }
          return { theme: newTheme };
        }),
      setFontSize: (size) => set({ fontSize: size }),
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setHighContrast: (value) =>
        set((state) => {
          if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('high-contrast', value);
            if (value) {
              document.documentElement.classList.remove('elder-mode');
              return { highContrast: true, elderMode: false };
            }
          }
          return { highContrast: value };
        }),
      setReduceData: (value) => set({ reduceData: value }),
      setLocale: (locale) => set({ locale }),
      toggleHighContrast: () =>
        set((state) => {
          const newHighContrast = !state.highContrast;
          if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('high-contrast', newHighContrast);
            if (newHighContrast) {
              document.documentElement.classList.remove('elder-mode');
              return { highContrast: true, elderMode: false };
            }
            return { highContrast: false };
          }
          return { highContrast: newHighContrast };
        }),
      toggleElderMode: () =>
        set((state) => {
          const newElderMode = !state.elderMode;
          if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('elder-mode', newElderMode);
            if (newElderMode) {
              document.documentElement.classList.remove('high-contrast');
              return { elderMode: true, highContrast: false };
            }
            return { elderMode: false };
          }
          return { elderMode: newElderMode };
        }),
      applyAccessibility: () => {
        const state = get();
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('high-contrast', state.highContrast);
          document.documentElement.classList.toggle('elder-mode', state.elderMode);
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
      resetAccessibility: () => {
        if (typeof window !== 'undefined') {
          document.documentElement.classList.remove('high-contrast', 'elder-mode');
        }
        set({
          highContrast: false,
          elderMode: false,
          reducedMotion: false,
          fontSize: 'medium',
        });
      },
    }),
    {
      name: 'tool-hub-ui-preferences',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        return localStorage;
      }),
    }
  )
);
