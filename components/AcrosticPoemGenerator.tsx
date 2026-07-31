'use client';

import { useState, useCallback, useRef } from 'react';
import { Copy, Check, Sparkles, RefreshCw, Download, Feather, BookOpen, Palette, Heart, Sun, Star, Flower2, Mountain } from 'lucide-react';

interface Props { locale?: string; }

type PoemType = 'qiyan' | 'wuyan';
type Theme = 'zhufu' | 'biaoqing' | 'shangwu' | 'fengjing' | 'li';

const I18N: Record<string, Record<string, string>> = {
  zh: {
    title: '藏头诗生成器',
    subtitle: '输入关键词，生成优雅的中文藏头诗',
    keywordLabel: '藏头诗关键词',
    keywordPlaceholder: '输入1-8个字的关键词...',
    keywordHint: '1-8个汉字，每个字作一首诗的首字',
    typeLabel: '诗体',
    qiyan: '七言诗',
    wuyan: '五言诗',
    qiyanDesc: '每句7字',
    wuyanDesc: '每句5字',
    themeLabel: '主题',
    zhufu: '祝福',
    biaoqing: '表白',
    shangwu: '商务',
    fengjing: '风景',
    li: '励志',
    generate: '生成藏头诗',
    regenerate: '换一首',
    copy: '复制',
    copied: '已复制',
    download: '下载图片',
    result: '您的藏头诗',
    empty: '输入关键词、选择诗体和主题，点击生成',
    tip: '💡 关键词可以是名字、祝福、成语等',
    copiedToast: '已复制到剪贴板',
    downloadToast: '图片已下载',
    lines: '行',
    chars: '字',
  },
  en: {
    title: 'Chinese Acrostic Poem Generator',
    subtitle: 'Enter a keyword to generate elegant Chinese acrostic poems',
    keywordLabel: 'Keyword',
    keywordPlaceholder: 'Enter 1-8 Chinese characters...',
    keywordHint: '1-8 characters, each becomes the first character of a line',
    typeLabel: 'Poem Type',
    qiyan: 'Seven-Char',
    wuyan: 'Five-Char',
    qiyanDesc: '7 chars per line',
    wuyanDesc: '5 chars per line',
    themeLabel: 'Theme',
    zhufu: 'Blessing',
    biaoqing: 'Love',
    shangwu: 'Business',
    fengjing: 'Scenery',
    li: 'Inspiration',
    generate: 'Generate Poem',
    regenerate: 'Another',
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download Image',
    result: 'Your Acrostic Poem',
    empty: 'Enter a keyword, choose type and theme, then click generate',
    tip: '💡 Keywords can be names, blessings, idioms, etc.',
    copiedToast: 'Copied to clipboard',
    downloadToast: 'Image downloaded',
    lines: 'lines',
    chars: 'chars',
  },
  es: {
    title: 'Generador de Poemas Acrósticos',
    subtitle: 'Ingresa una palabra clave para generar poemas acrósticos chinos',
    keywordLabel: 'Palabra Clave',
    keywordPlaceholder: 'Ingresa 1-8 caracteres chinos...',
    keywordHint: '1-8 caracteres, cada uno es el primer carácter de una línea',
    typeLabel: 'Tipo de Poema',
    qiyan: 'Siete Carac',
    wuyan: 'Cinco Carac',
    qiyanDesc: '7 caracteres por línea',
    wuyanDesc: '5 caracteres por línea',
    themeLabel: 'Tema',
    zhufu: 'Bendición',
    biaoqing: 'Amor',
    shangwu: 'Negocios',
    fengjing: 'Paisaje',
    li: 'Inspiración',
    generate: 'Generar Poema',
    regenerate: 'Otro',
    copy: 'Copiar',
    copied: 'Copiado',
    download: 'Descargar Imagen',
    result: 'Tu Poema Acróstico',
    empty: 'Ingresa palabra clave, elige tipo y tema, luego haz clic',
    tip: '💡 Las palabras clave pueden ser nombres, bendiciones, modismos, etc.',
    copiedToast: 'Copiado al portapapeles',
    downloadToast: 'Imagen descargada',
    lines: 'líneas',
    chars: 'carac',
  },
  fr: {
    title: 'Générateur de Poèmes Acrostiches',
    subtitle: 'Entrez un mot-clé pour générer des poèmes acrostiches chinois',
    keywordLabel: 'Mot-Clé',
    keywordPlaceholder: 'Entrez 1-8 caractères chinois...',
    keywordHint: '1-8 caractères, chacun devient le premier caractère d\'une ligne',
    typeLabel: 'Type de Poème',
    qiyan: 'Sept Carac',
    wuyan: 'Cinq Carac',
    qiyanDesc: '7 caractères par ligne',
    wuyanDesc: '5 caractères par ligne',
    themeLabel: 'Thème',
    zhufu: 'Bénédiction',
    biaoqing: 'Amour',
    shangwu: 'Affaires',
    fengjing: 'Paysage',
    li: 'Inspiration',
    generate: 'Générer le Poème',
    regenerate: 'Encore',
    copy: 'Copier',
    copied: 'Copié',
    download: 'Télécharger l\'Image',
    result: 'Votre Poème Acrostiche',
    empty: 'Entrez un mot-clé, choisissez le type et le thème, puis cliquez',
    tip: '💡 Les mots-clés peuvent être des noms, bénédictions, idiomes, etc.',
    copiedToast: 'Copié dans le presse-papiers',
    downloadToast: 'Image téléchargée',
    lines: 'lignes',
    chars: 'carac',
  },
  hi: {
    title: 'एकरसी कविता जनरेटर',
    subtitle: 'चीनी एकरसी कविताएँ बनाने के लिए कीवर्ड दर्ज करें',
    keywordLabel: 'कीवर्ड',
    keywordPlaceholder: '1-8 चीनी अक्षर दर्ज करें...',
    keywordHint: '1-8 अक्षर, प्रत्येक एक पंक्ति का पहला अक्षर बनता है',
    typeLabel: 'कविता प्रकार',
    qiyan: 'सात अक्षर',
    wuyan: 'पाँच अक्षर',
    qiyanDesc: 'प्रति पंक्ति 7 अक्षर',
    wuyanDesc: 'प्रति पंक्ति 5 अक्षर',
    themeLabel: 'विषय',
    zhufu: 'आशीर्वाद',
    biaoqing: 'प्यार',
    shangwu: 'व्यवसाय',
    fengjing: 'परिदृश्य',
    li: 'प्रेरणा',
    generate: 'कविता जनरेट करें',
    regenerate: 'एक और',
    copy: 'कॉपी',
    copied: 'कॉपी हुआ',
    download: 'छवि डाउनलोड',
    result: 'आपकी एकरसी कविता',
    empty: 'कीवर्ड दर्ज करें, प्रकार और विषय चुनें, फिर क्लिक करें',
    tip: '💡 कीवर्ड नाम, आशीर्वाद, मुहावरे आदि हो सकते हैं।',
    copiedToast: 'क्लिपबोर्ड पर कॉपी हुआ',
    downloadToast: 'छवि डाउनलोड हुई',
    lines: 'पंक्तियाँ',
    chars: 'अक्षर',
  },
  ar: {
    title: 'مولد القصائد الصينية',
    subtitle: 'أدخل كلمة مفتاحية لإنشاء قصائد صينية مقلوبة',
    keywordLabel: 'الكلمة المفتاحية',
    keywordPlaceholder: 'أدخل 1-8 أحرف صينية...',
    keywordHint: '1-8 أحرف، كل حرف هو أول حرف في سطر',
    typeLabel: 'نوع القصيدة',
    qiyan: 'سبعة أحرف',
    wuyan: 'خمسة أحرف',
    qiyanDesc: '7 أحرف لكل سطر',
    wuyanDesc: '5 أحرف لكل سطر',
    themeLabel: 'الموضوع',
    zhufu: 'بركة',
    biaoqing: 'حب',
    shangwu: 'أعمال',
    fengjing: 'منظر',
    li: 'إلهام',
    generate: 'ولّد القصيدة',
    regenerate: 'واحدة أخرى',
    copy: 'نسخ',
    copied: 'تم النسخ',
    download: 'تحميل الصورة',
    result: 'قصيدتك المقلوبة',
    empty: 'أدخل كلمة مفتاحية، اختر النوع والموضوع، ثم انقر',
    tip: '💡 يمكن أن تكون الكلمات المفتاحية أسماء، بركات، أمثال، إلخ.',
    copiedToast: 'تم النسخ إلى الحافظة',
    downloadToast: 'تم تحميل الصورة',
    lines: 'أسطر',
    chars: 'أحرف',
  },
};

