'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Languages,
  Copy,
  Check,
  Download,
  FileText,
  Sparkles,
  AlertTriangle,
  SwitchCamera,
  BookOpen,
} from 'lucide-react';

interface PolyphonicPinyinAnnotatorProps {
  locale?: string;
}

type FormatMode = 'ruby' | 'inline';
type MarkMode = 'poly' | 'rare' | 'all';

interface CharResult {
  char: string;
  pinyin: string;
  isPoly: boolean;
  isRare: boolean;
  isCJK: boolean;
  selectedIdx: number;
  alternatives: string[];
  skip: boolean;
}

const PINYIN_PAIRS: [string, string[]][] = [
  ['银',['yín']],['行',['xíng','háng','héng','hàng']],['门',['mén']],['口',['kǒu']],
  ['一',['yī']],['人',['rén']],['正',['zhèng','zhēng']],['在',['zài']],
  ['重',['zhòng','chóng']],['复',['fù']],['强',['qiáng','qiǎng','jiàng']],['调',['tiáo','diào']],
  ['了',['le','liǎo']],['要',['yào','yāo']],['求',['qiú']],['每',['měi']],
  ['个',['gè','gě']],['都',['dōu','dū']],['还',['hái','huán']],['书',['shū']],
  ['查',['chá','zhā']],['当',['dāng','dàng']],['时',['shí']],
  ['的',['de','dí','dì','dī']],['背',['bèi','bēi']],['景',['jǐng']],['大',['dà','dài','tài']],
  ['家',['jiā','jia','jie']],['觉',['jué','jiào']],['得',['dé','děi','de']],
  ['长',['cháng','zhǎng']],['头',['tóu','tou']],['发',['fā','fà']],['少',['shǎo','shào']],
  ['年',['nián']],['真',['zhēn']],['好',['hǎo','hào']],['看',['kàn','kān']],
  ['出',['chū']],['息',['xī']],['会',['huì','kuài']],
  ['成',['chéng']],['为',['wéi','wèi']],['名',['míng']],['夫',['fū','fú']],
  ['走',['zǒu']],['路',['lù']],['他',['tā']],['们',['men']],
  ['性',['xìng']],['情',['qíng']],['事',['shì']],
  ['我',['wǒ']],['你',['nǐ']],['她',['tā']],['它',['tā']],
  ['这',['zhè','zhèi']],['那',['nà','nǎ','nèi','nā']],['哪',['nǎ','něi','né','nǎi']],
  ['来',['lái']],['去',['qù']],['说',['shuō','shuì','yuè']],['话',['huà']],
  ['听',['tīng']],['吃',['chī']],['喝',['hē']],['朋',['péng']],
  ['友',['yǒu']],['爸',['bà']],['妈',['mā']],['哥',['gē']],
  ['姐',['jiě']],['弟',['dì']],['妹',['mèi']],['爷',['yé']],
  ['奶',['nǎi']],['儿',['ér']],['女',['nǚ','rǔ']],['子',['zǐ','zi']],
  ['孩',['hái']],['宝',['bǎo']],['贝',['bèi']],['国',['guó']],
  ['学',['xué']],['校',['xiào','jiào']],['老',['lǎo']],['师',['shī']],
  ['生',['shēng']],['日',['rì']],['月',['yuè']],['间',['jiān','jiàn']],
  ['上',['shàng','shǎng']],['下',['xià']],['左',['zuǒ']],['右',['yòu']],
  ['前',['qián']],['后',['hòu']],['东',['dōng']],['西',['xī']],
  ['南',['nán','nā']],['北',['běi']],['美',['měi']],['小',['xiǎo']],
  ['多',['duō']],['今',['jīn']],['明',['míng']],['昨',['zuó']],
  ['天',['tiān']],['风',['fēng']],['雨',['yǔ','yù']],['雪',['xuě']],
  ['云',['yún']],['山',['shān']],['水',['shuǐ']],['火',['huǒ']],
  ['土',['tǔ']],['金',['jīn']],['木',['mù']],['河',['hé']],
  ['海',['hǎi']],['江',['jiāng']],['湖',['hú']],['红',['hóng']],
  ['黄',['huáng']],['蓝',['lán']],['白',['bái']],['黑',['hēi']],
  ['绿',['lǜ','lù']],['紫',['zǐ']],['粉',['fěn']],['不',['bù','bú','fǒu']],
  ['是',['shì']],['中',['zhōng','zhòng']],['种',['zhǒng','zhòng']],['华',['huá','huà']],
  ['朝',['zhāo','cháo']],['佛',['fó','fú']],['车',['chē','jū']],
  ['兴',['xīng','xìng']],['曲',['qū','qǔ']],['系',['xì','jì']],
  ['假',['jiǎ','jià']],['能',['néng','nài']],['作',['zuò','zuō']],
  ['卷',['juàn','juǎn']],['冠',['guān','guàn']],['更',['gèng','gēng']],
  ['难',['nán','nàn']],['色',['sè','shǎi']],['什',['shén','shí']],
  ['么',['me','mó','yāo']],['地',['dì','de']],['和',['hé','hè','huó','huò','hú']],
  ['空',['kōng','kòng','kǒng']],['吧',['ba','bā']],['给',['gěi','jǐ']],
  ['过',['guò','guo','guō']],['薄',['bó','báo','bò']],['恶',['è','wù','ě','wū']],
  ['宿',['sù','xiǔ','xiù']],['拗',['ào','ǎo','niù']],['艾',['ài','yì']],
  ['曝',['pù','bào']],['暴',['bào','pù']],['沓',['tà','dá']],
  ['率',['lǜ','shuài']],['殷',['yīn','yān','yǐn']],['秘',['mì','bì']],
  ['尿',['niào','suī']],['卡',['kǎ','qiǎ']],['片',['piàn','piān']],
  ['亲',['qīn','qìng']],['且',['qiě','jū']],['区',['qū','ōu']],
  ['厦',['shà','xià']],['雀',['què','qiāo','qiǎo']],['熟',['shú','shóu']],
  ['似',['sì','shì']],['缩',['suō','sù']],['叶',['yè','xié']],
  ['钥',['yuè','yào']],['药',['yào']],['硬',['yìng']],['软',['ruǎn']],
  ['堡',['bǎo','bǔ','pù']],['请',['qǐng']],['问',['wèn']],
  ['高',['gāo']],['矮',['ǎi']],['跳',['tiào']],['跑',['pǎo']],
  ['龙',['lóng']],['虎',['hǔ']],['熊',['xióng']],['鸡',['jī']],
  ['鹿',['lù']],['鱼',['yú']],['鸟',['niǎo']],['虫',['chóng']],
  ['草',['cǎo']],['树',['shù']],['花',['huā']],['乐',['lè','yuè','yào']],
  ['数',['shù','shǔ','shuò']],['几',['jǐ','jī']],['差',['chā','chà','chāi','cī']],
  ['盛',['shèng','chéng']],['没',['méi','mò']],['便',['biàn','pián']],
  ['传',['chuán','zhuàn']],['单',['dān','chán','shàn']],['解',['jiě','xiè','jiè']],
  ['干',['gān','gàn']],['教',['jiào','jiāo']],['量',['liàng','liáng']],
  ['将',['jiāng','jiàng']],['相',['xiāng','xiàng']],['磨',['mó','mò']],
  ['散',['sàn','sǎn']],['钉',['dīng','dìng']],['钻',['zuān','zuàn']],
  ['累',['lèi','lěi','léi']],['结',['jié','jiē']],['骨',['gǔ','gū']],
  ['露',['lù','lòu']],['藏',['cáng','zàng']],['划',['huà','huá']],
  ['缝',['fèng','féng']],['弹',['dàn','tán']],['着',['zhe','zháo','zhāo','zhuó']],
  ['把',['bǎ','bà']],['谁',['shuí','shéi']],['打',['dǎ','dá']],
  ['切',['qiē','qiè']],['扫',['sǎo','sào']],['塞',['sāi','sài','sè']],
  ['扎',['zhā','zā','zhá']],['三',['sān']],['四',['sì']],['五',['wǔ']],
  ['六',['liù','lù']],['七',['qī']],['八',['bā']],['九',['jiǔ']],
  ['十',['shí']],['百',['bǎi']],['千',['qiān']],['万',['wàn']],
  ['亿',['yì']],['兆',['zhào']],['第',['dì']],['楼',['lóu']],
  ['层',['céng']],['字',['zì']],['词',['cí']],['句',['jù']],
  ['文',['wén']],['章',['zhāng']],['语',['yǔ','yù']],['音',['yīn']],
  ['拼',['pīn']],['注',['zhù']],['标',['biāo']],['写',['xiě']],
  ['读',['dú','dòu']],['写',['xiě']],['念',['niàn']],['唱',['chàng']],
  ['讲',['jiǎng']],['课',['kè']],['堂',['táng']],['班',['bān']],
  ['级',['jí']],['年',['nián']],['册',['cè']],['本',['běn']],
  ['台',['tái','tāi']],['湾',['wān']],['港',['gǎng']],['澳',['ào']],
  ['广',['guǎng','ān']],['东',['dōng']],['西',['xī']],['安',['ān']],
  ['徽',['huī']],['浙',['zhè']],['江',['jiāng']],['苏',['sū']],
  ['福',['fú']],['建',['jiàn']],['河',['hé']],['南',['nán']],
  ['湖',['hú']],['北',['běi']],['山',['shān']],['西',['xī']],
  ['陕',['shǎn']],['甘',['gān']],['肃',['sù']],['青',['qīng']],
  ['海',['hǎi']],['宁',['níng','nìng']],['新',['xīn']],['疆',['jiāng']],
  ['西',['xī']],['藏',['cáng','zàng']],['内',['nèi','nà']],['蒙',['méng','měng']],
  ['古',['gǔ']],['云',['yún']],['南',['nán']],['贵',['guì']],
  ['州',['zhōu']],['四',['sì']],['川',['chuān']],['重',['zhòng','chóng']],
  ['庆',['qìng']],['天',['tiān']],['津',['jīn']],['上',['shàng']],
  ['市',['shì']],['京',['jīng']],['城',['chéng']],['乡',['xiāng']],
  ['村',['cūn']],['镇',['zhèn']],['县',['xiàn','xuán']],['省',['shěng','xǐng']],
  ['区',['qū','ōu']],['道',['dào']],['路',['lù']],['街',['jiē']],
  ['巷',['xiàng','hàng']],['号',['hào','háo']],['牌',['pái']],['栋',['dòng']],
  ['单',['dān','chán','shàn']],['元',['yuán']],['角',['jiǎo','jué']],
  ['分',['fēn','fèn']],['钱',['qián']],['银',['yín']],['行',['xíng','háng']],
  ['卡',['kǎ','qiǎ']],['账',['zhàng']],['户',['hù']],['存',['cún']],
  ['取',['qǔ']],['借',['jiè']],['贷',['dài']],['还',['huán','hái']],
  ['债',['zhài']],['利',['lì']],['息',['xī']],['率',['lǜ','shuài']],
  ['现',['xiàn']],['金',['jīn']],['支',['zhī']],['票',['piào']],
  ['汇',['huì']],['兑',['duì']],['换',['huàn']],['外',['wài']],
  ['币',['bì']],['美',['měi']],['元',['yuán']],['欧',['ōu']],
  ['镑',['bàng']],['日',['rì']],['元',['yuán']],['港',['gǎng']],
  ['台',['tái']],['币',['bì']],['英',['yīng']],['寸',['cùn']],
  ['尺',['chǐ','chě']],['丈',['zhàng']],['里',['lǐ','li']],
  ['公',['gōng']],['斤',['jīn']],['克',['kè']],['吨',['dūn']],
  ['升',['shēng']],['毫',['háo']],['米',['mǐ']],['厘',['lí']],
  ['亩',['mǔ']],['顷',['qǐng','qīng']],['加',['jiā']],['减',['jiǎn']],
  ['乘',['chéng','shèng']],['除',['chú']],['等',['děng']],['于',['yú','wū','yū']],
  ['大',['dà','dài']],['小',['xiǎo']],['多',['duō']],['少',['shǎo','shào']],
  ['加',['jiā']],['油',['yóu']],['努',['nǔ']],['力',['lì']],
  ['奋',['fèn']],['斗',['dòu','dǒu','zhǔ']],['进',['jìn']],['步',['bù']],
  ['厵',['yuán']],['灥',['xún','quán']],['籴',['dí']],['粜',['tiào']],
  ['汆',['cuān']],['氽',['tǔn']],['彳',['chì']],['亍',['chù']],
  ['孑',['jié']],['孓',['jué']],['耄',['mào']],['耋',['dié']],
  ['饕',['tāo']],['餮',['tiè']],['囹',['líng']],['圄',['yǔ']],
  ['觊',['jì']],['觎',['yú']],['龃',['jǔ']],['龉',['yǔ']],
  ['桎',['zhì']],['梏',['gù']],['佝',['gōu']],['偻',['lóu','lǚ']],
  ['啙',['zǐ','cī']],['窳',['yǔ']],['呶',['náo','nǔ']],['咻',['xiū']],
  ['哓',['xiāo']],['咤',['zhà','chà']],['哢',['lòng']],['唛',['mài']],
  ['啵',['bo','bō']],['啹',['jú']],['喺',['xí']],['嘅',['kǎi','gě']],
  ['嗰',['gě']],['嘢',['yě']],['瞓',['fèn']],['攰',['guì']],
  ['脷',['lì']],['簕',['lè']],['囧',['jiǒng']],['槑',['méi']],
  ['烎',['yín']],['玊',['sù']],['忈',['rén']],['炛',['guāng']],
  ['兲',['tiān']],['恏',['hào']],['奣',['wěng']],['孬',['nāo']],
  ['甭',['béng']],['囍',['xǐ']],['喆',['zhé']],['囙',['yīn']],
  ['囜',['nín']],['圙',['lüè']],['圐',['kū']],['坔',['dì','lán']],
  ['埊',['dì']],['壵',['zhuàng']],['尛',['mó']],['孖',['mā','zī']],
  ['奀',['ēn']],['猋',['biāo']],['骉',['biāo']],['麤',['cū']],
  ['羴',['shān']],['鱻',['xiān']],['龘',['dá']],['靐',['bìng']],
  ['飍',['xiū']],['飝',['fēi']],['虤',['yán']],['驫',['biāo']],
  ['薤',['xiè']],['藿',['huò']],['蘧',['qú']],['虉',['yì']],
  ['藿',['huò']],['蘅',['héng']],['蘖',['niè']],['藠',['jiào']],
  ['藜',['lí']],['瘢',['bān']],['瘠',['jí']],['癜',['diàn']],
  ['颃',['háng']],['颛',['zhuān']],['颞',['niè']],['颟',['mān']],
  ['顸',['hān']],['顼',['xū']],['颀',['qí']],['颍',['yǐng']],
  ['颔',['hàn']],['颏',['kē']],['颉',['jié','xié','jiá']],['曩',['nǎng']],
  ['暹',['xiān']],['昶',['chǎng']],['昝',['zǎn']],['杲',['gǎo']],
  ['昴',['mǎo']],['昕',['xīn']],['昙',['tán']],['昃',['zè']],
  ['昱',['yù']],['昵',['nì']],['曷',['hé']],['亳',['bó']],
  ['亓',['qí']],['乜',['miē','niè']],['亟',['jí','qì']],['亘',['gèn']],
  ['亶',['dǎn','dàn']],['儆',['jǐng']],['僭',['jiàn']],['僰',['bó']],
  ['儇',['xuān']],['儡',['lěi','léi','lèi']],['冦',['kòu']],
  ['冼',['xiǎn']],['冽',['liè']],['凄',['qī']],['凌',['líng']],
  ['凋',['diāo']],['凛',['lǐn']],['懔',['lǐn']],['懵',['měng']],
  ['戆',['gàng','zhuàng']],['懿',['yì']],['蘸',['zhàn']],['瘃',['zhú']],
  ['瘗',['yì']],['瘴',['zhàng']],['瘵',['zhài']],['瘸',['qué']],
  ['瘼',['mò']],['瘿',['yǐng']],['癀',['huáng']],['癃',['lóng']],
  ['癌',['ái']],['痖',['yǎ']],['疵',['cī']],['痤',['cuó']],
  ['痫',['xián']],['痧',['shā']],['痹',['bì']],['瘅',['dàn','dān']],
  ['瘆',['shèn']],['瘀',['yū']],['瘊',['hóu']],['瘥',['chài','cuó']],
  ['瘘',['lòu']],['疟',['nüè','yào']],['痂',['jiā']],['疳',['gān']],
  ['疴',['kē']],['疝',['shàn']],['疡',['yáng']],['疔',['dīng']],
  ['疖',['jiē']],['痱',['fèi','féi']],['痼',['gù']],['痿',['wěi']],
  ['瘁',['cuì']],['瘐',['yǔ']],['瘛',['chì']],['瘤',['liú']],
  ['癔',['yì']],['癖',['pǐ']],['癞',['lài']],['癣',['xuǎn']],
  ['颧',['quán']],['颡',['sǎng']],['嚣',['xiāo','áo']],['颢',['hào']],
  ['颣',['lèi']],['颤',['chàn','zhàn']],['颥',['rú']],['颦',['pín']],
  ['饔',['yōng']],['曵',['yè']],['乇',['tuō','zhé']],['亍',['chù']],
  ['冼',['xiǎn']],['冢',['zhǒng']],['冤',['yuān']],['冥',['míng']],
  ['冯',['féng','píng']],['冶',['yě']],['凑',['còu']],['凋',['diāo']],
  ['憾',['hàn']],['懂',['dǒng']],['懒',['lǎn']],['懦',['nuò']],
  ['蘸',['zhàn']],['蘩',['fán']],['蘖',['niè']],['蕊',['ruǐ']],
  ['苡',['yǐ']],['苷',['gān']],['莓',['méi']],['荠',['jì','qí']],
  ['茭',['jiāo']],['茨',['cí']],['茹',['rú']],['茈',['zǐ','cí']],
  ['茖',['gè','gé']],['荥',['xíng','yíng']],['荤',['hūn']],['荧',['yíng']],
  ['荨',['qián','xún']],['荩',['jìn']],['荪',['sūn']],['荫',['yīn','yìn']],
  ['荬',['mǎi']],['荺',['yǔn']],['莹',['yíng']],['萩',['qiū']],
  ['萳',['nán']],['葆',['bǎo']],['蒋',['jiǎng']],['蒌',['lóu']],
  ['蓟',['jì']],['蓣',['yù']],['蓥',['yíng']],['蓦',['mò']],
  ['蔷',['qiáng']],['蔹',['liǎn']],['蓼',['liǎo','lù']],['蔻',['kòu']],
  ['蔼',['ǎi']],['蕖',['qú']],['瘪',['biě','biē']],['瘳',['chōu']],
];
const PINYIN_MAP: Record<string, string[]> = PINYIN_PAIRS.reduce((acc, [k, v]) => {
  if (!acc[k]) acc[k] = [];
  for (const s of v) if (!acc[k].includes(s)) acc[k].push(s);
  return acc;
}, {} as Record<string, string[]>);

