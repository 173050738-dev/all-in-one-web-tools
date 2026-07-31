'use client';

import { useState, useMemo } from 'react';
import { Languages, Copy, Check, RefreshCw, Sparkles, FileText, ArrowRightLeft } from 'lucide-react';

interface ClassicalChineseConverterProps {
  locale?: string;
}

type Style = 'preqin' | 'han' | 'song';

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '古文转换器',
    subtitle: '将现代白话文转换为文言文',
    inputLabel: '现代文',
    inputPlaceholder: '输入现代白话文，例如：我今天和朋友一起去公园散步，看到了很多美丽的花朵。',
    outputLabel: '文言文',
    convert: '转换',
    converting: '转换中...',
    clear: '清空',
    copy: '复制结果',
    copied: '已复制',
    styleLabel: '文风选择',
    stylePreqin: '先秦风格',
    styleHan: '汉唐风格',
    styleSong: '宋明风格',
    charCount: '字数',
    tip: '提示：此工具使用词典规则转换，非AI翻译。短句效果更佳。',
    outputEmpty: '转换结果将在此显示',
    examples: '示例',
    example1: '我爱我的祖国。',
    example2: '今天天气很好，我们出去走走吧。',
    example3: '他每天早上都会读书。',
    convertTip: '点击转换按钮开始',
  },
  en: {
    title: 'Classical Chinese Converter',
    subtitle: 'Convert modern Chinese to classical Chinese (文言文)',
    inputLabel: 'Modern Chinese',
    inputPlaceholder: 'Enter modern Chinese text, e.g. 我今天和朋友一起去公园散步，看到了很多美丽的花朵。',
    outputLabel: 'Classical Chinese',
    convert: 'Convert',
    converting: 'Converting...',
    clear: 'Clear',
    copy: 'Copy Result',
    copied: 'Copied',
    styleLabel: 'Style',
    stylePreqin: 'Pre-Qin',
    styleHan: 'Han-Tang',
    styleSong: 'Song-Ming',
    charCount: 'Characters',
    tip: 'Tip: This uses dictionary-based rules, not AI. Shorter text works better.',
    outputEmpty: 'Conversion result will appear here',
    examples: 'Examples',
    example1: '我爱我的祖国。',
    example2: '今天天气很好，我们出去走走吧。',
    example3: '他每天早上都会读书。',
    convertTip: 'Click convert to start',
  },
  es: {
    title: 'Convertidor de Chino Clásico',
    subtitle: 'Convierte chino moderno a chino clásico (文言文)',
    inputLabel: 'Chino Moderno',
    inputPlaceholder: 'Introduce texto en chino moderno',
    outputLabel: 'Chino Clásico',
    convert: 'Convertir',
    converting: 'Convirtiendo...',
    clear: 'Limpiar',
    copy: 'Copiar Resultado',
    copied: 'Copiado',
    styleLabel: 'Estilo',
    stylePreqin: 'Pre-Qin',
    styleHan: 'Han-Tang',
    styleSong: 'Song-Ming',
    charCount: 'Caracteres',
    tip: 'Consejo: Usa reglas de diccionario, no IA. Textos cortos funcionan mejor.',
    outputEmpty: 'El resultado aparecerá aquí',
    examples: 'Ejemplos',
    example1: '我爱我的祖国。',
    example2: '今天天气很好，我们出去走走吧。',
    example3: '他每天早上都会读书。',
    convertTip: 'Haz clic para convertir',
  },
  fr: {
    title: 'Convertisseur de Chinois Classique',
    subtitle: 'Convertissez le chinois moderne en chinois classique (文言文)',
    inputLabel: 'Chinois Moderne',
    inputPlaceholder: 'Entrez du texte en chinois moderne',
    outputLabel: 'Chinois Classique',
    convert: 'Convertir',
    converting: 'Conversion...',
    clear: 'Effacer',
    copy: 'Copier',
    copied: 'Copié',
    styleLabel: 'Style',
    stylePreqin: 'Pré-Qin',
    styleHan: 'Han-Tang',
    styleSong: 'Song-Ming',
    charCount: 'Caractères',
    tip: 'Conseil : Utilise des règles de dictionnaire, pas l\'IA.',
    outputEmpty: 'Le résultat apparaîtra ici',
    examples: 'Exemples',
    example1: '我爱我的祖国。',
    example2: '今天天气很好，我们出去走走吧。',
    example3: '他每天早上都会读书。',
    convertTip: 'Cliquez pour convertir',
  },
  hi: {
    title: 'शास्त्रीय चीनी कनवर्टर',
    subtitle: 'आधुनिक चीनी को शास्त्रीय चीनी (文言文) में बदलें',
    inputLabel: 'आधुनिक चीनी',
    inputPlaceholder: 'आधुनिक चीनी पाठ दर्ज करें',
    outputLabel: 'शास्त्रीय चीनी',
    convert: 'रूपांतरित करें',
    converting: 'रूपांतरित हो रहा है...',
    clear: 'साफ़ करें',
    copy: 'परिणाम कॉपी करें',
    copied: 'कॉपी हुआ',
    styleLabel: 'शैली',
    stylePreqin: 'प्री-किन',
    styleHan: 'हान-तांग',
    styleSong: 'सोंग-मिंग',
    charCount: 'अक्षर',
    tip: 'सुझाव: शब्दकोश नियमों का उपयोग करता है, AI नहीं।',
    outputEmpty: 'परिणाम यहां दिखेगा',
    examples: 'उदाहरण',
    example1: '我爱我的祖国。',
    example2: '今天天气很好，我们出去走走吧。',
    example3: '他每天早上都会读书।',
    convertTip: 'रूपांतरित करने के लिए क्लिक करें',
  },
  ar: {
    title: 'محول الصينية الكلاسيكية',
    subtitle: 'حوّل الصينية الحديثة إلى الصينية الكلاسيكية (文言文)',
    inputLabel: 'الصينية الحديثة',
    inputPlaceholder: 'أدخل نصاً صينياً حديثاً',
    outputLabel: 'الصينية الكلاسيكية',
    convert: 'تحويل',
    converting: 'جاري التحويل...',
    clear: 'مسح',
    copy: 'نسخ النتيجة',
    copied: 'تم النسخ',
    styleLabel: 'الأسلوب',
    stylePreqin: 'ما قبل تشين',
    styleHan: 'هان-تانغ',
    styleSong: 'سونغ-مينغ',
    charCount: 'حرف',
    tip: 'نصيحة: يستخدم قواعد القاموس، وليس الذكاء الاصطناعي.',
    outputEmpty: 'النتيجة ستظهر هنا',
    examples: 'أمثلة',
    example1: '我爱我的祖国。',
    example2: '今天天气很好，我们出去走走吧。',
    example3: '他每天早上都会读书।',
    convertTip: 'انقر للتحويل',
  },
};