const QIYAN_TEMPLATES: Record<Theme, string[][]> = {
  zhufu: [
    ['{}光满庭瑞气浮', '{心}念善和福自临', '{如}意春风花正发', '{意}中明月照前程', '{安}健年年岁月好', '{康}宁日日笑颜新', '{幸}事常随左右伴', '{福}星高照耀门庭'],
    ['{}门喜气满堂前', '{心}怀善念福绵绵', '{如}松之翠经霜雪', '{意}比金石意志坚', '{长}乐未央年年好', '{命}亨时泰事事圆', '{富}贵荣华皆是梦', '{康}健平安即神仙'],
    ['{}开笑口乐陶然', '{心}地光明福自全', '{如}花岁月如春永', '{意}气风发正少年', '{万}事亨通无阻碍', '{事}事如意有因缘', '{如}愿以偿心满足', '{意}中常伴吉祥缘'],
  ],
  biaoqing: [
    ['{}光乍泄暗生情', '{心}动魄摇意难平', '{如}胶似漆缠相伴', '{意}合情投梦同行', '{永}结同心比翼鸟', '{远}山近水共此生', '{相}濡以沫情意重', '{伴}君到老不离分'],
    ['{}眸一笑百媚生', '{心}许身盟两意浓', '{如}影随形情缱绻', '{意}牵梦绕思千重', '{春}宵一刻值千金', '{秋}月圆时分外明', '{山}盟海誓言犹在', '{海}枯石烂情不移'],
    ['{}见倾心便相许', '{心}心相印两相知', '{如}风拂柳情丝绕', '{意}蕴温柔梦亦痴', '{愿}得一人心相托', '{白}首不离共此时', '{不}离不弃长相守', '{悔}教相识恨见迟'],
  ],
  shangwu: [
    ['{}程万里展宏图', '{心}怀壮志海天阔', '{如}日东升气势宏', '{意}气风发事业兴', '{商}海扬帆破浪行', '{业}绩辉煌步步升', '{腾}飞有望前程远', '{达}观知命福满门'],
    ['{}首开创天下先', '{心}思缜密谋全局', '{如}箭在弦势必发', '{意}欲建功业必达', '{千}钧重担一肩挑', '{载}誉而归万民朝', '{成}功之路虽坎坷', '{就}在今朝展英豪'],
    ['{}局在握运筹中', '{心}有丘壑天地宽', '{如}鱼得水展拳脚', '{意}欲飞跃上云端', '{战}略宏图已绘就', '{绩}效可期在眼前', '{辉}煌成就指日待', '{煌}煌大业万年传'],
  ],
  fengjing: [
    ['{}山如画水如琴', '{心}旷神怡意自宁', '{如}诗似画天然景', '{意}趣横生韵无穷', '{春}风送暖花开早', '{秋}月映舟渔火明', '{山}清水秀皆成趣', '{人}在画中不觉行'],
    ['{}天碧透云闲悠', '{心}随雁阵过江洲', '{如}烟似雾蒙山色', '{意}兴盎然赏清秋', '{竹}林幽径通深处', '{溪}水潺潺绕石流', '{枫}叶经霜红似火', '{松}涛声里忘机鸥'],
    ['{}光潋滟晴方好', '{心}悦山川万物娇', '{如}画亭台临水建', '{意}中天地一渔樵', '{桃}花流水三春溪', '{柳}叶垂丝二月条', '{鸳}鸯并戏荷池上', '{鹭}鸶闲立晚风潮'],
  ],
  li: [
    ['{}行有志事竟成', '{心}坚志毅步不停', '{如}百炼钢化为绕', '{意}气冲天万丈虹', '{千}磨万击还坚劲', '{难}能可贵在持恒', '{登}峰造极终有日', '{顶}天立地傲苍穹'],
    ['{}心藏志贯如虹', '{心}怀天下志凌空', '{如}鹏展翅三千里', '{意}欲摩天万丈峰', '{男}儿何不带吴钩', '{儿}女何分君与卿', '{志}在四方心似铁', '{向}往直前永不回'],
    ['{}途漫漫其修远', '{心}路漫漫志更坚', '{如}逆水行舟不进退', '{意}在苦心志益坚', '{不}经一番寒彻骨', '{怎}得梅花扑鼻香', '{艰}难困苦终有尽', '{玉}汝于成在今朝'],
  ],
};

