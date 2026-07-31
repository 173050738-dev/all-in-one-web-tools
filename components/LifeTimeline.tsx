'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Download, Calendar, Plus, Trash2, Flag, ChevronRight, Copy, Check, Sparkles } from 'lucide-react';

interface LifeTimelineProps {
  locale?: string;
}

interface Milestone {
  id: string;
  weekIndex: number;
  label: string;
  color: string;
}

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '人生时间轴',
    subtitle: '用一周为单位可视化你的一生',
    birthday: '出生日期',
    lifespan: '预期寿命',
    weeks: '周',
    totalWeeks: '总周数',
    passedWeeks: '已度过',
    remainingWeeks: '剩余',
    percent: '人生进度',
    currentWeek: '当前周',
    addMilestone: '添加标记',
    milestoneLabel: '标记名称',
    milestoneWeek: '周数',
    milestoneColor: '颜色',
    save: '保存',
    cancel: '取消',
    exportPng: '导出 PNG',
    eachCell: '每格 = 1 周',
    milestones: '重要时刻',
    noMilestones: '还没有标记，点击上方按钮添加人生里程碑',
    delete: '删除',
    copied: '已复制到剪贴板',
    shareText: '分享我的人生时间轴',
    week: '第 {n} 周',
    age: '{n} 岁',
    lived: '已度过',
    future: '未来',
    now: '现在',
    reflected: '反思：时间是最宝贵的资源。每一格都是真实的一周。',
    colorPast: '过去',
    colorPresent: '现在',
    colorFuture: '未来',
  },
  en: {
    title: 'Life Timeline',
    subtitle: 'Visualize your life one week at a time',
    birthday: 'Birth Date',
    lifespan: 'Life Expectancy',
    weeks: 'weeks',
    totalWeeks: 'Total Weeks',
    passedWeeks: 'Lived',
    remainingWeeks: 'Remaining',
    percent: 'Life Progress',
    currentWeek: 'Current Week',
    addMilestone: 'Add Milestone',
    milestoneLabel: 'Label',
    milestoneWeek: 'Week',
    milestoneColor: 'Color',
    save: 'Save',
    cancel: 'Cancel',
    exportPng: 'Export PNG',
    eachCell: 'Each cell = 1 week',
    milestones: 'Milestones',
    noMilestones: 'No milestones yet. Add important moments in your life.',
    delete: 'Delete',
    copied: 'Copied to clipboard',
    shareText: 'Share my life timeline',
    week: 'Week {n}',
    age: 'Age {n}',
    lived: 'Lived',
    future: 'Future',
    now: 'Now',
    reflected: 'Reflection: Time is your most precious resource. Each cell is a real week.',
    colorPast: 'Past',
    colorPresent: 'Present',
    colorFuture: 'Future',
  },
  es: {
    title: 'Línea de Tiempo de Vida',
    subtitle: 'Visualiza tu vida semana por semana',
    birthday: 'Fecha de Nacimiento',
    lifespan: 'Esperanza de Vida',
    weeks: 'semanas',
    totalWeeks: 'Semanas Totales',
    passedWeeks: 'Vividas',
    remainingWeeks: 'Restantes',
    percent: 'Progreso de Vida',
    currentWeek: 'Semana Actual',
    addMilestone: 'Añadir Hito',
    milestoneLabel: 'Etiqueta',
    milestoneWeek: 'Semana',
    milestoneColor: 'Color',
    save: 'Guardar',
    cancel: 'Cancelar',
    exportPng: 'Exportar PNG',
    eachCell: 'Cada celda = 1 semana',
    milestones: 'Hitos',
    noMilestones: 'Aún no hay hitos. Añade momentos importantes.',
    delete: 'Eliminar',
    copied: 'Copiado al portapapeles',
    shareText: 'Comparte mi línea de tiempo de vida',
    week: 'Semana {n}',
    age: 'Edad {n}',
    lived: 'Vivido',
    future: 'Futuro',
    now: 'Ahora',
    reflected: 'Reflexión: El tiempo es tu recurso más preciado. Cada celda es una semana real.',
    colorPast: 'Pasado',
    colorPresent: 'Presente',
    colorFuture: 'Futuro',
  },
  fr: {
    title: 'Frise Chronologique de Vie',
    subtitle: 'Visualisez votre vie semaine par semaine',
    birthday: 'Date de Naissance',
    lifespan: 'Espérance de Vie',
    weeks: 'semaines',
    totalWeeks: 'Semaines Totales',
    passedWeeks: 'Vécues',
    remainingWeeks: 'Restantes',
    percent: 'Progression de Vie',
    currentWeek: 'Semaine Actuelle',
    addMilestone: 'Ajouter un Jalon',
    milestoneLabel: 'Étiquette',
    milestoneWeek: 'Semaine',
    milestoneColor: 'Couleur',
    save: 'Enregistrer',
    cancel: 'Annuler',
    exportPng: 'Exporter PNG',
    eachCell: 'Chaque case = 1 semaine',
    milestones: 'Jalons',
    noMilestones: 'Aucun jalon. Ajoutez des moments importants.',
    delete: 'Supprimer',
    copied: 'Copié dans le presse-papier',
    shareText: 'Partager ma frise chronologique',
    week: 'Semaine {n}',
    age: 'Âge {n}',
    lived: 'Vécu',
    future: 'Futur',
    now: 'Maintenant',
    reflected: 'Réflexion : Le temps est votre ressource la plus précieuse. Chaque case est une vraie semaine.',
    colorPast: 'Passé',
    colorPresent: 'Présent',
    colorFuture: 'Futur',
  },
  hi: {
    title: 'जीवन टाइमलाइन',
    subtitle: 'साप्ताहिक रूप में अपने जीवन की कल्पना करें',
    birthday: 'जन्म तिथि',
    lifespan: 'जीवन प्रत्याशा',
    weeks: 'सप्ताह',
    totalWeeks: 'कुल सप्ताह',
    passedWeeks: 'जी चुके',
    remainingWeeks: 'शेष',
    percent: 'जीवन प्रगति',
    currentWeek: 'वर्तमान सप्ताह',
    addMilestone: 'माइलस्टोन जोड़ें',
    milestoneLabel: 'लेबल',
    milestoneWeek: 'सप्ताह',
    milestoneColor: 'रंग',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    exportPng: 'PNG निर्यात',
    eachCell: 'प्रत्येक कक्ष = 1 सप्ताह',
    milestones: 'महत्वपूर्ण क्षण',
    noMilestones: 'अभी कोई माइलस्टोन नहीं। महत्वपूर्ण क्षण जोड़ें।',
    delete: 'हटाएं',
    copied: 'क्लिपबोर्ड पर कॉपी हुआ',
    shareText: 'मेरी जीवन टाइमलाइन साझा करें',
    week: 'सप्ताह {n}',
    age: 'आयु {n}',
    lived: 'जीया',
    future: 'भविष्य',
    now: 'अभी',
    reflected: 'प्रतिबिंब: समय आपका सबसे मूल्यवान संसाधन है। प्रत्येक कक्ष एक वास्तविक सप्ताह है।',
    colorPast: 'अतीत',
    colorPresent: 'वर्तमान',
    colorFuture: 'भविष्य',
  },
  ar: {
    title: 'الجدول الزمني للحياة',
    subtitle: 'تصور حياتك أسبوعاً بأسبوع',
    birthday: 'تاريخ الميلاد',
    lifespan: 'متوسط العمر',
    weeks: 'أسبوع',
    totalWeeks: 'إجمالي الأسابيع',
    passedWeeks: 'عشت',
    remainingWeeks: 'متبقية',
    percent: 'تقدم الحياة',
    currentWeek: 'الأسبوع الحالي',
    addMilestone: 'إضافة معلم',
    milestoneLabel: 'تسمية',
    milestoneWeek: 'الأسبوع',
    milestoneColor: 'اللون',
    save: 'حفظ',
    cancel: 'إلغاء',
    exportPng: 'تصدير PNG',
    eachCell: 'كل خلية = أسبوع واحد',
    milestones: 'المعالم',
    noMilestones: 'لا توجد معالم بعد. أضف لحظات مهمة.',
    delete: 'حذف',
    copied: 'تم النسخ إلى الحافظة',
    shareText: 'مشاركة جدولي الزمني للحياة',
    week: 'الأسبوع {n}',
    age: 'العمر {n}',
    lived: 'عشت',
    future: 'المستقبل',
    now: 'الآن',
    reflected: 'تأمل: الوقت هو أثمن مورد لديك. كل خلية هي أسبوع حقيقي.',
    colorPast: 'الماضي',
    colorPresent: 'الحاضر',
    colorFuture: 'المستقبل',
  },
};

