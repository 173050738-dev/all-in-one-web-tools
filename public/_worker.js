/**
 * Cloudflare Pages Advanced Mode Worker
 *
 * 功能：
 *  1) SEO 关键词矿工 API：POST /api/seo-miner 或 /{zh,en,es,fr,hi,ar}/api/seo-miner
 *  2) 根据 Accept-Language 或 Cookie 做边缘重定向（保留原有逻辑）
 *
 * 部署方式：Next.js 静态 export 后 post-build.cjs 自动把 public/_worker.js 复制到 out/_worker.js
 * wrangler pages deploy out/ → Pages Advanced Mode (无需额外 Worker 项目)
 */

// ============================================================
// ===== 模块 1：SEO 关键词矿工（Google Autocomplete + DeepSeek)
// ============================================================
const SEO_GOOGLE_SUGGEST_URL = 'https://suggestqueries.google.com/complete/search?client=firefox&q=';
const SEO_MODIFIERS = ['how', 'what', 'best', 'vs', 'for', 'near', 'free', 'online', '2025', '2026'];
const SEO_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const SEO_MAX_AUTOCOMPLETE_PER_QUERY = 15;
const SEO_MAX_CANDIDATE_KEYWORDS = 60;

function seoOkJson(data, status) {
  status = status || 200;
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, private',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
function seoErrJson(error, status) { return seoOkJson({ error: error }, status); }
function seoCorsPreflight() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
}
function seoEncodeKeyword(q) { return encodeURIComponent(String(q || '').trim()); }

async function seoFetchSuggestions(query, signal) {
  try {
    const res = await fetch(SEO_GOOGLE_SUGGEST_URL + seoEncodeKeyword(query), {
      signal: signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cf: { cacheTtl: 0 },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data) || !Array.isArray(data[1])) return [];
    return data[1].filter(function (s) { return typeof s === 'string'; }).slice(0, SEO_MAX_AUTOCOMPLETE_PER_QUERY);
  } catch (e) { return []; }
}

function seoClassifyHeatAndCompetition(kw, overallRank, total) {
  var words = (kw || '').trim().split(/\s+/).length;
  var len = (kw || '').length;
  var percentile = total <= 1 ? 1 : overallRank / total;
  var heat;
  if (percentile <= 0.25) heat = 'High';
  else if (percentile <= 0.6) heat = 'Medium';
  else heat = 'Low';
  var competition;
  if (words <= 2 && len <= 16) competition = 'High';
  else if (words <= 3 && len <= 28) competition = 'Medium';
  else competition = 'Low';
  return { heat: heat, competition: competition };
}

function seoIsSeoMinerPath(pathname) {
  var p = (pathname || '').replace(/\/+$/, '');
  if (!p) return false;
  if (/\/api\/seo-miner$/.test(p)) return true;
  if (/^\/(en|zh|es|fr|hi|ar)\/api\/seo-miner$/.test(p)) return true;
  return false;
}

