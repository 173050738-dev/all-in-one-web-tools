/// <reference types="@cloudflare/workers-types" />
// Korelyy Ko-fi Memberships API — Cloudflare Pages Functions
// Path: functions/api/kofi/[[path]].ts
//
// 依赖 Bindings（Pages Dashboard → Settings → Functions）：
//   D1 Bindings (production):
//     DB → korelyy-users（与 auth 共享）
//
//   Secrets：
//     KOFI_ACTIVATION_HMAC_SECRET   → 32+ 字节随机字符串，
//                                      与 scripts/gen-kofi-code.mjs 保持一致
//
//   Environment Variables（可选）：
//     KOFI_MONTHLY_DAYS   → 月卡有效期天数，默认 30
//     KOFI_COMMERCIAL_DAYS → 团队卡有效期天数，默认 365
//     KOFI_LIFETIME_DAYS  → 终身卡有效期天数，默认 36525（100 年）

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  JWT_ISSUER?: string;
  KOFI_ACTIVATION_HMAC_SECRET: string;
  KOFI_VERIFICATION_TOKEN: string;
  KOFI_MONTHLY_DAYS?: string;
  KOFI_COMMERCIAL_DAYS?: string;
  KOFI_LIFETIME_DAYS?: string;
}

const TIER_DURATION_DAYS: Record<string, number> = {
  monthly: 30,
  one_time: 36525,
  lifetime: 36525,
  commercial: 365,
};

const TIER_CODES: Record<string, string> = {
  MN: 'monthly',
  LT: 'one_time',
  TM: 'commercial',
};

const CODE_RE = /^KOFI-([A-Z]{2})-([A-Z0-9]{6})-([A-F0-9]{8})$/;
const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

function ipOf(r: Request): string {
  return r.headers.get('cf-connecting-ip') || r.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0';
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'private, no-store, no-cache, must-revalidate',
      ...headers,
    },
  });
}

function errJson(message: string, status = 400): Response {
  return json({ ok: false, error: message }, status);
}

async function hmacSha256Hex(secret: string, data: string): Promise<string> {
  const keyData = new TextEncoder().encode(secret);
  const msgData = new TextEncoder().encode(data);
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, msgData));
  return Array.from(sig).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyActivationCode(env: Env, code: string): Promise<{ valid: boolean; tier: string; codeId: string }> {
  if (!env.KOFI_ACTIVATION_HMAC_SECRET) return { valid: false, tier: '', codeId: '' };
  const m = code.match(CODE_RE);
  if (!m) return { valid: false, tier: '', codeId: '' };
  const [, tierCode, codeId, mac] = m;
  const tier = TIER_CODES[tierCode];
  if (!tier) return { valid: false, tier: '', codeId: '' };
  const payload = `KOFI-${tierCode}-${codeId}`;
  const expected = (await hmacSha256Hex(env.KOFI_ACTIVATION_HMAC_SECRET, payload)).slice(0, 8).toUpperCase();
  if (expected !== mac.toUpperCase()) return { valid: false, tier: '', codeId: '' };
  return { valid: true, tier, codeId };
}

function tierDurationDays(env: Env, tier: string): number {
  const custom: Record<string, string | undefined> = {
    monthly: env.KOFI_MONTHLY_DAYS,
    commercial: env.KOFI_COMMERCIAL_DAYS,
    one_time: env.KOFI_LIFETIME_DAYS,
    lifetime: env.KOFI_LIFETIME_DAYS,
  };
  if (custom[tier]) {
    const d = parseInt(custom[tier]!, 10);
    if (!Number.isNaN(d) && d > 0) return d;
  }
  return TIER_DURATION_DAYS[tier] || 30;
}

