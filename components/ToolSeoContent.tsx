'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { buildToolFaqsFromTranslator, hasToolSpecificFaqs, resolveToolNameClient, resolveToolDescriptionClient, type FaqItem, type ToolLike } from '@/lib/toolFaqs';
import { getToolBySlug } from '@/data/tools';

export default function ToolSeoContent({ locale, slug }: { locale: string; slug: string }) {
  const toolsT = useTranslations('tools');
  const toolT = useTranslations('tool');
  const tcT = useTranslations('toolcard');

  const tool = useMemo<ToolLike | undefined>(() => {
    try { return getToolBySlug(slug) as ToolLike; }
    catch { return undefined; }
  }, [slug]);

  const { faqs, toolName, toolDescription, seo } = useMemo(() => {
    const baseTool: ToolLike = tool || { slug, name: slug, nameEn: slug };
    const nm = resolveToolNameClient(locale, baseTool, toolsT);
    const ds = resolveToolDescriptionClient(locale, baseTool, toolsT);

    /* ===========================================================
       per-slug 专属 SEO：try toolsT.raw('{slug}.seo')
       结构：{ intro, scenarios, tutorial, advantages, faqs }
       取不到 → undefined，下方所有渲染走旧 fallback（保证39个模板工具不变）
       =========================================================== */
    let seoRaw: any = undefined;
    try {
      const rawFromSlug = (toolsT as any).raw?.(`${slug}.seo`);
      if (rawFromSlug && typeof rawFromSlug === 'object') seoRaw = rawFromSlug;
    } catch { /* ignore */ }
    if (!seoRaw && String(baseTool.id || '') !== slug) {
      try {
        const rawFromId = (toolsT as any).raw?.(`${String(baseTool.id)}.seo`);
        if (rawFromId && typeof rawFromId === 'object') seoRaw = rawFromId;
      } catch { /* ignore */ }
    }

    /* faqs：有工具特定FAQ(toolFaqs.ts)就用 buildToolFaqsFromTranslator(通用+特定)，否则用 translation.json 的专属 FAQ */
    let items: FaqItem[];
    if (hasToolSpecificFaqs(slug, locale)) {
      items = buildToolFaqsFromTranslator(locale, baseTool, toolsT);
    } else if (Array.isArray(seoRaw?.faqs) && seoRaw.faqs.length > 0) {
      items = seoRaw.faqs
        .filter((x: any) => x && typeof x.q === 'string' && typeof x.a === 'string')
        .map((x: any) => ({ q: String(x.q), a: String(x.a) }));
    } else {
      items = buildToolFaqsFromTranslator(locale, baseTool, toolsT);
    }

    return { faqs: items, toolName: nm, toolDescription: ds, seo: seoRaw };
  }, [locale, slug, tool, toolsT]);

  /* intro 优先 seo.intro，没有就用原 description（保持原 hasGuide 兼容） */
  const introText = seo?.intro && typeof seo.intro === 'string' ? seo.intro : toolDescription;
  const hasGuide = Boolean(introText && (toolName || seo?.intro));

  let scenarios: string[] = [];
  let tutorial: string[] = [];
  let advantages: string[] = [];
  let moneyMaking: string[] = [];
  try {
    /* scenarios/tutorial/advantages/moneyMaking：先走 seo，没走旧 fallback */
    if (seo) {
      if (Array.isArray(seo.scenarios)) scenarios = seo.scenarios.map(String).filter(Boolean);
      if (Array.isArray(seo.tutorial)) tutorial = seo.tutorial.map(String).filter(Boolean);
      if (Array.isArray(seo.advantages)) advantages = seo.advantages.map(String).filter(Boolean);
      if (Array.isArray(seo.moneyMaking)) moneyMaking = seo.moneyMaking.map(String).filter(Boolean);
    }
    if (scenarios.length === 0) {
      scenarios = Array.from({ length: 3 }, (_, i) => {
        try { const v = toolT(`fallback-scenario-${i + 1}`); if (v && v !== `fallback-scenario-${i + 1}`) return v; } catch { /* ignore */ }
        return '';
      }).filter(Boolean);
    }
    if (tutorial.length === 0) {
      tutorial = Array.from({ length: 4 }, (_, i) => {
        try { const v = toolT(`fallback-tutorial-${i + 1}`); if (v && v !== `fallback-tutorial-${i + 1}`) return v; } catch { /* ignore */ }
        return '';
      }).filter(Boolean);
    }
    if (advantages.length === 0) {
      advantages = Array.from({ length: 3 }, (_, i) => {
        try { const v = toolT(`fallback-advantage-${i + 1}`); if (v && v !== `fallback-advantage-${i + 1}`) return v; } catch { /* ignore */ }
        return '';
      }).filter(Boolean);
    }
    if (moneyMaking.length === 0) {
      moneyMaking = Array.from({ length: 3 }, (_, i) => {
        try { const v = toolT(`fallback-money-making-${i + 1}`); if (v && v !== `fallback-money-making-${i + 1}`) return v; } catch { /* ignore */ }
        return '';
      }).filter(Boolean);
    }
  } catch { /* ignore */ }

  const sectionTitleKey = (k: string) => {
    try { const v = toolT(k); if (v && v !== k) return v; } catch { /* ignore */ }
    return k;
  };

  const hintKey = (k: string) => {
    try { const v = toolT(k); if (v && v !== k) return v; } catch { /* ignore */ }
    return '';
  };

  return (
    <section className="mt-10 sm:mt-12 max-w-3xl mx-auto text-sm leading-relaxed text-gray-700 dark:text-gray-300">
      {hasGuide && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
            {sectionTitleKey('features')}
          </h2>
          <p className="mb-4 sm:mb-5 text-gray-600 dark:text-gray-400">
            {introText}
          </p>
          <p className="mb-4 sm:mb-5 text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-50 leading-snug">
            {(() => {
              try {
                const v = (seo as any)?.firstSentence;
                if (typeof v === 'string' && v.trim()) return v;
              } catch { /* ignore */ }
              return '';
            })()}
          </p>
        </>
      )}

      {scenarios.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 mt-6 sm:mt-7">
            {sectionTitleKey('section-scenarios')}
          </h2>
          {hintKey('scenarios-hint') && (
            <p className="mb-2 text-[12px] sm:text-xs text-gray-500 dark:text-gray-500">
              {hintKey('scenarios-hint')}
            </p>
          )}
          <ol className="mb-4 sm:mb-5 space-y-2 list-decimal list-inside pl-1">
            {scenarios.map((s, i) => (
              <li key={'sc-' + i}>{s}</li>
            ))}
          </ol>
        </>
      )}

      {tutorial.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 mt-6 sm:mt-7">
            {sectionTitleKey('section-tutorial')}
          </h2>
          {hintKey('tutorial-hint') && (
            <p className="mb-2 text-[12px] sm:text-xs text-gray-500 dark:text-gray-500">
              {hintKey('tutorial-hint')}
            </p>
          )}
          <ol className="mb-4 sm:mb-5 space-y-2 list-decimal list-inside pl-1">
            {tutorial.map((s, i) => (
              <li key={'tu-' + i}>{s}</li>
            ))}
          </ol>
        {Array.isArray((seo as any)?.howtoSteps) && (seo as any).howtoSteps.length > 0 && (
          <>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 mt-6 sm:mt-7">
              {sectionTitleKey('section-howto')}
            </h2>
            {hintKey('howto-hint') && (
              <p className="mb-2 text-[12px] sm:text-xs text-gray-500 dark:text-gray-500">
                {hintKey('howto-hint')}
              </p>
            )}
            <ol className="mb-4 sm:mb-5 space-y-3 list-decimal list-inside pl-1">
              {((seo as any).howtoSteps as Array<{name?: string; text?: string}>)
                .filter((x) => x && typeof x.name === 'string' && typeof x.text === 'string')
                .map((x, i) => (
                  <li key={'ht-' + i}>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{x.name}.</span>{' '}
                    <span>{x.text}</span>
                  </li>
                ))}
            </ol>
          </>
        )}

        </>
      )}

              {Array.isArray((seo as any)?.stats) && (seo as any).stats.length > 0 && (
          <>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 mt-6 sm:mt-7">
              {sectionTitleKey('section-stats')}
            </h2>
            <dl className="mb-4 sm:mb-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {((seo as any).stats as Array<{k?: string; v?: string}>)
                .filter((x) => x && typeof x.k === 'string' && typeof x.v === 'string')
                .map((x, i) => (
                  <div key={'st-' + i} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 px-3 py-2.5">
                    <dt className="text-[12px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{x.k}</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-0.5">{x.v}</dd>
                  </div>
                ))}
            </dl>
          </>
        )}

        {Array.isArray((seo as any)?.comparison) && (seo as any).comparison.length > 0 && (
          <>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 mt-6 sm:mt-7">
              {sectionTitleKey('section-comparison')}
            </h2>
            <div className="mb-4 sm:mb-5 overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-start py-2 pe-2 font-semibold text-gray-900 dark:text-gray-100">{sectionTitleKey('comparison-us')}</th>
                    <th className="text-start py-2 px-2 font-semibold text-gray-900 dark:text-gray-100">{sectionTitleKey('comparison-them')}</th>
                    <th className="text-start py-2 ps-2 font-semibold text-gray-900 dark:text-gray-100">{sectionTitleKey('comparison-feature')}</th>
                  </tr>
                </thead>
                <tbody>
                  {((seo as any).comparison as Array<{name?: string; us?: string; them?: string; feature?: string}>)
                    .filter((x) => x && typeof x.name === 'string')
                    .map((x, i) => (
                      <tr key={'cp-' + i} className="border-b border-gray-100 dark:border-gray-800 align-top">
                        <td className="py-2 pe-2 font-medium text-gray-900 dark:text-gray-100">{x.us}</td>
                        <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{x.them}</td>
                        <td className="py-2 ps-2 text-gray-500 dark:text-gray-400">{x.feature}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {advantages.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 mt-6 sm:mt-7">
            {sectionTitleKey('section-advantages')}
          </h2>
          {hintKey('advantages-hint') && (
            <p className="mb-2 text-[12px] sm:text-xs text-gray-500 dark:text-gray-500">
              {hintKey('advantages-hint')}
            </p>
          )}
          <ol className="mb-4 sm:mb-5 space-y-2 list-decimal list-inside pl-1">
            {advantages.map((s, i) => (
              <li key={'av-' + i}>{s}</li>
            ))}
          </ol>
        </>
      )}

      {moneyMaking.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 mt-6 sm:mt-7">
            {sectionTitleKey('section-money-making')}
          </h2>
          {hintKey('money-making-hint') && (
            <p className="mb-2 text-[12px] sm:text-xs text-gray-500 dark:text-gray-500">
              {hintKey('money-making-hint')}
            </p>
          )}
          <ol className="mb-4 sm:mb-5 space-y-2 list-decimal list-inside pl-1">
            {moneyMaking.map((s, i) => (
              <li key={'mm-' + i}>{s}</li>
            ))}
          </ol>
        </>
      )}

      {faqs && faqs.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 mt-8 sm:mt-10">
            {(() => {
              try { const v = tcT('faq-heading'); if (v && v !== 'faq-heading') return v; } catch { /* ignore */ }
              try { const v = toolT('faq'); if (v && v !== 'faq') return v; } catch { /* ignore */ }
              const zh = locale === 'zh';
              const hi = locale === 'hi';
              const es = locale === 'es';
              const fr = locale === 'fr';
              const ar = locale === 'ar';
              return zh ? '常见问题' : hi ? 'अक्सर पूछे जाने वाले प्रश्न' : es ? 'Preguntas frecuentes' : fr ? 'Questions fréquentes' : ar ? 'الأسئلة الشائعة' : 'Frequently Asked Questions';
            })()}
          </h2>
          <ol className="space-y-3 sm:space-y-4">
            {faqs.map((f, i) => (
              <li
                key={'faq-' + i}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 px-4 sm:px-5 py-3.5 sm:py-4"
              >
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">
                  {f.q}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-[13px] sm:text-sm leading-relaxed">
                  {f.a}
                </p>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
