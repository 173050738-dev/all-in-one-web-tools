'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Video, Mic, Monitor, Download, Square, RotateCcw, Clock, Edit3, Save, Trash2, Eye, EyeOff, FileText, Settings2 } from 'lucide-react';

interface SubtitleItem {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  originalText?: string;
}

type RecordingState = 'idle' | 'recording' | 'completed';
type SplitMode = 'punctuation' | 'chars' | 'duration';

interface Props {
  locale: string;
}

export default function ScreenRecorderSubtitle({ locale }: Props) {
  const t = useTranslations('screenRecorder');
  const isZh = locale === 'zh';
  const rtl = locale === 'ar';

  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [duration, setDuration] = useState(0);
  const startTimeRef = useRef<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [activeSubtitleId, setActiveSubtitleId] = useState<number | null>(null);
  const [editingSubtitleId, setEditingSubtitleId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSource, setSelectedSource] = useState<'screen' | 'window' | 'tab'>('screen');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [displayLanguage, setDisplayLanguage] = useState<'zh' | 'en'>('zh');
  const [bilingual, setBilingual] = useState(false);

  const [script, setScript] = useState('');
  const [splitMode, setSplitMode] = useState<SplitMode>('punctuation');
  const [charsPerLine, setCharsPerLine] = useState(18);
  const [startOffsetMs, setStartOffsetMs] = useState(0);
  const [gapMs, setGapMs] = useState(120);

  const intervalRef = useRef<number | null>(null);

  const formatTime = useCallback((seconds: number): string => {
    const ms = Math.floor(seconds * 1000);
    const hh = Math.floor(ms / 3600000);
    const mm = Math.floor((ms % 3600000) / 60000);
    const ss = Math.floor((ms % 60000) / 1000);
    const mmm = ms % 1000;
    if (hh > 0) {
      return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')},${mmm.toString().padStart(3, '0')}`;
    }
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')},${mmm.toString().padStart(3, '0')}`;
  }, []);

  const formatTimeSimple = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  const splitByPunctuation = useCallback((text: string): string[] => {
    if (!text) return [];
    const normalized = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
    if (!normalized) return [];
    const parts: string[] = [];
    let buf = '';
    for (let i = 0; i < normalized.length; i++) {
      const c = normalized[i];
      buf += c;
      if (/[。！？!?；;\n]/.test(c) || (c === '.' && /[\u4e00-\u9fa5A-Za-z0-9]/.test(normalized[i - 1] ?? '') && /\s/.test(normalized[i + 1] ?? ''))) {
        const seg = buf.trim();
        if (seg) parts.push(seg);
        buf = '';
      }
    }
    if (buf.trim()) parts.push(buf.trim());
    return parts.filter((p) => p.length > 0);
  }, []);

  const splitByChars = useCallback((text: string, limit: number): string[] => {
    if (!text || limit <= 0) return [];
    const cleaned = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
    if (!cleaned) return [];
    const out: string[] = [];
    let i = 0;
    while (i < cleaned.length) {
      let end = Math.min(i + limit, cleaned.length);
      let chunk = cleaned.slice(i, end);
      if (end < cleaned.length) {
        const lastPunct = /[，,。！？!?；;、]/.exec(chunk.split('').reverse().join(''));
        if (lastPunct && lastPunct.index !== undefined) {
          const idxFromEnd = lastPunct.index;
          const cutAt = chunk.length - idxFromEnd;
          if (cutAt > Math.floor(limit * 0.5)) {
            chunk = chunk.slice(0, cutAt);
            end = i + cutAt;
          }
        }
      }
      chunk = chunk.trim();
      if (chunk) out.push(chunk);
      i = end;
      while (i < cleaned.length && /\s/.test(cleaned[i])) i++;
    }
    return out;
  }, []);

  const generateSubtitles = useCallback(() => {
    if (!script.trim() || !duration) return;

    let segments: string[] = [];
    if (splitMode === 'punctuation') {
      segments = splitByPunctuation(script);
    } else if (splitMode === 'chars') {
      segments = splitByChars(script, Math.max(1, charsPerLine));
    } else {
      const puncSegs = splitByPunctuation(script);
      segments = puncSegs.length > 0 ? puncSegs : splitByChars(script, Math.max(1, charsPerLine));
    }

    const n = segments.length;
    if (n === 0) return;

    const totalMs = duration * 1000;
    const gapTotal = Math.max(0, gapMs) * Math.max(0, n - 1);
    const speakMs = Math.max(totalMs - gapTotal - Math.max(0, startOffsetMs), n * 200);
    const perCue = Math.floor(speakMs / n);
    let cursor = Math.max(0, startOffsetMs);

    const newSubtitles: SubtitleItem[] = segments.map((s, i) => {
      const start = cursor / 1000;
      const end = (cursor + perCue) / 1000;
      cursor = end * 1000 + Math.max(0, gapMs);
      return {
        id: i + 1,
        startTime: start,
        endTime: end,
        text: s,
      };
    });

    setSubtitles(newSubtitles);
  }, [script, splitMode, charsPerLine, duration, startOffsetMs, gapMs, splitByPunctuation, splitByChars]);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setRecordingState('completed');

        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          setDuration(video.duration);
        };
        video.src = url;
      };

      recordedChunksRef.current = [];
      startTimeRef.current = Date.now();

      recorder.start();

      setMediaStream(screenStream);
      setAudioStream(audioStream);
      setMediaRecorder(recorder);
      setRecordingState('recording');
      setElapsedTime(0);
      setSubtitles([]);
      setScript('');

      intervalRef.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 100);
    } catch (err) {
      console.error('Error starting recording:', err);
      alert(isZh ? '无法开始录制，请检查浏览器权限设置。' : 'Unable to start recording. Please check browser permission settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recordingState === 'recording') {
      mediaRecorder.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRecordingState('completed');
  };

  const resetRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setRecordingState('idle');
    setMediaStream(null);
    setAudioStream(null);
    setMediaRecorder(null);
    setRecordedChunks([]);
    setVideoUrl('');
    setDuration(0);
    setElapsedTime(0);
    setSubtitles([]);
    setActiveSubtitleId(null);
    setEditingSubtitleId(null);
    setEditingText('');
    setScript('');
    setShowPreview(false);
  };

  const updateSubtitleText = (id: number, text: string) => {
    setSubtitles(prev => prev.map(s => s.id === id ? { ...s, text } : s));
  };

  const deleteSubtitle = (id: number) => {
    setSubtitles(prev => prev.filter(s => s.id !== id));
  };

  const exportSRT = () => {
    let srtContent = '';
    subtitles.forEach((sub, index) => {
      srtContent += `${index + 1}\n`;
      srtContent += `${formatTime(sub.startTime)} --> ${formatTime(sub.endTime)}\n`;
      srtContent += `${sub.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/srt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isZh ? '字幕.srt' : 'subtitles.srt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportVideo = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = isZh ? '录制视频.webm' : 'recording.webm';
    a.click();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  useEffect(() => {
    if (videoRef.current && subtitles.length > 0) {
      const video = videoRef.current;
      const checkTime = () => {
        const currentTime = video.currentTime;
        const active = subtitles.find(s => s.startTime <= currentTime && s.endTime >= currentTime);
        setActiveSubtitleId(active?.id || null);
      };
      video.addEventListener('timeupdate', checkTime);
      return () => video.removeEventListener('timeupdate', checkTime);
    }
  }, [subtitles]);

  const charCount = useMemo(() => script.replace(/\s/g, '').length, [script]);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          {t('privacy-note')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-primary-600" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('recording-control')}</h2>
            </div>

            <div className="flex items-center gap-4">
              {recordingState === 'idle' && (
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value as 'screen' | 'window' | 'tab')}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="screen">{t('source-screen')}</option>
                  <option value="window">{t('source-window')}</option>
                  <option value="tab">{t('source-tab')}</option>
                </select>
              )}

              <div className="flex items-center gap-2">
                {recordingState === 'recording' && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">{formatTimeSimple(elapsedTime)}</span>
                  </div>
                )}
                {recordingState === 'completed' && duration > 0 && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{formatTimeSimple(duration)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6">
            {recordingState === 'recording' && mediaStream && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              >
                <source srcObject={mediaStream} />
              </video>
            )}
            {recordingState === 'completed' && videoUrl && (
              <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain"
              >
                <source src={videoUrl} type="video/webm" />
              </video>
            )}
            {recordingState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Monitor className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">{t('ready-to-record')}</p>
                <p className="text-sm mt-2">{t('click-start')}</p>
              </div>
            )}

            {showPreview && recordingState === 'completed' && subtitles.length > 0 && (
              <div className="absolute bottom-4 left-4 right-4">
                {subtitles.slice(-3).map(sub => (
                  <div
                    key={sub.id}
                    className={`bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm text-center mb-1 ${
                      activeSubtitleId === sub.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    {displayLanguage === 'zh' ? sub.text : sub.originalText || sub.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {recordingState === 'idle' && (
              <button
                onClick={startRecording}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors min-h-[48px]"
              >
                <Video className="h-5 w-5" />
                {t('start-recording')}
              </button>
            )}

            {recordingState === 'recording' && (
              <>
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors min-h-[48px]"
                >
                  <Square className="h-5 w-5" />
                  {t('stop-recording')}
                </button>
                <button
                  onClick={resetRecording}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors min-h-[48px]"
                >
                  <RotateCcw className="h-5 w-5" />
                  {t('cancel')}
                </button>
              </>
            )}

            {recordingState === 'completed' && (
              <>
                <button
                  onClick={resetRecording}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors min-h-[48px]"
                >
                  <RotateCcw className="h-5 w-5" />
                  {t('new-recording')}
                </button>

                <button
                  onClick={generateSubtitles}
                  disabled={!script.trim() || !duration}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors min-h-[48px]"
                >
                  <Mic className="h-5 w-5" />
                  {t('generate-subtitles')}
                </button>

                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors min-h-[48px]"
                >
                  {showPreview ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  {showPreview ? t('hide-preview') : t('show-preview')}
                </button>

                <button
                  onClick={exportVideo}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors min-h-[48px]"
                >
                  <Download className="h-5 w-5" />
                  {t('export-video')}
                </button>

                <button
                  onClick={exportSRT}
                  disabled={subtitles.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors min-h-[48px]"
                >
                  <Download className="h-5 w-5" />
                  {t('export-srt')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {recordingState === 'completed' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary-600" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('script-input')}</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{charCount} {t('chars')}</span>
            </div>
          </div>

          <div className="p-6">
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder={t('script-placeholder')}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y min-h-[200px]"
              dir={rtl ? 'rtl' : 'ltr'}
            />

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Settings2 className="h-4 w-4 text-primary-500" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('split-mode')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                {([
                  { key: 'punctuation', label: t('split-punctuation') },
                  { key: 'chars', label: t('split-chars') },
                  { key: 'duration', label: t('split-duration') },
                ] as { key: SplitMode; label: string }[]).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSplitMode(opt.key)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all min-h-[44px] text-left ${
                      splitMode === opt.key
                        ? 'bg-primary-50 dark:bg-primary-900/25 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-200'
                        : 'bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                    {t('chars-per-line')}
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={80}
                    step={1}
                    value={charsPerLine}
                    onChange={(e) => setCharsPerLine(parseInt(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-center">{charsPerLine}</span>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                    {t('start-offset')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={startOffsetMs}
                    onChange={(e) => setStartOffsetMs(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                    {t('gap-between')}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1500}
                    step={40}
                    value={gapMs}
                    onChange={(e) => setGapMs(parseInt(e.target.value))}
                    className="w-full accent-primary-500"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-center">{gapMs}ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {recordingState === 'completed' && subtitles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900/50 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Edit3 className="h-5 w-5 text-primary-600" />
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t('subtitle-list')}</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">{subtitles.length} {t('items')}</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bilingual}
                    onChange={(e) => setBilingual(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t('bilingual')}</span>
                </label>
                <select
                  value={displayLanguage}
                  onChange={(e) => setDisplayLanguage(e.target.value as 'zh' | 'en')}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="zh">{t('language-zh')}</option>
                  <option value="en">{t('language-en')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {subtitles.map((sub, index) => (
              <div
                key={sub.id}
                className={`border-b border-gray-100 dark:border-gray-700/50 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  editingSubtitleId === sub.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } ${activeSubtitleId === sub.id ? 'ring-1 ring-inset ring-primary-300 dark:ring-primary-600' : ''}`}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {editingSubtitleId === sub.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          rows={3}
                          autoFocus
                          dir={rtl ? 'rtl' : 'ltr'}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              updateSubtitleText(sub.id, editingText);
                              setEditingSubtitleId(null);
                              setEditingText('');
                            }}
                            className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium"
                          >
                            <Save className="h-4 w-4 inline mr-1" />
                            {t('save')}
                          </button>
                          <button
                            onClick={() => {
                              setEditingSubtitleId(null);
                              setEditingText('');
                            }}
                            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium"
                          >
                            {t('cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-900 dark:text-gray-100 mb-2" dir={rtl ? 'rtl' : 'ltr'}>{sub.text}</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(sub.startTime)}</span>
                            <span>--&gt;</span>
                            <span>{formatTime(sub.endTime)}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingSubtitleId(sub.id);
                                setEditingText(sub.text);
                              }}
                              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteSubtitle(sub.id)}
                              className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recordingState === 'completed' && subtitles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t('no-subtitles')}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">{t('hint-input-script')}</p>
        </div>
      )}
    </div>
  );
}
