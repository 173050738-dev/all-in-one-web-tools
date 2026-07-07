import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi, type AuthUser, type FavResult } from '@/lib/auth-api';

export type AuthStatus = 'idle' | 'loading' | 'authed' | 'guest';
export type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  token: string;
  favorites: string[];
  modalOpen: boolean;
  modalMode: AuthMode;
  lastError: string | null;
  lastInfo: string | null;
  hydrating: boolean;
  resetToken: string | null;
  resetExpiresIn: number | null;
  setModal: (open: boolean, mode?: AuthMode) => void;
  setMode: (mode: AuthMode) => void;
  setResetToken: (token: string | null, expiresIn?: number | null) => void;
  setLastInfo: (info: string | null) => void;
  hydrateFromStorage: () => void;
  register: (data: { email: string; password: string; locale: string }) => Promise<{ ok: boolean; error?: string }>;
  login: (data: { email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  loginGoogle: (idToken: string, locale?: string) => Promise<{ ok: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (data: { display_name?: string; locale?: string }) => Promise<{ ok: boolean; error?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
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
    GOOGLE_BAD_TOKEN: 'auth:err-google-bad-token',
    GOOGLE_BAD_ISSUER: 'auth:err-google-bad-token',
    GOOGLE_BAD_AUDIENCE: 'auth:err-google-bad-audience',
    GOOGLE_TOKEN_EXPIRED: 'auth:err-google-token-expired',
    GOOGLE_BAD_PROFILE: 'auth:err-google-bad-profile',
    GOOGLE_POPUP_BLOCKED: 'auth:err-google-popup-blocked',
    GOOGLE_CANCELLED: 'auth:err-google-cancelled',
    MISSING_TOKEN: 'auth:err-reset-missing-token',
    RESET_TOKEN_INVALID: 'auth:err-reset-invalid',
    RESET_TOKEN_USED: 'auth:err-reset-used',
    RESET_TOKEN_EXPIRED: 'auth:err-reset-expired',
    OLD_PASSWORD_REQUIRED: 'auth:err-old-password-required',
    SAME_PASSWORD: 'auth:err-same-password',
    NOT_FOUND: 'auth:err-generic',
    INTERNAL_ERROR: 'auth:err-server',
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

const MIN_PASSWORD_LEN = 8;
const MAX_PASSWORD_LEN = 128;
const _EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const _validEmail = (v: string): boolean => _EMAIL_RE.test((v ?? '').trim());

const _validateLogin = (data: { email: string; password: string }): string | null => {
  if (!data?.email || !data.email.trim()) return 'auth:err-invalid-email';
  if (!_validEmail(data.email)) return 'auth:err-invalid-email';
  if (!data?.password) return 'auth:err-password-short';
  if (data.password.length < MIN_PASSWORD_LEN) return 'auth:err-password-short';
  if (data.password.length > MAX_PASSWORD_LEN) return 'auth:err-password-long';
  return null;
};

const _validateRegister = (data: { email: string; password: string; locale?: string }): string | null => {
  const base = _validateLogin({ email: data?.email ?? '', password: data?.password ?? '' });
  if (base) return base;
  return null;
};

const _validateForgot = (email: string): string | null => {
  if (!email || !email.trim()) return 'auth:err-invalid-email';
  if (!_validEmail(email)) return 'auth:err-invalid-email';
  return null;
};

const _validateReset = (token: string, password: string): string | null => {
  if (!token || !token.trim()) return 'auth:err-reset-missing-token';
  if (!password) return 'auth:err-password-short';
  if (password.length < MIN_PASSWORD_LEN) return 'auth:err-password-short';
  if (password.length > MAX_PASSWORD_LEN) return 'auth:err-password-long';
  return null;
};

const _validateUpdateProfile = (data: { display_name?: string; locale?: string }): string | null => {
  if (typeof data?.display_name === 'string' && data.display_name.trim().length > 64) {
    return 'auth:err-name-too-long';
  }
  if (typeof data?.locale === 'string' && !['en', 'zh', 'es', 'hi', 'fr', 'ar'].includes(data.locale)) {
    return 'auth:err-generic';
  }
  return null;
};

const _validateChangePassword = (oldPassword: string, newPassword: string): string | null => {
  if (!oldPassword) return 'auth:err-old-password-required';
  if (!newPassword) return 'auth:err-password-short';
  if (newPassword.length < MIN_PASSWORD_LEN) return 'auth:err-password-short';
  if (newPassword.length > MAX_PASSWORD_LEN) return 'auth:err-password-long';
  if (oldPassword === newPassword) return 'auth:err-same-password';
  return null;
};

const getFavStore = () => {
  if (typeof window === 'undefined') return null;
  try {
    const m = require('./favorites');
    return (m.useFavoritesStore as typeof import('./favorites').useFavoritesStore) || null;
  } catch {
    return null;
  }
};

const applyServerFavoritesToLocal = (serverSlugs: string[]) => {
  const favStore = getFavStore();
  if (!favStore) return;
  try {
    const s = favStore.getState() as any;
    if (typeof s.mergeFromServer === 'function') {
      s.mergeFromServer(serverSlugs);
    }
  } catch { /* ignore */ }
};

const localFavoritesAsSlugs = (): string[] => {
  const favStore = getFavStore();
  if (!favStore) return [];
  try {
    const s = favStore.getState() as any;
    if (typeof s.getFavoriteSlugs === 'function') {
      return s.getFavoriteSlugs() || [];
    }
    const ids: string[] = (s.favoriteTools || []) as string[];
    return ids.filter(Boolean);
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
      lastInfo: null,
      hydrating: false,
      resetToken: null,
      resetExpiresIn: null,

      setModal: (open, mode) => {
        set({
          modalOpen: open,
          modalMode: mode ?? get().modalMode,
          lastError: null,
          lastInfo: null,
        });
        if (open) {
          window.dispatchEvent(new CustomEvent('close-all-overlay-panels', { detail: { except: 'header' } }));
        }
      },
      setMode: (mode) => set({ modalMode: mode, lastError: null, lastInfo: null }),
      setResetToken: (token, expiresIn = null) => set({ resetToken: token, resetExpiresIn: expiresIn ?? null }),
      setLastInfo: (info) => set({ lastInfo: info }),

      hydrateFromStorage: () => {
        if (get().hydrating) return;
        set({ hydrating: true });
        try {
          const t = authApi.readStoredToken();
          const u = authApi.readStoredUser();
          if (t && u) {
            set({ status: 'authed', user: u, token: t });
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
        const ve = _validateRegister(data);
        if (ve) {
          set({ status: 'guest', lastError: ve, lastInfo: null });
          return { ok: false, error: ve };
        }
        set({ status: 'loading', lastError: null, lastInfo: null });
        const r = await authApi.register(data);
        if (r.ok && r.token && r.user) {
          authApi.persistAuth(r.token, r.user);
          set({ status: 'authed', user: r.user, token: r.token, modalOpen: false, lastInfo: 'auth:register-success' });
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
        const ve = _validateLogin(data);
        if (ve) {
          set({ status: 'guest', lastError: ve, lastInfo: null });
          return { ok: false, error: ve };
        }
        set({ status: 'loading', lastError: null, lastInfo: null });
        const r = await authApi.login(data);
        if (r.ok && r.token && r.user) {
          authApi.persistAuth(r.token, r.user);
          set({ status: 'authed', user: r.user, token: r.token, modalOpen: false, lastInfo: 'auth:login-success' });
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

      loginGoogle: async (idToken, locale) => {
        set({ status: 'loading', lastError: null, lastInfo: null });
        const r = await authApi.loginGoogle(idToken, locale);
        if (r.ok && r.token && r.user) {
          authApi.persistAuth(r.token, r.user);
          set({ status: 'authed', user: r.user, token: r.token, modalOpen: false, lastInfo: 'auth:login-success' });
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

      forgotPassword: async (email) => {
        const ve = _validateForgot(email);
        if (ve) {
          set({ status: 'guest', lastError: ve, lastInfo: null });
          return { ok: false, error: ve };
        }
        set({ status: 'loading', lastError: null, lastInfo: null });
        const r = await authApi.forgotPassword(email);
        if (r.ok) {
          if (r.reset_token) {
            set({ resetToken: r.reset_token, resetExpiresIn: r.expires_in ?? null, lastInfo: 'auth:forgot-token-issued' });
          } else {
            set({ lastInfo: 'auth:forgot-email-sent' });
          }
          set({ status: 'guest' });
          return { ok: true };
        }
        const code = mapError(r.error);
        set({ status: 'guest', lastError: code });
        return { ok: false, error: code };
      },

      resetPassword: async (token, password) => {
        const ve = _validateReset(token, password);
        if (ve) {
          set({ status: 'guest', lastError: ve, lastInfo: null });
          return { ok: false, error: ve };
        }
        set({ status: 'loading', lastError: null, lastInfo: null });
        const r = await authApi.resetPassword(token, password);
        if (r.ok) {
          set({
            status: 'guest',
            modalMode: 'login',
            resetToken: null,
            resetExpiresIn: null,
            lastInfo: 'auth:reset-success',
          });
          return { ok: true };
        }
        const code = mapError(r.error);
        set({ status: 'guest', lastError: code });
        return { ok: false, error: code };
      },

      updateProfile: async (data) => {
        const ve = _validateUpdateProfile(data);
        if (ve) {
          set({ lastError: ve, lastInfo: null });
          return { ok: false, error: ve };
        }
        const cur = get();
        if (cur.status !== 'authed') {
          set({ lastError: 'auth:err-missing-auth', lastInfo: null });
          return { ok: false, error: 'auth:err-missing-auth' };
        }
        set({ lastError: null, lastInfo: null });
        const r = await authApi.updateProfile(data);
        if (r.ok && r.user) {
          set({ user: r.user, lastInfo: 'auth:profile-updated' });
          return { ok: true };
        }
        const code = mapError(r.error);
        set({ lastError: code });
        return { ok: false, error: code };
      },

      changePassword: async (oldPassword, newPassword) => {
        const ve = _validateChangePassword(oldPassword, newPassword);
        if (ve) {
          set({ lastError: ve, lastInfo: null });
          return { ok: false, error: ve };
        }
        const cur = get();
        if (cur.status !== 'authed') {
          set({ lastError: 'auth:err-missing-auth', lastInfo: null });
          return { ok: false, error: 'auth:err-missing-auth' };
        }
        set({ lastError: null, lastInfo: null });
        const r = await authApi.changePassword(oldPassword, newPassword);
        if (r.ok) {
          set({ lastInfo: 'auth:password-changed' });
          return { ok: true };
        }
        const code = mapError(r.error);
        set({ lastError: code });
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
