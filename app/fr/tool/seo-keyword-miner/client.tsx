'use client';
import { useTranslations } from 'next-intl';
import { Search, Download, Copy, Check, Home, ChevronRight, Loader2, RefreshCw, FileText, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';
import { usePreferencesStore } from '@/stores/preferences';
import { categories } from '@/data/categories';
import { useParams, usePathname } from 'next/navigation';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

type Heat = 'High' | 'Medium' | 'Low';
type Competition = 'High' | 'Medium' | 'Low';
type Intent = 'Informational' | 'Transactional' | 'Navigational';

interface KeywordRow {
  keyword: string;
  intent: Intent;
  heat: Heat;
  competition: Competition;
  suggestion: string;
}

const DAILY_LIMIT = 3;
const STORAGE_KEY = 'korelyy_seo_miner_count_v1';

function getTodayKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

function getRemaining(): number {
  if (typeof window === 'undefined') return DAILY_LIMIT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DAILY_LIMIT;
    const parsed = JSON.parse(raw);
    if (parsed.date !== getTodayKey()) return DAILY_LIMIT;
    const used = Math.max(0, Math.min(DAILY_LIMIT, Number(parsed.used) || 0));
    return Math.max(0, DAILY_LIMIT - used);
  } catch {
    return DAILY_LIMIT;
  }
}

function incUsed(): number {
  if (typeof window === 'undefined') return DAILY_LIMIT - 1;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let used = 0;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === getTodayKey()) used = Number(parsed.used) || 0;
    }
    used = Math.min(DAILY_LIMIT, used + 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), used }));
    return DAILY_LIMIT - used;
  } catch {
    return 0;
  }
}

