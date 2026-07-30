'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Download, Calendar, Clock, AlertCircle, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

interface LifeWeeksProps {
  locale?: string;
}

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '你的一生进度条', subtitle: '人生 4000 周，看看你已经走过了多少',
    birthday: '生日', lifespan: '预期寿命（岁）', years: '年', lived: '已度过', remaining: '剩余',
    weeks: '周', yearsLived: '年', percent: '已度过',
    download: '下载 PNG', eachWeek: '每格 = 1 周', livedColor: '已度过颜色',
    empty: '请选择你的生日', totalWeeks: '总周数', passed: '已过', left: '剩余',
    reflect: '每一格都是真实的一周。好好珍惜剩下的格子。',
    months: '月', days: '日',
    aiAdvice: 'AI人生建议',
    aiAdviceDesc: '根据你的年龄阶段，AI为你生成专属的反思和建议',
    aiSuggest: 'AI分析',
    aiPrompts: '反思提示',
    aiFail: 'AI暂时不可用，请稍后重试',
    copied: '已复制',
    copy: '复制',
    stageLabel: '人生阶段',
  },
  en: {
    title: 'Your Life in Weeks', subtitle: '4,000 weeks of life — see how many you have lived',
    birthday: 'Birthday', lifespan: 'Life expectancy (years)', years: 'years', lived: 'Lived', remaining: 'Remaining',
    weeks: 'weeks', yearsLived: 'years lived', percent: 'lived',
    download: 'Download PNG', eachWeek: 'Each cell = 1 week', livedColor: 'Lived color',
    empty: 'Please select your birthday', totalWeeks: 'Total weeks', passed: 'Passed', left: 'Remaining',
    reflect: 'Each cell is a real week. Make the remaining ones count.',
    months: 'months', days: 'days',
    aiAdvice: 'AI Life Advice',
    aiAdviceDesc: 'AI-generated reflection and advice based on your life stage',
    aiSuggest: 'AI Analyze',
    aiPrompts: 'Reflection Prompts',
    aiFail: 'AI temporarily unavailable, please retry',
    copied: 'Copied',
    copy: 'Copy',
    stageLabel: 'Life Stage',
  },
  es: {
    title: 'Tu Vida en Semanas', subtitle: '4.000 semanas de vida — mira cuántas has vivido',
    birthday: 'Cumpleaños', lifespan: 'Esperanza de vida (años)', years: 'años', lived: 'Vividas', remaining: 'Restantes',
    weeks: 'semanas', yearsLived: 'años vividos', percent: 'vivido',
    download: 'Descargar PNG', eachWeek: 'Cada celda = 1 semana', livedColor: 'Color vivido',
    empty: 'Selecciona tu cumpleaños', totalWeeks: 'Semanas totales', passed: 'Pasadas', left: 'Restantes',
    reflect: 'Cada celda es una semana real. Aprovecha las que quedan.',
    months: 'meses', days: 'días',
    aiAdvice: 'Consejo de Vida IA',
    aiAdviceDesc: 'Reflexión y consejo generados por IA según tu etapa de vida',
    aiSuggest: 'IA Analizar',
    aiPrompts: 'Preguntas de Reflexión',
    aiFail: 'IA temporalmente no disponible, reintenta',
    copied: 'Copiado',
    copy: 'Copiar',
    stageLabel: 'Etapa de Vida',
  },
  fr: {
    title: 'Votre Vie en Semaines', subtitle: '4 000 semaines de vie — voyez combien vous en avez vécu',
    birthday: 'Anniversaire', lifespan: 'Espérance de vie (ans)', years: 'ans', lived: 'Vécues', remaining: 'Restantes',
    weeks: 'semaines', yearsLived: 'ans vécus', percent: 'vécu',
    download: 'Télécharger PNG', eachWeek: 'Chaque case = 1 semaine', livedColor: 'Couleur vécue',
    empty: 'Veuillez sélectionner votre anniversaire', totalWeeks: 'Semaines totales', passed: 'Passées', left: 'Restantes',
    reflect: 'Chaque case est une vraie semaine. Profitez de celles qui restent.',
    months: 'mois', days: 'jours',
    aiAdvice: 'Conseil de Vie IA',
    aiAdviceDesc: 'Réflexion et conseil générés par IA selon votre étape de vie',
    aiSuggest: 'IA Analyser',
    aiPrompts: 'Questions de Réflexion',
    aiFail: 'IA temporairement indisponible, réessayez',
    copied: 'Copié',
    copy: 'Copier',
    stageLabel: 'Étape de Vie',
  },
  hi: {
    title: 'सप्ताहों में आपका जीवन', subtitle: 'जीवन के 4,000 सप्ताह — देखें आप कितने जी चुके हैं',
    birthday: 'जन्मदिन', lifespan: 'जीवन प्रत्याशा (वर्ष)', years: 'वर्ष', lived: 'जी चुके', remaining: 'शेष',
    weeks: 'सप्ताह', yearsLived: 'वर्ष जीए', percent: 'जीया',
    download: 'PNG डाउनलोड', eachWeek: 'प्रत्येक कक्ष = 1 सप्ताह', livedColor: 'जीवित रंग',
    empty: 'कृपया अपना जन्मदिन चुनें', totalWeeks: 'कुल सप्ताह', passed: 'बीते', left: 'शेष',
    reflect: 'प्रत्येक कक्ष एक वास्तविक सप्ताह है। बाकी को महत्व दें।',
    months: 'महीने', days: 'दिन',
    aiAdvice: 'AI जीवन सलाह',
    aiAdviceDesc: 'आपके जीवन चरण के आधार पर AI-जनरेटेड प्रतिबिंब और सलाह',
    aiSuggest: 'AI विश्लेषण',
    aiPrompts: 'प्रतिबिंब प्रश्न',
    aiFail: 'AI अस्थायी रूप से अनुपलब्ध, पुनः प्रयास करें',
    copied: 'कॉपी हुआ',
    copy: 'कॉपी',
    stageLabel: 'जीवन चरण',
  },
  ar: {
    title: 'حياتك في أسابيع', subtitle: '4000 أسبوع من الحياة — انظر كم عشت منها',
    birthday: 'تاريخ الميلاد', lifespan: 'متوسط العمر (سنة)', years: 'سنة', lived: 'عشت', remaining: 'متبقية',
    weeks: 'أسبوع', yearsLived: 'سنة عشتها', percent: 'عشت',
    download: 'تحميل PNG', eachWeek: 'كل خانة = أسبوع واحد', livedColor: 'لون الأسابيع التي عشتها',
    empty: 'يرجى اختيار تاريخ ميلادك', totalWeeks: 'إجمالي الأسابيع', passed: 'مرت', left: 'متبقية',
    reflect: 'كل خانة هي أسبوع حقيقي. استغل ما تبقى.',
    months: 'شهر', days: 'يوم',
    aiAdvice: 'نصيحة الحياة بالذكاء الاصطناعي',
    aiAdviceDesc: 'تأمل ونصيحة مولدة بالذكاء الاصطناعي بناءً على مرحلة حياتك',
    aiSuggest: 'تحليل بالذكاء الاصطناعي',
    aiPrompts: 'أسئلة للتأمل',
    aiFail: 'الذكاء الاصطناعي غير متاح مؤقتاً، حاول مرة أخرى',
    copied: 'تم النسخ',
    copy: 'نسخ',
    stageLabel: 'مرحلة الحياة',
  },
};

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'];