const WORD_MAP: Record<string, string> = {
  '的': '之',
  '了': '矣',
  '在': '于',
  '是': '乃',
  '我': '吾',
  '你': '汝',
  '他': '其',
  '她': '其',
  '它': '其',
  '我们': '吾等',
  '你们': '汝等',
  '他们': '彼等',
  '自己': '己',
  '大家': '众',
  '人': '人',
  '男人': '男',
  '女人': '女',
  '孩子': '子',
  '朋友': '友',
  '敌人': '敌',
  '国家': '国',
  '世界': '天下',
  '中国': '华夏',
  '地方': '地',
  '城市': '城',
  '乡村': '乡',
  '家里': '家',
  '房间': '室',
  '门': '户',
  '窗户': '牖',
  '桌子': '案',
  '椅子': '椅',
  '床': '榻',
  '书': '书',
  '文字': '文',
  '文章': '章',
  '信': '书',
  '名字': '名',
  '现在': '今',
  '今天': '今日',
  '昨天': '昨日',
  '明天': '明日',
  '早上': '晨',
  '晚上': '暮',
  '中午': '日中',
  '下午': '日昳',
  '时间': '时',
  '时候': '时',
  '年': '年',
  '月': '月',
  '日': '日',
  '星期': '周',
  '小时': '时',
  '分钟': '分',
  '秒': '秒',
  '天气': '天',
  '下雨': '雨',
  '下雪': '雪',
  '太阳': '日',
  '月亮': '月',
  '星星': '星',
  '天空': '天',
  '云': '云',
  '风': '风',
  '山': '山',
  '水': '水',
  '河流': '河',
  '大海': '海',
  '湖': '湖',
  '树': '木',
  '花': '花',
  '草': '草',
  '鸟': '鸟',
  '鱼': '鱼',
  '动物': '兽',
  '植物': '植',
  '花园': '园',
  '公园': '苑',
  '路': '路',
  '道路': '道',
  '桥': '桥',
  '车': '车',
  '马': '马',
  '船': '舟',
  '飞机': '飞行器',
  '电脑': '算器',
  '手机': '呼器',
  '电视': '观器',
  '电话': '传音器',
  '衣服': '衣',
  '裤子': '裤',
  '鞋子': '履',
  '帽子': '冠',
  '食物': '食',
  '饭': '饭',
  '菜': '肴',
  '汤': '汤',
  '水': '水',
  '茶': '茶',
  '酒': '酒',
  '水果': '果',
  '肉': '肉',
  '面包': '饼',
  '吃': '食',
  '喝': '饮',
  '穿': '衣',
  '戴': '服',
  '看': '视',
  '听': '闻',
  '说': '曰',
  '讲': '言',
  '读': '读',
  '写': '书',
  '走': '行',
  '跑': '奔',
  '坐': '坐',
  '站': '立',
  '睡': '寝',
  '醒': '觉',
  '去': '往',
  '来': '来',
  '回': '归',
  '进': '入',
  '出': '出',
  '上': '上',
  '下': '下',
  '开': '开',
  '关': '闭',
  '买': '市',
  '卖': '鬻',
  '给': '予',
  '拿': '取',
  '放': '置',
  '做': '为',
  '干活': '作',
  '工作': '事',
  '学习': '学',
  '教': '教',
  '考试': '试',
  '通过': '过',
  '知道': '知',
  '不知道': '不知',
  '明白': '明',
  '想': '思',
  '想念': '念',
  '喜欢': '好',
  '爱': '爱',
  '恨': '恨',
  '害怕': '惧',
  '高兴': '喜',
  '难过': '悲',
  '生气': '怒',
  '笑': '笑',
  '哭': '泣',
  '感谢': '谢',
  '对不起': '歉',
  '请': '请',
  '让': '令',
  '叫': '呼',
  '告诉': '告',
  '问': '问',
  '回答': '对',
  '考虑': '虑',
  '决定': '决',
  '选择': '择',
  '帮助': '助',
  '使用': '用',
  '需要': '需',
  '给': '予',
  '但是': '然',
  '可是': '然',
  '然而': '然而',
  '因为': '以',
  '所以': '故',
  '因此': '是以',
  '如果': '若',
  '虽然': '虽',
  '而且': '且',
  '或者': '或',
  '和': '与',
  '跟': '与',
  '同': '同',
  '一起': '共',
  '非常': '甚',
  '很': '甚',
  '特别': '尤',
  '比较': '较',
  '最': '最',
  '更': '更',
  '也': '亦',
  '不': '不',
  '没': '无',
  '没有': '无',
  '有': '有',
  '是': '乃',
  '不是': '非',
  '对': '是',
  '错': '误',
  '好': '善',
  '坏': '恶',
  '大': '大',
  '小': '小',
  '多': '多',
  '少': '寡',
  '长': '长',
  '短': '短',
  '高': '高',
  '低': '下',
  '远': '远',
  '近': '近',
  '快': '疾',
  '慢': '缓',
  '热': '热',
  '冷': '寒',
  '新': '新',
  '旧': '旧',
  '老': '老',
  '年轻': '少',
  '美丽': '美',
  '漂亮': '丽',
  '丑': '丑',
  '善良': '善',
  '聪明': '智',
  '勇敢': '勇',
  '勤劳': '勤',
  '懒惰': '惰',
  '诚实': '信',
  '虚伪': '伪',
  '简单': '简',
  '复杂': '繁',
  '容易': '易',
  '困难': '难',
  '重要': '重',
  '必须': '须',
  '应该': '应',
  '可以': '可',
  '能够': '能',
  '想要': '欲',
  '愿意': '愿',
  '打算': '将',
  '计划': '谋',
  '开始': '始',
  '结束': '终',
  '继续': '续',
  '停止': '止',
  '完成': '毕',
  '成功': '成',
  '失败': '败',
  '发现': '现',
  '发明': '创',
  '创造': '造',
  '改变': '变',
  '发展': '展',
  '变化': '化',
  '问题': '问',
  '答案': '对',
  '方法': '法',
  '方式': '式',
  '原因': '因',
  '结果': '果',
  '影响': '响',
  '意义': '义',
  '价值': '价',
  '目的': '的',
  '目标': '标',
  '计划': '谋',
  '任务': '任',
  '工作': '事',
  '事业': '业',
  '生活': '生',
  '生命': '命',
  '健康': '健',
  '疾病': '疾',
  '医院': '医馆',
  '学校': '学宫',
  '大学': '太学',
  '老师': '师',
  '学生': '生',
  '同学': '同窗',
  '课程': '课',
  '教室': '堂',
  '考试': '试',
  '毕业': '毕业',
  '公司': '肆',
  '银行': '钱庄',
  '商店': '铺',
  '工厂': '坊',
  '办公室': '署',
  '开会': '会',
  '会议': '议',
  '讨论': '论',
  '决定': '决',
  '报告': '禀',
  '消息': '讯',
  '新闻': '闻',
  '信息': '息',
  '网络': '网',
  '互联网': '互连网',
  '技术': '术',
  '科学': '学',
  '艺术': '艺',
  '音乐': '乐',
  '电影': '影',
  '游戏': '戏',
  '运动': '动',
  '足球': '蹴鞠',
  '篮球': '球',
  '游泳': '泳',
  '跑步': '奔',
  '旅行': '游',
  '旅游': '游',
  '游玩': '戏',
  '休息': '息',
  '度假': '暇',
  '节日': '节',
  '生日': '生辰',
  '婚礼': '婚',
  '葬礼': '丧',
  '聚会': '会',
  '派对': '会',
  '约会': '约',
  '婚姻': '姻',
  '恋爱': '恋',
  '感情': '情',
  '爱情': '爱',
  '友情': '友',
  '亲情': '亲',
  '家庭': '家',
  '父母': '父母',
  '父亲': '父',
  '母亲': '母',
  '哥哥': '兄',
  '姐姐': '姊',
  '弟弟': '弟',
  '妹妹': '妹',
  '爷爷': '祖',
  '奶奶': '祖母',
  '外公': '外祖',
  '外婆': '外祖母',
  '叔叔': '叔',
  '阿姨': '姨',
  '舅舅': '舅',
  '姑姑': '姑',
  '侄子': '侄',
  '侄女': '侄女',
  '孙子': '孙',
  '孙女': '孙女',
  '丈夫': '夫',
  '妻子': '妻',
  '儿子': '子',
  '女儿': '女',
  '老板': '主',
  '员工': '佣',
  '同事': '僚',
  '下属': '属',
  '上司': '上',
  '领导': '领',
  '管理': '管',
  '组织': '组',
  '团队': '队',
  '合作': '合',
  '竞争': '争',
  '对手': '对',
  '敌人': '敌',
  '陌生人': '生人',
  '邻居': '邻',
  '客人': '客',
  '主人': '主',
  '服务': '侍',
  '产品': '物',
  '商品': '货',
  '价格': '价',
  '钱': '金',
  '工资': '俸',
  '财富': '财',
  '贫穷': '贫',
  '富有': '富',
  '消费': '费',
  '投资': '投',
  '银行': '钱庄',
  '股票': '股',
  '基金': '资',
  '保险': '险',
  '税': '税',
  '政府': '府',
  '领导': '领',
  '政策': '策',
  '法律': '法',
  '规则': '则',
  '制度': '制',
  '权利': '权',
  '义务': '义',
  '自由': '自由',
  '民主': '民主',
  '选举': '选',
  '投票': '票',
  '政治': '政',
  '经济': '济',
  '文化': '化',
  '社会': '世',
  '国家': '国',
  '民族': '族',
  '历史': '史',
  '哲学': '哲',
  '宗教': '教',
  '佛教': '释',
  '道教': '道',
  '儒家': '儒',
  '思想': '思',
  '理论': '论',
  '观点': '观',
  '意见': '见',
  '态度': '态',
  '行动': '动',
  '行为': '为',
  '实践': '行',
  '经验': '验',
  '教训': '训',
  '记忆': '忆',
  '印象': '象',
  '感觉': '觉',
  '感受': '受',
  '情绪': '情',
  '心情': '情',
  '思想': '思',
  '思维': '维',
  '理解': '解',
  '认知': '知',
  '感知': '感',
  '直觉': '觉',
  '灵感': '灵',
  '梦': '梦',
  '理想': '理想',
  '梦想': '梦想',
  '目标': '标',
  '志向': '志',
  '抱负': '抱负',
  '追求': '求',
  '努力': '力',
  '奋斗': '斗',
  '拼搏': '搏',
  '坚持': '持',
  '耐心': '耐',
  '勇气': '勇',
  '信心': '信',
  '决心': '决',
  '专心': '专',
  '用心': '用',
  '细心': '细',
  '小心': '慎',
  '当心': '慎',
  '注意': '注',
  '警惕': '戒',
  '小心': '慎',
  '安全': '安',
  '危险': '险',
  '意外': '外',
  '事故': '故',
  '灾难': '灾',
  '困难': '难',
  '障碍': '障',
  '挑战': '战',
  '机遇': '遇',
  '运气': '运',
  '命运': '命',
  '缘分': '缘',
  '机会': '机',
  '可能': '可',
  '希望': '望',
  '期待': '期',
  '等待': '待',
  '尝试': '试',
  '努力': '力',
  '成功': '成',
  '成就': '就',
  '荣誉': '荣',
  '名声': '名',
  '名誉': '誉',
  '地位': '位',
  '身份': '分',
  '角色': '色',
  '作用': '用',
  '功能': '能',
  '效果': '效',
  '结果': '果',
  '后果': '后',
  '影响': '响',
  '意义': '义',
  '价值': '价',
  '重要性': '要',
  '必要性': '须',
  '紧急性': '急',
  '优先': '先',
  '首先': '首',
  '其次': '次',
  '最后': '终',
  '然后': '乃',
  '接着': '继',
  '同时': '并',
  '另外': '另',
  '此外': '且',
  '总之': '总',
  '因此': '故',
  '所以': '故',
  '于是': '遂',
  '然后': '乃',
  '但是': '然',
  '不过': '但',
  '然而': '然',
  '可是': '然',
  '虽然': '虽',
  '尽管': '虽',
  '即使': '纵',
  '如果': '若',
  '假如': '设',
  '要是': '若',
  '只有': '唯',
  '只是': '特',
  '就是': '即',
  '而是': '乃',
  '而且': '且',
  '并且': '并',
  '或者': '或',
  '或是': '或',
  '以及': '及',
  '还有': '尚有',
  '包括': '括',
  '例如': '如',
  '比如': '如',
  '譬如': '譬',
  '即': '即',
  '也就是': '乃',
  '实际上': '实',
  '当然': '固',
  '自然': '自',
  '必然': '必',
  '或许': '或',
  '也许': '或',
  '可能': '可',
  '大概': '约',
  '大约': '约',
  '似乎': '似',
  '好像': '若',
  '真的': '诚',
  '确实': '诚',
  '绝对': '绝',
  '完全': '全',
  '简直': '直',
  '几乎': '几',
  '差不多': '几',
  '逐渐': '渐',
  '渐渐': '渐',
  '突然': '忽',
  '忽然': '忽',
  '立刻': '即',
  '马上': '即刻',
  '同时': '并',
  '一起': '共',
  '独自': '独',
  '单独': '单',
  '自己': '己',
  '亲自': '亲',
  '亲手': '亲',
  '亲眼': '亲',
  '亲身': '躬',
  '本人': '己',
  '本身': '本',
  '自我': '自',
  '别人': '人',
  '他人': '彼',
  '众人': '众',
  '所有人': '皆',
  '每个人': '各',
  '大家': '众',
  '我们': '吾等',
  '你们': '汝等',
  '他们': '彼等',
  '她们': '彼等',
  '它们': '彼等',
  '这边': '此',
  '那边': '彼',
  '这里': '此地',
  '那里': '彼处',
  '哪里': '何',
  '到处': '处处',
  '处处': '处处',
  '到处都是': '皆是',
  '充满': '充',
  '遍布': '遍',
  '普遍': '遍',
  '个别': '个',
  '特殊': '特',
  '特别': '尤',
  '一般': '常',
  '普通': '凡',
  '通常': '常',
  '总是': '常',
  '经常': '屡',
  '偶尔': '偶',
  '有时': '或',
  '有时': '间',
  '从来不': '从不',
  '永远': '永',
  '一直': '常',
  '老是': '每',
  '总是': '每',
  '依旧': '仍',
  '依然': '仍',
  '还是': '犹',
  '尚且': '尚',
  '暂且': '姑',
  '暂时': '暂',
  '忽然': '忽',
  '突然': '忽',
  '猛然': '猛',
  '骤然': '骤',
  '渐渐': '渐',
  '慢慢': '徐',
  '缓缓': '徐',
  '徐徐': '徐',
  '速速': '速',
  '赶快': '速',
  '赶紧': '急',
  '急忙': '急',
  '匆忙': '匆',
  '急忙': '急',
  '从容': '从容',
  '悠然': '悠然',
  '自然': '自然',
  '当然': '固',
  '难怪': '难怪',
  '怪不得': '难怪',
  '也就是说': '即',
  '换句话说': '换言之',
  '简单来说': '简言之',
  '总而言之': '总之',
  '综上所述': '综上',
  '一方面': '一则',
  '另一方面': '二则',
  '首先': '首',
  '其次': '次',
  '再次': '再',
  '最后': '终',
  '最终': '终',
  '终于': '终',
  '最后': '末',
  '结尾': '末',
  '开始': '始',
  '最初': '初',
  '起初': '初',
  '当初': '初',
  '当时': '当',
  '那时': '彼',
  '这时': '此',
  '现在': '今',
  '如今': '今',
  '当今': '今',
  '今日': '今日',
  '今朝': '今朝',
  '今日': '今日',
  '是日': '是日',
  '是夜': '是夜',
  '是月': '是月',
  '是年': '是年',
  '今年': '今年',
  '去年': '去年',
  '明年': '明年',
  '后年': '后年',
  '前年': '前年',
  '往年': '往年',
  '当年': '当年',
  '晚年': '晚年',
  '少年': '少年',
  '幼年': '幼年',
  '青年': '青年',
  '中年': '中年',
  '老年': '老年',
  '年龄': '岁',
  '年岁': '年岁',
  '岁月': '岁月',
  '时光': '时光',
  '光阴': '光阴',
  '青春': '青春',
  '一生': '一生',
  '终身': '终身',
  '毕生': '毕生',
  '一世': '一世',
  '一辈子': '一生',
  '世代': '世',
  '后代': '后',
  '前人': '前',
  '古人': '古人',
  '今人': '今人',
  '后人': '后人',
  '世人': '世人',
  '凡人': '凡人',
  '圣人': '圣人',
  '贤人': '贤人',
  '君子': '君子',
  '小人': '小人',
  '大人': '大人',
  '小人': '细人',
  '众人': '众人',
  '愚人': '愚人',
  '智人': '智人',
  '仁者': '仁者',
  '勇者': '勇者',
  '老者': '老者',
  '老者': '长者',
  '长者': '长者',
  '长者': '前辈',
  '先生': '先生',
  '女士': '女士',
  '夫人': '夫人',
  '小姐': '小姐',
  '公子': '公子',
  '姑娘': '姑娘',
  '郎君': '郎君',
  '娘子': '娘子',
  '官人': '官人',
  '相公': '相公',
  '大师': '大师',
  '师父': '师父',
  '徒弟': '徒弟',
  '弟子': '弟子',
  '门人': '门人',
  '学生': '学生',
  '同窗': '同窗',
  '同年': '同年',
  '同袍': '同袍',
  '盟友': '盟友',
  '同志': '同志',
  '同道': '同道',
  '朋友': '朋友',
  '友人': '友人',
  '好友': '好友',
  '挚友': '挚友',
  '知己': '知己',
  '红颜': '红颜',
  '蓝颜': '蓝颜',
  '青梅竹马': '青梅竹马',
  '闺蜜': '闺中',
  '兄弟': '兄弟',
  '姐妹': '姐妹',
  '手足': '手足',
  '骨肉': '骨肉',
  '至亲': '至亲',
  '亲人': '亲人',
  '家人': '家人',
  '爱人': '爱人',
  '伴侣': '伴侣',
  '配偶': '配偶',
  '老公': '夫',
  '老婆': '妻',
  '对象': '对象',
  '恋人': '恋人',
  '情人': '情人',
  '心上人': '心上人',
  '意中人': '意中人',
  '有情人': '有情人',
  '眷属': '眷属',
  '夫妻': '夫妻',
  '夫妇': '夫妇',
  '情侣': '情侣',
  '连理': '连理',
  '比翼': '比翼',
  '白头': '白头',
  '偕老': '偕老',
  '相伴': '相伴',
  '相守': '相守',
  '相随': '相随',
  '相依': '相依',
  '相偎': '相偎',
  '相濡以沫': '相濡以沫',
};

