'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, Play, Pause, RotateCcw, Plus, Minus, Coffee, Target, CheckCircle } from 'lucide-react';

interface FocusTimerProps {
  locale?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '专注计时器',
    subtitle: '番茄工作法，提升专注力',
    work: '工作',
    shortBreak: '短休息',
    longBreak: '长休息',
    start: '开始',
    pause: '暂停',
    reset: '重置',
    pomodoros: '已完成番茄',
    sessionsCompleted: '完成会话',
    totalFocusTime: '总专注时间',
    workDuration: '工作时长',
    shortBreakDuration: '短休息时长',
    longBreakDuration: '长休息时长',
    sessionsBeforeLongBreak: '长休息前会话数',
    skipBreak: '跳过休息',
    nextSession: '下一会话',
    complete: '完成！',
    keepGoing: '继续加油！',
  },
  en: {
    title: 'Focus Timer',
    subtitle: 'Pomodoro technique for better focus',
    work: 'Work',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    pomodoros: 'Pomodoros Completed',
    sessionsCompleted: 'Sessions Completed',
    totalFocusTime: 'Total Focus Time',
    workDuration: 'Work Duration',
    shortBreakDuration: 'Short Break Duration',
    longBreakDuration: 'Long Break Duration',
    sessionsBeforeLongBreak: 'Sessions Before Long Break',
    skipBreak: 'Skip Break',
    nextSession: 'Next Session',
    complete: 'Complete!',
    keepGoing: 'Keep Going!',
  },
  hi: {
    title: 'फोकस टाइमर',
    subtitle: 'पोमोडोरो तकनीक से बेहतर फोकस',
    work: 'काम',
    shortBreak: 'छोटा ब्रेक',
    longBreak: 'लंबा ब्रेक',
    start: 'शुरू करें',
    pause: 'ठहराएं',
    reset: 'रीसेट',
    pomodoros: 'पोमोडोरो पूर्ण',
    sessionsCompleted: 'सत्र पूर्ण',
    totalFocusTime: 'कुल फोकस समय',
    workDuration: 'काम की अवधि',
    shortBreakDuration: 'छोटे ब्रेक की अवधि',
    longBreakDuration: 'लंबे ब्रेक की अवधि',
    sessionsBeforeLongBreak: 'लंबे ब्रेक से पहले सत्र',
    skipBreak: 'ब्रेक छोड़ें',
    nextSession: 'अगला सत्र',
    complete: 'पूर्ण!',
    keepGoing: 'जारी रखें!',
  },
  fr: {
    title: 'Minuteur de Concentration',
    subtitle: 'Technique Pomodoro pour mieux se concentrer',
    work: 'Travail',
    shortBreak: 'Pause Courte',
    longBreak: 'Pause Longue',
    start: 'Démarrer',
    pause: 'Pause',
    reset: 'Réinitialiser',
    pomodoros: 'Pomodoros Terminés',
    sessionsCompleted: 'Sessions Terminées',
    totalFocusTime: 'Temps de Concentration Total',
    workDuration: 'Durée de Travail',
    shortBreakDuration: 'Durée de Pause Courte',
    longBreakDuration: 'Durée de Pause Longue',
    sessionsBeforeLongBreak: 'Sessions Avant Pause Longue',
    skipBreak: 'Sauter la Pause',
    nextSession: 'Prochaine Session',
    complete: 'Terminé !',
    keepGoing: 'Continuez !',
  },
  es: {
    title: 'Temporizador de Enfoque',
    subtitle: 'Técnica Pomodoro para mayor concentración',
    work: 'Trabajo',
    shortBreak: 'Descanso Corto',
    longBreak: 'Descanso Largo',
    start: 'Iniciar',
    pause: 'Pausa',
    reset: 'Reiniciar',
    pomodoros: 'Pomodoros Completados',
    sessionsCompleted: 'Sesiones Completadas',
    totalFocusTime: 'Tiempo de Enfoque Total',
    workDuration: 'Duración del Trabajo',
    shortBreakDuration: 'Duración Descanso Corto',
    longBreakDuration: 'Duración Descanso Largo',
    sessionsBeforeLongBreak: 'Sesiones Antes de Descanso Largo',
    skipBreak: 'Saltar Descanso',
    nextSession: 'Próxima Sesión',
    complete: '¡Completado!',
    keepGoing: '¡Continúa!',
  },
  ar: {
    title: 'مُوقِّت التركيز',
    subtitle: 'تقنية بومودورو لزيادة التركيز',
    work: 'عمل',
    shortBreak: 'استراحة قصيرة',
    longBreak: 'استراحة طويلة',
    start: 'ابدأ',
    pause: 'إيقاف',
    reset: 'إعادة ضبط',
    pomodoros: 'البومودورو المكتملة',
    sessionsCompleted: 'الجلسات المكتملة',
    totalFocusTime: 'مجموع وقت التركيز',
    workDuration: 'مدة العمل',
    shortBreakDuration: 'مدة الاستراحة القصيرة',
    longBreakDuration: 'مدة الاستراحة الطويلة',
    sessionsBeforeLongBreak: 'الجلسات قبل الاستراحة الطويلة',
    skipBreak: 'تخطي الاستراحة',
    nextSession: 'الجلسة التالية',
    complete: 'مكتمل!',
    keepGoing: 'استمر!',
  },
};

