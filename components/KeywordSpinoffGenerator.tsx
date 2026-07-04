'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Check, RefreshCw, Download, Sparkles, ChevronDown } from 'lucide-react';

interface KeywordSpinoffGeneratorProps {
  locale?: string;
}

type IndustryKey = 'beauty' | 'food' | 'home' | 'digital' | 'baby' | 'all';
type ModeKey = 'pun' | 'contrast' | 'question' | 'number';
type BatchSize = 10 | 20 | 50 | 100;

const VALID_LOCALES = ['zh', 'en', 'hi', 'fr', 'es', 'ar'];

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '谐音梗爆款关键词生成器',
    subtitle: '5行业词库，4类标题本地运算不调云AI',
    industry: '选行业：',
    beauty: '美妆',
    food: '美食',
    home: '家居',
    digital: '数码',
    baby: '母婴',
    all: '通用（全部）',
    coreWord: '输入核心词/主题词：',
    outputMode: '生成类型：',
    pun: '谐音梗标题',
    contrast: '反差/对比标题',
    question: '疑问/设问标题',
    number: '数字/量化标题',
    generate: '✨ 生成 20 条爆款标题',
    count: '生成条数：(10/20/50/100)',
    batchSize: '10条  20条  50条  100条',
    results: '生成结果：共 {n} 条',
    copyAll: '📋 复制全部',
    copyXhs: '📋 复制小红书带#标签版',
    exportTXT: '💾 导出 TXT',
    regenOneCard: '🔄 单条重生成',
    templateTip: '生成算法：本地 5 行业 × 4 类模板 × 核心词替换，保证不重复',
    keywordBankTip: '内置 5 行业模板库：美妆(30模板)/美食(28)/家居(25)/数码(26)/母婴(27)，共 136 套基础模板',
    showSeed: '显示种子词 (调试)',
    placeHolder: '示例：口红  螺蛳粉  沙发  耳机  奶粉',
  },
  en: {
    title: 'Pun & Viral Keyword Generator',
    subtitle: '5 industries, 4 classes, no cloud AI',
    industry: 'Industry:',
    beauty: 'Beauty',
    food: 'Food',
    home: 'Home',
    digital: 'Digital',
    baby: 'Baby',
    all: 'All (mix)',
    coreWord: 'Input core word:',
    outputMode: 'Output type:',
    pun: 'Pun titles',
    contrast: 'Contrast titles',
    question: 'Question titles',
    number: 'Number titles',
    generate: '✨ Generate 20 viral',
    count: 'Count:',
    batchSize: '10  20  50  100',
    results: 'Results: {n}',
    copyAll: '📋 Copy all',
    copyXhs: '📋 Copy Xiaohongshu hashtagged',
    exportTXT: '💾 Export TXT',
    regenOneCard: '🔄 Regenerate one',
    templateTip: '5 ind × 4 class templates × core replace, 136 base templates local',
    keywordBankTip: 'Built-in banks: Beauty 30 / Food 28 / Home 25 / Digital 26 / Baby 27',
    showSeed: 'Show seeds (debug)',
    placeHolder: 'Ex: lipstick, ramen, sofa, earbuds, formula',
  },
  hi: {
    title: 'श्लेष वायरल कीवर्ड जनरेटर',
    subtitle: '5 उद्योग, 4 श्रेणी, स्थानीय, कोई क्लाउड नहीं',
    industry: 'उद्योग:',
    beauty: 'सौंदर्य',
    food: 'खाना',
    home: 'घर',
    digital: 'डिजिटल',
    baby: 'शिशु',
    all: 'सभी',
    coreWord: 'मुख्य शब्द डालें:',
    outputMode: 'प्रकार:',
    pun: 'श्लेष शीर्षक',
    contrast: 'विपरीत शीर्षक',
    question: 'प्रश्न',
    number: 'संख्या शीर्षक',
    generate: '✨ 20 वायरल बनाएं',
    count: 'गिनती:',
    batchSize: '10  20  50  100',
    results: 'परिणाम: {n}',
    copyAll: '📋 सभी कॉपी',
    copyXhs: '📋 XHS हैशटैग सहित',
    exportTXT: '💾 TXT निर्यात',
    regenOneCard: '🔄 एक बनाएं फिर से',
    templateTip: '5 उद्योग × 4 श्रेणी टेम्पलेट, 136 बेस',
    keywordBankTip: 'बैंक: Beauty 30 / Food 28 / Home 25 / Digital 26 / Baby 27',
    showSeed: 'बीज दिखाएं',
    placeHolder: 'लिपस्टिक, नूडल्स, सोफा, इयरबड्स, फॉर्मूला',
  },
  fr: {
    title: 'Générateur de Jeux de Mots Viraux',
    subtitle: '5 ind., 4 classes, local sans IA cloud',
    industry: 'Industrie:',
    beauty: 'Beauté',
    food: 'Nourriture',
    home: 'Maison',
    digital: 'Numérique',
    baby: 'Bébé',
    all: 'Tous (mixte)',
    coreWord: 'Mot clé principal:',
    outputMode: 'Type:',
    pun: 'Titres calembours',
    contrast: 'Titres contraste',
    question: 'Titres question',
    number: 'Titres chiffres',
    generate: '✨ Générer 20 viraux',
    count: 'Nb:',
    batchSize: '10  20  50  100',
    results: 'Résultats: {n}',
    copyAll: '📋 Tout copier',
    copyXhs: '📋 XHS hashtag',
    exportTXT: '💾 Exporter TXT',
    regenOneCard: '🔄 Régénérer 1',
    templateTip: '5 ind × 4 classes = 136 gabarits locaux',
    keywordBankTip: 'Banques: Beauté 30 / Nourriture 28 / Maison 25 / Numérique 26 / Bébé 27',
    showSeed: 'Montrer graines',
    placeHolder: 'rouge à lèvres, ramen, sofa, écouteurs, lait',
  },
  es: {
    title: 'Generador de Títulos Virales',
    subtitle: '5 ind., 4 clases, local sin IA nube',
    industry: 'Industria:',
    beauty: 'Belleza',
    food: 'Comida',
    home: 'Hogar',
    digital: 'Digital',
    baby: 'Bebé',
    all: 'Todos',
    coreWord: 'Palabra clave:',
    outputMode: 'Tipo:',
    pun: 'Títulos juegos palabras',
    contrast: 'Títulos contraste',
    question: 'Títulos pregunta',
    number: 'Títulos números',
    generate: '✨ Generar 20 virales',
    count: 'Cant:',
    batchSize: '10  20  50  100',
    results: 'Resultados: {n}',
    copyAll: '📋 Copiar todo',
    copyXhs: '📋 XHS hashtag',
    exportTXT: '💾 Exportar TXT',
    regenOneCard: '🔄 Regenerar uno',
    templateTip: '5 ind × 4 clases = 136 plantillas locales',
    keywordBankTip: 'Bancos: Belleza 30 / Comida 28 / Hogar 25 / Digital 26 / Bebé 27',
    showSeed: 'Mostrar semillas',
    placeHolder: 'labial, ramen, sofá, auriculares, leche',
  },
  ar: {
    title: 'مولد العناوين الفيروسية والتورية',
    subtitle: '5 صناعات، 4 فئات، محلي بدون ذكاء اصطناعي سحابي',
    industry: 'الصناعة:',
    beauty: 'جمال',
    food: 'طعام',
    home: 'منزل',
    digital: 'رقمي',
    baby: 'رضيع',
    all: 'الكل',
    coreWord: 'الكلمة الأساسية:',
    outputMode: 'النوع:',
    pun: 'عناوين ألعاب كلمات',
    contrast: 'عناوين تباين',
    question: 'عناوين استفهام',
    number: 'عناوين أرقام',
    generate: '✨ توليد 20 فيرالي',
    count: 'العدد:',
    batchSize: '10  20  50  100',
    results: 'النتائج: {n}',
    copyAll: '📋 نسخ الكل',
    copyXhs: '📋 XHS مع هاشتاجات',
    exportTXT: '💾 تصدير TXT',
    regenOneCard: '🔄 إعادة توليد واحد',
    templateTip: '5 صناعات × 4 فئات = 136 قالب محلي',
    keywordBankTip: 'البنوك: جمال 30 / طعام 28 / منزل 25 / رقمي 26 / رضيع 27',
    showSeed: 'إظهار البذور',
    placeHolder: 'أحمر الشفاه، رامين، أريكة، سماعات، حليب',
  },
};

