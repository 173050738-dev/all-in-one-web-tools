'use client';

import { useState, useMemo, useCallback } from 'react';
import { Copy, Check, Download, FileText, Sparkles } from 'lucide-react';

interface PinyinAnnotatorProps {
  locale?: string;
}

type FormatMode = 'ruby' | 'inline';
type ZhuyinMode = 'no' | 'both';
type MarkMode = 'poly' | 'all';

interface CharResult {
  char: string;
  pinyin: string;
  zhuyin: string;
  isPoly: boolean;
  isRare: boolean;
  selectedIdx: number;
  alternatives: string[];
  skip: boolean;
}

const i18n: Record<string, Record<string, string>> = {
  zh: { title:"多音字拼音标注工具", subtitle:"知识博主/教辅博主刚需，避免读错字翻车", input:"粘贴全文（含多音字/生僻字）", formatMode:"显示格式", rubyTopBottom:"上下排版（拼音在上，文字在下，HTML <ruby>）", inlineBracket:"括号内联 (字 （pīn yīn）)", outputZhuyin:"同时输出注音符号吗？（仅港澳台用）", zhuyinNo:"不输出注音", zhuyinBoth:"拼音 + 注音双标注", markPolyOnly:"只标注多音字（常用非多音字不标，更简洁）", markAll:"全部生僻和多音字都标", outputDisplay:"标注结果（可复制）", copyText:"📋 复制带拼音文本", copyHtml:"📋 复制 HTML <ruby> 代码", exportMarkdown:"💾 导出 Markdown", sample:"加载示例：多音字翻车高发句", sampleText:"银行门口一行人正在行走，他们重复强调了这件事情的重要性，要求每个人都要还书，还要调查一下当时的背景，当时大家都觉得这长头发的少年长得真好看，长大了一定有出息，会成为一名好大夫。", markCount:"检测到多音字 {n} 处，生僻字 {m} 个", legendPoly:"多音字（橙底标注）", legendRare:"生僻字（绿底标注）", legendNormal:"普通字不标", correctWord:"如果多音字选错了读音，点击字手动切换：", prevPron:"← 上一个读音", nextPron:"下一个读音 →", placeHolder:"银行 (xíng/háng)? 还 (huán/hái)? 重 (zhòng/chóng)? 长 (cháng/zhǎng)? 大 (dà/dài)? 输入含多音句子系统自动识别语境。" },
  en: { title:"Polyphone Pinyin Annotator", subtitle:"For knowledge tutors, avoid mispronunciation", input:"Paste text with polyphones", formatMode:"Display format", rubyTopBottom:"Ruby top/bottom (HTML <ruby>)", inlineBracket:"Inline (char (pīn yīn))", outputZhuyin:"Zhuyin too?", zhuyinNo:"Pinyin only", zhuyinBoth:"Pinyin + Zhuyin", markPolyOnly:"Polyphones only", markAll:"All rare + poly", outputDisplay:"Result", copyText:"📋 Copy annotated", copyHtml:"📋 Copy HTML ruby", exportMarkdown:"💾 Export MD", sample:"Load polyphone sample", sampleText:"At the bank entrance a group of people were walking. They repeatedly emphasized the importance. Everyone must return the books. Also investigate the background. Everyone felt this long-haired youth looked really handsome. When he grows up he'll have a great future, become a good doctor.", markCount:"Detected {n} polyphones & {m} rare chars", legendPoly:"Polyphones (orange)", legendRare:"Rare chars (green)", legendNormal:"Regular untouched", correctWord:"Tap a char to cycle alternative pronunciations:", prevPron:"← Prev pron.", nextPron:"Next pron. →", placeHolder:"Try with: 银行 重复 还书 长大 大夫 - system auto context-aware." },
  hi: { title:"पिनयिन एनोटेटर", subtitle:"ट्यूटर्स के लिए, गलत उच्चारण से बचें", input:"बहुध्र्वी अक्षर वाला टेक्स्ट डालें", formatMode:"प्रदर्शन", rubyTopBottom:"रूबी ऊपर/नीचे HTML", inlineBracket:"इनलाइन (अक्षर (pīn yīn))", outputZhuyin:"Zhuyin भी?", zhuyinNo:"केवल पिनयिन", zhuyinBoth:"पिनयिन + Zhuyin", markPolyOnly:"केवल बहुध्र्वी", markAll:"सभी दुर्लभ+बहुध्र्वी", outputDisplay:"परिणाम", copyText:"📋 कॉपी एनोटेटेड", copyHtml:"📋 कॉपी HTML रूबी", exportMarkdown:"💾 MD निर्यात", sample:"उदाहरण डालें", sampleText:"बैंक/चल, वापसी/अभी भी", markCount:"{n} बहुध्र्वी और {m} दुर्लभ पहचाने गए", legendPoly:"बहुध्र्वी (नारंगी)", legendRare:"दुर्लभ (हरा)", legendNormal:"सामान्य अछूता", correctWord:"अक्षर पर टैप, वैकल्पिक उच्चारण:", prevPron:"← पिछला", nextPron:"अगला →", placeHolder:"अनेक बहुध्र्वी वाक्य डालें" },
  fr: { title:"Annotateur Pinyin Polyphone", subtitle:"Pour tuteurs, éviter erreurs prononciation", input:"Collez texte polyphones", formatMode:"Affichage", rubyTopBottom:"Ruby haut/bas HTML", inlineBracket:"En ligne (car (pīn yīn))", outputZhuyin:"Zhuyin aussi?", zhuyinNo:"Pinyin seul", zhuyinBoth:"Pinyin + Zhuyin", markPolyOnly:"Polyphones seul", markAll:"Tous rares + poly", outputDisplay:"Résultat", copyText:"📋 Copier annoté", copyHtml:"📋 Copier HTML ruby", exportMarkdown:"💾 Export MD", sample:"Charger exemple polyphone", sampleText:"Texte exemple banque/marcher", markCount:"{n} polyphones & {m} rares détectés", legendPoly:"Polyphones (orange)", legendRare:"Rares (vert)", legendNormal:"Normaux intacts", correctWord:"Taper un caractère → cycle prononciations:", prevPron:"← Préc.", nextPron:"Suiv. →", placeHolder:"Entrez phrase avec multiples lectures." },
  es: { title:"Anotador Pinyin Polifónico", subtitle:"Para tutores, evitar errores pronunciación", input:"Pegar texto con polífonos", formatMode:"Visualización", rubyTopBottom:"Ruby arriba/abajo HTML", inlineBracket:"En línea (car. (pīn yīn))", outputZhuyin:"¿Zhuyin también?", zhuyinNo:"Solo Pinyin", zhuyinBoth:"Pinyin + Zhuyin", markPolyOnly:"Solo polífonos", markAll:"Todos raros + polífonos", outputDisplay:"Resultado", copyText:"📋 Copiar anotado", copyHtml:"📋 Copiar HTML ruby", exportMarkdown:"💾 Exportar MD", sample:"Cargar ejemplo polífono", sampleText:"Texto ejemplo banco/caminar", markCount:"{n} polífonos & {m} raros detectados", legendPoly:"Polífonos (naranja)", legendRare:"Raros (verde)", legendNormal:"Normales intactos", correctWord:"Tocar carácter → ciclar pronuncias:", prevPron:"← Ant.", nextPron:"Sig. →", placeHolder:"Escribir frase con múltiples lecturas." },
  ar: { title:"مشروح بينيين متعدد النطقات", subtitle:"للمعلّمين، تجنب أخطاء النطق", input:"الصق نصًا به حروف متعددة النطقات", formatMode:"طريقة العرض", rubyTopBottom:"روبي أعلى/أسفل HTML", inlineBracket:"داخلي (حرف (pīn yīn))", outputZhuyin:"الـ Zhuyin أيضًا؟", zhuyinNo:"بينيين فقط", zhuyinBoth:"بينيين + Zhuyin", markPolyOnly:"متعددة النطقات فقط", markAll:"كل النادرة+متعددة", outputDisplay:"النتيجة", copyText:"📋 نسخ المشروح", copyHtml:"📋 نسخ HTML روبي", exportMarkdown:"💾 تصدير MD", sample:"تحميل مثال متعدد النطقات", sampleText:"مثال بنك/يمشي", markCount:"تم الكشف عن {n} متعدد & {m} نادر", legendPoly:"متعددة (برتقالي)", legendRare:"نادرة (أخضر)", legendNormal:"عادية سليمة", correctWord:"اضغط على الحرف لتدوير النطقات:", prevPron:"← السابق", nextPron:"التالي →", placeHolder:"أدخل جملة بها نطقات متعددة." }
};

