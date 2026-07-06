export interface AuthUser {
  id: string;
  email: string;
  email_verified: boolean;
  display_name?: string | null;
  avatar_url?: string | null;
  locale?: 'en' | 'zh' | 'es' | 'hi' | 'fr' | 'ar' | string | null;
  auth_provider?: 'email' | 'google' | string | null;
  plan?: 'free' | 'pro' | 'team' | string;
  created_at?: number;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  access_token?: string;
  token?: string;
  user?: AuthUser;
}

export interface FavItem {
  tool_slug: string;
  tool_id?: string | null;
  favorited_at: number;
  source?: string;
}

export interface FavResult<T = unknown> {
  ok: boolean;
  error?: string;
  items?: FavItem[];
  favorites?: string[];
  favorited?: boolean;
  data?: T;
}

// ============================================================
// 注意：本地开发走 Next.js rewrites（next.config.mjs），
// 将 /api/auth/* 代理到 http://localhost:8787/api/auth/*；
// 生产环境由 Cloudflare 路由规则（wrangler.auth.jsonc -> routes）接管。
// 因此本地和线上都使用相对路径，避免 CORS 和端口差异问题。
// 如需临时直连其他地址（如 staging Worker），用：
//   setApiBaseOverride('https://staging.korelyy.com')
// 或浏览器 localStorage.setItem('korelyy_auth_api_base_v1', '...')
// ============================================================
const DEFAULT_BASE = '';

const BASE_KEY = 'korelyy_auth_api_base_v1';
const TOKEN_KEY = 'korelyy_auth_token_v1';
const LAST_USER_KEY = 'korelyy_auth_last_user_v1';

function getBaseOverride(): string {
  try {
    if (typeof window === 'undefined') return DEFAULT_BASE;
    const v = window.localStorage.getItem(BASE_KEY);
    return v || DEFAULT_BASE;
  } catch {
    return DEFAULT_BASE;
  }
}

