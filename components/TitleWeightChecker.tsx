'use client';

import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

interface TitleWeightCheckerProps {
  locale?: string;
}

const i18n = {
  zh: { title:"多平台标题权重检测器", subtitle:"小红书/抖音/视频号/公众号分平台打分", input:"请输入标题（可换行输入多条，按行区分）", modeShort:"短视频短标题 (<20字)", modeLong:"图文长标题 (<30字)", xhs:"小红书", dy:"抖音", sph:"视频号", gzh:"公众号", score:"评分", weight:"权重", detectKw:"流量关键词", banned:"违禁词", limit:"字符数", newlines:"换行适配", tips:"优化建议", hasDigit:"✅ 含数字", noDigit:"❌ 建议加入数字提升点击率", hasEmoji:"✅ 有表情emoji", noEmoji:"⚠️ 可加入1-2个emoji吸引眼球", hasPain:"✅ 含痛点词", noPain:"⚠️ 建议加入痛点词（必看/坑/别/后悔）", maxed:"✅ 符合平台字符上限", overflow:"❌ 超过平台字符上限，建议精简", hasNewlineOk:"✅ 长短换行符合平台", badNewline:"⚠️ 换行过多/过少，建议调整结构", perfect:"🎉 优秀，建议直接发布", good:"👍 良好，小优化即可", normal:"😐 中等，建议按提示优化", poor:"😢 较差，建议重写", bannedWarn:"⚠️ 检测到违禁词，建议替换", copySuggest:"复制优化建议", placeHolder:"示例：3个懒人早餐神器，10分钟搞定，后悔没早知道！" },
  en: { title:"Multi-Platform Title Checker", subtitle:"XHS/Douyin/Shipinhao/WeChat score", input:"Paste title, one per line", modeShort:"Short video (<20ch)", modeLong:"Long article (<30ch)", xhs:"Xiaohongshu", dy:"Douyin", sph:"Video Account", gzh:"WeChat", score:"Score", weight:"Weight", detectKw:"Traffic keywords", banned:"Banned words", limit:"Chars", newlines:"Newlines", tips:"Tips", hasDigit:"✅ Has digits", noDigit:"❌ Suggest adding numbers", hasEmoji:"✅ Has emoji", noEmoji:"⚠️ Add 1-2 emojis", hasPain:"✅ Has pain words", noPain:"⚠️ Add pain words (坑/别/悔)", maxed:"✅ Chars within limit", overflow:"❌ Too long, shorten", hasNewlineOk:"✅ Good line breaks", badNewline:"⚠️ Adjust newlines", perfect:"🎉 Great, publish now", good:"👍 Good, small tweaks", normal:"😐 Medium, optimize", poor:"😢 Poor, rewrite", bannedWarn:"⚠️ Banned words! Replace", copySuggest:"Copy tips", placeHolder:"Ex: 3 lazy breakfast hacks, done in 10 min!" },
  hi: { title:"टाइटल वेट चेकर", subtitle:"4 प्लेटफ़ॉर्म स्कोर", input:"टाइटल डालें (प्रति पंक्ति एक)", modeShort:"शॉर्ट वीडियो (<20)", modeLong:"लंबा आलेख (<30)", xhs:"Xiaohongshu", dy:"Douyin", sph:"Video", gzh:"WeChat", score:"स्कोर", weight:"वेट", detectKw:"ट्रैफ़िक कीवर्ड", banned:"वर्जित", limit:"वर्ण", newlines:"नई लाइनें", tips:"सुझाव", hasDigit:"✅ अंक हैं", noDigit:"❌ अंक जोड़ें", hasEmoji:"✅ इमोजी हैं", noEmoji:"⚠️ 1-2 इमोजी जोड़ें", hasPain:"✅ दर्द शब्द", noPain:"⚠️ दर्द शब्द जोड़ें", maxed:"✅ सीमा में हैं", overflow:"❌ बहुत लंबा", hasNewlineOk:"✅ लाइनें सही", badNewline:"⚠️ लाइनें एडजस्ट करें", perfect:"🎉 बहुत बढ़िया", good:"👍 अच्छा", normal:"😐 मध्यम", poor:"😢 खराब, फिर से", bannedWarn:"⚠️ वर्जित शब्द!", copySuggest:"सुझाव कॉपी", placeHolder:"3 आसान नाश्ता, 10 मिनट में तैयार!" },
  fr: { title:"Vérif. Poids Titre", subtitle:"Score 4 plates-formes", input:"Collez titres, un par ligne", modeShort:"Vidéo courte (<20)", modeLong:"Article long (<30)", xhs:"Xiaohongshu", dy:"Douyin", sph:"Vidéo", gzh:"WeChat", score:"Score", weight:"Poids", detectKw:"Mots clés", banned:"Interdits", limit:"Car.", newlines:"Sauts", tips:"Conseils", hasDigit:"✅ Chiffres", noDigit:"❌ Ajouter chiffres", hasEmoji:"✅ Emojis", noEmoji:"⚠️ 1-2 emojis", hasPain:"✅ Mots douleur", noPain:"⚠️ Ajouter mots douleur", perfect:"🎉 Super", good:"👍 Bon", normal:"😐 Moyen", poor:"😢 Réécrire", bannedWarn:"⚠️ Mots interdits!", copySuggest:"Copier conseils", placeHolder:"3 petits-déj. paresseux, prêts en 10 min !" },
  es: { title:"Comprob. Peso Título", subtitle:"Puntuación 4 plataformas", input:"Pega títulos, uno por línea", modeShort:"Video corto (<20)", modeLong:"Artículo (<30)", xhs:"Xiaohongshu", dy:"Douyin", sph:"Vídeo", gzh:"WeChat", score:"Puntos", weight:"Peso", detectKw:"Palabras clave", banned:"Prohibidas", limit:"Car.", newlines:"Saltos", tips:"Consejos", hasDigit:"✅ Dígitos", noDigit:"❌ Añadir dígitos", hasEmoji:"✅ Emojis", noEmoji:"⚠️ 1-2 emojis", hasPain:"✅ Palabras dolor", noPain:"⚠️ Añadir palabras dolor", maxed:"✅ Dentro límite", overflow:"❌ Demasiado largo", hasNewlineOk:"✅ Saltos correctos", badNewline:"⚠️ Ajustar saltos", perfect:"🎉 Excelente", good:"👍 Bueno", normal:"😐 Medio", poor:"😢 Reescribir", bannedWarn:"⚠️ Palabras prohibidas!", copySuggest:"Copiar consejos", placeHolder:"3 desayunos fáciles, listos en 10 min!" },
  ar: { title:"فاحص وزن العناوين", subtitle:"تقييم 4 منصات", input:"الصق العناوين، لكل سطر عنوان", modeShort:"فيديو قصير (<20)", modeLong:"مقال طويل (<30)", xhs:"شياوهونغشو", dy:"دوين", sph:"فيديو", gzh:"ويتشات", score:"الدرجة", weight:"الوزن", detectKw:"كلمات مفتاحية", banned:"محظورة", limit:"حروف", newlines:"فواصل أسطر", tips:"الاقتراحات", hasDigit:"✅ أرقام موجودة", noDigit:"❌ أضف أرقامًا", hasEmoji:"✅ إيموجي موجود", noEmoji:"⚠️ أضف 1-2 إيموجي", hasPain:"✅ كلمات ألم", noPain:"⚠️ أضف كلمات ألم", maxed:"✅ ضمن الحد", overflow:"❌ طويل جداً", hasNewlineOk:"✅ فواصل صحيحة", badNewline:"⚠️ اضبط الفواصل", perfect:"🎉 ممتاز", good:"👍 جيد", normal:"😐 متوسط", poor:"😢 أعد الكتابة", bannedWarn:"⚠️ كلمات محظورة!", copySuggest:"نسخ النصائح", placeHolder:"3 وجبات إفطار سهلة، جاهزة في 10 دقائق!" }
};