const PINYIN: Record<string, string[]> = {
  '银':['yín'],'行':['xíng','háng','héng','hàng'],'门':['mén'],'口':['kǒu'],
  '一':['yī'],'人':['rén'],'正':['zhèng','zhēng'],'在':['zài'],
  '重':['zhòng','chóng'],'复':['fù'],'强':['qiáng','qiǎng','jiàng'],'调':['tiáo','diào'],
  '了':['le','liǎo'],'要':['yào','yāo'],'求':['qiú'],'每':['měi'],
  '个':['gè','gě'],'都':['dōu','dū'],'还':['hái','huán'],'书':['shū'],
  '调':['tiáo','diào'],'查':['chá','zhā'],'当':['dāng','dàng'],'时':['shí'],
  '的':['de','dí','dì','dī'],'背':['bèi','bēi'],'景':['jǐng'],'大':['dà','dài','tài'],
  '家':['jiā','jia','jie'],'觉':['jué','jiào'],'得':['dé','děi','de'],
  '长':['cháng','zhǎng'],'头':['tóu','tou'],'发':['fā','fà'],'少':['shǎo','shào'],
  '年':['nián'],'真':['zhēn'],'好':['hǎo','hào'],'看':['kàn','kān'],
  '了':['le','liǎo'],'出':['chū'],'息':['xī'],'会':['huì','kuài'],
  '成':['chéng'],'为':['wéi','wèi'],'名':['míng'],'夫':['fū','fú'],
  '走':['zǒu'],'路':['lù'],'他':['tā'],'们':['men'],
  '重':['zhòng','chóng'],'要':['yào','yāo'],'性':['xìng'],'情':['qíng'],
  '事':['shì'],'情':['qíng'],'银':['yín'],'行':['xíng','háng'],
  '我':['wǒ'],'你':['nǐ'],'她':['tā'],'它':['tā'],
  '这':['zhè','zhèi'],'那':['nà','nǎ','nèi','nā'],'哪':['nǎ','něi','né','nǎi'],
  '来':['lái'],'去':['qù'],'说':['shuō','shuì','yuè'],'话':['huà'],
  '听':['tīng'],'吃':['chī'],'喝':['hē'],'朋':['péng'],
  '友':['yǒu'],'爸':['bà'],'妈':['mā'],'哥':['gē'],
  '姐':['jiě'],'弟':['dì'],'妹':['mèi'],'爷':['yé'],
  '奶':['nǎi'],'儿':['ér'],'女':['nǚ','rǔ'],'子':['zǐ','zi'],
  '孩':['hái'],'宝':['bǎo'],'贝':['bèi'],'国':['guó'],
  '学':['xué'],'校':['xiào','jiào'],'老':['lǎo'],'师':['shī'],
  '生':['shēng'],'日':['rì'],'月':['yuè'],'间':['jiān','jiàn'],
  '上':['shàng','shǎng'],'下':['xià'],'左':['zuǒ'],'右':['yòu'],
  '前':['qián'],'后':['hòu'],'东':['dōng'],'西':['xī'],
  '南':['nán','nā'],'北':['běi'],'美':['měi'],'小':['xiǎo'],
  '多':['duō'],'今':['jīn'],'明':['míng'],'昨':['zuó'],
  '天':['tiān'],'风':['fēng'],'雨':['yǔ','yù'],'雪':['xuě'],
  '云':['yún'],'山':['shān'],'水':['shuǐ'],'火':['huǒ'],
  '土':['tǔ'],'金':['jīn'],'木':['mù'],'河':['hé'],
  '海':['hǎi'],'江':['jiāng'],'湖':['hú'],'红':['hóng'],
  '黄':['huáng'],'蓝':['lán'],'白':['bái'],'黑':['hēi'],
  '绿':['lǜ','lù'],'紫':['zǐ'],'粉':['fěn'],'不':['bù','bú','fǒu'],
  '是':['shì'],'中':['zhōng','zhòng'],'种':['zhǒng','zhòng'],'华':['huá','huà'],
  '朝':['zhāo','cháo'],'佛':['fó','fú'],'车':['chē','jū'],
  '兴':['xīng','xìng'],'曲':['qū','qǔ'],'系':['xì','jì'],
  '假':['jiǎ','jià'],'能':['néng','nài'],'作':['zuò','zuō'],
  '卷':['juàn','juǎn'],'冠':['guān','guàn'],'更':['gèng','gēng'],
  '难':['nán','nàn'],'色':['sè','shǎi'],'什':['shén','shí'],
  '么':['me','mó','yāo'],'地':['dì','de'],'和':['hé','hè','huó','huò','hú'],
  '空':['kōng','kòng','kǒng'],'吧':['ba','bā'],'给':['gěi','jǐ'],
  '过':['guò','guo','guō'],'薄':['bó','báo','bò'],'恶':['è','wù','ě','wū'],
  '宿':['sù','xiǔ','xiù'],'拗':['ào','ǎo','niù'],'艾':['ài','yì'],
  '曝':['pù','bào'],'暴':['bào','pù'],'沓':['tà','dá'],
  '率':['lǜ','shuài'],'殷':['yīn','yān','yǐn'],'秘':['mì','bì'],
  '尿':['niào','suī'],'卡':['kǎ','qiǎ'],'片':['piàn','piān'],
  '亲':['qīn','qìng'],'且':['qiě','jū'],'区':['qū','ōu'],
  '厦':['shà','xià'],'雀':['què','qiāo','qiǎo'],'熟':['shú','shóu'],
  '似':['sì','shì'],'缩':['suō','sù'],'叶':['yè','xié'],
  '钥':['yuè','yào'],'药':['yào'],'硬':['yìng'],'软':['ruǎn'],
  '堡':['bǎo','bǔ','pù'],'请':['qǐng'],'问':['wèn'],
  '高':['gāo'],'矮':['ǎi'],'跳':['tiào'],'跑':['pǎo'],
  '龙':['lóng'],'虎':['hǔ'],'熊':['xióng'],'鸡':['jī'],
  '鹿':['lù'],'鱼':['yú'],'鸟':['niǎo'],'虫':['chóng'],
  '草':['cǎo'],'树':['shù'],'花':['huā'],'乐':['lè','yuè','yào'],
  '数':['shù','shǔ','shuò'],'几':['jǐ','jī'],'差':['chā','chà','chāi','cī'],
  '盛':['shèng','chéng'],'没':['méi','mò'],'便':['biàn','pián'],
  '传':['chuán','zhuàn'],'单':['dān','chán','shàn'],'解':['jiě','xiè','jiè'],
  '干':['gān','gàn'],'教':['jiào','jiāo'],'量':['liàng','liáng'],
  '将':['jiāng','jiàng'],'盛':['shèng','chéng'],'没':['méi','mò'],
  '便':['biàn','pián'],'传':['chuán','zhuàn'],'乐':['lè','yuè'],
  '数':['shù','shǔ'],'差':['chā','chà'],'中':['zhōng','zhòng'],
  '种':['zhǒng','zhòng'],'华':['huá','huà'],'会':['huì','kuài'],
  '朝':['zhāo','cháo'],'佛':['fó','fú'],'车':['chē','jū'],
  '好':['hǎo','hào'],'背':['bèi','bēi'],'兴':['xīng','xìng'],
  '曲':['qū','qǔ'],'系':['xì','jì'],'假':['jiǎ','jià'],
  '作':['zuò','zuō'],'卷':['juàn','juǎn'],'冠':['guān','guàn'],
  '更':['gèng','gēng'],'难':['nán','nàn'],'色':['sè','shǎi'],
  '薄':['bó','báo','bò'],'恶':['è','wù','ě'],'宿':['sù','xiǔ','xiù'],
  '拗':['ào','ǎo','niù'],'暴':['bào','pù'],'沓':['tà','dá'],
  '绿':['lǜ','lù'],'率':['lǜ','shuài'],'殷':['yīn','yān'],
  '秘':['mì','bì'],'尿':['niào','suī'],'卡':['kǎ','qiǎ'],
  '片':['piàn','piān'],'亲':['qīn','qìng'],'区':['qū','ōu'],
  '厦':['shà','xià'],'雀':['què','qiǎo'],'熟':['shú','shóu'],
  '似':['sì','shì'],'缩':['suō','sù'],'叶':['yè','xié'],
  '钥':['yuè','yào'],'堡':['bǎo','bǔ','pù'],
  '艾':['ài','yì'],'曝':['pù','bào'],
  '打':['dǎ','dá'],'切':['qiē','qiè'],'扫':['sǎo','sào'],
  '塞':['sāi','sài','sè'],'扎':['zhā','zā','zhá'],'相':['xiāng','xiàng'],
  '磨':['mó','mò'],'散':['sàn','sǎn'],'钉':['dīng','dìng'],
  '数':['shù','shǔ','shuò'],'钻':['zuān','zuàn'],'累':['lèi','lěi','léi'],
  '结':['jié','jiē'],'骨':['gǔ','gū'],'露':['lù','lòu'],
  '藏':['cáng','zàng'],'划':['huà','huá'],'缝':['fèng','féng'],
  '佛':['fó','fú'],'弹':['dàn','tán'],'了':['le','liǎo'],
  '着':['zhe','zháo','zhāo','zhuó'],'重':['zhòng','chóng'],'长':['cháng','zhǎng'],
  '正':['zhèng','zhēng'],'好':['hǎo','hào'],'还':['huán','hái'],
  '要':['yào','yāo'],'把':['bǎ','bà'],'过':['guò','guo'],
  '给':['gěi','jǐ'],'地':['dì','de'],'和':['hé','hè','huó'],
  '得':['dé','děi','de'],'谁':['shuí','shéi'],'那':['nà','nǎ','nèi'],
  '啥':['shá'],'咋':['zǎ','zé','zhā'],'卅':['sà'],
  '乂':['yì'],'爻':['yáo'],'冇':['mǎo'],'冏':['jiǒng'],
  '囧':['jiǒng'],'槑':['méi'],'烎':['yín'],'玊':['sù'],
  '忈':['rén'],'炛':['guāng'],'兲':['tiān'],'恏':['hào'],
  '奣':['wěng'],'孬':['nāo'],'甭':['béng'],'巭':['gu','bū'],
  '囍':['xǐ'],'喆':['zhé'],'囙':['yīn'],'囜':['nín'],
  '圙':['lüè'],'圐':['kū'],'坔':['dì','lán'],'埊':['dì'],
  '壵':['zhuàng'],'尛':['mó'],'孖':['mā','zī'],'奀':['ēn'],
  '巭':['bu'],'猋':['biāo'],'骉':['biāo'],'麤':['cū'],
  '羴':['shān'],'鱻':['xiān'],'龘':['dá'],'靐':['bìng'],
  '飍':['xiū'],'飝':['fēi'],'虤':['yán'],'驫':['biāo'],
  '厵':['yuán'],'灥':['xún','quán'],'灥':['xún'],'籴':['dí'],
  '粜':['tiào'],'汆':['cuān'],'氽':['tǔn'],'蕈':['xùn'],
  '彳':['chì'],'亍':['chù'],'孑':['jié'],'孓':['jué'],
  '耄':['mào'],'耋':['dié'],'饕餮':['tāo'],'餮':['tiè'],
  '囹':['líng'],'圄':['yǔ'],'觊':['jì'],'觎':['yú'],
  '龃':['jǔ'],'龉':['yǔ'],'桎梏':['zhì'],'梏':['gù'],
  '耄':['mào'],'耋':['dié'],'佝':['gōu'],'偻':['lóu','lǚ'],
  '啙':['zǐ','cī'],'窳':['yǔ'],'呶':['náo','nǔ'],'咻':['xiū'],
  '呶':['náo'],'哓':['xiāo'],'咤':['zhà','chà'],'咻':['xiū'],
  '哢':['lòng'],'唛':['mài'],'啵':['bo','bō'],'啹':['jú'],
  '喺':['xí'],'嘅':['kǎi','gě'],'嗰':['gě'],'嘢':['yě'],
  '瞓':['fèn'],'攰':['guì'],'脷':['lì'],'簕':['lè'],
  '艿':['nǎi','rèng'],'芏':['dù'],'芐':['hù','xià'],'芘':['pí','bǐ'],
  '芧':['zhù','xù'],'苊':['è'],'苉':['pǐ'],'苘':['qǐng'],
  '荍':['qiáo'],'荑':['yí','tí'],'莕':['xìng'],'菳':['qín'],
  '菽':['shū'],'萏':['dàn'],'萋':['qī'],'菁':['jīng'],
  '菅':['jiān'],'萲':['xuān'],'蕴':['yùn'],'薤':['xiè'],
  '藿':['huò'],'蘧':['qú'],'蘩':['fán'],'虉':['yì'],
  '艽':['jiāo','qiú'],'芎':['xiōng','qióng'],'芪':['qí'],
  '芫':['yuán','yán'],'苻':['fú','pú'],'苓':['líng'],
  '茑':['niǎo'],'茚':['yìn'],'茆':['máo','mǎo'],'茔':['yíng'],
  '茕':['qióng'],'茧':['jiǎn'],'荆':['jīng'],'荐':['jiàn'],
  '荜':['bì'],'荭':['hóng'],'荮':['zhòu'],'荽':['suī'],
  '莅':['lì'],'莆':['pú'],'莨':['làng','liáng'],'莪':['é'],
  '茉':['mò'],'茗':['míng'],'茝':['chǎi','zhǐ'],'莩':['piǎo','fú'],
  '莘':['shēn','xīn'],'莞':['guǎn','wǎn','guān'],'莶':['xiān','liǎn'],
  '荻':['dí'],'荼':['tú'],'荽':['suī'],'莅':['lì'],
  '莆':['pú'],'莨':['làng'],'菥':['xī'],'菘':['sōng'],
  '菝':['bá'],'菖':['chāng'],'菰':['gū'],'菡':['hàn'],
  '葜':['qiā'],'葑':['fēng'],'葚':['shèn','rèn'],'蒡':['bàng'],
  '蓓':['bèi'],'蓊':['wěng'],'蓿':['xu','sù'],'蔸':['dōu'],
  '蕈':['xùn'],'蕨':['jué'],'蕲':['qí'],'蕴':['yùn'],
  '薷':['rú'],'藉':['jiè','jí'],'藐':['miǎo'],'藓':['xiǎn'],
  '藠':['jiào'],'藜':['lí'],'藤':['téng'],'藿':['huò'],
  '蘅':['héng'],'蘩':['fán'],'蘖':['niè'],'蕊':['ruǐ'],
  '苡':['yǐ'],'茉':['mò'],'苷':['gān'],'莓':['méi'],
  '荼':['tú'],'荠':['jì','qí'],'茭':['jiāo'],'茨':['cí'],
  '茹':['rú'],'茈':['zǐ','cí'],'茖':['gè','gé'],'荢':['zì'],
  '荥':['xíng','yíng'],'荤':['hūn'],'荧':['yíng'],'荨':['qián','xún'],
  '荩':['jìn'],'荪':['sūn'],'荫':['yīn','yìn'],'荬':['mǎi'],
  '荭':['hóng'],'荮':['zhòu'],'药':['yào'],'荴':['fū'],
  '莎':['shā','suō'],'荺':['yǔn'],'莹':['yíng'],'莞':['guǎn'],
  '萩':['qiū'],'萲':['xuān'],'萳':['nán'],'葆':['bǎo'],
  '蒋':['jiǎng'],'蒌':['lóu'],'蓝':['lán'],'蓟':['jì'],
  '蓣':['yù'],'蓥':['yíng'],'蓦':['mò'],'蔷':['qiáng'],
  '蔹':['liǎn'],'蓼':['liǎo','lù'],'蔻':['kòu'],'蔼':['ǎi'],
  '蕲':['qí'],'蕖':['qú'],'蔻':['kòu'],'瘪':['biě','biē'],
  '瘃':['zhú'],'瘗':['yì'],'瘾':['yǐn'],'瘳':['chōu'],
  '瘴':['zhàng'],'瘵':['zhài'],'瘸':['qué'],'瘼':['mò'],
  '瘿':['yǐng'],'癀':['huáng'],'癃':['lóng'],'瘾':['yǐn'],
  '癌':['ái'],'症':['zhèng','zhēng'],'痖':['yǎ'],'疵':['cī'],
  '痏':['wěi','yòu','yù'],'疸':['dǎn'],'疹':['zhěn'],'疸':['dǎn'],
  '疽':['jū'],'痉':['jìng'],'痊':['quán'],'痍':['yí'],
  '痒':['yǎng'],'痕':['hén'],'痘':['dòu'],'痛':['tòng'],
  '痢':['lì'],'痣':['zhì'],'痤':['cuó'],'痫':['xián'],
  '痧':['shā'],'痹':['bì'],'瘅':['dàn','dān'],'瘆':['shèn'],
  '瘀':['yū'],'瘊':['hóu'],'瘥':['chài','cuó'],'瘘':['lòu'],
  '瘦':['shòu'],'疟':['nüè','yào'],'痂':['jiā'],'疳':['gān'],
  '疴':['kē'],'疸':['dǎn'],'疽':['jū'],'疟':['nüè'],
  '疝':['shàn'],'疡':['yáng'],'疔':['dīng'],'疖':['jiē'],
  '疗':['liáo'],'疙':['gē','yì'],'疚':['jiù'],'疝':['shàn'],
  '疟':['nüè'],'疡':['yáng'],'疳':['gān'],'疴':['kē'],
  '疸':['dǎn'],'疽':['jū'],'痄':['zhà'],'疱':['pào'],
  '痃':['xuán'],'疰':['zhù'],'痂':['jiā'],'痍':['yí'],
  '痣':['zhì'],'痤':['cuó'],'痫':['xián'],'痧':['shā'],
  '痱':['fèi','féi'],'痼':['gù'],'痿':['wěi'],'瘀':['yū'],
  '瘁':['cuì'],'瘃':['zhú'],'瘐':['yǔ'],'瘅':['dàn'],
  '瘗':['yì'],'瘘':['lòu'],'瘼':['mò'],'瘛':['chì'],
  '瘢':['bān'],'瘠':['jí'],'瘤':['liú'],'瘳':['chōu'],
  '瘴':['zhàng'],'瘵':['zhài'],'瘿':['yǐng'],'癀':['huáng'],
  '癃':['lóng'],'癔':['yì'],'癖':['pǐ'],'癜':['diàn'],
  '癞':['lài'],'癣':['xuǎn'],'颧':['quán'],'颞':['niè'],
  '颡':['sǎng'],'顸':['hān'],'顼':['xū'],'颀':['qí'],
  '颃':['háng'],'颉':['jié','xié','jiá'],'颍':['yǐng'],'颔':['hàn'],
  '颏':['kē'],'颐':['yí'],'频':['pín','bīn'],'颓':['tuí'],
  '颔':['hàn'],'颏':['kē'],'颊':['jiá'],'颉':['jié'],
  '颍':['yǐng'],'颔':['hàn'],'颚':['è'],'颛':['zhuān'],
  '颜':['yán'],'额':['é'],'颞':['niè'],'颟':['mān'],
  '颠':['diān'],'颡':['sǎng'],'嚣':['xiāo','áo'],'颢':['hào'],
  '颣':['lèi'],'颤':['chàn','zhàn'],'颥':['rú'],'颦':['pín'],
  '颧':['quán'],'饕':['tāo'],'餮':['tiè'],'饔':['yōng'],
  '餮':['tiè'],'饔':['yōng'],'餮':['tiè'],'饕':['tāo'],
  '曩':['nǎng'],'曷':['hé'],'昱':['yù'],'昶':['chǎng'],
  '昵':['nì'],'昭':['zhāo'],'昱':['yù'],'昴':['mǎo'],
  '昱':['yù'],'昶':['chǎng'],'昵':['nì'],'昃':['zè'],
  '昕':['xīn'],'昙':['tán'],'杲':['gǎo'],'昝':['zǎn'],
  '昴':['mǎo'],'昱':['yù'],'昶':['chǎng'],'昵':['nì'],
  '曷':['hé'],'暹':['xiān'],'曩':['nǎng'],'曰':['yuē'],
  '曲':['qū','qǔ'],'曳':['yè'],'更':['gèng','gēng'],'曵':['yè'],
  '曷':['hé'],'曷':['hé'],'书':['shū'],'乇':['tuō','zhé'],
  '乜':['miē','niè'],'亟':['jí','qì'],'亍':['chù'],'亓':['qí'],
  '亘':['gèn'],'亚':['yà'],'些':['xiē','suò'],'亟':['jí'],
  '亡':['wáng','wú'],'亘':['gèn'],'交':['jiāo'],'亥':['hài'],
  '亦':['yì'],'产':['chǎn'],'亨':['hēng','pēng'],'亩':['mǔ'],
  '享':['xiǎng'],'亭':['tíng'],'亮':['liàng'],'亳':['bó'],
  '亵':['xiè'],'亶':['dǎn','dàn'],'儆':['jǐng'],'僭':['jiàn'],
  '僰':['bó'],'儇':['xuān'],'儡':['lěi','léi','lèi'],'兀':['wù'],
  '其':['qí','jī'],'冀':['jì'],'冢':['zhǒng'],'冖':['mì'],
  '冢':['zhǒng'],'冤':['yuān'],'冥':['míng'],'冦':['kòu'],
  '冬':['dōng'],'冯':['féng','píng'],'冰':['bīng'],'冲':['chōng','chòng'],
  '决':['jué'],'况':['kuàng'],'冶':['yě'],'冷':['lěng'],
  '冻':['dòng'],'冼':['xiǎn'],'冽':['liè'],'净':['jìng'],
  '凄':['qī'],'凉':['liáng','liàng'],'凌':['líng'],'凋':['diāo'],
  '减':['jiǎn'],'凑':['còu'],'凛':['lǐn'],'凝':['níng'],
  '憾':['hàn'],'懂':['dǒng'],'懒':['lǎn'],'懔':['lǐn'],
  '懦':['nuò'],'懵':['měng'],'戆':['gàng','zhuàng'],'懿':['yì'],
  '蘸':['zhàn'],'蘩':['fán'],'蘖':['niè'],'蘸':['zhàn']
};