const PRE_QIN_SUFFIX = ['也', '矣', '焉', '乎', '哉', '兮', '欤', '耶', '而已', '耳'];
const HAN_TANG_SUFFIX = ['也', '矣', '焉', '乎', '哉', '耳', '已', '般'];
const SONG_MING_SUFFIX = ['也', '矣', '乎', '耳', '般', '来', '去', '着'];

const STYLE_PREFIXES: Record<Style, string[]> = {
  preqin: ['', ''],
  han: ['', ''],
  song: ['', ''],
};

function convertModernToClassical(text: string, style: Style): string {
  if (!text.trim()) return '';

  let result = text;

  const sortedEntries = Object.entries(WORD_MAP).sort((a, b) => b[0].length - a[0].length);

  for (const [modern, classical] of sortedEntries) {
    const regex = new RegExp(modern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, classical);
  }

  result = result
    .replace(/，/g, '，')
    .replace(/。/g, '。')
    .replace(/！/g, '！')
    .replace(/？/g, '？')
    .replace(/；/g, '；')
    .replace(/：/g, '：')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/\s+/g, '')
    .replace(/([，。！？])\1+/g, '$1')
    .replace(/。{2,}/g, '。')
    .replace(/！{2,}/g, '！')
    .replace(/？{2,}/g, '？');

  const sentences = result.split(/([。！？!?])/);
  const styleSuffixes = style === 'preqin' ? PRE_QIN_SUFFIX : style === 'han' ? HAN_TANG_SUFFIX : SONG_MING_SUFFIX;

  let converted = '';
  for (let i = 0; i < sentences.length; i++) {
    const sent = sentences[i];
    if (/^[，。！？!?]$/.test(sent)) {
      converted += sent;
    } else if (sent.trim()) {
      let processed = sent;
      if (i === sentences.length - 1 || !/[。！？!?]/.test(sentences[i + 1] || '')) {
        const hasSuffix = /[也矣焉乎哉兮欤耶耳已般来去着]$/.test(processed);
        if (!hasSuffix && processed.length > 0) {
          const suffix = styleSuffixes[Math.floor(Math.random() * Math.min(3, styleSuffixes.length))];
          processed += suffix;
        }
      }
      converted += processed;
    }
  }

  converted = converted
    .replace(/之之/g, '之')
    .replace(/矣矣/g, '矣')
    .replace(/也也/g, '也')
    .replace(/焉焉/g, '焉')
    .replace(/乎乎/g, '乎')
    .replace(/哉哉/g, '哉')
    .replace(/耳耳/g, '耳')
    .replace(/乃乃/g, '乃')
    .replace(/吾吾/g, '吾')
    .replace(/汝汝/g, '汝')
    .replace(/其其/g, '其')
    .replace(/子子/g, '子')
    .replace(/^[，、]/, '')
    .replace(/[，、]$/, '');

  return converted;
}