async function seoMinerRequest(request, env) {
  if (request.method === 'OPTIONS') return seoCorsPreflight();
  if (request.method !== 'POST') return seoErrJson('Method Not Allowed (use POST)', 405);

  var payload;
  try { payload = await request.json(); } catch (e) { return seoErrJson('Invalid JSON body', 400); }

  var seedClean = typeof payload.seed === 'string' ? payload.seed.trim() : '';
  var localeRaw = payload.locale || 'en';
  var VALID_LOCALES = { en: 1, zh: 1, es: 1, fr: 1, hi: 1, ar: 1 };
  var locale = VALID_LOCALES[localeRaw] ? localeRaw : 'en';

  if (!seedClean) return seoErrJson('seed is required', 400);

  var queries = [];
  var seenQueries = {};
  function addQ(q) { if (!seenQueries[q]) { seenQueries[q] = 1; queries.push(q); } }
  addQ(seedClean);
  var i, j;
  for (i = 0; i < SEO_MODIFIERS.length; i++) { addQ(seedClean + ' ' + SEO_MODIFIERS[i]); addQ(SEO_MODIFIERS[i] + ' ' + seedClean); }
  for (j = 0; j < 8; j++) { addQ(seedClean + ' ' + SEO_ALPHABET[j]); addQ(SEO_ALPHABET[j] + ' ' + seedClean); }

  var controller = new AbortController();
  var timeoutId;
  try {
    timeoutId = setTimeout(function () { try { controller.abort(); } catch (e) {} }, 8000);
  } catch (e) { /* ignore */ }

  var allSug = [];
  var globalRank = 0;
  var queriesSlice = queries.slice(0, 28);
  for (i = 0; i < queriesSlice.length; i++) {
    var q = queriesSlice[i];
    var list = await seoFetchSuggestions(q, controller.signal);
    for (j = 0; j < list.length; j++) { allSug.push({ kw: list[j], rank: globalRank + j, query: q }); }
    globalRank += Math.max(list.length, 1);
  }
  try { if (timeoutId) clearTimeout(timeoutId); } catch (e) {}

  var seenKw = {};
  var ordered = [];
  var seedLow = seedClean.toLowerCase();
  for (i = 0; i < allSug.length; i++) {
    var row = allSug[i];
    var norm = (row.kw || '').toLowerCase().trim();
    if (seenKw[norm]) continue;
    if (norm.indexOf(seedLow) === -1) continue;
    seenKw[norm] = 1;
    ordered.push({ kw: row.kw, rank: ordered.length });
    if (ordered.length >= SEO_MAX_CANDIDATE_KEYWORDS) break;
  }

  var candidates = ordered.length ? ordered.slice(0, SEO_MAX_CANDIDATE_KEYWORDS) : [];

  if (candidates.length < 12) {
    var extraMods = ['how to', 'what is', 'best', 'top', 'vs', 'for', 'near me', 'free', 'online', '2025', '2026', 'review', 'guide', 'tips', 'tutorial', 'examples', 'ideas', 'for beginners', 'without', 'cheap', 'affordable', 'professional', 'open source'];
    var extraAhead = ['how to ', 'best ', 'top ', 'free ', 'cheap ', 'easy ', 'quick '];
    var extraBehind = [' for students', ' for business', ' for beginners', ' for small business', ' 2025', ' 2026', ' guide', ' review', ' tutorial', ' examples', ' tips', ' ideas', ' near me', ' online', ' free'];
    var manualSet = {};
    var manualArr = [];
    function addManual(k) { if (!manualSet[k]) { manualSet[k] = 1; manualArr.push(k); } }
    addManual(seedClean);
    for (i = 0; i < extraMods.length; i++) { addManual(seedClean + ' ' + extraMods[i]); addManual(extraMods[i] + ' ' + seedClean); }
    for (i = 0; i < extraAhead.length; i++) { addManual(extraAhead[i] + seedClean); }
    for (i = 0; i < extraBehind.length; i++) { addManual(seedClean + extraBehind[i]); }
    var extrasFiltered = manualArr.filter(function (k) { return k.toLowerCase().indexOf(seedLow) !== -1; }).filter(function (k) {
      for (var ci = 0; ci < candidates.length; ci++) if ((candidates[ci].kw || '').toLowerCase() === k.toLowerCase()) return false;
      return true;
    });
    var limit = Math.max(0, SEO_MAX_CANDIDATE_KEYWORDS - candidates.length);
    var mapped = extrasFiltered.slice(0, limit).map(function (kw, idx) { return { kw: kw, rank: candidates.length + idx }; });
    candidates = candidates.concat(mapped);
  }

  if (!candidates.length) candidates = [{ kw: seedClean, rank: 0 }];

  var baseLabels = candidates.map(function (c, idx) {
    var r = seoClassifyHeatAndCompetition(c.kw, idx, candidates.length);
    return { keyword: c.kw, heat: r.heat, competition: r.competition };
  });

  var apiKey = env && env.DEEPSEEK_API_KEY ? env.DEEPSEEK_API_KEY : '';
  var apiUrl = env && env.DEEPSEEK_API_URL ? env.DEEPSEEK_API_URL : 'https://api.deepseek.com/v1/chat/completions';
  var model = env && env.DEEPSEEK_MODEL ? env.DEEPSEEK_MODEL : 'deepseek-chat';
  var aiMap = {};

  if (apiKey) {
    var localePrompt;
    if (locale === 'zh') localePrompt = '用中文输出 suggestion 建议';
    else if (locale === 'es') localePrompt = 'Escribe suggestion en español';
    else if (locale === 'fr') localePrompt = 'Rédige suggestion en français';
    else if (locale === 'hi') localePrompt = 'suggestion ko hindi mein likhen';
    else if (locale === 'ar') localePrompt = 'اكتب suggestion باللغة العربية';
    else localePrompt = 'Write suggestion in English';

    var kwListStr = baseLabels.map(function (b) { return b.keyword; }).join('\n');
    var systemPrompt = '你是 SEO 关键词分析助手。针对候选关键词列表，为每词返回：{keyword, intent(Informational|Transactional|Navigational), suggestion(一句内容选题建议，不要太长)}。以 { keywords: [...] } 为顶层 JSON 返回。response_format: json_object。' + localePrompt + '。关键词列表:\n' + kwListStr;
    var userPrompt = locale === 'zh'
      ? ('为下列 SEO 长尾词分类 intent 并给出内容建议：\n' + kwListStr)
      : ('Classify intent and give 1 content suggestion for each keyword:\n' + kwListStr);

    try {
      var aiController;
      try { aiController = new AbortController(); } catch (e) { aiController = null; }
      var aiTimeout;
      if (aiController) {
        try { aiTimeout = setTimeout(function () { try { aiController.abort(); } catch (e2) {} }, 25000); } catch (e) {}
      }
      var response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        }),
        signal: aiController ? aiController.signal : void 0,
      });
      try { if (aiTimeout) clearTimeout(aiTimeout); } catch (e) {}
      if (response.ok) {
        var data = await response.json();
        var content = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ? data.choices[0].message.content : '{}';
        var parsed;
        try { parsed = JSON.parse(content); } catch (e) { parsed = { keywords: [] }; }
        var list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.keywords) ? parsed.keywords : []);
        for (var li = 0; li < list.length; li++) {
          var item = list[li];
          if (!item || !item.keyword) continue;
          var intentVal = (item.intent && (item.intent === 'Informational' || item.intent === 'Transactional' || item.intent === 'Navigational')) ? item.intent : 'Informational';
          aiMap[String(item.keyword).toLowerCase()] = { intent: intentVal, suggestion: (item.suggestion || '') };
        }
      } else {
        try {
          var errTxt = await response.text();
          console.warn('[seo-miner] DeepSeek upstream fail status=' + response.status + ' body=' + (errTxt || '').slice(0, 300));
        } catch (e3) {}
      }
    } catch (e) {
      console.warn('[seo-miner] DeepSeek fetch error:', e && e.message ? e.message : String(e));
    }
  }

  var results = baseLabels.map(function (b) {
    var ai = aiMap[b.keyword.toLowerCase()] || aiMap[b.keyword] || null;
    return {
      keyword: b.keyword,
      intent: ai ? ai.intent : 'Informational',
      heat: b.heat,
      competition: b.competition,
      suggestion: ai ? ai.suggestion : '',
    };
  });

  return seoOkJson({ keywords: results });
}

