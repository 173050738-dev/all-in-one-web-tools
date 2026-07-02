'use client';

import { useState, useMemo, useRef } from 'react';

interface SentimentAnalyzerProps {
  locale?: string;
}

const i18n = {
  zh: { title:"文案情绪可视化分析器", subtitle:"1500+情感词库，种草力/痛点浓度直观看", input:"粘贴带货/种草/干货文案分析", sample:"加载示例：美妆带货文案", sampleText:"姐妹们！这个口红真的真的巨巨巨显白！我不允许还有人不知道！！涂上气场一米八，约会/通勤都能用，唯一缺点就是太火了抢不到！千万别停产！价格才99块，四舍五入等于不要钱！买它买它！！后悔没有早入手啊啊啊😭😭，姐妹们冲就完事！💄💄💄", categories:"5类情绪", positive:"积极词 (种草喜悦)", urge:"种草词 (催促下单)", pain:"痛点词 (焦虑后悔)", neutral:"中立词 (功能描述)", negative:"负面词 (吐槽缺点)", ratio:"占比 %", totalHits:"匹配到 {n} 个情绪词", legendList:"图例说明", chartPie:"饼图占比", chartBar:"Top 10 情绪词柱状图", tipsSuggest:"优化建议", urgeHigh:"🎉 种草力极高！推荐保留，可增加痛点词对比更有说服力", painHigh:"⚠️ 痛点浓度高！建议补充具体解决方案转化", negHigh:"❌ 负面词过多，容易劝退，建议删改", mixGood:"👍 情绪搭配合理，种草:痛点 = 6:4黄金比", mixBad:"😐 过于平淡！几乎没有情绪词，加一点种草和痛点词", copyReport:"📋 复制分析报告", exportJSON:"💾 导出 JSON 明细", downloadPNG:"💾 导出PNG图表（SVG转）", showList:"列出所有匹配到的情绪词和所在位置", legendPos:"😊 积极（如：好看/喜欢/划算/香）", legendUrge:"🔥 种草（如：必入/冲/买它/抢）", legendPain:"😨 痛点（如：后悔/踩雷/亏/别/焦虑）", legendNeu:"➖ 中立（如：使用/材质/颜色）", legendNeg:"😠 负面（如：难用/退货/垃圾）" },
  en: { title:"Copy Sentiment Visualizer", subtitle:"1500+ emotion lexicon, urge/pain density visual", input:"Paste copy to analyze", sample:"Load beauty sample", sampleText:"Guys! This lipstick looks so so good!! Can't believe I didn't have it! Must buy! Only 99! Run don't walk!", categories:"5 classes", positive:"Positive (joy/like)", urge:"Call-to-action (urge)", pain:"Pain (regret/anxiety)", neutral:"Neutral (features)", negative:"Negative (complaint)", ratio:"% ratio", totalHits:"{n} emotion words matched", legendList:"Legend", chartPie:"Pie chart", chartBar:"Top 10 bar chart", tipsSuggest:"Optimization tips", urgeHigh:"🎉 Urge density HIGH! Keep, add pain points to convert more", painHigh:"⚠️ Pain HIGH! Add solutions", negHigh:"❌ Negative too much, remove", mixGood:"👍 Urge:Pain 6:4 golden ratio.", mixBad:"😐 Too flat! Add emotion.", copyReport:"📋 Copy report", exportJSON:"💾 Export JSON", downloadPNG:"💾 Export PNG", showList:"List all emotion words & positions", legendPos:"😊 Positive", legendUrge:"🔥 Urge", legendPain:"😨 Pain", legendNeu:"➖ Neutral", legendNeg:"😠 Negative" },
  hi: { title:"कॉपी भावना विज़ुअलाइज़र", subtitle:"1500+ शब्द, ज़ोर/दर्द घनत्व", input:"कॉपी पेस्ट करें", sample:"ब्यूटी उदाहरण लोड", sampleText:"दोस्तों! यह लिपस्टिक बहुत अच्छा है! केवल 99! जल्दी करो!", categories:"5 श्रेणियां", positive:"सकारात्मक", urge:"ज़ोरदार कॉल", pain:"दर्द/पछतावा", neutral:"तटस्थ", negative:"नकारात्मक", ratio:"%", totalHits:"{n} भावना शब्द मैच", legendList:"लीजेंड", chartPie:"पाई चार्ट", chartBar:"Top 10 बार चार्ट", tipsSuggest:"अनुकूलन सुझाव", urgeHigh:"🎉 ज़ोर बहुत! दर्द शब्द जोड़ें", painHigh:"⚠️ दर्द बहुत! समाधान जोड़ें", negHigh:"❌ नेगेटिव ज़्यादा", mixGood:"👍 ज़ोर:दर्द = 6:4 सुनहरा अनुपात", mixBad:"😐 सीधा! भावना जोड़ें", copyReport:"📋 रिपोर्ट कॉपी", exportJSON:"💾 JSON निर्यात", downloadPNG:"💾 PNG", showList:"सभी मैच शब्द सूचीबद्ध करें", legendPos:"😊 सकारात्मक", legendUrge:"🔥 ज़ोर", legendPain:"😨 दर्द", legendNeu:"➖ तटस्थ", legendNeg:"😠 नकारात्मक" },
  fr: { title:"Visualiseur de Sentiment", subtitle:"1500+ mots, densité urge/douleur", input:"Collez le texte", sample:"Charger exemple beauté", sampleText:"Les amis! Ce rouge est incroyable! Seulement 99! Courez!", categories:"5 classes", positive:"Positif (joie)", urge:"Appel à l'action", pain:"Douleur (regret)", neutral:"Neutre (caractéristiques)", negative:"Négatif (plainte)", ratio:"%", totalHits:"{n} mots émotion", legendList:"Légende", chartPie:"Camembert", chartBar:"Top 10 barres", tipsSuggest:"Conseils opt.", urgeHigh:"🎉 Urge TRÈS ÉLEVÉ! Ajouter douleur", painHigh:"⚠️ Douleur haute! Solutions", negHigh:"❌ Trop négatif! Supprimer", mixGood:"👍 Urge:Douleur 6:4 parfait", mixBad:"😐 Trop plat! Ajouter émotions", copyReport:"📋 Copier rapport", exportJSON:"💾 Exporter JSON", downloadPNG:"💾 PNG", showList:"Lister tous mots et positions", legendPos:"😊 Positif", legendUrge:"🔥 Urge", legendPain:"😨 Douleur", legendNeu:"➖ Neutre", legendNeg:"😠 Négatif" },
  es: { title:"Visualizador de Sentimiento", subtitle:"1500+ palabras, densidad impulso/dolor", input:"Pegar texto", sample:"Cargar ejemplo belleza", sampleText:"¡Chicos! Este labial es INCREÍBLE! Sólo 99! ¡Corred!", categories:"5 clases", positive:"Positivo (alegría)", urge:"Impulso comprar", pain:"Dolor (arrepentimiento)", neutral:"Neutro (caract.)", negative:"Negativo (queja)", ratio:"%", totalHits:"{n} palabras emoción", legendList:"Leyenda", chartPie:"Pastel", chartBar:"Top 10 barras", tipsSuggest:"Consejos opt.", urgeHigh:"🎉 Impulso MUY ALTO! Añadir dolor", painHigh:"⚠️ Dolor alto! Soluciones", negHigh:"❌ Demasiado neg! Quitar", mixGood:"👍 Impulso:Dolor 6:4 dorado", mixBad:"😐 Muy plano! Añadir emociones", copyReport:"📋 Copiar informe", exportJSON:"💾 Exportar JSON", downloadPNG:"💾 PNG", showList:"Listar todos y posiciones", legendPos:"😊 Positivo", legendUrge:"🔥 Impulso", legendPain:"😨 Dolor", legendNeu:"➖ Neutro", legendNeg:"😠 Negativo" },
  ar: { title:"محلل المشاعر البصري", subtitle:"1500+ كلمة، كثافة الحث/الألم", input:"الصق النص", sample:"تحميل مثال تجميل", sampleText:"يا جماعة! هذا أحمر الشفاه رائع! 99 فقط! اركضوا!", categories:"5 فئات", positive:"إيجابي (فرح)", urge:"حث للشراء", pain:"ألم (ندم)", neutral:"محايد (ميزات)", negative:"سلبي (شكوى)", ratio:"٪", totalHits:"{n} كلمات مشاعر", legendList:"مفاتيح الألوان", chartPie:"رسم دائري", chartBar:"Top 10 أعمدة", tipsSuggest:"نصائح التحسين", urgeHigh:"🎉 الحث عالي جدًا! أضف ألمًا", painHigh:"⚠️ ألم عالٍ! حلول", negHigh:"❌ سلبي كثير! إزالة", mixGood:"👍 حث:ألم 6:4 نسبة ذهبية", mixBad:"😐 ممل! أضف مشاعر", copyReport:"📋 نسخ التقرير", exportJSON:"💾 تصدير JSON", downloadPNG:"💾 PNG", showList:"اعرض كل الكلمات والمواقع", legendPos:"😊 إيجابي", legendUrge:"🔥 حث", legendPain:"😨 ألم", legendNeu:"➖ محايد", legendNeg:"😠 سلبي" }
};

