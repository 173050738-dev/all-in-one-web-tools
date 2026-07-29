'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Download, Calendar, Clock, AlertCircle } from 'lucide-react';

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
  },
  en: {
    title: 'Your Life in Weeks', subtitle: '4,000 weeks of life — see how many you have lived',
    birthday: 'Birthday', lifespan: 'Life expectancy (years)', years: 'years', lived: 'Lived', remaining: 'Remaining',
    weeks: 'weeks', yearsLived: 'years lived', percent: 'lived',
    download: 'Download PNG', eachWeek: 'Each cell = 1 week', livedColor: 'Lived color',
    empty: 'Please select your birthday', totalWeeks: 'Total weeks', passed: 'Passed', left: 'Remaining',
    reflect: 'Each cell is a real week. Make the remaining ones count.',
    months: 'months', days: 'days',
  },
  es: {
    title: 'Tu Vida en Semanas', subtitle: '4.000 semanas de vida — mira cuántas has vivido',
    birthday: 'Cumpleaños', lifespan: 'Esperanza de vida (años)', years: 'años', lived: 'Vividas', remaining: 'Restantes',
    weeks: 'semanas', yearsLived: 'años vividos', percent: 'vivido',
    download: 'Descargar PNG', eachWeek: 'Cada celda = 1 semana', livedColor: 'Color vivido',
    empty: 'Selecciona tu cumpleaños', totalWeeks: 'Semanas totales', passed: 'Pasadas', left: 'Restantes',
    reflect: 'Cada celda es una semana real. Aprovecha las que quedan.',
    months: 'meses', days: 'días',
  },
  fr: {
    title: 'Votre Vie en Semaines', subtitle: '4 000 semaines de vie — voyez combien vous en avez vécu',
    birthday: 'Anniversaire', lifespan: 'Espérance de vie (ans)', years: 'ans', lived: 'Vécues', remaining: 'Restantes',
    weeks: 'semaines', yearsLived: 'ans vécus', percent: 'vécu',
    download: 'Télécharger PNG', eachWeek: 'Chaque case = 1 semaine', livedColor: 'Couleur vécue',
    empty: 'Veuillez sélectionner votre anniversaire', totalWeeks: 'Semaines totales', passed: 'Passées', left: 'Restantes',
    reflect: 'Chaque case est une vraie semaine. Profitez de celles qui restent.',
    months: 'mois', days: 'jours',
  },
  hi: {
    title: 'सप्ताहों में आपका जीवन', subtitle: 'जीवन के 4,000 सप्ताह — देखें आप कितने जी चुके हैं',
    birthday: 'जन्मदिन', lifespan: 'जीवन प्रत्याशा (वर्ष)', years: 'वर्ष', lived: 'जी चुके', remaining: 'शेष',
    weeks: 'सप्ताह', yearsLived: 'वर्ष जीए', percent: 'जीया',
    download: 'PNG डाउनलोड', eachWeek: 'प्रत्येक कक्ष = 1 सप्ताह', livedColor: 'जीवित रंग',
    empty: 'कृपया अपना जन्मदिन चुनें', totalWeeks: 'कुल सप्ताह', passed: 'बीते', left: 'शेष',
    reflect: 'प्रत्येक कक्ष एक वास्तविक सप्ताह है। बाकी को महत्व दें।',
    months: 'महीने', days: 'दिन',
  },
  ar: {
    title: 'حياتك في أسابيع', subtitle: '4000 أسبوع من الحياة — انظر كم عشت منها',
    birthday: 'تاريخ الميلاد', lifespan: 'متوسط العمر (سنة)', years: 'سنة', lived: 'عشت', remaining: 'متبقية',
    weeks: 'أسبوع', yearsLived: 'سنة عشتها', percent: 'عشت',
    download: 'تحميل PNG', eachWeek: 'كل خانة = أسبوع واحد', livedColor: 'لون الأسابيع التي عشتها',
    empty: 'يرجى اختيار تاريخ ميلادك', totalWeeks: 'إجمالي الأسابيع', passed: 'مرت', left: 'متبقية',
    reflect: 'كل خانة هي أسبوع حقيقي. استغل ما تبقى.',
    months: 'شهر', days: 'يوم',
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
