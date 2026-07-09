'use client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Type, Copy, Check, ArrowUpDown, Home, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getToolBySlug, getRelatedTools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';
import { usePreferencesStore } from '@/stores/preferences';
import { categories } from '@/data/categories';
import { useParams, usePathname } from 'next/navigation';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];
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

  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'case' | 'dedup'>('stats');

  useEffect(() => {
    if (tool) {
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

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    return { chars, charsNoSpace, words, lines, paragraphs, chineseChars, englishChars, digits };
  }, [text]);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toUpperCase = () => setOutput(text.toUpperCase());
  const toLowerCase = () => setOutput(text.toLowerCase());
  const toTitleCase = () => {
    setOutput(text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()));
  };
  const toSentenceCase = () => {
    setOutput(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()));
  };
  const toggleCase = () => {
    setOutput(text.split('').map((c) => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''));
  };

  const removeDuplicateLines = () => {
    const lines = text.split('\n');
    const unique = [...new Set(lines)];
    setOutput(unique.join('\n'));
  };

  const removeEmptyLines = () => {
    setOutput(text.split('\n').filter(l => l.trim()).join('\n'));
  };

  const removeExtraSpaces = () => {
    setOutput(text.replace(/[ \t]+/g, ' ').replace(/^\s+|\s+$/gm, ''));
  };

  const reverseText = () => {
    setOutput(text.split('').reverse().join(''));
  };

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
            {relatedTools.map((t) => (
              <ToolCard key={t.id} tool={t} locale={resolvedLocale} />
            ))}
          </div>
        </aside>
        <main className='lg:col-span-7'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'>
                <Type className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{__i18nName}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{__i18nDesc}</p>
              </div>
            </div>

            <div className='flex gap-1 sm:gap-2 mb-4 sm:mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto'>
              {[
                { key: 'stats', label: 'टेक्स्ट आँकड़े' },
                { key: 'case', label: 'केस कनवर्टर' },
                { key: 'dedup', label: 'डुप्लिकेट हटाएँ / व्यवस्थित' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex-1 min-w-max px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>टेक्स्ट डालें</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='यहाँ अपना टेक्स्ट पेस्ट या टाइप करें...'
                  className='w-full h-56 sm:h-72 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
              </div>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {activeTab === 'stats' ? 'आँकड़े परिणाम' : 'आउटपुट परिणाम'}
                  </label>
                  {activeTab !== 'stats' && (
                    <button
                      onClick={() => handleCopy(output)}
                      disabled={!output}
                      className='flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
                      {copied ? 'कॉपी हो गया' : 'कॉपी करें'}
                    </button>
                  )}
                </div>

                {activeTab === 'stats' && (
                  <div className='h-56 sm:h-72 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto'>
                    <div className='space-y-2.5 sm:space-y-3'>
                      <StatItem label='कुल वर्ण' value={stats.chars} />
                      <StatItem label='वर्ण (स्पेस रहित)' value={stats.charsNoSpace} />
                      <StatItem label='शब्द' value={stats.words} />
                      <StatItem label='पंक्तियाँ' value={stats.lines} />
                      <StatItem label='पैराग्राफ' value={stats.paragraphs} />
                      <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>वर्ण विश्लेषण</p>
                        <div className='space-y-1.5'>
                          <StatItem label='चीनी वर्ण' value={stats.chineseChars} small />
                          <StatItem label='अंग्रेज़ी अक्षर' value={stats.englishChars} small />
                          <StatItem label='अंक' value={stats.digits} small />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab !== 'stats' && (
                  <textarea
                    value={output}
                    readOnly
                    placeholder='परिणाम यहाँ दिखेगा...'
                    className='w-full h-56 sm:h-72 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none'
                  />
                )}
              </div>
            </div>

            {activeTab === 'case' && (
              <div className='mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
                <ActionButton onClick={toUpperCase} disabled={!text}>ऊपरी अक्षर</ActionButton>
                <ActionButton onClick={toLowerCase} disabled={!text}>निचले अक्षर</ActionButton>
                <ActionButton onClick={toTitleCase} disabled={!text}>शीर्षक केस</ActionButton>
                <ActionButton onClick={toSentenceCase} disabled={!text}>वाक्य केस</ActionButton>
                <ActionButton onClick={toggleCase} disabled={!text}>केस उलटें</ActionButton>
                <button
                  onClick={() => { setOutput(text); }}
                  disabled={!text}
                  className='px-3 py-2 rounded-lg text-xs sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  मूल पुनर्स्थापित
                </button>
              </div>
            )}

            {activeTab === 'dedup' && (
              <div className='mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3'>
                <ActionButton onClick={removeDuplicateLines} disabled={!text}>डुप्लिकेट लाइन हटाएँ</ActionButton>
                <ActionButton onClick={removeEmptyLines} disabled={!text}>खाली लाइनें हटाएँ</ActionButton>
                <ActionButton onClick={removeExtraSpaces} disabled={!text}>अतिरिक्त स्पेस हटाएँ</ActionButton>
                <ActionButton onClick={reverseText} disabled={!text}>टेक्स्ट उलटें</ActionButton>
              </div>
            )}
          </div>
        </main>
        <aside className='lg:col-span-3'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('guide')}</h3>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
              टेक्स्ट डालें उसके बाद एक क्रिया चुनें टेक्स्ट आँकड़े、केस कनवर्टर、, डुप्लिकेट हटाएँ / व्यवस्थित और भी। 100% लोकल।
            </p>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                रियल-टाइमटेक्स्ट आँकड़े (वर्ण / शब्द /पंक्तियाँ）
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                5  प्रकार के केस कनवर्टर
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                डुप्लिकेट लाइन हटाएँ / खाली लाइनें हटाएँ
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                CJK + लैटिन मिश्रित विश्लेषण
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                एक क्लिक में कॉपी करें परिणाम
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                केवल स्थानीय, गोपनीयता सुरक्षित
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatItem({ label, value, small = false }: { label: string; value: number; small?: boolean }) {
  return (
    <div className='flex items-center justify-between'>
      <span className={`${small ? 'text-xs' : 'text-xs sm:text-sm'} text-gray-600 dark:text-gray-400`}>{label}</span>
      <span className={`font-mono font-semibold ${small ? 'text-xs text-gray-700 dark:text-gray-300' : 'text-sm sm:text-base text-gray-900 dark:text-gray-100'}`}>{value.toLocaleString()}</span>
    </div>
  );
}

function ActionButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='px-3 py-2 rounded-lg text-xs sm:text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
    >
      {children}
    </button>
  );
}