const MILESTONE_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#a855f7', '#ec4899',
];

function getWeeksLived(birthDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - birthDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)));
}

function getAgeYears(birthDate: Date): number {
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) age--;
  return age;
}

export default function LifeTimeline({ locale = 'zh' }: LifeTimelineProps) {
  const t = i18n[locale] || i18n.zh;
  const isRTL = locale === 'ar';

  const [dateStr, setDateStr] = useState('');
  const [lifespan, setLifespan] = useState(80);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newWeek, setNewWeek] = useState(0);
  const [newColor, setNewColor] = useState(MILESTONE_COLORS[0]);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const birthDate = useMemo(() => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d;
  }, [dateStr]);

  const weeksLived = birthDate ? getWeeksLived(birthDate) : 0;
  const totalWeeks = lifespan * 52;
  const currentWeek = weeksLived;

  useEffect(() => {
    if (!birthDate) return;
    const saved = localStorage.getItem(`life-milestones-${dateStr}`);
    if (saved) {
      try {
        setMilestones(JSON.parse(saved));
      } catch {
        setMilestones([]);
      }
    } else {
      setMilestones([]);
    }
  }, [birthDate, dateStr]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 10;
    const gap = 2;
    const cols = 52;
    const rows = lifespan;
    const labelW = 36;
    const labelH = 18;
    const padR = 10;
    const W = labelW + cols * (cellSize + gap) + padR + 80;
    const H = labelH + rows * (cellSize + gap) + 10;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'end';
    for (let r = 0; r < rows; r += 10) {
      const y = labelH + r * (cellSize + gap) + cellSize;
      ctx.fillText(String(r), labelW - 4, y + 3);
    }

    ctx.textAlign = 'center';
    for (let c = 0; c < cols; c += 13) {
      const x = labelW + c * (cellSize + gap) + cellSize / 2;
      ctx.fillText(String(c + 1), x, labelH - 4);
    }

    const milestoneMap = new Map<number, Milestone>();
    milestones.forEach((m) => milestoneMap.set(m.weekIndex, m));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const weekIdx = r * cols + c;
        const x = labelW + c * (cellSize + gap);
        const y = labelH + r * (cellSize + gap);

        const milestone = milestoneMap.get(weekIdx);
        if (milestone) {
          ctx.fillStyle = milestone.color;
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
        } else if (weekIdx < currentWeek) {
          ctx.fillStyle = '#334155';
          ctx.fillRect(x, y, cellSize, cellSize);
        } else if (weekIdx === currentWeek) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(x, y, cellSize, cellSize);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
        } else {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }

    const legendX = labelW + cols * (cellSize + gap) + 20;
    const legendY = labelH;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(t.colorPast, legendX, legendY);
    ctx.fillStyle = '#334155';
    ctx.fillRect(legendX, legendY + 4, 10, 10);

    ctx.fillStyle = '#1e293b';
    ctx.fillText(t.colorPresent, legendX, legendY + 24);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(legendX, legendY + 28, 10, 10);

    ctx.fillStyle = '#1e293b';
    ctx.fillText(t.colorFuture, legendX, legendY + 48);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(legendX, legendY + 52, 10, 10);

    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'end';
    ctx.fillText('Korelyy', W - 6, H - 4);
  }, [birthDate, lifespan, currentWeek, milestones, t]);

  useEffect(() => {
    if (birthDate) draw();
  }, [draw, birthDate]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `life-timeline-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSaveMilestone = () => {
    if (!newLabel.trim() || !birthDate) return;
    const week = Math.max(0, Math.min(totalWeeks - 1, newWeek));
    const milestone: Milestone = {
      id: Date.now().toString(),
      weekIndex: week,
      label: newLabel.trim(),
      color: newColor,
    };
    const updated = [...milestones, milestone];
    setMilestones(updated);
    localStorage.setItem(`life-milestones-${dateStr}`, JSON.stringify(updated));
    setNewLabel('');
    setNewWeek(0);
    setShowAddModal(false);
  };

  const handleDeleteMilestone = (id: string) => {
    const updated = milestones.filter((m) => m.id !== id);
    setMilestones(updated);
    if (birthDate) {
      localStorage.setItem(`life-milestones-${dateStr}`, JSON.stringify(updated));
    }
  };

  const openAddModal = () => {
    if (!birthDate) return;
    setNewWeek(weeksLived);
    setNewLabel('');
    setShowAddModal(true);
  };

  const handleCopyShare = async () => {
    const age = birthDate ? getAgeYears(birthDate) : 0;
    const text = `${t.shareText} - ${t.week}: ${currentWeek}/${totalWeeks} (${percentLived}%), ${t.age}: ${age}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const percentLived = totalWeeks > 0 ? ((weeksLived / totalWeeks) * 100).toFixed(1) : '0';

  const sortedMilestones = useMemo(
    () => [...milestones].sort((a, b) => a.weekIndex - b.weekIndex),
    [milestones]
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

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
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1.5">
            {t.lifespan}: {lifespan} {t.years || ''}
          </label>
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

      {birthDate && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="rounded-xl bg-sky-50 dark:bg-sky-900/20 p-3 text-center">
            <div className="text-xl font-bold text-sky-600 dark:text-sky-400">{weeksLived.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.passedWeeks}</div>
          </div>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
            <div className="text-xl font-bold text-gray-600 dark:text-gray-300">{(totalWeeks - weeksLived).toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.remainingWeeks}</div>
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

      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 mb-4 relative">
        {birthDate ? (
          <div className="overflow-x-auto">
            <canvas ref={canvasRef} className="block" />
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-300 dark:text-gray-600">
            <div className="text-center">
              <Calendar size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">{i18n[locale]?.birthday ? i18n[locale].birthday : '请选择出生日期'}</p>
            </div>
          </div>
        )}
      </div>

      {birthDate && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Flag size={16} className="text-sky-500" />
              {t.milestones} ({milestones.length})
            </h3>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition text-sm font-medium shadow-sm"
            >
              <Plus size={14} />
              {t.addMilestone}
            </button>
          </div>

          {sortedMilestones.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">{t.noMilestones}</p>
          ) : (
            <div className="space-y-2 mb-4">
              {sortedMilestones.map((m) => {
                const age = (m.weekIndex / 52).toFixed(1);
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: m.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{m.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t.week.replace('{n}', String(m.weekIndex))} · {t.age.replace('{n}', age)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMilestone(m.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex-shrink-0"
                      title={t.delete}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-center text-sm text-gray-400 dark:text-gray-500 italic mb-4">{t.reflected}</p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[44px] font-medium shadow-md"
            >
              <Download size={18} />
              {t.exportPng}
            </button>
            <button
              onClick={handleCopyShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-h-[44px] font-medium"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? t.copied : t.shareText}
            </button>
          </div>
        </>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t.addMilestone}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">{t.milestoneLabel}</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder={locale === 'zh' ? '例如：结婚' : 'e.g. Wedding'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-400 outline-none min-h-[44px]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t.milestoneWeek} ({newWeek})
                </label>
                <input
                  type="range"
                  min={0}
                  max={totalWeeks - 1}
                  value={newWeek}
                  onChange={(e) => setNewWeek(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.week.replace('{n}', String(newWeek))} · {t.age.replace('{n}', (newWeek / 52).toFixed(1))}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">{t.milestoneColor}</label>
                <div className="flex gap-2 flex-wrap">
                  {MILESTONE_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewColor(c)}
                      className={`w-9 h-9 rounded-lg transition border-2 ${
                        newColor === c ? 'border-gray-600 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium min-h-[44px]"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveMilestone}
                disabled={!newLabel.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition font-medium min-h-[44px] disabled:opacity-50"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/png" className="hidden" />
    </div>
  );
}