import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi, type AuthUser, type FavResult } from '@/lib/auth-api';

export type AuthStatus = 'idle' | 'loading' | 'authed' | 'guest';
export type AuthMode = 'login' | 'register';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  token: string;
  favorites: string[];
  modalOpen: boolean;
  modalMode: AuthMode;
  lastError: string | null;
  hydrating: boolean;
  setModal: (open: boolean, mode?: AuthMode) => void;
  setMode: (mode: AuthMode) => void;
  hydrateFromStorage: () => void;
  register: (data: { email: string; password: string; locale: string }) => Promise<{ ok: boolean; error?: string }>;
  login: (data: { email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  refreshMe: () => Promise<{ ok: boolean }>;
  fetchFavorites: () => Promise<string[]>;
  syncFavorites: (slugs: string[]) => Promise<string[]>;
  toggleFavorite: (slug: string) => Promise<{ favorited: boolean; next: string[] }>;
  logout: () => Promise<void>;
}

const mapError = (code: string | undefined): string => {
  const m: Record<string, string> = {
    INVALID_EMAIL: 'auth:err-invalid-email',
    PASSWORD_TOO_SHORT: 'auth:err-password-short',
    PASSWORD_TOO_LONG: 'auth:err-password-long',
    EMAIL_EXISTS: 'auth:err-email-exists',
    INVALID_CREDENTIALS: 'auth:err-credentials',
    WRONG_PROVIDER: 'auth:err-wrong-provider',
    BANNED: 'auth:err-banned',
    RATE_LIMITED: 'auth:err-rate-limited',
    TIMEOUT: 'auth:err-timeout',
    NETWORK: 'auth:err-network',
    MISSING_AUTH: 'auth:err-missing-auth',
    INVALID_AUTH: 'auth:err-invalid-auth',
    BAD_SUBJECT: 'auth:err-invalid-auth',
    USER_GONE: 'auth:err-user-gone',
    BAD_BODY: 'auth:err-generic',
    INVALID_SLUG: 'auth:err-generic',
    BAD_JSON: 'auth:err-server',
    GOOGLE_NOT_CONFIGURED: 'auth:err-google-off',
    OAUTH_COMING_SOON: 'auth:err-google-soon',
    HTTP_400: 'auth:err-generic',
    HTTP_401: 'auth:err-credentials',
    HTTP_403: 'auth:err-banned',
    HTTP_409: 'auth:err-email-exists',
    HTTP_429: 'auth:err-rate-limited',
    HTTP_500: 'auth:err-server',
  };
  if (!code) return 'auth:err-generic';
  return m[code] || 'auth:err-generic';
};

const getPrefStore = () => {
  if (typeof window === 'undefined') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const m = require('./preferences');
    return (m.usePreferencesStore as typeof import('./preferences').usePreferencesStore) || null;
  } catch {
    return null;
  }
};

const applyServerFavoritesToLocal = (serverSlugs: string[]) => {
  const pref = getPrefStore();
  if (!pref) return;
  try {
    const s = pref.getState() as any;
    const local: Array<{ slug?: string; id?: string }> = (s.favoriteTools || []) as any;
    const serverSet = new Set(serverSlugs);
    const localBySlug = new Map<string, any>();
    (local || []).forEach((t: any) => {
      const key = t.slug || t.id;
      if (key) localBySlug.set(key, t);
    });
    const localSlugs = (local || []).map((t: any) => t.slug || t.id).filter(Boolean) as string[];
    const mergedSlugs = Array.from(new Set([...serverSlugs, ...localSlugs]));
    const merged = mergedSlugs.map((slug) => localBySlug.get(slug) || { slug });
    if (typeof s.setFavoriteTools === 'function' && JSON.stringify(merged) !== JSON.stringify(local)) {
      s.setFavoriteTools(merged as any);
    }
  } catch { /* ignore */ }
};