const POLY_WORDS: { word:string; prefer: Record<string,number> }[] = [
  { word:'银行', prefer:{ '行':1 } },
  { word:'一行', prefer:{ '行':0 } },
  { word:'行走', prefer:{ '行':0 } },
  { word:'一行人', prefer:{ '行':0 } },
  { word:'行业', prefer:{ '行':1 } },
  { word:'内行', prefer:{ '行':1 } },
  { word:'外行', prefer:{ '行':1 } },
  { word:'重复', prefer:{ '重':1 } },
  { word:'重量', prefer:{ '重':0 } },
  { word:'重要', prefer:{ '重':0 } },
  { word:'重点', prefer:{ '重':0 } },
  { word:'重新', prefer:{ '重':1 } },
  { word:'还书', prefer:{ '还':1 } },
  { word:'还有', prefer:{ '还':0 } },
  { word:'还是', prefer:{ '还':0 } },
  { word:'还要', prefer:{ '还':0 } },
  { word:'归还', prefer:{ '还':1 } },
  { word:'长发', prefer:{ '长':0 } },
  { word:'长大', prefer:{ '长':1 } },
  { word:'长短', prefer:{ '长':0 } },
  { word:'长辈', prefer:{ '长':1 } },
  { word:'成长', prefer:{ '长':1 } },
  { word:'大夫', prefer:{ '大':1 } },
  { word:'大家', prefer:{ '大':0 } },
  { word:'大小', prefer:{ '大':0 } },
  { word:'大王', prefer:{ '大':0 } },
  { word:'少年', prefer:{ '少':1 } },
  { word:'多少', prefer:{ '少':0 } },
  { word:'减少', prefer:{ '少':0 } },
  { word:'少女', prefer:{ '少':1 } },
  { word:'少爷', prefer:{ '少':1 } },
  { word:'快乐', prefer:{ '乐':0 } },
  { word:'音乐', prefer:{ '乐':1 } },
  { word:'乐器', prefer:{ '乐':1 } },
  { word:'乐观', prefer:{ '乐':0 } },
  { word:'数学', prefer:{ '数':0 } },
  { word:'数一数', prefer:{ '数':1 } },
  { word:'数数', prefer:{ '数':1 } },
  { word:'几个', prefer:{ '几':0 } },
  { word:'几乎', prefer:{ '几':1 } },
  { word:'茶几', prefer:{ '几':1 } },
  { word:'都是', prefer:{ '都':0 } },
  { word:'首都', prefer:{ '都':1 } },
  { word:'都市', prefer:{ '都':1 } },
  { word:'差别', prefer:{ '差':0 } },
  { word:'差不多', prefer:{ '差':1 } },
  { word:'出差', prefer:{ '差':2 } },
  { word:'参差', prefer:{ '差':3 } },
  { word:'盛开', prefer:{ '盛':0 } },
  { word:'盛饭', prefer:{ '盛':1 } },
  { word:'没有', prefer:{ '没':0 } },
  { word:'淹没', prefer:{ '没':1 } },
  { word:'没落', prefer:{ '没':1 } },
  { word:'作为', prefer:{ '为':0 } },
  { word:'为什么', prefer:{ '为':1 } },
  { word:'为何', prefer:{ '为':1 } },
  { word:'方便', prefer:{ '便':0 } },
  { word:'便宜', prefer:{ '便':1 } },
  { word:'传说', prefer:{ '传':0 } },
  { word:'传记', prefer:{ '传':1 } },
  { word:'自传', prefer:{ '传':1 } },
  { word:'简单', prefer:{ '单':0 } },
  { word:'单于', prefer:{ '单':1 } },
  { word:'姓单', prefer:{ '单':2 } },
  { word:'解决', prefer:{ '解':0 } },
  { word:'解数', prefer:{ '解':1 } },
  { word:'押解', prefer:{ '解':2 } },
  { word:'时间', prefer:{ '间':0 } },
  { word:'离间', prefer:{ '间':1 } },
  { word:'间断', prefer:{ '间':1 } },
  { word:'干净', prefer:{ '干':0 } },
  { word:'干活', prefer:{ '干':1 } },
  { word:'教师', prefer:{ '教':0 } },
  { word:'教书', prefer:{ '教':1 } },
  { word:'力量', prefer:{ '量':0 } },
  { word:'测量', prefer:{ '量':1 } },
  { word:'将来', prefer:{ '将':0 } },
  { word:'将领', prefer:{ '将':1 } },
  { word:'睡觉', prefer:{ '觉':1 } },
  { word:'感觉', prefer:{ '觉':0 } },
  { word:'自觉', prefer:{ '觉':0 } },
  { word:'中国', prefer:{ '中':0 } },
  { word:'中奖', prefer:{ '中':1 } },
  { word:'种子', prefer:{ '种':0 } },
  { word:'种地', prefer:{ '种':1 } },
  { word:'中华', prefer:{ '华':0 } },
  { word:'华山', prefer:{ '华':1 } },
  { word:'开会', prefer:{ '会':0 } },
  { word:'会计', prefer:{ '会':1 } },
  { word:'朝阳', prefer:{ '朝':0 } },
  { word:'朝代', prefer:{ '朝':1 } },
  { word:'朝向', prefer:{ '朝':1 } },
  { word:'佛教', prefer:{ '佛':0 } },
  { word:'仿佛', prefer:{ '佛':1 } },
  { word:'汽车', prefer:{ '车':0 } },
  { word:'舍车', prefer:{ '车':1 } },
  { word:'爱好', prefer:{ '好':0 } },
  { word:'好人', prefer:{ '好':1 } },
  { word:'背心', prefer:{ '背':0 } },
  { word:'背包', prefer:{ '背':1 } },
  { word:'兴奋', prefer:{ '兴':0 } },
  { word:'高兴', prefer:{ '兴':1 } },
  { word:'弯曲', prefer:{ '曲':0 } },
  { word:'歌曲', prefer:{ '曲':1 } },
  { word:'关系', prefer:{ '系':0 } },
  { word:'系鞋带', prefer:{ '系':1 } },
  { word:'真假', prefer:{ '假':0 } },
  { word:'放假', prefer:{ '假':1 } },
  { word:'假日', prefer:{ '假':1 } },
  { word:'调查', prefer:{ '查':0,'调':1 } },
  { word:'当时', prefer:{ '当':0 } },
  { word:'上当', prefer:{ '当':1 } },
  { word:'觉得', prefer:{ '觉':0,'得':2 } },
  { word:'头发', prefer:{ '发':1 } },
  { word:'出发', prefer:{ '发':0 } },
  { word:'要求', prefer:{ '要':1 } },
  { word:'要领', prefer:{ '要':0 } },
  { word:'正在', prefer:{ '正':0 } },
  { word:'正月', prefer:{ '正':1 } },
  { word:'正月', prefer:{ '正':1 } },
  { word:'藏书', prefer:{ '藏':0 } },
  { word:'宝藏', prefer:{ '藏':1 } },
  { word:'计划', prefer:{ '划':0 } },
  { word:'划船', prefer:{ '划':1 } },
  { word:'子弹', prefer:{ '弹':0 } },
  { word:'弹琴', prefer:{ '弹':1 } },
  { word:'骨头', prefer:{ '骨':0 } },
  { word:'骨朵', prefer:{ '骨':1 } },
  { word:'露天', prefer:{ '露':0 } },
  { word:'露脸', prefer:{ '露':1 } },
  { word:'钻石', prefer:{ '钻':1 } },
  { word:'钻研', prefer:{ '钻':0 } },
  { word:'劳累', prefer:{ '累':0 } },
  { word:'积累', prefer:{ '累':1 } },
  { word:'结实', prefer:{ '结':1 } },
  { word:'结束', prefer:{ '结':0 } },
  { word:'缝补', prefer:{ '缝':1 } },
  { word:'缝隙', prefer:{ '缝':0 } },
  { word:'钉子', prefer:{ '钉':0 } },
  { word:'钉扣子', prefer:{ '钉':1 } },
  { word:'分散', prefer:{ '散':0 } },
  { word:'松散', prefer:{ '散':1 } },
  { word:'磨刀', prefer:{ '磨':0 } },
  { word:'磨坊', prefer:{ '磨':1 } },
  { word:'相同', prefer:{ '相':0 } },
  { word:'照相', prefer:{ '相':1 } },
  { word:'塞外', prefer:{ '塞':1 } },
  { word:'瓶塞', prefer:{ '塞':0 } },
  { word:'闭塞', prefer:{ '塞':2 } },
  { word:'挣扎', prefer:{ '扎':2 } },
  { word:'扎针', prefer:{ '扎':0 } },
  { word:'扎辫子', prefer:{ '扎':1 } },
  { word:'一切', prefer:{ '切':1 } },
  { word:'切开', prefer:{ '切':0 } },
  { word:'打扫', prefer:{ '扫':0 } },
  { word:'扫帚', prefer:{ '扫':1 } },
  { word:'一打', prefer:{ '打':1 } },
  { word:'打开', prefer:{ '打':0 } },
  { word:'宿舍', prefer:{ '宿':0 } },
  { word:'一宿', prefer:{ '宿':1 } },
  { word:'星宿', prefer:{ '宿':2 } },
  { word:'绿色', prefer:{ '绿':0 } },
  { word:'绿林', prefer:{ '绿':1 } },
  { word:'效率', prefer:{ '率':0 } },
  { word:'率领', prefer:{ '率':1 } },
  { word:'殷切', prefer:{ '殷':0 } },
  { word:'殷红', prefer:{ '殷':1 } },
  { word:'秘密', prefer:{ '秘':0 } },
  { word:'秘鲁', prefer:{ '秘':1 } },
  { word:'卡片', prefer:{ '卡':0 } },
  { word:'卡住', prefer:{ '卡':1 } },
  { word:'片刻', prefer:{ '片':0 } },
  { word:'相片', prefer:{ '片':1 } },
  { word:'亲密', prefer:{ '亲':0 } },
  { word:'亲家', prefer:{ '亲':1 } },
  { word:'大厦', prefer:{ '厦':0 } },
  { word:'厦门', prefer:{ '厦':1 } },
  { word:'麻雀', prefer:{ '雀':0 } },
  { word:'家雀', prefer:{ '雀':2 } },
  { word:'熟悉', prefer:{ '熟':0 } },
  { word:'面熟', prefer:{ '熟':1 } },
  { word:'似乎', prefer:{ '似':0 } },
  { word:'似的', prefer:{ '似':1 } },
  { word:'钥匙', prefer:{ '钥':1 } },
  { word:'锁钥', prefer:{ '钥':0 } },
  { word:'叶子', prefer:{ '叶':0 } },
  { word:'叶韵', prefer:{ '叶':1 } },
  { word:'缩小', prefer:{ '缩':0 } },
  { word:'缩砂', prefer:{ '缩':1 } },
  { word:'南洋', prefer:{ '南':0 } },
  { word:'南无', prefer:{ '南':1 } },
  { word:'学校', prefer:{ '校':0 } },
  { word:'校对', prefer:{ '校':1 } },
  { word:'上面', prefer:{ '上':0 } },
  { word:'上声', prefer:{ '上':1 } },
  { word:'下雨', prefer:{ '雨':0 } },
  { word:'雨雪', prefer:{ '雨':1 } },
  { word:'女儿', prefer:{ '女':0 } },
  { word:'女口', prefer:{ '女':1 } },
  { word:'儿子', prefer:{ '子':1 } },
  { word:'子弟', prefer:{ '子':0 } },
  { word:'国家', prefer:{ '家':1 } },
  { word:'家庭', prefer:{ '家':0 } }
];

