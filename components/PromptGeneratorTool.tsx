'use client';

import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { getPromptModel, promptModels, type PromptModel } from '@/lib/promptModels';

interface PromptGeneratorToolProps {
  locale?: string;
  defaultModel?: string;
}

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: 'AI 提示词生成器',
    subtitle: '选择模型和选项，自动生成高质量 AI 绘画/视频提示词',
    model: '模型选择',
    lang: '提示词语言',
    copy: '复制提示词',
    copied: '已复制',
    refine: 'AI 润色',
    refining: '润色中...',
    result: '生成的提示词',
    placeholder: '请选择选项生成提示词...',
    image: '图像',
    video: '视频',
  },
  en: {
    title: 'AI Prompt Generator',
    subtitle: 'Select model and options to generate high-quality AI image/video prompts',
    model: 'Model',
    lang: 'Prompt Language',
    copy: 'Copy Prompt',
    copied: 'Copied',
    refine: 'AI Refine',
    refining: 'Refining...',
    result: 'Generated Prompt',
    placeholder: 'Select options to generate a prompt...',
    image: 'Image',
    video: 'Video',
  },
  hi: {
    title: 'AI प्रॉम्प्ट जनरेटर',
    subtitle: 'मॉडल और विकल्प चुनें, उच्च गुणवत्ता वाले AI प्रॉम्प्ट बनाएं',
    model: 'मॉडल',
    lang: 'भाषा',
    copy: 'कॉपी करें',
    copied: 'कॉपी हो गया',
    refine: 'AI रिफाइन',
    refining: 'रिफाइन हो रहा है...',
    result: 'जनरेट किया गया प्रॉम्प्ट',
    placeholder: 'विकल्प चुनें...',
    image: 'इमेज',
    video: 'वीडियो',
  },
  fr: {
    title: 'Générateur de Prompts IA',
    subtitle: 'Choisissez un modèle et des options pour générer des prompts de qualité',
    model: 'Modèle',
    lang: 'Langue',
    copy: 'Copier',
    copied: 'Copié',
    refine: 'Affiner IA',
    refining: 'Affinage...',
    result: 'Prompt généré',
    placeholder: 'Sélectionnez des options...',
    image: 'Image',
    video: 'Vidéo',
  },
  es: {
    title: 'Generador de Prompts IA',
    subtitle: 'Selecciona modelo y opciones para generar prompts de alta calidad',
    model: 'Modelo',
    lang: 'Idioma',
    copy: 'Copiar',
    copied: 'Copiado',
    refine: 'Refinar IA',
    refining: 'Refinando...',
    result: 'Prompt generado',
    placeholder: 'Selecciona opciones...',
    image: 'Imagen',
    video: 'Vídeo',
  },
  ar: {
    title: 'مولد المطالبات بالذكاء الاصطناعي',
    subtitle: 'اختر النموذج والخيارات لإنشاء مطالبات عالية الجودة',
    model: 'النموذج',
    lang: 'اللغة',
    copy: 'نسخ',
    copied: 'تم النسخ',
    refine: 'تحسين بالذكاء الاصطناعي',
    refining: 'جاري التحسين...',
    result: 'المطلب المولد',
    placeholder: 'اختر الخيارات...',
    image: 'صورة',
    video: 'فيديو',
  },
};

export default function PromptGeneratorTool({ locale = 'en', defaultModel = 'universal-image' }: PromptGeneratorToolProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'en';
  const t = i18n[resolvedLocale] || i18n.en;

  const [selectedModelId, setSelectedModelId] = useState(defaultModel);
  const [promptLang, setPromptLang] = useState<'en' | 'zh'>(resolvedLocale === 'zh' ? 'zh' : 'en');
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [refining, setRefining] = useState(false);
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);

  const model = useMemo<PromptModel | undefined>(() => getPromptModel(selectedModelId), [selectedModelId]);

  const generatedPrompt = useMemo(() => {
    if (!model) return '';
    return model.join(values, promptLang);
  }, [model, values, promptLang]);

  const displayPrompt = refinedPrompt || generatedPrompt;

  const handleSelect = useCallback((fieldKey: string, value: string) => {
    setValues((prev) => {
      if (prev[fieldKey] === value) {
        const { [fieldKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [fieldKey]: value };
    });
    setRefinedPrompt(null);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!displayPrompt) return;
    try {
      await navigator.clipboard.writeText(displayPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [displayPrompt]);

  const handleRefine = useCallback(async () => {
    if (!generatedPrompt || !model) return;
    setRefining(true);
    try {
      const res = await fetch('/api/prompt-refine/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: generatedPrompt,
          kind: model.kind,
          lang: promptLang,
          locale: resolvedLocale,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.refined) {
          setRefinedPrompt(data.refined);
        }
      }
    } catch {
      // 失败不报错，保留原 prompt
    } finally {
      setRefining(false);
    }
  }, [generatedPrompt, model, promptLang, resolvedLocale]);

  const getFieldLabel = (field: any) => {
    return promptLang === 'zh' ? field.zhLabel : field.enLabel;
  };

  const getOptionLabel = (opt: any) => {
    return promptLang === 'zh' ? opt.zh : opt.en;
  };

  if (!model) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5 sm:p-7">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shrink-0">
            <Wand2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">
              {t.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.model}
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => {
                  setSelectedModelId(e.target.value);
                  setValues({});
                  setRefinedPrompt(null);
                }}
                className="w-full min-h-[44px] rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/60 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-400 outline-none"
              >
                {promptModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {promptLang === 'zh' ? m.zhName : m.enName} ({m.kind === 'image' ? t.image : t.video})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.lang}
              </label>
              <div className="flex rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setPromptLang('en')}
                  className={`px-4 min-h-[44px] text-sm font-medium transition-colors ${
                    promptLang === 'en'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-50 dark:bg-gray-900/60 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setPromptLang('zh')}
                  className={`px-4 min-h-[44px] text-sm font-medium transition-colors ${
                    promptLang === 'zh'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-50 dark:bg-gray-900/60 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  中文
                </button>
              </div>
            </div>
          </div>

          {model.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                {getFieldLabel(field)}
              </label>
              <div className="flex flex-wrap gap-2">
                {field.options.map((opt) => {
                  const isSelected = values[field.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(field.key, opt.value)}
                      className={`px-3 py-2 min-h-[40px] text-xs font-medium rounded-lg transition-all duration-200 border ${
                        isSelected
                          ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-purple-300 hover:text-purple-600'
                      }`}
                    >
                      {getOptionLabel(opt)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t.result}
            </label>
            <div className="relative">
              <textarea
                readOnly
                value={displayPrompt}
                placeholder={t.placeholder}
                className="w-full min-h-[120px] rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/60 px-3 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-y font-mono leading-relaxed"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!displayPrompt}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-purple-500 hover:bg-purple-600 active:scale-[0.98] text-white text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? t.copied : t.copy}
              </button>
              <button
                type="button"
                onClick={handleRefine}
                disabled={!displayPrompt || refining}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-[0.98] text-white text-sm font-semibold shadow-lg shadow-purple-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refining ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {refining ? t.refining : t.refine}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
