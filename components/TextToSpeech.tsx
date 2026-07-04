'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Square,
  Download,
  Settings,
  Type,
  Gauge,
  Mic2,
  RotateCcw,
} from 'lucide-react';

interface TextToSpeechProps {
  locale?: string;
}

const presetTexts: Record<string, string>[] = [
  {
    zh: '你好，欢迎使用文字转语音工具！',
    en: 'Hello, welcome to text to speech!',
    hi: 'नमस्ते, टेक्स्ट टू स्पीच टूल में आपका स्वागत है!',
    fr: 'Bonjour, bienvenue dans l\'outil de synthèse vocale !',
    es: '¡Hola, bienvenido a la herramienta de texto a voz!',
    ar: 'مرحباً، أهلاً بك في أداة تحويل النص إلى كلام!',
  },
  {
    zh: '今天天气真好，适合出去散步。',
    en: 'The weather is nice today, perfect for a walk.',
    hi: 'आज मौसम बहुत अच्छा है, टहलने के लिए बिल्कुल सही है।',
    fr: 'Il fait beau aujourd\'hui, parfait pour une promenade.',
    es: 'Hace buen tiempo hoy, perfecto para dar un paseo.',
    ar: 'الطقس جميل اليوم، مثالي للمشي في الخارج.',
  },
  {
    zh: '第 1 章 从前有座山，山里有座庙...',
    en: 'Chapter 1 Once upon a time...',
    hi: 'अध्याय 1 एक समय की बात है...',
    fr: 'Chapitre 1 Il était une fois...',
    es: 'Capítulo 1 Érase una vez...',
    ar: 'الفصل 1 كان هناك في قديم الزمان...',
  },
];