// ============================================================
// ===== 模块 1.1：Excel/Sheets 公式生成器（内嵌 DeepSeek）
// ============================================================
function isExcelFormulaPath(pathname) {
  var p = (pathname || '').replace(/\/+$/, '');
  if (!p) return false;
  if (/\/api\/excel-formula$/.test(p)) return true;
  if (/^\/(en|zh|es|fr|hi|ar)\/api\/excel-formula$/.test(p)) return true;
  return false;
}

async function excelFormulaRequest(request, env) {
  if (request.method === 'OPTIONS') return seoCorsPreflight();
  if (request.method !== 'POST') return seoErrJson('Method Not Allowed (use POST)', 405);

  var payload;
  try { payload = await request.json(); } catch (e) { return seoErrJson('Invalid JSON body', 400); }

  var reqText = typeof payload.request === 'string' ? payload.request.trim() : '';
  var platform = payload.platform === 'sheets' ? 'sheets' : 'excel';
  var locale = payload.locale === 'zh' ? 'zh' : 'en';
  if (!reqText) return seoErrJson('Request is required', 400);

  var apiKey = env && env.DEEPSEEK_API_KEY ? env.DEEPSEEK_API_KEY : '';
  var apiUrl = env && env.DEEPSEEK_API_URL ? env.DEEPSEEK_API_URL : 'https://api.deepseek.com/v1/chat/completions';
  var model = env && env.DEEPSEEK_MODEL ? env.DEEPSEEK_MODEL : 'deepseek-chat';
  if (!apiKey) return seoErrJson('API key not configured', 500);

  var platformLabel = platform === 'sheets' ? 'Google Sheets' : 'Microsoft Excel';
  var langLabel = locale === 'zh' ? 'Simplified Chinese' : 'English';

  var systemPrompt = 'You are an expert formula generator for ' + platformLabel + '. Based on the user\'s natural language requirement, output a correct formula.\n'
    + 'Return STRICTLY follow these rules:\n'
    + '1. Platform syntax: Use ONLY ' + platformLabel + ' function names and syntax.\n'
    + '2. Return a VALID JSON object with this EXACT shape: {"formula": string, "explanation": string[], "example": string, "notes": string[]}\n'
    + '3. formula: the raw formula string starting with =, NO extra spaces or markdown backticks.\n'
    + '4. explanation: step-by-step explanation as an array of short strings.\n'
    + '5. example: one concrete usage example with sample cell references.\n'
    + '6. notes: 2-4 practical caveats or tips as a string array.\n'
    + '7. The user locale is ' + (locale === 'zh' ? 'Chinese' : 'English') + ', so write explanation/example/notes in ' + langLabel + '.\n'
    + 'DO NOT wrap the JSON in markdown code fences.';

  var userPrompt = locale === 'zh'
    ? ('平台：' + platformLabel + '\n用户需求：' + reqText + '\n\n请生成正确公式。')
    : ('Platform: ' + platformLabel + '\nUser requirement: ' + reqText + '\n\nGenerate the correct formula.');

  var response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
    });
  } catch (e) { return seoErrJson('AI service unavailable', 502); }

  if (!response.ok) return seoErrJson('AI service unavailable', 502);

  var data;
  try { data = await response.json(); } catch (e) { return seoErrJson('AI service unavailable', 502); }
  var content = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '{}';
  var result;
  try { result = JSON.parse(content); } catch (e) { result = {}; }

  return seoOkJson({
    formula: result.formula || '',
    explanation: Array.isArray(result.explanation) ? result.explanation : [],
    example: result.example || '',
    notes: Array.isArray(result.notes) ? result.notes : [],
  });
}