async function ensureTables(db: D1Database): Promise<void> {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS memberships (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        email TEXT,
        tier TEXT NOT NULL,
        activation_code TEXT UNIQUE,
        activation_code_id TEXT,
        tx_id TEXT,
        source TEXT NOT NULL,
        activated_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        ip TEXT,
        notes TEXT
      )`
    )
    .run();
  try {
    await db.prepare(`ALTER TABLE memberships ADD COLUMN activation_code_id TEXT`).run();
  } catch {
    /* 已有列 */
  }
  try {
    await db.prepare(`ALTER TABLE memberships ADD COLUMN email TEXT`).run();
  } catch {
    /* 已有列 */
  }
  try {
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id)`).run();
  } catch {
    /* 已有索引 */
  }
  try {
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_memberships_email ON memberships(email)`).run();
  } catch {
    /* 已有索引 */
  }
  try {
    await db.prepare(`CREATE INDEX IF NOT EXISTS idx_memberships_code ON memberships(activation_code)`).run();
  } catch {
    /* 已有索引 */
  }
}

async function uid(): Promise<string> {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  const rnd = (n: number) =>
    Array.from(crypto.getRandomValues(new Uint8Array(n)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  return `${rnd(4)}-${rnd(2)}-4${rnd(1).slice(1)}-${(parseInt(rnd(1), 16) & 0x3f) | 0x80}${rnd(1).slice(1)}-${rnd(6)}`;
}

function b64UrlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function readBearer(r: Request): string | null {
  const h = r.headers.get('authorization') || '';
  if (h.toLowerCase().startsWith('bearer ')) return h.slice(7).trim();
  const alt = r.headers.get('x-access-token') || '';
  if (alt) return alt.trim();
  return null;
}

async function verifyJwt(token: string, secret: string, issuer?: string): Promise<any | null> {
  try {
    const [h, p, s] = token.split('.');
    if (!h || !p || !s) return null;
    const header = JSON.parse(new TextDecoder().decode(b64UrlDecode(h)));
    const payload = JSON.parse(new TextDecoder().decode(b64UrlDecode(p)));
    if (header.alg !== 'HS256') return null;
    if (issuer && payload.iss && payload.iss !== issuer) return null;
    if (typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) return null;
    const keyData = new TextEncoder().encode(secret);
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const sig = b64UrlDecode(s);
    const msg = new TextEncoder().encode(`${h}.${p}`);
    const ok = await crypto.subtle.verify('HMAC', key, sig, msg);
    return ok ? payload : null;
  } catch {
    return null;
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function authenticate(r: Request, env: Env): Promise<{ uid: string | null; error: Response | null }> {
  const t = readBearer(r);
  if (!t) return { uid: null, error: null };
  const payload = await verifyJwt(t, env.JWT_SECRET, env.JWT_ISSUER || 'korelyy.com');
  if (!payload || !payload.sub || !UUID_RE.test(payload.sub)) return { uid: null, error: null };
  return { uid: payload.sub, error: null };
}

function normalizeEmail(e: string): string {
  const [local, domain] = e.trim().toLowerCase().split('@');
  if (!local || !domain) return e.trim().toLowerCase();
  return `${local.split('+')[0].replace(/\./g, '')}@${domain}`;
}

function isValidEmail(e: string): boolean {
  return /^[^\s@"(),:;<>[\]\\]+@[^\s@"(),:;<>[\]\\]+\.[^\s@"(),:;<>[\]\\]{2,}$/.test(e);
}

async function activeMembershipRowsFor(db: D1Database, where: 'user' | 'email', key: string): Promise<any[]> {
  const now = Math.floor(Date.now() / 1000);
  const sql =
    where === 'user'
      ? `SELECT * FROM memberships WHERE user_id = ? AND expires_at > ? ORDER BY expires_at DESC`
      : `SELECT * FROM memberships WHERE email = ? AND expires_at > ? ORDER BY expires_at DESC`;
  const res = await db.prepare(sql).bind(key, now).all<any>();
  return res.results || [];
}

async function upgradeUserTier(db: D1Database, userId: string | null, membership: any): Promise<void> {
  if (!userId) return;
  const subscriptionTier = membership.tier || 'pro';
  const stmt = `UPDATE users SET subscription_tier = COALESCE(
    (SELECT tier FROM memberships WHERE user_id = ? AND expires_at > ? ORDER BY expires_at DESC LIMIT 1),
    'free'
  ), updated_at = ? WHERE id = ?`;
  const now = Math.floor(Date.now() / 1000);
  await db.prepare(stmt).bind(userId, now, now, userId).run();
  try {
    await db.prepare(`UPDATE users SET subscription_tier = ?, updated_at = ? WHERE id = ?`).bind(subscriptionTier, now, userId).run();
  } catch {
    /* ignore */
  }
}

// ============= handlers =============

async function handleActivate(request: Request, env: Env): Promise<Response> {
  await ensureTables(env.DB);
  const ip = ipOf(request);
  const body: any = await request.json().catch(() => null);
  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
  const emailRaw = typeof body?.email === 'string' ? body.email.trim() : '';
  const email = emailRaw && isValidEmail(emailRaw) ? normalizeEmail(emailRaw) : '';

  if (!code) return errJson('MISSING_CODE', 400);
  const { valid, tier, codeId } = await verifyActivationCode(env, code);
  if (!valid) return errJson('INVALID_CODE', 400);

  const existing = await env.DB.prepare(`SELECT id FROM memberships WHERE activation_code = ?`).bind(code).first<any>();
  if (existing) return errJson('CODE_ALREADY_USED', 409);

  const auth = await authenticate(request, env);
  const userId = auth.uid || null;

  const now = Math.floor(Date.now() / 1000);
  const durationDays = tierDurationDays(env, tier);
  const expiresAt = now + durationDays * 86400;
  const id = await uid();

  await env.DB
    .prepare(
      `INSERT INTO memberships (id, user_id, email, tier, activation_code, activation_code_id, source, activated_at, expires_at, created_at, updated_at, ip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(id, userId, email || null, tier, code, codeId, 'activation_code', now, expiresAt, now, now, ip)
    .run();

  const row = (await env.DB.prepare(`SELECT * FROM memberships WHERE id = ?`).bind(id).first<any>())!;
  if (userId) await upgradeUserTier(env.DB, userId, row);

  return json({
    ok: true,
    membership: {
      id: row.id,
      tier: row.tier,
      activatedAt: row.activated_at,
      expiresAt: row.expires_at,
      source: row.source,
    },
  });
}

async function handleLink(request: Request, env: Env): Promise<Response> {
  await ensureTables(env.DB);
  const ip = ipOf(request);
  const body: any = await request.json().catch(() => null);
  const tx = typeof body?.tx === 'string' ? body.tx.trim() : '';
  const tierRaw = typeof body?.tier === 'string' ? body.tier.trim() : '';
  const emailRaw = typeof body?.email === 'string' ? body.email.trim() : '';
  const email = emailRaw && isValidEmail(emailRaw) ? normalizeEmail(emailRaw) : '';

  if (!tx || !tierRaw) return errJson('MISSING_PARAMS', 400);
  const tier = TIER_DURATION_DAYS[tierRaw] ? tierRaw : 'monthly';

  const auth = await authenticate(request, env);
  const userId = auth.uid || null;

  const dup = await env.DB.prepare(`SELECT id FROM memberships WHERE tx_id = ?`).bind(tx).first<any>();
  if (dup) {
    const row = (await env.DB.prepare(`SELECT * FROM memberships WHERE id = ?`).bind(dup.id).first<any>())!;
    return json({
      ok: true,
      duplicated: true,
      membership: { id: row.id, tier: row.tier, activatedAt: row.activated_at, expiresAt: row.expires_at, source: row.source },
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const durationDays = tierDurationDays(env, tier);
  const expiresAt = now + durationDays * 86400;
  const id = await uid();

  await env.DB
    .prepare(
      `INSERT INTO memberships (id, user_id, email, tier, tx_id, source, activated_at, expires_at, created_at, updated_at, ip) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(id, userId, email || null, tier, tx, 'kofi_tx_link', now, expiresAt, now, now, ip)
    .run();

  const row = (await env.DB.prepare(`SELECT * FROM memberships WHERE id = ?`).bind(id).first<any>())!;
  if (userId) await upgradeUserTier(env.DB, userId, row);

  return json({
    ok: true,
    duplicated: false,
    membership: { id: row.id, tier: row.tier, activatedAt: row.activated_at, expiresAt: row.expires_at, source: row.source },
  });
}

async function handleMe(request: Request, env: Env): Promise<Response> {
  await ensureTables(env.DB);
  const auth = await authenticate(request, env);

  // fallback: x-kofi-token / query activation_code / kofi_token cookie
  const codeHeader = request.headers.get('x-kofi-token') || '';
  const cookie = request.headers.get('cookie') || '';
  const cookieCodeMatch = cookie.match(/(?:^|;\s*)kofi_token=([^;]+)/);
  const cookieCode = cookieCodeMatch ? decodeURIComponent(cookieCodeMatch[1]) : '';
  const fallbackCode = (codeHeader || cookieCode || '').trim().toUpperCase();

  const rowsByCode: any[] = [];
  if (fallbackCode && CODE_RE.test(fallbackCode)) {
    const { valid, codeId } = await verifyActivationCode(env, fallbackCode);
    if (valid) {
      const now = Math.floor(Date.now() / 1000);
      const res = await env.DB
        .prepare(`SELECT * FROM memberships WHERE activation_code = ? AND expires_at > ?`)
        .bind(fallbackCode, now)
        .all<any>();
      rowsByCode.push(...(res.results || []));
      void codeId;
    }
  }

  // 按 user_id 查
  let rowsByUser: any[] = [];
  if (auth.uid) rowsByUser = await activeMembershipRowsFor(env.DB, 'user', auth.uid);

  // 按 email 查（未登录但带 email 参数，或从 kofi 返回带上）
  let rowsByEmail: any[] = [];
  const url = new URL(request.url);
  const emailQ = url.searchParams.get('email') || '';
  const emailNorm = emailQ && isValidEmail(emailQ) ? normalizeEmail(emailQ) : '';
  if (emailNorm) rowsByEmail = await activeMembershipRowsFor(env.DB, 'email', emailNorm);

  const all = [...rowsByUser, ...rowsByEmail, ...rowsByCode];
  if (all.length === 0) {
    return json({
      ok: true,
      isMember: false,
      tier: 'free',
      expiresAt: 0,
      activatedAt: 0,
      source: null,
      membershipId: null,
    });
  }
  all.sort((a, b) => (b.expires_at || 0) - (a.expires_at || 0));
  const best = all[0];
  return json({
    ok: true,
    isMember: true,
    tier: best.tier,
    expiresAt: best.expires_at || 0,
    activatedAt: best.activated_at || 0,
    source: best.source || null,
    membershipId: best.id,
  });
}

// ============= Ko-fi Webhook =============

async function handleWebhook(request: Request, env: Env): Promise<Response> {
  try {
    await ensureTables(env.DB);

    const form = await request.formData();
    const raw = form.get('data');
    if (!raw) return json({ ok: false, error: 'BAD_DATA' }, 400);

    const payload = JSON.parse(raw as string);

    // 安全校验：verification_token 必须匹配
    if (payload.verification_token !== env.KOFI_VERIFICATION_TOKEN) {
      return json({ ok: false, error: 'BAD_TOKEN' }, 401);
    }

    const tx = payload.kofi_transaction_id || '';
    const type = payload.type || '';
    const tierName = payload.tier_name || '';
    const amount = parseFloat(payload.amount || '0');
    const email = payload.email || '';
    const isSubscriptionPayment = payload.is_subscription_payment === true || payload.is_subscription_payment === 'true';

    // 档位映射：tier_name 优先，金额兜底
    const tierMap: Record<string, string> = { 'Monthly Pro': 'monthly' };
    let tier = tierMap[tierName] || null;
    if (!tier) {
      if (amount >= 19) tier = 'commercial';
      else if (amount >= 9) tier = 'one_time';
      else if (amount >= 3) tier = 'monthly';
      else tier = 'monthly';
    }

    // 去重：同一 tx_id 已存在则幂等返回
    if (tx) {
      const dup = await env.DB.prepare(`SELECT id FROM memberships WHERE tx_id = ?`).bind(tx).first<any>();
      if (dup) {
        return json({ ok: true, duplicated: true });
      }
    }

    // 写库
    const now = Math.floor(Date.now() / 1000);
    const durationDays = tierDurationDays(env, tier);
    const expiresAt = now + durationDays * 86400;
    const id = await uid();
    const emailNorm = email && isValidEmail(email) ? normalizeEmail(email) : null;
    const ip = ipOf(request);
    const source = isSubscriptionPayment ? 'kofi_webhook_sub' : 'kofi_webhook';

    await env.DB
      .prepare(
        `INSERT INTO memberships (id, user_id, email, tier, tx_id, source, activated_at, expires_at, created_at, updated_at, ip, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
      )
      .bind(id, null, emailNorm, tier, tx || null, source, now, expiresAt, now, now, ip, `type=${type};amount=${payload.amount || ''};tier_name=${tierName}`)
      .run();

    console.log('[kofi webhook] created membership', id, 'tier=', tier, 'tx=', tx, 'email=', emailNorm);

    return json({ ok: true });
  } catch (e: any) {
    // 异常也返回 200 避免 Ko-fi 疯狂重试，但记录错误
    console.error('[kofi webhook] error', e?.stack || e?.message || String(e));
    return json({ ok: true, error: 'INTERNAL' });
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const request = context.request;
  const env = context.env as Env;
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  const m = url.pathname.match(/^\/api\/kofi\/?(.*)$/);
  const subpath = (m?.[1] || '').replace(/\/+$/, '');

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,POST,OPTIONS',
        'access-control-allow-headers': 'Content-Type,Authorization,X-Access-Token,X-Kofi-Token',
        'access-control-max-age': '86400',
      },
    });
  }

  try {
    if (subpath === 'webhook') {
      if (method === 'POST') return handleWebhook(request, env);
      return errJson('METHOD_NOT_ALLOWED', 405);
    }
    if (subpath === 'activate' || (!subpath && url.searchParams.get('op') === 'activate')) {
      if (method !== 'POST') return errJson('METHOD_NOT_ALLOWED', 405);
      return handleActivate(request, env);
    }
    if (subpath === 'link' || (!subpath && url.searchParams.get('op') === 'link')) {
      if (method !== 'POST') return errJson('METHOD_NOT_ALLOWED', 405);
      return handleLink(request, env);
    }
    if (subpath === 'me' || subpath === '') {
      if (method === 'GET' || method === 'HEAD') return handleMe(request, env);
      if (method === 'POST' && subpath === 'me') return handleMe(request, env);
      return errJson('METHOD_NOT_ALLOWED', 405);
    }
    return errJson('NOT_FOUND', 404);
  } catch (e: any) {
    console.error('[kofi] error', subpath, e?.stack || e?.message || String(e));
    return errJson('INTERNAL_ERROR', 500);
  }
};
