/// <reference types="@cloudflare/workers-types" />
// Korelyy Auth API — Cloudflare Pages Functions Advanced Mode
// Path: functions/api/auth/[[path]].ts
// 统一部署：pnpm run deploy 时 Pages Functions 自动打包
// 无需单独部署 Worker 项目，解决了 Pages Functions vs Worker Route 优先级冲突问题
//
// 生产环境 Bindings 配置（Pages Dashboard → Settings → Functions）：
//   D1 Bindings (production):
//     DB  →  korelyy-users  (id: 8127d06b-19d6-4b9a-aaf7-c6d74fb2c2c6)
//
//   Environment Variables (production):
//     JWT_ISSUER              = korelyy.com
//     ACCESS_TOKEN_TTL_SEC    = 604800
//     (可选) DEBUG_AUTH_ENABLED = 1      (仅排查用，平时保持关闭)
//
//   Secrets (生产加密变量):
//     JWT_SECRET        = <64字节以上随机字符串，和之前Auth Worker一致>
//     BCRYPT_PEPPER     = <可选，空字符串即可，和之前Auth Worker一致>
//     (可选) DEBUG_AUTH_TOKEN  = <32字节随机管理Token，调试用>

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  BCRYPT_PEPPER: string;
  JWT_ISSUER?: string;
  ACCESS_TOKEN_TTL_SEC?: string;
  GOOGLE_OAUTH_CLIENT_ID?: string;
  DEBUG_AUTH_ENABLED?: string;
  DEBUG_AUTH_TOKEN?: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  const rnd = (n: number) =>
    Array.from(crypto.getRandomValues(new Uint8Array(n)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  return `${rnd(4)}-${rnd(2)}-4${rnd(1).slice(1)}-${(parseInt(rnd(1), 16) & 0x3f) | 0x80}${rnd(1).slice(1)}-${rnd(6)}`;
}

function normalizeEmail(email: string): string {
  const [local, domain] = email.trim().toLowerCase().split('@');
  if (!local || !domain) return email.trim().toLowerCase();
  const noPlus = local.split('+')[0];
  const noDot = noPlus.replace(/\./g, '');
  return `${noDot}@${domain}`;
}

function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const re = /^[^\s@"(),:;<>[\]\\]+@[^\s@"(),:;<>[\]\\]+\.[^\s@"(),:;<>[\]\\]{2,}$/;
  if (!re.test(email)) return false;
  const [, domain] = email.split('@');
  return !!domain && domain.includes('.');
}

const PBKDF2_ITER = 65536;
const PBKDF2_SALT_BYTES = 16;
const PBKDF2_HASH_BYTES = 32;

async function hashPassword(password: string, pepper = ''): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(PBKDF2_SALT_BYTES));
  const base = new TextEncoder().encode(password + pepper);
  const salted = new Uint8Array(base.length + salt.length);
  salted.set(base, 0);
  salted.set(salt, base.length);
  const pbkdf2Salt = new Uint8Array(4);
  crypto.getRandomValues(pbkdf2Salt);
  const key = await crypto.subtle.importKey(
    'raw',
    salted,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: pbkdf2Salt, iterations: PBKDF2_ITER, hash: 'SHA-256' },
    key,
    PBKDF2_HASH_BYTES * 8
  );
  const hash = new Uint8Array(bits);
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');
  const iterSaltHex = Array.from(pbkdf2Salt).map((b) => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(hash).map((b) => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2_sha256$${PBKDF2_ITER}$${saltHex}:${iterSaltHex}$${hashHex}`;
}

async function verifyPassword(password: string, stored: string, pepper = ''): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4) return false;
  const [, iterStr, saltCombined, hashHex] = parts;
  const iter = parseInt(iterStr, 10) || 0;
  if (iter < 1000) return false;
  const [saltHex, pbkdfSaltHex] = saltCombined.split(':');
  if (!saltHex) return false;
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)!.map((x) => parseInt(x, 16))
  );
  const pbkdfSalt = pbkdfSaltHex
    ? new Uint8Array(pbkdfSaltHex.match(/.{1,2}/g)!.map((x) => parseInt(x, 16)))
    : new Uint8Array(0);
  const expected = new Uint8Array(
    hashHex.match(/.{1,2}/g)!.map((x) => parseInt(x, 16))
  );
  const base = new TextEncoder().encode(password + pepper);
  const salted = new Uint8Array(base.length + salt.length);
  salted.set(base, 0);
  salted.set(salt, base.length);
  const key = await crypto.subtle.importKey(
    'raw',
    salted,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: pbkdfSalt, iterations: iter, hash: 'SHA-256' },
    key,
    PBKDF2_HASH_BYTES * 8
  );
  const actual = new Uint8Array(bits);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

function b64Url(buf: ArrayBuffer | Uint8Array): string {
  const u8 = buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf;
  let bin = '';
  for (let i = 0; i < u8.byteLength; i++) bin += String.fromCharCode(u8[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64UrlDecode(s: string): Uint8Array {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/');
  const full = pad + '='.repeat((4 - (pad.length % 4)) % 4);
  const bin = atob(full);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function importJwtKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signJwt(payload: any, secret: string, ttlSec: number, issuer = 'korelyy.com'): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    iss: issuer,
    sub: payload.sub,
    iat: now,
    exp: now + ttlSec,
    aud: 'korelyy-client',
    ...payload.claims,
  };
  const enc = (s: string) => b64Url(new TextEncoder().encode(s));
  const data = `${enc(JSON.stringify(header))}.${enc(JSON.stringify(body))}`;
  const key = await importJwtKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${b64Url(sig)}`;
}

async function verifyJwt(token: string, secret: string, issuer = 'korelyy.com'): Promise<any | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headB64, bodyB64, sigB64] = parts;
  try {
    const header = JSON.parse(new TextDecoder().decode(b64UrlDecode(headB64)));
    if (header.alg !== 'HS256') return null;
    const key = await importJwtKey(secret);
    const data = `${headB64}.${bodyB64}`;
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      b64UrlDecode(sigB64),
      new TextEncoder().encode(data)
    );
    if (!ok) return null;
    const body = JSON.parse(new TextDecoder().decode(b64UrlDecode(bodyB64)));
    if (body.iss !== issuer) return null;
    if (body.aud !== 'korelyy-client') return null;
    const now = Math.floor(Date.now() / 1000);
    if (body.exp && body.exp < now) return null;
    if (body.nbf && body.nbf > now) return null;
    return body;
  } catch {
    return null;
  }
}

