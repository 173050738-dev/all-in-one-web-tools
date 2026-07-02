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

const presetTexts = [
  { zh: '你好，欢迎使用文字转语音工具！', en: 'Hello, welcome to text to speech!' },
  { zh: '今天天气真好，适合出去散步。', en: 'The weather is nice today, perfect for a walk.' },
  { zh: '第 1 章 从前有座山，山里有座庙...', en: 'Chapter 1 Once upon a time...' },
];

export default function TextToSpeech({ locale = 'zh' }: TextToSpeechProps) {
  const [text, setText] = useState(locale === 'zh' ? '你好，欢迎使用文字转语音工具！' : 'Hello, welcome to text to speech!');
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

  const t = {
    title: locale === 'zh' ? '文字转语音' : 'Text to Speech',
    subtitle: locale === 'zh' ? '输入文字即可朗读，支持调节语速、音调和音量，听小说、听新闻神器' : 'Convert text to natural speech. Adjust speed, pitch, and volume.',
    inputText: locale === 'zh' ? '输入文字' : 'Enter Text',
    placeholder: locale === 'zh' ? '在这里输入要朗读的文字...' : 'Enter text to read aloud...',
    speed: locale === 'zh' ? '语速' : 'Speed',
    pitch: locale === 'zh' ? '音调' : 'Pitch',
    volume: locale === 'zh' ? '音量' : 'Volume',
    voice: locale === 'zh' ? '声音' : 'Voice',
    play: locale === 'zh' ? '播放' : 'Play',
    pause: locale === 'zh' ? '暂停' : 'Pause',
    resume: locale === 'zh' ? '继续' : 'Resume',
    stop: locale === 'zh' ? '停止' : 'Stop',
    reset: locale === 'zh' ? '重置' : 'Reset',
    presets: locale === 'zh' ? '示例文本' : 'Presets',
    tip: locale === 'zh' ? '💡 提示：使用浏览器内置语音合成引擎，完全免费，离线可用。不同浏览器和系统支持的声音可能不同。' : '💡 Tip: Uses your browser\'s built-in speech engine. 100% free and works offline.',
    features: locale === 'zh' ? '功能特点' : 'Features',
    f1: locale === 'zh' ? '完全免费，无使用限制' : '100% free, no limits',
    f2: locale === 'zh' ? '可调节语速、音调、音量' : 'Adjustable speed, pitch, volume',
    f3: locale === 'zh' ? '多种系统语音可选' : 'Multiple system voices',
    f4: locale === 'zh' ? '离线可用，保护隐私' : 'Works offline, private',
    f5: locale === 'zh' ? '支持暂停/继续/停止' : 'Pause / resume / stop',
    f6: locale === 'zh' ? '手机浏览器也能用' : 'Works on mobile browsers',
    slow: locale === 'zh' ? '慢' : 'Slow',
    fast: locale === 'zh' ? '快' : 'Fast',
    low: locale === 'zh' ? '低' : 'Low',
    high: locale === 'zh' ? '高' : 'High',
    charCount: locale === 'zh' ? '字数' : 'Characters',
    noVoice: locale === 'zh' ? '（系统未检测到可用语音）' : '(No voices available on your system)',
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
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t.title}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t.subtitle}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                    <Type className='w-4 h-4 text-violet-500' />
                    {t.inputText}
                  </label>
                  <span className='text-xs text-gray-400'>{t.charCount}: {text.length}</span>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.placeholder}
                  rows={6}
                  className='w-full p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500'
                />
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2'>
                  {t.presets}
                </label>
                <div className='flex flex-wrap gap-2'>
                  {presetTexts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setText(locale === 'zh' ? p.zh : p.en)}
                      className='px-3 py-1.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 transition-colors'
                    >
                      {locale === 'zh' ? p.zh.slice(0, 15) + '...' : p.en.slice(0, 20) + '...'}
                    </button>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                      <Gauge className='w-4 h-4 text-violet-500' />
                      {t.speed}
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
                      {t.pitch}
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
                    <span>{t.low}</span>
                    <span>1</span>
                    <span>{t.high}</span>
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                      <Volume2 className='w-4 h-4 text-violet-500' />
                      {t.volume}
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
                    {t.voice}
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
                    {t.play}
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={resume}
                    className='flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all'
                  >
                    <Play className='h-5 w-5' />
                    {t.resume}
                  </button>
                ) : (
                  <button
                    onClick={pause}
                    className='flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg shadow-violet-500/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all'
                  >
                    <Pause className='h-5 w-5' />
                    {t.pause}
                  </button>
                )}
                <button
                  onClick={stop}
                  disabled={!isPlaying && !isPaused}
                  className='flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  <Square className='h-5 w-5' />
                  {t.stop}
                </button>
                <button
                  onClick={reset}
                  className='flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                >
                  <RotateCcw className='h-5 w-5' />
                  {t.reset}
                </button>
              </div>

              <div className='p-3 sm:p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-violet-700 dark:text-violet-300'>
                  {t.tip}
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t.features}</h3>
            <ul className='space-y-3'>
              {[t.f1, t.f2, t.f3, t.f4, t.f5, t.f6].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0' />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
