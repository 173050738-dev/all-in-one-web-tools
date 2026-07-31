'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Copy, Check, Sparkles, Zap } from 'lucide-react';

type Locale = 'zh' | 'en' | 'fr' | 'es' | 'hi' | 'ar';

const LOCALE_STRINGS: Record<Locale, Record<string, string>> = {
  zh: {
    title: '球星名字花体装饰工具',
    placeholder: '输入球星名字或任意文字，例如：Messi、姆巴佩、C罗…',
    subtitle: '一键生成足球风花体字+特殊符号装饰，粘贴到社交平台超吸睛',
    variantsTitle: '装饰变体（点击卡片即可复制）',
    copiedToast: '已复制 ✓',
    sampleTip: '示例样式：粘贴到抖音标题/小红书评论/朋友圈签名/X/Instagram Bio',
    emptyTip: '请输入文字，立即生成足球风装饰样式 ⚽',
    preset: '⚡ 快速预设',
    categoryFancy: '花体字母变体 (10种字体)',
    categoryCool: '酷炫 ⚽ 风',
    categoryTrophy: '奖杯 🏆 风',
    categoryCrown: '皇冠 👑 风',
    categoryStar: '星星 ⭐ 风',
    categoryArrow: '箭头 ➤ 风',
    categoryBracket: '括号 「」 风',
    categoryStrike: '划线删除 / 上标下标',
    categoryEmoji: 'Emoji 主题组合',
  },
  en: {
    title: 'Fancy Football Name Decorator',
    placeholder: 'Enter player name or any text, e.g. Messi, Mbappé, Ronaldo…',
    subtitle: 'Generate football-style fancy text + symbol decorations, paste anywhere',
    variantsTitle: 'Decoration variants (click card to copy)',
    copiedToast: 'Copied ✓',
    sampleTip: 'Paste into TikTok captions, X posts, Instagram bio, WhatsApp status for extra pop',
    emptyTip: 'Enter text to generate football-themed decor ⚽',
    preset: '⚡ Quick presets',
    categoryFancy: 'Fancy letters (10 fonts)',
    categoryCool: 'Cool ⚽ style',
    categoryTrophy: 'Trophy 🏆 style',
    categoryCrown: 'Crown 👑 style',
    categoryStar: 'Star ⭐ style',
    categoryArrow: 'Arrow ➤ style',
    categoryBracket: 'Bracket 「」 style',
    categoryStrike: 'Strikethrough / Super Sub script',
    categoryEmoji: 'Emoji theme combos',
  },
  fr: {
    title: 'Décorateur Nom Joueur Style Foot',
    placeholder: 'Nom du joueur ou texte : Messi, Mbappé, Ronaldo…',
    subtitle: 'Générez du texte style foot + symboles, collez partout',
    variantsTitle: 'Variantes (cliquer pour copier)',
    copiedToast: 'Copié ✓',
    sampleTip: 'Collez dans TikTok, X, bio Instagram, WhatsApp',
    emptyTip: 'Saisissez du texte ⚽',
    preset: '⚡ Rapides',
    categoryFancy: 'Lettres fantaisie (10 polices)',
    categoryCool: 'Cool ⚽',
    categoryTrophy: 'Trophée 🏆',
    categoryCrown: 'Couronne 👑',
    categoryStar: 'Étoile ⭐',
    categoryArrow: 'Flèche ➤',
    categoryBracket: 'Crochets 「」',
    categoryStrike: 'Barré / Indices',
    categoryEmoji: 'Combos Emoji',
  },
  es: {
    title: 'Decorador Nombre Jugador Futbol',
    placeholder: 'Nombre del jugador o texto: Messi, Mbappé, Ronaldo…',
    subtitle: 'Genera texto estilo fútbol + símbolos, pega donde quieras',
    variantsTitle: 'Variantes (clic para copiar)',
    copiedToast: 'Copiado ✓',
    sampleTip: 'Pega en TikTok, X, bio Instagram, WhatsApp',
    emptyTip: 'Introduce texto ⚽',
    preset: '⚡ Rápidos',
    categoryFancy: 'Letras decoradas (10 fuentes)',
    categoryCool: 'Guay ⚽',
    categoryTrophy: 'Trofeo 🏆',
    categoryCrown: 'Corona 👑',
    categoryStar: 'Estrella ⭐',
    categoryArrow: 'Flecha ➤',
    categoryBracket: 'Corchetes 「」',
    categoryStrike: 'Tachado / Superíndice',
    categoryEmoji: 'Combos Emoji',
  },
  hi: {
    title: 'फुटबॉल खिलाड़ी नाम डेकोरेटर',
    placeholder: 'खिलाड़ी का नाम या टेक्स्ट: Messi, Mbappé, Ronaldo…',
    subtitle: 'फुटबॉल स्टाइल फैंसी टेक्स्ट + सिंबल, कहीं भी पेस्ट करें',
    variantsTitle: 'वेरिएंट्स (कॉपी करने के लिए क्लिक)',
    copiedToast: 'कॉपी हो गया ✓',
    sampleTip: 'TikTok, X, Instagram बायो, WhatsApp में पेस्ट करें',
    emptyTip: 'टेक्स्ट डालें ⚽',
    preset: '⚡ क्विक',
    categoryFancy: 'फैंसी अक्षर (10 फॉन्ट)',
    categoryCool: 'कूल ⚽',
    categoryTrophy: 'ट्रॉफी 🏆',
    categoryCrown: 'क्राउन 👑',
    categoryStar: 'स्टार ⭐',
    categoryArrow: 'एरो ➤',
    categoryBracket: 'ब्रैकेट 「」',
    categoryStrike: 'स्ट्राइक / सुपर सब',
    categoryEmoji: 'इमोजी कॉम्बो',
  },
  ar: {
    title: 'مزخرف أسماء لاعبي كرة القدم',
    placeholder: 'اسم اللاعب أو أي نص: Messi, Mbappé, Ronaldo…',
    subtitle: 'أنشئ نصاً مزخرفاً بأسلوب كرة القدم + رموز',
    variantsTitle: 'الأنواع (انقر للنسخ)',
    copiedToast: 'تم النسخ ✓',
    sampleTip: 'لصق في تيك توك، X، بايو إنستغرام، واتساب',
    emptyTip: 'أدخل نصاً ⚽',
    preset: '⚡ سريع',
    categoryFancy: 'حروف مزخرفة (10 خطوط)',
    categoryCool: 'رائع ⚽',
    categoryTrophy: 'كأس 🏆',
    categoryCrown: 'تاج 👑',
    categoryStar: 'نجمة ⭐',
    categoryArrow: 'سهم ➤',
    categoryBracket: 'أقواس 「」',
    categoryStrike: 'مشطوب / علوي سفلي',
    categoryEmoji: 'مزيج إيموجي',
  },
};

