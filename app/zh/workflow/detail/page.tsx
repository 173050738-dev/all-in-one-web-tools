'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';
import { workflows } from '@/data/workflows';

const LOCALE = 'zh';

const TITLES: Record<string, { title: string; desc: string; steps: string; back: string; home: string; notfound: string; notfoundDesc: string; }> = {
  zh: { title: '工作流详情', desc: '按步骤顺序执行以下工具即可完成目标。', steps: '步骤', back: '返回工作流列表', home: '首页', notfound: '工作流未找到', notfoundDesc: '该工作流不存在或已被移除。' },
  en: { title: 'Workflow Detail', desc: 'Execute the tools in order to complete your goal.', steps: 'Steps', back: 'Back to Workflows', home: 'Home', notfound: 'Workflow Not Found', notfoundDesc: 'This workflow does not exist or has been removed.' },
  fr: { title: 'Détail du Workflow', desc: 'Exécutez les outils dans l\'ordre pour atteindre votre objectif.', steps: 'Étapes', back: 'Retour aux Workflows', home: 'Accueil', notfound: 'Workflow Introuvable', notfoundDesc: 'Ce workflow n\'existe pas ou a été supprimé.' },
  es: { title: 'Detalle del Flujo', desc: 'Ejecuta las herramientas en orden para alcanzar tu objetivo.', steps: 'Pasos', back: 'Volver a Flujos', home: 'Inicio', notfound: 'Flujo No Encontrado', notfoundDesc: 'Este flujo no existe o ha sido eliminado.' },
  hi: { title: 'वर्कफ़्लो विवरण', desc: 'अपना लक्ष्य प्राप्त करने के लिए क्रम से टूल चलाएँ।', steps: 'चरण', back: 'वर्कफ़्लो पर वापस जाएँ', home: 'होम', notfound: 'वर्कफ़्लो नहीं मिला', notfoundDesc: 'यह वर्कफ़्लो मौजूद नहीं है या हटा दिया गया है।' },
  ar: { title: 'تفاصيل سير العمل', desc: 'نفذ الأدوات بالترتيب لتحقيق هدفك.', steps: 'الخطوات', back: 'العودة إلى قوائم سير العمل', home: 'الرئيسية', notfound: 'سير العمل غير موجود', notfoundDesc: 'سير العمل هذا غير موجود أو تمت إزالته.' },
};

export default function WorkflowDetailClientPage() {
  const search = useSearchParams();
  const slug = search.get('slug') || '';
  const t = TITLES[LOCALE] || TITLES.en;
  const workflow = useMemo(() => workflows.find(w => w.slug === slug), [slug]);

  useEffect(() => {
    if (slug) return;
    window.location.href = '/' + LOCALE + '/workflows/';
  }, [slug]);

  if (!slug) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-600 dark:text-gray-400">Redirecting...</div>;
  }
  if (!workflow) {
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
    <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-xs">
          <li><a href={'/' + LOCALE + '/'} className="flex items-center gap-1 text-gray-500 hover:text-primary-600 min-h-[24px]"><Home className="h-3 w-3" /><span>{t.home}</span></a></li>
          <li aria-hidden="true"><ChevronRight className="h-2.5 w-2.5 text-gray-400 shrink-0" /></li>
          <li><a href={'/' + LOCALE + '/workflows/'} className="text-gray-500 hover:text-primary-600">{t.back}</a></li>
          <li aria-hidden="true"><ChevronRight className="h-2.5 w-2.5 text-gray-400 shrink-0" /></li>
          <li aria-current="page" className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[220px]">{workflow.title}</li>
        </ol>
      </nav>
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{workflow.title}</h1>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{workflow.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800">⏱ {workflow.estimatedTime}</span>
          <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800">🎯 {workflow.difficulty}</span>
          {workflow.tags.map(tag => (<span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800">#{tag}</span>))}
        </div>
      </header>
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t.steps} ({workflow.steps.length})</h2>
        <ol className="space-y-3">
          {workflow.steps.map((step, idx) => (
            <li key={idx} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-sm">{idx + 1}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