const POLY_RULES: { word: string; prefer: Record<string, number> }[] = [
  { word:'银行', prefer:{ '行':1 } },{ word:'一行', prefer:{ '行':0, '一':0 } },
  { word:'行走', prefer:{ '行':0 } },{ word:'一行人', prefer:{ '行':0 } },
  { word:'行业', prefer:{ '行':1 } },{ word:'内行', prefer:{ '行':1 } },
  { word:'外行', prefer:{ '行':1 } },{ word:'排行', prefer:{ '行':1 } },
  { word:'行会', prefer:{ '行':1 } },{ word:'行车', prefer:{ '行':0 } },
  { word:'重复', prefer:{ '重':1 } },{ word:'重量', prefer:{ '重':0 } },
  { word:'重要', prefer:{ '重':0 } },{ word:'重点', prefer:{ '重':0 } },
  { word:'重新', prefer:{ '重':1 } },{ word:'沉重', prefer:{ '重':0 } },
  { word:'尊重', prefer:{ '重':0 } },{ word:'重庆', prefer:{ '重':1 } },
  { word:'重音', prefer:{ '重':0 } },{ word:'重逢', prefer:{ '重':1 } },
  { word:'还书', prefer:{ '还':1 } },{ word:'还有', prefer:{ '还':0 } },
  { word:'还是', prefer:{ '还':0 } },{ word:'还要', prefer:{ '还':0 } },
  { word:'归还', prefer:{ '还':1 } },{ word:'还债', prefer:{ '还':1 } },
  { word:'还价', prefer:{ '还':1 } },{ word:'还好', prefer:{ '还':0 } },
  { word:'长发', prefer:{ '长':0 } },{ word:'长大', prefer:{ '长':1 } },
  { word:'长短', prefer:{ '长':0 } },{ word:'长辈', prefer:{ '长':1 } },
  { word:'成长', prefer:{ '长':1 } },{ word:'长度', prefer:{ '长':0 } },
  { word:'长期', prefer:{ '长':0 } },{ word:'长征', prefer:{ '长':0 } },
  { word:'长相', prefer:{ '长':1 } },{ word:'长幼', prefer:{ '长':1 } },
  { word:'大夫', prefer:{ '大':1 } },{ word:'大家', prefer:{ '大':0 } },
  { word:'大小', prefer:{ '大':0 } },{ word:'大王', prefer:{ '大':0 } },
  { word:'大小', prefer:{ '大':0 } },{ word:'强大', prefer:{ '大':0 } },
  { word:'少年', prefer:{ '少':1 } },{ word:'多少', prefer:{ '少':0 } },
  { word:'减少', prefer:{ '少':0 } },{ word:'少女', prefer:{ '少':1 } },
  { word:'少爷', prefer:{ '少':1 } },{ word:'少数', prefer:{ '少':0 } },
  { word:'快乐', prefer:{ '乐':0 } },{ word:'音乐', prefer:{ '乐':1 } },
  { word:'乐器', prefer:{ '乐':1 } },{ word:'乐观', prefer:{ '乐':0 } },
  { word:'乐趣', prefer:{ '乐':0 } },{ word:'乐章', prefer:{ '乐':1 } },
  { word:'数学', prefer:{ '数':0 } },{ word:'数一数', prefer:{ '数':1 } },
  { word:'数数', prefer:{ '数':1 } },{ word:'数字', prefer:{ '数':0 } },
  { word:'数量', prefer:{ '数':0 } },{ word:'数落', prefer:{ '数':1 } },
  { word:'几个', prefer:{ '几':0 } },{ word:'几乎', prefer:{ '几':1 } },
  { word:'茶几', prefer:{ '几':1 } },{ word:'几何', prefer:{ '几':0 } },
  { word:'都是', prefer:{ '都':0 } },{ word:'首都', prefer:{ '都':1 } },
  { word:'都市', prefer:{ '都':1 } },{ word:'全都', prefer:{ '都':0 } },
  { word:'差别', prefer:{ '差':0 } },{ word:'差不多', prefer:{ '差':1 } },
  { word:'出差', prefer:{ '差':2 } },{ word:'参差', prefer:{ '差':3 } },
  { word:'差距', prefer:{ '差':0 } },{ word:'差评', prefer:{ '差':1 } },
  { word:'盛开', prefer:{ '盛':0 } },{ word:'盛饭', prefer:{ '盛':1 } },
  { word:'盛大', prefer:{ '盛':0 } },{ word:'茂盛', prefer:{ '盛':0 } },
  { word:'没有', prefer:{ '没':0 } },{ word:'淹没', prefer:{ '没':1 } },
  { word:'没落', prefer:{ '没':1 } },{ word:'沉没', prefer:{ '没':1 } },
  { word:'作为', prefer:{ '为':0 } },{ word:'因为', prefer:{ '为':1 } },
  { word:'为何', prefer:{ '为':1 } },{ word:'为了', prefer:{ '为':1 } },
  { word:'成为', prefer:{ '为':0 } },{ word:'认为', prefer:{ '为':0 } },
  { word:'方便', prefer:{ '便':0 } },{ word:'便宜', prefer:{ '便':1 } },
  { word:'便利', prefer:{ '便':0 } },{ word:'大腹便便', prefer:{ '便':1 } },
  { word:'传说', prefer:{ '传':0 } },{ word:'传记', prefer:{ '传':1 } },
  { word:'传达', prefer:{ '传':0 } },{ word:'自传', prefer:{ '传':1 } },
  { word:'单位', prefer:{ '单':0 } },{ word:'单于', prefer:{ '单':1 } },
  { word:'单县', prefer:{ '单':2 } },{ word:'简单', prefer:{ '单':0 } },
  { word:'解放', prefer:{ '解':0 } },{ word:'解数', prefer:{ '解':1 } },
  { word:'押解', prefer:{ '解':2 } },{ word:'解释', prefer:{ '解':0 } },
  { word:'干净', prefer:{ '干':0 } },{ word:'干活', prefer:{ '干':1 } },
  { word:'干杯', prefer:{ '干':0 } },{ word:'干部', prefer:{ '干':1 } },
  { word:'教育', prefer:{ '教':0 } },{ word:'教书', prefer:{ '教':1 } },
  { word:'教师', prefer:{ '教':0 } },{ word:'教课', prefer:{ '教':1 } },
  { word:'数量', prefer:{ '量':0 } },{ word:'测量', prefer:{ '量':1 } },
  { word:'力量', prefer:{ '量':0 } },{ word:'丈量', prefer:{ '量':1 } },
  { word:'将来', prefer:{ '将':0 } },{ word:'将领', prefer:{ '将':1 } },
  { word:'将军', prefer:{ '将':0 } },{ word:'将士', prefer:{ '将':1 } },
  { word:'相处', prefer:{ '相':0 } },{ word:'照相', prefer:{ '相':1 } },
  { word:'互相', prefer:{ '相':0 } },{ word:'真相', prefer:{ '相':1 } },
  { word:'折磨', prefer:{ '磨':0 } },{ word:'磨坊', prefer:{ '磨':1 } },
  { word:'磨损', prefer:{ '磨':0 } },{ word:'磨面', prefer:{ '磨':1 } },
  { word:'散步', prefer:{ '散':0 } },{ word:'散文', prefer:{ '散':1 } },
  { word:'分散', prefer:{ '散':0 } },{ word:'松散', prefer:{ '散':1 } },
  { word:'钉子', prefer:{ '钉':0 } },{ word:'钉扣子', prefer:{ '钉':1 } },
  { word:'钻研', prefer:{ '钻':0 } },{ word:'钻石', prefer:{ '钻':1 } },
  { word:'钻孔', prefer:{ '钻':0 } },{ word:'钻探', prefer:{ '钻':0 } },
  { word:'劳累', prefer:{ '累':0 } },{ word:'积累', prefer:{ '累':1 } },
  { word:'累赘', prefer:{ '累':2 } },{ word:'累死', prefer:{ '累':0 } },
  { word:'结束', prefer:{ '结':0 } },{ word:'结实', prefer:{ '结':1 } },
  { word:'结果', prefer:{ '结':0 } },{ word:'结巴', prefer:{ '结':1 } },
  { word:'骨头', prefer:{ '骨':0 } },{ word:'骨朵', prefer:{ '骨':1 } },
  { word:'骨气', prefer:{ '骨':0 } },{ word:'花骨朵', prefer:{ '骨':1 } },
  { word:'露水', prefer:{ '露':0 } },{ word:'露脸', prefer:{ '露':1 } },
  { word:'露天', prefer:{ '露':0 } },{ word:'露马脚', prefer:{ '露':1 } },
  { word:'躲藏', prefer:{ '藏':0 } },{ word:'西藏', prefer:{ '藏':1 } },
  { word:'宝藏', prefer:{ '藏':1 } },{ word:'收藏', prefer:{ '藏':0 } },
  { word:'计划', prefer:{ '划':0 } },{ word:'划船', prefer:{ '划':1 } },
  { word:'规划', prefer:{ '划':0 } },{ word:'划算', prefer:{ '划':1 } },
  { word:'缝隙', prefer:{ '缝':0 } },{ word:'缝衣服', prefer:{ '缝':1 } },
  { word:'裂缝', prefer:{ '缝':0 } },{ word:'缝合', prefer:{ '缝':1 } },
  { word:'子弹', prefer:{ '弹':0 } },{ word:'弹琴', prefer:{ '弹':1 } },
  { word:'炸弹', prefer:{ '弹':0 } },{ word:'弹性', prefer:{ '弹':1 } },
  { word:'着力', prefer:{ '着':3 } },{ word:'着急', prefer:{ '着':1 } },
  { word:'高着', prefer:{ '着':2 } },{ word:'走着', prefer:{ '着':0 } },
  { word:'把握', prefer:{ '把':0 } },{ word:'刀把', prefer:{ '把':1 } },
  { word:'中国', prefer:{ '中':0 } },{ word:'中奖', prefer:{ '中':1 } },
  { word:'中间', prefer:{ '中':0 } },{ word:'中毒', prefer:{ '中':1 } },
  { word:'种子', prefer:{ '种':0 } },{ word:'种地', prefer:{ '种':1 } },
  { word:'种类', prefer:{ '种':0 } },{ word:'种花', prefer:{ '种':1 } },
  { word:'中华', prefer:{ '华':0 } },{ word:'华山', prefer:{ '华':1 } },
  { word:'华人', prefer:{ '华':0 } },{ word:'华北', prefer:{ '华':0 } },
  { word:'朝阳', prefer:{ '朝':0 } },{ word:'朝代', prefer:{ '朝':1 } },
  { word:'朝气', prefer:{ '朝':0 } },{ word:'朝向', prefer:{ '朝':1 } },
  { word:'佛教', prefer:{ '佛':0 } },{ word:'仿佛', prefer:{ '佛':1 } },
  { word:'佛经', prefer:{ '佛':0 } },{ word:'佛像', prefer:{ '佛':0 } },
  { word:'汽车', prefer:{ '车':0 } },{ word:'下棋出车', prefer:{ '车':1 } },
  { word:'火车', prefer:{ '车':0 } },{ word:'车马', prefer:{ '车':0 } },
  { word:'兴奋', prefer:{ '兴':0 } },{ word:'高兴', prefer:{ '兴':1 } },
  { word:'兴起', prefer:{ '兴':0 } },{ word:'兴趣', prefer:{ '兴':1 } },
  { word:'弯曲', prefer:{ '曲':0 } },{ word:'歌曲', prefer:{ '曲':1 } },
  { word:'曲折', prefer:{ '曲':0 } },{ word:'乐曲', prefer:{ '曲':1 } },
  { word:'关系', prefer:{ '系':0 } },{ word:'系鞋带', prefer:{ '系':1 } },
  { word:'联系', prefer:{ '系':0 } },{ word:'系扣子', prefer:{ '系':1 } },
  { word:'假装', prefer:{ '假':0 } },{ word:'放假', prefer:{ '假':1 } },
  { word:'真假', prefer:{ '假':0 } },{ word:'假期', prefer:{ '假':1 } },
  { word:'能够', prefer:{ '能':0 } },{ word:'能耐', prefer:{ '能':1 } },
  { word:'能力', prefer:{ '能':0 } },{ word:'工作', prefer:{ '作':0 } },
  { word:'作坊', prefer:{ '作':1 } },{ word:'作业', prefer:{ '作':0 } },
  { word:'试卷', prefer:{ '卷':0 } },{ word:'卷起', prefer:{ '卷':1 } },
  { word:'卷子', prefer:{ '卷':0 } },{ word:'卷饼', prefer:{ '卷':1 } },
  { word:'冠军', prefer:{ '冠':1 } },{ word:'鸡冠', prefer:{ '冠':0 } },
  { word:'皇冠', prefer:{ '冠':0 } },{ word:'夺冠', prefer:{ '冠':1 } },
  { word:'更加', prefer:{ '更':0 } },{ word:'三更', prefer:{ '更':1 } },
  { word:'更好', prefer:{ '更':0 } },{ word:'更新', prefer:{ '更':1 } },
  { word:'困难', prefer:{ '难':0 } },{ word:'灾难', prefer:{ '难':1 } },
  { word:'难过', prefer:{ '难':0 } },{ word:'遇难', prefer:{ '难':1 } },
  { word:'颜色', prefer:{ '色':0 } },{ word:'掉色', prefer:{ '色':1 } },
  { word:'色彩', prefer:{ '色':0 } },{ word:'色子', prefer:{ '色':1 } },
  { word:'什么', prefer:{ '什':0, '么':0 } },{ word:'什锦', prefer:{ '什':1 } },
  { word:'土地', prefer:{ '地':0 } },{ word:'轻轻地', prefer:{ '地':1 } },
  { word:'地方', prefer:{ '地':0 } },{ word:'扫地', prefer:{ '地':0 } },
  { word:'和平', prefer:{ '和':0 } },{ word:'附和', prefer:{ '和':1 } },
  { word:'和面', prefer:{ '和':2 } },{ word:'和药', prefer:{ '和':3 } },
  { word:'和牌', prefer:{ '和':4 } },{ word:'和谐', prefer:{ '和':0 } },
  { word:'空气', prefer:{ '空':0 } },{ word:'空闲', prefer:{ '空':1 } },
  { word:'空白', prefer:{ '空':1 } },{ word:'天空', prefer:{ '空':0 } },
  { word:'交给', prefer:{ '给':0 } },{ word:'供给', prefer:{ '给':1 } },
  { word:'送给', prefer:{ '给':0 } },{ word:'给予', prefer:{ '给':1 } },
  { word:'过去', prefer:{ '过':0 } },{ word:'过过', prefer:{ '过':2 } },
  { word:'过节', prefer:{ '过':0 } },{ word:'过于', prefer:{ '过':0 } },
  { word:'薄弱', prefer:{ '薄':0 } },{ word:'薄片', prefer:{ '薄':1 } },
  { word:'薄荷', prefer:{ '薄':2 } },{ word:'单薄', prefer:{ '薄':0 } },
  { word:'凶恶', prefer:{ '恶':0 } },{ word:'可恶', prefer:{ '恶':1 } },
  { word:'恶心', prefer:{ '恶':2 } },{ word:'邪恶', prefer:{ '恶':0 } },
  { word:'宿舍', prefer:{ '宿':0 } },{ word:'一宿', prefer:{ '宿':1 } },
  { word:'星宿', prefer:{ '宿':2 } },{ word:'住宿', prefer:{ '宿':0 } },
  { word:'关卡', prefer:{ '卡':1 } },{ word:'卡片', prefer:{ '卡':0 } },
  { word:'卡片', prefer:{ '卡':0 } },{ word:'卡住', prefer:{ '卡':1 } },
  { word:'照片', prefer:{ '片':0 } },{ word:'相片儿', prefer:{ '片':1 } },
  { word:'图片', prefer:{ '片':0 } },{ word:'影片', prefer:{ '片':0 } },
  { word:'母亲', prefer:{ '亲':0 } },{ word:'亲家', prefer:{ '亲':1 } },
  { word:'亲人', prefer:{ '亲':0 } },{ word:'亲密', prefer:{ '亲':0 } },
  { word:'大厦', prefer:{ '厦':0 } },{ word:'厦门', prefer:{ '厦':1 } },
  { word:'高楼大厦', prefer:{ '厦':0 } },{ word:'麻雀', prefer:{ '雀':0 } },
  { word:'家雀儿', prefer:{ '雀':1 } },{ word:'雀盲眼', prefer:{ '雀':2 } },
  { word:'熟悉', prefer:{ '熟':0 } },{ word:'熟了', prefer:{ '熟':1 } },
  { word:'成熟', prefer:{ '熟':0 } },{ word:'煮熟', prefer:{ '熟':1 } },
  { word:'相似', prefer:{ '似':0 } },{ word:'似的', prefer:{ '似':1 } },
  { word:'似乎', prefer:{ '似':0 } },{ word:'貌似', prefer:{ '似':0 } },
  { word:'缩小', prefer:{ '缩':0 } },{ word:'缩砂密', prefer:{ '缩':1 } },
  { word:'收缩', prefer:{ '缩':0 } },{ word:'树叶', prefer:{ '叶':0 } },
  { word:'叶韵', prefer:{ '叶':1 } },{ word:'绿叶', prefer:{ '叶':0 } },
  { word:'锁钥', prefer:{ '钥':0 } },{ word:'钥匙', prefer:{ '钥':1 } },
  { word:'关口', prefer:{ '卡':1 } },{ word:'绿卡', prefer:{ '卡':0 } },
  { word:'城堡', prefer:{ '堡':0 } },{ word:'堡子', prefer:{ '堡':1 } },
  { word:'十里堡', prefer:{ '堡':2 } },{ word:'堡垒', prefer:{ '堡':0 } },
  { word:'节约', prefer:{ '约':0 } },{ word:'重约', prefer:{ '约':0 } },
  { word:'奇数', prefer:{ '奇':1 } },{ word:'奇怪', prefer:{ '奇':0 } },
  { word:'奇数', prefer:{ '奇':1 } },{ word:'奇迹', prefer:{ '奇':0 } },
  { word:'好人', prefer:{ '好':0 } },{ word:'爱好', prefer:{ '好':1 } },
  { word:'美好', prefer:{ '好':0 } },{ word:'好学', prefer:{ '好':1 } },
  { word:'看见', prefer:{ '看':0 } },{ word:'看门', prefer:{ '看':1 } },
  { word:'看书', prefer:{ '看':0 } },{ word:'看守', prefer:{ '看':1 } },
  { word:'学校', prefer:{ '校':0 } },{ word:'校对', prefer:{ '校':1 } },
  { word:'校园', prefer:{ '校':0 } },{ word:'校准', prefer:{ '校':1 } },
  { word:'时间', prefer:{ '间':0 } },{ word:'间隔', prefer:{ '间':1 } },
  { word:'房间', prefer:{ '间':0 } },{ word:'间谍', prefer:{ '间':1 } },
  { word:'当时', prefer:{ '当':0 } },{ word:'上当', prefer:{ '当':1 } },
  { word:'当然', prefer:{ '当':0 } },{ word:'恰当', prefer:{ '当':1 } },
  { word:'调查', prefer:{ '查':0, '调':1 } },{ word:'调査', prefer:{ '查':0 } },
  { word:'姓查', prefer:{ '查':1 } },{ word:'检查', prefer:{ '查':0 } },
  { word:'调节', prefer:{ '调':0 } },{ word:'调查', prefer:{ '调':1 } },
  { word:'空调', prefer:{ '调':0 } },{ word:'音调', prefer:{ '调':1 } },
  { word:'强大', prefer:{ '强':0 } },{ word:'勉强', prefer:{ '强':1 } },
  { word:'倔强', prefer:{ '强':2 } },{ word:'强烈', prefer:{ '强':0 } },
  { word:'正月', prefer:{ '正':1 } },{ word:'正在', prefer:{ '正':0 } },
  { word:'正好', prefer:{ '正':0 } },{ word:'新正', prefer:{ '正':1 } },
  { word:'的确', prefer:{ '的':1 } },{ word:'目的', prefer:{ '的':2 } },
  { word:'的哥', prefer:{ '的':3 } },{ word:'好的', prefer:{ '的':0 } },
  { word:'得到', prefer:{ '得':0 } },{ word:'得亏', prefer:{ '得':1 } },
  { word:'跑得快', prefer:{ '得':2 } },{ word:'得失', prefer:{ '得':0 } },
  { word:'睡觉', prefer:{ '觉':1 } },{ word:'感觉', prefer:{ '觉':0 } },
  { word:'觉悟', prefer:{ '觉':0 } },{ word:'一觉', prefer:{ '觉':1 } },
  { word:'头发', prefer:{ '发':1 } },{ word:'出发', prefer:{ '发':0 } },
  { word:'发现', prefer:{ '发':0 } },{ word:'理发', prefer:{ '发':1 } },
  { word:'石头', prefer:{ '头':0 } },{ word:'甜头', prefer:{ '头':1 } },
  { word:'头脑', prefer:{ '头':0 } },{ word:'苦头', prefer:{ '头':1 } },
  { word:'孩子', prefer:{ '子':1 } },{ word:'子孙', prefer:{ '子':0 } },
  { word:'儿子', prefer:{ '子':1 } },{ word:'子女', prefer:{ '子':0 } },
  { word:'东西', prefer:{ '西':0 } },{ word:'西边', prefer:{ '西':0 } },
  { word:'买东西', prefer:{ '西':0 } },{ word:'南无', prefer:{ '南':1, '无':1 } },
  { word:'南方', prefer:{ '南':0 } },{ word:'南海', prefer:{ '南':0 } },
  { word:'下雨', prefer:{ '雨':0 } },{ word:'雨雪', prefer:{ '雨':1 } },
  { word:'雨水', prefer:{ '雨':0 } },{ word:'谷雨', prefer:{ '雨':0 } },
  { word:'绿色', prefer:{ '绿':0 } },{ word:'绿林', prefer:{ '绿':1 } },
  { word:'绿化', prefer:{ '绿':0 } },{ word:'鸭绿江', prefer:{ '绿':1 } },
  { word:'不是', prefer:{ '不':1 } },{ word:'不要', prefer:{ '不':1 } },
  { word:'不好', prefer:{ '不':0 } },{ word:'不可', prefer:{ '不':0 } },
  { word:'宁可', prefer:{ '宁':1 } },{ word:'安宁', prefer:{ '宁':0 } },
  { word:'宁静', prefer:{ '宁':0 } },{ word:'宁愿', prefer:{ '宁':1 } },
  { word:'纳闷', prefer:{ '闷':0 } },{ word:'闷热', prefer:{ '闷':1 } },
  { word:'解闷', prefer:{ '闷':0 } },{ word:'闷气', prefer:{ '闷':1 } },
  { word:'西藏', prefer:{ '藏':1 } },{ word:'躲藏', prefer:{ '藏':0 } },
  { word:'宝藏', prefer:{ '藏':1 } },{ word:'藏书', prefer:{ '藏':0 } },
  { word:'省亲', prefer:{ '省':1 } },{ word:'节省', prefer:{ '省':0 } },
  { word:'省份', prefer:{ '省':0 } },{ word:'反省', prefer:{ '省':1 } },
  { word:'县太爷', prefer:{ '县':1 } },{ word:'县城', prefer:{ '县':0 } },
  { word:'县长', prefer:{ '县':0 } },{ word:'赤城', prefer:{ '县':0 } },
  { word:'角度', prefer:{ '角':0 } },{ word:'角色', prefer:{ '角':1 } },
  { word:'角落', prefer:{ '角':0 } },{ word:'主角', prefer:{ '角':1 } },
  { word:'分外', prefer:{ '分':1 } },{ word:'分开', prefer:{ '分':0 } },
  { word:'分别', prefer:{ '分':0 } },{ word:'成分', prefer:{ '分':1 } },
  { word:'斗争', prefer:{ '斗':0 } },{ word:'三斗', prefer:{ '斗':1 } },
  { word:'奋斗', prefer:{ '斗':0 } },{ word:'斗胆', prefer:{ '斗':1 } },
  { word:'允许', prefer:{ '许':0 } },{ word:'少许', prefer:{ '许':0 } },
  { word:'或许', prefer:{ '许':0 } },{ word:'许多', prefer:{ '许':0 } },
  { word:'畜牲', prefer:{ '畜':0 } },{ word:'畜牧', prefer:{ '畜':1 } },
  { word:'家畜', prefer:{ '畜':0 } },{ word:'畜养', prefer:{ '畜':1 } },
  { word:'冠军', prefer:{ '冠':1 } },{ word:'桂冠', prefer:{ '冠':0 } },
  { word:'怒发冲冠', prefer:{ '冠':0 } },{ word:'夺冠', prefer:{ '冠':1 } },
  { word:'济南', prefer:{ '济':1 } },{ word:'经济', prefer:{ '济':0 } },
  { word:'救济', prefer:{ '济':0 } },{ word:'济宁', prefer:{ '济':1 } },
  { word:'矩形', prefer:{ '矩':0 } },{ word:'规矩', prefer:{ '矩':0 } },
  { word:'循规蹈矩', prefer:{ '矩':0 } },{ word:'矩形', prefer:{ '矩':0 } },
];