type SessionType = 'work' | 'shortBreak' | 'longBreak';

export default function FocusTimer({ locale = 'zh' }: FocusTimerProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;

  const t = (key: string): string => dict[key] ?? i18n.zh[key] ?? key;

  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);

  const currentDuration = useMemo(() => {
    switch (sessionType) {
      case 'work': return workDuration * 60;
      case 'shortBreak': return shortBreakDuration * 60;
      case 'longBreak': return longBreakDuration * 60;
    }
  }, [sessionType, workDuration, shortBreakDuration, longBreakDuration]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSessionComplete();
          return currentDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentDuration]);

  const handleSessionComplete = useCallback(() => {
    if (sessionType === 'work') {
      setCompletedSessions((prev) => prev + 1);
      setTotalFocusSeconds((prev) => prev + workDuration * 60);

      const newCompleted = completedSessions + 1;
      if (newCompleted % sessionsBeforeLongBreak === 0) {
        setSessionType('longBreak');
      } else {
        setSessionType('shortBreak');
      }
    } else {
      setSessionType('work');
    }
    setIsRunning(false);
  }, [sessionType, completedSessions, workDuration, sessionsBeforeLongBreak]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(workDuration * 60);
    setSessionType('work');
  }, [workDuration]);

  const skipBreak = useCallback(() => {
    setSessionType('work');
    setTimeLeft(workDuration * 60);
    setIsRunning(false);
  }, [workDuration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / currentDuration) * 100;

  const timerColor = sessionType === 'work'
    ? 'from-red-500 to-orange-500'
    : sessionType === 'shortBreak'
    ? 'from-green-500 to-emerald-500'
    : 'from-blue-500 to-indigo-500';

  const nextSessionText = sessionType === 'work'
    ? `${t('shortBreak')} ${shortBreakDuration}min`
    : `${t('work')} ${workDuration}min`;

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='card p-4 sm:p-6'>
        <div className='flex items-center gap-3 mb-4 sm:mb-6'>
          <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/25'>
            <Clock className='h-5 w-5 sm:h-6 sm:w-6' />
          </div>
          <div>
            <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
          </div>
        </div>

        <div className='space-y-4 sm:space-y-6'>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            <button
              onClick={() => { setSessionType('work'); setTimeLeft(workDuration * 60); setIsRunning(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sessionType === 'work'
                  ? 'text-white bg-gradient-to-br from-red-500 to-orange-500 shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Target className='h-4 w-4' />
              {t('work')}
            </button>
            <button
              onClick={() => { setSessionType('shortBreak'); setTimeLeft(shortBreakDuration * 60); setIsRunning(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sessionType === 'shortBreak'
                  ? 'text-white bg-gradient-to-br from-green-500 to-emerald-500 shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Coffee className='h-4 w-4' />
              {t('shortBreak')}
            </button>
            <button
              onClick={() => { setSessionType('longBreak'); setTimeLeft(longBreakDuration * 60); setIsRunning(false); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                sessionType === 'longBreak'
                  ? 'text-white bg-gradient-to-br from-blue-500 to-indigo-500 shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Coffee className='h-4 w-4' />
              {t('longBreak')}
            </button>
            <div className='flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/30'>
              <CheckCircle className='h-4 w-4 text-amber-600 dark:text-amber-400' />
              <span className='text-sm font-semibold text-amber-800 dark:text-amber-300'>{completedSessions}</span>
            </div>
          </div>

          <div className='relative flex items-center justify-center py-8 sm:py-12'>
            <div className='relative w-48 h-48 sm:w-64 sm:h-64'>
              <svg className='w-full h-full -rotate-90'>
                <circle
                  cx='50%'
                  cy='50%'
                  r='45%'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='8'
                  className='text-gray-200 dark:text-gray-700'
                />
                <circle
                  cx='50%'
                  cy='50%'
                  r='45%'
                  fill='none'
                  stroke='url(#timerGradient)'
                  strokeWidth='8'
                  strokeLinecap='round'
                  strokeDasharray={`${progress * 2.83} 283`}
                  className='transition-all duration-1000'
                />
                <defs>
                  <linearGradient id='timerGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' className={`stop-color-${timerColor.split(' ')[0].replace('from-', '')}`} />
                    <stop offset='100%' className={`stop-color-${timerColor.split(' ')[1].replace('to-', '')}`} />
                  </linearGradient>
                </defs>
              </svg>
              <div className='absolute inset-0 flex flex-col items-center justify-center'>
                <span className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${timerColor} bg-clip-text text-transparent`}>
                  {formatTime(timeLeft)}
                </span>
                <span className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  {t(sessionType)}
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-center gap-3'>
            <button
              onClick={toggleTimer}
              className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${timerColor} text-white shadow-lg hover:scale-105 active:scale-95 transition-all`}
            >
              {isRunning ? <Pause className='h-6 w-6' /> : <Play className='h-6 w-6' />}
            </button>
            <button
              onClick={resetTimer}
              className='flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all'
            >
              <RotateCcw className='h-5 w-5' />
            </button>
            {(sessionType === 'shortBreak' || sessionType === 'longBreak') && (
              <button
                onClick={skipBreak}
                className='flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm'
              >
                {t('skipBreak')}
              </button>
            )}
          </div>

          <div className='flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <span>{t('nextSession')}: {nextSessionText}</span>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            <div className='p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'>
              <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('workDuration')}</div>
              <div className='flex items-center gap-2'>
                <button onClick={() => setWorkDuration(Math.max(5, workDuration - 1))} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
                  <Minus className='h-3 w-3' />
                </button>
                <span className='font-semibold text-gray-900 dark:text-gray-100'>{workDuration}min</span>
                <button onClick={() => setWorkDuration(Math.min(120, workDuration + 1))} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
                  <Plus className='h-3 w-3' />
                </button>
              </div>
            </div>
            <div className='p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'>
              <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('shortBreakDuration')}</div>
              <div className='flex items-center gap-2'>
                <button onClick={() => setShortBreakDuration(Math.max(1, shortBreakDuration - 1))} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
                  <Minus className='h-3 w-3' />
                </button>
                <span className='font-semibold text-gray-900 dark:text-gray-100'>{shortBreakDuration}min</span>
                <button onClick={() => setShortBreakDuration(Math.min(30, shortBreakDuration + 1))} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
                  <Plus className='h-3 w-3' />
                </button>
              </div>
            </div>
            <div className='p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'>
              <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('longBreakDuration')}</div>
              <div className='flex items-center gap-2'>
                <button onClick={() => setLongBreakDuration(Math.max(5, longBreakDuration - 1))} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
                  <Minus className='h-3 w-3' />
                </button>
                <span className='font-semibold text-gray-900 dark:text-gray-100'>{longBreakDuration}min</span>
                <button onClick={() => setLongBreakDuration(Math.min(60, longBreakDuration + 1))} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
                  <Plus className='h-3 w-3' />
                </button>
              </div>
            </div>
            <div className='p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'>
              <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>{t('sessionsBeforeLongBreak')}</div>
              <div className='flex items-center gap-2'>
                <button onClick={() => setSessionsBeforeLongBreak(Math.max(2, sessionsBeforeLongBreak - 1))} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
                  <Minus className='h-3 w-3' />
                </button>
                <span className='font-semibold text-gray-900 dark:text-gray-100'>{sessionsBeforeLongBreak}</span>
                <button onClick={() => setSessionsBeforeLongBreak(Math.min(10, sessionsBeforeLongBreak + 1))} className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'>
                  <Plus className='h-3 w-3' />
                </button>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800/30'>
              <span className='text-sm text-green-800 dark:text-green-300'>{t('sessionsCompleted')}</span>
              <span className='text-xl font-bold text-green-700 dark:text-green-400'>{completedSessions}</span>
            </div>
            <div className='flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/30'>
              <span className='text-sm text-blue-800 dark:text-blue-300'>{t('totalFocusTime')}</span>
              <span className='text-xl font-bold text-blue-700 dark:text-blue-400'>
                {Math.floor(totalFocusSeconds / 60)}min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
