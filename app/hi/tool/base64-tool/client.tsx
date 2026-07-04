'use client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Binary, Copy, Check, ArrowUpDown, Upload, Download, Home, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
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
    const fb = tool?.name ?? '';
    if (resolvedLocale === 'zh' || !tool) return fb;
    const tryKey = (k: string) => { try { const v = __toolsT(k); if (v && v !== k) return v; } catch {} return null; };
    return tryKey(__i18nSlug + '.name')
      ?? (tool.id && tool.id !== __i18nSlug ? tryKey(tool.id + '.name') : null)
      ?? fb;
  })();
  const __i18nDesc = (() => {
    const fb = tool?.description ?? '';
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

  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');

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

  const handleEncode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch {
      setOutput('编码失败');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
    } catch {
      setOutput('解码失败：无效的 Base64 字符串');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
    setOutput(input);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileInput(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setFileBase64(result);
      setInput(result);
      setMode('encode');
    };
    reader.readAsDataURL(file);
  };

  const downloadBase64File = () => {
    if (!output.startsWith('data:')) return;
    const link = document.createElement('a');
    link.href = output;
    const ext = output.split(';')[0].split('/')[1] || 'bin';
    link.download = `decoded_file.${ext}`;
    link.click();
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
                <Binary className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{__i18nName}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{__i18nDesc}</p>
              </div>
            </div>

            <div className='flex items-center justify-center gap-2 mb-4 sm:mb-6'>
              <button
                onClick={() => setMode('encode')}
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'encode'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                编码 (Text → Base64)
              </button>
              <button
                onClick={handleSwap}
                className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
              >
                <ArrowUpDown className='h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400' />
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'decode'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                解码 (Base64 → Text)
              </button>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {mode === 'encode' ? '输入文本' : '输入 Base64'}
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? '输入要编码的文本...' : '粘贴 Base64 字符串...'}
                  className='w-full h-48 sm:h-64 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
                <div className='flex gap-2 mt-3'>
                  <button
                    onClick={handleProcess}
                    className='flex-1 btn-primary'
                  >
                    {mode === 'encode' ? '编码' : '解码'}
                  </button>
                  {mode === 'encode' && (
                    <label className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer text-sm'>
                      <Upload className='h-4 w-4' />
                      文件
                      <input type='file' onChange={handleFileUpload} className='hidden' />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {mode === 'encode' ? 'Base64 结果' : '解码结果'}
                  </label>
                  <div className='flex items-center gap-2'>
                    {mode === 'decode' && output.startsWith('data:') && (
                      <button
                        onClick={downloadBase64File}
                        className='flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      >
                        <Download className='h-3 w-3' />
                        下载
                      </button>
                    )}
                    <button
                      onClick={handleCopy}
                      disabled={!output}
                      className='flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
                      {copied ? '已复制' : '复制'}
                    </button>
                  </div>
                </div>
                <textarea
                  value={output}
                  readOnly
                  className='w-full h-48 sm:h-64 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-xs sm:text-sm resize-none'
                />
              </div>
            </div>
          </div>
        </main>
        <aside className='lg:col-span-3'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('guide')}</h3>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
              输入文本或上传文件，一键进行 Base64 编码或解码。支持文本和文件两种模式，完全本地处理。
            </p>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                文本编码 / 解码
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                文件转 Base64
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                一键互换模式
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                复制到剪贴板
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                纯本地处理，安全隐私
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