const WUYAN_TEMPLATES: Record<Theme, string[][]> = {
  zhufu: [
    ['{}光满庭芳', '{心}地自宽宏', '{如}松鹤延年', '{意}气贯长虹', '{安}身且安命', '{康}乐永康宁', '{幸}福长相伴', '{福}寿共绵延'],
    ['{}门纳百福', '{心}地生善缘', '{如}春风化雨', '{意}润物无声', '{长}乐复长康', '{命}亨运自昌', '{富}贵不须求', '{康}宁是真仙'],
    ['{}开笑口乐', '{心}地净无埃', '{如}花年年发', '{意}岁岁花开', '{万}事皆如意', '{事}事尽和谐', '{如}愿心常足', '{意}中春自来'],
  ],
  biaoqing: [
    ['{}光暗生情', '{心}动意难平', '{如}影随君侧', '{意}合情自浓', '{永}结同心约', '{远}近不离踪', '{相}看两不厌', '{伴}君到白头'],
    ['{}眸百媚生', '{心}许两相知', '{如}胶漆相投', '{意}缠绵难释', '{春}宵值千金', '{秋}月分外明', '{山}海盟犹在', '{白}首不相违'],
    ['{}见便倾心', '{心}心两印同', '{如}风拂柳丝', '{意}绕梦魂中', '{愿}得一人心', '{白}首共此生', '{不}离亦不弃', '{悔}不早相逢'],
  ],
  shangwu: [
    ['{}程展宏图', '{心}怀远大志', '{如}日升东方', '{意}气凌云飞', '{商}海破浪行', '{业}绩步步高', '{腾}飞正当时', '{达}观福自招'],
    ['{}首天下先', '{心}思缜密谋', '{如}箭在弦上', '{意}欲建功业', '{千}钧担一肩', '{载}誉万民朝', '{成}功路虽远', '{就}在今朝展'],
    ['{}局已在握', '{心}有丘壑远', '{如}鱼得水欢', '{意}欲上云端', '{战}略绘宏图', '{绩}效可期见', '{辉}煌终有时', '{煌}煌大业传'],
  ],
  fengjing: [
    ['{}山如画屏', '{心}旷神自宁', '{如}诗复似画', '{意}趣韵无穷', '{春}花送暗香', '{秋}月映舟轻', '{山}青水亦秀', '{人}在画中行'],
    ['{}天云悠悠', '{心}随雁南归', '{如}烟山色蒙', '{意}兴赏清秋', '{竹}径通幽处', '{溪}水绕石流', '{枫}叶红似火', '{松}涛忘机鸥'],
    ['{}光潋滟好', '{心}悦万物娇', '{如}画亭台建', '{意}中一渔樵', '{桃}花流水溪', '{柳}叶垂丝条', '{鸳}鸯戏荷上', '{鹭}鸶立晚潮'],
  ],
  li: [
    ['{}行志竟成', '{心}坚步不停', '{如}百炼钢绕', '{意}气冲天虹', '{千}磨还坚劲', '{难}能贵持恒', '{登}峰终有日', '{顶}天傲苍穹'],
    ['{}心藏志虹', '{心}怀天下空', '{如}鹏展三千里', '{意}欲摩天峰', '{志}在四方心似铁', '{向}往直前不回头'],
    ['{}途漫漫修', '{心}路志更坚', '{如}逆水行舟', '{意}苦心志坚', '{不}经彻骨寒', '{怎}得梅花香', '{艰}难终有尽', '{玉}成在今朝'],
  ],
};