const ZHUYIN: Record<string, string> = {
  'yín':'ㄧㄣˊ','xíng':'ㄒㄧㄥˊ','háng':'ㄏㄤˊ','mén':'ㄇㄣˊ','kǒu':'ㄎㄡˇ',
  'yī':'ㄧ','rén':'ㄖㄣˊ','zhèng':'ㄓㄥˋ','zhēng':'ㄓㄥ','zài':'ㄗㄞˋ',
  'zhòng':'ㄓㄨㄥˋ','chóng':'ㄔㄨㄥˊ','fù':'ㄈㄨˋ','qiáng':'ㄑㄧㄤˊ',
  'qiǎng':'ㄑㄧㄤˇ','jiàng':'ㄐㄧㄤˋ','tiáo':'ㄊㄧㄠˊ','diào':'ㄉㄧㄠˋ',
  'le':'˙ㄌㄜ','liǎo':'ㄌㄧㄠˇ','yào':'ㄧㄠˋ','yāo':'ㄧㄠ','qiú':'ㄑㄧㄡˊ',
  'měi':'ㄇㄟˇ','gè':'ㄍㄜˋ','gě':'ㄍㄜˇ','dōu':'ㄉㄡ','dū':'ㄉㄨ',
  'hái':'ㄏㄞˊ','huán':'ㄏㄨㄢˊ','shū':'ㄕㄨ','chá':'ㄔㄚˊ','zhā':'ㄓㄚ',
  'dāng':'ㄉㄤ','dàng':'ㄉㄤˋ','shí':'ㄕˊ','de':'˙ㄉㄜ','dí':'ㄉㄧˊ','dì':'ㄉㄧˋ',
  'dī':'ㄉㄧ','bèi':'ㄅㄟˋ','bēi':'ㄅㄟ','jǐng':'ㄐㄧㄥˇ','dà':'ㄉㄚˋ',
  'dài':'ㄉㄞˋ','tài':'ㄊㄞˋ','jiā':'ㄐㄧㄚ','jia':'˙ㄐㄧㄚ','jie':'˙ㄐㄧㄝ',
  'jué':'ㄐㄩㄝˊ','jiào':'ㄐㄧㄠˋ','dé':'ㄉㄜˊ','děi':'ㄉㄟˇ',
  'cháng':'ㄔㄤˊ','zhǎng':'ㄓㄤˇ','tóu':'ㄊㄡˊ','tou':'˙ㄊㄡ',
  'fā':'ㄈㄚ','fà':'ㄈㄚˋ','shǎo':'ㄕㄠˇ','shào':'ㄕㄠˋ','nián':'ㄋㄧㄢˊ',
  'zhēn':'ㄓㄣ','hǎo':'ㄏㄠˇ','hào':'ㄏㄠˋ','kàn':'ㄎㄢˋ','kān':'ㄎㄢ',
  'chū':'ㄔㄨ','xī':'ㄒㄧ','huì':'ㄏㄨㄟˋ','kuài':'ㄎㄨㄞˋ','chéng':'ㄔㄥˊ',
  'wéi':'ㄨㄟˊ','wèi':'ㄨㄟˋ','míng':'ㄇㄧㄥˊ','fū':'ㄈㄨ','fú':'ㄈㄨˊ',
  'zǒu':'ㄗㄡˇ','lù':'ㄌㄨˋ','tā':'ㄊㄚ','men':'˙ㄇㄣ','xìng':'ㄒㄧㄥˋ',
  'qíng':'ㄑㄧㄥˊ','shì':'ㄕˋ','wǒ':'ㄨㄛˇ','nǐ':'ㄋㄧˇ',
  'zhè':'ㄓㄜˋ','zhèi':'ㄓㄟˋ','nà':'ㄋㄚˋ','nǎ':'ㄋㄚˇ','nèi':'ㄋㄟˋ',
  'nā':'ㄋㄚ','něi':'ㄋㄟˇ','né':'ㄋㄜˊ','nǎi':'ㄋㄞˇ','lái':'ㄌㄞˊ',
  'qù':'ㄑㄩˋ','shuō':'ㄕㄨㄛ','shuì':'ㄕㄨㄟˋ','yuè':'ㄩㄝˋ','huà':'ㄏㄨㄚˋ',
  'tīng':'ㄊㄧㄥ','chī':'ㄔ','hē':'ㄏㄜ','péng':'ㄆㄥˊ','yǒu':'ㄧㄡˇ',
  'bà':'ㄅㄚˋ','mā':'ㄇㄚ','gē':'ㄍㄜ','jiě':'ㄐㄧㄝˇ','dì':'ㄉㄧˋ',
  'mèi':'ㄇㄟˋ','yé':'ㄧㄝˊ','nǎi':'ㄋㄞˇ','ér':'ㄦˊ','nǚ':'ㄋㄩˇ',
  'rǔ':'ㄖㄨˇ','zǐ':'ㄗˇ','zi':'˙ㄗ','hái':'ㄏㄞˊ','bǎo':'ㄅㄠˇ',
  'guó':'ㄍㄨㄛˊ','xué':'ㄒㄩㄝˊ','xiào':'ㄒㄧㄠˋ','jiào':'ㄐㄧㄠˋ',
  'lǎo':'ㄌㄠˇ','shī':'ㄕ','shēng':'ㄕㄥ','rì':'ㄖˋ',
  'yuè':'ㄩㄝˋ','jiān':'ㄐㄧㄢ','jiàn':'ㄐㄧㄢˋ','shàng':'ㄕㄤˋ',
  'shǎng':'ㄕㄤˇ','xià':'ㄒㄧㄚˋ','zuǒ':'ㄗㄨㄛˇ','yòu':'ㄧㄡˋ',
  'qián':'ㄑㄧㄢˊ','hòu':'ㄏㄡˋ','dōng':'ㄉㄨㄥ','xī':'ㄒㄧ','nán':'ㄋㄢˊ',
  'běi':'ㄅㄟˇ','měi':'ㄇㄟˇ','xiǎo':'ㄒㄧㄠˇ','duō':'ㄉㄨㄛ','jīn':'ㄐㄧㄣ',
  'míng':'ㄇㄧㄥˊ','zuó':'ㄗㄨㄛˊ','tiān':'ㄊㄧㄢ','fēng':'ㄈㄥ',
  'yǔ':'ㄩˇ','yù':'ㄩˋ','xuě':'ㄒㄩㄝˇ','yún':'ㄩㄣˊ','shān':'ㄕㄢ',
  'shuǐ':'ㄕㄨㄟˇ','huǒ':'ㄏㄨㄛˇ','tǔ':'ㄊㄨˇ','mù':'ㄇㄨˋ',
  'hé':'ㄏㄜˊ','hǎi':'ㄏㄞˇ','jiāng':'ㄐㄧㄤ','hú':'ㄏㄨˊ','hóng':'ㄏㄨㄥˊ',
  'huáng':'ㄏㄨㄤˊ','lán':'ㄌㄢˊ','bái':'ㄅㄞˊ','hēi':'ㄏㄟ','lǜ':'ㄌㄩˋ',
  'lù':'ㄌㄨˋ','zǐ':'ㄗˇ','fěn':'ㄈㄣˇ','bù':'ㄅㄨˋ','bú':'ㄅㄨˊ',
  'fǒu':'ㄈㄡˇ','zhōng':'ㄓㄨㄥ','zhòng':'ㄓㄨㄥˋ','zhǒng':'ㄓㄨㄥˇ',
  'huá':'ㄏㄨㄚˊ','zhāo':'ㄓㄠ','cháo':'ㄔㄠˊ','fó':'ㄈㄛˊ','fú':'ㄈㄨˊ',
  'chē':'ㄔㄜ','jū':'ㄐㄩ','xīng':'ㄒㄧㄥ','qū':'ㄑㄩ','qǔ':'ㄑㄩˇ',
  'xì':'ㄒㄧˋ','jì':'ㄐㄧˋ','jiǎ':'ㄐㄧㄚˇ','jià':'ㄐㄧㄚˋ','néng':'ㄋㄥˊ',
  'nài':'ㄋㄞˋ','zuò':'ㄗㄨㄛˋ','zuō':'ㄗㄨㄛ','juàn':'ㄐㄩㄢˋ',
  'juǎn':'ㄐㄩㄢˇ','guān':'ㄍㄨㄢ','guàn':'ㄍㄨㄢˋ','gèng':'ㄍㄥˋ',
  'gēng':'ㄍㄥ','nán':'ㄋㄢˊ','nàn':'ㄋㄢˋ','sè':'ㄙㄜˋ','shǎi':'ㄕㄞˇ',
  'shén':'ㄕㄣˊ','shí':'ㄕˊ','me':'˙ㄇㄜ','mó':'ㄇㄛˊ','yāo':'ㄧㄠ',
  'hé':'ㄏㄜˊ','hè':'ㄏㄜˋ','huó':'ㄏㄨㄛˊ','huò':'ㄏㄨㄛˋ','hú':'ㄏㄨˊ',
  'kōng':'ㄎㄨㄥ','kòng':'ㄎㄨㄥˋ','kǒng':'ㄎㄨㄥˇ','ba':'˙ㄅㄚ',
  'bā':'ㄅㄚ','gěi':'ㄍㄟˇ','jǐ':'ㄐㄧˇ','guò':'ㄍㄨㄛˋ','guo':'˙ㄍㄨㄛ',
  'guō':'ㄍㄨㄛ','bó':'ㄅㄛˊ','báo':'ㄅㄠˊ','bò':'ㄅㄛˋ','è':'ㄜˋ',
  'wù':'ㄨˋ','ě':'ㄜˇ','wū':'ㄨ','sù':'ㄙㄨˋ','xiǔ':'ㄒㄧㄡˇ',
  'xiù':'ㄒㄧㄡˋ','ào':'ㄠˋ','ǎo':'ㄠˇ','niù':'ㄋㄧㄡˋ','ài':'ㄞˋ',
  'yì':'ㄧˋ','pù':'ㄆㄨˋ','bào':'ㄅㄠˋ','tà':'ㄊㄚˋ','dá':'ㄉㄚˊ',
  'lǜ':'ㄌㄩˋ','shuài':'ㄕㄨㄞˋ','yīn':'ㄧㄣ','yān':'ㄧㄢ','yǐn':'ㄧㄣˇ',
  'mì':'ㄇㄧˋ','bì':'ㄅㄧˋ','niào':'ㄋㄧㄠˋ','suī':'ㄙㄨㄟ','kǎ':'ㄎㄚˇ',
  'qiǎ':'ㄑㄧㄚˇ','piàn':'ㄆㄧㄢˋ','piān':'ㄆㄧㄢ','qīn':'ㄑㄧㄣ',
  'qìng':'ㄑㄧㄥˋ','qiě':'ㄑㄧㄝˇ','jū':'ㄐㄩ','ōu':'ㄡ','shà':'ㄕㄚˋ',
  'xià':'ㄒㄧㄚˋ','què':'ㄑㄩㄝˋ','qiāo':'ㄑㄧㄠ','qiǎo':'ㄑㄧㄠˇ',
  'shú':'ㄕㄨˊ','shóu':'ㄕㄡˊ','sì':'ㄙˋ','shì':'ㄕˋ','suō':'ㄙㄨㄛ',
  'yè':'ㄧㄝˋ','xié':'ㄒㄧㄝˊ','yīng':'ㄧㄥ','bǔ':'ㄅㄨˇ',
  'qǐng':'ㄑㄧㄥˇ','wèn':'ㄨㄣˋ','gāo':'ㄍㄠ','ǎi':'ㄞˇ','tiào':'ㄊㄧㄠˋ',
  'pǎo':'ㄆㄠˇ','lóng':'ㄌㄨㄥˊ','hǔ':'ㄏㄨˇ','xióng':'ㄒㄩㄥˊ',
  'jī':'ㄐㄧ','lù':'ㄌㄨˋ','yú':'ㄩˊ','niǎo':'ㄋㄧㄠˇ',
  'chóng':'ㄔㄨㄥˊ','cǎo':'ㄘㄠˇ','shù':'ㄕㄨˋ','huā':'ㄏㄨㄚ',
  'lè':'ㄌㄜˋ','shù':'ㄕㄨˋ','shǔ':'ㄕㄨˇ','shuò':'ㄕㄨㄛˋ','jǐ':'ㄐㄧˇ',
  'jī':'ㄐㄧ','chā':'ㄔㄚ','chà':'ㄔㄚˋ','chāi':'ㄔㄞ','cī':'ㄘ',
  'shèng':'ㄕㄥˋ','chéng':'ㄔㄥˊ','méi':'ㄇㄟˊ','mò':'ㄇㄛˋ',
  'biàn':'ㄅㄧㄢˋ','pián':'ㄆㄧㄢˊ','chuán':'ㄔㄨㄢˊ','zhuàn':'ㄓㄨㄢˋ',
  'dān':'ㄉㄢ','chán':'ㄔㄢˊ','shàn':'ㄕㄢˋ','xiè':'ㄒㄧㄝˋ','jiè':'ㄐㄧㄝˋ',
  'gān':'ㄍㄢ','gàn':'ㄍㄢˋ','liàng':'ㄌㄧㄤˋ','liáng':'ㄌㄧㄤˊ',
  'jiāng':'ㄐㄧㄤ','jiàng':'ㄐㄧㄤˋ','cāng':'ㄘㄤ','zàng':'ㄗㄤˋ',
  'huà':'ㄏㄨㄚˋ','huá':'ㄏㄨㄚˊ','fèng':'ㄈㄥˋ','féng':'ㄈㄥˊ',
  'dàn':'ㄉㄢˋ','tán':'ㄊㄢˊ','gǔ':'ㄍㄨˇ','gū':'ㄍㄨ','lòu':'ㄌㄡˋ',
  'huá':'ㄏㄨㄚˊ','zuān':'ㄗㄨㄢ','zuàn':'ㄗㄨㄢˋ','lèi':'ㄌㄟˋ',
  'lěi':'ㄌㄟˇ','léi':'ㄌㄟˊ','jié':'ㄐㄧㄝˊ','jiē':'ㄐㄧㄝ',
  'dǎ':'ㄉㄚˇ','qiē':'ㄑㄧㄝ','sǎo':'ㄙㄠˇ','sào':'ㄙㄠˋ',
  'sāi':'ㄙㄞ','sài':'ㄙㄞˋ','sè':'ㄙㄜˋ','zhā':'ㄓㄚ','zā':'ㄗㄚ',
  'zhá':'ㄓㄚˊ','xiāng':'ㄒㄧㄤ','xiàng':'ㄒㄧㄤˋ','mó':'ㄇㄛˊ',
  'mò':'ㄇㄛˋ','sàn':'ㄙㄢˋ','sǎn':'ㄙㄢˇ','dīng':'ㄉㄧㄥ',
  'dìng':'ㄉㄧㄥˋ','yìng':'ㄧㄥˋ','ruǎn':'ㄖㄨㄢˇ'
};

