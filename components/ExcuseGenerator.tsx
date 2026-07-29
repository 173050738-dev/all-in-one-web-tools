'use client';

import { useState, useRef, useCallback } from 'react';
import { Shuffle, Copy, Check, Download, MessageCircle, Briefcase, CalendarX, Clock4 } from 'lucide-react';

interface ExcuseGeneratorProps {
  locale?: string;
}

type Scenario = 'late' | 'skip-work' | 'cancel-plans' | 'deadline';
type Mode = 'serious' | 'ridiculous';

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '借口生成器', subtitle: '需要一个借口？一键生成一个听起来很合理的理由',
    scenario: '场景', mode: '模式', serious: '正经', ridiculous: '离谱',
    generate: '生成借口', copy: '复制', copied: '已复制', download: '下载卡片',
    sLate: '迟到了', sSkipWork: '不想上班', sCancelPlans: '不想赴约', sDeadline: 'deadline 拖了',
    empty: '选择场景和模式，点击下方按钮生成借口',
  },
  en: {
    title: 'Excuse Generator', subtitle: 'Need an excuse? Generate a plausible-sounding one instantly',
    scenario: 'Scenario', mode: 'Mode', serious: 'Serious', ridiculous: 'Ridiculous',
    generate: 'Generate Excuse', copy: 'Copy', copied: 'Copied', download: 'Download Card',
    sLate: 'Running Late', sSkipWork: 'Skip Work', sCancelPlans: 'Cancel Plans', sDeadline: 'Missed Deadline',
    empty: 'Select a scenario and mode, then click the button below',
  },
  es: {
    title: 'Generador de Excusas', subtitle: '¿Necesitas una excusa? Genera una creíble al instante',
    scenario: 'Escenario', mode: 'Modo', serious: 'Serio', ridiculous: 'Ridículo',
    generate: 'Generar Excusa', copy: 'Copiar', copied: 'Copiado', download: 'Descargar Tarjeta',
    sLate: 'Llego Tarde', sSkipWork: 'Faltar al Trabajo', sCancelPlans: 'Cancelar Planes', sDeadline: 'Plazo Vencido',
    empty: 'Selecciona un escenario y modo, luego haz clic abajo',
  },
  fr: {
    title: 'Generateur d\'Excuses', subtitle: 'Besoin d\'une excuse ? Generez-en une croyable instantanement',
    scenario: 'Scenario', mode: 'Mode', serious: 'Serieux', ridiculous: 'Ridicule',
    generate: 'Generer', copy: 'Copier', copied: 'Copie', download: 'Telecharger Carte',
    sLate: 'En Retard', sSkipWork: 'Rater le Travail', sCancelPlans: 'Annuler un Plan', sDeadline: 'Deadline Manquee',
    empty: 'Selectionnez un scenario et un mode, puis cliquez',
  },
  hi: {
    title: 'बहाना जनरेटर', subtitle: 'बहाना चाहिए? तुरंत एक विश्वसनीय बहाना बनाएं',
    scenario: 'परिदृश्य', mode: 'मोड', serious: 'गंभीर', ridiculous: 'बेतुका',
    generate: 'बहाना बनाएं', copy: 'कॉपी', copied: 'कॉपी हुआ', download: 'कार्ड डाउनलोड',
    sLate: 'देर से पहुंचना', sSkipWork: 'काम छोड़ना', sCancelPlans: 'योजना रद्द', sDeadline: 'समयसीमा छूटी',
    empty: 'परिदृश्य और मोड चुनें, फिर नीचे बटन दबाएं',
  },
  ar: {
    title: 'مولد الأعذار', subtitle: 'تحتاج عذراً؟ أنشئ واحداً مقنعاً على الفور',
    scenario: 'الموقف', mode: 'الوضع', serious: 'جاد', ridiculous: 'سخيف',
    generate: 'إنشاء عذر', copy: 'نسخ', copied: 'تم النسخ', download: 'تحميل البطاقة',
    sLate: 'تأخرت', sSkipWork: 'غياب عن العمل', sCancelPlans: 'إلغاء خطة', sDeadline: 'فات الموعد',
    empty: 'اختر موقفاً ووضعاً، ثم اضغط الزر أدناه',
  },
};

