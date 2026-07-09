'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';

const LOCALE = 'en';

const TITLES: Record<string, { back: string; home: string; redirecting: string; notfound: string; notfoundDesc: string; }> = {
  zh: { back: '返回工作流列表', home: '首页', redirecting: '正在跳转到新地址...', notfound: '工作流未找到', notfoundDesc: '该工作流不存在或已被移除。' },
  en: { back: 'Back to Workflows', home: 'Home', redirecting: 'Redirecting to new location...', notfound: 'Workflow Not Found', notfoundDesc: 'This workflow does not exist or has been removed.' },
  fr: { back: 'Retour aux Workflows', home: 'Accueil', redirecting: 'Redirection vers la nouvelle adresse...', notfound: 'Workflow Introuvable', notfoundDesc: 'Ce workflow n\'existe pas ou a été supprimé.' },
  es: { back: 'Volver a Flujos', home: 'Inicio', redirecting: 'Redirigiendo a la nueva dirección...', notfound: 'Flujo No Encontrado', notfoundDesc: 'Este flujo no existe o ha sido eliminado.' },
  hi: { back: 'वर्कफ़्लो पर वापस जाएँ', home: 'होम', redirecting: 'नए पते पर पुनर्निर्देशित हो रहा है...', notfound: 'वर्कफ़्लो नहीं मिला', notfoundDesc: 'यह वर्कफ़्लो मौजूद नहीं है या हटा दिया गया है।' },
  ar: { back: 'العودة إلى قوائم سير العمل', home: 'الرئيسية', redirecting: 'جارٍ إعادة التوجيه إلى الموقع الجديد...', notfound: 'سير العمل غير موجود', notfoundDesc: 'سير العمل هذا غير موجود أو تمت إزالته.' },
};

export default function WorkflowDetailClientPage() {
  const search = useSearchParams();
  const slug = search.get('slug') || '';
  const t = TITLES[LOCALE] || TITLES.en;

  useEffect(() => {
    if (!slug) { window.location.replace('/' + LOCALE + '/workflows/'); return; }
    const target = '/' + LOCALE + '/workflow/' + encodeURIComponent(slug) + '/';
    // 301-style client redirect to canonical
    window.location.replace(target);
  }, [slug]);

  if (!slug) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t.notfound}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{t.notfoundDesc}</p>
        <a href={'/' + LOCALE + '/workflows/'} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white min-h-[48px]">
          <ArrowLeft className="h-4 w-4" />{t.back}
        </a>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-600 dark:text-gray-400">
      <p className="text-xl font-medium mb-2">{t.redirecting}</p>
      <p className="text-sm">
        <a className="underline hover:text-primary-600" href={'/' + LOCALE + '/workflows/'}>
          {t.back}
        </a>
        <span className="mx-2">·</span>
        <a className="underline hover:text-primary-600" href={'/' + LOCALE + '/'}>
          {t.home}
        </a>
      </p>
    </div>
  );
}