const EMOJIS = ['💡', '✨', '🔥', '⭐', '🎯', '⚡', '💫', '🌟', '💎', '🥇'];

const INDUSTRY_HASHTAGS: Record<IndustryKey, string[]> = {
  beauty: ['#美妆好物', '#护肤分享', '#口红试色', '#化妆教程', '#素颜神器', '#美妆测评', '#日常妆容', '#变美日记', '#干货分享', '#好物推荐'],
  food: ['#美食分享', '#今天吃什么', '#家常菜', '#吃货日记', '#深夜放毒', '#厨房日记', '#快手菜', '#减脂餐', '#探店', '#美食推荐'],
  home: ['#家居好物', '#收纳整理', '#租房改造', '#居家好物', '#提升幸福感', '#生活技巧', '#家居装饰', '#懒人神器', '#小家大改造', '#生活好物'],
  digital: ['#数码好物', '#科技测评', '#开箱', '#数码配件', '#效率神器', '#程序员', '#打工人必备', '#电子产品', '#手机摄影', '#笔记本'],
  baby: ['#母婴好物', '#新手妈妈', '#育儿日记', '#宝宝用品', '#孕期囤货', '#带娃日常', '#母婴推荐', '#辅食日记', '#待产包', '#儿科医生'],
  all: ['#好物推荐', '#干货分享', '#生活必备', '#种草清单', '#省钱攻略', '#测评', '#真实分享', '#收藏夹', '#宝藏好物', '#生活小妙招'],
};

