'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Copy,
  Check,
  FileText,
  Settings,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Diff,
  Download,
} from 'lucide-react';

interface MarkdownPlatformAdapterProps {
  locale?: string;
}

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '全平台Markdown一键适配转换器',
    subtitle: '小红书/公众号/知乎/抖音图文/B站专栏，5家一键转换',
    input: '粘贴 Markdown 原文（支持#标题/列表/代码块/表格/图片/引用/链接）',
    platforms: '目标平台：',
    xhs: '小红书 #标签排版',
    gzh: '微信公众号（首尾空行）',
    zhihu: '知乎（标准Markdown）',
    dy: '抖音图文（大换行）',
    bili: 'B站专栏（引用块/编号）',
    previewX: '预览 {p}',
    copy: '复制 {p} 内容',
    copyAll5: '一键复制5平台导出包',
    showDiff: '显示 vs 原文 改动高亮',
    settings: '排版设置',
    xhsMax: '小红书 #标签个数（最多 N个 自动追加）',
    xhsAutoAppend: '自动在文末追加匹配主题 #标签',
    gzhSpaceLevel: '公众号段前段后空行 (0/1/2)',
    dyNewLineLevel: '抖音图文行间距(1=正常,2=双换行,3=三换行)',
    biliQuotStyle: 'B站引用块符号：「」/ > / 无',
    zhihuTableCompat: '知乎表格降级成文本列表',
    imgFix: '图片链接统一：加https://修正、/格式',
    codeDowngrade: '代码块/表格 降级选项：keep纯文本 / remove 删除 / note转化为文字说明',
    legendAdded: '新增内容（绿）',
    legendRemoved: '移除（灰删除线）',
    legendModified: '格式改写（黄）',
    result: '{p} 导出结果',
    sample: '加载示例Markdown',
    placeHolder:
      '# 标题一级\n\n## 标题二级\n\n普通段落，**加粗**和*斜体*，[链接](http://example.com)。\n\n> 引用块内容\n\n1. 有序列表项 1\n2. 有序列表项 2\n- 无序列表\n- 无序2\n\n|col1|col2|\n|----|----|\n|A|B|\n\n```js\nconsole.log('code');\n```\n\n![image](img.png)',
  },
  en: {
    title: 'All-Platform Markdown Adapter',
    subtitle: 'XHS/WeChat/Zhihu/Douyin/Bilibili 5 in 1',
    input: 'Paste Markdown',
    platforms: 'Target:',
    xhs: 'XHS #hashtag',
    gzh: 'WeChat (head/tail blank)',
    zhihu: 'Zhihu standard',
    dy: 'Douyin big newlines',
    bili: 'Bilibili column',
    previewX: 'Preview {p}',
    copy: 'Copy {p}',
    copyAll5: 'Copy 5-platform pack',
    showDiff: 'Diff vs original',
    settings: 'Layout settings',
    xhsMax: 'XHS max # tags appended',
    xhsAutoAppend: 'Auto append theme #tags at end',
    gzhSpaceLevel: 'WeChat pre/post blank lines',
    dyNewLineLevel: 'Douyin line spacing',
    biliQuotStyle: 'Bilibili quote marker',
    zhihuTableCompat: 'Zhihu table → list',
    imgFix: 'Image link fix (add https)',
    codeDowngrade: 'Code/table downgrade: keep/remove/note',
    legendAdded: 'Added (green)',
    legendRemoved: 'Removed (gray strike)',
    legendModified: 'Format modified (yellow)',
    result: '{p} Result',
    sample: 'Load sample MD',
    placeHolder: '# H1\n\nNormal **bold**, *italic*, [link](http://).',
  },
  hi: {
    title: 'मार्कडाउन अडैप्टर',
    subtitle: 'XHS/WeChat/Zhihu/Douyin/Bili 5 प्लेटफ़ॉर्म',
    input: 'मार्कडाउन डालें',
    platforms: 'लक्ष्य:',
    xhs: 'XHS #हैशटैग',
    gzh: 'WeChat',
    zhihu: 'Zhihu स्टैंडर्ड',
    dy: 'Douyin',
    bili: 'Bilibili',
    previewX: '{p} प्रीव्यू',
    copy: '{p} कॉपी',
    copyAll5: '5-पैक कॉपी',
    showDiff: 'अंतर दिखाएं',
    settings: 'लेआउट',
    xhsMax: 'XHS अधिकतम #टैग जोड़े',
    xhsAutoAppend: 'अंत में #टैग स्वचालित',
    gzhSpaceLevel: 'WeChat पूर्व/पश्च खाली पंक्ति',
    dyNewLineLevel: 'Douyin लाइन स्पेस',
    biliQuotStyle: 'Bilibili उद्धरण',
    zhihuTableCompat: 'Zhihu तालिका → सूची',
    imgFix: 'छवि लिंक सुधार',
    codeDowngrade: 'कोड/तालिका डाउनग्रेड',
    legendAdded: 'जोड़ा गया (हरा)',
    legendRemoved: 'हटाया गया (ग्रे स्ट्राइक)',
    legendModified: 'संशोधित (पीला)',
    result: '{p} परिणाम',
    sample: 'सैंपल MD डालें',
    placeHolder: '# H1\n\nसामान्य **बोल्ड**, *इटैलिक*।',
  },
  fr: {
    title: 'Adaptateur Markdown Multi-Pla.',
    subtitle: 'XHS/WeChat/Zhihu/Douyin/Bili 5 en 1',
    input: 'Collez Markdown',
    platforms: 'Cible:',
    xhs: 'XHS #hashtag',
    gzh: 'WeChat (sauts)',
    zhihu: 'Zhihu standard',
    dy: 'Douyin sauts larges',
    bili: 'Bilibili',
    previewX: 'Aperçu {p}',
    copy: 'Copier {p}',
    copyAll5: 'Copier pack 5',
    showDiff: 'Diff vs original',
    settings: 'Mise en page',
    xhsMax: 'Nb max #hashtags ajoutés XHS',
    xhsAutoAppend: 'Ajout # fin auto',
    gzhSpaceLevel: 'Sauts WeChat avant/après',
    dyNewLineLevel: 'Interligne Douyin',
    biliQuotStyle: 'Marque citation Bili',
    zhihuTableCompat: 'Zhihu table → liste',
    imgFix: 'Correction lien images',
    codeDowngrade: 'Code/table downgrade',
    legendAdded: 'Ajouté (vert)',
    legendRemoved: 'Retiré (grisé barré)',
    legendModified: 'Modifié (jaune)',
    result: 'Résultat {p}',
    sample: 'Charger MD exemple',
    placeHolder: '# H1\n\nNormal **gras**, *italique*.',
  },
  es: {
    title: 'Adaptador Markdown Multiplataforma',
    subtitle: 'XHS/WeChat/Zhihu/Douyin/Bili 5 en 1',
    input: 'Pega Markdown',
    platforms: 'Objetivo:',
    xhs: 'XHS #hashtag',
    gzh: 'WeChat (saltos)',
    zhihu: 'Zhihu estándar',
    dy: 'Douyin saltos grandes',
    bili: 'Bilibili',
    previewX: 'Vista {p}',
    copy: 'Copiar {p}',
    copyAll5: 'Copiar pack 5',
    showDiff: 'Dif vs original',
    settings: 'Diseño',
    xhsMax: 'Máx #hashtags XHS',
    xhsAutoAppend: 'Añadir # al final auto',
    gzhSpaceLevel: 'Saltos WeChat antes/desp.',
    dyNewLineLevel: 'Interlineado Douyin',
    biliQuotStyle: 'Marca cita Bili',
    zhihuTableCompat: 'Zhihu tabla → lista',
    imgFix: 'Corregir enlaces img',
    codeDowngrade: 'Código/tabla downgrade',
    legendAdded: 'Añadido (verde)',
    legendRemoved: 'Quitado (gris tachado)',
    legendModified: 'Modificado (amarillo)',
    result: 'Resultado {p}',
    sample: 'Cargar MD ejemplo',
    placeHolder: '# H1\n\nNormal **negrita**, *cursiva*.',
  },
  ar: {
    title: 'محول ماركداون لجميع المنصات',
    subtitle: '5 منصات: XHS/WeChat/Zhihu/Douyin/Bili',
    input: 'الصق ماركداون',
    platforms: 'الهدف:',
    xhs: 'XHS #هاشتاج',
    gzh: 'WeChat (فواصل)',
    zhihu: 'Zhihu قياسي',
    dy: 'Douyin فواصل كبيرة',
    bili: 'Bilibili عمود',
    previewX: 'معاينة {p}',
    copy: 'نسخ {p}',
    copyAll5: 'نسخ الحزمة الكاملة',
    showDiff: 'مقارنة بالأصلي',
    settings: 'إعدادات التخطيط',
    xhsMax: 'XHS عدد #الهاشتاجات المضافة',
    xhsAutoAppend: 'إضافة #تلقائي في النهاية',
    gzhSpaceLevel: 'فواصل WeChat قبل/بعد',
    dyNewLineLevel: 'تباعد الأسطر Douyin',
    biliQuotStyle: 'علامة الاقتباس Bili',
    zhihuTableCompat: 'جدول Zhihu → قائمة',
    imgFix: 'تصحيح روابط الصور',
    codeDowngrade: 'تخفيض الكود/الجدول',
    legendAdded: 'مُضاف (أخضر)',
    legendRemoved: 'مُزال (رمادي مشطوب)',
    legendModified: 'مُعدل (أصفر)',
    result: 'نتيجة {p}',
    sample: 'تحميل مثال MD',
    placeHolder: '# H1\n\nعادي **عريض**، *مائل*.',
  },
};