const FILLER_POOL: Record<Theme, string[]> = {
  zhufu: ['瑞', '祥', '福', '禄', '寿', '喜', '财', '康', '安', '乐'],
  biaoqing: ['情', '意', '心', '思', '念', '爱', '恋', '思', '慕', '眷'],
  shangwu: ['兴', '隆', '腾', '达', '盛', '旺', '盈', '丰', '满', '昌'],
  fengjing: ['秀', '美', '幽', '雅', '清', '新', '奇', '妙', '灵', '韵'],
  li: ['志', '坚', '毅', '勇', '敢', '果', '决', '信', '韧', '恒'],
};

const STYLE_META: Record<Theme, { icon: typeof Heart; gradient: string; emoji: string }> = {
  zhufu: { icon: Sparkles, gradient: 'from-rose-400 to-pink-500', emoji: '🎋' },
  biaoqing: { icon: Heart, gradient: 'from-pink-400 to-rose-500', emoji: '💕' },
  shangwu: { icon: Sun, gradient: 'from-amber-400 to-orange-500', emoji: '💼' },
  fengjing: { icon: Flower2, gradient: 'from-emerald-400 to-teal-500', emoji: '🏞️' },
  li: { icon: Star, gradient: 'from-indigo-400 to-purple-500', emoji: '🔥' },
};