function downloadCSV(rows: KeywordRow[]) {
  const header = ['Keyword', 'Intent', 'Heat', 'Competition', 'Suggestion'];
  const esc = (s: string) => {
    const v = (s ?? '').replace(/"/g, '""');
    return `"${v}"`;
  };
  const lines = [header.join(','), ...rows.map((r) => [r.keyword, r.intent, r.heat, r.competition, r.suggestion].map(esc).join(','))];
  const bom = '\uFEFF';
  const blob = new Blob([bom + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `seo-keywords-${Date.now()}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const heatStyle: Record<Heat, string> = {
  High: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
  Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Low: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
};

const compStyle: Record<Competition, string> = {
  High: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  Medium: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  Low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
};

const intentStyle: Record<Intent, string> = {
  Informational: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Transactional: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Navigational: 'bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800',
};

function heatLabel(h: Heat, locale: string): string {
  if (locale === 'zh') return h === 'High' ? '高' : h === 'Medium' ? '中' : '低';
  if (locale === 'es') return h === 'High' ? 'Alta' : h === 'Medium' ? 'Media' : 'Baja';
  if (locale === 'fr') return h === 'High' ? 'Haute' : h === 'Medium' ? 'Moyenne' : 'Basse';
  if (locale === 'hi') return h === 'High' ? 'उच्च' : h === 'Medium' ? 'मध्यम' : 'कम';
  if (locale === 'ar') return h === 'High' ? 'عالٍ' : h === 'Medium' ? 'متوسط' : 'منخفض';
  return h;
}

function compLabel(c: Competition, locale: string): string {
  if (locale === 'zh') return c === 'High' ? '高' : c === 'Medium' ? '中' : '低';
  if (locale === 'es') return c === 'High' ? 'Alta' : c === 'Medium' ? 'Media' : 'Baja';
  if (locale === 'fr') return c === 'High' ? 'Forte' : c === 'Medium' ? 'Moyenne' : 'Faible';
  if (locale === 'hi') return c === 'High' ? 'उच्च' : c === 'Medium' ? 'मध्यम' : 'कम';
  if (locale === 'ar') return c === 'High' ? 'عالٍ' : c === 'Medium' ? 'متوسط' : 'منخفض';
  return c;
}

function intentLabel(i: Intent, locale: string): string {
  if (locale === 'zh') return i === 'Informational' ? '信息型' : i === 'Transactional' ? '交易型' : '导航型';
  if (locale === 'es') return i === 'Informational' ? 'Informativa' : i === 'Transactional' ? 'Transaccional' : 'Navegacional';
  if (locale === 'fr') return i === 'Informational' ? 'Informationnel' : i === 'Transactional' ? 'Transactionnel' : 'Navigationnel';
  if (locale === 'hi') return i === 'Informational' ? 'सूचनात्मक' : i === 'Transactional' ? 'लेन-देन' : 'नेविगेशनल';
  if (locale === 'ar') return i === 'Informational' ? 'معلوماتي' : i === 'Transactional' ? 'معاملاتي' : 'ملاحي';
  return i;
}

export default function ToolPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug?: string };
  const pathname = usePathname();
  const pathSlug = (() => { const m = pathname.match(/\/tool\/([^/]+)/); return m ? m[1] : undefined; })();
  const pathLocale = (() => { const lm = pathname.match(/^\/([a-z]{2})(\/|$)/); const rawLocale = (lm && lm[1]) ? lm[1] : ''; return VALID_LOCALES.includes(rawLocale) ? rawLocale : (resolvedParams?.locale || 'zh'); })();
  const resolvedLocale = (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)) ? resolvedParams.locale : pathLocale;

  const t = useTranslations('tool');
  const breadcrumbT = useTranslations('breadcrumb');
  const sidebarT = useTranslations('sidebar');
  const tool = getToolBySlug((resolvedParams?.slug ?? pathSlug) as string);

  // ===== Korelyy: i18n for tool name/description (auto-injected) =====
  const __toolsT = useTranslations('tools');
  const __i18nSlug = (resolvedParams?.slug ?? pathSlug) as string;
  const __i18nName = (() => {
    const fb = !tool ? '' : (resolvedLocale === 'zh' ? (tool.name ?? '') : (((tool as any).nameEn ?? '') || (tool.name ?? '')));
    if (resolvedLocale === 'zh' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.name')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.name') : null)
      ?? fb;
  })();
  const __i18nDesc = (() => {
    const fb = !tool ? '' : (resolvedLocale === 'zh' ? (tool.description ?? '') : (((tool as any).descriptionEn ?? '') || (tool.description ?? '')));
    if (resolvedLocale === 'zh' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.description')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.description') : null)
      ?? fb;
  })();

  const relatedTools = tool ? getRelatedTools(tool) : [];
  const { addToHistory } = usePreferencesStore();

  const [seed, setSeed] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<KeywordRow[]>([]);
  const [copyFlag, setCopyFlag] = useState<number | string | null>(null);
  const [remaining, setRemaining] = useState(DAILY_LIMIT);

  useEffect(() => {
    if (tool) {
      addToHistory(tool.id);
      document.title = `${__i18nName} - Korelyy Tools`;
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', __i18nDesc);
    }
  }, [tool]);

  useEffect(() => {
    setRemaining(getRemaining());
  }, []);

  const ui = (() => {
    const l = resolvedLocale;
    if (l === 'zh') return {
      inputPlaceholder: '输入核心关键词，如：ai tools、远程办公、记账…',
      btn: '开始挖掘', btn2: '再挖一批', loading: '正在挖掘长尾词…',
      colKw: '关键词', colIntent: '意图', colHeat: '热度(预估)', colComp: '竞争(预估)', colSug: '内容建议',
      exportCsv: '导出 CSV', copyAll: '复制全部词', copied: '已复制',
      disclaimer: '※ 热度、竞争为启发式 + AI 预估值，仅供参考，非精确搜索量数据',
      empty: '暂无结果，试试其它核心词',
      limit: '今日免费额度', limitOver: '今日免费额度已用完（每天 3 次），请明天再来',
    };
    if (l === 'es') return {
      inputPlaceholder: 'Palabra clave semilla, ej: ai tools, remote work…',
      btn: 'Empezar minería', btn2: 'Minar otro lote', loading: 'Extrayendo palabras long-tail…',
      colKw: 'Palabra clave', colIntent: 'Intención', colHeat: 'Interés (est.)', colComp: 'Competencia (est.)', colSug: 'Sugerencia de contenido',
      exportCsv: 'Exportar CSV', copyAll: 'Copiar todas', copied: 'Copiado',
      disclaimer: '※ Interés / Competencia son estimaciones heurísticas + IA, no datos de volumen exactos.',
      empty: 'Sin resultados. Prueba otra palabra semilla.',
      limit: 'Cuota diaria gratuita', limitOver: 'Cuota diaria agotada (3 intentos/día). Vuelve mañana.',
    };
    if (l === 'fr') return {
      inputPlaceholder: 'Mot-clé de départ, ex: ai tools, télétravail…',
      btn: 'Démarrer l’exploration', btn2: 'Exploration suivante', loading: 'Extraction des mots-clés long-tail…',
      colKw: 'Mot-clé', colIntent: 'Intention', colHeat: 'Intérêt (est.)', colComp: 'Concurrence (est.)', colSug: 'Idée de contenu',
      exportCsv: 'Exporter CSV', copyAll: 'Tout copier', copied: 'Copié',
      disclaimer: '※ Intérêt / Concurrence = estimation heuristique + IA, pas de volume exact.',
      empty: 'Aucun résultat. Essayez un autre mot-clé.',
      limit: 'Quota journalier gratuit', limitOver: 'Quota journalier épuisé (3 essais/jour). Revenez demain.',
    };
    if (l === 'hi') return {
      inputPlaceholder: 'बीज शब्द डालें, जैसे: ai tools, work from home…',
      btn: 'खनन शुरू करें', btn2: 'एक और बैच', loading: 'लॉन्ग-टेल कीवर्ड निकाले जा रहे हैं…',
      colKw: 'कीवर्ड', colIntent: 'इरादा', colHeat: 'हीट (अनुमानित)', colComp: 'प्रतिस्पर्धा (अनुमानित)', colSug: 'सामग्री सुझाव',
      exportCsv: 'CSV डाउनलोड', copyAll: 'सभी कॉपी करें', copied: 'कॉपी हो गया',
      disclaimer: '※ हीट / प्रतिस्पर्धा अनुमानित है, सटीक सर्च वॉल्यूम नहीं।',
      empty: 'कोई परिणाम नहीं। दूसरा शब्द आज़माएँ।',
      limit: 'आज की मुफ्त कोटा', limitOver: 'आज की कोटा खत्म (3 बार/दिन)। कल फिर आना।',
    };
    if (l === 'ar') return {
      inputPlaceholder: 'كلمة رئيسية أساسية، مثل: ai tools…',
      btn: 'ابدأ التنقيب', btn2: 'دفعة أخرى', loading: 'جاري استخراج الكلمات الطويلة…',
      colKw: 'الكلمة', colIntent: 'النية', colHeat: 'الشغف (تقدير)', colComp: 'المنافسة (تقدير)', colSug: 'اقتراح محتوى',
      exportCsv: 'تصدير CSV', copyAll: 'نسخ الكل', copied: 'تم النسخ',
      disclaimer: '※ الشغف / المنافسة تقديرات، ليست حجم بحث دقيق.',
      empty: 'لا نتائج. جرّب كلمة أخرى.',
      limit: 'الحد اليومي المجاني', limitOver: 'انتهى الحد اليومي (3 محاولات/يوم). عد غداً.',
    };
    return {
      inputPlaceholder: 'Enter seed keyword, e.g. ai tools, remote work, budget planner…',
      btn: 'Start Mining', btn2: 'Mine Another Batch', loading: 'Mining long-tail keywords…',
      colKw: 'Keyword', colIntent: 'Intent', colHeat: 'Heat (est.)', colComp: 'Competition (est.)', colSug: 'Content Suggestion',
      exportCsv: 'Export CSV', copyAll: 'Copy All Keywords', copied: 'Copied',
      disclaimer: '※ Heat / Competition are heuristic + AI estimates, not exact search volume.',
      empty: 'No results yet. Try a different seed keyword.',
      limit: 'Daily free quota', limitOver: 'Daily free quota exceeded (3 attempts/day). Please come back tomorrow.',
    };
  })();

  async function mine() {
    if (loading) return;
    let s = (seed || '').trim();
    if (!s && typeof document !== 'undefined') {
      const inputs = document.querySelectorAll('input');
      for (const el of Array.from(inputs)) {
        const ph = (el.placeholder || '').toLowerCase();
        const v = (el.value || '').trim();
        if (v && (ph.indexOf('keyword') !== -1 || ph.indexOf('核心') !== -1 || ph.indexOf('ai tools') !== -1 || el.className && String(el.className).indexOf('primary') !== -1)) {
          s = v;
          setSeed(v);
          break;
        }
      }
      if (!s) {
        for (const el of Array.from(inputs)) {
          const v = (el.value || '').trim();
          if (v && el.type === 'text') {
            s = v;
            setSeed(v);
            break;
          }
        }
      }
    }
    if (!s) {
      setError(resolvedLocale === 'zh' ? '请输入核心关键词' : 'Please enter a seed keyword');
      return;
    }
    let remain = DAILY_LIMIT;
    try { remain = getRemaining(); } catch {}
    if (remain <= 0) {
      setError(ui.limitOver);
      return;
    }
    setError(null);
    setLoading(true);
    setResults([]);
    try {
      const resp = await fetch('/api/seo-miner/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed: s, locale: resolvedLocale }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || String(resp.status));
      const rows: KeywordRow[] = Array.isArray(data.keywords) ? data.keywords : [];
      setResults(rows);
      let left = DAILY_LIMIT - 1;
      try { left = incUsed(); } catch {}
      setRemaining(left);
      if (!rows.length) setError(ui.empty);
    } catch (e) {
      setError((e as Error).message || (resolvedLocale === 'zh' ? '挖掘失败，请稍后再试' : 'Mining failed, please try again'));
    } finally {
      setLoading(false);
    }
  }

  async function onCopyAll() {
    const ok = await copyText(results.map((r) => r.keyword).join('\n'));
    if (ok) { setCopyFlag('all'); setTimeout(() => setCopyFlag(null), 1600); }
  }

  async function onCopyRow(kw: string, idx: number) {
    const ok = await copyText(kw);
    if (ok) { setCopyFlag(idx); setTimeout(() => setCopyFlag(null), 1600); }
  }

  if (!tool) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <p className='text-gray-600 dark:text-gray-400'>Tool not found.</p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-wrap items-center gap-1.5 text-xs sm:text-sm mb-6'>
        <a href={`/${resolvedLocale}`} className='flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[28px]'>
          <Home className='h-4 w-4' />
          <span>{breadcrumbT('home')}</span>
        </a>
        {tool && (() => {
          const cat = categories.find((c) => c.id === tool.category);
          if (!cat) return null;
          return (
            <>
              <ChevronRight className='h-3.5 w-3.5 text-gray-400 shrink-0' />
              <a
                href={`/${resolvedLocale}?category=${cat.id}`}
                className='text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate max-w-[180px]'
              >
                {sidebarT(cat.id)}
              </a>
            </>
          );
        })()}
        {tool && (
          <>
            <ChevronRight className='h-3.5 w-3.5 text-gray-400 shrink-0' />
            <span className='font-medium text-gray-900 dark:text-gray-100 truncate max-w-[260px]'>{__i18nName}</span>
          </>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <aside className='lg:col-span-2 hidden lg:block'>
          <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t('related')}</h3>
            {relatedTools.map((tt) => (
              <ToolCard key={tt.id} tool={tt} locale={resolvedLocale} />
            ))}
          </div>
        </aside>

        <main className='lg:col-span-7'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'>
                <Search className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div className='flex-1 min-w-0'>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate'>{__i18nName}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>{__i18nDesc}</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='inline-flex items-center gap-1.5'>
                  <AlertTriangle className='h-3.5 w-3.5 text-amber-500' />
                  <span>{ui.disclaimer}</span>
                </span>
                <span className='shrink-0 font-medium text-gray-700 dark:text-gray-300'>
                  {ui.limit}: {remaining}/{DAILY_LIMIT}
                </span>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3'>
                <input
                  type='text'
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void mine(); } }}
                  placeholder={ui.inputPlaceholder}
                  className='w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
                <button
                  onClick={() => void mine()}
                  disabled={loading || remaining <= 0}
                  className='inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[150px]'
                >
                  {loading ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : results.length ? (
                    <RefreshCw className='h-4 w-4' />
                  ) : (
                    <Search className='h-4 w-4' />
                  )}
                  {loading ? ui.loading : results.length ? ui.btn2 : ui.btn}
                </button>
              </div>

              {error && (
                <div className='p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm border border-red-200 dark:border-red-900/50'>
                  {error}
                </div>
              )}

              {results.length > 0 && (
                <div className='flex flex-wrap gap-2 pt-2'>
                  <button
                    onClick={() => void onCopyAll()}
                    disabled={copyFlag === 'all'}
                    className='inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60 transition-colors'
                  >
                    {copyFlag === 'all' ? (
                      <Check className='h-4 w-4 text-green-600' />
                    ) : (
                      <Copy className='h-4 w-4' />
                    )}
                    {copyFlag === 'all' ? ui.copied : ui.copyAll}
                  </button>
                  <button
                    onClick={() => downloadCSV(results)}
                    className='inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                  >
                    <Download className='h-4 w-4' />
                    {ui.exportCsv}
                  </button>
                </div>
              )}

              {results.length > 0 && (
                <div className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700'>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-xs sm:text-sm'>
                      <thead className='bg-gray-50 dark:bg-gray-800/70'>
                        <tr>
                          <th className='px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[26%]'>{ui.colKw}</th>
                          <th className='px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[10%]'>{ui.colIntent}</th>
                          <th className='px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[10%]'>{ui.colHeat}</th>
                          <th className='px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[10%]'>{ui.colComp}</th>
                          <th className='px-3 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 w-[36%]'>{ui.colSug}</th>
                          <th className='px-3 py-3 text-right font-semibold text-gray-700 dark:text-gray-200 w-[8%]'></th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200 dark:divide-gray-800'>
                        {results.map((r, idx) => (
                          <tr key={idx} className='hover:bg-gray-50/50 dark:hover:bg-gray-800/40 align-top'>
                            <td className='px-3 py-3 font-medium text-gray-900 dark:text-gray-100 break-words'>{r.keyword}</td>
                            <td className='px-3 py-3'>
                              <span className={'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ' + intentStyle[r.intent]}>
                                {intentLabel(r.intent, resolvedLocale)}
                              </span>
                            </td>
                            <td className='px-3 py-3'>
                              <span className={'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ' + heatStyle[r.heat]}>
                                {heatLabel(r.heat, resolvedLocale)}
                              </span>
                            </td>
                            <td className='px-3 py-3'>
                              <span className={'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border ' + compStyle[r.competition]}>
                                {compLabel(r.competition, resolvedLocale)}
                              </span>
                            </td>
                            <td className='px-3 py-3 text-gray-700 dark:text-gray-300 break-words leading-relaxed'>
                              {r.suggestion ? (
                                <span className='inline-flex gap-1.5'>
                                  <FileText className='h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-400' />
                                  <span>{r.suggestion}</span>
                                </span>
                              ) : (
                                <span className='text-gray-400 dark:text-gray-500 italic'>—</span>
                              )}
                            </td>
                            <td className='px-3 py-3 text-right'>
                              <button
                                onClick={() => void onCopyRow(r.keyword, idx)}
                                title={copyFlag === idx ? ui.copied : ui.copyAll}
                                className='inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
                              >
                                {copyFlag === idx ? (
                                  <Check className='h-3.5 w-3.5 text-green-600' />
                                ) : (
                                  <Copy className='h-3.5 w-3.5' />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <aside className='lg:col-span-3 hidden lg:block'>
          <div className='card p-4 sm:p-5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-3'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 text-sm'>
              {resolvedLocale === 'zh' ? '使用小贴士' : 'Quick Tips'}
            </h3>
            <ul className='list-disc list-inside space-y-1.5'>
              {resolvedLocale === 'zh' ? (
                <>
                  <li>核心词越短 → 能挖出来的长尾词越多</li>
                  <li>尝试加场景词：for students、2025、review 等</li>
                  <li>优先抓 Heat=高 / Competition=中低 的词做内容</li>
                  <li>每日免费 3 次，额度每天 0 点 UTC 重置</li>
                </>
              ) : resolvedLocale === 'es' ? (
                <>
                  <li>Palabras más cortas → más variantes long-tail</li>
                  <li>Añade contexto: for students, 2025, review…</li>
                  <li>Prioriza Heat=Alta + Competencia=Media/Baja</li>
                  <li>3 intentos/día, se reinician a las 00:00 UTC</li>
                </>
              ) : resolvedLocale === 'fr' ? (
                <>
                  <li>Mots courts → plus de variantes long-tail</li>
                  <li>Ajoutez du contexte : for students, 2025, review…</li>
                  <li>Priorisez Heat=Haute + Concurrence=Moyenne/Basse</li>
                  <li>3 essais/jour, réinitialisés à 00:00 UTC</li>
                </>
              ) : resolvedLocale === 'hi' ? (
                <>
                  <li>छोटे शब्द → अधिक लॉन्ग-टेल वेरिएंट</li>
                  <li>संदर्भ डालें: for students, 2025, review…</li>
                  <li>हीट=उच्च + प्रतिस्पर्धा=मध्यम/कम को प्राथमिकता दें</li>
                  <li>दिन में 3 बार, 00:00 UTC पर रीसेट</li>
                </>
              ) : resolvedLocale === 'ar' ? (
                <>
                  <li>كلمات أقصر → مزيد من المتغيرات الطويلة</li>
                  <li>أضف سياقاً: for students, 2025, review…</li>
                  <li>فضّل الشغف=عالٍ + المنافسة=متوسطة/منخفضة</li>
                  <li>3 محاولات/يوم، تصفر عند 00:00 UTC</li>
                </>
              ) : (
                <>
                  <li>Shorter seeds → richer long-tail variants</li>
                  <li>Add context: for students, 2025, review…</li>
                  <li>Prioritize Heat=High + Competition=Mid/Low</li>
                  <li>3 free attempts/day, resets 00:00 UTC</li>
                </>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