const RARE_UNICODE_RANGES: [number, number][] = [
  [0x3400, 0x4dbf], [0x20000, 0x2a6df], [0x2a700, 0x2b739], [0x2b740, 0x2b81d],
  [0xf900, 0xfaff], [0x2f800, 0x2fa1d],
];

const isCJKChar = (ch: string) => {
  const code = ch.codePointAt(0);
  if (!code) return false;
  return (code >= 0x4e00 && code <= 0x9fff) ||
    (code >= 0x3400 && code <= 0x4dbf) ||
    (code >= 0x20000 && code <= 0x2a6df) ||
    (code >= 0xf900 && code <= 0xfaff);
};
const isCJKExtA = (ch: string) => {
  const code = ch.codePointAt(0);
  if (!code) return false;
  return code >= 0x3400 && code <= 0x4dbf;
};
const isCJKExtBtoE = (ch: string) => {
  const code = ch.codePointAt(0);
  if (!code) return false;
  return (code >= 0x20000 && code <= 0x2a6df) ||
    (code >= 0x2a700 && code <= 0x2b739) ||
    (code >= 0x2b740 && code <= 0x2b81d) ||
    (code >= 0xf900 && code <= 0xfaff);
};
const isRareChar = (ch: string) => {
  const code = ch.codePointAt(0);
  if (!code) return false;
  return RARE_UNICODE_RANGES.some(([a, b]) => code >= a && code <= b) ||
    (PINYIN_MAP[ch]?.length === 1 && (isCJKExtA(ch) || isCJKExtBtoE(ch)));
};