// Excuse database per scenario/mode/locale
const EXCUSES: Record<Scenario, Record<Mode, Record<string, string[]>>> = {
  late: {
    serious: {
      zh: ['地铁信号故障，整条线延误了', '路上出了小剐蹭，等交警处理', '闹钟没响，手机系统更新自动重启了', '电梯坏了，从楼梯下来耽误了', '小区临时封路做消防演练'],
      en: ['The subway had a signal failure, entire line is delayed', 'Minor fender bender on the way, waiting for police', 'My alarm did not go off, phone auto-restarted from update', 'Elevator broke down, had to take the stairs', 'Road was temporarily closed for a fire drill'],
      es: ['El metro tuvo una falla de senal, toda la linea esta retrasada', 'Pequeno choque en el camino, esperando a la policia', 'Mi alarma no sono, el telefono se reinicio por una actualizacion', 'El ascensor se averio, tuve que bajar por las escaleras', 'La carretera estaba cerrada por un simulacro de incendio'],
      fr: ['Le metro a eu une panne de signal, toute la ligne est en retard', 'Petit accrochage en route, j\'attends la police', 'Mon reveil n\'a pas sonne, le telephone a redemarre', 'L\'ascenseur est en panne, j\'ai du prendre les escaliers', 'La route etait temporairement fermee pour un exercice d\'incendie'],
      hi: ['मेट्रो सिग्नल खराब हो गया, पूरी लाइन देर से चल रही है', 'रास्ते में छोटी टक्कर हो गई, पुलिस का इंतजार है', 'अलार्म नहीं बजा, फोन अपडेट से रीस्टार्ट हो गया', 'लिफ्ट खराब हो गया, सीढ़ियां उतरनी पड़ीं', 'सड़क अग्निशमन अभ्यास के लिए बंद थी'],
      ar: ['المترو تعطلت إشاراته، الخط كله متأخر', 'حادث صغير في الطريق، أنتظر الشرطة', 'لم يرن المنبه، أعد تشغيل الهاتف نفسه', 'المصعد تعطل، اضطررت لنزول الدرج', 'الطريق كان مغلق مؤقتاً لتدريب إطفاء'],
    },
    ridiculous: {
      zh: ['我家猫坐在了车钥匙上，它不允许我移动它', '邻居的鹦鹉飞进我家，我在跟它谈判', '出门时发现鞋带连在了一起，解了半天', '路上遇到一只挡路的鹅，它在看我', '我的影子被路灯拉太长了，我等它缩回来'],
      en: ['My cat sat on my car keys and refuses to move', 'A neighbor\'s parrot flew into my house, I am negotiating with it', 'My shoelaces were tied together when I left, took forever to undo', 'A goose was blocking the road and staring at me', 'My shadow got stretched too long by a streetlight, waiting for it to shrink'],
      es: ['Mi gato se sento sobre las llaves y se niega a moverse', 'Un loro del vecino entro en mi casa, estoy negociando con el', 'Mis cordones estaban atados al salir, tardo una eternidad', 'Un ganso bloqueaba la calle y me miraba fijamente', 'Mi sombra se estiro demasiado por una farola, espero que se encoja'],
      fr: ['Mon chat s\'est assis sur mes cles et refuse de bouger', 'Un perroquet du voisin est entre chez moi, jenegocie avec lui', 'Mes lacets etaient noues en sortant, ca a pris une eternite', 'Une oie bloquait la route et me regardait fixement', 'Mon ombre a ete trop etiree par un lampadaire, j\'attends qu\'elle retrecisse'],
      hi: ['मेरी बिल्ली कार की चाबियों पर बैठ गई और हिलने को तैयार नहीं', 'पड़ोसी का तोता मेरे घर में आ गया, मैं उससे बातचीत कर रहा हूं', 'निकलते समय जूते के फीते आपस में बंधे थे, खोलने में बहुत समय लगा', 'एक हंस ने रास्ता रोक लिया और मुझे घूर रहा था', 'मेरी परछाई लालटेन से बहुत लंबी हो गई, सिकुड़ने का इंतजार कर रहा हूं'],
      ar: ['قطتي جلست على مفاتيح السيارة وترفض التحرك', 'ببغاء الجار دخل منزلي، أتفاوض معه', 'رباط حذائي كان مربوطاً معاً عند الخروج، استغرق وقتاً طويلاً', 'إوزة كانت تسد الطريق وتحدق بي', 'ظلي امتد كثيراً بسبب فانوس، أنتظر أن يتقلص'],
    },
  },
  'skip-work': {
    serious: {
      zh: ['今早突然发烧38.5度，已经吃了药在家休息', '家里水管爆了，物业正在抢修走不开', '急性肠胃炎，昨晚可能吃坏了东西', '偏头痛又犯了，医生建议静养一天', '电动车没电了，充电器也坏了'],
      en: ['Woke up with a 38.5C fever, took medicine and resting at home', 'Water pipe burst at home, maintenance is fixing it, I cannot leave', 'Acute gastroenteritis, probably ate something bad last night', 'Migraine acting up again, doctor advised rest for a day', 'My e-bike battery died and the charger is broken too'],
      es: ['Desperte con 38.5C de fiebre, tome medicina y descaso en casa', 'Se rebento una tuberia en casa, el mantenimiento la esta arreglando', 'Gastroenteritis aguda, probablemente comi algo malo anoche', 'Migraña otra vez, el medico recomienda descansar un dia', 'La bateria de mi bici electrica murio y el cargador tambien'],
      fr: ['Reveil avec 38.5C de fievre, j\'ai pris un medicament et je me repose', 'Un tuyau a eclate a la maison, la maintenance repare, je ne peux pas partir', 'Gastro-enterite aigue, j\'ai probablement mange quelque chose de mauvais', 'Migraine a nouveau, le medecin conseille de se reposer', 'La batterie de mon velo electrique est morte et le chargeur aussi'],
      hi: ['सुबह 38.5°C बुखार उठा, दवा लेकर घर पर आराम कर रहा हूं', 'घर का पाइप फट गया, मैंटेनेंस ठीक कर रहे हैं, मैं नहीं जा सकता', 'तीव्र गैस्ट्रोएंटेराइटिस, शायद कल रात कुछ खराब खा लिया', 'माइग्रेन फिर से, डॉक्टर ने आराम की सलाह दी', 'मेरी इलेक्ट्रिक बाइक की बैटरी खत्म और चार्जर भी खराब'],
      ar: ['استيقظت بحمى 38.5 درجة، أخذت دواء وأرتاح في المنزل', 'انفجر أنبوب ماء في المنزل، الصيانة تصلحه، لا يمكنني المغادرة', 'التهاب معدة حاد، ربما أكلت شيئاً سيئاً البارحة', 'الصداع النصفي عاد، نصحني الطبيب بالراحة', 'بطارية دراجتي الكهربائية نفدت والشاحن معطل أيضاً'],
    },
    ridiculous: {
      zh: ['我家的金鱼在用眼神命令我留在家里', '今天早上镜子里的我看起来太帅了，不忍心出门破坏形象', '外面风太大，我怕被吹到别的城市去', '我的拖鞋组成了工会，要求今天罢工', '出门前占卜说我今天不宜面向东南方'],
      en: ['My goldfish is giving me a look that says I must stay home', 'I looked too handsome in the mirror this morning, cannot risk ruining it by going outside', 'The wind is so strong I might get blown to another city', 'My slippers formed a union and declared a strike today', 'A fortune reading said I should not face southeast today'],
      es: ['Mi pez dorado me esta mirando como diciendo que me quede en casa', 'Me vi demasiado guapo en el espejo, no puedo arriesgarlo', 'El viento es tan fuerte que podria terminar en otra ciudad', 'Mis pantuflas formaron un sindicato y declararon huelga', 'Una lectura de la fortuna dijo que no mire al sureste hoy'],
      fr: ['Mon poisson rouge me regarde comme pour dire que je dois rester', 'J\'etais trop beau dans le miroir ce matin, je ne peux pas gacher ca', 'Le vent est si fort que je pourrais finir dans une autre ville', 'Mes chaussons ont forme un syndicat et declarent une greve', 'Une voyance a dit que je ne devais pas faire face au sud-est'],
      hi: ['मेरी गोल्डफिश मुझे ऐसी नजरों से देख रही है जैसे कह रही हो घर पर रहो', 'आज सुबह दर्पण में मैं बहुत सुंदर लग रहा था, बाहर जाकर खराब नहीं करना चाहता', 'हवा इतनी तेज है कि मैं किसी दूसरे शहर में उड़ जाऊंगा', 'मेरी चप्पलों ने यूनियन बना लिया और आज हड़ताल का ऐलान कर दिया', 'ज्योतिष ने कहा आज दक्षिण-पूर्व की ओर मत देखो'],
      ar: ['سمكتي الذهبية تنظر إلي وكأنها تقول ابقَ في المنزل', 'بدوت وسيماً جداً في المرآة هذا الصباح، لا أريد إفساد ذلك بالخروج', 'الرياح قوية جداً، قد أطير إلى مدينة أخرى', 'نعالي شكلت نقابة وأعلنت إضراباً اليوم', 'قراءة الحظ قالت لا أتجه جنوب شرق اليوم'],
    },
  },
  'cancel-plans': {
    serious: {
      zh: ['突然被安排加班，实在走不开', '家里老人身体不舒服，我得陪去医院', '车胎扎钉子了，正在等救援', '临时有重要客户会议冲突了', '小区停电了，冰箱里的东西要紧急处理'],
      en: ['Suddenly assigned overtime, I really cannot get away', 'Family member is unwell, I need to take them to the hospital', 'Got a nail in my tire, waiting for roadside assistance', 'Important client meeting came up at the last minute', 'Power outage in my building, need to handle food in the fridge'],
      es: ['Me asignaron horas extras, no puedo irme', 'Un familiar se siente mal, debo llevarlo al hospital', 'Tengo un clavo en la llanta, esperando asistencia', 'Reunion importante de ultimo minuto con un cliente', 'Corte de electricidad, necesito cuidar la comida de la nevera'],
      fr: ['Heures supplementaires imposees, je ne peux vraiment pas partir', 'Un membre de la famille est malade, je dois l\'emmener a l\'hopital', 'J\'ai un clou dans mon pneu, j\'attends l\'assistance', 'Reunion de derniere minute avec un client important', 'PanNE de courant, je dois m\'occuper du frigo'],
      hi: ['अचानक ओवरटाइम मिल गया, जाना नामुमकिन है', 'घर में किसी की तबियत खराब है, अस्पताल ले जाना है', 'टायर में कील लग गई, रोडसाइड असिस्टेंस का इंतजार', 'जरूरी क्लाइंट मीटिंग आ गई', 'इलाके में बिजली गुली, फ्रिज का सामान संभालना है'],
      ar: ['تكليف بعمل إضافي مفاجئ، لا يمكنني المغادرة', 'أحد أفراد العائلة مريض، يجب أن آخذه للمستشفى', 'مسمار في إطاري، أنتظر المساعدة على الطريق', 'اجتماع عميل مهم في اللحظة الأخيرة', 'انقطاع كهرباء، يجب التعامل مع الثلاجة'],
    },
    ridiculous: {
      zh: ['我的沙发用引力锁住了我，我试过了挣脱不了', '今天我的植物需要我陪它，它看起来很抑郁', '出门发现天空是方的，今天不宜出门', '我的左脚今天罢工了，只同意右脚走路', '我的外卖终于到了，这是命中注定的'],
      en: ['My couch has me in a gravitational lock, I tried and cannot escape', 'My plant needs me today, it looks depressed', 'I looked outside and the sky is square, not a good day to go out', 'My left foot went on strike, it only agrees to let the right one walk', 'My food delivery finally arrived, this is destiny'],
      es: ['Mi sofa me tiene en un bloqueo gravitacional, no puedo escapar', 'Mi planta me necesita hoy, parece deprimida', 'Mire afuera y el cielo es cuadrado, mal dia para salir', 'Mi pie izquierdo esta en huelga, solo el derecho camina', 'Mi pedido por fin llego, es el destino'],
      fr: ['Mon canape m\'a dans un verrou gravitationnel, je ne peux pas echapper', 'Ma plante a besoin de moi aujourd\'hui, elle a l\'air depressed', 'J\'ai regarde dehors et le ciel est carre, mauvais jour pour sortir', 'Mon pied gauche est en greve, seul le droit accepte de marcher', 'Ma livraison est enfin arrivee, c\'est le destin'],
      hi: ['मेरे सोफे ने मुझे गुरुत्वाकर्षण बंदनी में बांध लिया, छूटने की कोशिश की निकल नहीं पाया', 'मेरे पौधे को आज मेरी जरूरत है, वे उदास दिख रहे हैं', 'बाहर देखा तो आसमान चौकोर है, आज बाहर जाना ठीक नहीं', 'मेरे बाएं पैर ने हड़ताल कर दी, सिर्फ दायां पैर चलने को तैयार है', 'मेरा ऑर्डर आखिरकार आ गया, यह तकदीर है'],
      ar: ['أريكتي احتجزتني بجاذبية مغناطيسية، حاولت الهروب لكنني لم أستطع', 'نباتي يحتاجني اليوم، يبدو مكتئباً', 'نظرت للخارج والسماء مربعة، يوم سيء للخروج', 'قدمي اليسرى أضربت، توافق فقط أن تمشي اليمنى', 'طلب الطعام وصل أخيراً، هذا قدر'],
    },
  },
  deadline: {
    serious: {
      zh: ['测试环境突然崩了，正在紧急修复', '依赖的第三方API变更了接口，需要适配', '发现一个严重的边界条件bug，必须先修复', '需求昨天又改了，正在重新调整方案', '代码合并冲突太多，正在逐个解决'],
      en: ['The test environment crashed unexpectedly, fixing it urgently', 'A third-party API changed their interface, need to adapt', 'Found a critical edge case bug, must fix it first', 'Requirements changed yesterday, readjusting the approach', 'Too many merge conflicts, resolving them one by one'],
      es: ['El entorno de pruebas se cayo, reparandolo de urgencia', 'Una API de terceros cambio su interfaz, necesito adaptarme', 'Encontre un bug critico, debo arreglarlo primero', 'Los requisitos cambiaron ayer, reajustando el enfoque', 'Demasiados conflictos de merge, resolviendolos uno por uno'],
      fr: ['L\'environnement de test a plante, reparation urgente', 'Une API tierce a change son interface, je dois m\'adapter', 'J\'ai trouve un bug critique, je dois le corriger d\'abord', 'Les exigences ont change hier, reajustement en cours', 'Trop de conflits de fusion, resolution un par un'],
      hi: ['टेस्ट एनवायरनमेंट क्रैश हो गया, जरूरी मरम्मत चल रही है', 'थर्ड-पार्टी API बदल गया, अनुकूलन करना है', 'गंभीर बग मिला, पहले उसे ठीक करना है', 'कल जरूरतें बदल गईं, योजना पुनर्व्यवस्थित कर रहा हूं', 'बहुत ज्यादा मर्ज कॉन्फ्लिक्ट, एक-एक करके हल कर रहा हूं'],
      ar: ['بيئة الاختبار تحطمت، أصلحها بشكل عاجل', 'واجهة برمجية لطرف ثالث تغيرت، أحتاج للتكييف', 'وجدت خطأ حرجاً في حالة حدية، يجب إصلاحه أولاً', 'المتطلبات تغيرت أمس، أعيد تعديل النهج', 'تعارضات دمج كثيرة، أحلها واحدة تلو الأخرى'],
    },
    ridiculous: {
      zh: ['我的代码获得了自我意识，正在和它谈判', '键盘上的Ctrl键今天罢工了，不让我用快捷键', '咖啡机坏了，没有了咖啡我无法写代码', '我的橡皮鸭辞职了，没有它我无法调试', '今天五行缺bug，写出来的代码太完美不敢提交'],
      en: ['My code gained self-awareness, I am negotiating with it', 'The Ctrl key on my keyboard went on strike, no shortcuts today', 'The coffee machine broke, without coffee I cannot write code', 'My rubber duck resigned, I cannot debug without it', 'The stars say no bugs today, my code is too perfect to submit'],
      es: ['Mi codigo gano autoconciencia, estoy negociando con el', 'La tecla Ctrl de mi teclado esta en huelga, sin atajos hoy', 'La maquina de cafe se rompio, sin cafe no puedo programar', 'Mi pato de goma renuncio, no puedo depurar sin el', 'Las estrellas dicen que no hay bugs hoy, mi codigo es perfecto'],
      fr: ['Mon code a pris conscience, je negocie avec lui', 'La touche Ctrl de mon clavier est en greve, plus de raccourcis', 'La machine a cafe est cassee, sans cafe je ne peux pas coder', 'Mon canard en caoutchouc a demissionne, je ne peux pas deboguer', 'Les etoiles disent pas de bugs, mon code est trop parfait'],
      hi: ['मेरे कोड ने खुद को जागरूक कर लिया, मैं उससे बातचीत कर रहा हूं', 'कीबोर्ड की Ctrl की हड़ताल पर है, आज कोई शॉर्टकट नहीं', 'कॉफी मशीन खराब हो गई, कॉफी के बिना कोड नहीं लिख सकता', 'मेरे रबर डक ने इस्तीफा दे दिया, उसके बिना डीबग नहीं कर सकता', 'आज बग नहीं है, कोड बहुत परफेक्ट है, सबमिट करने में डर लगता है'],
      ar: ['الكود أصبح واعياً، أتفاوض معه', 'مفتاح Ctrl في لوحة المفاتيح يضرب، لا اختصارات اليوم', 'آلة القهوة تعطلت، بلا قهوة لا أستطيع البرمجة', 'بطتي المطاطية استقالت، لا أستطيع التصحيح بدونها', 'النجوم تقول لا أخطاء اليوم، كودي مثالي جداً'],
    },
  },
};