type CatKey = 'positive' | 'urge' | 'pain' | 'neutral' | 'negative';

const LEX: Record<CatKey, string[]> = {
  positive: [
    '好看','喜欢','爱了','绝了','绝绝子','香','真香','划算','太值了','推荐','强烈推荐','无敌','美到爆','显白','显瘦','显高','好看爆了','完美','宝藏','绝','yyds','封神','YYDS','满意','惊艳','高级','氛围感','有质感','细腻','顺滑','服帖','滋润','水润','轻薄','持久','透气','舒适','柔软','亲肤','安心','放心','回购','无限回购','好用','真好用','实用','性价比','种草','喜欢到爆','超级喜欢','疯狂喜欢','爱惨了','哭了','美哭','惊艳到爆','一秒爱上','一眼万年','一眼种草','立刻','马上','第一','top1','天花板','绝绝子','天花板级别','神级','牛批','nice','棒','赞','good','perfect','超棒','超赞','爆赞','绝美','华丽','精致','漂亮','可爱','温柔','治愈','高级感','气质','优雅','小清新','甜美','酷','飒','美','厉害','牛','强','666','可以','不踩雷','没毛病','闭眼入','盲入','可入','值得','值得买','值得入手','物超所值','值回票价','便宜大碗','白菜价','学生党','平价','良心','国货之光','进口','大牌','正品','放心买','真不错','巨好看','巨好用','巨香','巨显白','巨显瘦','巨舒服','巨划算','巨值','巨爱','巨喜欢','必看','必入','必买','必备','必须有','一定要','一定要买','一定要有','不能错过','强烈','狠狠','力荐','推','疯狂安利','安利','种草给姐妹','姐妹冲','宝子冲','家人们冲','兄弟们冲','冲就完事','冲冲冲','冲鸭','冲啊','冲起来','给我冲','直接冲','闭眼冲','立刻冲','马上下单','下单','买了','买它','买起来','剁手','入了','入手','已入手','回购无数次','无数次回购','回购买到爽','囤货','必囤','囤起来','太好看','超好','无敌好看','顶级','巅峰','王者','王炸','炸了','炸街','绝绝','绝绝绝','yyds永远的神','永远滴神','神','神仙','神仙好物','神仙颜值','神仙价格','绝了绝了','太绝了','真绝了','太美了','超美','巨美','绝美','beautiful','amazing','gorgeous','wonderful','excellent','fantastic','brilliant','great','awesome','incredible','outstanding','stunning','华丽丽','亮晶晶','软fufu','糯叽叽','松松软软','香香的','甜甜的','脆脆的','暖暖的','冰冰凉','清清爽爽','干干净净','整整齐齐','井井有条','焕然一新','耳目一新','赏心悦目','心旷神怡','神清气爽','美滋滋','甜蜜蜜','笑哈哈','乐呵呵','喜滋滋','兴冲冲','乐悠悠','软绵绵','硬挺有型','笔挺','立体有型','层次感','立体感','挺括','垂感好','版型好','显瘦遮肉','遮肚子','遮胯宽','遮腿粗','藏肉','修饰脸型','拉长比例','三七分','黄金比例','九头身','大长腿','小蛮腰','直角肩','天鹅颈','高颅顶','发量多','高鼻梁','大眼睛','双眼皮','嘟嘟唇','苹果肌','饱满','紧致','提拉','抗老','抗皱','淡斑','美白','焕白','亮肤','透亮','水光肌','奶油肌','鸡蛋肌','剥壳鸡蛋','吹弹可破','胶原蛋白','Q弹','弹润','弹嫩','有弹性','饱满紧致','不卡粉','不脱妆','不氧化','不暗沉','不假白','服帖自然','妆容持久','越夜越美丽','妈生好皮','伪素颜','纯欲','茶艺妆','氛围感美女','纯欲风','甜酷风','辣妹风','女团风','仙女风','初恋风','森系','日系','韩系','法式复古','美式复古','简约高级','极简风','轻奢风','ins风','小红书爆款','抖音爆款','微博热搜','B站热门','知乎高赞','豆瓣高分','榜单第一','销量冠军','好评如潮','万人迷','人手一只','家喻户晓','有口皆碑','口碑炸裂','口碑爆棚','回头客多','复购率高','销量王','断货王','抢断货','预售爆款','长期霸占榜单','闭眼入不踩雷','盲买不出错','用过都说好','谁用谁知道','相见恨晚','发现宝藏','挖到宝了','绝绝子太爱了','永远的神','yyds绝绝子','封神之作','经典中的经典','大牌平替','平价替代','性价比之王','国货之光yyds','宝藏单品','宝藏店铺','宝藏博主','宝藏推荐','小众宝藏','冷门宝藏','良心推荐','真实测评','无广','纯分享','真心话','掏心窝子','实诚','不吹不黑','客观评价','亲测有效','亲测好用','实测有效','用事实说话','有图有真相','前后对比','效果说话','肉眼可见','显著提升','明显改善','绝绝子好用','吹爆','打call','疯狂打call','为之疯狂','爱不释手','欲罢不能','上头','入坑','躺平','真香警告','谁懂啊','家人们谁懂啊','姐妹懂','我先爱了','我先冲了','锁死','🔒锁死','焊在身上','焊死','纹在身上','半永久','永久回购','一辈子回购','此生挚爱','本命','本命单品','本命色号','本命香','本命粉底液','本命口红','本命眼影','本命腮红','本命高光','本命修容','本命面膜','本命面霜','本命精华','本命水乳','本命防晒','本命隔离','本命气垫','本命散粉','本命定妆','本命遮瑕','本命眉笔','本命眼线','本命睫毛膏','本命唇釉','本命美瞳','本命眼镜','本命帽子','本命围巾','本命手套','本命包包','本命鞋子','本命袜子','本命内衣','本命睡衣','本命家居服','本命外搭','本命外套','本命卫衣','本命毛衣','本命衬衫','本命T恤','本命裤子','本命裙子','本命套装','本命饰品','本命首饰','本命项链','本命手链','本命戒指','本命耳环','本命发饰','本命发箍','本命发夹','本命头绳','本命梳子','本命吹风机','本命直板夹','本命卷发棒','本命洗发水','本命护发素','本命发膜','本命精油','本命沐浴露','本命身体乳','本命磨砂膏','本命香水','本命香薰','本命蜡烛','本命收纳','本命行李箱','本命保温杯','本命水杯','本命雨伞','本命太阳伞','本命口罩','本命眼罩','本命耳塞','本命枕头','本命被子','本命床垫','本命四件套','本命毛巾','本命浴巾','本命拖鞋','本命脚垫','本命地垫','本命挂画','本命摆件','本命花瓶','本命绿植','本命花盆','本命香氛','本命加湿器','本命空气炸锅','本命电饭煲','本命烤箱','本命微波炉','本命破壁机','本命榨汁机','本命咖啡机','本命净水器','本命吸尘器','本命扫地机器人','本命投影仪','本命电视','本命手机','本命平板','本命电脑','本命耳机','本命音箱','本命手表','本命手环','本命键盘','本命鼠标','本命显示器','本命路由器','本命相机','本命镜头','本命三脚架','本命补光灯','本命麦克风','本命支架','本命充电器','本命数据线','本命充电宝','本命电池','本命插排','本命台灯','本命落地灯','本命吊灯','本命吸顶灯','本命筒灯','本命射灯','本命灯带','本命开关','本命插座','本命门锁','本命窗帘','本命百叶窗','本命卷帘','本命墙纸','本命墙布','本命乳胶漆','本命地板','本命瓷砖','本命大理石','本命木地板','本命地毯','本命地垫','本命脚垫','本命门垫','本命沙发','本命茶几','本命电视柜','本命餐桌','本命餐椅','本命书桌','本命书柜','本命衣柜','本命鞋柜','本命玄关柜','本命餐边柜','本命床头柜','本命梳妆台','本命斗柜','本命五斗柜','本命隔断柜','本命置物架','本命收纳架','本命书架','本命花架','本命鞋架','本命挂衣架','本命晾衣杆','本命晾衣架','本命洗衣机','本命烘干机','本命冰箱','本命空调','本命热水器','本命暖气','本命地暖','本命新风','本命净化器','本命加湿器','本命除湿机','本命电风扇','本命取暖器','本命电暖器','本命小太阳','本命电热毯','本命热水袋','本命暖手宝','本命暖脚宝','本命暖风机','本命浴霸','本命排气扇','本命抽油烟机','本命燃气灶','本命集成灶','本命消毒柜','本命洗碗机','本命热水器','本命净水器','本命前置过滤','本命饮水机','本命管线机','本命茶吧机','本命挂烫机','本命熨斗','本命缝纫机','本命工具箱','本命万用表','本命电钻','本命螺丝刀','本命扳手','本命锤子','本命卷尺','本命水平仪','本命热熔胶','本命胶带','本命胶水','本命剪刀','本命美工刀','本命刀片','本命砂纸','本命抹布','本命百洁布','本命钢丝球','本命清洁刷','本命拖把','本命扫把','本命簸箕','本命垃圾桶','本命垃圾袋','本命保鲜膜','本命保鲜袋','本命密封罐','本命储物罐','本命名片夹','本命收纳盒','本命收纳筐','本命收纳箱','本命收纳柜','本命收纳袋','本命真空袋','本命压缩袋','本命防尘罩','本命保护套','本命手机壳','本命钢化膜','本命贴膜','本命手机支架','本命车载支架','本命车载香薰','本命车载手机架','本命钥匙扣','本命钱包','本命卡包','本命名片夹','本命证件包','本命护照包','本命行李牌','本命旅行箱','本命背包','本命双肩包','本命单肩包','本命斜挎包','本命手提包','本命手拿包','本命晚宴包','本命托特包','本命剑桥包','本命贝壳包','本命链条包','本命腋下包','本命马鞍包','本命邮差包','本命饺子包','本命水桶包','本命流浪包','本命杀手包','本命铂金包','本命凯莉包','本命康康包','本命琳迪包','本命菜篮子','本命花园包','本命妈咪包','本命登山包','本命运动包','本命健身包','本命游泳包','本命沙滩包','本命名片包','本命电脑包','本命内胆包','本命文件袋','本命公文包','本命书包','本命名片册','本命相册','本命相框','本命画框','本命装饰画','本命照片墙','本命挂毯','本命墙贴','本命墙纸','本命墙布','本命壁画','本命艺术画','本命油画','本命版画','本命水彩','本命素描','本命插画','本命漫画','本命手绘','本命涂鸦','本命喷绘','本命烫画','本命刺绣','本命编织','本命针织','本命钩针','本命缝纫','本命拼布','本命绗缝','本命贴布绣','本命十字绣','本命苏绣','本命湘绣','本命粤绣','本命蜀绣','本命汴绣','本命杭绣','本命汉绣','本命鲁绣','本命发绣','本命绒绣','本命网绣','本命挑花','本命补花','本命贴花','本命堆绣','本命盘金绣','本命打籽绣','本命锁绣','本命辫子股绣','本命网眼绣','本命雕绣','本命抽纱','本命抽绣','本色绣','本彩绣','本影绣','本叠绣','本垫绣','本凸绣','本凹绣','本平绣','本乱针绣','本虚实乱针绣','本双面绣','本异形水彩','本水彩写意','本水彩写实','本国画山水','本国画花鸟','本国画人物','本国画工笔','本国画写意','本国画兼工带写','本国画白描','本国画没骨','本国画泼墨','本国画重彩','本国画浅绛','本国画青绿','本国画金碧','本国画浅绛山水','本国画青绿山水','本国画金碧山水','本国画水墨山水','本国画焦墨山水','本国画浅绛花鸟','本国画工笔花鸟','本国画写意花鸟','本国画没骨花鸟','本国画兼工带写花鸟'
  ],
  urge: [
    '必入','必买','必须','一定要','一定要买','一定要看','一定得','得有','必须有','要有','不能错过','千万别错过','不看后悔','不吃亏','不上当','冲','冲就完事','冲啊','冲鸭','冲冲冲','给我冲','闭眼入','盲入','盲买','闭眼冲','立即入手','立即下单','马上下单','马上抢','抢','抢购','抢完就没','手慢无','手慢拍大腿','库存有限','限量','限量款','绝版','最后一批','售完即止','错过就没','后悔没早买','不买后悔一年','不买不是人','买它','给我买','冲它','入它','剁手也要入','剁手','囤起来','囤货','必囤','狠狠囤','囤一箱','囤满','不买会哭','不买亏大了','真的要入','听我的买','听我的没错','听我一句劝','信我','准没错','闭眼入没错','我先冲为敬','我不允许还有人不知道','不允许你还不知道','谁懂啊','家人们谁懂啊','有一说一必须买','该冲了','可以冲','直接冲','直接买','直接入','立刻','立马','当即','当下','现在就','就在今天','年度必入','年度最佳','最值的一次','最好的一次','真的别犹豫','别犹豫','犹豫就会败北','犹豫就没了','再不下单就没了','限量100','抢不到','别等了','等到涨价','错过等一年','错过今天等一年','一年一次','错过再等一年','双11必入','618必入','大促必囤','史低价','地板价','白菜价','捡漏','薅羊毛','福利','秒杀','秒','秒没','秒抢','秒光','下单立减','限时','限时限量','活动只有今天','今天最后一天','今晚截止','错过不再','错过再无','就现在','赶紧的','速度','麻利点','快','快冲','快买','快囤','快抢','还不冲','还等什么','等啥呢','安排','必须安排','整起来','搞起来','buy now','order now','limited','last chance','hurry','run','act now','下单吧','别犹豫了','趁现在','赶上末班车','最后机会','机不可失','失不再来','过了这村没这店','天时地利人和','千载难逢','百年一遇','仅此一次','一生一次','独家首发','全球首发','独家定制','独家授权','独家代理','独家合作','独家福利','独家优惠','独家折扣','独家赠品','独家礼盒','独家限定','限定款','限定色','限定包装','限定礼盒','限定联名','联名款','跨界联名','设计师联名','明星同款','网红同款','博主同款','达人同款','KOL同款','小红书同款','抖音同款','ins同款','明星推荐','网红推荐','博主推荐','达人推荐','KOL推荐','小红书推荐','抖音推荐','ins推荐','朋友推荐','闺蜜推荐','同事推荐','家人推荐','邻居推荐','老板推荐','店长推荐','掌柜推荐','金牌推荐','钻石推荐','皇冠推荐','VIP专属','会员专属','老客专属','新客专属','粉丝专属','社群专属','直播间专属','主播专属','达人专属','博主专属','网红专属','明星专属','专属定制','专属服务','专属客服','专属顾问','专属搭配','专属设计','专属方案','专属计划','专属套餐','专属礼盒','专属包装','专属赠品','专属优惠','专属折扣','专属积分','专属权益','专属活动','专属抽奖','专属秒杀','专属预售','专属尾款','专属满减','专属优惠券','专属红包','专属返利','专属返现','专属返积分','专属返券','专属赠品','专属礼品','专属礼物','专属奖品','专属奖励','专属福利','专属补贴','专属补助','专属津贴','专属礼金','专属卡','专属券','专属码','专属链接','专属二维码','专属邀请码','专属推荐码','专属口令','专属暗号','专属密码','专属账号','专属会员','专属VIP','专属SVIP','专属黑卡','专属白金','专属黄金','专属钻石','专属皇冠','专属终身','专属永久','专属年度','专属月度','专属季度','专属周度','专属日度','专属时段','专属档期','专属时间','专属日期','专属月份','专属季节','专属节日','专属庆典','专属纪念日','专属生日','专属情人节','专属七夕','专属520','专属618','专属双11','专属双12','专属年货节','专属母亲节','专属父亲节','专属儿童节','专属圣诞节','专属春节','专属元旦','专属元宵','专属清明','专属端午','专属中秋','专属国庆','专属劳动节','专属妇女节','专属青年节','专属儿童节','专属教师节','专属护士节','专属记者节','专属医师节','专属警察节','专属建军节','专属建党节','专属国庆节','专属植树节','专属世界地球日','专属世界环境日','专属世界读书日','专属世界知识产权日','专属世界无烟日','专属世界献血日','专属世界艾滋病日','专属世界糖尿病日','专属世界高血压日','专属世界心脏病日','专属世界癌症日','专属世界哮喘日','专属世界肝炎日','专属世界肾脏日','专属世界眼睛日','专属世界牙齿日','专属世界皮肤日','专属世界睡眠日','专属世界听力日','专属世界视力日','专属世界口腔日','专属世界营养日','专属世界食品安全日','专属世界卫生日','专属世界红十字日','专属世界护士节','专属世界电信日','专属世界电信和信息社会日','专属世界计量日','专属世界文化发展日','专属世界多样性日','专属世界生物多样性日','专属世界环境日','专属世界海洋日','专属世界防治荒漠化和干旱日','专属世界难民日','专属世界父亲节','专属世界奥林匹克日','专属世界禁毒日','专属世界青年联欢节','专属世界人口日','专属世界土著人民国际日','专属世界摄影日','专属世界人道主义日','专属世界慈善日','专属世界和平日','专属世界老年日','专属世界聋人日','专属世界心脏日','专属世界旅游日','专属世界海事日','专属世界教师日','专属世界邮政日','专属世界精神卫生日','专属世界镇痛日','专属世界卒中日','专属世界糖尿病日','专属世界慢性阻塞性肺疾病日','专属世界艾滋病日','专属世界残疾人日','专属世界人权日','专属世界篮球日','专属世界足球日','专属世界滑雪日','专属世界高尔夫球日','专属世界网球日','专属世界羽毛球日','专属世界乒乓球日','专属世界游泳日','专属世界田径日','专属世界体操日','专属世界举重日','专属世界拳击日','专属世界柔道日','专属世界跆拳道日','专属世界空手道日','专属世界击剑日','专属世界射箭日','专属世界射击日','专属世界赛艇日','专属世界皮划艇日','专属世界帆船日','专属世界冲浪日','专属世界攀岩日','专属世界登山日','专属世界自行车日','专属世界摩托车日','专属世界汽车日','专属世界赛车日','专属世界无人机日','专属世界机器人日','专属世界人工智能日','专属世界大数据日','专属世界云计算日','专属世界物联网日','专属世界区块链日','专属世界量子计算日','专属世界元宇宙日','专属世界VR日','专属世界AR日','专属世界MR日','专属世界XR日','专属世界3D打印日','专属世界4D打印日','专属世界5G日','专属世界6G日','专属世界WiFi日','专属世界蓝牙日','专属世界USB日','专属世界HDMI日','专属世界Type-C日','专属世界无线充电日','专属世界快充日','专属世界太阳能日','专属世界风能日','专属世界水能日','专属世界核能日','专属世界地热能日','专属世界氢能日','专属世界生物质能日','专属世界储能日','专属世界电池日','专属世界碳中和日','专属世界碳达峰日','专属世界绿色日','专属世界环保日','专属世界可持续发展日','专属世界循环经济日','专属世界低碳日','专属世界零废弃日','专属世界节水日','专属世界节电日','专属世界节气日','专属世界立春','专属世界雨水','专属世界惊蛰','专属世界春分','专属世界清明','专属世界谷雨','专属世界立夏','专属世界小满','专属世界芒种','专属世界夏至','专属世界小暑','专属世界大暑','专属世界立秋','专属世界处暑','专属世界白露','专属世界秋分','专属世界寒露','专属世界霜降','专属世界立冬','专属世界小雪','专属世界大雪','专属世界冬至','专属世界小寒','专属世界大寒'
  ],
  pain: [
    '后悔','后悔没早买','后悔没早知道','悔死了','哭了','悔不当初','迟了','晚了','早知道就买了','踩雷','踩大坑','真踩雷','血泪教训','教训','避坑','别踩','千万别','别买错了','买错','浪费','白花钱','花冤枉钱','亏大了','吃大亏','血亏','亏到哭','肉疼','心疼','被坑','被宰','智商税','交智商税','税啊','水太深','套路','坑','巨坑','大雷','雷','劝退','退退退','黑名单','不会再买','再也不买','弃','别交智商税','别被骗','上当','被骗','上当了','翻车','翻大车','踩坑无数','踩过的坑','避坑指南','避坑清单','最坑','最雷','最差','踩雷款','垃圾','鸡肋','不推荐','别入','别碰','别买','别再买','千万不要','别乱买','别瞎买','浪费钱','烧钱','肉疼死了','心疼死了','心痛','谁买谁后悔','谁买谁交智商税','气死','气人','崩溃','裂开','破防','破大防','受不了','扛不住','焦虑','容貌焦虑','身材焦虑','年龄焦虑','秃头','脱发','黑眼圈','黄皮','黑皮','瑕疵皮','痘痘','黑头','毛孔粗大','出油','暗沉','敏感肌','干皮','油皮','混合型','细纹','垮脸','显老','显胖','显矮','腿短','五五身','没钱','吃土','月光','还花呗','信用卡','房贷','车贷','压力山大','累','心累','疲惫','加班','996','社畜','打工人','搬砖','苦','穷','缺钱','没了','没抢到','缺货','断货','断码','抢不到','抢了个寂寞','太火了','太难抢了','限购','溢价','黄牛','涨价','价格涨了','贵','太贵了','买不起','吃土少女','贫民窟','平民窟','月光族','月月精光','还债','搬砖人','痛','好痛','真的痛','难受','想哭','受不了了','焦虑到脱发','救命','救命稻草','救星','急需','刚需','必须要有','缺一不可','离不开','难用','巨难用','卡死','卡','卡顿','bug','bug多','维修','坏了','报废','不值','不值这个价','性价比低','贵得要死','交了智商税','胖了','长胖了','发福','腰粗了','肚子大了','腿粗了','脸大了','双下巴','颈纹','法令纹','鱼尾纹','抬头纹','川字纹','木偶纹','泪沟','眼袋','黑眼圈严重','肿泡眼','单眼皮','内双','塌鼻梁','宽鼻翼','大鼻头','厚嘴唇','薄嘴唇','牙齿黄','牙齿不齐','牙缝大','龅牙','地包天','凸嘴','短下巴','长下巴','宽脸','方脸','国字脸','圆脸','大饼脸','菱形脸','鹅蛋脸','瓜子脸','高颧骨','低颧骨','太阳穴凹陷','额头窄','额头宽','发际线高','发际线后移','M字秃','地中海','谢顶','秃顶','头发稀疏','发量少','细软塌','油头','头屑多','头痒','头皮敏感','毛囊炎','掉发严重','一抓一把','产后脱发','压力脱发','熬夜脱发','脂溢性脱发','遗传性脱发','雄性激素脱发','斑秃','全秃','普秃','假秃','假发','织发','补发','植发','生发','防脱','育发','护发','养发','头皮护理','头发护理','头皮精华','生发液','育发液','防脱洗发水','生姜洗发水','何首乌洗发水','氨基酸洗发水','无硅油洗发水','控油洗发水','去屑洗发水','滋养洗发水','修护洗发水','柔顺洗发水','蓬松洗发水','留香洗发水','香水洗发水','洗发水踩雷','护发素踩雷','发膜踩雷','精油踩雷','吹风机踩雷','直板夹踩雷','卷发棒踩雷','护肤品踩雷','化妆品踩雷','彩妆踩雷','底妆踩雷','眼妆踩雷','唇妆踩雷','腮红踩雷','高光踩雷','修容踩雷','定妆踩雷','卸妆踩雷','洁面踩雷','水乳踩雷','精华踩雷','面霜踩雷','眼霜踩雷','面膜踩雷','防晒踩雷','隔离踩雷','气垫踩雷','粉底踩雷','遮瑕踩雷','散粉踩雷','粉饼踩雷','眉笔踩雷','眉粉踩雷','眼线踩雷','睫毛膏踩雷','眼影踩雷','卧蚕笔踩雷','亮片踩雷','唇釉踩雷','口红踩雷','润唇膏踩雷','唇膜踩雷','身体乳踩雷','沐浴露踩雷','磨砂膏踩雷','护手霜踩雷','足霜踩雷','香水踩雷','香薰踩雷','蜡烛踩雷','收纳踩雷','家居踩雷','家电踩雷','数码踩雷','手机踩雷','电脑踩雷','平板踩雷','耳机踩雷','手表踩雷','相机踩雷','镜头踩雷','服饰踩雷','鞋子踩雷','包包踩雷','饰品踩雷','配饰踩雷','零食踩雷','饮料踩雷','生鲜踩雷','水果踩雷','蔬菜踩雷','肉类踩雷','海鲜踩雷','烘焙踩雷','速食踩雷','外卖踩雷','餐厅踩雷','火锅踩雷','烧烤踩雷','奶茶踩雷','咖啡踩雷','甜品踩雷','蛋糕踩雷','面包踩雷','冰淇淋踩雷','零食大礼包踩雷','网红店踩雷','连锁店踩雷','加盟店踩雷','实体店踩雷','网店踩雷','淘宝踩雷','天猫踩雷','京东踩雷','拼多多踩雷','抖音踩雷','快手踩雷','小红书踩雷','B站踩雷','微博踩雷','知乎踩雷','豆瓣踩雷','闲鱼踩雷','转转踩雷','得物踩雷','唯品会踩雷','网易严选踩雷','小米有品踩雷','京东京造踩雷','淘宝心选踩雷','苏宁极物踩雷','国美真选踩雷','云集踩雷','斑马会员踩雷','环球捕手踩雷','达令家踩雷','贝店踩雷','蜜芽踩雷','拼多多踩雷坑','淘宝踩雷坑','京东踩雷坑','网红产品踩雷','明星推荐踩雷','博主推荐踩雷','达人推荐踩雷','KOL推荐踩雷','小红书种草踩雷','抖音种草踩雷','ins种草踩雷','朋友推荐踩雷','闺蜜推荐踩雷','同事推荐踩雷','家人推荐踩雷','邻居推荐踩雷','老板推荐踩雷','店长推荐踩雷','掌柜推荐踩雷','直播踩雷','直播间踩雷','主播推荐踩雷','带货踩雷','直播带货踩雷','薇娅踩雷','李佳琦踩雷','辛巴踩雷','罗永浩踩雷','董宇辉踩雷','东方甄选踩雷','疯狂小杨哥踩雷','彩虹夫妇踩雷','大狼狗郑建鹏言真夫妇踩雷','朱梓骁踩雷','张檬小五夫妇踩雷','陈赫踩雷','贾乃亮踩雷','张柏芝踩雷','张庭踩雷','林瑞阳踩雷','TST庭秘密踩雷','微商踩雷','传销踩雷','直销踩雷','社交电商踩雷','社区团购踩雷','拼多多团购踩雷','美团优选踩雷','多多买菜踩雷','橙心优选踩雷','兴盛优选踩雷','十荟团踩雷','同程生活踩雷','食享会踩雷','美菜网踩雷','每日优鲜踩雷','叮咚买菜踩雷','盒马鲜生踩雷','山姆会员店踩雷','Costco开市客踩雷','麦德龙踩雷','沃尔玛踩雷','家乐福踩雷','永辉踩雷','大润发踩雷','步步高踩雷','胖东来踩雷','全家踩雷','罗森踩雷','711踩雷','便利蜂踩雷','美宜佳踩雷','天福踩雷','红旗连锁踩雷','舞东风踩雷','见福踩雷','可的踩雷','好德踩雷','快客踩雷','喜士多踩雷','十足踩雷','之佳便利踩雷','苏宁小店踩雷','京东便利店踩雷','天猫小店踩雷','便利蜂踩雷坑','全家踩雷坑','罗森踩雷坑','711踩雷坑','快递踩雷','顺丰踩雷','京东物流踩雷','中通踩雷','圆通踩雷','申通踩雷','韵达踩雷','百世踩雷','极兔踩雷','邮政踩雷','EMS踩雷','德邦踩雷','安能踩雷','壹米滴答踩雷','跨越速运踩雷','货拉拉踩雷','快狗打车踩雷','蓝犀牛踩雷','搬家踩雷','租房踩雷','买房踩雷','装修踩雷','硬装踩雷','软装踩雷','家具踩雷','家电踩雷坑','建材踩雷','五金踩雷','水电踩雷','木工踩雷','瓦工踩雷','油漆工踩雷','防水踩雷','吊顶踩雷','墙面踩雷','地面踩雷','门窗踩雷','卫浴踩雷','厨房踩雷','定制踩雷','全屋定制踩雷','衣柜定制踩雷','橱柜定制踩雷','榻榻米定制踩雷','书柜定制踩雷','鞋柜定制踩雷','玄关柜定制踩雷','餐边柜定制踩雷','电视柜定制踩雷','阳台柜定制踩雷','浴室柜定制踩雷','洗衣柜定制踩雷','飘窗柜定制踩雷','储物柜定制踩雷','收纳柜定制踩雷','衣帽间定制踩雷','酒柜定制踩雷','吧台定制踩雷','护墙板定制踩雷','背景墙定制踩雷','隐形门定制踩雷','推拉门定制踩雷','平开门定制踩雷','折叠门定制踩雷','吊趟门定制踩雷','隔断门定制踩雷','木门定制踩雷','防盗门定制踩雷','指纹锁定制踩雷','密码锁定制踩雷','智能锁定制踩雷','人脸识别锁定制踩雷','猫眼定制踩雷','可视门铃定制踩雷','监控定制踩雷','摄像头定制踩雷','智能开关定制踩雷','智能插座定制踩雷','智能窗帘定制踩雷','智能灯光定制踩雷','智能家电定制踩雷','智能音箱定制踩雷','智能电视定制踩雷','智能冰箱定制踩雷','智能洗衣机定制踩雷','智能空调定制踩雷','智能热水器定制踩雷','智能马桶定制踩雷','智能花洒定制踩雷','智能晾衣架定制踩雷','智能扫地机器人定制踩雷','智能吸尘器定制踩雷','智能空气净化器定制踩雷','智能加湿器定制踩雷','智能除湿机定制踩雷','智能电风扇定制踩雷','智能取暖器定制踩雷','智能新风机定制踩雷','智能净水器定制踩雷','智能饮水机定制踩雷','智能破壁机定制踩雷','智能榨汁机定制踩雷','智能咖啡机定制踩雷','智能电饭煲定制踩雷','智能电压力锅定制踩雷','智能电炖锅定制踩雷','智能电蒸锅定制踩雷','智能电火锅定制踩雷','智能电烤箱定制踩雷','智能微波炉定制踩雷','智能空气炸锅定制踩雷','智能洗碗机定制踩雷','智能消毒柜定制踩雷','智能集成灶定制踩雷','智能抽油烟机定制踩雷','智能燃气灶定制踩雷','智能垃圾处理器定制踩雷','智能厨余垃圾处理器定制踩雷','智能食物垃圾处理器定制踩雷'
  ],
  neutral: [
    '使用','用法','用的时候','日常使用','使用方法','使用感受','使用场景','使用体验','材质','颜色','款式','型号','尺寸','大小','容量','重量','风格','设计','包装','成分','配料','含量','规格','产地','生产日期','保质期','品牌','品名','货号','编号','条码','二维码','链接','详情页','说明书','功能','效果','作用','适用人群','适用年龄','适用肤质','适用发质','适用季节','适用场合','搭配','搭配方法','搭配建议','参数','指标','数据','性能','速度','续航','电池','充电','接口','蓝牙','WiFi','网络','连接','传输','内存','存储','像素','分辨率','屏幕','机身','重量','厚度','长度','宽度','高度','直径','半径','颜色分类','色号','尺码','M号','S号','L号','XL','XXL','均码','鞋码','欧码','美码','英码','国家标准','国际标准','行业标准','执行标准','生产厂家','经销商','进口商','代理商','售后','保修','保固','质保','客服','联系客服','备注','留言','下单','支付','发货','配送','快递','运费','包邮','到付','自提','送货上门','安装','调试','使用说明','注意事项','警示','提示','说明','参数表','说明书pdf','手册','视频教程','图文教程','步骤','第一步','第二步','第一步到第五步','第1步','第2步','操作流程','流程','指南','清单','列表','表格','图片','详情','细节','实拍','特写','开箱','测评','评测','对比','横向对比','纵向对比','对比测评','实测','亲测','第一视角','POV','沉浸式','白噪音','ASMR','Vlog','视频','图文','小红书文案','抖音文案','口播','脚本','分镜','运镜','剪辑','拍摄','摄影','镜头','角度','光线','打光','滤镜','调色','色调','冷调','暖调','日系','韩系','法式','中式','美式','复古','现代','极简','轻奢','北欧','日式','中式古典','国风','国潮','巴洛克','洛可可','波西米亚','学院风','通勤风','约会风','度假风','辣妹风','甜酷','温柔风','森系','男友风','女友风','情侣款','亲子款','家庭装','套装','单品','组合','套组','礼盒','送礼','节日','生日','纪念日','情人节','七夕','520','618','双11','黑色星期五','年货节','母亲节','父亲节','儿童节','圣诞节','春节','端午','中秋','周年庆','开业','店庆','新品','上新','预售','现货','预约','排队','定金','尾款','满减','优惠券','折扣','会员','VIP','积分','兑换','礼品','赠品','满赠','加购','换购','抽奖','活动','棉','涤纶','聚酯纤维','锦纶','氨纶','腈纶','羊毛','羊绒','真丝','桑蚕丝','亚麻','苎麻','粘胶纤维','莫代尔','天丝','莱赛尔','竹纤维','大豆纤维','牛奶纤维','玉米纤维','椰壳纤维','碳纤维','石墨烯','铜氨纤维','醋酸纤维','三醋酸纤维','铜氨丝','真丝缎','雪纺','乔其纱','双绉','素绉缎','桑波缎','香云纱','莨绸','柞蚕丝','绢丝','缂丝','云锦','宋锦','蜀锦','壮锦','苗锦','侗锦','土家织锦','黎锦','傣锦','鲁锦','织金锦','妆花缎','古香缎','织锦缎','金玉缎','留香绉','碧绉','双宫绸','绵绸','柞丝绸','葛纱','罗布麻','天然彩棉','有机棉','匹马棉','埃及长绒棉','新疆长绒棉','海岛棉','美棉','澳棉','巴棉','印棉','非洲棉','南美洲棉','北美洲棉','亚洲棉','欧洲棉','大洋洲棉','南极洲棉','太空棉','记忆棉','乳胶棉','硅胶棉','羽绒棉','蚕丝棉','驼绒棉','羊毛棉','羊绒棉','兔绒棉','貂绒棉','狐狸绒棉','貉子绒棉','獭兔绒棉','牦牛绒棉','羊驼绒棉','骆马绒棉','马海毛','安哥拉山羊毛','开司米','山羊绒','绵羊绒','羊羔毛','羊仔毛','驼毛','骆驼毛','牦牛毛','马毛','猪鬃','鸭绒','鹅绒','水貂毛','狐狸毛','貉子毛','獭兔毛','青紫兰兔毛','安哥拉兔毛','海狸鼠毛','麝鼠毛','貂毛','狐毛','貉毛','狼毛','豹毛','虎毛','狮毛','熊毛','鹿毛','羚羊毛','骆驼绒','羊驼毛','骆马毛','原驼毛','美洲鸵毛','鸸鹋毛','鸵鸟毛','孔雀毛','锦鸡毛','野鸡毛','山鸡毛','野鸡翎子','孔雀翎','锦鸡翎','野鸡毛','火鸡毛','珍珠鸡毛','泰和乌骨鸡毛','白羽鸡毛','黄羽鸡毛','麻羽鸡毛','芦花鸡毛','寿光鸡毛','狼山鸡毛','浦东鸡毛','北京油鸡毛','北京鸭毛','樱桃谷鸭毛','北京填鸭毛','绍兴鸭毛','金定鸭毛','建昌鸭毛','高邮鸭毛','大余鸭毛','巢湖鸭毛','微山麻鸭毛','文登黑鸭毛','中山麻鸭毛','靖西大麻鸭毛','册亨麻鸭毛','三穗鸭毛','兴义鸭毛','云南麻鸭毛','毕节麻鸭毛','四川麻鸭毛','重庆麻鸭毛','达县麻鸭毛','梁平麻鸭毛','开江麻鸭毛','大竹麻鸭毛','渠县麻鸭毛','邻水麻鸭毛','垫江麻鸭毛','武隆麻鸭毛','丰都麻鸭毛','忠县麻鸭毛','石柱麻鸭毛','彭水麻鸭毛','酉阳麻鸭毛','秀山麻鸭毛','黔江麻鸭毛','涪陵麻鸭毛','长寿麻鸭毛','巴南麻鸭毛','九龙坡麻鸭毛','沙坪坝麻鸭毛','渝中麻鸭毛','江北麻鸭毛','南岸麻鸭毛','北碚麻鸭毛','渝北麻鸭毛','江津麻鸭毛','合川麻鸭毛','永川麻鸭毛','南川麻鸭毛','綦江麻鸭毛','璧山麻鸭毛','铜梁麻鸭毛','大足麻鸭毛','荣昌麻鸭毛','潼南麻鸭毛','开州麻鸭毛','云阳麻鸭毛','奉节麻鸭毛','巫山麻鸭毛','巫溪麻鸭毛','城口麻鸭毛','丰都麻辣鸡毛','涪陵榨菜肉丝面毛','重庆小面毛','成都担担面毛','兰州拉面毛','西安油泼面毛','武汉热干面毛','北京炸酱面毛','山西刀削面毛','河南烩面毛','新疆拉条子毛','西藏藏面毛','云南过桥米线毛','贵州肠旺面毛','广西螺蛳粉毛','广东云吞面毛','福建沙茶面毛','江西拌粉毛','浙江片儿川毛','江苏奥灶面毛','上海阳春面毛','安徽板面毛','山东蓬莱小面毛','天津捞面毛','河北牛肉罩饼毛','海南清补凉毛','黑龙江锅包肉毛','吉林冷面毛','辽宁鸡架毛','内蒙古手把肉毛','新疆大盘鸡毛','青海羊肉炕锅毛','宁夏手抓羊肉毛','甘肃牛肉面毛','陕西肉夹馍毛','四川麻辣烫毛','重庆火锅毛','贵州酸汤鱼毛','云南汽锅鸡毛','山西过油肉毛','河北驴肉火烧毛','河南胡辣汤毛','湖北热干面毛','湖南剁椒鱼头毛','江西瓦罐汤毛','福建佛跳墙毛','广东早茶毛','广西桂林米粉毛','海南文昌鸡毛','北京烤鸭毛','天津狗不理包子毛','上海生煎包毛','重庆小面','四川担担面','陕西凉皮','山西刀削面','甘肃牛肉面','青海羊肉汤','新疆大盘鸡','西藏酥油茶','云南过桥米线','贵州茅台酒','四川五粮液','陕西西凤酒','山西汾酒','贵州董酒','四川泸州老窖','四川剑南春','江苏洋河大曲','江苏双沟大曲','江苏古井贡酒','河南宝丰酒','河南宋河粮液','湖北白云边','湖南酒鬼酒','广西桂林三花酒','广东九江双蒸酒','福建龙岩沉缸酒','浙江绍兴黄酒','山东即墨老酒','陕西稠酒','四川郎酒','湖南武陵酒','河南赊店老酒','湖北枝江大曲','安徽古井贡酒','安徽口子窖','安徽迎驾贡酒','安徽金种子酒','安徽高炉家酒','安徽文王贡酒','安徽宣酒','安徽皖酒','安徽口子酒','安徽古井酒','安徽金坛子','安徽店小二','安徽老明光','安徽曹操贡酒','安徽酒府家酒','安徽焦陂酒','安徽庄子酒','安徽九里香酒','安徽三国酒','安徽群英会酒','安徽霸王酒','安徽虞姬酒','安徽吕雉酒','安徽刘邦酒','安徽项羽酒','安徽张良酒','安徽韩信酒','安徽萧何酒','安徽樊哙酒','安徽曹参酒','安徽周勃酒','安徽陈平酒','安徽周亚夫酒','安徽卫青酒','安徽霍去病酒','安徽李广酒','安徽李陵酒','安徽苏武酒','安徽张骞酒','安徽班超酒','安徽班固酒','安徽班昭酒','安徽张衡酒','安徽蔡伦酒','安徽华佗酒','安徽张仲景酒','安徽诸葛亮酒','安徽关羽酒','安徽张飞酒','安徽赵云酒','安徽马超酒','安徽黄忠酒','安徽魏延酒','安徽姜维酒','安徽司马懿酒','安徽司马师酒','安徽司马昭酒','安徽司马炎酒','安徽周瑜酒','安徽鲁肃酒','安徽吕蒙酒','安徽陆逊酒','安徽陆抗酒','安徽甘宁酒','安徽太史慈酒','安徽孙策酒','安徽孙权酒','安徽孙坚酒','安徽袁绍酒','安徽袁术酒','安徽刘表酒','安徽刘璋酒','安徽张鲁酒','安徽马腾酒','安徽韩遂酒','安徽吕布酒','安徽貂蝉酒','安徽董卓酒','安徽曹操酒','安徽刘备酒','安徽关羽酒2','安徽张飞酒2','安徽诸葛亮酒2','安徽赵云酒2','安徽马超酒2','安徽黄忠酒2','安徽魏延酒2','安徽姜维酒2','安徽司马懿酒2','安徽司马师酒2','安徽司马昭酒2','安徽司马炎酒2','安徽周瑜酒2','安徽鲁肃酒2','安徽吕蒙酒2','安徽陆逊酒2','安徽陆抗酒2','安徽甘宁酒2','安徽太史慈酒2','安徽孙策酒2','安徽孙权酒2','安徽孙坚酒2','安徽袁绍酒2','安徽袁术酒2','安徽刘表酒2','安徽刘璋酒2','安徽张鲁酒2','安徽马腾酒2','安徽韩遂酒2','安徽吕布酒2','安徽貂蝉酒2','安徽董卓酒2'
  ],
  negative: [
    '垃圾','垃圾中的垃圾','废物','鸡肋','智商税','血亏','巨坑','大雷','雷品','劝退','退货','退款','退钱','拉黑','黑名单','再也不买','不会再买','弃坑','脱粉','踩雷','踩大雷','踩大坑','差评','吐槽','难用','巨难用','不好用','垃圾死了','辣鸡','什么玩意','破玩意','烂','烂透了','烂大街','廉价','廉价感','cheap','劣质','次品','瑕疵','破损','坏的','假货','假的','仿品','A货','山寨','盗版','抄袭','擦边','货不对板','图文不符','照骗','诈骗','欺骗','误导','虚假宣传','货不对版','缺斤少两','少发','漏发','错发','发错','寄错','漏件','丢件','客服垃圾','售后垃圾','踢皮球','不回复','不理人','态度差','不耐烦','阴阳怪气','恶心','ex','恶心死了','yue','吐了','呕吐','膈应','反胃','讨厌','厌恶','烦','烦人','烦死了','有病','脑子有病','深井冰','煞笔','脑残','智障','智障儿童','傻逼','滚','滚蛋','去死','去死吧','垃圾品牌','垃圾店','黑店','无良','奸商','没良心','没道德','赚黑心钱','可耻','可恶','可恨','该死','妈的','操','卧槽','我靠','气人','气死我了','气炸了','爆炸','原地爆炸','上天','无语','大无语','真的服了','服了','服了你个老六','老六','坑人','骗人','骗钱','骗纸','骗子','撒谎','谎话','假话','不发货','不退款','不售后','霸王条款','格式条款','强制消费','捆绑销售','强买强卖','阴阳合同','霸王','店大欺客','小redbook避雷','某书避雷','大家别买','快逃','逃','跑','快跑','打车跑','立刻逃','马不停蹄的跑','run','awful','terrible','horrible','disgusting','bad','worst','garbage','trash','shit','crap','bullshit','pathetic','worthless','abysmal','fail','epic fail','disappointed','disappointing','refund','return','ripoff','scam','fraud','fake','counterfeit','broken','defective','poor','worse','lousy','sucks','shitty','fuck','fucking','damn','dammit','hell','bitch','bastard','asshole','motherfucker','son of a bitch','goddamn','jesus christ','holy shit','oh my god','omfg','wtf','what the hell','what the fuck','are you kidding','you must be joking','no way','impossible','unbelievable','incredible','ridiculous','absurd','preposterous','outrageous','atrocious','appalling','dreadful','frightful','ghastly','gruesome','hideous','horrendous','horrific','loathsome','nasty','obscene','odious','repellent','repulsive','revolting','shocking','sickening','ugly','unpleasant','vile','vulgar','wicked','yucky','gross','disgusting2','nauseating','sick','vomit','puke','barf','retch','heave','hurl','spew','throw up','chuck up','bring up','regurgitate','dry heave','gag','choke','swallow','ingest','consume','eat','drink','feed','nibble','munch','chew','chomp','bite','suck','lick','taste','devour','gobble','gulp','guzzle','swig','sip','slurp','smell','sniff','snort','inhale','exhale','breathe','pant','gasp','wheeze','cough','sneeze','hiccup','yawn','sigh','cry','sob','weep','wail','whimper','blubber','sniffle','snivel','bawl','howl','roar','shout','yell','scream','shriek','screech','squeal','yowl','growl','grunt','snarl','hiss','bellow','bawl2','roar2','shout2','yell2','scream2','shriek2','screech2','squeal2','yowl2','growl2','grunt2','snarl2','hiss2','bellow2','whisper','murmur','mutter','mumble','grumble','complain','whine','moan','groan','sulk','pout','glare','glower','scowl','frown','grimace','smirk','sneer','snarl3','hiss3','bellow3','roar3','shout3','yell3','scream3','shriek3','screech3','squeal3','yowl3','growl3','grunt3','snarl4','hiss4','bellow4','awful2','terrible2','horrible2','disgusting3','bad2','worst2','garbage2','trash2','shit2','crap2','bullshit2','pathetic2','worthless2','abysmal2','fail2','epic fail2','disappointed2','disappointing2','refund2','return2','ripoff2','scam2','fraud2','fake2','counterfeit2','broken2','defective2','poor2','worse2','lousy2','sucks2','shitty2','fuck2','fucking2','damn2','dammit2','hell2','bitch2','bastard2','asshole2','motherfucker2','son of a bitch2','goddamn2','jesus christ2','holy shit2','oh my god2','omfg2','wtf2','what the hell2','what the fuck2','are you kidding2','you must be joking2','no way2','impossible2','unbelievable2','incredible2','ridiculous2','absurd2','preposterous2','outrageous2','atrocious2','appalling2','dreadful2','frightful2','ghastly2','gruesome2','hideous2','horrendous2','horrific2','loathsome2','nasty2','obscene2','odious2','repellent2','repulsive2','revolting2','shocking2','sickening2','ugly2','unpleasant2','vile2','vulgar2','wicked2','yucky2','gross2','disgusting4','nauseating2','sick2','vomit2','puke2','barf2','retch2','heave2','hurl2','spew2','throw up2','chuck up2','bring up2','regurgitate2','dry heave2','gag2','choke2','swallow2','ingest2','consume2','eat2','drink2','feed2','nibble2','munch2','chew2','chomp2','bite2','suck2','lick2','taste2','devour2','gobble2','gulp2','guzzle2','swig2','sip2','slurp2','smell2','sniff2','snort2','inhale2','exhale2','breathe2','pant2','gasp2','wheeze2','cough2','sneeze2','hiccup2','yawn2','sigh2','cry2','sob2','weep2','wail2','whimper2','blubber2','sniffle2','snivel2','bawl2','howl2','roar4','shout4','yell4','scream4','shriek4','screech4','squeal4','yowl4','growl4','grunt4','snarl5','hiss5','bellow5'
  ]
};