interface Bucket { count: number; resetAt: number }
const rateBuckets = new Map<string, Bucket>();

function rateLimit(ip: string, key: string, max: number, windowSec: number): boolean {
  const now = Date.now();
  const id = `${key}:${ip}`;
  const b = rateBuckets.get(id);
  if (!b || b.resetAt < now) {
    rateBuckets.set(id, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  if (b.count >= max) return false;
  b.count += 1;
  return true;
}

function json<T>(data: T, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

function cors(origin: string | null): Record<string, string> {
  const allowed = (o: string) =>
    /^https:\/\/(www\.)?korelyy\.com$/.test(o) ||
    /^https:\/\/[a-z0-9-]+\.korelyy-tools\.pages\.dev$/.test(o) ||
    o.startsWith('http://localhost:') ||
    o.startsWith('http://127.0.0.1:');
  const o = origin && allowed(origin) ? origin : 'https://korelyy.com';
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Requested-With, Accept-Language',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin, Accept-Encoding',
  };
}

function readClientIP(request: Request, env: Env, ctx: ExecutionContext): string {
  const fwd = request.headers.get('CF-Connecting-IP');
  if (fwd) return fwd;
  const xff = request.headers.get('X-Forwarded-For');
  if (xff) return xff.split(',')[0].trim();
  return 'unknown';
}

function readBearer(request: Request): string | null {
  const h = request.headers.get('Authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

async function authenticate(request: Request, env: Env): Promise<{ uid: string | null; error?: Response }> {
  const token = readBearer(request);
  if (!token) return { uid: null, error: json({ ok: false, error: 'MISSING_AUTH' }, 401) };
  const claims = await verifyJwt(token, env.JWT_SECRET, env.JWT_ISSUER || 'korelyy.com');
  if (!claims) return { uid: null, error: json({ ok: false, error: 'INVALID_AUTH' }, 401) };
  if (!claims.sub || !UUID_RE.test(claims.sub)) return { uid: null, error: json({ ok: false, error: 'BAD_SUBJECT' }, 401) };
  const user = await env.DB.prepare('SELECT id, is_banned FROM users WHERE id = ?').bind(claims.sub).first<any>();
  if (!user) return { uid: null, error: json({ ok: false, error: 'USER_GONE' }, 401) };
  if (user.is_banned === 1) return { uid: null, error: json({ ok: false, error: 'BANNED' }, 403) };
  return { uid: claims.sub };
}

async function handleHealth(env: Env): Promise<Response> {
  let dbOk = false;
  try {
    const r = await env.DB.prepare('SELECT 1 AS x').first<any>();
    dbOk = !!r;
  } catch (_) {
    dbOk = false;
  }
  return json({
    ok: true,
    service: 'korelyy-auth-api',
    version: '1.0.0-pages-fn',
    db_connected: dbOk,
    pbkdf2_iter: PBKDF2_ITER,
    server_time: Math.floor(Date.now() / 1000),
  });
}

async function handleRegister(request: Request, env: Env, ip: string): Promise<Response> {
  if (!rateLimit(ip, 'auth:register', 10, 600)) return json({ ok: false, error: 'RATE_LIMITED' }, 429);
  const body = (await request.json().catch(() => null)) as any;
  if (!body) return json({ ok: false, error: 'BAD_BODY' }, 400);
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const locale = typeof body.locale === 'string' && ['en', 'zh', 'es', 'hi', 'fr', 'ar'].includes(body.locale) ? body.locale : 'en';
  if (!isValidEmail(email)) return json({ ok: false, error: 'INVALID_EMAIL' }, 400);
  if (password.length < 8) return json({ ok: false, error: 'PASSWORD_TOO_SHORT' }, 400);
  if (password.length > 128) return json({ ok: false, error: 'PASSWORD_TOO_LONG' }, 400);
  const emailNorm = normalizeEmail(email);
  const exists = await env.DB.prepare('SELECT id FROM users WHERE email_normalized = ?').bind(emailNorm).first<any>();
  if (exists) return json({ ok: false, error: 'EMAIL_EXISTS' }, 409);
  const id = uid();
  const now = Math.floor(Date.now() / 1000);
  const pwHash = await hashPassword(password, env.BCRYPT_PEPPER || '');
  const displayName = email.split('@')[0].slice(0, 32);
  await env.DB
    .prepare(
      'INSERT INTO users (id, email, email_normalized, password_hash, display_name, locale, auth_provider, created_at, updated_at, last_login_at, last_login_ip) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    )
    .bind(id, email, emailNorm, pwHash, displayName, locale, 'email', now, now, now, ip)
    .run();
  const ttl = parseInt(env.ACCESS_TOKEN_TTL_SEC || '604800', 10);
  const token = await signJwt({ sub: id, claims: { prv: 'email' } }, env.JWT_SECRET, ttl, env.JWT_ISSUER || 'korelyy.com');
  return json({ ok: true, token, user: mePayload(id, email, displayName, locale, 'email', now, 'free') });
}

async function handleLogin(request: Request, env: Env, ip: string): Promise<Response> {
  if (!rateLimit(ip, 'auth:login', 20, 600)) return json({ ok: false, error: 'RATE_LIMITED' }, 429);
  const body = (await request.json().catch(() => null)) as any;
  if (!body) return json({ ok: false, error: 'BAD_BODY' }, 400);
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!isValidEmail(email) || !password) return json({ ok: false, error: 'INVALID_CREDENTIALS' }, 401);
  const emailNorm = normalizeEmail(email);
  const row = await env.DB
    .prepare('SELECT id, email, password_hash, display_name, locale, auth_provider, created_at, subscription_tier, is_banned FROM users WHERE email_normalized = ?')
    .bind(emailNorm)
    .first<any>();
  if (!row) {
    await verifyPassword('dummy-password', 'pbkdf2_sha256$120000$0000000000000000$a'.padEnd(100, '0'));
    return json({ ok: false, error: 'INVALID_CREDENTIALS' }, 401);
  }
  if (row.is_banned === 1) return json({ ok: false, error: 'BANNED' }, 403);
  if (row.auth_provider !== 'email') return json({ ok: false, error: 'WRONG_PROVIDER' }, 400);
  const ok = await verifyPassword(password, row.password_hash, env.BCRYPT_PEPPER || '');
  if (!ok) return json({ ok: false, error: 'INVALID_CREDENTIALS' }, 401);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare('UPDATE users SET last_login_at = ?, last_login_ip = ?, updated_at = ? WHERE id = ?').bind(now, ip, now, row.id).run();
  const ttl = parseInt(env.ACCESS_TOKEN_TTL_SEC || '604800', 10);
  const token = await signJwt({ sub: row.id, claims: { prv: 'email' } }, env.JWT_SECRET, ttl, env.JWT_ISSUER || 'korelyy.com');
  return json({ ok: true, token, user: mePayload(row.id, row.email, row.display_name, row.locale, row.auth_provider, row.created_at, row.subscription_tier) });
}

async function handleMe(request: Request, env: Env): Promise<Response> {
  const { uid, error } = await authenticate(request, env);
  if (!uid) return error!;
  const u = await env.DB
    .prepare('SELECT id, email, display_name, locale, auth_provider, created_at, subscription_tier, email_verified_at FROM users WHERE id = ?')
    .bind(uid)
    .first<any>();
  if (!u) return json({ ok: false, error: 'USER_GONE' }, 404);
  return json({ ok: true, user: mePayload(u.id, u.email, u.display_name, u.locale, u.auth_provider, u.created_at, u.subscription_tier, !!u.email_verified_at) });
}

function mePayload(id: string, email: string, display_name: string | null, locale: string, provider: string, createdAt: number, tier: string, emailVerified = false): any {
  return {
    id,
    email,
    displayName: display_name || email.split('@')[0],
    locale: locale || 'en',
    provider,
    createdAt,
    tier,
    emailVerified,
  };
}

async function handleLogout(): Promise<Response> {
  return json({ ok: true, message: 'LOGGED_OUT' });
}

async function getFavorites(env: Env, uid: string): Promise<Response> {
  const rows = await env.DB
    .prepare('SELECT tool_slug, tool_id, favorited_at, source FROM favorites WHERE user_id = ? ORDER BY favorited_at DESC')
    .bind(uid)
    .all<any>();
  return json({ ok: true, items: rows.results });
}

async function toggleFavorite(env: Env, uid: string, body: any): Promise<Response> {
  const slug = typeof body?.tool_slug === 'string' ? body.tool_slug.trim() : '';
  if (!slug || slug.length > 120) return json({ ok: false, error: 'INVALID_SLUG' }, 400);
  const existing = await env.DB.prepare('SELECT user_id FROM favorites WHERE user_id = ? AND tool_slug = ?').bind(uid, slug).first<any>();
  const now = Math.floor(Date.now() / 1000);
  if (existing) {
    await env.DB.prepare('DELETE FROM favorites WHERE user_id = ? AND tool_slug = ?').bind(uid, slug).run();
    return json({ ok: true, favorited: false });
  } else {
    await env.DB.prepare('INSERT OR IGNORE INTO favorites (user_id, tool_slug, tool_id, favorited_at, source) VALUES (?,?,?,?,?)').bind(uid, slug, body?.tool_id || null, now, body?.source || 'manual').run();
    return json({ ok: true, favorited: true });
  }
}

async function syncFavoritesBatch(env: Env, uid: string, body: any): Promise<Response> {
  if (!body || !Array.isArray(body.items)) return json({ ok: false, error: 'BAD_BODY' }, 400);
  const now = Math.floor(Date.now() / 1000);
  const stmt = env.DB.prepare('INSERT OR IGNORE INTO favorites (user_id, tool_slug, tool_id, favorited_at, source) VALUES (?,?,?,?,?)');
  const batch: D1PreparedStatement[] = [];
  for (const it of body.items.slice(0, 500)) {
    const slug = typeof it?.tool_slug === 'string' ? it.tool_slug.trim() : '';
    if (!slug || slug.length > 120) continue;
    batch.push(stmt.bind(uid, slug, it?.tool_id || null, typeof it.favorited_at === 'number' ? it.favorited_at : now, it?.source || 'migrate'));
  }
  if (batch.length) await env.DB.batch(batch);
  return getFavorites(env, uid);
}

async function handleGoogleAuth(request: Request, env: Env, ip: string): Promise<Response> {
  if (!env.GOOGLE_OAUTH_CLIENT_ID) return json({ ok: false, error: 'GOOGLE_NOT_CONFIGURED' }, 501);
  return json({ ok: false, error: 'OAUTH_COMING_SOON' }, 501);
}

// ============== Pages Functions Advanced Mode ==============
// 用法和 Cloudflare Workers 完全一致：
//   export default { fetch(request, env, ctx) }
// Pages 会根据文件路径 functions/api/auth/[[path]].ts 自动把
//   所有 /api/auth/* 请求路由到这里，其它请求继续正常 Pages 静态路由
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin');
    const corsH = cors(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsH });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/g, '');
    const ip = readClientIP(request, env, ctx);

    try {
      // ====== 公开端点（无鉴权）—— 必须在 authedPrefix 检查之前 ======
      if (path === '/api/auth/health' && request.method === 'GET') {
        return jsonWrap(await handleHealth(env), corsH);
      }
      if (path === '/api/auth/register' && request.method === 'POST') return jsonWrap(await handleRegister(request, env, ip), corsH);
      if (path === '/api/auth/login' && request.method === 'POST') return jsonWrap(await handleLogin(request, env, ip), corsH);
      if (path === '/api/auth/logout' && (request.method === 'POST' || request.method === 'GET')) return jsonWrap(await handleLogout(), corsH);
      if (path === '/api/auth/google' && request.method === 'POST') return jsonWrap(await handleGoogleAuth(request, env, ip), corsH);

      // DEBUG endpoint (production hardened: env guard + admin token)
      if (path === '/api/auth/debug/env' && request.method === 'GET') {
        if (!(env as any).DEBUG_AUTH_ENABLED) {
          return jsonWrap(json({ ok: false, error: 'DEBUG_DISABLED' }, 404), corsH);
        }
        const adminToken = (env as any).DEBUG_AUTH_TOKEN;
        const queryToken = url.searchParams.get('token');
        const headerToken = (request.headers.get('X-Debug-Token') || '').trim();
        if (adminToken && adminToken.length >= 16) {
          const provided = queryToken || headerToken;
          if (!provided || provided !== adminToken) {
            return jsonWrap(json({ ok: false, error: 'DEBUG_TOKEN_REQUIRED' }, 403), corsH);
          }
        }
        async function sha256Prefix(s: string) {
          if (!s) return '';
          const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
          return Array.from(new Uint8Array(buf)).slice(0, 4).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        const diag: any = {
          ok: true,
          pbkdf2_iter: PBKDF2_ITER,
          pbkdf2_salt_bytes: PBKDF2_SALT_BYTES,
          jwt_issuer: env.JWT_ISSUER || '',
          access_ttl_sec: env.ACCESS_TOKEN_TTL_SEC || '',
          db_binding: typeof env.DB,
          db_prepare_ok: false,
          jwt_secret: {
            type: typeof env.JWT_SECRET,
            present: !!env.JWT_SECRET,
            length: env.JWT_SECRET ? env.JWT_SECRET.length : 0,
            sha256_prefix: await sha256Prefix(env.JWT_SECRET || ''),
          },
          bcrypt_pepper: {
            type: typeof env.BCRYPT_PEPPER,
            present: !!env.BCRYPT_PEPPER,
            length: env.BCRYPT_PEPPER ? env.BCRYPT_PEPPER.length : 0,
            sha256_prefix: await sha256Prefix(env.BCRYPT_PEPPER || ''),
          },
          google_client_id: {
            type: typeof env.GOOGLE_OAUTH_CLIENT_ID,
            present: !!env.GOOGLE_OAUTH_CLIENT_ID,
            length: env.GOOGLE_OAUTH_CLIENT_ID ? env.GOOGLE_OAUTH_CLIENT_ID.length : 0,
          },
        };
        try {
          await env.DB.prepare('SELECT 1');
          diag.db_prepare_ok = true;
        } catch (e: any) {
          diag.db_prepare_err = e?.message || String(e);
        }
        try {
          const r = await env.DB.prepare('SELECT 1 AS x').first<any>();
          diag.db_first_ok = !!r;
        } catch (e: any) {
          diag.db_first_err = e?.message || String(e);
        }
        return jsonWrap(json(diag), corsH);
      }

      // ====== 需要鉴权的端点（收藏夹 + /me） ======
      const authedPrefix = '/api/auth';
      if (path.startsWith(authedPrefix)) {
        const { uid, error } = await authenticate(request, env);
        if (!uid) return jsonWrap(error!, corsH);
        if (path === '/api/auth/me' && request.method === 'GET') return jsonWrap(await handleMe(request, env), corsH);
        if (path === '/api/auth/favorites' && request.method === 'GET') return jsonWrap(await getFavorites(env, uid), corsH);
        if (path === '/api/auth/favorites/toggle' && request.method === 'POST') {
          const body = (await request.json().catch(() => null)) as any;
          return jsonWrap(await toggleFavorite(env, uid, body), corsH);
        }
        if (path === '/api/auth/favorites/sync' && request.method === 'POST') {
          const body = (await request.json().catch(() => null)) as any;
          return jsonWrap(await syncFavoritesBatch(env, uid, body), corsH);
        }
        return jsonWrap(json({ ok: false, error: 'NOT_FOUND' }, 404), corsH);
      }

      return jsonWrap(json({ ok: false, error: 'NOT_FOUND', doc: 'https://korelyy.com/api/auth/health' }, 404), corsH);
    } catch (e: any) {
      console.error('[auth-api error]', e?.stack || e?.message || String(e));
      return jsonWrap(json({ ok: false, error: 'INTERNAL_ERROR' }, 500), corsH);
    }
  },
};

function jsonWrap(r: Response, corsH: Record<string, string>): Response {
  const merged = new Headers(r.headers);
  for (const [k, v] of Object.entries(corsH)) merged.set(k, v);
  return new Response(r.body, { status: r.status, headers: merged });
}