const SCENARIO_ICONS: Record<Scenario, typeof Clock4> = {
  late: Clock4,
  'skip-work': Briefcase,
  'cancel-plans': CalendarX,
  deadline: MessageCircle,
};

export default function ExcuseGenerator({ locale = 'zh' }: ExcuseGeneratorProps) {
  const t = i18n[locale] || i18n.zh;
  const [scenario, setScenario] = useState<Scenario>('late');
  const [mode, setMode] = useState<Mode>('serious');
  const [excuse, setExcuse] = useState('');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(() => {
    const pool = EXCUSES[scenario]?.[mode]?.[locale] || EXCUSES[scenario]?.[mode]?.en || [];
    if (pool.length === 0) return;
    const idx = Math.floor(Math.random() * pool.length);
    setExcuse(pool[idx]);
    setCopied(false);
  }, [scenario, mode, locale]);

  const handleCopy = () => {
    if (!excuse) return;
    navigator.clipboard.writeText(excuse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const card = cardRef.current;
    if (!card || !excuse) return;
    // Create a canvas to render the card
    const canvas = document.createElement('canvas');
    const W = 600;
    const H = 340;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Border accent
    ctx.fillStyle = mode === 'serious' ? '#3b82f6' : '#a855f7';
    ctx.fillRect(0, 0, W, 4);

    // Label
    ctx.fillStyle = mode === 'serious' ? '#60a5fa' : '#c084fc';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'start';
    const labels: Record<string, string> = { zh: '借口卡片', en: 'EXCUSE CARD', es: 'TARJETA', fr: 'CARTE', hi: 'कार्ड', ar: 'بطاقة' };
    ctx.fillText(labels[locale] || 'EXCUSE CARD', 28, 38);

    // Scenario label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText(t['s' + scenario.charAt(0).toUpperCase() + scenario.slice(1).replace('-', '')] || scenario, 28, 60);

    // Quote marks
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = 'bold 80px serif';
    ctx.fillText('"', 20, 130);

    // Excuse text - wrap
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '18px sans-serif';
    const maxWidth = W - 56;
    const words = excuse.split(' ');
    let line = '';
    let y = 130;
    const lines: string[] = [];
    for (const word of words) {
      const test = line + (line ? ' ' : '') + word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    for (const l of lines) {
      ctx.fillText(l, 28, y);
      y += 26;
    }

    // Footer
    ctx.fillStyle = '#475569';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'end';
    ctx.fillText('Korelyy', W - 20, H - 16);

    const link = document.createElement('a');
    link.download = `excuse-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const scenarioBtns: { key: Scenario; label: string; icon: typeof Clock4 }[] = [
    { key: 'late', label: t.sLate, icon: Clock4 },
    { key: 'skip-work', label: t.sSkipWork, icon: Briefcase },
    { key: 'cancel-plans', label: t.sCancelPlans, icon: CalendarX },
    { key: 'deadline', label: t.sDeadline, icon: MessageCircle },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {/* Scenario selector */}
      <div className="mb-4">
        <span className="block text-sm text-gray-500 dark:text-gray-400 mb-2">{t.scenario}</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scenarioBtns.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setScenario(key); setExcuse(''); }}
              className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-medium transition min-h-[44px] ${
                scenario === key
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode toggle */}
      <div className="mb-4">
        <span className="block text-sm text-gray-500 dark:text-gray-400 mb-2">{t.mode}</span>
        <div className="flex gap-2">
          {([
            { key: 'serious' as Mode, label: t.serious },
            { key: 'ridiculous' as Mode, label: t.ridiculous },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setMode(key); setExcuse(''); }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition min-h-[44px] ${
                mode === key
                  ? key === 'serious'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[44px] font-medium shadow-md mb-4"
      >
        <Shuffle size={20} />
        {t.generate}
      </button>

      {/* Result card */}
      {excuse ? (
        <>
          <div
            ref={cardRef}
            className={`rounded-2xl p-6 mb-4 border shadow-sm ${
              mode === 'serious'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
            }`}
          >
            <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              mode === 'serious' ? 'text-blue-500 dark:text-blue-400' : 'text-purple-500 dark:text-purple-400'
            }`}>
              {t['s' + scenario.charAt(0).toUpperCase() + scenario.slice(1).replace('-', '')]}
            </div>
            <p className="text-lg text-gray-800 dark:text-gray-100 leading-relaxed" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              "{excuse}"
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition min-h-[44px] font-medium"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? t.copied : t.copy}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition min-h-[44px] font-medium shadow-md"
            >
              <Download size={18} />
              {t.download}
            </button>
          </div>
        </>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-300 dark:text-gray-600 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-sm">{t.empty}</p>
        </div>
      )}
    </div>
  );
}