export default function TextToSpeech({ locale = 'zh' }: TextToSpeechProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      title: '文字转语音',
      subtitle: '输入文字即可朗读，支持调节语速、音调和音量，听小说、听新闻神器',
      inputText: '输入文字',
      placeholder: '在这里输入要朗读的文字...',
      speed: '语速',
      pitch: '音调',
      volume: '音量',
      voice: '声音',
      play: '播放',
      pause: '暂停',
      resume: '继续',
      stop: '停止',
      reset: '重置',
      presets: '示例文本',
      tip: '💡 提示：使用浏览器内置语音合成引擎，完全免费，离线可用。不同浏览器和系统支持的声音可能不同。',
      features: '功能特点',
      f1: '完全免费，无使用限制',
      f2: '可调节语速、音调、音量',
      f3: '多种系统语音可选',
      f4: '离线可用，保护隐私',
      f5: '支持暂停/继续/停止',
      f6: '手机浏览器也能用',
      slow: '慢',
      fast: '快',
      low: '低',
      high: '高',
      charCount: '字数',
      noVoice: '（系统未检测到可用语音）',
    },
    en: {
      title: 'Text to Speech',
      subtitle: 'Convert text to natural speech. Adjust speed, pitch, and volume.',
      inputText: 'Enter Text',
      placeholder: 'Enter text to read aloud...',
      speed: 'Speed',
      pitch: 'Pitch',
      volume: 'Volume',
      voice: 'Voice',
      play: 'Play',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      reset: 'Reset',
      presets: 'Presets',
      tip: '💡 Tip: Uses your browser\'s built-in speech engine. 100% free and works offline.',
      features: 'Features',
      f1: '100% free, no limits',
      f2: 'Adjustable speed, pitch, volume',
      f3: 'Multiple system voices',
      f4: 'Works offline, private',
      f5: 'Pause / resume / stop',
      f6: 'Works on mobile browsers',
      slow: 'Slow',
      fast: 'Fast',
      low: 'Low',
      high: 'High',
      charCount: 'Characters',
      noVoice: '(No voices available on your system)',
    },
    hi: {
      title: 'टेक्स्ट टू स्पीच',
      subtitle: 'टेक्स्ट को प्राकृतिक आवाज़ में बदलें। गति, स्वर और आवाज़ की मात्रा समायोजित करें।',
      inputText: 'टेक्स्ट दर्ज करें',
      placeholder: 'ज़ोर से पढ़ने के लिए टेक्स्ट दर्ज करें...',
      speed: 'गति',
      pitch: 'स्वर',
      volume: 'आवाज़ की मात्रा',
      voice: 'आवाज़',
      play: 'चलाएँ',
      pause: 'रोकें',
      resume: 'जारी रखें',
      stop: 'बंद करें',
      reset: 'रीसेट',
      presets: 'पूर्व निर्धारित',
      tip: '💡 सुझाव: आपके ब्राउज़र के अंतर्निहित स्पीच इंजन का उपयोग करता है। 100% मुफ्त और ऑफलाइन काम करता है।',
      features: 'विशेषताएँ',
      f1: '100% मुफ्त, कोई सीमा नहीं',
      f2: 'समायोज्य गति, स्वर, आवाज़ की मात्रा',
      f3: 'कई सिस्टम आवाज़ें',
      f4: 'ऑफलाइन काम करता है, निजी',
      f5: 'रोकें / जारी रखें / बंद करें',
      f6: 'मोबाइल ब्राउज़रों पर भी काम करता है',
      slow: 'धीमा',
      fast: 'तेज़',
      low: 'कम',
      high: 'ज़्यादा',
      charCount: 'अक्षर',
      noVoice: '(आपके सिस्टम पर कोई आवाज़ उपलब्ध नहीं)',
    },
    fr: {
      title: 'Texte en Parole',
      subtitle: 'Convertissez du texte en parole naturelle. Ajustez la vitesse, la hauteur et le volume.',
      inputText: 'Saisir le Texte',
      placeholder: 'Entrez le texte à lire à haute voix...',
      speed: 'Vitesse',
      pitch: 'Hauteur',
      volume: 'Volume',
      voice: 'Voix',
      play: 'Lire',
      pause: 'Pause',
      resume: 'Reprendre',
      stop: 'Arrêter',
      reset: 'Réinitialiser',
      presets: 'Préréglages',
      tip: '💡 Astuce : Utilise le moteur vocal intégré de votre navigateur. 100% gratuit et fonctionne hors ligne.',
      features: 'Fonctionnalités',
      f1: '100% gratuit, sans limites',
      f2: 'Vitesse, hauteur, volume réglables',
      f3: 'Plusieurs voix système',
      f4: 'Fonctionne hors ligne, confidentiel',
      f5: 'Pause / reprise / arrêt',
      f6: 'Fonctionne sur les navigateurs mobiles',
      slow: 'Lent',
      fast: 'Rapide',
      low: 'Bas',
      high: 'Haut',
      charCount: 'Caractères',
      noVoice: '(Aucune voix disponible sur votre système)',
    },
    es: {
      title: 'Texto a Voz',
      subtitle: 'Convierte texto en voz natural. Ajusta la velocidad, el tono y el volumen.',
      inputText: 'Introducir Texto',
      placeholder: 'Escribe el texto para leer en voz alta...',
      speed: 'Velocidad',
      pitch: 'Tono',
      volume: 'Volumen',
      voice: 'Voz',
      play: 'Reproducir',
      pause: 'Pausa',
      resume: 'Continuar',
      stop: 'Detener',
      reset: 'Restablecer',
      presets: 'Ajustes preestablecidos',
      tip: '💡 Consejo: Utiliza el motor de voz integrado de tu navegador. 100% gratuito y funciona sin conexión.',
      features: 'Características',
      f1: '100% gratuito, sin límites',
      f2: 'Velocidad, tono y volumen ajustables',
      f3: 'Múltiples voces del sistema',
      f4: 'Funciona sin conexión, privado',
      f5: 'Pausar / continuar / detener',
      f6: 'Funciona en navegadores móviles',
      slow: 'Lento',
      fast: 'Rápido',
      low: 'Bajo',
      high: 'Alto',
      charCount: 'Caracteres',
      noVoice: '(No hay voces disponibles en tu sistema)',
    },
    ar: {
      title: 'النص إلى كلام',
      subtitle: 'حوّل النص إلى كلام طبيعي. اضبط السرعة والنغمة ومستوى الصوت.',
      inputText: 'أدخل النص',
      placeholder: 'أدخل النص المراد قراءته بصوت عالٍ...',
      speed: 'السرعة',
      pitch: 'النغمة',
      volume: 'مستوى الصوت',
      voice: 'الصوت',
      play: 'تشغيل',
      pause: 'إيقاف مؤقت',
      resume: 'متابعة',
      stop: 'إيقاف',
      reset: 'إعادة ضبط',
      presets: 'نصوص مقترحة',
      tip: '💡 نصيحة: يستخدم محرك الكلام المدمج في المتصفح. مجاني 100% ويعمل دون اتصال بالإنترنت.',
      features: 'الميزات',
      f1: 'مجاني 100%، بدون قيود',
      f2: 'سرعة ونغمة وصوت قابل للتعديل',
      f3: 'عدة أصوات نظام متاحة',
      f4: 'يعمل دون اتصال، خاص وآمن',
      f5: 'إيقاف مؤقت / متابعة / إيقاف',
      f6: 'يعمل على متصفحات الهواتف المحمولة',
      slow: 'بطيء',
      fast: 'سريع',
      low: 'منخفض',
      high: 'عالي',
      charCount: 'الأحرف',
      noVoice: '(لا توجد أصوات متاحة على نظامك)',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string) => dict[key] ?? translations.zh[key] ?? key;
  };

  const t = getT(locale);

  const getPresetText = (p: Record<string, string>) => p[locale] ?? p.en ?? p.zh;
  const getDefaultText = () => {
    const def = presetTexts[0];
    return def[locale] ?? def.en ?? def.zh;
  };

  const [text, setText] = useState(getDefaultText());
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const zhVoice = availableVoices.findIndex(v => v.lang.startsWith('zh'));
      const enVoice = availableVoices.findIndex(v => v.lang.startsWith('en'));
      if (locale === 'zh' && zhVoice >= 0) {
        setSelectedVoiceIndex(zhVoice);
      } else if (locale !== 'zh' && enVoice >= 0) {
        setSelectedVoiceIndex(enVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [locale]);

  const speak = () => {
    if (!text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    if (voices[selectedVoiceIndex]) {
      utterance.voice = voices[selectedVoiceIndex];
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const reset = () => {
    stop();
    setRate(1);
    setPitch(1);
    setVolume(1);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25'>
                <Volume2 className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                    <Type className='w-4 h-4 text-violet-500' />
                    {t('inputText')}
                  </label>
                  <span className='text-xs text-gray-400'>{t('charCount')}: {text.length}</span>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('placeholder')}
                  rows={6}
                  className='w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500'
                />
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2'>
                  {t('presets')}
                </label>
                <div className='flex flex-wrap gap-2'>
                  {presetTexts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setText(getPresetText(p))}
                      className='px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors'
                    >
                      {getPresetText(p).slice(0, 20) + '...'}
                    </button>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                      <Gauge className='w-4 h-4 text-violet-500' />
                      {t('speed')}
                    </label>
                    <span className='text-xs text-violet-600 dark:text-violet-400 font-medium'>{rate.toFixed(1)}x</span>
                  </div>
                  <input
                    type='range'
                    min='0.5'
                    max='2'
                    step='0.1'
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500'
                  />
                  <div className='flex justify-between mt-1 text-xs text-gray-400'>
                    <span>0.5x</span>
                    <span>1x</span>
                    <span>2x</span>
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                      <Mic2 className='w-4 h-4 text-violet-500' />
                      {t('pitch')}
                    </label>
                    <span className='text-xs text-violet-600 dark:text-violet-400 font-medium'>{pitch.toFixed(1)}</span>
                  </div>
                  <input
                    type='range'
                    min='0.5'
                    max='2'
                    step='0.1'
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500'
                  />
                  <div className='flex justify-between mt-1 text-xs text-gray-400'>
                    <span>{t('low')}</span>
                    <span>1</span>
                    <span>{t('high')}</span>
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                      <Volume2 className='w-4 h-4 text-violet-500' />
                      {t('volume')}
                    </label>
                    <span className='text-xs text-violet-600 dark:text-violet-400 font-medium'>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.1'
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500'
                  />
                  <div className='flex justify-between mt-1 text-xs text-gray-400'>
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {voices.length > 0 && (
                <div>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2 flex items-center gap-2'>
                    <Settings className='w-4 h-4 text-violet-500' />
                    {t('voice')}
                  </label>
                  <select
                    value={selectedVoiceIndex}
                    onChange={(e) => setSelectedVoiceIndex(parseInt(e.target.value))}
                    className='w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500'
                  >
                    {voices.map((voice, i) => (
                      <option key={i} value={i}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className='flex flex-wrap gap-3'>
                {!isPlaying ? (
                  <button
                    onClick={speak}
                    disabled={!text.trim()}
                    className='flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  >
                    <Play className='h-5 w-5' />
                    {t('play')}
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={resume}
                    className='flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all'
                  >
                    <Play className='h-5 w-5' />
                    {t('resume')}
                  </button>
                ) : (
                  <button
                    onClick={pause}
                    className='flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all'
                  >
                    <Pause className='h-5 w-5' />
                    {t('pause')}
                  </button>
                )}
                <button
                  onClick={stop}
                  disabled={!isPlaying && !isPaused}
                  className='flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  <Square className='h-5 w-5' />
                  {t('stop')}
                </button>
                <button
                  onClick={reset}
                  className='flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                >
                  <RotateCcw className='h-5 w-5' />
                  {t('reset')}
                </button>
              </div>

              <div className='p-3 sm:p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-violet-700 dark:text-violet-300'>
                  {t('tip')}
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-3'>
              {['f1', 'f2', 'f3', 'f4', 'f5', 'f6'].map((key, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0' />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