const banks = {
  xhs: {
    max: 20,
    name: '小红书',
    kw: ['神器','必看','攻略','保姆级','绝绝子','天花板','平价','替代','避雷','入坑','安利','种草','姐妹','宝子','yyds','冲','宝藏','后悔','懒人','手残党','学生党','早八','平民窟','氛围感','多巴胺','小个子','微胖','显白','一键','在家','零成本'],
    banned: ['最','第一','唯一','国家级','顶级','极限','万能','100%','秒杀','包治','治愈','根治','永久','特效','全网最低','史低','代购','微商','微信','加V','私信','赌','博彩','色情'],
    pain: ['别','后悔','坑','踩雷','避','假','智商税','浪费','千万别','不会吧','才知道','居然','竟然','亏大了']
  },
  dy: {
    max: 30,
    name: '抖音',
    kw: ['太牛了','神操作','看完','3秒','一招','搞定','教你','学会','别再','注意了','家人们','兄弟们','姐妹们','上热门','涨粉','变现','副业','搞钱','月入','零基础','新手','小白','逆袭','干货','拆解','揭秘','内幕','真相','太香了','破防','泪目'],
    banned: ['最','第一','唯一','国家级','最高级','绝对','100%','承诺','保证','包','回购','全网','史','涉政','领导人','黄','赌','毒','微信','加群','私信','下载链接'],
    pain: ['坑','别','被骗','上当','翻车','千万别','后悔','不会','没想到','原来是','亏大了','踩雷']
  },
  sph: {
    max: 24,
    name: '视频号',
    kw: ['中老年','健康','养生','家人','孩子','朋友','转发','收藏','点赞','提醒','注意','警惕','紧急','央视','专家','推荐','实用','生活小妙招','妙招','偏方','家庭','儿女','孝顺','退休','养老金','孙子','孙女'],
    banned: ['最','第一','国家级','绝对','100%','包治','治愈','假药','传销','理财','高收益','领导人','政治','色情','赌博','私信','加微信'],
    pain: ['别','当心','小心','警惕','坑','后悔','出事了','可怕','千万别','危险']
  },
  gzh: {
    max: 64,
    name: '公众号',
    kw: ['深度','干货','重磅','突发','盘点','梳理','独家','专访','深度解读','研究','报告','分析','趋势','洞察','案例','方法论','复盘','拆解','揭秘','总结','万字长文','整理','收藏','清单','指南','实战','手把手','经验','分享','创始人','CEO'],
    banned: ['最','第一','唯一','国家级','最高级','极限词','医疗承诺','投资建议','暴富','稳赚','内幕消息','领导人','涉政','色情','赌博'],
    pain: ['反思','警惕','别再','陷阱','误区','坑','错','失败','教训','危机','隐忧','风险']
  }
};

