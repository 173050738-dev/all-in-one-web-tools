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
  name: string;
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
  { id: '1', name: '新年', date: '2027-01-01', icon: 'sparkles', color: 'from-blue-500 to-cyan-500', isAnnual: true },
  { id: '2', name: '春节', date: '2027-02-06', icon: 'gift', color: 'from-red-500 to-pink-500', isAnnual: false },
  { id: '3', name: '情人节', date: '2027-02-14', icon: 'heart', color: 'from-pink-500 to-rose-500', isAnnual: true },
];

export default function CountdownTimer({ locale = 'zh' }: CountdownProps) {
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
        setDates(JSON.parse(saved));
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
      name: newName.trim(),
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

  const t = {
    title: locale === 'zh' ? '倒计时纪念日' : 'Countdown Timer',
    subtitle: locale === 'zh' ? '记录重要日子，实时倒计时，生日、节日、纪念日一个都不错过' : 'Track important dates. Never miss a birthday or anniversary again!',
    addNew: locale === 'zh' ? '添加纪念日' : 'Add Event',
    eventName: locale === 'zh' ? '事件名称' : 'Event Name',
    eventDate: locale === 'zh' ? '日期' : 'Date',
    icon: locale === 'zh' ? '图标' : 'Icon',
    annual: locale === 'zh' ? '每年重复' : 'Annual',
    save: locale === 'zh' ? '保存' : 'Save',
    cancel: locale === 'zh' ? '取消' : 'Cancel',
    daysLeft: locale === 'zh' ? '还有' : 'In',
    days: locale === 'zh' ? '天' : 'days',
    hours: locale === 'zh' ? '时' : 'h',
    minutes: locale === 'zh' ? '分' : 'm',
    seconds: locale === 'zh' ? '秒' : 's',
    today: locale === 'zh' ? '就是今天！🎉' : 'Today! 🎉',
    passed: locale === 'zh' ? '已过' : 'Ago',
    placeholder: locale === 'zh' ? '输入事件名称...' : 'Enter event name...',
    tip: locale === 'zh' ? '💡 提示：数据保存在本地浏览器中，不会上传到服务器。支持每年重复的纪念日（如生日、节日）。' : '💡 Tip: Data is saved locally in your browser. Support for annual events like birthdays.',
    features: locale === 'zh' ? '功能特点' : 'Features',
    f1: locale === 'zh' ? '实时精确到秒的倒计时' : 'Real-time countdown to the second',
    f2: locale === 'zh' ? '支持每年重复的纪念日' : 'Support for annual events',
    f3: locale === 'zh' ? '多种精美图标可选' : 'Multiple beautiful icons',
    f4: locale === 'zh' ? '本地存储，隐私安全' : 'Local storage, private & secure',
    f5: locale === 'zh' ? '按时间排序显示' : 'Sorted by days left',
    f6: locale === 'zh' ? '完全免费无广告' : '100% free, no ads',
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
                  <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t.title}</h1>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{t.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className='flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all'
              >
                <Plus className='w-4 h-4' />
                <span className='hidden sm:inline'>{t.addNew}</span>
              </button>
            </div>

            <div className='space-y-3 sm:space-y-4'>
              {upcomingDates.length === 0 && passedDates.length === 0 ? (
                <div className='text-center py-12'>
                  <Calendar className='w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4' />
                  <p className='text-gray-500 dark:text-gray-400'>
                    {locale === 'zh' ? '还没有添加任何纪念日' : 'No events yet'}
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className='mt-4 text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline'
                  >
                    {t.addNew}
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
                              <h3 className='font-bold text-lg sm:text-xl'>{item.name}</h3>
                              <p className='text-sm text-white/80'>
                                {item.date}
                                {item.isAnnual && (
                                  <span className='ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs'>
                                    {locale === 'zh' ? '每年' : 'Annual'}
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
                              <span className='text-3xl sm:text-4xl font-bold animate-pulse'>{t.today}</span>
                            </div>
                          ) : (
                            <div className='text-center'>
                              <div className='text-4xl sm:text-5xl font-bold mb-1'>
                                {Math.abs(daysLeft)}
                                <span className='text-xl sm:text-2xl ml-1 font-normal'>{t.days}</span>
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
                        {locale === 'zh' ? '已过期' : 'Past Events'}
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
                                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>{item.name}</p>
                                <p className='text-xs text-gray-400'>{item.date}</p>
                              </div>
                            </div>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-400'>
                                {Math.abs(daysLeft)}{t.days} {t.passed}
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
                {t.tip}
              </p>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t.features}</h3>
            <ul className='space-y-3'>
              {[t.f1, t.f2, t.f3, t.f4, t.f5, t.f6].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0' />
                  {feature}
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
              <h3 className='font-bold text-gray-900 dark:text-gray-100'>{t.addNew}</h3>
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
                  {t.eventName}
                </label>
                <input
                  type='text'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t.placeholder}
                  maxLength={20}
                  className='w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t.eventDate}
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
                  {t.icon}
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
                <span className='text-sm text-gray-700 dark:text-gray-300'>{t.annual}</span>
              </label>
            </div>

            <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex gap-3'>
              <button
                onClick={() => setShowAddModal(false)}
                className='flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium'
              >
                {t.cancel}
              </button>
              <button
                onClick={addDate}
                disabled={!newName.trim() || !newDate}
                className='flex-1 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all'
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