const FANCY_ALPHABET: { label: string; map: Record<string, string> }[] = [
  { label: 'Bold Serif 粗体衬线', map: buildMap('𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗') },
  { label: 'Script 手写花体', map: buildMap('𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏0123456789', false) },
  { label: 'Gothic 哥特黑', map: buildMap('𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷0123456789', false) },
  { label: 'Double 双线', map: buildMap('𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡') },
  { label: 'Monospace 等宽', map: buildMap('𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿') },
  { label: 'Bold Sans 粗无衬线', map: buildMap('𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵') },
  { label: 'Italic Sans 斜体无衬线', map: buildMap('𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻0123456789', false) },
  { label: 'Circled 圆圈字母', map: buildMap('ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨', false) },
  { label: 'Squared 方盒', map: buildMap('🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789', false) },
  { label: 'Cursive 草书连笔', map: buildMap('𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789', false) },
];

function buildMap(target: string, digits: boolean = true): Record<string, string> {
  const src = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' + (digits ? '0123456789' : '');
  const result: Record<string, string> = {};
  for (let i = 0; i < src.length; i++) {
    if (target[i]) result[src[i]] = target[i];
  }
  return result;
}

const STRIKE_CHARS: Record<string, string> = {
  a: 'a̶', b: 'b̶', c: 'c̶', d: 'd̶', e: 'e̶', f: 'f̶', g: 'g̶', h: 'h̶',
  i: 'i̶', j: 'j̶', k: 'k̶', l: 'l̶', m: 'm̶', n: 'n̶', o: 'o̶', p: 'p̶',
  q: 'q̶', r: 'r̶', s: 's̶', t: 't̶', u: 'u̶', v: 'v̶', w: 'w̶', x: 'x̶',
  y: 'y̶', z: 'z̶',
  A: 'A̶', B: 'B̶', C: 'C̶', D: 'D̶', E: 'E̶', F: 'F̶', G: 'G̶', H: 'H̶',
  I: 'I̶', J: 'J̶', K: 'K̶', L: 'L̶', M: 'M̶', N: 'N̶', O: 'O̶', P: 'P̶',
  Q: 'Q̶', R: 'R̶', S: 'S̶', T: 'T̶', U: 'U̶', V: 'V̶', W: 'W̶', X: 'X̶',
  Y: 'Y̶', Z: 'Z̶',
  '0': '0̶', '1': '1̶', '2': '2̶', '3': '3̶', '4': '4̶', '5': '5̶', '6': '6̶', '7': '7̶', '8': '8̶', '9': '9̶',
};