const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/u;

interface PlatformResult {
  platform: 'xhs' | 'dy' | 'sph' | 'gzh';
  platformName: string;
  score: number;
  matchedKw: string[];
  matchedBanned: string[];
  matchedPain: string[];
  hasDigit: boolean;
  hasEmoji: boolean;
  charCount: number;
  charLimit: number;
  isOverflow: boolean;
  isTooShort: boolean;
  newlineCount: number;
  newlineOk: boolean;
}

interface TitleAnalysis {
  title: string;
  lineIndex: number;
  results: Record<string, PlatformResult>;
  tips: {
    grade: 'perfect' | 'good' | 'normal' | 'poor';
    gradeText: string;
    perPlatform: Record<string, string[]>;
    overall: string[];
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function analyzeTitle(title: string, lineIndex: number, mode: 'short' | 'long', t: typeof i18n.zh): TitleAnalysis {
  const results: Record<string, PlatformResult> = {};
  const newlineCount = (title.match(/\n/g) || []).length;
  const charCountWithoutNewline = title.replace(/\n/g, '').length;

  for (const key of ['xhs', 'dy', 'sph', 'gzh'] as const) {
    const bank = banks[key];
    let score = 0;
    const matchedKw: string[] = [];
    const matchedBanned: string[] = [];
    const matchedPain: string[] = [];

    for (const kw of bank.kw) {
      if (title.includes(kw)) {
        matchedKw.push(kw);
        score += kw.length >= 4 ? 5 : 3;
      }
    }

    const hasDigit = /\d/.test(title);
    if (hasDigit) score += 6;

    const hasEmoji = EMOJI_REGEX.test(title);
    if (hasEmoji) score += key === 'xhs' ? 6 : 4;

    for (const p of bank.pain) {
      if (title.includes(p)) {
        matchedPain.push(p);
        score += 4;
      }
    }

    for (const b of bank.banned) {
      if (title.includes(b)) {
        matchedBanned.push(b);
        score -= 20;
      }
    }

    const charLimit = bank.max;
    const isOverflow = charCountWithoutNewline > charLimit;
    const isTooShort = charCountWithoutNewline < Math.floor(charLimit / 4);
    if (isOverflow) score -= 10;
    else if (isTooShort) score -= 4;
    else score += 4;

    let newlineOk = true;
    if (mode === 'short') {
      if (newlineCount <= 2) score += 3;
      else if (newlineCount > 3) { score -= 5; newlineOk = false; }
    } else {
      if (newlineCount >= 1 && newlineCount <= 3) score += 3;
      else { newlineOk = false; }
    }

    score = clamp(score, 0, 100);

    results[key] = {
      platform: key,
      platformName: bank.name,
      score,
      matchedKw,
      matchedBanned,
      matchedPain,
      hasDigit,
      hasEmoji,
      charCount: charCountWithoutNewline,
      charLimit,
      isOverflow,
      isTooShort,
      newlineCount,
      newlineOk,
    };
  }

  const avgScore = Object.values(results).reduce((s, r) => s + r.score, 0) / 4;
  let grade: 'perfect' | 'good' | 'normal' | 'poor';
  if (avgScore >= 85) grade = 'perfect';
  else if (avgScore >= 65) grade = 'good';
  else if (avgScore >= 40) grade = 'normal';
  else grade = 'poor';

  const perPlatformTips: Record<string, string[]> = {};
  const overallTips: string[] = [];

  const allHasDigit = Object.values(results).every(r => r.hasDigit);
  const allHasEmoji = Object.values(results).every(r => r.hasEmoji);
  const anyPain = Object.values(results).some(r => r.matchedPain.length > 0);
  const anyBanned = Object.values(results).some(r => r.matchedBanned.length > 0);

  overallTips.push(allHasDigit ? t.hasDigit : t.noDigit);
  overallTips.push(allHasEmoji ? t.hasEmoji : t.noEmoji);
  overallTips.push(anyPain ? t.hasPain : t.noPain);
  if (anyBanned) overallTips.push(t.bannedWarn);

  for (const key of ['xhs', 'dy', 'sph', 'gzh'] as const) {
    const r = results[key];
    const tips: string[] = [];
    if (r.isOverflow) tips.push(t.overflow);
    else tips.push(t.maxed);
    if (!r.newlineOk) tips.push(t.badNewline);
    else tips.push(t.hasNewlineOk);
    if (r.matchedBanned.length > 0) tips.push(t.bannedWarn);
    perPlatformTips[key] = tips;
  }

  const gradeTextMap = { perfect: t.perfect, good: t.good, normal: t.normal, poor: t.poor };

  return {
    title,
    lineIndex,
    results,
    tips: {
      grade,
      gradeText: gradeTextMap[grade],
      perPlatform: perPlatformTips,
      overall: overallTips,
    },
  };
}

function getScoreColor(score: number) {
  if (score >= 85) return 'bg-emerald-500';
  if (score >= 65) return 'bg-lime-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function getGradeBadgeClass(grade: string) {
  switch (grade) {
    case 'perfect': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    case 'good': return 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300';
    case 'normal': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    default: return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  }
}

export default function TitleWeightChecker({ locale = 'zh' }: TitleWeightCheckerProps) {
  const VALID_LOCALES = Object.keys(i18n) as (keyof typeof i18n)[];
  const resolvedLocale = VALID_LOCALES.includes(locale as keyof typeof i18n) ? locale as keyof typeof i18n : 'zh';
  const t = i18n[resolvedLocale] ?? i18n.zh;

  const [inputText, setInputText] = useState<string>('');
  const [mode, setMode] = useState<'short' | 'long'>('short');
  const [copied, setCopied] = useState(false);

  const titles = useMemo(() => {
    return inputText.split('\n').filter(l => l.trim().length > 0);
  }, [inputText]);

  const analyses = useMemo<TitleAnalysis[]>(() => {
    return titles.map((title, idx) => analyzeTitle(title, idx, mode, t as typeof i18n.zh));
  }, [titles, mode, t]);

  function buildAllTipsText(): string {
    const lines: string[] = [];
    for (const a of analyses) {
      lines.push(`--- ${a.title} ---`);
      lines.push(a.tips.gradeText);
      for (const tip of a.tips.overall) lines.push(tip);
      for (const key of ['xhs', 'dy', 'sph', 'gzh'] as const) {
        const r = a.results[key];
        lines.push(`[${r.platformName}] ${r.score}/100`);
        for (const tip of a.tips.perPlatform[key] || []) lines.push(`  ${tip}`);
        if (r.matchedKw.length) lines.push(`  KW: ${r.matchedKw.join(', ')}`);
        if (r.matchedBanned.length) lines.push(`  BANNED: ${r.matchedBanned.join(', ')}`);
      }
      lines.push('');
    }
    return lines.join('\n');
  }

  async function handleCopy() {
    const text = buildAllTipsText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  const platformKeys: ('xhs' | 'dy' | 'sph' | 'gzh')[] = ['xhs', 'dy', 'sph', 'gzh'];
  const platformLabels = { xhs: t.xhs, dy: t.dy, sph: t.sph, gzh: t.gzh };

  return (
    <div className="rounded-2xl border bg-white dark:bg-gray-900 p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.input}</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.placeHolder}
              rows={6}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              dir={resolvedLocale === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setMode('short')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                mode === 'short'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {t.modeShort}
            </button>
            <button
              onClick={() => setMode('long')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                mode === 'long'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {t.modeLong}
            </button>
          </div>

          {analyses.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {platformKeys.map((pkey) => (
                <div key={pkey} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{platformLabels[pkey]}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t.limit}: {banks[pkey].max}</span>
                  </div>
                  <div className="space-y-3">
                    {analyses.map((a) => {
                      const r = a.results[pkey];
                      return (
                        <div key={`${pkey}-${a.lineIndex}`} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400 truncate max-w-[120px]" title={a.title}>
                              #{a.lineIndex + 1}
                            </span>
                            <span className="font-bold text-gray-900 dark:text-gray-100">{r.score}</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${getScoreColor(r.score)}`}
                              style={{ width: `${r.score}%` }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {r.matchedKw.map(kw => (
                              <span key={kw} className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 text-[10px]">
                                {kw}
                              </span>
                            ))}
                            {r.matchedBanned.map(bw => (
                              <span key={bw} className="rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 text-[10px] font-medium">
                                {bw}
                              </span>
                            ))}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">
                            {t.limit}: {r.charCount}/{r.charLimit}
                            {r.isOverflow && <span className="text-red-500 ml-1">❌</span>}
                            {!r.isOverflow && !r.isTooShort && <span className="text-emerald-500 ml-1">✅</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">{t.tips}</h3>
              <button
                onClick={handleCopy}
                disabled={analyses.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {t.copySuggest}
              </button>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {analyses.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-8">
                  {t.input}
                </p>
              )}
              {analyses.map((a) => (
                <div key={a.lineIndex} className="rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 flex-1">
                      <span className="text-gray-400 mr-1">#{a.lineIndex + 1}</span>
                      {a.title}
                    </p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${getGradeBadgeClass(a.tips.grade)}`}>
                      {a.tips.gradeText.split(' ')[0]}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {a.tips.overall.map((tip, i) => (
                      <p key={i} className="text-xs text-gray-600 dark:text-gray-400">{tip}</p>
                    ))}
                  </div>
                  <div className="pt-1 border-t border-gray-100 dark:border-gray-700 space-y-1">
                    {platformKeys.map(pkey => {
                      const r = a.results[pkey];
                      return (
                        <div key={pkey} className="text-[11px]">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{platformLabels[pkey]}</span>
                          <span className="mx-1 text-gray-400">·</span>
                          <span className="text-gray-600 dark:text-gray-400">{r.score}/100</span>
                          <span className="mx-1 text-gray-400">·</span>
                          <span className={r.isOverflow ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}>
                            {r.charCount}/{r.charLimit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
