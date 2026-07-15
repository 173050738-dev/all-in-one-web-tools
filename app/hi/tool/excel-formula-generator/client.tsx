'use client';
import { useTranslations } from 'next-intl';
import { Table, Copy, Check, Sparkles, RotateCcw, Home, ChevronRight, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';
import { usePreferencesStore } from '@/stores/preferences';
import { categories } from '@/data/categories';
import { useParams, usePathname } from 'next/navigation';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

type Platform = 'excel' | 'sheets';

interface FormulaResult {
  formula: string;
  explanation: string[];
  example: string;
  notes: string[];
}

const EXAMPLE_PROMPTS: Record<string, string[]> = {
  zh: [
    '求A列所有大于100的数字之和',
    '判断B2单元格是否大于等于60，大于等于返回"及格"否则返回"不及格"',
    '提取C2单元格中第一个空格前的文字',
    '按F列分组求和E列金额',
    '找出A2:A100中最大的三个值',
  ],
  en: [
    'Sum all values in column A greater than 100',
    'If B2 >= 60 return "Pass" else "Fail"',
    'Extract text before first space in C2',
    'Sum E column grouped by F column category',
    'Return top 3 largest values in A2:A100',
  ],
};

function getPrompts(locale: string): string[] {
  if (locale === 'zh') return EXAMPLE_PROMPTS.zh;
  return EXAMPLE_PROMPTS.en;
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function ToolPage() {
  const resolvedParams = useParams() as unknown as { locale: string; slug?: string };
  const pathname = usePathname();
  const pathSlug = (() => {
    const m = pathname.match(/\/tool\/([^/]+)/);
    return m ? m[1] : undefined;
  })();
  const pathLocale = (() => {
    const lm = pathname.match(/^\/([a-z]{2})(\/|$)/);
    const rawLocale = (lm && lm[1]) ? lm[1] : ''; return VALID_LOCALES.includes(rawLocale) ? rawLocale : (resolvedParams?.locale || 'zh');
  })();
  const resolvedLocale = (resolvedParams?.locale && VALID_LOCALES.includes(resolvedParams.locale)) ? resolvedParams.locale : pathLocale;

  const t = useTranslations('tool');
  const breadcrumbT = useTranslations('breadcrumb');
  const sidebarT = useTranslations('sidebar');

  const __toolsT = useTranslations('tools');
  const __i18nSlug = (resolvedParams?.slug ?? pathSlug) as string;
  const tool = getToolBySlug(__i18nSlug as string);

  const __i18nName = (() => {
    const fb = !tool ? '' : (resolvedLocale === 'zh' ? (tool.name ?? '') : (((tool as any).nameEn ?? '') || (tool.name ?? '')));
    if (resolvedLocale === 'zh' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch { /* ignore */ } return null; };
    return tryKey(__i18nSlug + '.name')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.name') : null)
      ?? fb;
  })();
  const __i18nDesc = (() => {
    const fb = !tool ? '' : (resolvedLocale === 'zh' ? (tool.description ?? '') : (((tool as any).descriptionEn ?? '') || (tool.description ?? '')));
    if (resolvedLocale === 'zh' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch { /* ignore */ } return null; };
    return tryKey(__i18nSlug + '.description')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.description') : null)
      ?? fb;
  })();

  const isZh = resolvedLocale === 'zh';
  const relatedTools = tool ? getRelatedTools(tool) : [];
  const { addToHistory } = usePreferencesStore();

  const [request, setRequest] = useState('');
  const [platform, setPlatform] = useState<Platform>('excel');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FormulaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState<number>(() => {
    try {
      const k = getTodayKey();
      const s = localStorage.getItem('excel-formula-count');
      if (s) {
        const obj = JSON.parse(s);
        if (obj.date === k) return Math.max(0, 5 - (obj.count || 0));
      }
    } catch { /* ignore */ }
    return 5;
  });

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

  const consumeAndCheck = (): boolean => {
    try {
      const k = getTodayKey();
      let obj = { date: k, count: 0 };
      const s = localStorage.getItem('excel-formula-count');
      if (s) {
        try {
          const p = JSON.parse(s);
          if (p.date === k) obj = { date: k, count: p.count || 0 };
        } catch { /* ignore */ }
      }
      if (obj.count >= 5) {
        setRemaining(0);
        return false;
      }
      obj.count += 1;
      localStorage.setItem('excel-formula-count', JSON.stringify(obj));
      setRemaining(5 - obj.count);
      return true;
    } catch {
      return true;
    }
  };

  const handleGenerate = async () => {
    if (!request.trim()) {
      setError(isZh ? '请输入公式需求描述' : 'Please describe what you need');
      return;
    }
    if (!consumeAndCheck()) {
      setError(isZh ? '今日免费次数已用完（5次/天），请明天再来或赞助支持' : 'Daily free limit reached (5/day). Please try again tomorrow.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await fetch('/api/excel-formula/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: request.trim(), platform, locale: resolvedLocale }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed');
      setResult(data);
    } catch (e: any) {
      setError(e?.message || (isZh ? '生成失败，请稍后重试' : 'Generation failed, please retry'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRequest('');
    setResult(null);
    setError(null);
  };

  const handleCopyFormula = async () => {
    if (!result?.formula) return;
    try {
      await navigator.clipboard.writeText(result.formula);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const fillExample = (text: string) => {
    setRequest(text);
    setResult(null);
    setError(null);
  };

  if (!tool) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <p className='text-gray-600 dark:text-gray-400'>Tool not found.</p>
      </div>
    );
  }

  const LIMIT_HINT = isZh
    ? `今日剩余免费次数：${remaining} / 5`
    : `Free generations remaining today: ${remaining} / 5`;

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
            {relatedTools.map((rt) => (
              <ToolCard key={rt.id} tool={rt} locale={resolvedLocale} />
            ))}
          </div>
        </aside>

        <main className='lg:col-span-7'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'>
                <Table className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{__i18nName}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{__i18nDesc}</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex flex-wrap items-center gap-3'>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {isZh ? '目标平台：' : 'Target platform:'}
                </span>
                <div className='inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => setPlatform('excel')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium min-h-[36px] transition-colors ${
                      platform === 'excel'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Microsoft Excel
                  </button>
                  <button
                    type='button'
                    onClick={() => setPlatform('sheets')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium min-h-[36px] transition-colors ${
                      platform === 'sheets'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Google Sheets
                  </button>
                </div>
                <span className='ml-auto text-xs text-gray-500 dark:text-gray-400'>{LIMIT_HINT}</span>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {isZh ? '用自然语言描述你的公式需求' : 'Describe your formula in natural language'}
                </label>
                <textarea
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder={
                    isZh
                      ? '例如：求A2:A100中大于80且小于90的所有数字的平均值'
                      : 'e.g. Average of A2:A100 where value > 80 and < 90'
                  }
                  className='w-full h-28 sm:h-36 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
              </div>

              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <Lightbulb className='h-4 w-4 text-amber-500 shrink-0' />
                  <span className='text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400'>
                    {isZh ? '快速示例（点击填充）：' : 'Quick examples (click to fill):'}
                  </span>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {getPrompts(resolvedLocale).map((p, i) => (
                    <button
                      key={i}
                      type='button'
                      onClick={() => fillExample(p)}
                      className='px-3 py-1.5 text-xs rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors min-h-[32px]'
                    >
                      {p.length > 36 ? p.slice(0, 36) + '…' : p}
                    </button>
                  ))}
                </div>
              </div>

              <div className='flex flex-wrap gap-3 pt-1'>
                <button
                  onClick={handleGenerate}
                  disabled={loading || remaining <= 0}
                  className='flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]'
                >
                  <Sparkles className='h-4 w-4 sm:h-5 sm:w-5' />
                  <span>
                    {loading
                      ? (isZh ? '生成中...' : 'Generating...')
                      : (isZh ? '生成公式' : 'Generate Formula')}
                  </span>
                </button>
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className='flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors min-h-[44px]'
                >
                  <RotateCcw className='h-4 w-4 sm:h-5 sm:w-5' />
                  {isZh ? '再试一个' : 'Try another'}
                </button>
              </div>

              {error && (
                <div className='p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30'>
                  <p className='text-sm text-red-700 dark:text-red-300'>{error}</p>
                </div>
              )}

              {result && (
                <div className='mt-2 space-y-4'>
                  <div className='p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300'>
                        {isZh ? '生成的公式' : 'Generated Formula'}
                      </span>
                      <button
                        onClick={handleCopyFormula}
                        className='inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs sm:text-sm min-h-[32px]'
                      >
                        {copied ? <Check className='h-3.5 w-3.5 text-green-500' /> : <Copy className='h-3.5 w-3.5' />}
                        {copied ? (isZh ? '已复制' : 'Copied') : (isZh ? '复制公式' : 'Copy')}
                      </button>
                    </div>
                    <div className='p-3 rounded-lg bg-gray-900 dark:bg-black/60 text-green-300 dark:text-green-400 font-mono text-sm sm:text-base break-all'>
                      {result.formula || (isZh ? '（无公式输出，请重试）' : '(empty output, please retry)')}
                    </div>
                  </div>

                  {result.explanation && result.explanation.length > 0 && (
                    <div className='p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/20'>
                      <h3 className='text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2'>
                        {isZh ? '逐步解释' : 'Step-by-step Explanation'}
                      </h3>
                      <ol className='list-decimal list-inside space-y-1.5'>
                        {result.explanation.map((s, i) => (
                          <li key={i} className='text-xs sm:text-sm text-blue-700 dark:text-blue-300/90 leading-relaxed'>{s}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {result.example && (
                    <div className='p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-900/20'>
                      <h3 className='text-sm font-semibold text-purple-800 dark:text-purple-300 mb-1.5'>
                        {isZh ? '示例用法' : 'Usage Example'}
                      </h3>
                      <p className='text-xs sm:text-sm text-purple-700 dark:text-purple-300/90 leading-relaxed'>
                        {result.example}
                      </p>
                    </div>
                  )}

                  {result.notes && result.notes.length > 0 && (
                    <div className='p-3 sm:p-4 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/20'>
                      <h3 className='text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2'>
                        {isZh ? '注意事项' : 'Notes & Caveats'}
                      </h3>
                      <ul className='list-disc list-inside space-y-1.5'>
                        {result.notes.map((n, i) => (
                          <li key={i} className='text-xs sm:text-sm text-amber-700 dark:text-amber-300/90 leading-relaxed'>{n}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <aside className='lg:col-span-3'>
          <div className='card p-4 sm:p-6 space-y-4'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{isZh ? '使用指南' : 'Quick Guide'}</h3>
            <ol className='list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
              <li>{isZh ? '选择目标平台：Excel 或 Google Sheets' : 'Choose target platform: Excel or Google Sheets'}</li>
              <li>{isZh ? '用日常语言描述你要实现的计算逻辑' : 'Describe the calculation logic in plain words'}</li>
              <li>{isZh ? '点击「生成公式」，AI 自动输出公式+解释' : 'Click Generate — AI outputs formula + explanation'}</li>
              <li>{isZh ? '复制公式直接粘贴到单元格里使用' : 'Copy and paste directly into your cell'}</li>
            </ol>
            <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
              <p className='text-xs text-gray-500 dark:text-gray-500 leading-relaxed'>
                {isZh
                  ? '💡 小技巧：描述越具体越好（引用列名/数据范围）。不熟悉英文函数名也没关系，中文直接写。'
                  : '💡 Tip: be specific — mention column letters or ranges. Works with plain words; no prior function knowledge needed.'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