const TEMPLATES: Record<string, Record<ModeKey, string[]>> = {
  beauty: {
    pun: [
      '{w}力全开！',
      '涂了{w}的我，美到「{w}语」',
      '{w}到底有多{w}？一眼识破',
      '别再买贵的{w}了！这个「{w}替」真的绝',
      '这个{w}，谁用谁「{w}香」',
      '{w}中的「{w}花板」！我愿称最绝',
      '不买贵的只买对的：{w}天花板居然是它？',
      '{w}届yyds！这个「{w}王」我先冲了',
      '{w}测评｜{w}届的「卷王」居然是这个？',
      '「{w}然心动」姐妹们这个{w}真的绝了！',
      '「{w}颜悦色」夏日{w}推荐，持妆{n}小时不脱！',
      '姐妹们！这个{w}也太「{w}美」了吧',
    ],
    contrast: [
      '{w}届的「便宜货」和「贵妇」，差的不是钱是{w}力',
      '30块和300块的{w}，我涂了{diff}个月终于看出差别',
      '{w}新手 vs 老手：手法差一点，效果差「{diff}条街」',
      '月薪{n}k和{n}k，她们的{w}台差在哪？',
      '油皮vs干皮：{w}怎么选完全不一样！',
      '百元{w} vs 千元{w}，妆效差的不是一点！',
      '专柜{w} vs 开架{w}，差价{n}倍到底值不值？',
    ],
    question: [
      '{w}到底怎么选？{n}个冷知识告诉你答案',
      '为什么你涂{w}总翻车？其实是没注意这{n}点',
      '{w}贵的一定好？我踩了{n}次坑后终于弄明白',
      '姐妹们你们的{w}涂对了吗？{n}步教你逆袭',
      '为什么明星的{w}永远不斑驳？秘密竟是这{n}个细节',
      '{w}过期了还能用吗？{n}条标准一定要看！',
      '黄皮到底适合什么{w}？这{n}支闭眼入不踩雷',
    ],
    number: [
      '{n}个没人告诉你的{w}真相！第{n}个我后悔没早知道',
      '一生推！这{n}支{w}我回购了{n}次',
      '{n}元以内{w}天花板，闭眼入这{n}款就够了',
      '{n}招{w}大法！手残党也能{diff}分钟学会',
      '新手必入{n}款{w}清单｜第{n}支才{n}块！',
      '{n}款热门{w}大测评｜第{n}支居然完胜{n}元贵妇牌',
      '{n}个化妆技巧｜第{n}个让你{w}秒变高级',
      '{diff}分钟出门妆｜这{n}件{w}就够了！',
    ],
  },
  food: {
    pun: [
      '这碗{w}，「{w}力」十足！',
      '{w}届卷王，好吃到「{w}语凝噎」',
      '这个{w}居然「{w}肉朋友」都说好？！',
      '{w}做到这份上，「{w}间烟火」就是它了',
      '一口下去！{w}真的太「{w}了个去」',
      '「{w}事如意」新年必吃：这个{w}我连吃{n}天',
      '「{w}味无穷」这家店的{w}我可以吃{n}年！',
      '「{w}全十美」周末在家做{w}，朋友吃完都要配方',
    ],
    contrast: [
      '{n}块和{n}块的{w}，贵的不一定好吃？真相是…',
      '外卖{w} vs 家里做{w}，差的不止{n}块钱',
      '网红{w}和老馆子{w}，差的不是价格是这{n}点',
      '{n}块的{w}能不能吃出{n}块的排面？能！',
      '自己做的{w} vs 外面吃的{w}，{diff}个月瘦了{n}斤？',
      '速食{w} vs 现做{w}，差距比你想的大得多！',
    ],
    question: [
      '{w}到底怎么煮才好吃？{n}个小技巧全是干货',
      '为什么饭店的{w}比家里香？师傅偷偷说{n}个秘密',
      '你吃的{w}正宗吗？这{n}个细节90%的人错了',
      '{w}加这个东西居然好吃{n}倍？我后悔没早知道',
      '{n}块钱的{w}怎么吃出高级感？秘诀在这里',
      '{w}怎么做好吃不腻？{n}种做法换着来！',
    ],
    number: [
      '{n}道{w}神仙做法！第{n}道我连吃{n}天都不腻',
      '打工人快手{w}：{diff}分钟搞定{n}款，{n}元管饱{n}天',
      '{n}个城市的{w}大测评｜这{n}个城市赢麻了',
      '零失败{n}步搞定{w}！厨房小白也能一次成',
      '{n}个冷知识｜你吃的{w}其实不是真正的{w}？！',
      '{n}元搞定一周{w}｜上班族带饭攻略',
      '减脂期也能吃的{n}款{w}｜低卡高蛋白！',
    ],
  },
  home: {
    pun: [
      '这个{w}，「{w}居必备」绝了！',
      '{w}届的「{w}政神器」，懒人狂喜',
      '买了这个{w}，家里瞬间「{w}然有序」',
      '「{w}事顺心」居家好物：这个{w}我回购{n}次',
      '{w}中的「{w}洁标兵」！婆婆都夸我会买',
      '「{w}室生香」有了这个{w}，回家就是享受',
      '「{w}美价廉」出租屋改造就靠这{n}件{w}！',
    ],
    contrast: [
      '{n}块和{n}块的{w}，差别居然在这{n}个细节？',
      '出租屋{n}元改造{n}㎡的家，靠{n}件{w}就够了',
      '便宜的{w}真的不能用？我用了{n}个月说句实话',
      '日式收纳 vs 中式{w}，哪种更适合中国家庭？',
      '{n}㎡的家 vs {n}㎡的家，{w}件数差的不是一点',
      '宜家{w} vs 淘宝{w}，用了{n}个月说真话！',
    ],
    question: [
      '{w}怎么选才不踩坑？{n}个知识点小白必看',
      '家里的{w}多久换一次？90%的人都错了',
      '小户型{n}㎡，{w}到底怎么放才显大？',
      '{w}发霉有味道？这{n}招{n}分钟解决',
      '为什么你家的{w}总乱？差的就是这{n}个收纳',
      '新房{w}怎么买？{n}条建议帮你省{n}万！',
    ],
    number: [
      '{n}件{w}封神好物｜第{n}件才{n}块钱闭眼入',
      '租房党必入{n}件{w}｜{n}元搞定{n}个痛点',
      '这{n}个{w}小技巧｜学会家里瞬间大一倍',
      '{diff}分钟打扫完全屋：这{n}件{w}懒人神器太绝了',
      '{n}款{w}收纳｜第{n}款帮我省出{n}㎡空间！',
      '{n}元搞定全屋{w}｜小户型福音！',
      '提升幸福感的{n}件{w}｜每天回家都开心！',
    ],
  },
  digital: {
    pun: [
      '这个{w}，「{w}能全开」我真的吹爆！',
      '{w}到底有多{w}？上手{n}天直接跪了',
      '{w}届卷王诞生，性能直接「{w}里}{气」',
      '「{w}忧无虑」的数码好物，这个{w}我先冲',
      '{w}力天花板！这台{w}直接把竞品按地上{w}',
      '「{w}码当先」2024最值得买的{n}款{w}！',
      '「{w}可匹敌」这款{w}用了{n}天，我把旧的扔了',
    ],
    contrast: [
      '{n}k和{n}k的{w}，差的不是价格是这{n}点',
      '{w}顶配 vs 丐版：多花{n}k到底值不值？',
      '安卓{w} vs 苹果{w}，{n}个月后我后悔了吗？',
      '全新{w} vs 二手{w}，{n}个月后说句大实话',
      '百元{w} vs 千元{w}：差的是{n}倍还是{n}倍？',
      '官方{w} vs 第三方{w}，差价{n}倍区别在哪？',
    ],
    question: [
      '{w}怎么选不翻车？{n}条干货小白直接抄作业',
      '{n}k预算到底买什么{w}？看完这篇别再问了',
      '你的{w}发热卡顿？{n}个设置直接满血',
      '{w}电池衰减？这{n}个习惯{n}分钟救回来',
      '为什么程序员的{w}永远不卡？秘密是这{n}个',
      '{w}坏了要不要修？{n}条建议帮你省钱！',
    ],
    number: [
      '{n}个没人说的{w}隐藏功能｜第{n}个我{n}年才知道',
      '{n}元内闭眼入的{n}款{w}｜第{n}款我回购{n}次',
      '打工人必备{n}款{w}｜效率提升{n}%不是梦',
      '{diff}分钟学会{n}个{w}骚操作｜同事都看傻了',
      '{n}年果粉转安卓{w}，{n}个月后我后悔了吗？',
      '学生党必入{n}款{w}｜{n}元搞定生产力！',
      '{n}款{w}深度测评｜性价比之王居然是它？',
    ],
  },
  baby: {
    pun: [
      '这个{w}，宝宝「{w}忧无虑」睡整觉！',
      '{w}届的「{w}妈神器」，我直接囤{n}箱',
      '选对{w}，带娃直接「{w}事大吉」',
      '「{w}忧童年」必备！这个{w}医生都推荐',
      '{w}力满点！宝宝用了这个{w}再也不哭闹',
      '「{w}宝安康」这{n}件{w}新手妈妈必囤！',
      '「{w}婴如是」有了这个{w}，带娃轻松一半！',
    ],
    contrast: [
      '{n}块和{n}块的{w}，给宝宝用差别真的大？',
      '进口{w} vs 国产{w}，我用了{n}个月真实感受',
      '新手妈妈 vs 二胎妈妈的{w}台，差的不是一点',
      '贵的{w}真的更好？儿科医生说{n}个月真相了',
      '母乳和奶粉{w}搭配，差的就是这{n}个细节',
      '实体店{w} vs 网购{w}，差价{n}倍选哪个？',
    ],
    question: [
      '{w}怎么选才安全？{n}条标准儿科医生都点赞',
      '宝宝的{w}多久换一次？90%家长都做错了',
      '{n}个月宝宝到底用什么样的{w}？看完不纠结',
      '{w}过敏红屁屁？这{n}招{n}分钟立刻缓解',
      '为什么明星家宝宝的{w}这么好用？秘诀是{n}点',
      '待产包{w}怎么准备？{n}条过来人经验！',
    ],
    number: [
      '{n}款{w}深度测评｜第{n}款{n}块钱完胜大牌',
      '新手妈妈必囤{n}件{w}｜第{n}件后悔没早买',
      '{n}个带娃神器{w}｜解放双手每天多睡{n}小时',
      '{n}元搞定{n}个月宝宝{w}清单｜别再瞎买了',
      '{n}个宝宝{w}冷知识｜第{n}个医生都不会主动说',
      '0-{n}个月宝宝{w}必备清单｜新手妈妈收藏！',
      '{n}款{w}红黑榜｜这些千万别给宝宝用！',
    ],
  },
};