function safeReadToken(): string {
  try {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function safeWriteToken(v: string) {
  try {
    if (typeof window === 'undefined') return;
    if (v) window.localStorage.setItem(TOKEN_KEY, v);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

function safeReadUser(): AuthUser | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(LAST_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function safeWriteUser(u: AuthUser | null) {
  try {
    if (typeof window === 'undefined') return;
    if (u) window.localStorage.setItem(LAST_USER_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(LAST_USER_KEY);
  } catch {
    /* ignore */
  }
}

export function setApiBaseOverride(base: string) {
  try {
    if (typeof window === 'undefined') return;
    if (base) window.localStorage.setItem(BASE_KEY, base);
    else window.localStorage.removeItem(BASE_KEY);
  } catch {
    /* ignore */
  }
}

export function clearAuthStorage() {
  safeWriteToken('');
  safeWriteUser(null);
}

// Normalize backend user shape → store-consumable AuthUser (snake_case)
const normalizeUser = (u: any): AuthUser | undefined => {
  if (!u || typeof u !== 'object') return undefined;
  return {
    id: u.id,
    email: u.email || u.email_normalized || '',
    email_verified: !!u.email_verified || !!u.emailVerified,
    display_name: u.display_name ?? u.displayName ?? u.name ?? null,
    avatar_url: u.avatar_url ?? u.avatarUrl ?? u.picture ?? u.avatar ?? null,
    locale: u.locale ?? u.lang ?? null,
    auth_provider: u.auth_provider ?? u.provider ?? null,
    plan: u.plan ?? u.tier ?? 'free',
    created_at: u.created_at ?? u.createdAt ?? undefined,
  };
};

const itemsToSlugs = (items?: FavItem[] | null): string[] =>
  (items || []).map((i) => i.tool_slug).filter(Boolean);

async function apiCall<T = any>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: any,
  opts: { needAuth?: boolean; timeoutMs?: number } = {}
): Promise<T> {
  const base = getBaseOverride();
  const needAuth = opts.needAuth !== false;
  const token = needAuth ? safeReadToken() : '';
  // Next.js trailingSlash: true 强制重定向无尾斜杠 URL 到 / 结尾，
  // 对 POST 会导致 308 后变 GET，因此我们统一补尾斜杠。
  const [p, q] = path.split('?');
  const normalizedPath = p.replace(/\/+$/, '') + '/' + (q ? `?${q}` : '');
  const url = `${base}${normalizedPath}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs || 15000);

  try {
    const resp = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    }).catch((e) => {
      if (e?.name === 'AbortError') throw new Error('TIMEOUT');
      throw new Error('NETWORK');
    });
    clearTimeout(timeout);
    const text = await resp.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { ok: false, error: 'BAD_JSON' };
    }
    if (!resp.ok && (!data || typeof data.ok === 'undefined')) {
      return { ok: false, error: `HTTP_${resp.status}` } as any;
    }
    return (data || { ok: true }) as T;
  } catch (e: any) {
    clearTimeout(timeout);
    if (e?.message === 'TIMEOUT' || e?.name === 'AbortError') {
      return { ok: false, error: 'TIMEOUT' } as any;
    }
    return { ok: false, error: 'NETWORK' } as any;
  }
}

// ----------
// Public API
// ----------

type RegisterInput = { email: string; password: string; locale: string };
type LoginInput = { email: string; password: string };
type ToggleFavInput = { tool_slug: string; tool_id?: string; source?: string };
type ForgotResult = { ok: boolean; error?: string; reset_token?: string; expires_in?: number; message?: string };
type ResetResult = { ok: boolean; error?: string; message?: string };

export const authApi = {
  readStoredToken: safeReadToken,
  readStoredUser: safeReadUser,
  clearStored: clearAuthStorage,

  async register(data: RegisterInput): Promise<AuthResult> {
    const r: any = await apiCall<any>('POST', '/api/auth/register', data, { needAuth: false });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500' };
    const token = r.access_token || r.token;
    const user = normalizeUser(r.user);
    return { ok: true, token, access_token: token, user };
  },

  async login(data: LoginInput): Promise<AuthResult> {
    const r: any = await apiCall<any>('POST', '/api/auth/login', data, { needAuth: false });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500' };
    const token = r.access_token || r.token;
    const user = normalizeUser(r.user);
    return { ok: true, token, access_token: token, user };
  },

  async loginGoogle(idToken: string, locale?: string): Promise<AuthResult> {
    const payload: any = { idToken };
    if (locale) payload.locale = locale;
    const r: any = await apiCall<any>('POST', '/api/auth/google', payload, { needAuth: false });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500' };
    const token = r.access_token || r.token;
    const user = normalizeUser(r.user);
    return { ok: true, token, access_token: token, user };
  },

  async forgotPassword(email: string): Promise<ForgotResult> {
    const r: any = await apiCall<any>('POST', '/api/auth/password/forgot', { email }, { needAuth: false });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500' };
    return {
      ok: true,
      reset_token: r.reset_token,
      expires_in: r.expires_in,
      message: r.message,
    };
  },

  async resetPassword(token: string, password: string): Promise<ResetResult> {
    const r: any = await apiCall<any>('POST', '/api/auth/password/reset', { token, password }, { needAuth: false });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500' };
    return { ok: true, message: r.message };
  },

  async me(): Promise<AuthResult> {
    const r: any = await apiCall<any>('GET', '/api/auth/me', undefined, { needAuth: true });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_401' };
    const user = normalizeUser(r.user);
    return { ok: true, user };
  },

  async logout(): Promise<AuthResult> {
    clearAuthStorage();
    const r: any = await apiCall<any>('POST', '/api/auth/logout', {}, { needAuth: false });
    return { ok: !!r || true };
  },

  persistAuth(token: string, user: AuthUser) {
    safeWriteToken(token);
    safeWriteUser(user);
  },

  async getFavorites(): Promise<FavResult> {
    const r: any = await apiCall<any>('GET', '/api/auth/favorites', undefined, { needAuth: true });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500' };
    const items = (r.items || r.data || []) as FavItem[];
    const favorites = r.favorites && Array.isArray(r.favorites) ? (r.favorites as string[]) : itemsToSlugs(items);
    return { ok: true, items, favorites };
  },

  async toggleFavorite(body: ToggleFavInput): Promise<FavResult<{ favorited: boolean }>> {
    const r: any = await apiCall<any>('POST', '/api/auth/favorites/toggle', body, { needAuth: true });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500', favorited: false, favorites: [] };
    const items = (r.items || r.data?.items || []) as FavItem[];
    const favorites = r.favorites && Array.isArray(r.favorites) ? (r.favorites as string[]) : itemsToSlugs(items);
    return {
      ok: true,
      favorited: typeof r.favorited === 'boolean' ? r.favorited : favorites.includes(body.tool_slug),
      items,
      favorites,
    } as any;
  },

  // Upload local slugs; backend merges and returns final list
  async syncFavorites(slugs: string[]): Promise<FavResult> {
    const items: Array<{ tool_slug: string; favorited_at: number }> = (slugs || []).filter(Boolean).map((s) => ({
      tool_slug: s,
      favorited_at: Date.now(),
    }));
    const r: any = await apiCall<any>('POST', '/api/auth/favorites/sync', { items }, { needAuth: true });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500' };
    const resultItems = (r.items || r.data || []) as FavItem[];
    const favorites = r.favorites && Array.isArray(r.favorites) ? (r.favorites as string[]) : itemsToSlugs(resultItems);
    return { ok: true, items: resultItems, favorites };
  },

  // Legacy alias kept for callers referencing syncFavoritesBatch
  syncFavoritesBatch(items: Array<{ tool_slug: string; tool_id?: string; favorited_at?: number; source?: string }>): Promise<FavResult> {
    return authApi.syncFavorites(items.map((i) => i.tool_slug));
  },

  async updateProfile(data: { display_name?: string; locale?: string }): Promise<AuthResult> {
    const r: any = await apiCall<any>('POST', '/api/auth/profile/update', data, { needAuth: true });
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500' };
    const user = normalizeUser(r.user);
    if (user) {
      safeWriteUser(user);
    }
    return { ok: true, user };
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<{ ok: boolean; error?: string; message?: string }> {
    const r: any = await apiCall<any>(
      'POST',
      '/api/auth/password/change',
      { old_password: oldPassword, new_password: newPassword },
      { needAuth: true }
    );
    if (!r?.ok) return { ok: false, error: r?.error || 'HTTP_500' };
    return { ok: true, message: r.message };
  },
};