export default function ClassicalChineseConverter({ locale = 'zh' }: ClassicalChineseConverterProps) {
  const t = i18n[locale] || i18n.zh;
  const isRTL = locale === 'ar';

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [style, setStyle] = useState<Style>('han');
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(false);

  const charCount = input.length;

  const handleConvert = () => {
    if (!input.trim()) return;
    setIsConverting(true);
    setTimeout(() => {
      const result = convertModernToClassical(input, style);
      setOutput(result);
      setIsConverting(false);
    }, 300);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const loadExample = (ex: string) => {
    setInput(ex);
    setOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center justify-center gap-2">
          <Languages className="text-emerald-500" size={28} />
          {t.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-4">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.styleLabel}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['preqin', 'han', 'song'] as Style[]).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition min-h-[44px] ${
                  style === s
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {t[`style${s.charAt(0).toUpperCase() + s.slice(1)}` as keyof typeof t]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t.inputLabel}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition resize-y text-sm leading-relaxed"
            dir="ltr"
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">{t.charCount}: {charCount}</span>
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            >
              {t.clear}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">{t.examples}:</span>
          <button
            onClick={() => loadExample(t.example1)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {t.example1}
          </button>
          <button
            onClick={() => loadExample(t.example2)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {t.example2}
          </button>
          <button
            onClick={() => loadExample(t.example3)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {t.example3}
          </button>
        </div>

        <button
          onClick={handleConvert}
          disabled={isConverting || !input.trim()}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-xl transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 min-h-[48px]"
        >
          {isConverting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              {t.converting}
            </>
          ) : (
            <>
              <ArrowRightLeft className="w-5 h-5" />
              {t.convert}
            </>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <FileText size={16} />
            {t.outputLabel}
          </label>
          {output && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? t.copied : t.copy}
            </button>
          )}
        </div>
        <div
          className="min-h-[150px] p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800"
          dir="ltr"
        >
          {output ? (
            <p
              className="text-gray-800 dark:text-gray-200 leading-loose whitespace-pre-line text-base"
              style={{ fontFamily: 'KaiTi, STKaiti, "楷体", serif' }}
            >
              {output}
            </p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-8">
              {t.outputEmpty}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center italic">{t.tip}</p>
    </div>
  );
}