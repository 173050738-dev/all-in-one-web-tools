import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type PipelineKind = 'image';

export interface PipelinePayload {
  kind: PipelineKind;
  dataUrl: string;
  fileName?: string;
  mimeType?: string;
  source: string;
  createdAt: number;
}

const MAX_AGE_MS = 10 * 60 * 1000;

interface PipelineState {
  payload: PipelinePayload | null;
  setPayload: (p: PipelinePayload) => void;
  consumePayload: () => PipelinePayload | null;
  clear: () => void;
}

const _ssrSafeStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };
  }
  try {
    const __probe = '__korelyy_pipeline_probe__';
    sessionStorage.setItem(__probe, '1');
    sessionStorage.removeItem(__probe);
    return {
      getItem: (name: string) => {
        try { return Promise.resolve(sessionStorage.getItem(name)); }
        catch { return Promise.resolve(null); }
      },
      setItem: (name: string, value: string) => {
        try { sessionStorage.setItem(name, value); return Promise.resolve(); }
        catch { return Promise.resolve(); }
      },
      removeItem: (name: string) => {
        try { sessionStorage.removeItem(name); return Promise.resolve(); }
        catch { return Promise.resolve(); }
      },
    };
  } catch {
    return {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };
  }
};

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
      payload: null,
      setPayload: (p: PipelinePayload) => set({ payload: p }),
      consumePayload: (): PipelinePayload | null => {
        const current = get().payload;
        if (!current) return null;
        const age = Date.now() - (current.createdAt || 0);
        if (age > MAX_AGE_MS || age < -60_000) {
          set({ payload: null });
          return null;
        }
        set({ payload: null });
        return current;
      },
      clear: () => set({ payload: null }),
    }),
    {
      name: 'korelyy-pipeline',
      storage: createJSONStorage(_ssrSafeStorage, {
        reviver: (_key, value) => value,
      }),
      partialize: (s) => ({ payload: s.payload } as Partial<PipelineState>),
    }
  )
);