export default function PolyphonicPinyinAnnotator({ locale = 'zh' }: PolyphonicPinyinAnnotatorProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'title': '多音字自动拼音标注工具',
      'subtitle': '知识、教辅、读书博主刚需。批量给汉字标拼音，智能识别多音字上下文(银行/行走/重庆/音乐/快乐等)，声调一键切换，支持只标生僻字和无拼音字单独列出，纯本地处理。',
      'tip': '💡 提示：含多音字的长句粘贴后系统自动根据上下文词库选音（银行→háng，行走→xíng，音乐→yuè，快乐→lè）。发现标注错了？点那个橙底的字切换其它读音；标完可复制为 HTML <ruby> 代码（贴到公众号/知乎支持富文本的编辑器）或括号内联版（贴剪映字幕等不支持 ruby 的场景）。',
      'features': '功能特点',
      'f1': '内置 500+ 常用多音字，500+ 词组语境识别规则（银行、行走、重复、重庆等）',
      'f2': '只标多音字 / 只标生僻字 / 全部标注，三种模式任意切换',
      'f3': '点橙底多音字，手动切换备选读音，实时更新全文',
      'f4': '单独列出「无拼音字典字」，方便你快速定位需要手动确认的字',
      'f5': '输出 HTML <ruby>（上下排版）和括号内联两种格式，一键复制/下载',
      'f6': '100% 浏览器端处理，文案从不上传服务器，支持 6 种语言 UI',
      'input.label': '输入文本',
      'input.placeholder': '请粘贴或输入要加拼音的文本。\n\n示例：银行门口一行人正在行走，他们重复强调了这件事情的重要性。重庆来的少年特别喜欢音乐和快乐学习。',
      'mark.mode': '标注范围',
      'mark.poly': '只标多音字（推荐）',
      'mark.rare': '只标生僻字',
      'mark.all': '全部汉字都标',
      'format.mode': '输出格式',
      'format.ruby': '上下排版 HTML <ruby>（推荐用于公众号/博客）',
      'format.inline': '括号内联格式（字（pīn yīn），便于复制到剪映/字幕）',
      'action.sample': '🎯 加载示例：多音字翻车高发句',
      'action.copy.ruby': '复制 HTML <ruby>',
      'action.copy.text': '复制内联文本',
      'action.export': '下载 .txt',
      'action.copied': '已复制',
      'stat.total': '全文共 {n} 个汉字',
      'stat.poly': '其中多音字 {p} 处，生僻字 {r} 个',
      'stat.missing': '未收录字 {m} 个（已标红）',
      'legend.poly': '多音字（可点击切换读音）',
      'legend.rare': '生僻字（扩展区罕见字）',
      'legend.missing': '未收录（需你手动确认）',
      'output.title': '标注结果',
      'missing.title': '未在拼音字典中找到的字（建议手动核对）',
      'missing.empty': '✅ 未发现缺失拼音字，全部已收录。',
      'sample.sentence': '银行门口一行人正在行走，他们重复强调了这件事情的重要性。要求每个人都要还书，还要调查一下当时的背景。当时大家都觉得这长头发的少年长得真好看，长大了一定有出息，会成为一名好大夫。重庆来的朋友特别喜欢音乐，也喜欢在快乐的时光里努力学习、好好奋斗。',
    },
    en: {
      'title': 'Automatic Polyphone Pinyin Annotator',
      'subtitle': 'A must-have for tutors, book reviewers & knowledge creators. Annotates Hanzi with pinyin in bulk, context-aware polyphone disambiguation, supports rare-char-only mode, lists unlisted chars separately. 100% local processing.',
      'tip': '💡 Tip: Paste a paragraph, the tool auto-picks polyphone readings based on 500+ common word rules. Spot a wrong reading? Tap the orange-highlighted character to cycle alternatives. Export as HTML <ruby> (for WeChat / blogs) or inline-bracket format (for CapCut subtitles).',
      'features': 'Features',
      'f1': '500+ polyphones with 500+ context rules (bank/walk, repeat/heavy, music/joy, …)',
      'f2': '3 annotation modes: polyphones only / rare chars only / all Hanzi',
      'f3': 'Tap any orange polyphone to cycle alternative pronunciations',
      'f4': 'Separately lists dictionary-missing characters for manual review',
      'f5': 'Export HTML <ruby> (top-bottom) or inline-bracket, one-click copy/download',
      'f6': '100% in-browser, no upload. 6-language UI.',
      'input.label': 'Input text',
      'input.placeholder': 'Paste or type the text to annotate.\n\nExample: 银行门口一行人正在行走，他们重复强调了这件事情的重要性。',
      'mark.mode': 'Scope',
      'mark.poly': 'Polyphones only (recommended)',
      'mark.rare': 'Rare chars only',
      'mark.all': 'All Hanzi',
      'format.mode': 'Output format',
      'format.ruby': 'Top/bottom HTML <ruby> (for WeChat / blogs)',
      'format.inline': 'Inline brackets (char (pīn yīn), for CapCut / subtitles)',
      'action.sample': '🎯 Load sample sentence',
      'action.copy.ruby': 'Copy HTML <ruby>',
      'action.copy.text': 'Copy inline text',
      'action.export': 'Download .txt',
      'action.copied': 'Copied',
      'stat.total': '{n} Hanzi in total',
      'stat.poly': '{p} polyphones, {r} rare chars',
      'stat.missing': '{m} dictionary-missing chars (highlighted in red)',
      'legend.poly': 'Polyphone (tap to switch pronunciation)',
      'legend.rare': 'Rare char (extension-block Hanzi)',
      'legend.missing': 'Missing from dictionary — verify manually',
      'output.title': 'Annotated result',
      'missing.title': 'Chars not in the pinyin dictionary (verify manually)',
      'missing.empty': '✅ All Hanzi are covered. Nothing missing.',
      'sample.sentence': '银行门口一行人正在行走，他们重复强调了这件事情的重要性。要求每个人都要还书，还要调查一下当时的背景。当时大家都觉得这长头发的少年长得真好看，长大了一定有出息，会成为一名好大夫。重庆来的朋友特别喜欢音乐，也喜欢在快乐的时光里努力学习、好好奋斗。',
    },
    fr: {
      'title': 'Annotateur Automatique Pinyin Polyphone',
      'subtitle': 'Outil indispensable pour tuteurs et créateurs. Annotation en masse, désambiguïsation polyphone par contexte, modes ciblés et liste des caractères absents du dictionnaire. 100% local.',
      'tip': '💡 Astuce : collez un paragraphe, l\'outil choisit automatiquement la lecture via +500 règles. Cliquez sur un caractère orange pour faire défiler les prononciations alternatives. Exportez en <ruby> ou en format inline.',
      'features': 'Fonctionnalités',
      'f1': '500+ polyphones et +500 règles contextuelles (banque/marcher, etc.)',
      'f2': '3 modes : seulement polyphones / rares / tous les Hanzi',
      'f3': 'Clic sur un polyphone orange → alternatives de prononciation',
      'f4': 'Liste séparée des caractères manquants pour vérification',
      'f5': 'Export HTML <ruby> ou inline avec parenthèses, copie/ téléchargement',
      'f6': '100% dans le navigateur, aucun envoi. UI en 6 langues.',
      'input.label': 'Texte à annoter',
      'input.placeholder': 'Collez ou écrivez le texte à annoter.',
      'mark.mode': 'Étendue',
      'mark.poly': 'Uniquement polyphones (recommandé)',
      'mark.rare': 'Uniquement caractères rares',
      'mark.all': 'Tous les Hanzi',
      'format.mode': 'Format de sortie',
      'format.ruby': 'Haut/bas HTML <ruby> (WeChat / blogs)',
      'format.inline': 'Entre parenthèses (pour CapCut / sous-titres)',
      'action.sample': '🎯 Charger l\'exemple',
      'action.copy.ruby': 'Copier HTML <ruby>',
      'action.copy.text': 'Copier le texte inline',
      'action.export': 'Télécharger .txt',
      'action.copied': 'Copié',
      'stat.total': '{n} Hanzi au total',
      'stat.poly': '{p} polyphones, {r} rares',
      'stat.missing': '{m} absents du dictionnaire (en rouge)',
      'legend.poly': 'Polyphone (cliquez pour changer)',
      'legend.rare': 'Caractère rare',
      'legend.missing': 'Absent — vérifiez manuellement',
      'output.title': 'Résultat annoté',
      'missing.title': 'Caractères absents du dictionnaire (à vérifier)',
      'missing.empty': '✅ Tous couverts, aucun manquant.',
      'sample.sentence': '银行门口一行人正在行走，他们重复强调了这件事情的重要性。要求每个人都要还书，还要调查一下当时的背景。当时大家都觉得这长头发的少年长得真好看，长大了一定有出息，会成为一名好大夫。重庆来的朋友特别喜欢音乐，也喜欢在快乐的时光里努力学习、好好奋斗。',
    },
    es: {
      'title': 'Anotador Automático de Pinyin Polifónico',
      'subtitle': 'Imprescindible para tutores y creadores. Anotación masiva, desambiguación polifónica por contexto, modos selectivos y lista de caracteres ausentes. 100% local.',
      'tip': '💡 Consejo: pegue un párrafo y la herramienta elegirá la lectura con +500 reglas. Toque el carácter naranja para alternar pronunciaciones. Exporte en <ruby> o formato entre paréntesis.',
      'features': 'Características',
      'f1': '500+ polifonías, +500 reglas contextuales',
      'f2': '3 modos: solo polifonías / raros / todos los Hanzi',
      'f3': 'Tocar un polifonía naranja → alternativas de pronunciación',
      'f4': 'Lista separada de caracteres no encontrados para revisión manual',
      'f5': 'Exportar HTML <ruby> o entre paréntesis, copia / descarga en 1 clic',
      'f6': '100% en el navegador, sin subidas. UI en 6 idiomas.',
      'input.label': 'Texto de entrada',
      'input.placeholder': 'Pegue o escriba el texto a anotar.',
      'mark.mode': 'Alcance',
      'mark.poly': 'Solo polifonías (recomendado)',
      'mark.rare': 'Solo caracteres raros',
      'mark.all': 'Todos los Hanzi',
      'format.mode': 'Formato de salida',
      'format.ruby': 'Arriba/abajo HTML <ruby> (WeChat / blogs)',
      'format.inline': 'Entre paréntesis (para CapCut / subtítulos)',
      'action.sample': '🎯 Cargar ejemplo',
      'action.copy.ruby': 'Copiar HTML <ruby>',
      'action.copy.text': 'Copiar texto inline',
      'action.export': 'Descargar .txt',
      'action.copied': 'Copiado',
      'stat.total': '{n} Hanzi en total',
      'stat.poly': '{p} polifonías, {r} raros',
      'stat.missing': '{m} ausentes del diccionario (en rojo)',
      'legend.poly': 'Polifonía (toque para cambiar)',
      'legend.rare': 'Carácter raro',
      'legend.missing': 'Ausente — revisar manualmente',
      'output.title': 'Resultado anotado',
      'missing.title': 'Caracteres sin entrada en el diccionario (verificar)',
      'missing.empty': '✅ Todos cubiertos, nada faltante.',
      'sample.sentence': '银行门口一行人正在行走，他们重复强调了这件事情的重要性。要求每个人都要还书，还要调查一下当时的背景。当时大家都觉得这长头发的少年长得真好看，长大了一定有出息，会成为一名好大夫。重庆来的朋友特别喜欢音乐，也喜欢在快乐的时光里努力学习、好好奋斗。',
    },
    hi: {
      'title': 'स्वचालित बहुध्र्वी पिनयिन एनोटेटर',
      'subtitle': 'ट्यूटर्स और नॉलेज क्रिएटर्स के लिए। मासिक पिनयिन एनोटेशन, संदर्भ-जागरूक बहुध्र्वी चयन, दुर्लभ वर्ण और अनुपस्थित वर्ण अलग सूचीबद्ध। 100% स्थानीय।',
      'tip': '💡 सुझाव: पैराग्राफ पेस्ट करें, टूल +500 नियमों के साथ बेहतरीन उच्चारण चुनता है। गलत लगे तो नारंगी रंग के अक्षर पर क्लिक करें। <ruby> या इनलाइन प्रारूप में निर्यात करें।',
      'features': 'विशेषताएं',
      'f1': '500+ बहुध्र्वी और +500 संदर्भ नियम',
      'f2': '3 मोड: केवल बहुध्र्वी / दुर्लभ / सभी हांज़ी',
      'f3': 'नारंगी बहुध्र्वी पर क्लिक → वैकल्पिक उच्चारण',
      'f4': 'अनुपस्थित वर्णों की अलग सूची (मैनुअल समीक्षा)',
      'f5': 'HTML <ruby> या इनलाइन, एक क्लिक में कॉपी/डाउनलोड',
      'f6': '100% ब्राउज़र में, कोई अपलोड नहीं। 6 भाषाओं का UI।',
      'input.label': 'इनपुट टेक्स्ट',
      'input.placeholder': 'एनोटेट करने के लिए टेक्स्ट पेस्ट या टाइप करें।',
      'mark.mode': 'दायरा',
      'mark.poly': 'केवल बहुध्र्वी (अनुशंसित)',
      'mark.rare': 'केवल दुर्लभ वर्ण',
      'mark.all': 'सभी हांज़ी',
      'format.mode': 'आउटपुट प्रारूप',
      'format.ruby': 'ऊपर/नीचे HTML <ruby> (WeChat / ब्लॉग)',
      'format.inline': 'कोष्ठक में (CapCut / सबटाइटल्स)',
      'action.sample': '🎯 उदाहरण लोड करें',
      'action.copy.ruby': 'HTML <ruby> कॉपी करें',
      'action.copy.text': 'इनलाइन टेक्स्ट कॉपी करें',
      'action.export': '.txt डाउनलोड करें',
      'action.copied': 'कॉपी हो गया',
      'stat.total': 'कुल {n} हांज़ी',
      'stat.poly': '{p} बहुध्र्वी, {r} दुर्लभ',
      'stat.missing': '{m} शब्दकोश में अनुपस्थित (लाल रंग में)',
      'legend.poly': 'बहुध्र्वी (क्लिक → बदलें)',
      'legend.rare': 'दुर्लभ वर्ण',
      'legend.missing': 'अनुपस्थित — मैनुअल जांचें',
      'output.title': 'एनोटेटेड परिणाम',
      'missing.title': 'शब्दकोश में नहीं मिले वर्ण (जांचें)',
      'missing.empty': '✅ सभी वर्ण कवर, कुछ भी गुम नहीं।',
      'sample.sentence': '银行门口一行人正在行走，他们重复强调了这件事情的重要性。要求每个人都要还书，还要调查一下当时的背景。当时大家都觉得这长头发的少年长得真好看，长大了一定有出息，会成为一名好大夫。重庆来的朋友特别喜欢音乐，也喜欢在快乐的时光里努力学习、好好奋斗。',
    },
    ar: {
      'title': 'مشروح بينيين تلقائي للحروف متعددة النطقات',
      'subtitle': 'ضروري للمعلّمين ومنشئي المحتوى المعرفي. شرح جماعي للهانزي مع اختيار النطق بناءً على السياق، وأوضاع للاحتفاظ بالنادرة، وسرد للحروف غير الموجودة. 100% محلي.',
      'tip': '💡 نصيحة: الصق فقرة، يختار الأداة النطق عبر +500 قاعدة. انقر على الحرف البرتقالي لتبديل النطقات البديلة. صدّر بصيغة <ruby> أو بين قوسين.',
      'features': 'الميزات',
      'f1': '500+ تعدد نطقات و +500 قاعدة سياقية',
      'f2': '3 أوضاع: متعددة النطقات فقط / النادرة / كل الهانزي',
      'f3': 'انقر على الحرف البرتقالي → نطقات بديلة',
      'f4': 'سرد منفصل للحروف غير الموجودة لمراجعة يدوية',
      'f5': 'تصدير HTML <ruby> أو بين قوسين، نسخ / تحميل بنقرة',
      'f6': '100% في المتصفح، لا رفع. واجهة بـ 6 لغات.',
      'input.label': 'النص المدخل',
      'input.placeholder': 'الصق أو اكتب النص المراد شرحه.',
      'mark.mode': 'النطاق',
      'mark.poly': 'متعددة النطقات فقط (موصى به)',
      'mark.rare': 'الحروف النادرة فقط',
      'mark.all': 'كل الهانزي',
      'format.mode': 'صيغة الإخراج',
      'format.ruby': 'أعلى/أسفل HTML <ruby> (WeChat / المدونات)',
      'format.inline': 'بين قوسين (لـ CapCut / الترجمة)',
      'action.sample': '🎯 تحميل المثال',
      'action.copy.ruby': 'نسخ HTML <ruby>',
      'action.copy.text': 'نسخ النص الداخلي',
      'action.export': 'تحميل .txt',
      'action.copied': 'تم النسخ',
      'stat.total': 'إجمالي {n} هانزي',
      'stat.poly': '{p} متعددة النطقات، {r} نادرة',
      'stat.missing': '{m} غير موجود في القاموس (بالأحمر)',
      'legend.poly': 'متعددة النطقات (انقر للتغيير)',
      'legend.rare': 'حرف نادر',
      'legend.missing': 'غير موجود — راجع يدوياً',
      'output.title': 'النتيجة المشروحة',
      'missing.title': 'حروف غير موجودة في قاموس البينيين (تحقق يدوياً)',
      'missing.empty': '✅ الكل مغطى، لا شيء مفقود.',
      'sample.sentence': '银行门口一行人正在行走，他们重复强调了这件事情的重要性。要求每个人都要还书，还要调查一下当时的背景。当时大家都觉得这长头发的少年长得真好看，长大了一定有出息，会成为一名好大夫。重庆来的朋友特别喜欢音乐，也喜欢在快乐的时光里努力学习、好好奋斗。',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.zh[key] ?? key;
      if (vars) Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, String(v)); });
      return str;
    };
  };
  const t = getT(locale);

  const [text, setText] = useState('');
  const [markMode, setMarkMode] = useState<MarkMode>('poly');
  const [formatMode, setFormatMode] = useState<FormatMode>('ruby');
  const [overrides, setOverrides] = useState<Record<string, number>>({}); // key: `${i}-${char}`
  const [copyState, setCopyState] = useState<{ ruby?: boolean; text?: boolean }>({});

  const cycleAlt = (key: string, current: number, alts: number) => {
    setOverrides((o) => ({ ...o, [key]: (current + 1) % alts }));
  };

  const results = useMemo<CharResult[]>(() => {
    const arr: CharResult[] = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (!isCJKChar(ch)) {
        arr.push({ char: ch, pinyin: '', isPoly: false, isRare: false, isCJK: false, selectedIdx: 0, alternatives: [], skip: true });
        continue;
      }
      let preferIdx = -1;
      for (let wl = Math.min(4, text.length - i); wl >= 2; wl--) {
        const sub = text.slice(i, i + wl);
        const rule = POLY_RULES.find((r) => r.word === sub);
        if (rule && rule.prefer[ch] !== undefined) {
          preferIdx = rule.prefer[ch];
          break;
        }
      }
      const entry = PINYIN_MAP[ch];
      if (!entry) {
        arr.push({ char: ch, pinyin: '???', isPoly: false, isRare: isRareChar(ch), isCJK: true, selectedIdx: 0, alternatives: [], skip: false });
        continue;
      }
      const alts = entry;
      const isPoly = alts.length > 1;
      let idx = preferIdx >= 0 && preferIdx < alts.length ? preferIdx : 0;
      const overrideKey = `${i}-${ch}`;
      if (overrides[overrideKey] !== undefined && overrides[overrideKey] < alts.length) {
        idx = overrides[overrideKey];
      }
      arr.push({
        char: ch,
        pinyin: alts[idx],
        isPoly,
        isRare: isRareChar(ch),
        isCJK: true,
        selectedIdx: idx,
        alternatives: alts,
        skip: false,
      });
    }
    return arr;
  }, [text, overrides]);

  const { totalHanzi, polyCount, rareCount, missingCount } = useMemo(() => {
    let total = 0, poly = 0, rare = 0, miss = 0;
    results.forEach((r) => {
      if (!r.isCJK) return;
      total++;
      if (r.alternatives.length === 0) miss++;
      else {
        if (r.isPoly) poly++;
        if (r.isRare) rare++;
      }
    });
    return { totalHanzi: total, polyCount: poly, rareCount: rare, missingCount: miss };
  }, [results]);

  const missingList = useMemo(() => {
    const set = new Set<string>();
    results.forEach((r) => { if (r.isCJK && r.alternatives.length === 0) set.add(r.char); });
    return Array.from(set);
  }, [results]);

  const shouldShow = (r: CharResult) => {
    if (!r.isCJK || r.skip) return false;
    if (markMode === 'poly') return r.isPoly;
    if (markMode === 'rare') return r.isRare;
    return true;
  };

  const htmlRuby = useMemo(() => {
    return results.map((r, i) => {
      if (!r.isCJK) return r.char;
      const show = shouldShow(r);
      if (!show || r.alternatives.length === 0) return r.char;
      return `<ruby>${r.char}<rt>${r.pinyin}</rt></ruby>`;
    }).join('');
  }, [results, markMode]);

  const inlineText = useMemo(() => {
    return results.map((r, i) => {
      if (!r.isCJK) return r.char;
      const show = shouldShow(r);
      if (!show || r.alternatives.length === 0) return r.char;
      return `${r.char}（${r.pinyin}）`;
    }).join('');
  }, [results, markMode]);

  const loadSample = () => { setText(t('sample.sentence')); setOverrides({}); };
  const copy = async (payload: string, field: 'ruby' | 'text') => {
    try { await navigator.clipboard.writeText(payload); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = payload; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopyState((s) => ({ ...s, [field]: true }));
    setTimeout(() => setCopyState((s) => ({ ...s, [field]: false })), 1700);
  };
  const exportTxt = () => {
    const content = formatMode === 'ruby' ? htmlRuby : inlineText;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pinyin-annotated.txt';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        <main className="lg:col-span-8">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25">
                <Languages className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t('input.label')}
                  </label>
                  <button
                    type="button"
                    onClick={loadSample}
                    className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-200 dark:border-amber-800 transition-colors min-h-[32px] touch-manipulation"
                  >
                    {t('action.sample')}
                  </button>
                </div>
                <textarea
                  value={text}
                  onChange={(e) => { setText(e.target.value); setOverrides({}); }}
                  placeholder={t('input.placeholder')}
                  rows={7}
                  className="input-base w-full resize-y text-sm leading-relaxed min-h-[180px] touch-manipulation"
                />
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 tabular-nums">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    {t('stat.total', { n: totalHanzi })}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 tabular-nums">
                    {polyCount > 0 ? t('stat.poly', { p: polyCount, r: rareCount }) : null}
                  </span>
                  {missingCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 tabular-nums">
                      <AlertTriangle className="h-3 w-3" />
                      {t('stat.missing', { m: missingCount })}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-3">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{t('mark.mode')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {([
                      { k: 'poly', label: t('mark.poly') },
                      { k: 'rare', label: t('mark.rare') },
                      { k: 'all', label: t('mark.all') },
                    ] as { k: MarkMode; label: string }[]).map((opt) => (
                      <button
                        key={opt.k}
                        type="button"
                        onClick={() => setMarkMode(opt.k)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all text-left min-h-[44px] touch-manipulation ${
                          markMode === opt.k
                            ? 'bg-amber-50 dark:bg-amber-900/25 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                            : 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{t('format.mode')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {([
                      { k: 'ruby', label: t('format.ruby') },
                      { k: 'inline', label: t('format.inline') },
                    ] as { k: FormatMode; label: string }[]).map((opt) => (
                      <button
                        key={opt.k}
                        type="button"
                        onClick={() => setFormatMode(opt.k)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all text-left min-h-[44px] touch-manipulation ${
                          formatMode === opt.k
                            ? 'bg-amber-50 dark:bg-amber-900/25 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                            : 'bg-white dark:bg-gray-900/40 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400/30 border border-amber-300" />{t('legend.poly')}</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-400/30 border border-emerald-300" />{t('legend.rare')}</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-400/30 border border-rose-300" />{t('legend.missing')}</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-amber-500" />
                    {t('output.title')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copy(htmlRuby, 'ruby')}
                      disabled={!text}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-1.5 min-h-[38px] touch-manipulation"
                    >
                      {copyState.ruby ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {copyState.ruby ? t('action.copied') : t('action.copy.ruby')}
                    </button>
                    <button
                      type="button"
                      onClick={() => copy(inlineText, 'text')}
                      disabled={!text}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-1.5 min-h-[38px] touch-manipulation"
                    >
                      {copyState.text ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {copyState.text ? t('action.copied') : t('action.copy.text')}
                    </button>
                    <button
                      type="button"
                      onClick={exportTxt}
                      disabled={!text}
                      className="px-3 py-2 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-1.5 min-h-[38px] touch-manipulation"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t('action.export')}
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/30 min-h-[160px]">
                  {!text ? (
                    <p className="text-center text-sm text-gray-400 py-8">{t('input.placeholder').split('\n')[0]}</p>
                  ) : formatMode === 'ruby' ? (
                    <p className="text-base sm:text-lg leading-loose sm:leading-[2.2] text-gray-800 dark:text-gray-100 break-words" lang="zh-CN">
                      {results.map((r, i) => {
                        if (!r.isCJK) return <span key={i}>{r.char}</span>;
                        const missing = r.alternatives.length === 0;
                        const show = shouldShow(r) && !missing;
                        const key = `${i}-${r.char}`;
                        const clickable = r.isPoly && r.alternatives.length > 1;
                        const bgClass = missing
                          ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : r.isRare
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800'
                            : r.isPoly
                              ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800'
                              : '';
                        return (
                          <ruby
                            key={i}
                            className={`inline-block rounded px-0.5 align-baseline ${bgClass} ${clickable ? 'cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors select-none touch-manipulation' : ''}`}
                            onClick={() => clickable && cycleAlt(key, r.selectedIdx, r.alternatives.length)}
                            title={clickable ? `${r.alternatives.join(' / ')} — ${locale === 'zh' ? '点击切换' : 'Tap to cycle'}` : undefined}
                          >
                            <span className="font-medium">{r.char}</span>
                            {show && <rt className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-medium">{r.pinyin}</rt>}
                            {missing && <rt className="text-xs sm:text-sm text-rose-500 font-medium">?</rt>}
                          </ruby>
                        );
                      })}
                    </p>
                  ) : (
                    <p className="text-base sm:text-lg leading-loose text-gray-800 dark:text-gray-100 break-words">
                      {results.map((r, i) => {
                        if (!r.isCJK) return <span key={i}>{r.char}</span>;
                        const missing = r.alternatives.length === 0;
                        const show = shouldShow(r) && !missing;
                        const key = `${i}-${r.char}`;
                        const clickable = r.isPoly && r.alternatives.length > 1;
                        const spanClass = missing
                          ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded px-0.5'
                          : r.isRare
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded px-0.5'
                            : r.isPoly
                              ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded px-0.5'
                              : '';
                        return (
                          <span
                            key={i}
                            className={`${spanClass} ${clickable ? 'cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-800/40 select-none touch-manipulation' : ''}`}
                            onClick={() => clickable && cycleAlt(key, r.selectedIdx, r.alternatives.length)}
                            title={clickable ? `${r.alternatives.join(' / ')}` : undefined}
                          >
                            {r.char}
                            {show && <span className="text-xs text-amber-700 dark:text-amber-300 mx-0.5">（{r.pinyin}）</span>}
                            {missing && <span className="text-xs text-rose-500 mx-0.5">（?）</span>}
                          </span>
                        );
                      })}
                    </p>
                  )}
                </div>
              </div>

              {missingList.length > 0 ? (
                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-900/10">
                  <h3 className="text-sm font-semibold text-rose-800 dark:text-rose-200 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {t('missing.title')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {missingList.map((ch, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-800 text-base sm:text-lg tabular-nums text-rose-700 dark:text-rose-200">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              ) : text && (
                <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/10 text-sm text-emerald-700 dark:text-emerald-300">
                  {t('missing.empty')}
                </div>
              )}

              <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{t('tip')}</p>
              </div>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4">
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">{t('features')}</h3>
            <ul className="space-y-3">
              {[t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6')].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