const XHS_THEME_KEYWORDS: Record<string, string[]> = {
  美妆: ['护肤', '化妆', '口红', '粉底', '眼影', '腮红', '精华', '面膜', '防晒', '美容', 'beauty', 'makeup', 'skincare'],
  穿搭: ['穿搭', '服装', '衣服', '时尚', '搭配', '外套', '裙子', '裤子', '鞋子', '包包', 'fashion', 'outfit', 'style'],
  美食: ['美食', '食谱', '烹饪', '做饭', '餐厅', '甜品', '蛋糕', '咖啡', '奶茶', '火锅', 'food', 'recipe', 'cooking', 'cafe'],
  旅行: ['旅行', '旅游', '出行', '酒店', '机票', '攻略', '风景', '打卡', '景点', '度假', 'travel', 'trip', 'vacation'],
  数码: ['数码', '手机', '电脑', '相机', '耳机', '键盘', '鼠标', '显示器', '平板', '智能', 'tech', 'gadget', 'phone', 'laptop'],
  家居: ['家居', '装修', '家具', '装饰', '收纳', '卧室', '客厅', '厨房', '清洁', 'home', 'decor', 'interior', 'furniture'],
  母婴: ['母婴', '宝宝', '婴儿', '育儿', '孕妇', '奶粉', '尿布', '亲子', 'baby', 'pregnancy', 'mom', 'parenting'],
  健身: ['健身', '运动', '减肥', '瑜伽', '跑步', '增肌', '塑形', '锻炼', 'gym', 'fitness', 'workout', 'yoga', 'diet'],
  学习: ['学习', '读书', '考试', '考研', '英语', '笔记', '知识', '教育', 'study', 'learning', 'book', 'exam', 'english'],
  职场: ['职场', '工作', '面试', '简历', '办公', '效率', '创业', '项目', 'career', 'work', 'job', 'interview', 'resume'],
  摄影: ['摄影', '拍照', '相机', '镜头', '构图', '滤镜', '修图', '拍照技巧', 'photo', 'photography', 'camera', 'edit'],
  宠物: ['宠物', '猫', '狗', '猫咪', '狗狗', '铲屎官', '猫粮', '狗粮', 'pet', 'cat', 'dog', 'kitten', 'puppy'],
  手工: ['手工', 'DIY', '手作', '编织', '绘画', '刺绣', '陶艺', '折纸', 'craft', 'diy', 'handmade', 'paint', 'knit'],
  游戏: ['游戏', '电竞', '手游', '端游', '主机', 'steam', 'switch', '王者荣耀', '原神', 'game', 'gaming', 'esports'],
  电影: ['电影', '电视剧', '综艺', '动漫', '影评', '追剧', '推荐', 'movie', 'film', 'drama', 'anime', 'show'],
  音乐: ['音乐', '歌曲', '歌单', '乐器', '吉他', '钢琴', '唱歌', '演唱会', 'music', 'song', 'playlist', 'guitar', 'piano'],
  理财: ['理财', '投资', '股票', '基金', '存钱', '省钱', '副业', '收入', 'finance', 'invest', 'money', 'stock', 'saving'],
  健康: ['健康', '养生', '中医', '体检', '疾病', '医疗', '心理', '睡眠', 'health', 'wellness', 'medical', 'sleep', 'mental'],
  汽车: ['汽车', '买车', '用车', '驾驶', '新能源', '特斯拉', '保养', '改装', 'car', 'auto', 'vehicle', 'tesla', 'driving'],
  教育: ['教育', '学校', '老师', '学生', '大学', '专业', '留学', '升学', 'education', 'school', 'college', 'university', 'study abroad'],
  科技: ['科技', 'AI', '人工智能', '芯片', '5G', 'VR', '机器人', '互联网', 'tech', 'ai', 'robot', 'internet', 'innovation'],
  户外: ['户外', '露营', '徒步', '登山', '骑行', '钓鱼', '野餐', '冲浪', 'outdoor', 'camping', 'hiking', 'cycling', 'fishing'],
  美甲: ['美甲', '指甲', 'nail', 'manicure'],
  发型: ['发型', '头发', '染发', '烫发', '理发', 'hair', 'hairstyle', 'color'],
  读书: ['读书', '书籍', '书单', '阅读', 'book', 'reading', 'books'],
  桌游: ['桌游', '剧本杀', '狼人杀', '卡牌', 'board game', 'card game', 'poker'],
  亲子: ['亲子', '育儿', '家庭', '宝宝', 'family', 'parenting', 'kids'],
  搞笑: ['搞笑', '段子', '梗', '恶搞', 'funny', 'joke', 'meme', 'comedy'],
  情感: ['情感', '恋爱', '爱情', '婚姻', '分手', '暗恋', 'relationship', 'love', 'dating', 'marriage'],
  星座: ['星座', '占星', '塔罗', '运势', 'zodiac', 'horoscope', 'astrology', 'tarot'],
  艺术: ['艺术', '展览', '博物馆', '画廊', 'art', 'exhibition', 'museum', 'gallery'],
  奢侈品: ['奢侈品', '名牌', '包包', '手表', '珠宝', 'luxury', 'brand', 'bag', 'watch', 'jewelry'],
  婚庆: ['婚庆', '婚礼', '结婚', '婚纱', '新娘', 'wedding', 'marriage', 'bride', 'dress'],
  节日: ['节日', '春节', '圣诞', '情人节', '中秋', 'holiday', 'festival', 'christmas', 'valentine'],
  好物: ['好物', '推荐', '种草', '测评', '开箱', 'product', 'review', 'recommend', 'unboxing'],
  生活: ['生活', '日常', 'vlog', '记录', '分享', 'life', 'daily', 'vlog', 'lifestyle'],
  茶: ['茶', '茶道', '茶具', '茶叶', 'tea', 'matcha', 'coffee'],
  香氛: ['香氛', '香水', '香薰', 'perfume', 'fragrance', 'scent', 'candle'],
  花: ['花', '花艺', '鲜花', '插花', 'flower', 'floral', 'bouquet', 'plant'],
  绿植: ['绿植', '盆栽', '多肉', '养花', 'plant', 'succulent', 'garden', 'green'],
  收纳: ['收纳', '整理', '储物', '清洁', 'organize', 'storage', 'clean', 'tidy'],
  文具: ['文具', '手账', '笔记本', '笔', '文具控', 'stationery', 'notebook', 'journal', 'pen'],
  玩具: ['玩具', '盲盒', '手办', '积木', 'toy', 'figure', 'lego', 'blind box'],
  酒: ['酒', '红酒', '白酒', '啤酒', '鸡尾酒', 'wine', 'beer', 'cocktail', 'alcohol'],
  护肤: ['护肤', '精华', '面膜', '面霜', '洁面', 'skincare', 'serum', 'mask', 'cream'],
  彩妆: ['彩妆', '口红', '眼影', '粉底', '腮红', 'makeup', 'lipstick', 'eyeshadow', 'foundation'],
  个护: ['个护', '身体乳', '沐浴露', '洗发水', '香水', 'personal care', 'shampoo', 'body wash', 'lotion'],
  家电: ['家电', '电器', '冰箱', '洗衣机', '空调', 'appliance', 'electronic', 'fridge', 'washer'],
  厨具: ['厨具', '锅具', '刀具', '烘焙', 'kitchen', 'cookware', 'knife', 'baking'],
  运动: ['运动', '跑步', '健身', '球类', '游泳', 'sport', 'running', 'swim', 'ball'],
  露营: ['露营', '帐篷', '天幕', '户外椅', 'camping', 'tent', 'outdoor', 'hiking'],
};

