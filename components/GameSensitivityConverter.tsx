'use client';

import { useState, useMemo, useCallback } from 'react';
import { Mouse, Copy, Check, Crosshair, Info, ClipboardList } from 'lucide-react';

interface GameSensitivityConverterProps {
  locale?: string;
}

interface GameDef {
  id: string;
  yaw: number;
  min: number;
  max: number;
}

const GAMES: GameDef[] = [
  { id: 'cs2', yaw: 0.022, min: 0.0001, max: 1000 },
  { id: 'valorant', yaw: 0.07, min: 0.001, max: 30 },
  { id: 'apex', yaw: 0.022, min: 0.0001, max: 30 },
  { id: 'overwatch2', yaw: 0.0066, min: 0.1, max: 100 },
  { id: 'pubg', yaw: 0.0066, min: 0.1, max: 100 },
  { id: 'fortnite', yaw: 0.5555, min: 0.01, max: 100 },
  { id: 'warzone', yaw: 0.0066, min: 0.1, max: 100 },
];

const GAME_NAMES: Record<string, string> = {
  cs2: 'CS2',
  valorant: 'Valorant',
  apex: 'Apex Legends',
  overwatch2: 'Overwatch 2',
  pubg: 'PUBG',
  fortnite: 'Fortnite',
  warzone: 'Call of Duty: Warzone',
};