const localFavoritesAsSlugs = (): string[] => {
  const pref = getPrefStore();
  if (!pref) return [];
  try {
    const list = (pref.getState() as any).favoriteTools || [];
    return (list as Array<{ slug?: string; id?: string }>)
      .map((t) => t.slug || t.id).filter(Boolean) as string[];
  } catch {
    return [];
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'guest',
      user: null,
      token: '',
      favorites: [],
      modalOpen: false,
      modalMode: 'login',
      lastError: null,
      hydrating: false,

      setModal: (open, mode) => {
        set({ modalOpen: open, modalMode: mode ?? get().modalMode, lastError: null });
        if (open) {
          window.dispatchEvent(new CustomEvent('close-all-overlay-panels', { detail: { except: 'header' } }));
        }
      },
      setMode: (mode) => set({ modalMode: mode, lastError: null }),

      hydrateFromStorage: () => {
        if (get().hydrating) return;
        set({ hydrating: true });
        try {
          const t = authApi.readStoredToken();
          const u = authApi.readStoredUser();
          if (t && u) {
            set({ status: 'authed', user: u, token: t });
            // Background refresh: refresh me + favorites
            (async () => {
              try {
                await get().refreshMe();
              } catch { /* ignore */ }
              try {
                await get().fetchFavorites();
              } catch { /* ignore */ }
            })();
          } else {
            set({ status: 'guest', user: null, token: '' });
          }
        } finally {
          set({ hydrating: false });
        }
      },

      register: async (data) => {
        set({ status: 'loading', lastError: null });
        const r = await authApi.register(data);
        if (r.ok && r.token && r.user) {
          authApi.persistAuth(r.token, r.user);
          set({ status: 'authed', user: r.user, token: r.token, modalOpen: false });
          // Merge local favorites into new account
          (async () => {
            try {
              const local = localFavoritesAsSlugs();
              if (local.length > 0) {
                await get().syncFavorites(local);
              } else {
                await get().fetchFavorites();
              }
            } catch { /* best-effort */ }
          })();
          return { ok: true };
        }
        const code = mapError(r.error);
        set({ status: 'guest', lastError: code });
        return { ok: false, error: code };
      },

      login: async (data) => {
        set({ status: 'loading', lastError: null });
        const r = await authApi.login(data);
        if (r.ok && r.token && r.user) {
          authApi.persistAuth(r.token, r.user);
          set({ status: 'authed', user: r.user, token: r.token, modalOpen: false });
          // Merge local favorites → server on login (progressive sync)
          (async () => {
            try {
              const local = localFavoritesAsSlugs();
              if (local.length > 0) {
                await get().syncFavorites(local);
              } else {
                await get().fetchFavorites();
              }
            } catch { /* best-effort */ }
          })();
          return { ok: true };
        }
        const code = mapError(r.error);
        set({ status: 'guest', lastError: code });
        return { ok: false, error: code };
      },

      refreshMe: async () => {
        if (!authApi.readStoredToken()) return { ok: false };
        const r = await authApi.me();
        if (r.ok && r.user) {
          authApi.persistAuth(authApi.readStoredToken(), r.user);
          set({ status: 'authed', user: r.user });
          return { ok: true };
        }
        authApi.clearStored();
        set({ status: 'guest', user: null, token: '' });
        return { ok: false };
      },

      fetchFavorites: async () => {
        const r: FavResult = await authApi.getFavorites();
        const slugs = r.favorites ?? [];
        set({ favorites: slugs });
        applyServerFavoritesToLocal(slugs);
        return slugs;
      },

      syncFavorites: async (slugs) => {
        const r = await authApi.syncFavorites(slugs);
        const next = r.favorites ?? [];
        set({ favorites: next });
        applyServerFavoritesToLocal(next);
        return next;
      },

      toggleFavorite: async (slug) => {
        const r = await authApi.toggleFavorite({ tool_slug: slug });
        const next = r.favorites ?? [];
        set({ favorites: next });
        applyServerFavoritesToLocal(next);
        return { favorited: !!r.favorited, next };
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          /* ignore */
        }
        authApi.clearStored();
        set({ status: 'guest', user: null, token: '', favorites: [] });
      },
    }),
    {
      name: 'korelyy-auth-state-v1',
      partialize: (s) => ({ status: s.status === 'loading' ? 'guest' : s.status, favorites: s.favorites } as Partial<AuthState>),
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        try {
          const t = '__zauth_probe__';
          localStorage.setItem(t, '1');
          localStorage.removeItem(t);
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

// Multi-tab sync: keep other tabs consistent on sign-in / sign-out
if (typeof window !== 'undefined') {
  try {
    const bc = new BroadcastChannel('korelyy-auth-v1');
    useAuthStore.subscribe((state) => {
      try {
        bc.postMessage({ status: state.status, userId: state.user?.id || null });
      } catch { /* ignore */ }
    });
    bc.onmessage = (e) => {
      const cur = useAuthStore.getState();
      const incoming = e.data as { status?: AuthStatus; userId?: string | null };
      if (incoming.status === 'guest' && cur.status !== 'guest') {
        void cur.logout();
      } else if (incoming.status === 'authed' && cur.status === 'guest') {
        cur.hydrateFromStorage();
      }
    };
  } catch { /* old browsers */ }
}

// Dev-only debug hook: expose store to window for browser integration testing
if (typeof window !== 'undefined') {
  try {
    const w = window as unknown as Record<string, unknown>;
    if (!w.__KORELYY_AUTH_STORE__) {
      w.__KORELYY_AUTH_STORE__ = useAuthStore;
    }
    if (!w.__korelyyMockSignIn) {
      w.__korelyyMockSignIn = (opts?: { email?: string; name?: string; plan?: 'free' | 'pro' }) => {
        const email = opts?.email || 'mock@korelyy.com';
        const display_name = opts?.name || email.split('@')[0];
        const plan = opts?.plan || 'free';
        useAuthStore.setState({
          status: 'authed',
          user: {
            id: 'mock-user-' + Math.random().toString(36).slice(2, 9),
            email,
            email_verified: false,
            display_name,
            plan,
            locale: 'zh',
            auth_provider: 'email' as const,
            created_at: Date.now() - 86400000,
          },
          token: 'dev-mock-token-' + Math.random().toString(36).slice(2),
          favorites: [],
          hydrating: false,
          lastError: null,
        });
        return { ok: true, email };
      };
    }
    if (!w.__korelyyMockSignOut) {
      w.__korelyyMockSignOut = () => {
        useAuthStore.getState().logout();
        return { ok: true };
      };
    }
  } catch { /* ignore */ }
}