type CodeDowngradeOption = 'keep' | 'remove' | 'note';
type BiliQuotStyle = 'quote' | 'bracket' | 'none';
type PlatformKey = 'xhs' | 'gzh' | 'zhihu' | 'dy' | 'bili';

function getT(loc: string) {
  const dict = i18n[loc] || i18n.zh;
  return (key: string, vars?: Record<string, string | number>) => {
    let str = dict[key] ?? i18n.zh[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };
}

function fixImageLinks(md: string): string {
  return md.replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, (_m, alt, url) => {
    let fixed = String(url).trim();
    fixed = fixed.replace(/\/+/g, '/');
    fixed = fixed.replace(/\/+$/, '');
    if (!fixed.startsWith('http://') && !fixed.startsWith('https://')) {
      fixed = 'https://' + fixed;
    }
    return `![${alt}](${fixed})`;
  });
}

function downgradeCodeBlocks(md: string, option: CodeDowngradeOption): string {
  if (option === 'keep') return md;
  return md.replace(/```([\s\S]*?)```/g, (_m, content) => {
    if (option === 'remove') return '';
    const trimmed = String(content).trim();
    const firstLine = trimmed.split('\n')[0] || '';
    const commentMatch = firstLine.match(/^\s*(?:\/\/|#|--|\/\*|<!--)\s*(.+?)(?:\*\/|-->)?\s*$/);
    let desc = commentMatch ? commentMatch[1] : firstLine.replace(/^[a-zA-Z0-9_+-]+\s*/, '');
    if (!desc) desc = trimmed.slice(0, 50);
    return `【代码说明：${desc}】`;
  });
}

function extractTables(md: string): { tables: string[]; cleaned: string } {
  const tables: string[] = [];
  let cleaned = md;
  const tableRegex = /((?:\|[^\n]+\|\n){2,})/g;
  cleaned = cleaned.replace(tableRegex, (match) => {
    tables.push(match);
    return `__TABLE_${tables.length - 1}__`;
  });
  return { tables, cleaned };
}

function parseTable(tableStr: string): string[][] {
  const lines = tableStr.trim().split('\n').filter((l) => l.includes('|'));
  if (lines.length < 2) return [];
  return lines
    .filter((_, idx) => idx !== 1 || !/^[\s|:-]+$/.test(lines[idx]))
    .map((line) =>
      line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim()),
    );
}

function findXhsTags(text: string, maxTags: number): string[] {
  const lowerText = text.toLowerCase();
  const hits: { tag: string; score: number }[] = [];
  for (const [tag, keywords] of Object.entries(XHS_THEME_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      const matches = lowerText.split(kw.toLowerCase()).length - 1;
      score += matches;
    }
    if (score > 0) hits.push({ tag, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, maxTags).map((h) => h.tag);
}

function convertXhs(md: string, opts: { imgFix: boolean; codeDowngrade: CodeDowngradeOption; xhsMax: number; xhsAutoAppend: boolean }): string {
  let result = opts.imgFix ? fixImageLinks(md) : md;
  result = downgradeCodeBlocks(result, opts.codeDowngrade);

  const { tables, cleaned } = extractTables(result);
  result = cleaned;

  result = result.replace(/^### (.+)$/gm, '💡 $1');
  result = result.replace(/^## (.+)$/gm, '📌 $1');
  result = result.replace(/^# (.+)$/gm, '🔥 $1');

  result = result.replace(/^> (.+)$/gm, '⭐ $1');

  result = result.replace(/\*\*(.+?)\*\*/g, '【$1】');
  result = result.replace(/\*(.+?)\*/g, '$1');

  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1（链接：$2）');

  result = result.replace(/^(\s*)[-*+] (.+)$/gm, '$1• $2');

  result = result.replace(/^(\s*)(\d+)\. (.+)$/gm, '$1$2. $3');

  tables.forEach((table, idx) => {
    const rows = parseTable(table);
    let tableText = rows.map((row) => '| ' + row.join(' / ') + ' |').join('\n');
    result = result.replace(`__TABLE_${idx}__`, tableText);
  });

  if (opts.xhsAutoAppend && opts.xhsMax > 0) {
    const tags = findXhsTags(result, opts.xhsMax);
    if (tags.length > 0) {
      const tagStr = tags.map((t) => '#' + t).join(' ');
      result = result.trimEnd() + '\n\n' + tagStr;
    }
  }

  return result;
}

function convertGzh(md: string, opts: { imgFix: boolean; codeDowngrade: CodeDowngradeOption; gzhSpaceLevel: number }): string {
  let result = opts.imgFix ? fixImageLinks(md) : md;
  result = downgradeCodeBlocks(result, opts.codeDowngrade);

  const { tables, cleaned } = extractTables(result);
  result = cleaned;

  result = result.replace(/^(#+) (.+)$/gm, (_m, hashes, text) => {
    const level = String(hashes).length;
    const prefix = '\n'.repeat(Math.max(0, opts.gzhSpaceLevel));
    const suffix = '\n';
    const bold = level <= 2 ? '**' : '';
    return prefix + bold + text + bold + suffix;
  });

  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  tables.forEach((table, idx) => {
    const rows = parseTable(table);
    let tableText = rows.map((row) => '— ' + row.join(' — ') + ' —').join('\n');
    result = result.replace(`__TABLE_${idx}__`, tableText);
  });

  const n = opts.gzhSpaceLevel;
  result = result.replace(/\n{2,}/g, () => '\n'.repeat(n + 2));

  return result.trim();
}

function convertZhihu(md: string, opts: { imgFix: boolean; codeDowngrade: CodeDowngradeOption; zhihuTableCompat: boolean }): string {
  let result = opts.imgFix ? fixImageLinks(md) : md;
  result = downgradeCodeBlocks(result, opts.codeDowngrade);

  if (opts.zhihuTableCompat) {
    const { tables, cleaned } = extractTables(result);
    result = cleaned;
    tables.forEach((table, idx) => {
      const rows = parseTable(table);
      if (rows.length < 2) {
        result = result.replace(`__TABLE_${idx}__`, '');
        return;
      }
      const headers = rows[0];
      const dataRows = rows.slice(1);
      const lines: string[] = [];
      dataRows.forEach((row, rIdx) => {
        lines.push(`第${rIdx + 1}项：`);
        headers.forEach((h, cIdx) => {
          lines.push(`  ${h}：${row[cIdx] || ''}`);
        });
      });
      result = result.replace(`__TABLE_${idx}__`, lines.join('\n'));
    });
  }

  return result;
}

function convertDy(md: string, opts: { imgFix: boolean; codeDowngrade: CodeDowngradeOption; dyNewLineLevel: number }): string {
  let result = opts.imgFix ? fixImageLinks(md) : md;
  result = downgradeCodeBlocks(result, opts.codeDowngrade);

  const { tables, cleaned } = extractTables(result);
  result = cleaned;

  result = result.replace(/^(#+) (.+)$/gm, (_m, _h, text) => '▶ ' + text);

  result = result.replace(/\*\*(.+?)\*\*/g, ' $1 ');
  result = result.replace(/\*(.+?)\*/g, '$1');

  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '【图片：$1 $2】');

  tables.forEach((table, idx) => {
    const rows = parseTable(table);
    let tableText = rows
      .map((row, rIdx) => (rIdx === 0 ? '【表格】' : '') + row.join(' '))
      .join('\n');
    result = result.replace(`__TABLE_${idx}__`, tableText);
  });

  const level = Math.max(1, Math.min(3, opts.dyNewLineLevel));
  const lines = result.split('\n');
  result = lines
    .map((line, i) => {
      if (i === lines.length - 1) return line;
      return line + '\n'.repeat(level);
    })
    .join('');

  return result.trim();
}

function convertBili(md: string, opts: { imgFix: boolean; codeDowngrade: CodeDowngradeOption; biliQuotStyle: BiliQuotStyle }): string {
  let result = opts.imgFix ? fixImageLinks(md) : md;
  result = downgradeCodeBlocks(result, opts.codeDowngrade);

  if (opts.biliQuotStyle === 'bracket') {
    result = result.replace(/^> (.+)$/gm, '「$1」');
  } else if (opts.biliQuotStyle === 'none') {
    result = result.replace(/^> (.+)$/gm, '$1');
  }

  result = result.replace(/\*(.+?)\*/g, '$1');

  result = result.replace(/\n((?:\s*[-*+] .+\n)+)/g, '\n\n$1\n');
  result = result.replace(/\n((?:\s*\d+\. .+\n)+)/g, '\n\n$1\n');

  result = result.replace(/\n(```[\s\S]*?```)/g, '\n\n$1\n\n');

  return result.trim();
}

type DiffSegment = { type: 'same' | 'added' | 'removed' | 'modified'; text: string };

function simpleDiff(original: string, modified: string): DiffSegment[] {
  if (original === modified) return [{ type: 'same', text: modified }];

  const origWords = original.split(/(\s+|[，。！？、；：""''（）【】《》,.!?;:\'\"\(\)\[\]<>])/g).filter(Boolean);
  const modWords = modified.split(/(\s+|[，。！？、；：""''（）【】《》,.!?;:\'\"\(\)\[\]<>])/g).filter(Boolean);

  const result: DiffSegment[] = [];
  let i = 0;
  let j = 0;

  while (i < origWords.length || j < modWords.length) {
    if (i < origWords.length && j < modWords.length && origWords[i] === modWords[j]) {
      result.push({ type: 'same', text: origWords[i] });
      i++;
      j++;
    } else {
      let foundMatch = false;
      for (let look = 1; look <= 5 && !foundMatch; look++) {
        if (i + look < origWords.length && j < modWords.length && origWords[i + look] === modWords[j]) {
          for (let k = 0; k < look; k++) {
            result.push({ type: 'removed', text: origWords[i + k] });
          }
          i += look;
          foundMatch = true;
        } else if (j + look < modWords.length && i < origWords.length && origWords[i] === modWords[j + look]) {
          for (let k = 0; k < look; k++) {
            result.push({ type: 'added', text: modWords[j + k] });
          }
          j += look;
          foundMatch = true;
        }
      }
      if (!foundMatch) {
        if (i < origWords.length) {
          result.push({ type: 'removed', text: origWords[i] });
          i++;
        }
        if (j < modWords.length) {
          result.push({ type: 'added', text: modWords[j] });
          j++;
        }
      }
    }
  }

  const merged: DiffSegment[] = [];
  for (const seg of result) {
    if (merged.length > 0 && merged[merged.length - 1].type === seg.type) {
      merged[merged.length - 1].text += seg.text;
    } else {
      merged.push({ ...seg });
    }
  }

  return merged;
}

function renderDiffHighlight(diff: DiffSegment[]): string {
  return diff
    .map((seg) => {
      if (seg.type === 'same') return `<span>${seg.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
      if (seg.type === 'added')
        return `<span style="background-color:#dcfce7;color:#166534;padding:1px 2px;border-radius:2px;">${seg.text
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</span>`;
      if (seg.type === 'removed')
        return `<span style="background-color:#f3f4f6;color:#9ca3af;text-decoration:line-through;padding:1px 2px;border-radius:2px;">${seg.text
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</span>`;
      return `<span style="background-color:#fef9c3;color:#854d0e;padding:1px 2px;border-radius:2px;">${seg.text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')}</span>`;
    })
    .join('');
}

const PLATFORM_ORDER: PlatformKey[] = ['xhs', 'gzh', 'zhihu', 'dy', 'bili'];

export default function MarkdownPlatformAdapter({ locale = 'zh' }: MarkdownPlatformAdapterProps) {
  const t = getT(locale);

  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<PlatformKey>('xhs');
  const [showDiff, setShowDiff] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [xhsMax, setXhsMax] = useState(8);
  const [xhsAutoAppend, setXhsAutoAppend] = useState(true);
  const [gzhSpaceLevel, setGzhSpaceLevel] = useState(1);
  const [dyNewLineLevel, setDyNewLineLevel] = useState(2);
  const [biliQuotStyle, setBiliQuotStyle] = useState<BiliQuotStyle>('quote');
  const [zhihuTableCompat, setZhihuTableCompat] = useState(false);
  const [imgFixOn, setImgFixOn] = useState(true);
  const [codeDowngrade, setCodeDowngrade] = useState<CodeDowngradeOption>('keep');

  const platformLabels: Record<PlatformKey, string> = {
    xhs: t('xhs'),
    gzh: t('gzh'),
    zhihu: t('zhihu'),
    dy: t('dy'),
    bili: t('bili'),
  };

  const results = useMemo(() => {
    const src = input || '';
    const commonOpts = { imgFix: imgFixOn, codeDowngrade };
    return {
      xhs: convertXhs(src, { ...commonOpts, xhsMax, xhsAutoAppend }),
      gzh: convertGzh(src, { ...commonOpts, gzhSpaceLevel }),
      zhihu: convertZhihu(src, { ...commonOpts, zhihuTableCompat }),
      dy: convertDy(src, { ...commonOpts, dyNewLineLevel }),
      bili: convertBili(src, { ...commonOpts, biliQuotStyle }),
    };
  }, [input, imgFixOn, codeDowngrade, xhsMax, xhsAutoAppend, gzhSpaceLevel, dyNewLineLevel, biliQuotStyle, zhihuTableCompat]);

  const packText = useMemo(() => {
    const parts = PLATFORM_ORDER.map((p) => `==== ${platformLabels[p]} ====\n${results[p]}`);
    return parts.join('\n\n');
  }, [results, platformLabels]);

  const copyToClipboard = useCallback(async (text: string, key: string) => {
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
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((c) => (c === key ? null : c)), 1800);
  }, []);

  const loadSample = () => setInput(t('placeHolder'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('input')}</label>
              <button
                onClick={loadSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {t('sample')}
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('placeHolder')}
              className="w-full h-64 p-3 font-mono text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDiff}
                  onChange={(e) => setShowDiff(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Diff className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('showDiff')}</span>
              </label>
              {showDiff && (
                <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#dcfce7' }} />
                    {t('legendAdded')}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#f3f4f6' }} />
                    {t('legendRemoved')}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#fef9c3' }} />
                    {t('legendModified')}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => copyToClipboard(packText, 'all5')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium shadow hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <Download className="h-4 w-4" />
              {copiedKey === 'all5' ? (
                <>
                  <Check className="h-4 w-4" />
                  OK
                </>
              ) : (
                t('copyAll5')
              )}
            </button>
          </div>

          <div className="card p-3 sm:p-4">
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 border-b border-gray-200 dark:border-gray-700 pb-3 overflow-x-auto">
              {PLATFORM_ORDER.map((p) => (
                <button
                  key={p}
                  onClick={() => setActiveTab(p)}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === p
                      ? 'bg-indigo-500 text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {platformLabels[p]}
                </button>
              ))}
            </div>

            {PLATFORM_ORDER.map((p) => {
              const isActive = activeTab === p;
              const current = results[p];
              const diff = simpleDiff(input || '', current);
              return (
                <div key={p} className={isActive ? 'block' : 'hidden'}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('result', { p: platformLabels[p] })}
                    </span>
                    <button
                      onClick={() => copyToClipboard(current, p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {copiedKey === p ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedKey === p ? 'OK' : t('copy', { p: platformLabels[p].slice(0, 4) })}
                    </button>
                  </div>
                  {showDiff ? (
                    <div
                      className="w-full h-80 p-3 font-mono text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto whitespace-pre-wrap break-all"
                      dangerouslySetInnerHTML={{ __html: renderDiffHighlight(diff) }}
                    />
                  ) : (
                    <textarea
                      value={current}
                      readOnly
                      className="w-full h-80 p-3 font-mono text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 resize-none"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="card p-4 sm:p-5">
            <button
              onClick={() => setSettingsOpen((o) => !o)}
              className="w-full flex items-center justify-between mb-3"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('settings')}</span>
              </div>
              {settingsOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {settingsOpen && (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="flex items-center justify-between cursor-pointer mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{t('imgFix')}</span>
                    <input
                      type="checkbox"
                      checked={imgFixOn}
                      onChange={(e) => setImgFixOn(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">{t('codeDowngrade')}</label>
                  <select
                    value={codeDowngrade}
                    onChange={(e) => setCodeDowngrade(e.target.value as CodeDowngradeOption)}
                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
                  >
                    <option value="keep">keep - 保留</option>
                    <option value="remove">remove - 删除</option>
                    <option value="note">note - 文字说明</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{t('xhs')}</div>
                  <div className="space-y-2">
                    <div>
                      <label className="flex items-center justify-between mb-1">
                        <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                          {t('xhsMax')}
                        </span>
                        <span className="text-xs font-bold text-indigo-600">{xhsMax}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={20}
                        value={xhsMax}
                        onChange={(e) => setXhsMax(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded accent-indigo-500"
                      />
                    </div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{t('xhsAutoAppend')}</span>
                      <input
                        type="checkbox"
                        checked={xhsAutoAppend}
                        onChange={(e) => setXhsAutoAppend(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">{t('gzh')}</div>
                  <div>
                    <label className="flex items-center justify-between mb-1">
                      <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                        {t('gzhSpaceLevel')}
                      </span>
                      <span className="text-xs font-bold text-green-600">{gzhSpaceLevel}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={3}
                      value={gzhSpaceLevel}
                      onChange={(e) => setGzhSpaceLevel(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded accent-green-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">{t('zhihu')}</div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{t('zhihuTableCompat')}</span>
                    <input
                      type="checkbox"
                      checked={zhihuTableCompat}
                      onChange={(e) => setZhihuTableCompat(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-2">{t('dy')}</div>
                  <div>
                    <label className="flex items-center justify-between mb-1">
                      <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                        {t('dyNewLineLevel')}
                      </span>
                      <span className="text-xs font-bold text-pink-600">{dyNewLineLevel}</span>
                    </label>
                    <input
                      type="range"
                      min={1}
                      max={3}
                      value={dyNewLineLevel}
                      onChange={(e) => setDyNewLineLevel(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded accent-pink-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">{t('bili')}</div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-xs sm:text-sm">
                    {t('biliQuotStyle')}
                  </label>
                  <select
                    value={biliQuotStyle}
                    onChange={(e) => setBiliQuotStyle(e.target.value as BiliQuotStyle)}
                    className="w-full px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
                  >
                    <option value="quote">{'>> 保留'}</option>
                    <option value="bracket">{'「」 引号'}</option>
                    <option value="none">{'无 - 纯文本'}</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