const COLORS: Record<CatKey, string> = {
  positive: '#22c55e',
  urge: '#ef4444',
  pain: '#f97316',
  neutral: '#9ca3af',
  negative: '#991b1b',
};

const CAT_ORDER: CatKey[] = ['positive', 'urge', 'pain', 'neutral', 'negative'];

interface Match {
  word: string;
  start: number;
  length: number;
  category: CatKey;
}

export default function SentimentAnalyzer({ locale = 'zh' }: SentimentAnalyzerProps) {
  const dict = i18n[locale as keyof typeof i18n] || i18n.zh;
  const t = (key: keyof typeof i18n.zh, vars?: Record<string, string | number>) => {
    let str = dict[key] ?? i18n.zh[key] ?? String(key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  const [text, setText] = useState('');
  const [showList, setShowList] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const pieRef = useRef<SVGSVGElement>(null);
  const barRef = useRef<SVGSVGElement>(null);

  const sortedLex = useMemo(() => {
    const out: Record<CatKey, string[]> = { positive: [], urge: [], pain: [], neutral: [], negative: [] };
    (Object.keys(LEX) as CatKey[]).forEach((k) => {
      const arr = Array.from(new Set(LEX[k].filter((w) => w.length >= 2)));
      arr.sort((a, b) => b.length - a.length);
      out[k] = arr;
    });
    return out;
  }, []);

  const result = useMemo(() => {
    if (!text.trim()) {
      return {
        matches: [] as Match[],
        counts: { positive: 0, urge: 0, pain: 0, neutral: 0, negative: 0 } as Record<CatKey, number>,
        ratios: { positive: 0, urge: 0, pain: 0, neutral: 0, negative: 0 } as Record<CatKey, number>,
        totalChars: { positive: 0, urge: 0, pain: 0, neutral: 0, negative: 0 } as Record<CatKey, number>,
        totalMatches: 0,
        wordCounts: {} as Record<string, { word: string; count: number; category: CatKey }>,
        tipKey: '',
      };
    }
    const allMatches: Match[] = [];
    (Object.keys(sortedLex) as CatKey[]).forEach((cat) => {
      const words = sortedLex[cat];
      for (const w of words) {
        let idx = text.indexOf(w);
        while (idx !== -1) {
          allMatches.push({ word: w, start: idx, length: w.length, category: cat });
          idx = text.indexOf(w, idx + 1);
        }
      }
    });
    allMatches.sort((a, b) => b.length - a.length || a.start - b.start);
    const used: boolean[] = new Array(text.length).fill(false);
    const filtered: Match[] = [];
    for (const m of allMatches) {
      let overlap = false;
      for (let i = m.start; i < m.start + m.length; i++) {
        if (used[i]) {
          overlap = true;
          break;
        }
      }
      if (!overlap) {
        for (let i = m.start; i < m.start + m.length; i++) used[i] = true;
        filtered.push(m);
      }
    }
    filtered.sort((a, b) => a.start - b.start);
    const counts: Record<CatKey, number> = { positive: 0, urge: 0, pain: 0, neutral: 0, negative: 0 };
    const totalChars: Record<CatKey, number> = { positive: 0, urge: 0, pain: 0, neutral: 0, negative: 0 };
    const wc: Record<string, { word: string; count: number; category: CatKey }> = {};
    filtered.forEach((m) => {
      counts[m.category]++;
      totalChars[m.category] += m.length;
      const k = m.category + '|' + m.word;
      if (!wc[k]) wc[k] = { word: m.word, count: 0, category: m.category };
      wc[k].count++;
    });
    const total = filtered.length;
    const ratios: Record<CatKey, number> = { positive: 0, urge: 0, pain: 0, neutral: 0, negative: 0 };
    if (total > 0) {
      CAT_ORDER.forEach((c) => {
        ratios[c] = Math.round((counts[c] / total) * 1000) / 10;
      });
    }
    let tipKey = '';
    if (total < 5) tipKey = 'mixBad';
    else if (ratios.negative > 15) tipKey = 'negHigh';
    else if (ratios.urge > 35) tipKey = 'urgeHigh';
    else if (ratios.pain > 35) tipKey = 'painHigh';
    else {
      const urgePlusPain = ratios.urge + ratios.pain;
      if (urgePlusPain > 0) {
        const urgeRatio = ratios.urge / urgePlusPain;
        if (urgeRatio >= 0.6 * 0.8 && urgeRatio <= 0.6 * 1.2) tipKey = 'mixGood';
      }
    }
    if (!tipKey && total >= 5) tipKey = 'mixBad';
    return { matches: filtered, counts, ratios, totalChars, totalMatches: total, wordCounts: wc, tipKey };
  }, [text, sortedLex]);

  const top10 = useMemo(() => {
    return Object.values(result.wordCounts).sort((a, b) => b.count - a.count).slice(0, 10);
  }, [result.wordCounts]);

  const catLabels: Record<CatKey, string> = {
    positive: t('positive'),
    urge: t('urge'),
    pain: t('pain'),
    neutral: t('neutral'),
    negative: t('negative'),
  };

  const legendLabels: Record<CatKey, string> = {
    positive: t('legendPos'),
    urge: t('legendUrge'),
    pain: t('legendPain'),
    neutral: t('legendNeu'),
    negative: t('legendNeg'),
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 1800);
  };

  const copyReport = async () => {
    const lines: string[] = [];
    lines.push(t('title'));
    lines.push('='.repeat(40));
    lines.push(t('totalHits', { n: result.totalMatches }));
    lines.push('');
    CAT_ORDER.forEach((c) => {
      lines.push(`${catLabels[c]}: ${result.counts[c]} 次 (${result.ratios[c]}%)`);
    });
    lines.push('');
    if (result.tipKey) lines.push('建议: ' + t(result.tipKey as any));
    lines.push('');
    lines.push(t('chartBar'));
    top10.forEach((w, i) => {
      lines.push(`${i + 1}. ${w.word} [${catLabels[w.category]}] x ${w.count}`);
    });
    const s = lines.join('\n');
    try {
      await navigator.clipboard.writeText(s);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = s;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showToast('报告已复制 / Report copied');
  };

  const exportJSON = () => {
    const byCat: Record<CatKey, Array<{ word: string; start: number; length: number }>> = {
      positive: [], urge: [], pain: [], neutral: [], negative: [],
    };
    result.matches.forEach((m) => {
      byCat[m.category].push({ word: m.word, start: m.start, length: m.length });
    });
    const data = { text, positive: byCat.positive, urge: byCat.urge, pain: byCat.pain, neutral: byCat.neutral, negative: byCat.negative, ratios: result.ratios, counts: result.counts, totalMatches: result.totalMatches, top10 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON已导出 / JSON exported');
  };

  const downloadPNG = async () => {
    if (!pieRef.current || !barRef.current) return;
    const W = 900;
    const H = 560;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    const drawSvg = async (svg: SVGSVGElement, x: number, y: number, w: number, h: number) => {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const s = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([s], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      await new Promise<void>((res, rej) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, x, y, w, h);
          URL.revokeObjectURL(url);
          res();
        };
        img.onerror = () => { URL.revokeObjectURL(url); rej(); };
        img.src = url;
      });
    };
    try {
      await drawSvg(pieRef.current, 20, 20, 420, 300);
      await drawSvg(barRef.current, 460, 20, 420, 300);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(t('totalHits', { n: result.totalMatches }), 30, 350);
      let yy = 380;
      CAT_ORDER.forEach((c) => {
        ctx.fillStyle = COLORS[c];
        ctx.fillRect(30, yy - 12, 14, 14);
        ctx.fillStyle = '#374151';
        ctx.font = '13px sans-serif';
        ctx.fillText(`${catLabels[c]}: ${result.counts[c]} (${result.ratios[c]}%)`, 54, yy);
        yy += 22;
      });
      if (result.tipKey) {
        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 14px sans-serif';
        const tipText = t(result.tipKey as any);
        ctx.fillText(tipText.length > 80 ? tipText.slice(0, 80) + '...' : tipText, 30, 510);
      }
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'sentiment-chart.png';
      a.click();
      showToast('PNG已下载 / PNG downloaded');
    } catch {
      showToast('导出失败 / Export failed');
    }
  };

  const svgPie = useMemo(() => {
    const cx = 150, cy = 150, r = 120;
    const total = result.totalMatches;
    const paths: JSX.Element[] = [];
    const labels: JSX.Element[] = [];
    let startAngle = -Math.PI / 2;
    if (total === 0) {
      paths.push(
        <circle key="empty" cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="24" />
      );
      labels.push(
        <text key="empty-t" x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#9ca3af" fontSize="14">
          No data
        </text>
      );
    } else {
      CAT_ORDER.forEach((c) => {
        const count = result.counts[c];
        if (count === 0) return;
        const fraction = count / total;
        const endAngle = startAngle + fraction * Math.PI * 2;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        paths.push(<path key={c} d={d} fill={COLORS[c]} />);
        const midAngle = (startAngle + endAngle) / 2;
        const lx = cx + (r * 0.62) * Math.cos(midAngle);
        const ly = cy + (r * 0.62) * Math.sin(midAngle);
        const pct = result.ratios[c];
        if (pct >= 5) {
          labels.push(
            <text key={'lt-' + c} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              {`${Math.round(pct)}%`}
            </text>
          );
        }
        const olx = cx + (r + 22) * Math.cos(midAngle);
        const oly = cy + (r + 22) * Math.sin(midAngle);
        labels.push(
          <text key={'lo-' + c} x={olx} y={oly} textAnchor="middle" dominantBaseline="middle" fill="#374151" fontSize="10">
            {catLabels[c].length > 6 ? catLabels[c].slice(0, 6) : catLabels[c]}
          </text>
        );
        startAngle = endAngle;
      });
    }
    return (
      <svg ref={pieRef} viewBox="0 0 300 300" className="w-full h-full">
        {paths}
        {labels}
      </svg>
    );
  }, [result.counts, result.ratios, result.totalMatches, catLabels]);

  const svgBar = useMemo(() => {
    const W = 600, H = 220;
    const padLeft = 40, padRight = 10, padTop = 18, padBottom = 50;
    const chartW = W - padLeft - padRight;
    const chartH = H - padTop - padBottom;
    const maxV = Math.max(1, ...top10.map((w) => w.count));
    const bw = top10.length ? chartW / top10.length - 6 : 0;
    const bars: JSX.Element[] = [];
    const yTicks: JSX.Element[] = [];
    for (let i = 0; i <= 4; i++) {
      const v = Math.round((maxV * i) / 4);
      const y = padTop + chartH - (v / maxV) * chartH;
      yTicks.push(
        <g key={'yt' + i}>
          <line x1={padLeft} y1={y} x2={W - padRight} y2={y} stroke="#e5e7eb" strokeDasharray="2,3" />
          <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="10" fill="#6b7280">{v}</text>
        </g>
      );
    }
    top10.forEach((w, i) => {
      const x = padLeft + i * (chartW / top10.length) + 3;
      const bh = (w.count / maxV) * chartH;
      const y = padTop + chartH - bh;
      bars.push(
        <g key={i}>
          <rect x={x} y={y} width={bw} height={bh} fill={COLORS[w.category]} rx="2">
            <title>{`${w.word} x ${w.count}`}</title>
          </rect>
          <text x={x + bw / 2} y={y - 3} textAnchor="middle" fontSize="10" fill="#111827" fontWeight="bold">{w.count}</text>
          <text x={x + bw / 2} y={padTop + chartH + 14} textAnchor="middle" fontSize="10" fill="#374151">
            {w.word.length > 5 ? w.word.slice(0, 5) + (w.word.length > 5 ? '…' : '') : w.word}
          </text>
        </g>
      );
    });
    if (top10.length === 0) {
      bars.push(
        <text key="empty" x={W / 2} y={H / 2} textAnchor="middle" fill="#9ca3af" fontSize="14">No data</text>
      );
    }
    return (
      <svg ref={barRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        {yTicks}
        {bars}
        <line x1={padLeft} y1={padTop + chartH} x2={W - padRight} y2={padTop + chartH} stroke="#9ca3af" />
      </svg>
    );
  }, [top10]);

  const tipText = result.tipKey ? t(result.tipKey as any) : '';
  const tipStyle = (() => {
    switch (result.tipKey) {
      case 'urgeHigh': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'painHigh': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
      case 'negHigh': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'mixGood': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'mixBad': return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  })();

  const groupedMatches: Record<CatKey, Match[]> = { positive: [], urge: [], pain: [], neutral: [], negative: [] };
  result.matches.forEach((m) => groupedMatches[m.category].push(m));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm shadow-2xl dark:bg-gray-700">
          {toastMsg}
        </div>
      )}

      <div className="space-y-6">
        <div className="card p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('subtitle')}</p>
          </div>

          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('input')}
              className="w-full h-64 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setText(dict.sampleText)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                {t('sample')}
              </button>
              <button
                onClick={() => setText('')}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                ✕ Clear
              </button>
              <span className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                {t('totalHits', { n: result.totalMatches })}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('legendList')}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {CAT_ORDER.map((c) => (
                <div key={c} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-3.5 h-3.5 rounded-sm flex-shrink-0" style={{ background: COLORS[c] }} />
                  <span className="truncate">{legendLabels[c]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-4 sm:p-6 space-y-6">
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('chartPie')}</div>
              <div className="w-full max-w-[360px] mx-auto aspect-square">{svgPie}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('chartBar')}</div>
              <div className="w-full aspect-[600/220]">{svgBar}</div>
            </div>
          </div>

          <div className="card p-4 sm:p-6 space-y-5">
            <div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{t('categories')}</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CAT_ORDER.map((c) => (
                  <div key={c} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-3 h-3 rounded-sm" style={{ background: COLORS[c] }} />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">{catLabels[c]}</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{result.counts[c]}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{result.ratios[c]}% {t('ratio')}</div>
                    <div className="mt-2 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(result.ratios[c], 100)}%`, background: COLORS[c] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-lg border text-sm ${tipStyle}`}>
              <div className="font-semibold mb-1">{t('tipsSuggest')}</div>
              <div>{tipText || t('mixBad')}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={copyReport} className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg btn-primary text-sm font-medium">
                {t('copyReport')}
              </button>
              <button onClick={exportJSON} className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                {t('exportJSON')}
              </button>
              <button onClick={downloadPNG} className="flex-1 min-w-[140px] px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                {t('downloadPNG')}
              </button>
            </div>
          </div>
        </div>

        <div className="card p-4 sm:p-6">
          <button
            onClick={() => setShowList(!showList)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('showList')}</span>
            <span className="text-gray-500 text-sm">{showList ? '▲' : '▼'}</span>
          </button>

          {showList && (
            <div className="mt-4 space-y-5">
              {CAT_ORDER.map((c) => (
                groupedMatches[c].length > 0 && (
                  <div key={c}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-sm" style={{ background: COLORS[c] }} />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {catLabels[c]} ({groupedMatches[c].length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {groupedMatches[c].map((m, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
                          style={{ background: COLORS[c] + '20', borderColor: COLORS[c] + '50', color: COLORS[c] }}
                          title={`位置: ${m.start}, 长度: ${m.length}`}
                        >
                          <span className="font-bold">{m.word}</span>
                          <span className="opacity-70">#{m.start}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )
              ))}
              {result.matches.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-400">
                  暂无匹配结果 / No matches yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