// ============================================================
// ===== 模块 2：语言重定向（原有逻辑）
// ============================================================
const SUPPORTED_LOCALES = new Set(['en', 'zh', 'es', 'hi', 'fr', 'ar']);
const LOCALE_COOKIE_KEY = 'korelyy-locale';

const STATIC_BYPASS_PREFIXES = ['/_next/', '/_headers', '/_redirects', '/yandex_', '/google'];
const STATIC_BYPASS_FILES = new Set([
  '/robots.txt',
  '/sitemap.xml',
  '/site.webmanifest',
  '/sw.js',
  '/favicon.svg',
  '/og-image.svg',
  '/favicon.ico',
  '/ads.txt',
  '/index.txt',
]);

function hasStaticExtension(pathname) {
  return /\.[a-zA-Z0-9]{1,6}$/.test(pathname);
}

function parsePathLocale(pathname) {
  const first = pathname.split('/').filter(Boolean)[0];
  if (!first) return null;
  return SUPPORTED_LOCALES.has(first) ? first : null;
}

function readCookieLocale(cookieHeader) {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(';');
  for (const p of pairs) {
    const [k, v] = p.trim().split('=');
    if (k === LOCALE_COOKIE_KEY && v && SUPPORTED_LOCALES.has(v)) {
      return v;
    }
  }
  return null;
}

function parseAcceptLanguage(header) {
  if (!header) return [];
  return header
    .split(',')
    .map((raw) => {
      const parts = raw.trim().split(';');
      const tag = parts[0].trim().toLowerCase();
      let q = 1;
      for (let i = 1; i < parts.length; i++) {
        const [k, v] = parts[i].trim().split('=');
        if (k === 'q' && v) {
          const n = parseFloat(v);
          if (!Number.isNaN(n)) q = n;
        }
      }
      return { tag, q };
    })
    .filter((x) => x.tag && x.q > 0)
    .sort((a, b) => b.q - a.q);
}

function pickLocaleFromAccept(header) {
  const entries = parseAcceptLanguage(header);
  for (const { tag } of entries) {
    if (SUPPORTED_LOCALES.has(tag)) return tag;
    const prefix = tag.split('-')[0];
    if (SUPPORTED_LOCALES.has(prefix)) return prefix;
  }
  return 'en';
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, search, hostname } = url;

    // 0) www 子域名 -> 主域名（SEO 权重合并）
    if (hostname === 'www.korelyy.com') {
      const apex = new URL(pathname + search, 'https://korelyy.com');
      return Response.redirect(apex.toString(), 308);
    }

    // 0.1) SEO 关键词矿工 API：优先拦截（在任何 static bypass 检查前）
    if (seoIsSeoMinerPath(pathname)) {
      return seoMinerRequest(request, env);
    }

    // 0.2) Excel/Sheets 公式生成器 API
    if (isExcelFormulaPath(pathname)) {
      return excelFormulaRequest(request, env);
    }

    // 1) 静态资源白名单：直接放行
    if (
      STATIC_BYPASS_PREFIXES.some((p) => pathname.startsWith(p)) ||
      STATIC_BYPASS_FILES.has(pathname) ||
      hasStaticExtension(pathname)
    ) {
      return env.ASSETS.fetch(request);
    }

    // 2) 已经在带语言前缀的路径下 → 直接透传到 Pages 静态
    if (parsePathLocale(pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 3) 未带语言前缀 → Cookie 或 Accept-Language 检测后跳转
    const cookie = request.headers.get('Cookie');
    const cookieLocale = readCookieLocale(cookie);
    const accept = request.headers.get('Accept-Language');
    const target = cookieLocale ?? pickLocaleFromAccept(accept);

    const rest = pathname === '/' ? '' : pathname;
    const redirectTo = `/${target}${rest}${search}`;

    return Response.redirect(new URL(redirectTo, url).toString(), 307);
  },
};