const RARE_PINYIN: Record<string, string> = {
  '囧':'jiǒng','槑':'méi','烎':'yín','玊':'sù','忈':'rén','炛':'guāng',
  '兲':'tiān','恏':'hào','奣':'wěng','孬':'nāo','甭':'béng','巭':'bū',
  '囍':'xǐ','喆':'zhé','囙':'yīn','囜':'nín','圙':'lüè','圐':'kū',
  '坔':'dì','埊':'dì','壵':'zhuàng','尛':'mó','孖':'mā','奀':'ēn',
  '猋':'biāo','骉':'biāo','麤':'cū','羴':'shān','鱻':'xiān','龘':'dá',
  '靐':'bìng','飍':'xiū','飝':'fēi','虤':'yán','驫':'biāo','厵':'yuán',
  '灥':'xún','籴':'dí','粜':'tiào','汆':'cuān','氽':'tǔn','蕈':'xùn',
  '彳':'chì','亍':'chù','孑':'jié','孓':'jué','耄':'mào','耋':'dié',
  '饕':'tāo','餮':'tiè','囹':'líng','圄':'yǔ','觊':'jì','觎':'yú',
  '龃':'jǔ','龉':'yǔ','桎':'zhì','梏':'gù','佝':'gōu','偻':'lóu',
  '啙':'zǐ','窳':'yǔ','呶':'náo','咻':'xiū','哓':'xiāo','咤':'zhà',
  '哢':'lòng','唛':'mài','啵':'bo','啹':'jú','喺':'xí','嘅':'kǎi',
  '嗰':'gě','嘢':'yě','瞓':'fèn','攰':'guì','脷':'lì','簕':'lè',
  '艿':'nǎi','芏':'dù','芐':'hù','芘':'pí','芧':'zhù','苊':'è',
  '苉':'pǐ','苘':'qǐng','荍':'qiáo','荑':'yí','莕':'xìng','菳':'qín',
  '菽':'shū','萏':'dàn','萋':'qī','菁':'jīng','菅':'jiān','萲':'xuān',
  '蕴':'yùn','薤':'xiè','藿':'huò','蘧':'qú','蘩':'fán','虉':'yì',
  '艽':'jiāo','芎':'xiōng','芪':'qí','芫':'yuán','苻':'fú','苓':'líng',
  '茑':'niǎo','茚':'yìn','茆':'máo','茔':'yíng','茕':'qióng','茧':'jiǎn',
  '荆':'jīng','荐':'jiàn','荜':'bì','荭':'hóng','荮':'zhòu','荽':'suī',
  '莅':'lì','莆':'pú','莨':'làng','莪':'é','茉':'mò','茗':'míng',
  '茝':'chǎi','莩':'piǎo','莘':'shēn','莞':'guǎn','莶':'xiān','荻':'dí',
  '荼':'tú','菥':'xī','菘':'sōng','菝':'bá','菖':'chāng','菰':'gū',
  '菡':'hàn','葜':'qiā','葑':'fēng','葚':'shèn','蒡':'bàng','蓓':'bèi',
  '蓊':'wěng','蓿':'xu','蔸':'dōu','蕨':'jué','蕲':'qí','薷':'rú',
  '藉':'jiè','藐':'miǎo','藓':'xiǎn','藠':'jiào','藜':'lí','藤':'téng',
  '蘅':'héng','蘖':'niè','蕊':'ruǐ','苡':'yǐ','苷':'gān','莓':'méi',
  '荠':'jì','茭':'jiāo','茨':'cí','茹':'rú','茈':'zǐ','茖':'gè',
  '荢':'zì','荥':'xíng','荤':'hūn','荧':'yíng','荨':'qián','荩':'jìn',
  '荪':'sūn','荫':'yīn','荬':'mǎi','荴':'fū','莎':'shā','荺':'yǔn',
  '莹':'yíng','萩':'qiū','萳':'nán','葆':'bǎo','蒋':'jiǎng','蒌':'lóu',
  '蓝':'lán','蓟':'jì','蓣':'yù','蓥':'yíng','蓦':'mò','蔷':'qiáng',
  '蔹':'liǎn','蓼':'liǎo','蔻':'kòu','蔼':'ǎi','蕖':'qú','瘪':'biě',
  '瘃':'zhú','瘗':'yì','瘾':'yǐn','瘳':'chōu','瘴':'zhàng','瘵':'zhài',
  '瘸':'qué','瘼':'mò','瘿':'yǐng','癀':'huáng','癃':'lóng','癌':'ái',
  '痖':'yǎ','疵':'cī','痏':'wěi','疸':'dǎn','疹':'zhěn','疽':'jū',
  '痉':'jìng','痊':'quán','痍':'yí','痒':'yǎng','痕':'hén','痘':'dòu',
  '痛':'tòng','痢':'lì','痣':'zhì','痤':'cuó','痫':'xián','痧':'shā',
  '痹':'bì','瘅':'dàn','瘆':'shèn','瘀':'yū','瘊':'hóu','瘥':'chài',
  '瘘':'lòu','瘦':'shòu','疟':'nüè','痂':'jiā','疳':'gān','疴':'kē',
  '疝':'shàn','疡':'yáng','疔':'dīng','疖':'jiē','疗':'liáo','疙':'gē',
  '疚':'jiù','痄':'zhà','疱':'pào','痃':'xuán','疰':'zhù','痱':'fèi',
  '痼':'gù','痿':'wěi','瘁':'cuì','瘐':'yǔ','瘛':'chì','瘢':'bān',
  '瘠':'jí','瘤':'liú','癔':'yì','癖':'pǐ','癜':'diàn','癞':'lài',
  '癣':'xuǎn','颧':'quán','颞':'niè','颡':'sǎng','顸':'hān','顼':'xū',
  '颀':'qí','颃':'háng','颉':'jié','颍':'yǐng','颔':'hàn','颏':'kē',
  '颐':'yí','频':'pín','颓':'tuí','颊':'jiá','颚':'è','颛':'zhuān',
  '颜':'yán','额':'é','颟':'mān','颠':'diān','嚣':'xiāo','颢':'hào',
  '颣':'lèi','颤':'chàn','颥':'rú','颦':'pín','饔':'yōng',
  '曩':'nǎng','曷':'hé','昱':'yù','昶':'chǎng','昵':'nì','昭':'zhāo',
  '昴':'mǎo','昃':'zè','昕':'xīn','昙':'tán','杲':'gǎo','昝':'zǎn',
  '暹':'xiān','曰':'yuē','曳':'yè','乇':'tuō','乜':'miē',
  '亟':'jí','亓':'qí','亘':'gèn','亚':'yà','些':'xiē','亡':'wáng',
  '交':'jiāo','亥':'hài','亦':'yì','产':'chǎn','亨':'hēng',
  '亩':'mǔ','享':'xiǎng','亭':'tíng','亮':'liàng','亳':'bó',
  '亵':'xiè','亶':'dǎn','儆':'jǐng','僭':'jiàn','僰':'bó',
  '儇':'xuān','儡':'lěi','兀':'wù','其':'qí','冀':'jì','冢':'zhǒng',
  '冤':'yuān','冥':'míng','冦':'kòu','冬':'dōng','冯':'féng',
  '冰':'bīng','冲':'chōng','决':'jué','况':'kuàng','冶':'yě',
  '冷':'lěng','冻':'dòng','冼':'xiǎn','冽':'liè','净':'jìng',
  '凄':'qī','凉':'liáng','凌':'líng','凋':'diāo','减':'jiǎn',
  '凑':'còu','凛':'lǐn','凝':'níng','憾':'hàn','懂':'dǒng',
  '懒':'lǎn','懔':'lǐn','懦':'nuò','懵':'měng','戆':'gàng',
  '懿':'yì','蘸':'zhàn','乂':'yì','爻':'yáo','冇':'mǎo','冏':'jiǒng'
};

