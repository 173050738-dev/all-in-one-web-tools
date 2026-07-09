'use client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, QrCode, Download, Copy, Check, Upload, Palette, Home, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
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

  const [text, setText] = useState('https://korelyy.com');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

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

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyToClipboard = async () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qrcode.png';
        link.click();
      }
    });
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
                <QrCode className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{__i18nName}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{__i18nDesc}</p>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>محتوى رمز QR</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='أدخل رابطاً أو نصاً أو أي محتوى...'
                    className='w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500'
                  />
                </div>

                <div className='space-y-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <Palette className='h-4 w-4 sm:h-5 sm:w-5 text-gray-500' />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>تنسيق مخصص</span>
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-1'>
                      <label className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>الحجم</label>
                      <span className='text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium'>{size}px</span>
                    </div>
                    <input
                      type='range'
                      min='128'
                      max='512'
                      step='32'
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                      className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1'>المقدمة</label>
                      <div className='flex items-center gap-2'>
                        <input
                          type='color'
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className='w-8 h-8 rounded cursor-pointer border-0'
                        />
                        <input
                          type='text'
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className='flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1'>الخلفية</label>
                      <div className='flex items-center gap-2'>
                        <input
                          type='color'
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className='w-8 h-8 rounded cursor-pointer border-0'
                        />
                        <input
                          type='text'
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className='flex-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>معاينة</label>
                  <div
                    ref={qrRef}
                    className='flex items-center justify-center p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-[200px] sm:min-h-[280px]'
                  >
                    {text ? (
                      <QRCodeCanvas
                        value={text}
                        size={size}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level='H'
                        includeMargin={true}
                      />
                    ) : (
                      <p className='text-gray-400 text-sm'>أدخل محتوى لإنشاء رمز QR</p>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <button
                    onClick={downloadQRCode}
                    disabled={!text}
                    className='flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <Download className='h-4 w-4 sm:h-5 sm:w-5' />
                    تنزيل PNG
                  </button>
                  <button
                    onClick={copyToClipboard}
                    disabled={!text}
                    className='flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    {copied ? <Check className='h-4 w-4 sm:h-5 sm:w-5 text-green-500' /> : <Copy className='h-4 w-4 sm:h-5 sm:w-5' />}
                    {copied ? 'تم النسخ' : 'نسخ الصورة'}
                  </button>
                </div>

                <div className='p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                  <p className='text-xs sm:text-sm text-blue-700 dark:text-blue-300'>
                    💡 تلميح: يدعم الروابط والنص ومعلومات الاتصال وغيرها. عند اختيار الألوان تأكد من التباين الكافي بين المقدمة والخلفية لقراءة سلسة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <aside className='lg:col-span-3'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('guide')}</h3>
            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
              أدخل أي محتوى لإنشاء رمز QR. حجم وألوان قابلة للتخصيص، تنزيل PNG بنقرة واحدة.
            </p>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                أي نص أو رابط
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                حجم مخصص (128–512 بكسل)
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                مقدمة وخلفية مخصصة
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                تنزيل PNG عالي الدقة
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                نسخ إلى الحافظة بنقرة واحدة
              </li>
              <li className='flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                <span className='w-1.5 h-1.5 rounded-full bg-primary-500' />
                توليد محلي وآمن للخصوصية
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
