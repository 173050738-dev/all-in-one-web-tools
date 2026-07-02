import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { generateSecureId } from '@/utils/security';

export interface ApiKeyUsage {
  date: string;
  calls: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: number;
  lastUsedAt?: number;
  totalCalls: number;
  usage: ApiKeyUsage[];
  status: 'active' | 'revoked';
  scopes: string[];
}

export interface ApiKeysState {
  apiKeys: ApiKey[];
  setApiKey: (name: string, keyValue: string, scopes?: string[]) => ApiKey;
  getApiKey: (id: string) => ApiKey | undefined;
  deleteApiKey: (id: string) => void;
  hasApiKey: (id: string) => boolean;
  getModelForTool: (toolId: string) => string | null;
  addApiKey: (name: string, scopes?: string[]) => ApiKey;
  removeApiKey: (id: string) => void;
  updateApiKey: (id: string, updates: Partial<Pick<ApiKey, 'name' | 'scopes'>>) => void;
  revokeApiKey: (id: string) => void;
  recordApiKeyUsage: (key: string) => void;
}

export const useApiKeysStore = create<ApiKeysState>()(
  persist(
    (set, get) => ({
      apiKeys: [],
      setApiKey: (name, keyValue, scopes = ['read', 'write']) => {
        const newKey: ApiKey = {
          id: `key-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          name,
          key: keyValue,
          createdAt: Date.now(),
          totalCalls: 0,
          usage: [],
          status: 'active',
          scopes,
        };
        set((state) => ({
          apiKeys: [newKey, ...state.apiKeys],
        }));
        return newKey;
      },
      getApiKey: (id) => get().apiKeys.find((k) => k.id === id),
      deleteApiKey: (id) =>
        set((state) => ({
          apiKeys: state.apiKeys.filter((k) => k.id !== id),
        })),
      hasApiKey: (id) => get().apiKeys.some((k) => k.id === id && k.status === 'active'),
      getModelForTool: (_toolId) => null,
      addApiKey: (name, scopes = ['read', 'write']) => {
        const newKey: ApiKey = {
          id: `key-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          name,
          key: `sk_${generateSecureId(32)}`,
          createdAt: Date.now(),
          totalCalls: 0,
          usage: [],
          status: 'active',
          scopes,
        };
        set((state) => ({
          apiKeys: [newKey, ...state.apiKeys],
        }));
        return newKey;
      },
      removeApiKey: (id) =>
        set((state) => ({
          apiKeys: state.apiKeys.filter((k) => k.id !== id),
        })),
      updateApiKey: (id, updates) =>
        set((state) => ({
          apiKeys: state.apiKeys.map((k) =>
            k.id === id ? { ...k, ...updates } : k
          ),
        })),
      revokeApiKey: (id) =>
        set((state) => ({
          apiKeys: state.apiKeys.map((k) =>
            k.id === id ? { ...k, status: 'revoked' as const } : k
          ),
        })),
      recordApiKeyUsage: (key) =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          return {
            apiKeys: state.apiKeys.map((k) => {
              if (k.key !== key || k.status !== 'active') return k;
              const existingDay = k.usage.find((u) => u.date === today);
              const newUsage = existingDay
                ? k.usage.map((u) =>
                    u.date === today ? { ...u, calls: u.calls + 1 } : u
                  )
                : [...k.usage, { date: today, calls: 1 }];
              return {
                ...k,
                totalCalls: k.totalCalls + 1,
                lastUsedAt: Date.now(),
                usage: newUsage.slice(-30),
              };
            }),
          };
        }),
    }),
    {
      name: 'tool-hub-api-keys',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