function isCJKChar(ch: string): boolean {
  if (!ch) return false;
  const code = ch.charCodeAt(0);
  return (code >= 0x4E00 && code <= 0x9FFF) ||
         (code >= 0x3400 && code <= 0x4DBF) ||
         (code >= 0x20000 && code <= 0x2A6DF) ||
         (code >= 0xF900 && code <= 0xFAFF);
}

function isRareChar(ch: string): boolean {
  if (!isCJKChar(ch)) return false;
  const code = ch.charCodeAt(0);
  if (!PINYIN[ch]) return true;
  if (code >= 0x9FA0) return true;
  return false;
}

export default function PinyinAnnotator({ locale = 'zh' }: PinyinAnnotatorProps) {
  const [inputText, setInputText] = useState('');
  const [formatMode, setFormatMode] = useState<FormatMode>('ruby');
  const [zhuyinMode, setZhuyinMode] = useState<ZhuyinMode>('no');
  const [markMode, setMarkMode] = useState<MarkMode>('poly');
  const [results, setResults] = useState<CharResult[]>([]);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const getT = useCallback((loc: string) => {
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
  }, []);

  const t = getT(locale);

  const analyzeText = useCallback((text: string): CharResult[] => {
    const chars = Array.from(text);
    const charResults: CharResult[] = chars.map((char) => ({
      char,
      pinyin: '',
      zhuyin: '',
      isPoly: false,
      isRare: false,
      selectedIdx: 0,
      alternatives: [],
      skip: false,
    }));

    const usedIndexes = new Set<number>();
    for (const rule of POLY_WORDS) {
      const wordLen = rule.word.length;
      for (let i = 0; i <= chars.length - wordLen; i++) {
        const slice = chars.slice(i, i + wordLen).join('');
        if (slice === rule.word) {
          for (let j = 0; j < wordLen; j++) {
            const idx = i + j;
            if (usedIndexes.has(idx)) continue;
            const c = rule.word[j];
            const pref = rule.prefer[c];
            if (pref !== undefined && PINYIN[c]) {
              usedIndexes.add(idx);
              const pyArr = PINYIN[c];
              const safeIdx = Math.min(Math.max(0, pref), pyArr.length - 1);
              const py = pyArr[safeIdx];
              charResults[idx].pinyin = py;
              charResults[idx].zhuyin = ZHUYIN[py] || '';
              charResults[idx].isPoly = pyArr.length > 1;
              charResults[idx].selectedIdx = safeIdx;
              charResults[idx].alternatives = pyArr;
              charResults[idx].skip = true;
            }
          }
        }
      }
    }

    for (let i = 0; i < charResults.length; i++) {
      const r = charResults[i];
      if (r.skip) continue;
      const ch = r.char;
      if (!isCJKChar(ch)) {
        r.skip = true;
        continue;
      }

      const pyArr = PINYIN[ch];
      if (pyArr && pyArr.length > 0) {
        r.isPoly = pyArr.length > 1;
        r.pinyin = pyArr[0];
        r.zhuyin = ZHUYIN[pyArr[0]] || '';
        r.selectedIdx = 0;
        r.alternatives = pyArr;
      }

      if (!pyArr || pyArr.length === 0) {
        r.isRare = isRareChar(ch);
        if (r.isRare) {
          const rarePy = RARE_PINYIN[ch] || '查字典';
          r.pinyin = rarePy;
          r.zhuyin = ZHUYIN[rarePy] || '';
          r.alternatives = [rarePy];
          r.selectedIdx = 0;
        }
      } else if (isRareChar(ch) && pyArr.length === 1) {
        r.isRare = true;
      }
    }

    return charResults;
  }, []);

  const processed = useMemo(() => {
    if (!inputText) return [];
    return analyzeText(inputText);
  }, [inputText, analyzeText]);

  const displayResults = useMemo(() => {
    if (!markMode || markMode === 'poly') {
      return processed;
    }
    return processed;
  }, [processed, markMode]);

  const shouldMarkChar = (r: CharResult): boolean => {
    if (!isCJKChar(r.char)) return false;
    if (markMode === 'all') {
      return r.isPoly || r.isRare || (r.pinyin && r.alternatives.length > 0);
    }
    return r.isPoly || r.isRare;
  };

  const stats = useMemo(() => {
    let polyCount = 0;
    let rareCount = 0;
    for (const r of displayResults) {
      if (r.isPoly && isCJKChar(r.char)) polyCount++;
      if (r.isRare && isCJKChar(r.char)) rareCount++;
    }
    return { polyCount, rareCount };
  }, [displayResults]);

  const cyclePron = (idx: number, direction: 1 | -1) => {
    setResults((prev) => {
      const base = prev.length > 0 ? prev : displayResults;
      const next = [...base];
      const r = { ...next[idx] };
      if (r.alternatives.length > 1) {
        r.selectedIdx =
          (r.selectedIdx + direction + r.alternatives.length) % r.alternatives.length;
        r.pinyin = r.alternatives[r.selectedIdx];
        r.zhuyin = ZHUYIN[r.pinyin] || '';
      }
      next[idx] = r;
      return next;
    });
  };

  const activeResults = results.length > 0 ? results : displayResults;

  const renderAnnotated = () => {
    return activeResults.map((r, idx) => {
      if (!isCJKChar(r.char)) {
        return (
          <span key={idx} className="whitespace-pre-wrap">
            {r.char}
          </span>
        );
      }

      const mark = shouldMarkChar(r);
      if (!mark && markMode === 'poly' && !r.isRare) {
        return (
          <span key={idx} className="whitespace-pre-wrap">
            {r.char}
          </span>
        );
      }

      const isPoly = r.isPoly;
      const isRare = r.isRare;

      if (formatMode === 'ruby') {
        const rtContent =
          zhuyinMode === 'both' && r.zhuyin
            ? `${r.pinyin} ${r.zhuyin}`
            : r.pinyin;

        return (
          <span
            key={idx}
            className={`inline-flex flex-col items-center cursor-pointer select-none px-0.5 rounded transition-all hover:scale-105 ${
              isPoly
                ? 'bg-orange-100 dark:bg-orange-900/40 ring-1 ring-orange-300 dark:ring-orange-700'
                : isRare
                ? 'bg-green-100 dark:bg-green-900/40 ring-1 ring-green-300 dark:ring-green-700'
                : ''
            }`}
            onClick={() => (r.alternatives.length > 1 ? cyclePron(idx, 1) : null)}
            title={
              r.alternatives.length > 1
                ? r.alternatives.join(' / ')
                : r.pinyin
            }
          >
            <ruby className="text-lg sm:text-xl leading-none">
              {r.char}
              <rt className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-medium">
                {rtContent}
              </rt>
            </ruby>
          </span>
        );
      }

      return (
        <span
          key={idx}
          className={`inline-block cursor-pointer select-none rounded px-0.5 transition-all hover:scale-105 ${
            isPoly
              ? 'bg-orange-100 dark:bg-orange-900/40 ring-1 ring-orange-300 dark:ring-orange-700'
              : isRare
              ? 'bg-green-100 dark:bg-green-900/40 ring-1 ring-green-300 dark:ring-green-700'
              : ''
          }`}
          onClick={() => (r.alternatives.length > 1 ? cyclePron(idx, 1) : null)}
          title={r.alternatives.length > 1 ? r.alternatives.join(' / ') : r.pinyin}
        >
          <span className="text-lg sm:text-xl">{r.char}</span>
          <span className="text-xs text-purple-700 dark:text-purple-300 font-medium ml-0.5">
            (
            {zhuyinMode === 'both' && r.zhuyin
              ? `${r.pinyin}${r.zhuyin}`
              : r.pinyin}
            )
          </span>
        </span>
      );
    });
  };

  const generateTextOutput = (): string => {
    let out = '';
    for (const r of activeResults) {
      if (!isCJKChar(r.char)) {
        out += r.char;
        continue;
      }
      const mark = shouldMarkChar(r);
      if (!mark && markMode === 'poly' && !r.isRare) {
        out += r.char;
        continue;
      }
      if (formatMode === 'ruby') {
        const rt = zhuyinMode === 'both' && r.zhuyin ? `${r.pinyin} ${r.zhuyin}` : r.pinyin;
        out += `<ruby>${r.char}<rt>${rt}</rt></ruby>`;
      } else {
        const py = zhuyinMode === 'both' && r.zhuyin ? `${r.pinyin}${r.zhuyin}` : r.pinyin;
        out += `${r.char}(${py})`;
      }
    }
    return out;
  };

  const generateHtmlOutput = (): string => {
    let out = '';
    for (const r of activeResults) {
      if (!isCJKChar(r.char)) {
        out += r.char;
        continue;
      }
      const mark = shouldMarkChar(r);
      if (!mark && markMode === 'poly' && !r.isRare) {
        out += r.char;
        continue;
      }
      const rt = zhuyinMode === 'both' && r.zhuyin ? `${r.pinyin} ${r.zhuyin}` : r.pinyin;
      const cls = r.isPoly ? 'poly' : r.isRare ? 'rare' : '';
      out += `<ruby class="${cls}">${r.char}<rt>${rt}</rt></ruby>`;
    }
    return out;
  };

  const generateMarkdownOutput = (): string => {
    const md = [];
    md.push('# 拼音标注结果');
    md.push('');
    md.push('**原文**:');
    md.push('');
    md.push('> ' + inputText);
    md.push('');
    md.push('**标注结果**:');
    md.push('');
    md.push('```html');
    md.push(generateHtmlOutput());
    md.push('```');
    md.push('');
    md.push('---');
    md.push('');
    md.push(`- 多音字: ${stats.polyCount}`);
    md.push(`- 生僻字: ${stats.rareCount}`);
    md.push(`- 格式: ${formatMode === 'ruby' ? 'Ruby HTML' : '内联括号'}`);
    md.push(`- 注音: ${zhuyinMode === 'both' ? '拼音+注音' : '仅拼音'}`);
    return md.join('\n');
  };

  const copyToClipboard = async (text: string, type: 'text' | 'html') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'text') {
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
      } else {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      }
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (type === 'text') {
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
      } else {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      }
    }
  };

  const exportMarkdown = () => {
    const md = generateMarkdownOutput();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pinyin-annotated.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInputText(t('sampleText'));
    setResults([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        <main className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {t('title')}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('subtitle')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('input')}
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setResults([]);
                  }}
                  placeholder={t('placeHolder')}
                  className="w-full h-56 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none leading-relaxed"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={loadSample}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {t('sample')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      {t('formatMode')}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFormatMode('ruby')}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          formatMode === 'ruby'
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {t('rubyTopBottom')}
                      </button>
                      <button
                        onClick={() => setFormatMode('inline')}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          formatMode === 'inline'
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {t('inlineBracket')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      {t('outputZhuyin')}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setZhuyinMode('no')}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          zhuyinMode === 'no'
                            ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {t('zhuyinNo')}
                      </button>
                      <button
                        onClick={() => setZhuyinMode('both')}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          zhuyinMode === 'both'
                            ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {t('zhuyinBoth')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      &nbsp;
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setMarkMode('poly')}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          markMode === 'poly'
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {t('markPolyOnly')}
                      </button>
                      <button
                        onClick={() => setMarkMode('all')}
                        className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          markMode === 'all'
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                      >
                        {t('markAll')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-emerald-50 dark:from-orange-900/20 dark:to-emerald-900/20 border border-orange-200/50 dark:border-orange-800/30">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {t('markCount', { n: stats.polyCount, m: stats.rareCount })}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-200/60 dark:bg-orange-800/40 text-orange-800 dark:text-orange-200">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    {t('legendPoly')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-200/60 dark:bg-green-800/40 text-green-800 dark:text-green-200">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {t('legendRare')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-200/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    {t('legendNormal')}
                  </span>
                </div>
              </div>

              {inputText && (
                <div className="p-2 sm:p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    <span className="text-base">💡</span>
                    {t('correctWord')}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('outputDisplay')}
                </label>
                <div className="min-h-[200px] p-4 sm:p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 leading-loose tracking-wide">
                  {inputText ? (
                    <div className="space-y-1">{renderAnnotated()}</div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic">
                      {t('placeHolder')}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => copyToClipboard(generateTextOutput(), 'text')}
                  disabled={!inputText}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  {copiedText ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {t('copyText')}
                </button>
                <button
                  onClick={() => copyToClipboard(generateHtmlOutput(), 'html')}
                  disabled={!inputText}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  {copiedHtml ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {t('copyHtml')}
                </button>
                <button
                  onClick={exportMarkdown}
                  disabled={!inputText}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-md shadow-emerald-500/25"
                >
                  <Download className="h-4 w-4" />
                  {t('exportMarkdown')}
                </button>
              </div>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4">
          <div className="card p-4 sm:p-6 space-y-4 sticky top-24">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" />
                {t('title')}
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <span>
                    {locale === 'zh'
                      ? '智能多音词语境识别（100+ 词库规则）'
                      : locale === 'en'
                      ? 'Smart context-aware polyphone detection (100+ rules)'
                      : 'Smart context detection'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <span>
                    {locale === 'zh'
                      ? '支持 400+ 常用字 / 300+ 生僻字拼音库'
                      : locale === 'en'
                      ? '400+ common chars & 300+ rare chars dictionary'
                      : 'Comprehensive character dictionary'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <span>
                    {locale === 'zh'
                      ? '可点击汉字循环切换候选读音'
                      : locale === 'en'
                      ? 'Click char to cycle alternative pronunciations'
                      : 'Interactive pronunciation selection'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <span>
                    {locale === 'zh'
                      ? 'HTML Ruby / 内联括号 双格式输出'
                      : locale === 'en'
                      ? 'HTML Ruby & inline bracket output'
                      : 'Dual format output'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <span>
                    {locale === 'zh'
                      ? '可选注音符号（Bopomofo）双标注'
                      : locale === 'en'
                      ? 'Optional Zhuyin (Bopomofo) annotations'
                      : 'Bilingual pinyin support'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  <span>
                    {locale === 'zh'
                      ? '一键复制 HTML / 导出 Markdown'
                      : locale === 'en'
                      ? 'One-click copy & Markdown export'
                      : 'Easy export options'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200/50 dark:border-orange-800/30">
              <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2">
                {locale === 'zh'
                  ? '典型使用场景'
                  : locale === 'en'
                  ? 'Typical Use Cases'
                  : 'Use Cases'}
              </h4>
              <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1.5">
                <li>
                  •{' '}
                  {locale === 'zh'
                    ? '小红书 / B站 知识视频脚本'
                    : locale === 'en'
                    ? 'Tutorial video scripts'
                    : 'Tutorial scripts'}
                </li>
                <li>
                  •{' '}
                  {locale === 'zh'
                    ? '教辅材料 / 儿童拼音读物'
                    : locale === 'en'
                    ? 'Educational materials'
                    : 'Educational content'}
                </li>
                <li>
                  •{' '}
                  {locale === 'zh'
                    ? '古诗文生僻字注音'
                    : locale === 'en'
                    ? 'Classical Chinese annotation'
                    : 'Classical texts'}
                </li>
                <li>
                  •{' '}
                  {locale === 'zh'
                    ? '对外汉语教学备课'
                    : locale === 'en'
                    ? 'Chinese language teaching'
                    : 'Language teaching'}
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