const HOMOPHONE_PAIRS: [string, string[]][] = [
  ['口', ['蔻', '叩']],
  ['红', ['鸿', '宏', '虹', '轰']],
  ['粉', ['份', '奋', '忿']],
  ['美', ['每', '眉', '镁']],
  ['白', ['佰', '柏', '拜']],
  ['面', ['棉', '眠', '绵']],
  ['香', ['乡', '相', '厢']],
  ['鲜', ['先', '仙', '纤']],
  ['家', ['佳', '嘉', '枷']],
  ['居', ['局', '拘', '橘']],
  ['数', ['树', '束', '术']],
  ['码', ['马', '玛', '蚂']],
  ['机', ['鸡', '积', '基']],
  ['宝', ['保', '堡', '包', '抱', '报']],
  ['妈', ['麻', '马', '码']],
  ['婴', ['英', '应', '樱']],
  ['食', ['时', '实', '识']],
  ['物', ['悟', '误', '务']],
  ['好', ['号', '浩', '耗']],
  ['妆', ['装', '庄']],
  ['色', ['涩', '瑟']],
  ['肤', ['夫', '敷']],
  ['护', ['户', '互']],
  ['发', ['法', '罚']],
  ['水', ['税', '睡']],
  ['乳', ['辱', '入']],
  ['霜', ['双', '爽']],
  ['眼', ['演', '烟']],
  ['影', ['颖', '迎']],
  ['盘', ['磐', '蟠']],
  ['刷', ['耍']],
  ['洗', ['喜', '锡']],
  ['脸', ['敛']],
  ['衣', ['医', '依']],
  ['食', ['时', '实', '识']],
  ['味', ['位', '未']],
  ['饭', ['范', '犯']],
  ['菜', ['财', '材']],
  ['肉', ['柔', '揉']],
  ['鱼', ['于', '余']],
  ['鸡', ['机', '积']],
  ['蛋', ['但', '淡']],
  ['面', ['棉', '眠']],
  ['汤', ['堂', '糖']],
  ['酒', ['九', '久']],
  ['茶', ['查', '察']],
  ['糖', ['堂', '唐']],
  ['盐', ['言', '严']],
  ['床', ['创', '窗']],
  ['桌', ['捉', '卓']],
  ['椅', ['以', '已']],
  ['柜', ['贵', '桂']],
  ['灯', ['登', '等']],
  ['枕', ['真', '针']],
  ['被', ['倍', '备']],
  ['毯', ['坦', '叹']],
  ['帘', ['连', '怜']],
  ['镜', ['静', '净']],
  ['箱', ['香', '乡']],
  ['包', ['宝', '保']],
  ['盒', ['合', '河']],
  ['瓶', ['平', '评']],
  ['锅', ['国', '过']],
  ['碗', ['完', '晚']],
  ['刀', ['道', '到']],
  ['勺', ['少', '绍']],
  ['电', ['店', '殿']],
  ['脑', ['恼', '闹']],
  ['手', ['守', '首']],
  ['屏', ['平', '凭']],
  ['键', ['建', '健']],
  ['盘', ['磐', '判']],
  ['鼠', ['数', '树']],
  ['线', ['现', '限']],
  ['充', ['冲', '虫']],
  ['器', ['气', '弃']],
  ['奶', ['耐', '乃']],
  ['粉', ['份', '奋']],
  ['纸', ['指', '只']],
  ['裤', ['库', '酷']],
  ['尿', ['鸟', '捏']],
  ['湿', ['诗', '师']],
  ['巾', ['今', '金']],
  ['皂', ['造', '灶']],
  ['刷', ['耍', '摔']],
  ['梳', ['输', '叔']],
  ['浴', ['欲', '玉']],
  ['垫', ['电', '店']],
  ['车', ['彻', '撤']],
  ['座', ['坐', '做']],
  ['娃', ['挖', '瓦']],
  ['玩', ['完', '晚']],
  ['具', ['句', '巨']],
  ['书', ['舒', '输']],
];
const homophone: Record<string, string[]> = HOMOPHONE_PAIRS.reduce((acc, [k, v]) => {
  if (!acc[k]) acc[k] = [];
  for (const s of v) if (!acc[k].includes(s)) acc[k].push(s);
  return acc;
}, {} as Record<string, string[]>);

