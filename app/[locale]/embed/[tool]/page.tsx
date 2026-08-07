'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Copy, Check, Code2, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'] as const;

const I18N: Record<string, {
  title: string;
  subtitle: string;
  preview: string;
  embed: string;
  copy: string;
  copied: string;
  fullscreen: string;
  back: string;
  width: string;
  height: string;
  tip: string;
  widthHint: string;
  heightHint: string;
  footer: string;
}> = {
  zh: {
    title: '嵌入此工具到你的网站',
    subtitle: '复制下方代码，粘贴到你的博客或网站 HTML 中即可',
    preview: '实时预览',
    embed: '嵌入代码',
    copy: '复制代码',
    copied: '已复制',
    fullscreen: '在新窗口打开',
    back: '返回工具',
    width: '宽度 (px)',
    height: '高度 (px)',
    tip: '提示：嵌入代码会带上 Korelyy 品牌链接，支持本站免费工具 — 感谢传播！',
    widthHint: '推荐 100% 自适应宽度',
    heightHint: '推荐 600-800px',
    footer: '由 Korelyy 提供 — 免费在线工具',
  },
  en: {
    title: 'Embed this tool on your site',
    subtitle: 'Copy the code below and paste it into your blog or site HTML',
    preview: 'Live Preview',
    embed: 'Embed Code',
    copy: 'Copy Code',
    copied: 'Copied',
    fullscreen: 'Open in new tab',
    back: 'Back to tool',
    width: 'Width (px)',
    height: 'Height (px)',
    tip: 'Tip: The embed includes a small Korelyy branding link — support free tools by sharing!',
    widthHint: 'Recommended 100% responsive',
    heightHint: 'Recommended 600-800px',
    footer: 'Powered by Korelyy — Free Online Tools',
  },
  es: {
    title: 'Incrusta esta herramienta en tu sitio',
    subtitle: 'Copia el código de abajo y pégalo en el HTML de tu blog o sitio',
    preview: 'Vista previa',
    embed: 'Código para incrustar',
    copy: 'Copiar código',
    copied: 'Copiado',
    fullscreen: 'Abrir en nueva pestaña',
    back: 'Volver a la herramienta',
    width: 'Ancho (px)',
    height: 'Alto (px)',
    tip: 'Consejo: el código incluye un pequeño enlace de marca Korelyy — ¡apoya las herramientas gratuitas compartiéndolo!',
    widthHint: 'Recomendado 100% adaptable',
    heightHint: 'Recomendado 600-800px',
    footer: 'Con tecnología de Korelyy — Herramientas gratuitas',
  },
  fr: {
    title: 'Intégrez cet outil sur votre site',
    subtitle: 'Copiez le code ci-dessous et collez-le dans le HTML de votre blog ou site',
    preview: 'Aperçu',
    embed: 'Code d\'intégration',
    copy: 'Copier le code',
    copied: 'Copié',
    fullscreen: 'Ouvrir dans un nouvel onglet',
    back: 'Retour à l\'outil',
    width: 'Largeur (px)',
    height: 'Hauteur (px)',
    tip: 'Astuce : le code inclut un petit lien Korelyy — soutenez les outils gratuits en partageant !',
    widthHint: 'Recommandé 100% adaptatif',
    heightHint: 'Recommandé 600-800px',
    footer: 'Propulsé par Korelyy — Outils en ligne gratuits',
  },
  hi: {
    title: 'इस टूल को अपनी साइट पर एम्बेड करें',
    subtitle: 'नीचे दिया गया कोड कॉपी करें और अपने ब्लॉग या साइट के HTML में पेस्ट करें',
    preview: 'लाइव प्रीव्यू',
    embed: 'एम्बेड कोड',
    copy: 'कोड कॉपी करें',
    copied: 'कॉपी हो गया',
    fullscreen: 'नए टैब में खोलें',
    back: 'टूल पर वापस जाएँ',
    width: 'चौड़ाई (px)',
    height: 'ऊंचाई (px)',
    tip: 'सुझाव: एम्बेड कोड में Korelyy का छोटा ब्रांड लिंक शामिल है — मुफ्त टूल्स का समर्थन करें!',
    widthHint: 'अनुशंसित 100% उत्तरदायी',
    heightHint: 'अनुशंसित 600-800px',
    footer: 'Korelyy द्वारा संचालित — मुफ्त ऑनलाइन टूल्स',
  },
  ar: {
    title: 'تضمين هذه الأداة في موقعك',
    subtitle: 'انسخ الكود أدناه والصقه في HTML لمدونتك أو موقعك',
    preview: 'معاينة مباشرة',
    embed: 'كود التضمين',
    copy: 'نسخ الكود',
    copied: 'تم النسخ',
    fullscreen: 'فتح في علامة تبويب جديدة',
    back: 'العودة إلى الأداة',
    width: 'العرض (px)',
    height: 'الارتفاع (px)',
    tip: 'نصيحة: كود التضمين يتضمن رابط علامة Korelyy التجارية — ادعم الأدوات المجانية بالمشاركة!',
    widthHint: 'موصى به 100% متجاوب',
    heightHint: 'موصى به 600-800px',
    footer: 'مدعوم من Korelyy — أدوات مجانية عبر الإنترنت',
  },
};

export default function EmbedPage() {
  const params = useParams() as { locale?: string; tool?: string };
  const locale = (params.locale && VALID_LOCALES.includes(params.locale as any)) ? params.locale : 'en';
  const tool = (params.tool || 'json-formatter') as string;
  const t = I18N[locale] || I18N.en;
  const isRtl = locale === 'ar';

  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(700);
  const [copied, setCopied] = useState(false);

  const embedUrl = `https://korelyy.com/${locale}/tool/${tool}/?embed=1`;
  const embedCode = useMemo(() =>
    `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" loading="lazy" style="border:1px solid #e5e7eb;border-radius:12px;max-width:100%;" title="${t.title}"></iframe>`,
    [embedUrl, width, height, t.title]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = embedCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t.title}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {t.subtitle}
            </p>
          </div>
          <Link
            href={`/${locale}/tool/${tool}/`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors min-h-[40px]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Code2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{t.embed}</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.width} <span className="text-gray-400">({t.widthHint})</span>
                </label>
                <input
                  type="number"
                  min={300}
                  max={1200}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value) || 800)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t.height} <span className="text-gray-400">({t.heightHint})</span>
                </label>
                <input
                  type="number"
                  min={400}
                  max={1200}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value) || 700)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto whitespace-pre-wrap break-all leading-relaxed" dir="ltr">
                {embedCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors min-h-[36px]"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    {t.copy}
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                {t.tip}
              </p>
            </div>

            <a
              href={`/${locale}/tool/${tool}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t.fullscreen}
            </a>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">{t.preview}</h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 overflow-auto" dir="ltr">
              <iframe
                src={embedUrl}
                width={Math.min(width, 600)}
                height={Math.min(height, 500)}
                frameBorder={0}
                loading="lazy"
                style={{ border: '1px solid #e5e7eb', borderRadius: '12px', maxWidth: '100%' }}
                title={t.title}
              />
            </div>
          </section>
        </div>

        <footer className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          {t.footer}
        </footer>
      </div>
    </div>
  );
}
