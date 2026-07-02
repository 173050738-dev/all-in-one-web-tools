'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Cake,
  Heart,
  Star,
  Flag,
  Gift,
  Sparkles,
  X,
  Edit3,
  Check,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';

interface CountdownDate {
  id: string;
  name: Record<string, string>;
  date: string;
  icon: string;
  color: string;
  isAnnual: boolean;
}

interface CountdownProps {
  locale?: string;
}

const iconOptions = [
  { name: 'cake', icon: Cake, color: 'from-pink-500 to-rose-500' },
  { name: 'heart', icon: Heart, color: 'from-red-500 to-pink-500' },
  { name: 'star', icon: Star, color: 'from-yellow-500 to-orange-500' },
  { name: 'flag', icon: Flag, color: 'from-green-500 to-emerald-500' },
  { name: 'gift', icon: Gift, color: 'from-purple-500 to-violet-500' },
  { name: 'sparkles', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
];

const defaultDates: CountdownDate[] = [
  {
    id: '1',
    name: { zh: '新年', en: 'New Year', hi: 'नया साल', fr: 'Nouvel An', es: 'Año Nuevo', ar: 'رأس السنة' },
    date: '2027-01-01',
    icon: 'sparkles',
    color: 'from-blue-500 to-cyan-500',
    isAnnual: true,
  },
  {
    id: '2',
    name: { zh: '春节', en: 'Spring Festival', hi: 'वसंत उत्सव', fr: 'Fête du Printemps', es: 'Festival de Primavera', ar: 'عيد الربيع' },
    date: '2027-02-06',
    icon: 'gift',
    color: 'from-red-500 to-pink-500',
    isAnnual: false,
  },
  {
    id: '3',
    name: { zh: '情人节', en: 'Valentine\'s Day', hi: 'वेलेंटाइन डे', fr: 'Saint-Valentin', es: 'San Valentín', ar: 'عيد الحب' },
    date: '2027-02-14',
    icon: 'heart',
    color: 'from-pink-500 to-rose-500',
    isAnnual: true,
  },
];

export default function CountdownTimer({ locale = 'zh' }: CountdownProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      title: '倒计时纪念日',
      subtitle: '记录重要日子，实时倒计时，生日、节日、纪念日一个都不错过',
      addNew: '添加纪念日',
      eventName: '事件名称',
      eventDate: '日期',
      icon: '图标',
      annual: '每年重复',
      save: '保存',
      cancel: '取消',
      daysLeft: '还有',
      days: '天',
      hours: '时',
      minutes: '分',
      seconds: '秒',
      today: '就是今天！🎉',
      passed: '已过',
      placeholder: '输入事件名称...',
      tip: '💡 提示：数据保存在本地浏览器中，不会上传到服务器。支持每年重复的纪念日（如生日、节日）。',
      features: '功能特点',
      f1: '实时精确到秒的倒计时',
      f2: '支持每年重复的纪念日',
      f3: '多种精美图标可选',
      f4: '本地存储，隐私安全',
      f5: '按时间排序显示',
      f6: '完全免费无广告',
      noEvents: '还没有添加任何纪念日',
      pastEvents: '已过期',
      annualLabel: '每年',
    },
    en: {
      title: 'Countdown Timer',
      subtitle: 'Track important dates. Never miss a birthday or anniversary again!',
      addNew: 'Add Event',
      eventName: 'Event Name',
      eventDate: 'Date',
      icon: 'Icon',
      annual: 'Annual',
      save: 'Save',
      cancel: 'Cancel',
      daysLeft: 'In',
      days: 'days',
      hours: 'h',
      minutes: 'm',
      seconds: 's',
      today: 'Today! 🎉',
      passed: 'Ago',
      placeholder: 'Enter event name...',
      tip: '💡 Tip: Data is saved locally in your browser. Support for annual events like birthdays.',
      features: 'Features',
      f1: 'Real-time countdown to the second',
      f2: 'Support for annual events',
      f3: 'Multiple beautiful icons',
      f4: 'Local storage, private & secure',
      f5: 'Sorted by days left',
      f6: '100% free, no ads',
      noEvents: 'No events yet',
      pastEvents: 'Past Events',
      annualLabel: 'Annual',
    },
    hi: {
      title: 'काउंटडाउन टाइमर',
      subtitle: 'महत्वपूर्ण तारीखें ट्रैक करें। किसी जन्मदिन या जयंती को मिस न करें!',
      addNew: 'इवेंट जोड़ें',
      eventName: 'इवेंट का नाम',
      eventDate: 'तारीख',
      icon: 'आइकन',
      annual: 'वार्षिक',
      save: 'सेव करें',
      cancel: 'रद्द करें',
      daysLeft: 'में',
      days: 'दिन',
      hours: 'घंटे',
      minutes: 'मिनट',
      seconds: 'सेकंड',
      today: 'आज है! 🎉',
      passed: 'पूरा हुआ',
      placeholder: 'इवेंट का नाम दर्ज करें...',
      tip: '💡 सुझाव: डेटा आपके ब्राउज़र में स्थानीय रूप से सेव होता है। जन्मदिन जैसे वार्षिक इवेंट के लिए सपोर्ट।',
      features: 'विशेषताएँ',
      f1: 'सेकंड तक रीयल-टाइम काउंटडाउन',
      f2: 'वार्षिक इवेंट के लिए सपोर्ट',
      f3: 'कई सुंदर आइकन',
      f4: 'स्थानीय स्टोरेज, निजी और सुरक्षित',
      f5: 'शेष दिनों के अनुसार क्रमबद्ध',
      f6: '100% मुफ्त, कोई विज्ञापन नहीं',
      noEvents: 'अभी कोई इवेंट नहीं',
      pastEvents: 'पिछले इवेंट',
      annualLabel: 'वार्षिक',
    },
    fr: {
      title: 'Compte à Rebours',
      subtitle: 'Suivez les dates importantes. Ne manquez plus jamais un anniversaire !',
      addNew: 'Ajouter un Événement',
      eventName: 'Nom de l\'Événement',
      eventDate: 'Date',
      icon: 'Icône',
      annual: 'Annuel',
      save: 'Enregistrer',
      cancel: 'Annuler',
      daysLeft: 'Dans',
      days: 'j',
      hours: 'h',
      minutes: 'min',
      seconds: 's',
      today: 'Aujourd\'hui ! 🎉',
      passed: 'Il y a',
      placeholder: 'Entrez le nom de l\'événement...',
      tip: '💡 Astuce : Les données sont sauvegardées localement dans votre navigateur. Prend en charge les événements annuels comme les anniversaires.',
      features: 'Fonctionnalités',
      f1: 'Compte à rebours en temps réel à la seconde',
      f2: 'Prise en charge des événements annuels',
      f3: 'Plusieurs belles icônes',
      f4: 'Stockage local, privé et sécurisé',
      f5: 'Trié par jours restants',
      f6: '100% gratuit, sans pub',
      noEvents: 'Aucun événement pour le moment',
      pastEvents: 'Événements Passés',
      annualLabel: 'Annuel',
    },
    es: {
      title: 'Cuenta Regresiva',
      subtitle: '¡Sigue las fechas importantes. Nunca más te pierdas un cumpleaños o aniversario!',
      addNew: 'Agregar Evento',
      eventName: 'Nombre del Evento',
      eventDate: 'Fecha',
      icon: 'Icono',
      annual: 'Anual',
      save: 'Guardar',
      cancel: 'Cancelar',
      daysLeft: 'En',
      days: 'días',
      hours: 'h',
      minutes: 'min',
      seconds: 's',
      today: '¡Hoy! 🎉',
      passed: 'Hace',
      placeholder: 'Introduce el nombre del evento...',
      tip: '💡 Consejo: Los datos se guardan localmente en tu navegador. Soporte para eventos anuales como cumpleaños.',
      features: 'Características',
      f1: 'Cuenta regresiva en tiempo real al segundo',
      f2: 'Soporte para eventos anuales',
      f3: 'Múltiples iconos hermosos',
      f4: 'Almacenamiento local, privado y seguro',
      f5: 'Ordenado por días restantes',
      f6: '100% gratuito, sin anuncios',
      noEvents: 'Aún no hay eventos',
      pastEvents: 'Eventos Pasados',
      annualLabel: 'Anual',
    },
    ar: {
      title: 'عدّاد تنازلي',
      subtitle: 'تتبع التواريخ المهمة. لا تفوت عيد ميلاد أو ذكرى مرة أخرى!',
      addNew: 'إضافة حدث',
      eventName: 'اسم الحدث',
      eventDate: 'التاريخ',
      icon: 'أيقونة',
      annual: 'سنوي',
      save: 'حفظ',
      cancel: 'إلغاء',
      daysLeft: 'بعد',
      days: 'أيام',
      hours: 'س',
      minutes: 'د',
      seconds: 'ث',
      today: 'اليوم! 🎉',
      passed: 'مضت',
      placeholder: 'أدخل اسم الحدث...',
      tip: '💡 نصيحة: يتم حفظ البيانات محلياً في متصفحك. يدعم الأحداث السنوية مثل أعياد الميلاد.',
      features: 'الميزات',
      f1: 'عدّاد تنازلي لحظي بدقة الثانية',
      f2: 'دعم الأحداث السنوية',
      f3: 'عدة أيقونات جميلة',
      f4: 'تخزين محلي، خاص وآمن',
      f5: 'مرتب حسب الأيام المتبقية',
      f6: 'مجاني 100%، بدون إعلانات',
      noEvents: 'لا توجد أحداث بعد',
      pastEvents: 'الأحداث المنتهية',
      annualLabel: 'سنوي',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string) => dict[key] ?? translations.zh[key] ?? key;
  };

  const t = getT(locale);
  const getName = (n: Record<string, string>) => n[locale] ?? n.en ?? n.zh;

  const [dates, setDates] = useState<CountdownDate[]>(defaultDates);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newIcon, setNewIcon] = useState('star');
  const [newIsAnnual, setNewIsAnnual] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('countdown-dates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migrated = parsed.map((d: any) => {
          if (typeof d.name === 'string') {
            return { ...d, name: { zh: d.name, en: d.name, hi: d.name, fr: d.name, es: d.name, ar: d.name } };
          }
          return d;
        });
        setDates(migrated);
      } catch {
        setDates(defaultDates);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('countdown-dates', JSON.stringify(dates));
  }, [dates]);

  const calculateDaysLeft = (targetDateStr: string, isAnnual: boolean) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    if (isAnnual) {
      const thisYear = new Date(today.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      thisYear.setHours(0, 0, 0, 0);
      if (thisYear < today) {
        targetDate = new Date(today.getFullYear() + 1, targetDate.getMonth(), targetDate.getDate());
      } else {
        targetDate = thisYear;
      }
    }

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTimeParts = (targetDateStr: string, isAnnual: boolean) => {
    const now = new Date();
    let targetDate = new Date(targetDateStr);

    if (isAnnual) {
      const thisYear = new Date(now.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      if (thisYear < now) {
        targetDate = new Date(now.getFullYear() + 1, targetDate.getMonth(), targetDate.getDate());
      } else {
        targetDate = thisYear;
      }
    }

    const diff = targetDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const sortedDates = [...dates].sort((a, b) => {
    return calculateDaysLeft(a.date, a.isAnnual) - calculateDaysLeft(b.date, b.isAnnual);
  });

  const addDate = () => {
    if (!newName.trim() || !newDate) return;

    const iconData = iconOptions.find(i => i.name === newIcon) || iconOptions[0];

    const newItem: CountdownDate = {
      id: Date.now().toString(),
      name: {
        zh: newName.trim(),
        en: newName.trim(),
        hi: newName.trim(),
        fr: newName.trim(),
        es: newName.trim(),
        ar: newName.trim(),
      },
      date: newDate,
      icon: newIcon,
      color: iconData.color,
      isAnnual: newIsAnnual,
    };

    setDates([...dates, newItem]);
    setNewName('');
    setNewDate('');
    setNewIcon('star');
    setNewIsAnnual(false);
    setShowAddModal(false);
  };

  const removeDate = (id: string) => {
    setDates(dates.filter(d => d.id !== id));
  };

  const getIconComponent = (iconName: string) => {
    const found = iconOptions.find(i => i.name === iconName);
    return found ? found.icon : Star;
  };

  const getColorClass = (iconName: string) => {
    const found = iconOptions.find(i => i.name === iconName);
    return found ? found.color : 'from-yellow-500 to-orange-500';
  };

  const upcomingDates = sortedDates.filter(d => calculateDaysLeft(d.date, d.isAnnual) >= 0);
  const passedDates = sortedDates.filter(d => calculateDaysLeft(d.date, d.isAnnual) < 0);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-4 sm:mb-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'>
                  <Calendar className='h-5 w-5 sm:h-6 sm:w-6' />
                </div>
                <div>
                  <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className='flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all'
              >
                <Plus className='w-4 h-4' />
                <span className='hidden sm:inline'>{t('addNew')}</span>
              </button>
            </div>

            <div className='space-y-3 sm:space-y-4'>
              {upcomingDates.length === 0 && passedDates.length === 0 ? (
                <div className='text-center py-12'>
                  <Calendar className='w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    {t('noEvents')}
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className='mt-4 text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline'
                  >
                    {t('addNew')}
                  </button>
                </div>
              ) : (
                <>
                  {upcomingDates.map((item) => {
                    const daysLeft = calculateDaysLeft(item.date, item.isAnnual);
                    const timeParts = getTimeParts(item.date, item.isAnnual);
                    const IconComp = getIconComponent(item.icon);
                    const colorClass = getColorClass(item.icon);

                    return (
                      <div
                        key={item.id}
                        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-r ${colorClass} text-white group`}
                      >
                        <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2' />
                        <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2' />

                        <div className='relative z-10 flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='p-2.5 bg-white/20 backdrop-blur rounded-xl'>
                              <IconComp className='w-6 h-6' />
                            </div>
                            <div>
                              <h3 className='font-bold text-lg sm:text-xl'>{getName(item.name)}</h3>
                              <p className='text-sm text-white/80'>
                                {item.date}
                                {item.isAnnual && (
                                  <span className='ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs'>
                                    {t('annualLabel')}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => removeDate(item.id)}
                            className='p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-all'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>

                        <div className='relative z-10 mt-4'>
                          {daysLeft === 0 ? (
                            <div className='text-center py-2'>
                              <span className='text-3xl sm:text-4xl font-bold animate-pulse'>{t('today')}</span>
                            </div>
                          ) : (
                            <div className='text-center'>
                              <div className='text-4xl sm:text-5xl font-bold mb-1'>
                                {Math.abs(daysLeft)}
                                <span className='text-xl sm:text-2xl ml-1 font-normal'>{t('days')}</span>
                              </div>
                              <div className='flex items-center justify-center gap-3 text-white/80 text-sm'>
                                <span className='flex items-center gap-1'>
                                  <Clock className='w-3.5 h-3.5' />
                                  {String(timeParts.hours).padStart(2, '0')}:
                                  {String(timeParts.minutes).padStart(2, '0')}:
                                  {String(timeParts.seconds).padStart(2, '0')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {passedDates.length > 0 && !upcomingDates.every(d => d) && (
                    <div className='mt-6'>
                      <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        {t('pastEvents')}
                      </h3>
                      {passedDates.slice(0, 3).map((item) => {
                        const daysLeft = calculateDaysLeft(item.date, item.isAnnual);
                        const IconComp = getIconComponent(item.icon);
                        const colorClass = getColorClass(item.icon);

                        return (
                          <div
                            key={item.id}
                            className='flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 mb-2 group'
                          >
                            <div className='flex items-center gap-3'>
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass} text-white opacity-60`}>
                                <IconComp className='w-4 h-4' />
                              </div>
                              <div>
                                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>{getName(item.name)}</p>
                                <p className='text-xs text-gray-400'>{item.date}</p>
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-400'>
                                {Math.abs(daysLeft)}{t('days')} {t('passed')}
                              </span>
                              <button
                                onClick={() => removeDate(item.id)}
                                className='p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all'
                              >
                                <Trash2 className='w-3.5 h-3.5' />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className='mt-6 p-3 sm:p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg'>
              <p className='text-xs sm:text-sm text-teal-700 dark:text-teal-300'>
                {t('tip')}
              </p>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-3'>
              {['f1', 'f2', 'f3', 'f4', 'f5', 'f6'].map((key, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0' />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {showAddModal && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => setShowAddModal(false)}>
          <div
            className='w-full sm:max-w-md bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='font-bold text-gray-900 dark:text-gray-100'>{t('addNew')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-4 space-y-4 overflow-y-auto'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('eventName')}
                </label>
                <input
                  type='text'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t('placeholder')}
                  maxLength={20}
                  className='w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('eventDate')}
                </label>
                <input
                  type='date'
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className='w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('icon')}
                </label>
                <div className='flex gap-2 flex-wrap'>
                  {iconOptions.map((opt) => {
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => setNewIcon(opt.name)}
                        className={`p-3 rounded-xl transition-all ${
                          newIcon === opt.name
                            ? `bg-gradient-to-br ${opt.color} text-white shadow-lg scale-110`
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <IconComp className='w-5 h-5' />
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={newIsAnnual}
                  onChange={(e) => setNewIsAnnual(e.target.checked)}
                  className='w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>{t('annual')}</span>
              </label>
            </div>

            <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3'>
              <button
                onClick={() => setShowAddModal(false)}
                className='flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium'
              >
                {t('cancel')}
              </button>
              <button
                onClick={addDate}
                disabled={!newName.trim() || !newDate}
                className='flex-1 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all'
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