const INDUSTRY_ORDER: IndustryKey[] = ['beauty', 'food', 'home', 'digital', 'baby', 'all'];
const MODE_ORDER: ModeKey[] = ['pun', 'contrast', 'question', 'number'];
const BATCH_SIZES: BatchSize[] = [10, 20, 50, 100];

const INDUSTRY_GRADIENTS: Record<IndustryKey, string> = {
  beauty: 'from-pink-500 to-rose-500',
  food: 'from-orange-500 to-red-500',
  home: 'from-emerald-500 to-teal-500',
  digital: 'from-blue-500 to-indigo-500',
  baby: 'from-violet-500 to-purple-500',
  all: 'from-gray-600 to-gray-700',
};

interface ResultItem {
  id: string;
  title: string;
  template: string;
  industry: IndustryKey;
  mode: ModeKey;
  emoji: string;
  punW: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomN(): string {
  const r = Math.random();
  if (r < 0.35) return String(randomInt(1, 9));
  if (r < 0.75) return String(randomInt(10, 50));
  return String(randomInt(100, 999));
}

function generatePunW(word: string): string {
  if (!word) return word;
  let changed = false;
  const chars = word.split('').map((ch) => {
    if (homophone[ch] && Math.random() < 0.45) {
      changed = true;
      return randomPick(homophone[ch]);
    }
    return ch;
  });
  if (!changed && word.length > 0) {
    const eligibleIdx: number[] = [];
    word.split('').forEach((ch, idx) => {
      if (homophone[ch]) eligibleIdx.push(idx);
    });
    if (eligibleIdx.length > 0) {
      const idx = randomPick(eligibleIdx);
      chars[idx] = randomPick(homophone[word[idx]]);
    }
  }
  return chars.join('');
}

export default function KeywordSpinoffGenerator({ locale = 'zh' }: KeywordSpinoffGeneratorProps) {
  const resolvedLocale = VALID_LOCALES.includes(locale) ? locale : 'zh';
  const dict = i18n[resolvedLocale] || i18n.zh;
  const t = (key: string, vars?: Record<string, string | number>) => {
    let str = dict[key] ?? i18n.zh[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  const [industry, setIndustry] = useState<IndustryKey>('all');
  const [coreWord, setCoreWord] = useState('');
  const [activeModes, setActiveModes] = useState<Set<ModeKey>>(new Set(['pun', 'contrast', 'question', 'number']));
  const [batchSize, setBatchSize] = useState<BatchSize>(20);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedXhs, setCopiedXhs] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showSeed, setShowSeed] = useState(false);

  const effectiveIndustryKeys = useMemo<IndustryKey[]>(() => {
    if (industry === 'all') return ['beauty', 'food', 'home', 'digital', 'baby'];
    return [industry];
  }, [industry]);

  const toggleMode = (mode: ModeKey) => {
    setActiveModes((prev) => {
      const next = new Set(prev);
      if (next.has(mode)) {
        if (next.size > 1) next.delete(mode);
      } else {
        next.add(mode);
      }
      return next;
    });
  };

  const buildTitleFromTemplate = (
    template: string,
    word: string,
    usePun: boolean,
    mode: ModeKey,
  ): { title: string; punW: string } => {
    let punW = word;
    if (usePun && (mode === 'pun' || Math.random() < 0.25)) {
      punW = generatePunW(word);
    }

    let title = template;
    title = title.replace(/\{w\}/g, word);
    title = title.replace(/\{punW\}/g, punW);
    title = title.replace(/\{n\}/g, () => getRandomN());
    title = title.replace(/\{diff\}/g, () => String(randomInt(1, 9)));
    return { title, punW };
  };

  const generateOne = (usedSet: Set<string>, forcedIndustry?: IndustryKey, forcedMode?: ModeKey): ResultItem | null => {
    const word = coreWord.trim() || '好物';
    const industries = forcedIndustry ? [forcedIndustry] : effectiveIndustryKeys;
    const modes = forcedMode ? [forcedMode] : Array.from(activeModes);

    const shuffledIndustries = shuffle(industries);

    for (const ind of shuffledIndustries) {
      const shuffledModes = shuffle(modes);
      for (const mode of shuffledModes) {
        const templates = TEMPLATES[ind]?.[mode];
        if (!templates || templates.length === 0) continue;
        const shuffledTpls = shuffle(templates);
        for (const tpl of shuffledTpls) {
          const usePun = mode === 'pun';
          let attempt = 0;
          while (attempt < 3) {
            const { title, punW } = buildTitleFromTemplate(tpl, word, usePun, mode);
            if (!usedSet.has(title)) {
              usedSet.add(title);
              const emoji = randomPick(EMOJIS);
              const putAtStart = Math.random() < 0.5;
              const finalTitle = putAtStart ? `${emoji} ${title}` : `${title} ${emoji}`;
              return {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                title: finalTitle,
                template: tpl,
                industry: ind,
                mode,
                emoji,
                punW,
              };
            }
            attempt++;
          }
        }
      }
    }
    return null;
  };

  const handleGenerate = useCallback(() => {
    const used = new Set<string>();
    const output: ResultItem[] = [];
    let guard = 0;
    while (output.length < batchSize && guard < batchSize * 30) {
      const item = generateOne(used);
      if (item) output.push(item);
      guard++;
    }
    setResults(output);
  }, [batchSize, coreWord, activeModes, effectiveIndustryKeys]);

  const handleRegenOne = (idx: number) => {
    const used = new Set<string>(results.map((r) => r.title));
    const current = results[idx];
    const newItem = generateOne(used, current.industry, current.mode);
    if (newItem) {
      const next = results.slice();
      next[idx] = newItem;
      setResults(next);
    }
  };

  const copyText = async (text: string, onDone: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    onDone();
  };

  const handleCopyAll = () => {
    const text = results.map((r) => r.title).join('\n');
    copyText(text, () => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const handleCopyXhs = () => {
    const baseHashtags = INDUSTRY_HASHTAGS[industry] || INDUSTRY_HASHTAGS.all;
    const wordTags = coreWord.trim()
      ? [coreWord.trim()].filter(Boolean).map((w) => `#${w}`)
      : [];
    const extraTags = shuffle(baseHashtags).slice(0, 5);
    const tagLine = [...wordTags, ...extraTags].join(' ');
    const text = results.map((r, i) => `${i + 1}. ${r.title}`).join('\n') + '\n\n' + tagLine;
    copyText(text, () => {
      setCopiedXhs(true);
      setTimeout(() => setCopiedXhs(false), 2000);
    });
  };

  const handleCopyOne = (idx: number) => {
    copyText(results[idx].title, () => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const handleExport = () => {
    const text = results.map((r, i) => `${i + 1}. ${r.title}`).join('\r\n');
    const blob = new Blob(['\ufeff' + text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeWord = coreWord.trim() || 'keyword';
    a.download = `${safeWord}_爆款标题_${results.length}条.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        <main className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-pink-500 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('title')}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('industry')}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {INDUSTRY_ORDER.map((ind) => {
                    const active = industry === ind;
                    return (
                      <button
                        key={ind}
                        onClick={() => setIndustry(ind)}
                        className={`relative px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          active
                            ? `text-white bg-gradient-to-br ${INDUSTRY_GRADIENTS[ind]} shadow-md scale-[1.02]`
                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {t(ind)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('coreWord')}
                </label>
                <input
                  type="text"
                  value={coreWord}
                  onChange={(e) => setCoreWord(e.target.value)}
                  placeholder={t('placeHolder')}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('outputMode')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MODE_ORDER.map((mode) => {
                    const active = activeModes.has(mode);
                    const gradients: Record<ModeKey, string> = {
                      pun: 'from-pink-500 to-rose-500',
                      contrast: 'from-amber-500 to-orange-500',
                      question: 'from-sky-500 to-cyan-500',
                      number: 'from-emerald-500 to-teal-500',
                    };
                    return (
                      <button
                        key={mode}
                        onClick={() => toggleMode(mode)}
                        className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          active
                            ? `text-white bg-gradient-to-br ${gradients[mode]} shadow-md`
                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {t(mode)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('count')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BATCH_SIZES.map((size) => {
                    const active = batchSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setBatchSize(size)}
                        className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          active
                            ? 'text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md'
                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-4 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 hover:from-pink-600 hover:via-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 active:scale-[0.99] transition-all text-base sm:text-lg"
              >
                <Sparkles className="h-5 w-5" />
                {t('generate').replace('20', String(batchSize))}
              </button>

              <div className="space-y-1.5 p-3 sm:p-4 rounded-lg bg-gradient-to-br from-amber-50 to-pink-50 dark:from-amber-950/20 dark:to-pink-950/20 border border-amber-100 dark:border-amber-900/30">
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                  💡 {t('templateTip')}
                </p>
                <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400/80">
                  📚 {t('keywordBankTip')}
                </p>
              </div>
            </div>
          </div>

          {results.length > 0 && (
            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('results', { n: results.length })}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {results.map((item, idx) => (
                  <div
                    key={item.id}
                    className="group relative p-3 sm:p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-pink-200 dark:hover:border-pink-800/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">
                        {idx + 1}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyOne(idx)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                          title={copiedIdx === idx ? 'OK' : 'Copy'}
                        >
                          {copiedIdx === idx ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRegenOne(idx)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title={t('regenOneCard')}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm sm:text-[0.95rem] leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                      {item.title}
                    </p>
                    {showSeed && (
                      <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-[10px] text-gray-400 font-mono space-y-0.5">
                        <div>ind: {item.industry} | mode: {item.mode}</div>
                        <div className="truncate">tpl: {item.template}</div>
                        <div>punW: {item.punW} | emoji: {item.emoji}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={handleCopyAll}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors text-sm sm:text-base"
                >
                  {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedAll ? '✓' : t('copyAll')}
                </button>
                <button
                  onClick={handleCopyXhs}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-white font-medium bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-md transition-all text-sm sm:text-base"
                >
                  {copiedXhs ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedXhs ? '✓' : t('copyXhs')}
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-white font-medium bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md transition-all text-sm sm:text-base"
                >
                  <Download className="h-4 w-4" />
                  {t('exportTXT')}
                </button>
              </div>
            </div>
          )}
        </main>

        <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
              {t('templateTip')}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {[
                ['🏭', '5 大行业词库 精选爆款模板'],
                ['🎨', '4 类标题公式 覆盖主流风格'],
                ['🧠', '谐音梗算法 自动同音替换'],
                ['🎲', '随机数字 emoji 保证不重复'],
                ['⚡', '纯本地运算 不上传任何数据'],
                ['📱', '一键复制小红书带标签版'],
              ].map(([icon, text], i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">{icon}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-4 sm:p-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSeed}
                onChange={(e) => setShowSeed(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('showSeed')}
              </span>
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}