function getWeeksLived(birthDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - birthDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
}

export default function LifeWeeks({ locale = 'zh' }: LifeWeeksProps) {
  const t = i18n[locale] || i18n.zh;
  const [dateStr, setDateStr] = useState('');
  const [lifespan, setLifespan] = useState(80);
  const [colorIdx, setColorIdx] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [stage, setStage] = useState('');
  const [advice, setAdvice] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [aiError, setAiError] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const birthDate = useMemo(() => {
    if (!dateStr) return null;
    return new Date(dateStr);
  }, [dateStr]);

  const weeksLived = birthDate ? Math.max(0, getWeeksLived(birthDate)) : 0;
  const totalWeeks = lifespan * 52;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !birthDate) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 10;
    const gap = 2;
    const cols = 52;
    const rows = lifespan;
    const labelW = 40;
    const labelH = 20;
    const W = labelW + cols * (cellSize + gap) + 10;
    const H = labelH + rows * (cellSize + gap) + 10;
    canvas.width = W;
    canvas.height = H;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Draw age labels on left
    ctx.fillStyle = '#9ca3af';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'end';
    for (let r = 0; r < rows; r += 10) {
      const y = labelH + r * (cellSize + gap) + cellSize;
      ctx.fillText(String(r), labelW - 4, y + 3);
    }

    // Draw cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const weekIdx = r * cols + c;
        const x = labelW + c * (cellSize + gap);
        const y = labelH + r * (cellSize + gap);

        if (weekIdx < weeksLived) {
          ctx.fillStyle = COLORS[colorIdx];
        } else {
          ctx.fillStyle = '#e5e7eb';
        }
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }

    // Watermark
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'end';
    ctx.fillText('Korelyy', W - 6, H - 4);
  }, [birthDate, weeksLived, lifespan, colorIdx]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (!birthDate) {
      setStage('');
      setAdvice('');
      setPrompts([]);
      setAiError(false);
      return;
    }
    const age = (Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    setAiLoading(true);
    setAiError(false);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/life-weeks-ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ age, lifespan, locale, weeksLived, totalWeeks }),
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const data = await res.json();
          setStage(data.stage || '');
          setAdvice(data.advice || '');
          setPrompts(data.prompts || []);
        } else {
          setAiError(true);
        }
      } catch {
        setAiError(true);
      }
      setAiLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [birthDate, lifespan, locale, weeksLived, totalWeeks]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `life-weeks-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const percentLived = totalWeeks > 0 ? ((weeksLived / totalWeeks) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">{t.birthday}</label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">{t.lifespan}: {lifespan}</label>
          <input
            type="range"
            min={60}
            max={100}
            value={lifespan}
            onChange={(e) => setLifespan(Number(e.target.value))}
            className="w-full mt-3 accent-sky-500"
          />
        </div>
      </div>

      {/* Color picker */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{t.livedColor}:</span>
        {COLORS.map((c, i) => (
          <button
            key={i}
            onClick={() => setColorIdx(i)}
            className={`w-8 h-8 rounded-full transition border-2 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              colorIdx === i ? 'border-gray-400 scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Stats */}
      {birthDate && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="rounded-xl bg-sky-50 dark:bg-sky-900/20 p-3 text-center">
            <div className="text-xl font-bold text-sky-600 dark:text-sky-400">{weeksLived.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.passed} {t.weeks}</div>
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
            <div className="text-xl font-bold text-gray-600 dark:text-gray-300">{(totalWeeks - weeksLived).toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.left} {t.weeks}</div>
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
            <div className="text-xl font-bold text-gray-600 dark:text-gray-300">{totalWeeks.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.totalWeeks}</div>
          </div>
          <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 p-3 text-center">
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{percentLived}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.percent}</div>
          </div>
        </div>
      )}

      {/* Canvas / Empty */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 mb-4">
        {birthDate ? (
          <canvas ref={canvasRef} className="w-full block" style={{ maxWidth: '100%', height: 'auto' }} />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-300 dark:text-gray-600">
            <div className="text-center">
              <Calendar size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">{t.empty}</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Advice Section */}
      {birthDate && (aiLoading || stage || advice || prompts.length > 0 || aiError) && (
        <div className="mb-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-sky-500" />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{t.aiAdvice}</h3>
          </div>
          {aiLoading && (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin" />
              {t.aiSuggest}...
            </div>
          )}
          {!aiLoading && aiError && (
            <div className="text-sm text-amber-600 dark:text-amber-400">{t.aiFail}</div>
          )}
          {!aiLoading && stage && (
            <div className="mb-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t.stageLabel}</span>
              <p className="text-sm font-medium text-sky-600 dark:text-sky-400 mt-0.5" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {stage}
              </p>
            </div>
          )}
          {!aiLoading && advice && (
            <div className="mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {advice}
              </p>
            </div>
          )}
          {!aiLoading && prompts.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.aiPrompts}</p>
              <ul className="space-y-2">
                {prompts.map((p, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 min-h-[36px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    onClick={() => {
                      navigator.clipboard.writeText(p);
                      setCopiedIdx(idx);
                      setTimeout(() => setCopiedIdx(null), 1500);
                    }}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <span className="flex-shrink-0 text-sky-500">•</span>
                    <span>{copiedIdx === idx ? `✓ ${t.copied}` : p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {birthDate && (
        <>
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 italic mb-4">{t.reflect}</p>
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[44px] font-medium shadow-md"
            >
              <Download size={18} />
              {t.download}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