const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
  j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ',
  t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
};

const SUBSCRIPT: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ',
  o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
};

function applyMap(text: string, map: Record<string, string>): string {
  return text.split('').map((c) => map[c] ?? c).join('');
}

const PRESETS = [
  { key: 'messi', label: 'Messi' },
  { key: 'ronaldo', label: 'Ronaldo' },
  { key: 'mbappe', label: 'Mbappé' },
  { key: 'neymar', label: 'Neymar' },
  { key: 'haaland', label: 'Haaland' },
];

interface Props { locale?: Locale; }

const WcNameDecorator: React.FC<Props> = ({ locale = 'zh' }) => {
  const t = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;
  const [text, setText] = useState<string>(locale === 'zh' ? 'Messi GOAT' : 'Messi GOAT');
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!copiedIdx) return;
    const tm = setTimeout(() => setCopiedIdx(null), 1400);
    return () => clearTimeout(tm);
  }, [copiedIdx]);

  const variants = useMemo(() => {
    if (!mounted) {
      return { fancy: [], cool: [], trophy: [], crown: [], star: [], arrow: [], bracket: [], strike: [], emoji: [] } as const;
    }
    const s = text.trim();
    if (!s) {
      return { fancy: [], cool: [], trophy: [], crown: [], star: [], arrow: [], bracket: [], strike: [], emoji: [] } as const;
    }

    const fancy = FANCY_ALPHABET.map((f) => ({ label: f.label, value: applyMap(s, f.map) }));

    const cool = [
      `⚡ ${s} • Hattrick Hero ⚡`,
      `🔥 ${s} • Goal Machine 🔥`,
      `⚽💨 ${s} • Winger Speed 💨⚽`,
      `🇦🇷⚽ ${s} • Magic Feet ⚽🇦🇷`,
      `💪 ${s} • Unstoppable 💪`,
      `🎯 ${s} • Deadly Finisher 🎯`,
    ];

    const trophy = [
      `🏆 ${s} • World Champion 🏆`,
      `🥇 ${s} • Golden Ball Winner 🥇`,
      `🏆⭐ ${s} • Trophy Hunter ⭐🏆`,
      `👑🏆 ${s} • Kings of Europe 🏆👑`,
      `🏅 ${s} • Best XI • Player of the Year 🏅`,
      `🎖️ ${s} • Legacy • Legendary 🎖️`,
    ];

    const crown = [
      `👑 ${s} • The King 👑`,
      `♔ ${s} • GOAT Status ♔`,
      `👑✨ ${s} • Royal Class ✨👑`,
      `♛ ${s} • Emperor of Football ♛`,
      `👑⚽ ${s} • Crown Holder ⚽👑`,
      `🤴 ${s} • Prince → King 🤴`,
    ];

    const star = [
      `⭐ ${s} • Shining Star ⭐`,
      `✨🌟 ${s} • MVP Performance 🌟✨`,
      `⭐⭐⭐ ${s} • 5 Star Rating ⭐⭐⭐`,
      `💫 ${s} • Galactic Talent 💫`,
      `🌠 ${s} • Shooting Star 🌠`,
      `✦ ${s} • Rising Star • Golden Boy ✦`,
    ];

    const arrow = [
      `➤ ${s} → Next Level`,
      `➤➤ ${s} » GOAT Mode »`,
      `▶ ${s} ▶ ▶ ▶ Legendary`,
      `↠ ${s} ⇒ Breakout Season ⇒`,
      `➜ ${s} ➜ Champion Lane ➜`,
      `⇨ ${s} ➠ Rising ↑ Up ↑⇨`,
    ];

    const bracket = [
      `「 ${s} 」 • GOAT`,
      `『 ${s} 』 • Legend`,
      `《 ${s} 》 • World Class`,
      `〔 ${s} 〕 • All Time XI`,
      `〖 ${s} 〗 • Hall of Fame`,
      `【 ${s} 】 • Ballon d'Or`,
      `（ ${s} ） • Golden Generation`,
    ];

    const strikeS = applyMap(s, STRIKE_CHARS);
    const superS = applyMap(s, SUPERSCRIPT);
    const subS = applyMap(s, SUBSCRIPT);
    const strike = [
      `${strikeS} → ${s} (Comeback)`,
      `Old: ${strikeS}  → New: ${s} 2.0 ✅`,
      `${s}™ [MVP]ᵀᴹ  ⁽${superS}⁾`,
      `${s}  ⁿᵒ¹  ⁽ᴳᴼᴬᵀ⁺⁾`,
      `H₂${subS}O • ${s} Sub Edition`,
      `${s} CH₄ • Formula ${subS}`,
    ];

    const emoji = [
      `⚽🏆👑 ${s} 👑🏆⚽`,
      `🔥💯⭐ ${s} ⭐💯🔥`,
      `🇶🇦🇦🇷 ${s} 🇫🇷🇧🇷  • 2026 Favorites`,
      `🎊🎉 ${s} • Party Time 🎉🎊`,
      `🦵💨 ${s} • Bicycle Kick ⚽🥅`,
      `✨⚡ ${s} • Speed ⚡ Dribble ⚽ Shoot ✨`,
    ];

    return { fancy, cool, trophy, crown, star, arrow, bracket, strike, emoji };
  }, [text, mounted]);

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(key);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedIdx(key);
    }
  };

  const sections: { title: string; items: { label?: string; value: string }[]; prefix: string; mono?: boolean }[] = [
    { title: t.categoryFancy, items: [...variants.fancy] as { label?: string; value: string }[], prefix: 'fancy' },
    { title: t.categoryCool, items: variants.cool.map(v => ({ value: v })), prefix: 'cool' },
    { title: t.categoryTrophy, items: variants.trophy.map(v => ({ value: v })), prefix: 'trophy' },
    { title: t.categoryCrown, items: variants.crown.map(v => ({ value: v })), prefix: 'crown' },
    { title: t.categoryStar, items: variants.star.map(v => ({ value: v })), prefix: 'star' },
    { title: t.categoryArrow, items: variants.arrow.map(v => ({ value: v })), prefix: 'arrow' },
    { title: t.categoryBracket, items: variants.bracket.map(v => ({ value: v })), prefix: 'bracket' },
    { title: t.categoryStrike, items: variants.strike.map(v => ({ value: v })), prefix: 'strike' },
    { title: t.categoryEmoji, items: variants.emoji.map(v => ({ value: v })), prefix: 'emoji' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="card-base p-5 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-[color:var(--color-primary)]" />
          <h1 className="text-[18px] font-bold">{t.title}</h1>
        </div>
        <p className="text-[13px] text-[color:var(--color-text-secondary)] mb-4">{t.subtitle}</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          className="input-base w-full !min-h-[96px] resize-y text-[14px]"
          style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
        />
        <div className="mt-3">
          <div className="text-[12px] text-[color:var(--color-text-secondary)] mb-2 inline-flex items-center gap-1">
            <Zap className="w-3.5 h-3.5"/> {t.preset}
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setText(p.label)}
                className="!h-10 !px-4 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] text-[13px] font-medium inline-flex items-center gap-1.5 transition touch-manipulation"
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 40 }}
              >
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-white text-[10px] font-bold inline-flex items-center justify-center">
                  {p.label[0]}
                </span>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-[12px] text-[color:var(--color-text-secondary)]">{t.sampleTip}</div>
      </div>

      {!text.trim() ? (
        <div className="card-base p-8 text-center text-[color:var(--color-text-secondary)] text-[14px]">{t.emptyTip}</div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {sections.map((sec) => (
            <Section
              key={sec.prefix}
              title={sec.title}
              items={sec.items}
              prefix={sec.prefix}
              onCopy={handleCopy}
              copiedIdx={copiedIdx}
              t={t}
              mono={sec.mono}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface SectionProps {
  title: string;
  items: { label?: string; value: string }[];
  prefix: string;
  onCopy: (value: string, key: string) => void;
  copiedIdx: string | null;
  t: Record<string, string>;
  mono?: boolean;
}
const Section: React.FC<SectionProps> = ({ title, items, prefix, onCopy, copiedIdx, t, mono }) => (
  <div className="card-base p-4 sm:p-5">
    <h3 className="text-[15px] font-semibold mb-3">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
      {items.map((v, i) => {
        const key = `${prefix}-${i}`;
        const copied = copiedIdx === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onCopy(v.value, key)}
            className="group text-left rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-bg-tertiary)] transition-all p-3 sm:p-4 relative touch-manipulation"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 52 }}
          >
            {v.label && (
              <div className="text-[11px] font-medium text-[color:var(--color-text-secondary)] mb-1.5 pr-8">{v.label}</div>
            )}
            <div className={`pr-10 whitespace-pre-wrap break-all ${mono ? 'font-mono text-[12px] sm:text-[13px] leading-relaxed' : 'text-[14px] sm:text-[15px] leading-relaxed'}`}>{v.value}</div>
            <div className="absolute top-2 right-2 w-8 h-8 inline-flex items-center justify-center rounded-full bg-[color:var(--color-primary)] text-white shrink-0">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </div>
            {copied && (
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 z-10 text-[12px] bg-[color:var(--color-primary)] text-white px-3 py-1 rounded-[6px] whitespace-nowrap shadow-lg">
                {t.copiedToast}
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default WcNameDecorator;