const TYPE_META: Record<PoemType, { icon: typeof BookOpen; gradient: string; label: string }> = {
  qiyan: { icon: BookOpen, gradient: 'from-amber-400 to-orange-500', label: '七言' },
  wuyan: { icon: Feather, gradient: 'from-emerald-400 to-teal-500', label: '五言' },
};

export default function AcrosticPoemGenerator({ locale = 'zh' }: Props) {
  const t = I18N[locale] || I18N.en;
  const isRTL = locale === 'ar';

  const [keyword, setKeyword] = useState('');
  const [poemType, setPoemType] = useState<PoemType>('qiyan');
  const [theme, setTheme] = useState<Theme>('zhufu');
  const [poem, setPoem] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }, []);

  const generatePoem = useCallback(() => {
    const chars = keyword.trim().split('').filter(c => /[\u4e00-\u9fff]/.test(c));
    if (chars.length === 0) return;

    setIsGenerating(true);
    setPoem([]);

    const templates = poemType === 'qiyan' ? QIYAN_TEMPLATES : WUYAN_TEMPLATES;
    const themeTemplates = templates[theme];
    const template = themeTemplates[Math.floor(Math.random() * themeTemplates.length)];

    const lines: string[] = [];
    for (let i = 0; i < chars.length; i++) {
      if (i < template.length) {
        lines.push(template[i].replace('{}', chars[i]));
      } else {
        const filler = FILLER_POOL[theme];
        const extraFill = filler[Math.floor(Math.random() * filler.length)];
        const lineLen = poemType === 'qiyan' ? 7 : 5;
        let line = chars[i] + extraFill;
        while (line.length < lineLen) {
          line += filler[Math.floor(Math.random() * filler.length)];
        }
        lines.push(line.slice(0, lineLen));
      }
    }

    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      setPoem(lines.slice(0, idx));
      if (idx >= lines.length) {
        clearInterval(timer);
        setIsGenerating(false);
      }
    }, 300);
  }, [keyword, poemType, theme]);

  const handleCopy = useCallback(async () => {
    if (poem.length === 0) return;
    const text = poem.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast(t.copiedToast);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      showToast(t.copiedToast);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [poem, t, showToast]);

  const handleDownload = useCallback(() => {
    if (poem.length === 0 || !cardRef.current) return;
    const w = 800;
    const lineCount = poem.length;
    const lineHeight = 50;
    const padding = 60;
    const h = padding * 2 + lineCount * lineHeight + 80;

    const canvas = document.createElement('canvas');
    canvas.width = w * 2;
    canvas.height = h * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);

    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#fdf8f3');
    bgGrad.addColorStop(0.5, '#faf0e6');
    bgGrad.addColorStop(1, '#f5e6d3');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    ctx.fillStyle = '#8B4513';
    ctx.font = 'bold 28px "KaiTi", "STKaiti", "Ma Shan Zheng", serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.title, w / 2, padding);

    ctx.font = '32px "KaiTi", "STKaiti", "Ma Shan Zheng", serif';
    ctx.fillStyle = '#2c1810';
    poem.forEach((line, i) => {
      ctx.fillText(line, w / 2, padding + 50 + i * lineHeight);
    });

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#a0522d';
    ctx.fillText('✨ Korelyy ✨', w / 2, h - 25);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `poem-${keyword || 'acrostic'}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(t.downloadToast);
    });
  }, [poem, keyword, t, showToast]);

  const themeKeys: Theme[] = ['zhufu', 'biaoqing', 'shangwu', 'fengjing', 'li'];
  const typeKeys: PoemType[] = ['qiyan', 'wuyan'];

  return (
    <div className={`w-full max-w-2xl mx-auto ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <Feather className="w-8 h-8 text-amber-600" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
            {t.title}
          </h1>
        </div>
        <p className="text-gray-500 text-sm">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5 sm:p-7 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.keywordLabel}</label>
          <div className="relative">
            <Palette className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t.keywordPlaceholder}
              maxLength={8}
              className={`w-full py-3 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:ring-0 outline-none transition-all text-gray-800 text-lg`}
              dir="auto"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{t.keywordHint}</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">{t.typeLabel}</label>
          <div className="grid grid-cols-2 gap-2">
            {typeKeys.map((key) => {
              const meta = TYPE_META[key];
              const selected = poemType === key;
              const IconComp = meta.icon;
              return (
                <button
                  key={key}
                  onClick={() => setPoemType(key)}
                  className={`relative p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                    selected
                      ? `border-transparent bg-gradient-to-br ${meta.gradient} text-white shadow-lg scale-[1.02]`
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-amber-300 hover:bg-white'
                  }`}
                >
                  <IconComp className={`w-5 h-5 mx-auto mb-1 ${selected ? 'text-white' : 'text-gray-500'}`} />
                  <div className={`text-sm font-bold ${selected ? 'text-white' : 'text-gray-700'}`}>{t[key]}</div>
                  <div className={`text-[10px] mt-0.5 ${selected ? 'text-white/90' : 'text-gray-400'}`}>{t[`${key}Desc`]}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">{t.themeLabel}</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {themeKeys.map((key) => {
              const meta = STYLE_META[key];
              const selected = theme === key;
              const IconComp = meta.icon;
              return (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`relative p-2.5 rounded-xl border-2 transition-all duration-200 text-center ${
                    selected
                      ? `border-transparent bg-gradient-to-br ${meta.gradient} text-white shadow-lg scale-105`
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-amber-300 hover:bg-white'
                  }`}
                >
                  <div className="text-xl mb-0.5">{meta.emoji}</div>
                  <div className={`text-xs font-bold ${selected ? 'text-white' : 'text-gray-700'}`}>{t[key]}</div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={generatePoem}
          disabled={keyword.trim().length === 0 || isGenerating}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-rose-500 to-purple-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            {isGenerating ? '...' : t.generate}
          </span>
        </button>
      </div>

      {poem.length > 0 && (
        <div className="mt-5">
          <div
            ref={cardRef}
            className="relative rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xl bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 border-2 border-amber-200"
          >
            <div className="absolute top-2 left-2 text-lg opacity-20">🎋</div>
            <div className="absolute top-2 right-2 text-lg opacity-20">🌸</div>
            <div className="absolute bottom-2 left-2 text-lg opacity-10">✨</div>

            <div className="text-center">
              <div className="text-sm text-amber-700 font-semibold mb-4 flex items-center justify-center gap-1">
                <BookOpen className="w-4 h-4" />
                {t.result}
              </div>
              <div className="space-y-2">
                {poem.map((line, i) => (
                  <div
                    key={i}
                    className="text-xl sm:text-2xl font-semibold text-gray-800 py-1 transition-all duration-300"
                    style={{
                      fontFamily: '"KaiTi", "STKaiti", "Ma Shan Zheng", "Noto Serif SC", serif',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    <span className="text-rose-600">{line.charAt(0)}</span>
                    <span className="text-gray-700">{line.slice(1)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-400">
                {keyword.length} {t.lines} · {poemType === 'qiyan' ? 7 : 5} {t.chars}
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                copied
                  ? 'border-green-400 bg-green-50 text-green-600'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t.copied : t.copy}
            </button>
            <button
              onClick={generatePoem}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50 font-semibold text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              {t.regenerate}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50 font-semibold text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              {t.download}
            </button>
          </div>
        </div>
      )}

      {poem.length === 0 && !isGenerating && (
        <div className="mt-5 text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-2">🎋</div>
          <div>{t.empty}</div>
          <div className="mt-2 text-xs text-gray-400">{t.tip}</div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}