const i18n: Record<string, any> = {
  en: {
    title: 'Game Sensitivity Converter',
    sub: 'Convert your mouse sensitivity between FPS games. Keep the same feel across CS2, Valorant, Apex and more.',
    sourceGame: 'Source Game',
    sensitivity: 'Sensitivity',
    dpi: 'Mouse DPI',
    yourCm360: 'Your cm/360',
    results: 'Equivalent Sensitivity in Other Games',
    game: 'Game',
    sens: 'Sensitivity',
    cm360: 'cm/360',
    copy: 'Copy',
    copied: 'Copied',
    copyAll: 'Copy All',
    invalidInput: 'Please enter a valid number greater than 0.',
    tip: 'cm/360 = the centimeters of mouse movement needed to turn 360° in-game. Lower = faster turn. DPI only affects cm/360, not the converted sensitivity value.',
    reset: 'Reset',
  },
  zh: {
    title: '游戏灵敏度转换器',
    sub: '在 FPS 游戏之间转换鼠标灵敏度，保持手感一致。支持 CS2、Valorant、Apex 等主流游戏。',
    sourceGame: '源游戏',
    sensitivity: '灵敏度',
    dpi: '鼠标 DPI',
    yourCm360: '你的 cm/360',
    results: '其他游戏等效灵敏度',
    game: '游戏',
    sens: '灵敏度',
    cm360: 'cm/360',
    copy: '复制',
    copied: '已复制',
    copyAll: '复制全部',
    invalidInput: '请输入大于 0 的有效数值。',
    tip: 'cm/360 = 鼠标移动多少厘米能在游戏中转 360°。数值越小转身越快。DPI 只影响 cm/360，不影响转换后的灵敏度数值。',
    reset: '重置',
  },
  es: {
    title: 'Conversor de Sensibilidad de Juegos',
    sub: 'Convierte tu sensibilidad del ratón entre juegos FPS. Mantén la misma sensación en CS2, Valorant, Apex y más.',
    sourceGame: 'Juego de Origen',
    sensitivity: 'Sensibilidad',
    dpi: 'DPI del Ratón',
    yourCm360: 'Tu cm/360',
    results: 'Sensibilidad Equivalente en Otros Juegos',
    game: 'Juego',
    sens: 'Sensibilidad',
    cm360: 'cm/360',
    copy: 'Copiar',
    copied: 'Copiado',
    copyAll: 'Copiar Todo',
    invalidInput: 'Introduce un número válido mayor que 0.',
    tip: 'cm/360 = centímetros de movimiento del ratón para girar 360° en el juego. Menor = giro más rápido. El DPI solo afecta a cm/360, no al valor de sensibilidad convertido.',
    reset: 'Restablecer',
  },
  fr: {
    title: 'Convertisseur de Sensibilité de Jeu',
    sub: 'Convertissez votre sensibilité de souris entre les jeux FPS. Gardez le même ressenti sur CS2, Valorant, Apex et plus.',
    sourceGame: 'Jeu Source',
    sensitivity: 'Sensibilité',
    dpi: 'DPI de la Souris',
    yourCm360: 'Votre cm/360',
    results: 'Sensibilité Équivalente dans les Autres Jeux',
    game: 'Jeu',
    sens: 'Sensibilité',
    cm360: 'cm/360',
    copy: 'Copier',
    copied: 'Copié',
    copyAll: 'Tout Copier',
    invalidInput: 'Veuillez entrer un nombre valide supérieur à 0.',
    tip: 'cm/360 = centimètres de mouvement de souris pour tourner de 360° en jeu. Plus bas = rotation plus rapide. Le DPI affecte uniquement cm/360, pas la valeur de sensibilité convertie.',
    reset: 'Réinitialiser',
  },
  hi: {
    title: 'गेम संवेदनशीलता कनवर्टर',
    sub: 'FPS गेम के बीच अपनी माउस संवेदनशीलता बदलें। CS2, Valorant, Apex और अधिक में समान अनुभव बनाए रखें।',
    sourceGame: 'स्रोत गेम',
    sensitivity: 'संवेदनशीलता',
    dpi: 'माउस DPI',
    yourCm360: 'आपका cm/360',
    results: 'अन्य गेम में समान संवेदनशीलता',
    game: 'गेम',
    sens: 'संवेदनशीलता',
    cm360: 'cm/360',
    copy: 'कॉपी',
    copied: 'कॉपी हो गया',
    copyAll: 'सभी कॉपी करें',
    invalidInput: 'कृपया 0 से बड़ा वैध संख्या दर्ज करें।',
    tip: 'cm/360 = गेम में 360° घूमने के लिए माउस कितने सेंटीमीटर चलेगा। कम = तेज घूर्णन। DPI केवल cm/360 को प्रभावित करता है, न कि रूपांतरित संवेदनशीलता मान को।',
    reset: 'रीसेट',
  },
  ar: {
    title: 'محول حساسية الألعاب',
    sub: 'حوّل حساسية الماوس بين ألعاب FPS. حافظ على نفس الإحساس في CS2 و Valorant و Apex والمزيد.',
    sourceGame: 'اللعبة المصدر',
    sensitivity: 'الحساسية',
    dpi: 'DPI للماوس',
    yourCm360: 'cm/360 الخاص بك',
    results: 'الحساسية المكافئة في الألعاب الأخرى',
    game: 'اللعبة',
    sens: 'الحساسية',
    cm360: 'cm/360',
    copy: 'نسخ',
    copied: 'تم النسخ',
    copyAll: 'نسخ الكل',
    invalidInput: 'يرجى إدخال رقم صالح أكبر من 0.',
    tip: 'cm/360 = سنتيمترات حركة الماوس اللازمة للدوران 360° في اللعبة. أقل = دوران أسرع. يؤثر DPI فقط على cm/360 وليس على قيمة الحساسية المحوّلة.',
    reset: 'إعادة تعيين',
  },
};

// cm/360 = (360 * 2.54) / (yaw * sensitivity * dpi)
function calcCm360(yaw: number, sensitivity: number, dpi: number): number {
  if (yaw <= 0 || sensitivity <= 0 || dpi <= 0) return NaN;
  return (360 * 2.54) / (yaw * sensitivity * dpi);
}

// target sens = source sens * (source yaw / target yaw)
function convertSens(sourceSens: number, sourceYaw: number, targetYaw: number): number {
  if (targetYaw <= 0) return NaN;
  return sourceSens * (sourceYaw / targetYaw);
}

function fmtSens(n: number): string {
  if (isNaN(n) || !isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1000) return n.toFixed(1);
  if (abs >= 100) return n.toFixed(2);
  if (abs >= 1) return n.toFixed(4);
  if (abs >= 0.01) return n.toFixed(5);
  if (abs >= 0.0001) return n.toFixed(6);
  return n.toExponential(3);
}

function fmtCm(n: number): string {
  if (isNaN(n) || !isFinite(n)) return '—';
  if (n >= 10000) return n.toFixed(0);
  if (n >= 1000) return n.toFixed(1);
  if (n >= 100) return n.toFixed(2);
  return n.toFixed(2);
}

const DEFAULT_SENS = '2';
const DEFAULT_DPI = '800';
const DEFAULT_GAME = 'cs2';
const COMMON_DPIS = [400, 800, 1600, 3200];

export default function GameSensitivityConverter({ locale = 'en' }: GameSensitivityConverterProps) {
  const t = i18n[locale] || i18n.en;
  const isRtl = locale === 'ar';

  const [sourceGameId, setSourceGameId] = useState<string>(DEFAULT_GAME);
  const [sensInput, setSensInput] = useState<string>(DEFAULT_SENS);
  const [dpiInput, setDpiInput] = useState<string>(DEFAULT_DPI);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sourceGame = useMemo(() => GAMES.find(g => g.id === sourceGameId) || GAMES[0], [sourceGameId]);
  const sensNum = parseFloat(sensInput);
  const dpiNum = parseFloat(dpiInput);
  const isValid = !isNaN(sensNum) && sensNum > 0 && !isNaN(dpiNum) && dpiNum > 0;

  const sourceCm360 = useMemo(() => {
    if (!isValid) return NaN;
    return calcCm360(sourceGame.yaw, sensNum, dpiNum);
  }, [sourceGame, sensNum, dpiNum, isValid]);

  const results = useMemo(() => {
    if (!isValid) return [];
    return GAMES
      .filter(g => g.id !== sourceGameId)
      .map(g => {
        const convertedSens = convertSens(sensNum, sourceGame.yaw, g.yaw);
        const cm360 = calcCm360(g.yaw, convertedSens, dpiNum);
        return { ...g, convertedSens, cm360 };
      });
  }, [sourceGameId, sourceGame, sensNum, dpiNum, isValid]);

  const copyText = useCallback(async (text: string, id: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(ta);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(prev => (prev === id ? null : prev)), 2000);
  }, []);

  const handleCopyAll = useCallback(() => {
    if (!isValid || results.length === 0) return;
    const lines: string[] = [];
    lines.push(`${GAME_NAMES[sourceGame.id]}: ${fmtSens(sensNum)} | ${fmtCm(sourceCm360)} cm/360 @ ${dpiInput} DPI`);
    results.forEach(r => {
      lines.push(`${GAME_NAMES[r.id]}: ${fmtSens(r.convertedSens)} | ${fmtCm(r.cm360)} cm/360`);
    });
    copyText(lines.join('\n'), 'all');
  }, [isValid, results, sourceGame, sensNum, sourceCm360, dpiInput, copyText]);

  const handleReset = () => {
    setSourceGameId(DEFAULT_GAME);
    setSensInput(DEFAULT_SENS);
    setDpiInput(DEFAULT_DPI);
  };

  const onSourceGameChange = (id: string) => {
    setSourceGameId(id);
    const g = GAMES.find(x => x.id === id);
    if (g) {
      const n = parseFloat(sensInput);
      if (!isNaN(n) && (n < g.min || n > g.max)) {
        setSensInput(String(Math.max(g.min, Math.min(g.max, n))));
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
          <Mouse className="text-indigo-600 dark:text-indigo-400" size={24} />
          {t.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl mx-auto">{t.sub}</p>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Source Game */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              {t.sourceGame}
            </label>
            <select
              value={sourceGameId}
              onChange={e => onSourceGameChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 min-h-[44px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            >
              {GAMES.map(g => (
                <option key={g.id} value={g.id}>{GAME_NAMES[g.id]}</option>
              ))}
            </select>
          </div>

          {/* Sensitivity */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              {t.sensitivity}
            </label>
            <input
              type="number"
              value={sensInput}
              onChange={e => setSensInput(e.target.value)}
              min={sourceGame.min}
              max={sourceGame.max}
              step="any"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 min-h-[44px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder={t.sensitivity}
            />
          </div>

          {/* DPI */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              {t.dpi}
            </label>
            <input
              type="number"
              value={dpiInput}
              onChange={e => setDpiInput(e.target.value)}
              min="100"
              max="32000"
              step="any"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 min-h-[44px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="800"
            />
          </div>
        </div>

        {/* Common DPI shortcuts */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {COMMON_DPIS.map(d => (
            <button
              key={d}
              onClick={() => setDpiInput(String(d))}
              className={`px-3 py-1.5 rounded-lg text-xs min-h-[36px] transition ${
                dpiInput === String(d)
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {d} DPI
            </button>
          ))}
          <button
            onClick={handleReset}
            className="ms-auto px-3 py-1.5 rounded-lg text-xs min-h-[36px] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {t.reset}
          </button>
        </div>

        {/* Source cm/360 display */}
        <div className="mt-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Crosshair className="text-indigo-600 dark:text-indigo-400" size={18} />
              <span className="text-sm text-gray-600 dark:text-gray-300">{t.yourCm360}</span>
              <span className="text-xs text-gray-400">({GAME_NAMES[sourceGame.id]} @ {dpiInput || '—'} DPI)</span>
            </div>
            <div className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
              {isValid ? `${fmtCm(sourceCm360)} cm` : '—'}
            </div>
          </div>
        </div>

        {!isValid && sensInput !== '' && (
          <p className="mt-2 text-xs text-red-500">{t.invalidInput}</p>
        )}
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Crosshair className="text-indigo-600 dark:text-indigo-400" size={16} />
            {t.results}
          </h3>
          <button
            onClick={handleCopyAll}
            disabled={!isValid || results.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs min-h-[36px] bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
          >
            {copiedId === 'all' ? <Check size={14} /> : <ClipboardList size={14} />}
            {copiedId === 'all' ? t.copied : t.copyAll}
          </button>
        </div>

        {/* Table header (desktop) */}
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-3 px-3 pb-2 text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium">
          <span>{t.game}</span>
          <span className="text-end pe-2">{t.sens}</span>
          <span className="text-end pe-2">{t.cm360}</span>
          <span className="w-9"></span>
        </div>

        <div className="space-y-2">
          {isValid && results.map(r => {
            const isCopied = copiedId === r.id;
            const copyVal = fmtSens(r.convertedSens);
            return (
              <div
                key={r.id}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-3 items-center px-3 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition min-h-[44px]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Crosshair className="text-gray-400 dark:text-gray-500 flex-shrink-0" size={15} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {GAME_NAMES[r.id]}
                  </span>
                </div>
                <div className="text-end sm:pe-2">
                  <span className="sm:hidden text-[10px] text-gray-400 block leading-none mb-0.5">{t.sens}</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100 font-mono">{copyVal}</span>
                </div>
                <div className="hidden sm:block text-end pe-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">{fmtCm(r.cm360)} cm</span>
                </div>
                <div className="hidden sm:flex justify-end w-9">
                  <button
                    onClick={() => copyText(copyVal, r.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title={t.copy}
                  >
                    {isCopied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                  </button>
                </div>
                {/* Mobile: combined row with copy */}
                <button
                  onClick={() => copyText(copyVal, r.id)}
                  className="sm:hidden col-span-2 flex items-center justify-end gap-1 text-xs text-gray-400 hover:text-indigo-600 transition min-h-[36px]"
                >
                  {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  <span className="text-gray-500 dark:text-gray-400 font-mono">{fmtCm(r.cm360)} cm/360</span>
                </button>
              </div>
            );
          })}
          {!isValid && (
            <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
              {t.invalidInput}
            </div>
          )}
        </div>
      </div>

      {/* Tip */}
      <div className="mt-4 p-3 md:p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-start gap-2">
        <Info className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" size={15} />
        <p className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-300">{t.tip}</p>
      </div>
    </div>
  );
}
