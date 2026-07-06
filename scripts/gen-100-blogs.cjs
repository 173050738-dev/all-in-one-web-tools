#!/usr/bin/env node
/* eslint-disable */
/* 生成 100 篇 6 语言博客，追加到 data/blog.ts BLOG_POSTS 数组末尾
 * 元数据（title/description/keywords/tags/relatedToolSlugs/readingMinutes）6 语言完整；
 * 正文 content 按分类+主题参数化 6 语言模板生成，每篇 ≥ 14 个 blocks
 */
const fs = require('fs');
const path = require('path');

const BLOG_TS = path.resolve(__dirname, '..', 'data', 'blog.ts');
let SRC = fs.readFileSync(BLOG_TS, 'utf8');

// ===== 25 分类 × 4 主题 = 100 篇 种子清单（en/zh 描述 + en 标题作为其他语言 fallback =====
const TAG6 = (e,z,es,f,h,a)=>({en:e,zh:z,es:es,fr:f,hi:h,ar:a});
const CATS = [
  {id:'running', name:{en:'Running',zh:'跑步',es:'Running',fr:'Course',hi:'रनिंग',ar:'الجري'},
   related:['nike-run-club','strava','garmin-connect','runkeeper','asics-runkeeper'],
   tags:[TAG6('Running','跑步','Running','Course','रनिंग','الجري'),TAG6('Training','训练','Entrenamiento','Entraînement','ट्रेनिंग','التدريب'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')],
   daysSeed:[1,3,5,7],
   topics:[
    {s:'cadence-180-step-rate-training', t:{en:'180 Steps/Min Cadence Training 2026',zh:'2026 跑者步频 180 训练手册',es:'Entrenamiento Cadencia 180',fr:'Cadence 180 Coureurs 2026',hi:'कैडेंस 180 ट्रेनिंग 2026',ar:'تدريب وتيرة ١٨٠ خطوة للعدائين'},
     d:{en:'Why 180 spm is Jack Daniels gold standard — + a 12-wk block to lift cadence 150→180 safely.',zh:'为什么 180 步频是黄金标准，以及 12 周从 150 提升到 180 不受伤方案。',es:'Por qué 180 spm es el estándar + bloque 12 semanas 150→180.',fr:'Pourquoi 180 spm étalon + bloc 12 sem 150→180 sans blessure.',hi:'180 स्पीएम क्यों स्टैंडर्ड + 12 सप्ताह 150→180 बिना चोट।',ar:'لماذا ١٨٠ خطوة في الدقيقة هي المعيار مع جدول ١٢ أسبوع للانتقال من ١٥٠ إلى ١٨٠ دون إصابة.'}},
    {s:'marathon-16-week-sub4-plan', t:{en:'16-Week Sub-4 Marathon Plan 2026',zh:'2026 破 4 马拉松 16 周训练计划',es:'Plan Sub-4 16 Semanas Maratón',fr:'Plan Sous-4h Marathon 16 Sem',hi:'सब-4 मैराथन 16 सप्ताह प्लान 2026',ar:'خطة الماراثون تحت الأربع ساعات ١٦ أسبوعاً'},
     d:{en:'80/12/8 three-pace build, weekly 32km progression, and a 7g/kg lean-mass carb-load schedule.',zh:'三配速 80/12/8 分布、每周 32km 递进、以及 7g/kg 去脂体重碳水加载日程。',es:'80/12/8 tres ritmos + larga 32km + carga CHO 7g/kg.',fr:'80/12/8 trois allures + 32km hebdo + charge CHO 7g/kg.',hi:'80/12/8 तीन पेस + 32km लंबी + 7g/kg कार्ब लोडिंग।',ar:'ثلاث وتيرات بنسبة ٨٠/١٢/٨ مع تدرج ٣٢ كم أسبوعياً و بروتوكول كربوهيدرات ٧ غرام لكل كجم كتلة نحيلة.'}},
    {s:'trail-gear-100km-ultra', t:{en:'100km Ultra-Trail Gear Checklist 2026',zh:'百公里越野跑装备清单 2026',es:'Checklist Ultra 100km 2026',fr:'Checklist Ultra 100km 2026',hi:'100km अल्ट्रा ट्रेल गियर चेकलिस्ट 2026',ar:'قائمة معدات الالترا تريل ١٠٠ كم'},
     d:{en:'Drop bags A (30km) & B (65km) packing + 17 waterproof layers that survive 2am thunderstorms.',zh:'30/65km 两个换装包打包 + 17 件能扛凌晨 2 点雷暴的防水分层。',es:'Bolsas A (30km) B (65km) + 17 capas impermeables para tormentas 2am.',fr:'Sacs A (30km) B (65km) + 17 couches étanches orages 2h.',hi:'ड्रॉप बैग A(30)/B(65) + 17 वॉटरप्रूफ लेयर्स 2am आंधी।',ar:'حقيبتا تبديل عند ٣٠ كم و ٦٥ كم مع ١٧ طبقة عازلة للماء تصمد أمام العواصف الرعدية.'}},
    {s:'hrm-chest-vs-optical', t:{en:'Chest Strap vs Optical HR Watch 2026',zh:'心率带 vs 光电心率表 2026',es:'Banda Pecho vs Reloj Óptico 2026',fr:'Ceinture vs Montre Optique FC 2026',hi:'चेस्ट स्ट्रैप vs ऑप्टिकल HR 2026',ar:'حزام الصدر مقابل ساعة النبض الضوئية ٢٠٢٦'},
     d:{en:'60km lab treadmill 6/12/18%-5% gradient — when optical drifts +28 bpm vs Polar H10.',zh:'60km 实验室坡度 6/12/18%↑ 与 -5%↓ 测试 — 光电相对 H10 何时漂移 +28bpm。',es:'60km cinta 6/12/18% + bajada -5% — cuándo óptico deriva +28 lpm vs H10.',fr:'60km tapis 6/12/18% -5% — quand optique dérive +28 vs H10.',hi:'60km ट्रेडमिल ग्रेडिएंट — ऑप्टिकल H10 के मुकाबले +28bpm कब ड्रिफ्ट करता है।',ar:'٦٠ كم على جهاز المشي بنسب ميلان ٦/١٢/١٨٪ هبوط ٥٪ و متى يحدث انحراف +٢٨ نبضة في القراءة الضوئية مقابل H10.'}},
   ]},
  {id:'cycling',name:{en:'Cycling',zh:'骑行',es:'Ciclismo',fr:'Cyclisme',hi:'साइकलिंग',ar:'الدراجات'},
   related:['strava','komoot','zwift','wahoo-systm','trainingpeaks'],
   tags:[TAG6('Cycling','骑行','Ciclismo','Cyclisme','साइकलिंग','الدراجات'),TAG6('Training','训练','Entrenamiento','Entraînement','ट्रेनिंग','التدريب'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')],
   daysSeed:[9,11,13,15],
   topics:[
    {s:'zwift-12w-ftp-build', t:{en:'Zwift 12-Week FTP Builder 2026',zh:'Zwift FTP 提升 12 周 2026',es:'Plan Zwift 12 Semanas FTP',fr:'Zwift 12 Semaines FTP 2026',hi:'Zwift FTP बढ़ाने का 12 सप्ताह 2026',ar:'خطة ١٢ أسبوعاً لرفع FTP على منصة Zwift ٢٠٢٦'},
     d:{en:'Sweet Spot 2×20 vs VO2 8×3 periodization + race-day 7-day taper.',zh:'甜蜜点 2×20 vs 摄氧 8×3 周期化 + 比赛日 7 天减量。',es:'Sweet Spot 2×20 vs VO2 8×3 + afilado 7 días.',fr:'Sweet Spot 2×20 vs VO2 8×3 + aiguillage 7j.',hi:'स्वीट स्पॉट 2×20 vs VO2 8×3 + रेस 7 दिन टेपर।',ar:'تدريبات منطقة Sweet Spot ٢×٢٠ مقابل VO2 ٨×٣ مع جدول تقليل الحمل قبل السباق.'}},
    {s:'bike-packing-light-setup', t:{en:'Bikepacking Light Setup 2026',zh:'2026 轻装长途骑行装备 7.8kg',es:'Equipaje Bikepacking Ligero 7,8kg',fr:'Montage Bikepacking Léger 7,8kg',hi:'बाइकपैकिंग लाइट सेटअप 7.8kg 2026',ar:'إعداد خفيف لرحلات الدراجات ٧٫٨ كجم ٢٠٢٦'},
     d:{en:'Harness/seat-pack/cargo cage mapping, 7.8kg touring build that stays warm at 2°C.',zh:'车把包/坐管包/货笼 三件组合、7.8kg 整车 2°C 仍能睡暖。',es:'Arnés + Bolsa Sillín + Portabultos para 7,8kg y dormir caliente a 2°C.',fr:'Harnais + Sac Selle + Cage 7,8kg et dormir chaud à 2°C.',hi:'हार्नेस + सीट-पैक + कार्गो केज 7.8kg और 2°C में गर्म सोना।',ar:'حزمة المقود و حقيبة المقعد و حامل الأمتعة لإجمالي ٧٫٨ كجم و دفء نوم عند ٢ درجة مئوية.'}},
    {s:'power-meter-buyers-guide', t:{en:'Power Meter Buyer Guide 2026',zh:'功率计选购指南 2026',es:'Guía Compra Potenciómetro 2026',fr:'Guide Capteur Puissance 2026',hi:'पावर मीटर खरीद गाइड 2026',ar:'دليل شراء مقاس القوة ٢٠٢٦'},
     d:{en:'Spider vs Pedal vs Hub — ±1% vs ±2% drift after 3000km + weekly calibration ritual.',zh:'爪盘 / 脚踏 / 花鼓 ±1% vs ±2% 3000km 漂移 + 每周校准仪式。',es:'Araña vs Pedales vs Maza deriva ±1% ±2% 3000km + calibración.',fr:'Araignée vs Pédales vs Moyeu dérive ±1% ±2% 3000km + calibration.',hi:'स्पाइडर vs पेडल vs हब 3000km ड्रिफ्ट + साप्ताहिक कैलिब्रेशन।',ar:'مقاس ذراع الدواسة و الدواسة و المحور مع مقارنة الانحراف ±١٪ و ±٢٪ بعد ٣٠٠٠ كم مع معايرة أسبوعية.'}},
    {s:'tdf-climbs-analytics', t:{en:'Tour de France Climbs 2026 Analytics',zh:'2026 环法爬坡数据分析',es:'Analítica Ascensos Tour 2026',fr:'Analyse Cols Tour France 2026',hi:'टूर डी फ्रांस क्लाइम्ब 2026 एनालिटिक्स',ar:'تحليل تسلقات طواف فرنسا ٢٠٢٦'},
     d:{en:"Alpe d'Huez 21 hairpins vs Tourmalet 5.2 W/kg drafting threshold + segment power-weight analysis.",zh:'阿尔普迪埃 21 弯 vs 图尔马莱 5.2W/kg 跟风门槛 + 分段功体比分析。',es:"Alpe d'Huez 21 vs Tourmalet 5,2W/kg umbral escobón + análisis W/kg.",fr:"Alpe d'Huez 21 vs Tourmalet 5,2W/kg seuil drafting + W/kg par segment.",hi:"Alpe d'Huez 21 बनाम Tourmalet 5.2W/kg ड्राफ्टिंग थ्रेशोल्ड + सेगमेंट W/kg।",ar:"جبل Alpe d'Huez ذو الـ ٢١ منعطف مقابل جبل Tourmalet و عتبة ٥٫٢ واط لكل كجم مع تحليل نسبة القوة للوزن لكل مقطع."}},
   ]},
  {id:'hiking',name:{en:'Hiking',zh:'徒步登山',es:'Senderismo',fr:'Randonnée',hi:'हाइकिंग',ar:'المشي في الجبال'},
   related:['komoot','alltrails','strava','onx-offroad','fatmap'],
   tags:[TAG6('Hiking','徒步登山','Senderismo','Randonnée','हाइकिंग','المشي في الجبال'),TAG6('Outdoor','户外','Aire Libre','Extérieur','आउटडोर','في الهواء الطلق'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')],
   daysSeed:[17,19,21,23],
   topics:[
    {s:'three-peak-3000m-pack', t:{en:'3-Peak 3000m+ Packing 2026',zh:'5日三峰 3000m+ 打包清单 2026',es:'Empaque 3 Picos >3000m 2026',fr:'Sac 3 Pics >3000m 2026',hi:'3 पीक 3000m+ पैकिंग 2026',ar:'تجهيز حقيبة ثلاث قمم فوق ٣٠٠٠ متر ٢٠٢٦'},
     d:{en:'14kg base-weight for 5-day solo alpine loop + 6 emergency items you never skip.',zh:'单人 5 天 14kg 基础装备 + 6 件老驴绝不会省的应急物。',es:'14kg peso base 5 días solitario + 6 ítems emergencia.',fr:'14kg poids de base 5 jours solo + 6 objets urgence.',hi:'14kg बेस वेट 5 दिन अकेला + 6 इमर्जेंसी आइटम।',ar:'١٤ كجم وزن أساسي لرحلة ٥ أيام منفردة مع ٦ قطع طوارئ لا يتخلى عنها المحترفون.'}},
    {s:'altitude-sickness-ams', t:{en:'Altitude AMS Protocol 2026',zh:'2026 高原反应处置手册',es:'Protocolo Mal de Altura 2026',fr:'Protocole Mal de l\'Altitude 2026',hi:'AMS मल ऑफ़ एल्टीट्यूड 2026 प्रोटोकॉल',ar:'بروتوكول مرض المرتفعات ٢٠٢٦'},
     d:{en:'Climb-high sleep-low above 2500m + AMS ≥4 immediate 500m descent hard rule.',zh:'2500m 爬高睡低 + AMS 评分 ≥4 立刻下 500m 铁则。',es:'Subir alto dormir bajo 2500m + regla 500m descenso si AMS ≥4.',fr:'Monter haut dormir bas >2500m + règle 500m si AMS ≥4.',hi:'2500m ऊंचे चढ़ो कम सोओ + AMS ≥4 पर तुरंत 500m उतरो।',ar:'صعدوا عالياً و ناموا منخفضين فوق ٢٥٠٠ متر مع قاعدة هبوط ٥٠٠ متر فوري عند تجاوز علامات المرض الدرجة ٤.'}},
    {s:'100km-hike-nutrition', t:{en:'100km Hike Nutrition 2026',zh:'百公里徒步补给 2026',es:'Nutrición Trekking 100km 2026',fr:'Nutrition Traversée 100km 2026',hi:'100km हाइक न्यूट्रिशन 2026',ar:'تغذية رحلة مشي ١٠٠ كم ٢٠٢٦'},
     d:{en:'300 kcal/hr density + 700 mg Na+/hr electrolyte + 48-hour re-supply cache math.',zh:'每小时 300kcal / 钠 700mg + 48 小时埋点补给数学。',es:'300kcal/hr + 700 mg Na+/hr + cache 48h abastecimiento.',fr:'300kcal/h + 700mg Na+/h + cache ravitaillement 48h.',hi:'300kcal/घंटा + 700mg Na+/hr + 48 घंटे कैश।',ar:'٣٠٠ سعر حراري في الساعة و ٧٠٠ ملجم صوديوم في الساعة مع مخزون إمداد ٤٨ ساعة.'}},
    {s:'trekking-pole-technique', t:{en:'Trekking Pole Technique 2026',zh:'登山杖正确技术 2026',es:'Técnica Bastones Trekking 2026',fr:'Technique Bâtons Randonnée 2026',hi:'ट्रेकिंग पोल तकनीक 2026',ar:'تقنية عصي المشي ٢٠٢٦'},
     d:{en:'Plant physics + 15° lean reduces knee shear 31% descending + 4 lock systems ranked.',zh:'下杖物理 + 15° 前倾膝盖剪切降 31% + 四种锁紧系统排名。',es:'Física apoyo + inclinación 15° -31% rodilla + 4 cierres.',fr:'Physique appui + inclinaison 15° -31% genou + 4 verrous.',hi:'प्लांट फिजिक्स + 15° झुकाव घुटना शीयर -31% + 4 लॉक सिस्टम।',ar:'فيزياء الدفع مع ميل ١٥ درجة يخفض قوة قص الركبة بنسبة ٣١٪ مع تصنيف ٤ أنظمة قفل.'}},
   ]},
  {id:'yoga',name:{en:'Yoga',zh:'瑜伽普拉提',es:'Yoga',fr:'Yoga',hi:'योग',ar:'اليوغا'},
   related:['yoga-with-adriene','downdog','alo-moves','headspace','calm'],
   tags:[TAG6('Yoga','瑜伽','Yoga','Yoga','योग','اليوغا'),TAG6('Wellness','健康','Bienestar','Bien-être','स्वास्थ्य','العافية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')],
   daysSeed:[25,27,29,31],
   topics:[
    {s:'desk-5min-neck-yoga', t:{en:'5-Min Desk Neck Yoga 2026',zh:'办公室 5 分钟颈肩瑜伽 2026',es:'Yoga Cuello Oficina 5 Min 2026',fr:'Yoga Cou Bureau 5min 2026',hi:'डेस्क 5 मिनट गर्दन योग 2026',ar:'يوغا الرقبة للمكتب ٥ دقائق ٢٠٢٦'},
     d:{en:'6 gentle moves to reverse 40hr/wk forward-head posture + real-time muscle length checks.',zh:'6 个温和体式逆转每周 40 小时头前伸 + 实时肌长检查。',es:'6 movimientos suaves para postura cabeza 40h/sem + controles longitud.',fr:'6 mouvements doux posture tête 40h/sem + contrôles longueur.',hi:'6 सॉफ्ट मूव 40 घंटे/सप्ताह फॉरवर्ड-हेड + रियल-टाइम मसल लेंथ।',ar:'٦ حركات لطيفة لعلاج وضعية الرأس المتقدمة بعد ٤٠ ساعة أسبوعياً مع فحص طول العضلات لحظي.'}},
    {s:'yin-yoga-sequence-60min', t:{en:'60-Min Yin Sequence 2026',zh:'60 分钟阴瑜伽排课 2026',es:'Secuencia Yin 60min 2026',fr:'Séquence Yin 60min 2026',hi:'60 मिनट यिन योग 2026',ar:'تسلسل يوغا يين ٦٠ دقيقة ٢٠٢٦'},
     d:{en:'7 poses × 3-5 min fascia release + kidney / liver / lung meridian mapping.',zh:'7 个体式 × 3-5 分钟筋膜放松 + 肾/肝/肺经络映射。',es:'7 posturas × 3-5min liberación fascia + riñón hígado pulmón meridianos.',fr:'7 postures × 3-5min libération fascia + méridiens rein foie poumon.',hi:'7 पोज × 3-5 मिनट फैसिया + गुर्दा / यकृत / फेफड़े मेरिडियन।',ar:'٧ أوضاع × ٣ إلى ٥ دقائق لإطلاق النسيج الضام مع خرائط خطوط الطاقة للكلية و الكبد و الرئتين.'}},
    {s:'pilates-reformer-beginner', t:{en:'Pilates Reformer Beginner 2026',zh:'普拉提核心床入门 2026',es:'Reformer Principiante 2026',fr:'Pilates Reformer Débutant 2026',hi:'पिलेट्स रिफॉर्मर बिगिनर 2026',ar:'مبتدئ جهاز البيلاتس ريورمر ٢٠٢٦'},
     d:{en:'10 neutral-spine cues to stop cheating + 8-week strength progressive overload.',zh:'10 条中立脊柱纠正提示 + 8 周力量渐进超负荷。',es:'10 indicaciones columna neutral + 8 semanas sobrecarga progresiva.',fr:'10 indices colonne neutre + 8 semaines surcharge progressive.',hi:'10 न्यूट्रल स्पाइन क्यूस + 8 सप्ताह प्रोग्रेसिव ओवरलोड।',ar:'١٠ إشارة لوضع العمود الفقري المحايد مع ٨ أسابيع تحميل تدريجي للقوة.'}},
    {s:'postpartum-yoga-30day', t:{en:'Postpartum 30-Day Yoga 2026',zh:'产后 30 天瑜伽回归 2026',es:'Yoga Postparto 30 Días 2026',fr:'Yoga Post-Partum 30 Jours 2026',hi:'पोस्टपार्टम 30 दिन योग 2026',ar:'يوغا ما بعد الولادة ٣٠ يوماً ٢٠٢٦'},
     d:{en:'Diastasis-recti safe core (no crunches) + 2-phase pelvic floor rehab protocol.',zh:'腹直肌分离安全核心（绝无卷腹）+ 两阶段盆底肌康复。',es:'Core seguro diástasis sin abdominales + suelo pélvico 2 fases.',fr:'Gainage sûr diastase sans crunch + périnée 2 phases.',hi:'डायस्टेसिस सुरक्षित कोर बिना क्रंच + पेल्विक फ्लोर 2 फेज़।',ar:'عضلات مركز آمنة لفصل عضلات البطن المستقيمة بدون ضغط مع بروتوكول تأهيل قاع الحوض مرحلتين.'}},
   ]},
  {id:'strength',name:{en:'Strength',zh:'力量训练',es:'Fuerza',fr:'Force',hi:'स्ट्रेंथ',ar:'التدريب المقاوم'},
   related:['strong','trainerroad','fitbod','peloton','nike-training-club'],
   tags:[TAG6('Strength','力量训练','Fuerza','Force','स्ट्रेंथ','التدريب المقاوم'),TAG6('Gym','健身','Gimnasio','Gym','जिम','نادي رياضي'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')],
   daysSeed:[33,35,37,39],
   topics:[
    {s:'beginner-5x5-linear', t:{en:'Novice 5×5 Linear Progression 2026',zh:'新手 5×5 线性计划 2026',es:'Progresión Lineal 5×5 Principiante',fr:'Progression Linéaire 5×5 Débutant',hi:'नोविस 5×5 लीनियर 2026',ar:'التدرج الخطي للمبتدئين خمس مجموعات خمس تكرارات ٢٠٢٦'},
     d:{en:'3×/wk squat/bench/deadlift + 2.5kg jumps + deload every 6 weeks.',zh:'每周 3 次深蹲/卧推/硬拉 + 2.5kg 步进 + 6 周一次减量。',es:'3×/sem sentadilla/banca/peso muerto + 2,5kg + descarga 6s.',fr:'3×/sem squat/développé/soulevé + 2,5kg + décharge 6sem.',hi:'3×/सप्ताह स्क्वैट/बेंच/डेड + 2.5kg जम्प + हर 6 सप्ताह डीलोड।',ar:'ثلاث جلسات أسبوعياً للقرفصاء و الضغط المستلقي و رفع الأثقال مع زيادة ٢٫٥ كجم و تقليل الحمل كل ٦ أسابيع.'}},
    {s:'big-three-form-correction', t:{en:'Big 3 Lift Form 2026',zh:'三大项动作纠型 2026',es:'Forma 3 Levantamientos 2026',fr:'Forme 3 Soulevés 2026',hi:'बिग 3 लिफ्ट फॉर्म 2026',ar:'تصحيح حركات الرافعات الكبرى الثلاث ٢٠٢٦'},
     d:{en:'9 cues: neutral spine squat, scapular retraction bench, hinge-pattern deadlift stop rounding.',zh:'9 个语音提示：中立脊深蹲/肩胛回缩卧推/铰链不圆背硬拉。',es:'9 indicaciones: columna neutral, escápulas retraídas, bisagra peso muerto.',fr:'9 cues: colonne neutre, scapules, charnière soulevé.',hi:'9 क्यूस: न्यूट्रल स्पाइन स्क्वॉट, स्कैप रीट्रैक्शन बेंच, हिंज डेड।',ar:'٩ إشارات: عمود فقري محايد في القرفصاء و شد لوحي الكتف في الضغط و نمط المفصلة في رفع الأثقال.'}},
    {s:'functional-training-8w', t:{en:'8-Week Functional Block 2026',zh:'8 周功能性训练 2026',es:'Bloque Funcional 8 Semanas 2026',fr:'Bloc Fonctionnel 8 Semaines 2026',hi:'8 सप्ताह फंक्शनल 2026',ar:'كتلة تدريب وظيفي ٨ أسابيع ٢٠٢٦'},
     d:{en:'Anti-rotation core + single-leg stability + gait-specific carry transference to 5km run.',zh:'抗旋核心 / 单腿稳定 / 步态搬运 直接转化为 5km 跑成绩。',es:'Core antirotación + estabilidad monopodal + transferencia a 5km.',fr:'Gainage antirot + monopode + transfert portés → 5km.',hi:'एंटी रोटेशन कोर + सिंगल लेग स्टेबिलिटी + गेट कैरी → 5km रन।',ar:'عضلات المركز المضادة للدوران و استقرار الساق الواحدة و حمل الأثقال لنمط المشي مع تحويل النتائج إلى جولة ٥ كم.'}},
    {s:'dumbbell-home-100', t:{en:'100 Dumbbell Home Workouts 2026',zh:'家庭哑铃 100 练 2026',es:'100 Rutinas Mancuernas Casa 2026',fr:'100 Séances Haltères Domicile 2026',hi:'घर में डंबल 100 वर्कआउट 2026',ar:'١٠٠ تدريب منزلي بأثقال القطب ٢٠٢٦'},
     d:{en:'20-30min upper/lower/full blocks + progressive overload math without a rack.',zh:'20-30 分钟上/下/全身 + 无架渐进超负荷换算。',es:'20-30min sup/inf/completo + sobrecarga progresiva sin rack.',fr:'20-30min haut/bas/complet + surcharge sans rack.',hi:'20-30min अपर/लोअर/फुल बॉडी + बिना रैक के ओवरलोड गणित।',ar:'٢٠ إلى ٣٠ دقيقة لأجزاء العلوية و السفلية و كامل الجسم مع رياضيات التحميل بدون رف أثقال.'}},
   ]},
];

// 剩余分类（游泳/康复/营养/赛事/心理/PDF/图像/AI办公/时间/项目/ CSS/JS性能/Docker/Next/API/ 站内SEO/社媒矩阵 / Korelyy运营 /独立站变现 / 跨境合规 —— 共 20 类 × 4 = 80 篇）用种子 id + 索引生成
const REST_CATS = [
  {id:'swimming', name:{en:'Swim',zh:'游泳',es:'Natación',fr:'Natation',hi:'तैराकी',ar:'السباحة'}, related:['swimsmooth','trainerroad','strava','garmin-connect','myswimpro'], tags:[TAG6('Swimming','游泳','Natación','Natation','तैराकी','السباحة'),TAG6('Technique','技术','Técnica','Technique','तकनीक','التقنية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'rehab', name:{en:'Rehab',zh:'康复',es:'Rehabilitación',fr:'Rééducation',hi:'रिहैब',ar:'التأهيل'}, related:['physitrack','strava','nrc','headspace','calm'], tags:[TAG6('Rehab','康复','Rehabilitación','Rééducation','रिहैब','التأهيل'),TAG6('Recovery','恢复','Recuperación','Récupération','रिकवरी','التعافي'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'nutrition', name:{en:'Nutrition',zh:'营养',es:'Nutrición',fr:'Nutrition',hi:'पोषण',ar:'التغذية'}, related:['myfitnesspal','cronometer','fatsecret','strava','trainerroad'], tags:[TAG6('Nutrition','营养','Nutrición','Nutrition','पोषण','التغذية'),TAG6('Diet','饮食','Dieta','Régime','आहार','النظام الغذائي'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'racing', name:{en:'Racing',zh:'赛事',es:'Carreras',fr:'Courses',hi:'स्पोर्ट्स',ar:'السباقات'}, related:['raceday','ultrasignup','startlist','letsfind','maratodes'], tags:[TAG6('Racing','赛事','Carreras','Courses','स्पोर्ट्स','السباقات'),TAG6('Strategy','策略','Estrategia','Stratégie','रणनीति','الاستراتيجية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'mental', name:{en:'Sports Psych',zh:'运动心理',es:'Psicol. Deporte',fr:'Psycho Sport',hi:'खेल मनोविज्ञान',ar:'علم النفس الرياضي'}, related:['headspace','calm','nike-run-club','strava','sportpsych'], tags:[TAG6('Sports Psychology','运动心理','Psicología Deportiva','Psychologie du Sport','खेल मनोविज्ञान','علم النفس الرياضي'),TAG6('Mindset','心态','Mentalidad','État d\'esprit','मानसिकतا','العقلية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'pdf', name:{en:'PDF',zh:'PDF',es:'PDF',fr:'PDF',hi:'PDF',ar:'ملفات PDF'}, related:['smallpdf','ilovepdf','pdffiller','adobe-acrobat','pdf24-tools'], tags:[TAG6('PDF Tools','PDF工具','Herramientas PDF','Outils PDF','PDF उपकरण','أدوات PDF'),TAG6('Productivity','效率','Productividad','Productivité','उत्पादकता','الإنتاجية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'image', name:{en:'Image',zh:'图像处理',es:'Imagen',fr:'Image',hi:'इमेज',ar:'الصور'}, related:['canva','photopea','removebg','squoosh','imagetopdf'], tags:[TAG6('Image','图像处理','Imagen','Image','इमेज','الصور'),TAG6('Design','设计','Diseño','Design','डिज़ाइन','التصميم'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'aioffice', name:{en:'AI Office',zh:'AI办公',es:'IA Oficina',fr:'IA Bureau',hi:'एआई ऑफिस',ar:'المكتب الذكي'}, related:['grammarly','deepl-write','notion-ai','chatpdf','perplexity'], tags:[TAG6('AI Office','AI办公','IA en Oficina','IA au Bureau','एआई ऑफिस','المكتب الذكي'),TAG6('Productivity','效率','Productividad','Productivité','उत्पादकता','الإنتاجية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'timemanagement', name:{en:'Time Mgmt',zh:'时间管理',es:'Gestión Tiempo',fr:'Gestion Temps',hi:'समय प्रबंधन',ar:'إدارة الوقت'}, related:['notion','todoist','ticktick','anydo','microsoft-to-do'], tags:[TAG6('Time Management','时间管理','Gestión del Tiempo','Gestion du Temps','समय प्रबंधन','إدارة الوقت'),TAG6('Productivity','效率','Productividad','Productivité','उत्पादकता','الإنتاجية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'project', name:{en:'PM',zh:'项目管理',es:'Gestión Proyectos',fr:'Gestion Projets',hi:'प्रोजेक्ट मैनेजमेंट',ar:'إدارة المشاريع'}, related:['asana','trello','notion','jira-work','linear'], tags:[TAG6('Project Management','项目管理','Gestión de Proyectos','Gestion de Projets','प्रोजेक्ट मैनेजमेंट','إدارة المشاريع'),TAG6('Teamwork','协作','Trabajo en Equipo','Travail d\'Équipe','टीमवर्क','العمل الجماعي'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'css', name:{en:'CSS',zh:'CSS新特性',es:'CSS',fr:'CSS',hi:'CSS',ar:'CSS'}, related:['codepen','caniuse','css-tricks','tailwind-css','photopea'], tags:[TAG6('CSS','CSS新特性','CSS','CSS','CSS','CSS'),TAG6('Frontend','前端','Frontend','Frontend','फ्रंटएंड','الواجهة الأمامية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'jsperf', name:{en:'JS Perf',zh:'JS性能',es:'Rendimiento JS',fr:'Perf JS',hi:'जेएस परफॉर्मेंस',ar:'أداء JS'}, related:['jsbench','jsbin','codepen','webpack','vitejs'], tags:[TAG6('JavaScript','JS性能','JavaScript','JavaScript','जावास्क्रिप्ट','جافا سكريبت'),TAG6('Performance','性能优化','Rendimiento','Performance','परफॉर्मेंस','الأداء'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'docker', name:{en:'Docker',zh:'Docker',es:'Docker',fr:'Docker',hi:'डॉकर',ar:'دوركر'}, related:['docker','portainer','k8s','render','railway'], tags:[TAG6('Docker','Docker','Docker','Docker','डॉकर','دوركر'),TAG6('DevOps','运维','DevOps','DevOps','डेवऑप्स','العمليات'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'nextssr', name:{en:'Next.js',zh:'Next SSR',es:'Next SSR',fr:'Next SSR',hi:'नेक्स्ट SSR',ar:'Next SSR'}, related:['vercel-nextjs','nextjs','turbo','supabase','cloudflare-pages'], tags:[TAG6('Next.js','Next.js','Next.js','Next.js','नेक्स्ट.जेएस','Next.js'),TAG6('SSR','服务端渲染','SSR','SSR','SSR','عرض من الخادم'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'api', name:{en:'API Design',zh:'API设计',es:'Diseño API',fr:'Design API',hi:'API डिज़ाइन',ar:'تصميم API'}, related:['postman','insomnia','openapi','swagger','hurl'], tags:[TAG6('API Design','API设计','Diseño API','Conception API','API डिज़ाइन','تصميم API'),TAG6('Backend','后端','Backend','Backend','बैकएंड','الواجهة الخلفية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'seoonpage', name:{en:'On-page SEO',zh:'站内SEO',es:'SEO On-Page',fr:'SEO On-Page',hi:'सीईओ ऑन-पेज',ar:'تحسين محركات البحث داخل الصفحة'}, related:['seobility','seorank','yoast-seo','ahrefs','semrush'], tags:[TAG6('SEO','站内SEO','SEO','SEO','सीईओ','تحسين محركات البحث'),TAG6('Traffic','流量','Tráfico','Trafic','ट्रैफ़िक','الزوار'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'socialmatrix', name:{en:'Social Matrix',zh:'社媒矩阵',es:'Matriz Redes',fr:'Matrice Sociale',hi:'सोशल मैट्रिक्स',ar:'المصفوفة الاجتماعية'}, related:['canva','buffer','later-hq','notion','capcut'], tags:[TAG6('Social Media','社媒矩阵','Redes Sociales','Réseaux Sociaux','सोशल मीडिया','وسائل التواصل'),TAG6('Marketing','营销','Marketing','Marketing','मार्केटिंग','التسويق'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'korelyyops', name:{en:'Korelyy Ops',zh:'Korelyy运营',es:'Ops Korelyy',fr:'Ops Korelyy',hi:'कोरेली ऑप्स',ar:'عمليات منصة Korelyy'}, related:['korelyy-studio','seo-mini','cron-job','kofi-unlock','privacypolicy-as-code'], tags:[TAG6('Korelyy','Korelyy运营','Korelyy','Korelyy','Korelyy','Korelyy'),TAG6('Operations','运营','Operaciones','Exploitation','ऑपरेशनز','العمليات التشغيلية'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'indiemonetize', name:{en:'Monetize',zh:'变现',es:'Monetización',fr:'Monétisation',hi:'इनकम',ar:'التحويل إلى دخل'}, related:['stripe','lemonsqueezy','gumroad','kofi-unlock','patreon'], tags:[TAG6('Monetization','变现','Monetización','Monétisation','मुद्रीकरण','التحويل إلى دخل'),TAG6('Indie','独立开发','Indie','Indépendant','इंडी','المستقلون'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
  {id:'compliance', name:{en:'Compliance',zh:'跨境合规',es:'Compliance',fr:'Conformité',hi:'कम्प्लायंस',ar:'الامتثال'}, related:['privacypolicy-as-code','termify','gdpr-check','cookiebot','one-trust'], tags:[TAG6('Compliance','跨境合规','Compliance','Conformité','कम्प्लायंस','الامتثال'),TAG6('Legal','法务','Legal','Juridique','कानूनी','القانوني'),TAG6('2026 Guide','2026指南','Guía 2026','Guide 2026','2026 गाइड','دليل ٢٠٢٦')]},
];

const restTitles = /* 20 类 × 4 主题索引 (i1..i4) */ {
  swimming:[
    {i1:'Freestyle High-Elbow Catch 2026',t1:'自由泳高肘抱水 2026',f1:'Codo Alto Crol',f2:'Coude-Haut Crawl',h1:'फ्रीस्टाइल हाई-एल्बो 2026',a1:'تقنية قبض الكوع العالي في الحرة ٢٠٢٦'},
    {i1:'Breaststroke Kick Timing 2026',t1:'蛙泳蹬腿时机 2026',f1:'Patada Braza',f2:'Battement Brasse',h1:'ब्रेस्टस्ट्रोक किक 2026',a1:'توقيت دفعة الأرجل في الفراشة ٢٠٢٦'},
    {i1:'Triathlon Open-Water 2026',t1:'铁三公开水域 2026',f1:'Aguas Abiertas Triatlón',f2:'Eau Libre Triatlon',h1:'ट्रायथलोन ओपन वॉटर 2026',a1:'السباحة في المياه المفتوحة للترياتلون ٢٠٢٦'},
    {i1:'Flip Turn Breakout 2026',t1:'翻转碰壁出水节奏 2026',f1:'Vuelta + Salida Pared',f2:'Virage + Sortie Mur',h1:'फ्लिप टर्न ब्रेकआउट 2026',a1:'الاستدارة عند الحائط و الانطلاق ٢٠٢٦'},
  ],
  rehab:[
    {i1:"Runner's Knee ITBS 4-Phase",t1:'跑步膝髂胫束 4 期康复',f1:'Rodilla Corredor 4 Fases',f2:'Genou Coureur 4 Phases',h1:"रनर्स नी ITBS 4-फेज़",a1:'تأهيل ركبة العدائين على أربع مراحل'},
    {i1:'Shoulder Impingement 4-Phase',t1:'肩峰撞击 4 期康复',f1:'Pinzamiento Hombro 4 Fases',f2:'Conflit Sous-Acromial 4 Phases',h1:'स्कैपुलर इम्पिंजमेंट 4-फेज़',a1:'تأهيل اصطدام كتف على أربع مراحل'},
    {i1:'Ankle Sprain RTS Protocol',t1:'踝关节扭伤重返赛场',f1:'Retorno Deporte Esguince Tobillo',f2:'Retour Sport Entorse Cheville',h1:'एंकल स्प्रेन रिटर्न-टू-स्पोर्ट',a1:'العودة للرياضة بعد التواء الكاحل'},
    {i1:'Low Back Core Stability',t1:'下背痛核心稳定训练',f1:'Dolor Lumbar Estabilidad Core',f2:'Douleur Lombaire Stabilité',h1:'लोअर बैक कोर स्टेबिलिटी',a1:'استقرار عضلات المركز لعلاج أسفل الظهر'},
  ],
  nutrition:[
    {i1:'Clean Bulk TDEE Calculator',t1:'干净增肌期热量计算',f1:'Volumen Limpio Cálculo TDEE',f2:'Prise de Masse Propre TDEE',h1:'क्लीन बल्क TDEE कैलकुलेटर',a1:'حساب احتياجات الطاقة للبناء النظيف للعضلات'},
    {i1:'Contest Prep Water Cut',t1:'备赛脱水保肌安排',f1:'Preparación Física Agua',f2:'Prépa Physique Manipulation Eau',h1:'कॉन्टेस्ट प्रेप वॉटर-कट',a1:'التحضير لمسابقات كمال الأجسام و التلاعب بالماء'},
    {i1:'BCAA vs Creatine Review',t1:'BCAA vs 一水肌酸对比',f1:'BCAA vs Creatina Monohidrato',f2:'BCAA vs Créatine Monohydrate',h1:'BCAA vs क्रिएटिन मोनोहाइड्रेट',a1:'مقارنة أحماض أمينية متفرعة السلسلة و الكرياتين'},
    {i1:'Vegan Complete Protein Matrix',t1:'素食完全蛋白矩阵',f1:'Matriz Proteína Vegana Completa',f2:'Matrice Protéine Complète Végane',h1:'वीगन प्रोटीन मैट्रिक्स',a1:'مصفوفة البروتين الكامل النباتي'},
  ],
  racing:[
    {i1:'UTMB Lottery Strategy',t1:'UTMB 抽签策略',f1:'Lotería UTMB Estrategia',f2:'Loterie UTMB Stratégie',h1:'UTMB लॉटरी स्ट्रैटेजी',a1:'استراتيجية قرعة بطولة UTMB العالمية'},
    {i1:'Beijing/Shanghai Marathon Entry',t1:'北马/上马 报名与直通',f1:'Inscripción Maratón Pekín-Shanghái',f2:'Inscription Pékin Shanghai',h1:'बीजिंग / शंघाई मैराथन एंट्री',a1:'التسجيل في ماراثوني بكين و شانغهاي'},
    {i1:'IRONMAN 70.3 Registration',t1:'IRONMAN 70.3 报名技巧',f1:'Inscripción IRONMAN 70.3 Trucos',f2:'Inscription IRONMAN 70.3 Astuces',h1:'IRONMAN 70.3 रजिस्ट्रेशन',a1:'نصائح التسجيل في سباق IRONMAN 70.3'},
    {i1:'Trail Points Accumulation',t1:'越野跑积分累计指南',f1:'Acumulación Puntos Trail',f2:'Cumul Points Trail',h1:'ट्रेल रनिंग पॉइंट्स एक्यूम्यूलेशन',a1:'دليل تراكم نقاط سباقات تسلق المسارات'},
  ],
  mental:[
    {i1:'Pre-Race Anxiety CBT',t1:'赛前焦虑 CBT 方案',f1:'Ansiedad Pre-Carrera TCC',f2:'Anxiété Pré-Course TCC',h1:'प्री-रेस एंग्जायटी CBT',a1:'العلاج السلوكي المعرفي لقلق ما قبل السباقات'},
    {i1:'Goal Periodization Pyramid',t1:'三层目标周期化金字塔',f1:'Periodización Metas Pirámide',f2:'Périodisation Buts Pyramide',h1:'गोल पीरियोडाइज़ेशन पिरामिड',a1:'تدوير الأهداف ببناء هرمي ثلاثي المستويات'},
    {i1:'Post-DNF Mental Recovery',t1:'失利 / DNF 赛后心理重建',f1:'Recuperación Mental Derrota',f2:'Rétablissement Mental Échec',h1:'पोस्ट-DNF मेंटल रिकवरी',a1:'التعافي النفسي بعد الهزيمة أو عدم إتمام السباق'},
    {i1:'Flow State Zone 5 Trigger',t1:'Zone 5 高强度心流触发',f1:'Flujo Zona 5 Disparadores',f2:'Flow Zone-5 Déclencheurs',h1:'फ्लो स्टेट ज़ोन 5 ट्रिगर',a1:'محفزات حالة الانسيابية في المنطقة الخامسة عالية الكثافة'},
  ],
  pdf:[
    {i1:'Batch E-Sign 100 Contracts',t1:'100 份合同批量电子签章',f1:'Firma Lote 100 Contratos',f2:'Signature Lot 100 Contrats',h1:'बैच ई-साइन 100 कॉन्ट्रैक्ट',a1:'التوقيع الإلكتروني المجمع لمئة عقد'},
    {i1:'Scanned PDF OCR + Tables',t1:'扫描件 OCR 表格还原',f1:'OCR PDF Escaneado + Tablas',f2:'OCR PDF Scanné + Tableaux',h1:'स्कैन PDF OCR + टेबल्स',a1:'التعرف الضوئي على الحروف و استعادة الجداول لملفات الممسوحة'},
    {i1:'Shrink PDFs by 80%',t1:'PDF 体积压缩 80% 手册',f1:'Comprimir PDF 80%',f2:'Réduire PDF de 80%',h1:'PDF 80% तक संकुचित करें',a1:'تصغير ملفات PDF بنسبة ٨٠٪'},
    {i1:'Build Fillable PDF Forms',t1:'可填写 PDF 表单制作',f1:'Formularios PDF Rellenables',f2:'Formulaires PDF Remplissables',h1:'फिलएबल PDF फॉर्म बनाना',a1:'إنشاء نماذج PDF القابلة للتعبئة'},
  ],
  image:[
    {i1:'ID Photo Background Swap',t1:'证件照白蓝红底切换',f1:'Cambio Fondo Foto Documento',f2:'Changement Fond Photo ID',h1:'ID फोटो बैकग्राउंड स्वैप',a1:'تبديل خلفية صور الوثائق'},
    {i1:'E-Commerce 500 SKU BG Remove',t1:'电商 500 SKU 批量抠图',f1:'Quitar Fondo 500 SKU E-Commerce',f2:'Suppression Fond 500 SKU E-Com',h1:'ईकॉमर्स 500 SKU बैच रिमूव बैकग्राउंड',a1:'إزالة الخلفية لـ ٥٠٠ منتج تجاري مجمعة'},
    {i1:'Long Screenshot Stitch',t1:'长截图拼接去重复导航栏',f1:'Unión Capturas Largas',f2:'Assemblage Captures Longues',h1:'लॉग स्क्रीनशॉट स्टिच',a1:'تجميع لقطات الشاشة الطويلة إزالة شريط التنقل'},
    {i1:'1000 Screenshots Resize+WM',t1:'千张截图统一尺寸加水印',f1:'1000 Capturas Redimensionar + Marca',f2:'1000 Captures Redimension + Filigrane',h1:'1000 स्क्रीनशॉट रीसाइज़ + वॉटरमार्क',a1:'تغيير حجم ألف لقطة شاشة مع علامة مائية مجمعة'},
  ],
  aioffice:[
    {i1:'AI Chinese Email Polish',t1:'AI 中文邮件 5 语体润色',f1:'Pulir Correos Chinos IA 5 Registros',f2:'Rédaction Emails Chinois IA',h1:'AI चाइनीज़ ईमेल पॉलिश',a1:'صقل الرسائل الصينية بالذكاء ٥ أنماط'},
    {i1:'AI Meeting Notes Summary',t1:'AI 会议纪要 5 类型摘要',f1:'Resumen IA Notas Reuniones 5 Tipos',f2:'Résumé IA Réunions 5 Types',h1:'AI मीटिंग सार 5 टाइप्स',a1:'ملخص اجتماعات ذكي ٥ أنواع مخرجات'},
    {i1:'AI Spreadsheet Data Cleaning',t1:'AI 表格 11 规则数据清洗',f1:'Limpieza Datos Hoja IA 11 Reglas',f2:'Nettoyage Données Tableur IA',h1:'AI स्प्रेडशीट डेटा क्लीनिंग',a1:'تنظيف بيانات الجداول ذكياً بـ ١١ قاعدة'},
    {i1:'AI PPT Outline → Deck',t1:'AI 大纲→幻灯片 7 页叙事',f1:'Esquema → Presentación IA 7 Diapositivas',f2:'Plan → Deck PPT IA 7 Slides',h1:'AI PPT आउटलाइन → स्लाइड्स',a1:'تحويل المخطط إلى عرض شرائح ذكي ٧ صفحات'},
  ],
  timemanagement:[
    {i1:'GTD Inbox Zero 90-Day',t1:'GTD 收件箱清空 90 天',f1:'GTD Bandeja Cero 90 Días',f2:'GTD Boîte Zéro 90 Jours',h1:'GTD इनबॉक्स ज़ीरो 90 दिन',a1:'إفراز الصندوق الوارد بنظام GTD ٩٠ يوماً'},
    {i1:'Energy 90min Ultradian Blocks',t1:'90 分钟超日节律精力块',f1:'Bloques Ultradianos 90min Energía',f2:'Blocs Ultradiens 90min Énergie',h1:'एनर्जी 90min अल्ट्राडियन',a1:'كتل طاقة ترددية ٩٠ دقيقة'},
    {i1:'Deep Work Cal Newport 4 Steps',t1:'纽波特深度工作 4 步法',f1:'Deep Work Cal Newport 4 Pasos',f2:'Deep Work Cal Newport 4 Étapes',h1:'कैल न्यूपोर्ट डीप वर्क 4 स्टेप्स',a1:'عمل عميق لأسلوب كال نيوبورت بأربع خطوات'},
    {i1:'Pomodoro Adapted for ADHD',t1:'番茄钟 ADHD 适配版',f1:'Pomodoro Adaptado TDAH',f2:'Pomodoro Adapté TDAH',h1:'ADHD एडेप्टेड पोमोडोरो',a1:'تقنية بومودورو المعدلة لاضطراب فرط الحركة'},
  ],
  project:[
    {i1:'Kanban vs Gantt Selection',t1:'看板 vs 甘特选型 9 因子',f1:'Kanban vs Gantt 9 Factores',f2:'Kanban vs Gantt 9 Facteurs',h1:'कानबन vs गैंट चयन',a1:'اختيار كانبان أو جانت بـ ٩ عوامل'},
    {i1:'Milestone 4-Level WBS',t1:'4 层工作分解里程碑',f1:'Desglose 4 Niveles WBS Hitos',f2:'WBS 4 Niveaux Jalons',h1:'माइलस्टोन 4-लेवल WBS',a1:'تجزئة المعالم على ٤ مستويات هيكلية'},
    {i1:'OKR ↔ KPI Alignment',t1:'OKR / KPI 三层对齐框架',f1:'Alineación OKR ↔ KPI 3 Capas',f2:'Alignement OKR ↔ KPI 3 Paliers',h1:'OKR ↔ KPI एलाइनमेंट',a1:'المواءمة ثلاثية المستويات بين أهداف و مؤشرات الأداء'},
    {i1:'Async-First 3-Doc Rule',t1:'异步协作三文档铁则',f1:'Colaboración Asíncrona 3 Documentos',f2:'Collaboration Asynchrone Règle 3 Docs',h1:'एसिंक-फर्स्ट 3-डॉक नियम',a1:'قاعدة المستندات الثلاثة للتعاون غير المتزامن'},
  ],
  css:[
    {i1:'Container Queries 11 Patterns',t1:'容器查询 11 种布局模式',f1:'Container Queries CSS 11 Patrones',f2:'Container Queries CSS 11 Modèles',h1:'CSS कंटेनर क्वेरी 11 पैटर्न',a1:'١١ نمط لاستعلامات الحاوية في CSS'},
    {i1:':has() Selector 7 Recipes',t1:':has() 选择器 7 招',f1:'Selector :has() 7 Recetas',f2:'Sélecteur :has() 7 Astuces',h1:':has() सिलेक्टर 7 टिप्स',a1:'٧ وصفات لمنتخب :has() في CSS'},
    {i1:'Native CSS Nesting 2026',t1:'原生 CSS 嵌套从 SCSS 迁移',f1:'Nesting Nativo CSS Migración SCSS',f2:'Nesting Natif CSS Migration SCSS',h1:'नेटिव CSS नेस्टिंग SCSS माइग्रेशन',a1:'التداخل الأصلي في CSS مع ترحيل سلس SCSS'},
    {i1:'Subgrid Card Alignment',t1:'Subgrid 卡片对齐魔法',f1:'Alineación Subgrid Tarjetas',f2:'Alignement Subgrid Cartes',h1:'सबग्रिड कार्ड अलाइनमेंट',a1:'محاذاة بطاقات الشبكة الفرعية Subgrid'},
  ],
  jsperf:[
    {i1:'Everyday JS Big-O Cheat Sheet',t1:'日常 JS 时间复杂度速查',f1:'Chuleta Big-O JS Diario',f2:'Aide-Mémoire Big-O JS',h1:'डेली JS Big-O चीट शीट',a1:'ورقة ملخص تعقيد خوارزميات JS الروتينية'},
    {i1:'Map vs Object Benchmark',t1:'Map vs Object 三规模基准',f1:'Benchmark Mapa vs Objeto',f2:'Benchmark Map vs Objet',h1:'Map बनाम ऑब्जेक्ट बेंचमार्क',a1:'اختبار قياس Map مقابل الكائن في ٣ أحجام'},
    {i1:'7 JS Memory Leak Patterns',t1:'7 类 JS 内存泄漏模式',f1:'7 Patrones Fugas Memoria JS',f2:'7 Fuites Mémoire JS Modèles',h1:'7 JS मेमोरी लीक पैटर्न',a1:'٧ أنماط لتسرب الذاكرة في جافا سكريبت'},
    {i1:'IdleCallback Non-Blocking Scheduler',t1:'requestIdleCallback 非阻塞调度',f1:'requestIdleCallback Planificador',f2:'requestIdleCallback Ordonnanceur',h1:'requestIdleCallback नॉन-ब्लॉकिंग',a1:'مجدول غير حازم باستخدام requestIdleCallback'},
  ],
  docker:[
    {i1:'Node Multi-Stage Dockerfile',t1:'Node Docker 多阶段 630→48MB',f1:'Dockerfile Multi-Stage Node 630→48MB',f2:'Dockerfile Multi-Étage Node 630→48MB',h1:'नोड मल्टी-स्टेज Dockerfile',a1:'ملف Docker متعدد المراحل لـ Node ٦٣٠→٤٨ ميغابايت'},
    {i1:'Docker HEALTHCHECK Best',t1:'Docker 健康检查 + 重启退避',f1:'HEALTHCHECK Docker + Retardo',f2:'HEALTHCHECK + Retrait',h1:'डॉकर हेल्थचेक + बैकऑफ',a1:'فحص صحة الحاوية مع سياسة إعادة تشغيل متدرجة'},
    {i1:'Volumes vs Bind Mounts',t1:'Volume vs Bind Mount 三场景对比',f1:'Volúmenes vs Bind Mounts 3 Escenarios',f2:'Volumes vs Bind Mounts 3 Cas',h1:'वॉल्यूम vs बाइंड माउंट 3 सीन',a1:'مقارنة مجلدات و الربط المباشر بثلاث سيناريوهات'},
    {i1:'Sidecar Logging Pattern',t1:'Docker 边车日志采集模式',f1:'Patrón Sidecar Logging Docker',f2:'Pattern Sidecar Logging Docker',h1:'डॉकर साइडकार लॉगिंग',a1:'نمط التسجيل في الحاوية المصاحبة بدوركر'},
  ],
  nextssr:[
    {i1:'RSC Boundary Design 5 Antis',t1:'RSC 边界设计 5 反模式',f1:'Diseño Frontera RSC 5 Anti-Patrones',f2:'5 Anti-Patterns Frontière RSC',h1:'RSC बाउंड्री 5 एंटी-पैटर्न',a1:'٥ أنماط مضادة لتصميم حدود مكونات الخادم'},
    {i1:'On-Demand ISR Revalidate',t1:'On-Demand ISR 按需重验证',f1:'Revalidación ISR Bajo Demanda',f2:'Revalidation ISR à la Demande',h1:'ऑन-डिमांड ISR रीवैलिडेट',a1:'إعادة التحقق من ISR عند الطلب'},
    {i1:'SearchParams Cache Keys',t1:'SearchParams 缓存键 7 陷阱',f1:'Claves Caché SearchParams 7',f2:'Clés Cache SearchParams 7',h1:'सर्चपैराम्स कैश कीज़ 7 गलतियाँ',a1:'٧ مفاجآت مفاتيح التخزين للبارامترات البحثية'},
    {i1:'Parallel Routes Modal',t1:'并行路由 URL 可分享模态框',f1:'Modal Rutas Paralelas URL Compartible',f2:'Modal Routes Parallèles URL Partageable',h1:'पैरलल रूट्स शेयरेबल मॉडल',a1:'نوافذ منبثقة متوازنة قابلة للمشاركة عبر URL'},
  ],
  api:[
    {i1:'REST vs GraphQL vs tRPC',t1:'REST / GraphQL / tRPC 选型矩阵',f1:'REST vs GraphQL vs tRPC Cuándo',f2:'REST vs GraphQL vs tRPC Quand',h1:'REST बनाम GraphQL बनाम tRPC चयन',a1:'REST و GraphQL و tRPC مصفوفة الاختيار'},
    {i1:'Idempotency 4 Patterns',t1:'幂等性 4 种生产实现',f1:'Idempotencia 4 Implementaciones',f2:'Idempotence 4 Implémentations',h1:'आइडेम्पोटेंसी 4 पैटर्न',a1:'أربع طرق لإنتاجية التماثل أثناء الطلبات المكررة'},
    {i1:'Sliding-Window Rate Limiter',t1:'滑动窗口 Redis 限流',f1:'Limitador Tasa Ventana Deslizante Redis',f2:'Limiteur Taux Fenêtre Glissante Redis',h1:'स्लाइडिंग विंडो रेट लिमिटर',a1:'محدد معدل الطلبات بنافذة منزلقة على Redis'},
    {i1:'Webhook HMAC + Replay Guard',t1:'Webhook HMAC 签名 + 重放防护',f1:'Firma HMAC Webhook + Anti-Replay',f2:'Signature HMAC Webhook Anti-Rejeu',h1:'वेबहुक HMAC सिग्नेचर रिप्ले गार्ड',a1:'توقيع HMAC لخطافات الويب مع الحماية من إعادة التشغيل'},
  ],
  seoonpage:[
    {i1:'12 Structured Data Schemas',t1:'12 种结构化数据富摘要',f1:'12 Esquemas Datos Estructurados',f2:'12 Schémas Données Structurées',h1:'12 स्ट्रक्चर्ड डेटा स्कीमा',a1:'١٢ مخطط بيانات منظمة لنتائج غنية'},
    {i1:'Silo Internal Linking',t1:'Silo 站内内链结构搭建',f1:'Enlazado Interno Silo',f2:'Maillage Interne Silo',h1:'साइलो इंटरनल लिंकिंग',a1:'بناء هيكل الربط الداخلي نمط الصوامع'},
    {i1:'TF-IDF Semantic Density',t1:'TF-IDF 语义密度 5 工具',f1:'Densidad Semántica TF-IDF',f2:'Densité Sémantique TF-IDF',h1:'TF-IDF सिमेंटिक डेंसिटी',a1:'كثافة المعنى الدلالي باستخدام TF-IDF'},
    {i1:'Core Web Vitals Tuning',t1:'三大核心指标达标清单',f1:'Ajuste Core Web Vitals',f2:'Réglage Core Web Vitals',h1:'कोर वेब वाइटल्स ट्यूनिंग',a1:'قائمة تحقيق مؤشرات الويب الأساسية'},
  ],
  socialmatrix:[
    {i1:'Xiaohongshu Content 3-3-3',t1:'小红书 3-3-3 选题公式',f1:'Fórmula Contenido Xiaohongshu 3-3-3',f2:'Formule Contenu Xiaohongshu',h1:'शाओहोंग्शु कंटेंट 3-3-3',a1:'معادلة المحتوى لمنصة شاوهونغ شو ٣-٣-٣'},
    {i1:'WeChat Article Pacing 2026',t1:'公众号排版节奏 2026',f1:'Ritmo Maquetación WeChat 2026',f2:'Rythme Mise en Page WeChat',h1:'वीचैट आर्टिकल पेसिंग 2026',a1:'إيقاع تنسيق مقالات منصة ويشات ٢٠٢٦'},
    {i1:'YouTube Shorts Hooks',t1:'YouTube Shorts 前 3 秒钩子库',f1:'Ganchos 3s YouTube Shorts',f2:'Crochets 3s YouTube Shorts',h1:'YouTube Shorts हुक 3 सेकंड',a1:'مكتبة خطافات الثلاث ثواني لـ YouTube Shorts'},
    {i1:'One Publish → 7 Platforms',t1:'一次制作分发 7 平台矩阵',f1:'Publicación 1 → 7 Plataformas',f2:'Publication 1 → 7 Plateformes',h1:'वन पब्लिश → 7 प्लेटफॉर्म',a1:'نشر لمرة واحدة ثم توزيع على ٧ منصات'},
  ],
  korelyyops:[
    {i1:'Tool Landing SEO Wrapper',t1:'工具详情页 SEO 包装法',f1:'Wrapper SEO Ficha Herramienta',f2:'Wrapper SEO Fiche Outil',h1:'टूल लैंडिंग SEO रैपर',a1:'تغليف SEO لصفحات الأدوات'},
    {i1:'Reviews → Conversion',t1:'用户评论转化心理学',f1:'Reseñas → Conversión Psicología',f2:'Avis → Conversion Psycho',h1:'यूजर रिव्यू → कन्वर्ज़न',a1:'تحويل مراجعات المستخدمين إلى معدلات شراء'},
    {i1:'Category Indexation Playbook',t1:'工具分类页索引提升秘籍',f1:'Guía Indexación Categorías',f2:'Guide Indexation Catégories',h1:'कैटेगरी इंडेक्सेशन प्लेबुक',a1:'دليل تحسين فهرسة صفحات التصنيفات'},
    {i1:'CTA Placement Heatmap',t1:'详情页 CTA 热力图布置',f1:'Mapa Calor CTA Fichas',f2:'Heatmap CTA Fiches',h1:'डिटेल CTA हीटमैप',a1:'خريطة حرارية لوضع زر الدعوة في صفحة التفاصيل'},
  ],
  indiemonetize:[
    {i1:'Affiliate 7-Vertical Selection',t1:'7 大类 Affiliate 选品模型',f1:'Modelo Selección Afiliado 7 Nichos',f2:'Modèle Sélection Affiliation 7',h1:'7 वर्टिकल Affiliेट चयन',a1:'٧ نماذج اختيار المنتجات للتسويق بالعمولة'},
    {i1:'Freemium Conversion Funnel',t1:'Freemium 免费转付费漏斗',f1:'Embudo Conversión Freemium',f2:'Entonnoir Conversion Freemium',h1:'Freemium कन्वर्ज़न फनेल',a1:'قمع تحويل المجاني إلى المدفوع'},
    {i1:'SaaS Annual Pricing Math',t1:'SaaS 年付定价 2.3x 法则',f1:'Precios SaaS Anuales 2.3x',f2:'Tarification SaaS Annuelle 2.3x',h1:'SaaS एनुअल प्राइसिंग 2.3x',a1:'رياضيات التسعير السنوي لمنتجات SaaS ٢٫٣x'},
    {i1:'Toolkit Bundle Subscription',t1:'工具包会员月费结构',f1:'Suscripción Paquete Herramientas',f2:'Abonnement Pack Outils',h1:'टूलकिट बंडल सब्सक्रिप्शन',a1:'هيكل الاشتراك الشهري لحزمة الأدوات'},
  ],
  compliance:[
    {i1:'GDPR Pseudonymization Flow',t1:'GDPR 假名化匿名化流程',f1:'Flujo Pseudoanonimato GDPR',f2:'Flux Pseudo-Anonymisation RGPD',h1:'GDPR स्यूडोनिमाइज़ेशन',a1:'تدفق إخفاء الهوية الجزئي وفقاً لقانون GDPR'},
    {i1:'CCPA Data Deletion API',t1:'CCPA 数据删除自助接口',f1:'API Borrado Datos CCPA',f2:'API Suppression Données CCPA',h1:'CCPA डेटा डिलीशन API',a1:'واجهة حذف البيانات الذاتية بملف CCPA'},
    {i1:'PCI SAQ-A 12-Question Self',t1:'PCI SAQ-A 自助 12 条评估',f1:'PCI SAQ-A Autoevaluación 12',f2:'PCI SAQ-A Autoévaluation 12',h1:'PCI SAQ-A सेल्फ असेसमेंट',a1:'التقييم الذاتي الاثنتا عشرة سؤالاً لمعيار PCI'},
    {i1:'Cookie Banner CMP Setup',t1:'Cookie Banner CMP 第三方配置',f1:'Configuración CMP Banner Cookies',f2:'Configuration CMP Bannière Cookies',h1:'कुकी बैनर CMP सेटअप',a1:'إعداد لافتة ملفات تعريف الارتباط مع مزود CMP'},
  ],
};

// ===== 正文模板生成：分类 × 主题索引 → 6 语言 14+ blocks =====
const BLOCK = (type, obj) => Object.assign({type}, obj);
const SIX = (e,z,es,f,h,a) => ({en:e,zh:z,es:es,fr:f,hi:h,ar:a});

function buildContent(catName, seed, topicIndex, catSlug){
  const CN = catName;
  const topicTitleEN = seed.t.en || seed.t.zh || '';
  const common = [
    BLOCK('h2', {text:SIX(
      '1. The Core Problem '+topicTitleEN+' Solves',
      '1. '+topicTitleEN+' 真正解决的核心问题',
      '1. El Problema Central que Resuelve Este Artículo',
      '1. Le Problème-Cœur Résolu',
      '1. मुख्य समस्या जो यह आर्टिकल हल करता है',
      '١. المشكلة الأساسية التي يحلها هذا المقال'
    )}),
    BLOCK('p',  {text:SIX(
      `Most teams / athletes / developers fail on ${catSlug} not because they lack tools but because they skip 3 decision gates. In this article we map each gate with a pass/fail checklist so you can audit your setup in 12 minutes.`,
      `绝大多数团队/运动者/开发者在 ${CN.en} 上失败，不是因为缺工具而是跳过了三道决策关。本文每道关都给一个通过/失败清单，12 分钟自查完毕。`,
      `La mayoría falla en ${catSlug} por saltar 3 puertas de decisión y no por falta de herramientas. Cada puerta trae lista aprobar/rechazar en 12 min.`,
      `La plupart échouent en ${catSlug} parce qu'ils sautent 3 portes décisionnelles — pas par manque d'outils. Chaque porte : liste valide/invalide 12 min.`,
      `ज़्यादातर टीमें ${CN.hi} में असफल होती हैं क्योंकि वे 3 डिसिज़न गेट छोड़ देती हैं। इस आर्टिकल में हर गेट के लिए पास/फेल चेकलिस्ट है, 12 मिनट में खुद चेक करें।`,
      `تخفق معظم الفرق و الرياضيين و المطورين في ${CN.ar} ليس لنقص الأدوات بل لتخطيهم ثلاث بوابات قرار. كل بوابة بها قائمة مراجعة نجاح/فشل ليتم التدقيق خلال ١٢ دقيقة.`
    )}),
    BLOCK('h3', {text:SIX(
      '1.1 Decision Gate 1 — Baseline Measurement',
      '1.1 第一关：基线测量',
      '1.1 Puerta 1 — Medición Base',
      '1.1 Porte 1 — Mesure de Base',
      '१.१ डिसिज़न गेट १ — बेसलाइन मेजरमेंट',
      '١.١ البوابة الأولى - القياس الأساسي'
    )}),
    BLOCK('ul', {items:[
      SIX('Define 3 objective KPIs, not 1 subjective feeling.', '定 3 条客观 KPI，不要 1 条主观感受。','Define 3 KPIs Objetivos, no 1 subjetivo.','Définis 3 KPI objectifs, pas 1 feeling subjectif.','3 वस्तुनिष्ठ KPI डिफाइन करें, केवल १ सब्जेक्टिव फीलिंग नहीं।','حددوا ٣ مؤشرات أداء موضوعية لا مجرد إحساس ذاتي واحد.'),
      SIX('Collect 7 days of baseline before any intervention.', '任何介入前必须先收集 7 天基线。','Recoge 7 días línea base antes de intervenir.','Collecte 7 jours de base avant intervention.','कोई भी इंटरवेंशन से पहले 7 दिन का बेसलाइन एकत्र करें।','اجمعوا بيانات خط الأساس لمدة ٧ أيام قبل أي تدخل.'),
      SIX('Record confidence interval (5th/50th/95th percentile).', '记录 5/50/95 百分位置信区间。','Registra intervalo de confianza 5/50/95 percentil.','Enregistre l\'intervalle de confiance P5/P50/P95.','कॉन्फिडेंस इंटरवल (५/५०/९५ पर्सेंटाइल) रिकॉर्ड करें.','سجلوا فترة الثقة بالخمسين وخمس وتسعين و المئة المئوية.'),
    ]}),
    BLOCK('h2', {text:SIX(
      '2. The Step-by-Step Playbook (9 Actions in Priority Order)',
      '2. 按优先级排序的 9 步操作手册',
      '2. Playbook Paso a Paso 9 Acciones Prioridad',
      '2. Playbook Étape par Étape 9 Actions',
      '२. ९ एक्शन का प्लेबुक (प्रायोरिटी क्रम में)',
      '٢. دليل الإجراء التدريجي - ٩ خطوات حسب الأولوية'
    )}),
    BLOCK('ol', {items:[
      SIX('Freeze your environment / equipment for the length of the test.', '测试期内冻结环境/工具不换。','Congela entorno/equipo durante toda la prueba.','Gèle environnement / équipement pendant le test.','टेस्ट अवधि में एनवायरनमेंट / इक्विपमेंट फ्रीज करें.','جمدوا بيئة التجربة و الأدوات طوال مدة الاختبار.'),
      SIX('Introduce only ONE variable each 7-day cycle.', '每个 7 天循环只引入 1 个变量。','Introduce solo UNA variable por ciclo de 7 días.','Introduis UNE seule variable par cycle de 7j.','हर ७ दिन के साइकिल में सिर्फ एक वेरिएबल बदलें.','قدموا متغيراً واحداً فقط خلال كل دورة مدتها ٧ أيام.'),
      SIX('Log delta against the 95th percentile of baseline.', '用基线 95 百分位对比变化。','Registra delta frente al percentil 95 de base.','Loggue le delta vs percentile 95 de base.','बेसलाइन ९५ पर्सेंटाइल के सामने डेल्टा लॉग करें.','سجلوا الفرق مقابل المئة الخامسة والتسعين من خط الأساس.'),
      SIX('Reject any change with a negative 5th percentile delta.', '5 百分位下降的变化直接回滚。','Rechaza cualquier cambio con delta percentil 5 negativo.','Rejette tout changement dont le percentile 5 régresse.','५ पर्सेंटाइल नेगेटिव डेल्टा वाला चेंज रोलबैक करें.','ارجعوا أي تغيير يقلل من المئة الخامسة.'),
      SIX('Document the protocol in one shareable page + screenshots.', '整份协议写进一页可分享文档 + 截图。','Documenta protocolo en una página compartible + capturas.','Documente le protocole sur 1 page partageable + captures.','प्रोटोकॉल को एक शेयरेबल पेज + स्क्रीनशॉट्स में डॉक्यूमेंट करें.','وثقوا البروتوكول في صفحة واحدة قابلة للمشاركة مع لقطات.'),
      SIX('Ask a teammate to spot-check 10% of the logs.', '队友抽检 10% 的日志，避免自欺。','Pide a un compañero revisar 10% de registros.','Demande à un collègue de vérifier 10% des logs.','एक टीममेट को १०% लॉग स्पॉट-चेक करवाएँ.','اطلبوا من زميل فحص عينة عشوائية ١٠٪ من السجلات.'),
      SIX('Run A/A sanity test every 4 weeks on the baseline tooling.', '每 4 周跑一次 A/A 自检确认基线工具没偏。','Corre test A/A cordura cada 4 semanas en tooling base.','Lance test A/A cohérence toutes les 4 semaines.','हर ४ सप्ताह A/A सैनिटी टेस्ट चलाएँ.','نفذوا اختبار ألف – ألف أسبوعياً للتحقق من أدوات خط الأساس.'),
      SIX('Hand-off checklist: pre-cond, steps, expected delta, rollback.', '交接清单：前置、步骤、预期差值、回滚。','Checklist entrega: precond, pasos, delta esperado, rollback.','Checklist passation : pré-conds, étapes, delta attendu, rollback.','हैंडऑफ चेकलिस्ट: प्री-कंड, स्टेप्स, एक्सपेक्टेड डेल्टा, रोलबैक.','قائمة التسليم: الشروط المسبقة و الخطوات و الفرق المتوقع و التراجع.'),
      SIX('Archive results to org-wide library + tag with 3 keywords.', '结果归档到组织知识库，打 3 个关键标签。','Archiva resultados en biblioteca + 3 palabras clave.','Archive résultats dans bibliothèque d\'équipe + 3 tags.','नतिजों को ऑर्ग लाइब्रेरी में आर्काइव करें + 3 टैग.','أرشفوا النتائج في مكتبة المؤسسة مع ٣ كلمات مفتاحية.'),
    ]}),
    BLOCK('h2',{text:SIX('3. 9 Common Pitfalls and How to Escape','3. 9 个常见陷阱以及如何脱困','3. 9 Errores Comunes y Cómo Evitarlos','3. 9 Pièges Fréquents + Échappatoires','३. ९ कॉमन पिटफॉल और कैसे बचें','٣. ٩ مخاطر شائعة و كيف تتجنبوها')}),
    BLOCK('ul',{items:[
      SIX('The "Hurry" trap: skipping baseline → all deltas look like noise.','「匆忙」陷阱：跳过基线 → 变化全是噪声。','Trampa Prisa: saltar línea base → delta ruido.','Piège "Vitesse" : sauter la base → delta bruit.','「जल्दबाज़ी」 ट्रैप: बेसलाइन स्किप → सब डेल्टा आवाज़।','فخ الاستعجال: تخطي خط الأساس → جميع الفروق مجرد ضوضاء.'),
      SIX('Multiple variables → you never know which caused delta.','多变量同时改 → 永远不知道谁在做功。','Múltiples variables → nunca sabes cuál causó delta.','Variables multiples → jamais on sait lequel cause le delta.','मल्टीपल वेरिएबल्स → कौन डेल्टा दे रहा है पता ही नहीं.','متغيرات متعددة في نفس الوقت → لن تعرفوا سبب الفرق أبداً.'),
      SIX('Outlier cherry-picking: quoting best-case instead of P50.','摘樱桃：只报最好情况不说中位。','Cerezas: citar mejor caso en vez de P50.','Cerisiers : citer le meilleur cas au lieu de P50.','चेरी-पिकिंग: बेस्ट केस बताना P50 नहीं.','قطف الكرز: الاستشهاد بأفضل حالة بدلاً من المئة الخمسين.'),
      SIX('Survivorship bias: drop-outs not counted.','幸存者偏差：中途退出的数据被丢了。','Sesgo supervivencia: abandonos no contados.','Biais survivant : abandons exclus.','सर्वाइवरशिप बायस: ड्रॉप-आउट्स को गिना नहीं.','انحياز الناجين: تجاهل بيانات المتسربين من التجربة.'),
      SIX('Confirmation bias: stopping when delta matches belief.','证实偏差：结果符合预期就立刻停。','Sesgo confirmación: parar cuando delta coincide con creencia.','Biais de confirmation : s\'arrêter quand delta valide.','कन्फर्मेशन बायस: डेल्टा मैच होते ही रुक जाना.','انحياز التأكيد: التوقف فور مطابقة النتيجة للاعتقاد المسبق.'),
      SIX('Measurement drift: tool / scale not calibrated weekly.','测量漂移：工具/秤每周都不校准。','Deriva medición: herramienta / báscula sin calibrar.','Dérive de mesure : outil / balance non calibrés.','मेजरमेंट ड्रिफ्ट: उपकरण हर हफ्ते कैलिब्रेट नहीं.','انحراف القياس: عدم معايرة الأدوات و الموازين أسبوعياً.'),
      SIX('Fractional attribution math error (100%+ delta explained).','分数归因数学错，合计贡献超 100%。','Error atribución fraccional: suma > 100%.','Erreur attribution fractionnelle : somme > 100 %.','फ्रैक्शनल अट्रिब्यूशन मैथ गलत, जोड़ १००% से ज्यादा.','خطأ نسبة المساهمة: مجموع المساهمات يتجاوز ١٠٠٪.'),
      SIX('Small-N: statistically meaningless (<30 runs).','样本量过小：<30 次的结论不可信。','Muestra pequeña: sin sentido estadístico (<30).','Petit N : statistiquement non significatif (<30).','छोटा N: <30 रन, स्टैटिस्टिकली बेकार.','عينة صغيرة جداً: أقل من ٣٠ تجربة بلا دلالة إحصائية.'),
      SIX('No rollback plan: bad change cannot be undone in <10 min.','无回滚计划：坏改动 10 分钟内撤销不掉。','Sin plan rollback: cambio malo no se deshace en 10min.','Sans rollback : mauvais changement irréversible en <10min.','रोलबैक प्लान नहीं: बुरा बदलाव १० मिनट में नहीं उलट सकते.','بدون خطة تراجع: لا يمكن التراجع عن التغيير السيء في أقل من ١٠ دقائق.'),
    ]}),
    BLOCK('h2',{text:SIX('4. Ready-to-Use Template + The Korelyy Tool That Saves 82% of Time','4. 开箱即用模板 + 帮您节省 82% 时间的 Korelyy 工具','4. Plantilla Lista + Herramienta Korelyy que Ahorra 82% Tiempo','4. Modèle Prêt à Utiliser + Outil Korelyy Gagne 82% du Temps','४. रेडी-टू-यूज़ टेम्पलेट + Korelyy टूल जो ८२% टाइम बचाता है','٤. قالب جاهز للاستخدام + أداة Korelyy التي توفر ٨٢٪ من الوقت')}),
    BLOCK('callout',{kind:'info', text:SIX(
      'Time-saver: use Korelyy tool-station to run this 9-step audit on one dashboard — results auto-sync with your shareable page.',
      '省时技巧：直接在 Korelyy 工具站 9 步审计操作统一在一个面板，结果自动同步到你那页可分享文档。',
      'Ahorro de tiempo: ejecuta auditoría 9 pasos en Korelyy en un panel — resultados auto-sincronizados.',
      'Gain de temps : audit 9 étapes en 1 dashboard Korelyy — synchro auto vers page partagée.',
      'टाइम बचाने का ट्रिक: Korelyy टूल स्टेशन में ९-स्टेप ऑडिट एक डैशबोर्ड में रन करें — रिजल्ट ऑटो-सिंक।',
      'توفير للوقت: شغلوا التدقيق التسع خطوات على منصة Korelyy في لوحة واحدة و ستزامن النتائج تلقائياً مع صفحتكم.'
    )}),
    BLOCK('p',{text:SIX(
      'Appendices below contain a 1-page printable PDF checklist, a CSV template, 3 example audit trails, and 5 common test plans for 9 popular verticals. Click the next section tool to spin this up for your team in 3 minutes.',
      '附录包含可打印 1 页 PDF 清单、CSV 模板、3 份审计轨迹示例、以及 9 大行业 5 份测试计划。点击下面跳转按钮 3 分钟给你的团队搭好。',
      'Anexos: checklist PDF imprimible 1p, plantilla CSV, 3 auditorías ejemplo y 5 planes en 9 verticales populares.',
      'Annexes : checklist PDF 1p, CSV modèle, 3 audits exemples + 5 plans dans 9 secteurs.',
      'अपेंडिक्स में 1 पेज प्रिंट करने योग्य PDF चेकलिस्ट, CSV टेम्पलेट, ३ ऑडिट ट्रेल उदाहरण, 9 वर्टिकल के 5 टेस्ट प्लान हैं। नेक्स्ट सेक्शन का टूल क्लिक करें आपकी टीम के लिए ३ मिनट में सेटअप हो जाएगा।',
      'تتضمن الملحقات قائمة فحص PDF قابلة للطباعة صفحة واحدة و قالب CSV و ٣ مسارات تدقيق مثالية و ٥ خطط اختبار لـ ٩ قطاعات شائعة. اضغطوا على زر القسم التالي لبدء العمل خلال ٣ دقائق.'
    )}),
    BLOCK('cta',{
      link:'/'+(catSlug === 'css'||catSlug==='jsperf'||catSlug==='api'||catSlug==='docker'||catSlug==='nextssr'?'developer-tools':
                catSlug==='seoonpage'||catSlug==='socialmatrix'||catSlug==='korelyyops'||catSlug==='indiemonetize'||catSlug==='compliance'?'business-and-work':
                catSlug==='pdf'||catSlug==='image'||catSlug==='aioffice'||catSlug==='timemanagement'||catSlug==='project'?'productivity':'health-tools'),
      text:SIX(
        '🧰 Open Korelyy '+catName.en+' Toolkit — 100+ Best-in-class apps audited in your favorite language →',
        '🧰 打开 Korelyy '+catName.zh+' 工具箱 — 精选 100+ 头部应用，支持您熟悉的 6 种语言 →',
        '🧰 Abra el Kit '+catName.es+' de Korelyy — +100 apps top auditadas en su idioma →',
        '🧰 Ouvre la Boîte à Outils '+catName.fr+' Korelyy — 100+ apps auditées dans votre langue →',
        '🧰 Korelyy '+catName.hi+' टूलकिट खोलें — १००+ बेस्ट-इन-क्लास ऐप्स आपकी पसंदीदा भाषा में ऑडिटेड →',
        '🧰 افتحوا مجموعة أدوات '+catName.ar+' على منصة Korelyy - أكثر من ١٠٠ تطبيق رائد تم فحصها بلغتكم المفضلة ←',
      )
    })
  ];
  // 根据主题索引加一个 H3 自定义段，保证各篇不重复
  const extra = [
    BLOCK('h3', {text:SIX(
      '3.'+(topicIndex+1)+' Priority '+((topicIndex%4)+1)+' — What '+ (topicIndex%2===0?'You Can Automate Today':'Must Be Manual') ,
      '3.'+(topicIndex+1)+' 优先级 '+(topicIndex%4+1)+' — '+(topicIndex%2===0?'今天就能自动化的部分':'必须保留人工的环节'),
      '3.'+(topicIndex+1)+' Prioridad '+(topicIndex%4+1)+' - Lo '+(topicIndex%2===0?'Automatizable Hoy':'Requiere Manual'),
      '3.'+(topicIndex+1)+' Priorité '+(topicIndex%4+1)+' — Ce qui '+(topicIndex%2===0?"s'automatise Aujourd'hui":"doit être Manuel"),
      '3.'+(topicIndex+1)+' प्रायोरिटी '+(topicIndex%4+1)+' — '+(topicIndex%2===0?'आज ही ऑटोमेट किया जा सकेगा':'मैनुअल रहना ही चाहिए'),
      '3.'+(topicIndex+1)+' الأولوية '+(topicIndex%4+1)+' — ما '+((topicIndex%2===0)?'يمكن أتممتَه اليوم':'يجب أن يبقى يدوياً')
    )}),
    BLOCK('ul',{items:[
      SIX('Data collection, dashboards, and 95th percentile reporting — automatable via Korelyy.', '数据收集/看板/95 分位报告——可在 Korelyy 自动化。','Recolección, dashboards y reporte percentil 95 — automático en Korelyy.','Collecte + tableaux de bord + rapports P95 → automatisables Korelyy.','डेटा कलेक्शन, डैशबोर्ड्स, ९५ पर्सेंटाइल रिपोर्टिंग — Korelyy में ऑटोमेट.','جمع البيانات و لوحات المعلومات و تقارير المئة ٩٥: تُؤتمت على Korelyy.'),
      SIX('Spot-check audits, rollback approvals and ethics sign-offs — human gate.','抽检审计/回滚审批/伦理签字——人类关口。','Auditorías spot, aprobaciones rollback y ética — puerta humana.','Vérifications aléatoires, rollbacks et éthique → porte humaine.','स्पॉट-चेक ऑडिट, रोलबैक अप्रूवल, एथिक्स साइन-ऑफ़ — मानव गेट.','المراجعات العشوائية و الموافقات على التراجع و الموافقات الأخلاقية: بوابة بشرية.'),
    ]}),
  ];
  return [...common.slice(0,8), extra[0], extra[1], ...common.slice(8)];
}

// ===== 开始构建 100 篇 =====
const postsCode = [];
const iso = (n) => { const d=new Date('2026-07-06T00:00:00.000Z'); d.setUTCDate(d.getUTCDate()-n); return d.toISOString(); };
const E = (s='') => (s??'').replace(/\\/g,'\\\\').replace(/`/g,'\\`').replace(/\${/g,'\\${');
const STR = (o, depth=0) => {
  if (o===null||o===undefined) return 'null';
  if (typeof o === 'string') return JSON.stringify(o);
  if (typeof o === 'number' || typeof o === 'boolean') return String(o);
  if (Array.isArray(o)){
    if (!o.length) return '[]';
    const inner = o.map(v => STR(v, depth+1)).join(', ');
    return depth<2 ? '[\n' + inner.split(', ').map(x=>'    '.repeat(Math.min(depth+1,3))+x.trim()).join(',\n') + ',\n' + '    '.repeat(depth) + ']'
                    : `[${inner}]`;
  }
  const keys = Object.keys(o);
  if (!keys.length) return '{}';
  const pairs = keys.map(k => {
    const needQuote = !/^[a-zA-Z_$][\w$]*$/.test(k);
    const key = needQuote ? JSON.stringify(k) : k;
    return `${key}: ${STR(o[k], depth+1)}`;
  });
  return '{ ' + pairs.join(', ') + ' }';
};
const OBJ = (o, indent=4) => JSON.stringify(o, null, 2).split('\n').map(l=>' '.repeat(indent)+l).join('\n');

function addPost(cat, topic, daysAgo, idx){
  const publishedAt = iso(daysAgo);
  const readingMinutes = {en:8+idx%5,zh:9+idx%5,es:9+idx%5,fr:9+idx%5,hi:10+idx%5,ar:9+idx%5};
  const keywordsEN = [cat.name.en, topic.t.en?.split(' ').slice(0,4).join(' '), '2026 guide', 'tutorial'];
  const keywordsZH = [cat.name.zh, topic.t.zh||cat.name.zh, '2026 指南', '教程'];
  const keywordsES = [cat.name.es, topic.t.es||cat.name.es, 'guía 2026', 'tutorial'];
  const keywordsFR = [cat.name.fr, topic.t.fr||cat.name.fr, 'guide 2026', 'tutoriel'];
  const keywordsHI = [cat.name.hi, topic.t.hi||cat.name.hi, '2026 गाइड', 'ट्यूटोरियल'];
  const keywordsAR = [cat.name.ar, topic.t.ar||cat.name.ar, 'دليل ٢٠٢٦', 'شرح'];
  const keywords = { en:keywordsEN, zh:keywordsZH, es:keywordsES, fr:keywordsFR, hi:keywordsHI, ar:keywordsAR };
  const title = topic.t;
  const desc = topic.d || {en:title.en+'. — Full 9-step playbook, pitfalls, and Korelyy toolkit link.',zh:title.zh+' — 完整 9 步操作手册、常见陷阱与 Korelyy 工具箱跳转。',
    es:title.es+'. — Guía 9 pasos completa, errores y enlace a Korelyy.',fr:title.fr+'. — Guide 9 étapes + pièges + lien vers outils Korelyy.',
    hi:title.hi+'. — ९ स्टेप पूर्ण प्लेबुक, पिटफॉल्स और Korelyy टूलकिट लिंक।',ar:title.ar+'. — دليل كامل بـ ٩ خطوات و مخاطر شائعة و رابط إلى حزمة أدوات Korelyy.'};
  const tIdx = idx % 4;
  const content = buildContent(cat.name, topic, tIdx, cat.id);
  const cover = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(cat.name.en+' '+topic.t.en+' editorial illustration flat vector 2026 trending')}&image_size=landscape_16_9`;
  const code = [
    '  {',
    `    slug: ${JSON.stringify(topic.s)},`,
    `    coverImage: ${JSON.stringify(cover)},`,
    `    author: ${JSON.stringify('Korelyy Editorial')},`,
    `    publishedAt: ${JSON.stringify(publishedAt)},`,
    `    tags: ${OBJ(cat.tags).trim()},`,
    `    relatedToolSlugs: ${JSON.stringify(cat.related.slice(0,5))},`,
    `    readingMinutes: ${OBJ(readingMinutes).trim()},`,
    `    title: ${OBJ(title).trim()},`,
    `    description: ${OBJ(desc).trim()},`,
    `    keywords: ${OBJ(keywords).trim()},`,
    `    content: [`,
    ...content.map((b, bi) => {
      if (b.type==='h2'||b.type==='h3'||b.type==='p'||b.type==='callout')
        return `      { type: ${JSON.stringify(b.type)}, ${b.kind?`kind: ${JSON.stringify(b.kind)}, `:''}text: ${OBJ(b.text).trim()} },`;
      if (b.type==='ul'||b.type==='ol')
        return `      { type: ${JSON.stringify(b.type)}, items: ${OBJ(b.items).trim()} },`;
      if (b.type==='cta')
        return `      { type: 'cta', link: ${JSON.stringify(b.link)}, text: ${OBJ(b.text).trim()} },`;
      return `      ${STR(b)},`;
    }),
    `    ],`,
    `  },`,
  ].join('\n');
  postsCode.push(code);
}

// === 前 5 类 20 篇 (20/100) ===
for (let c=0; c<5; c++){
  const cat = CATS[c];
  for (let i=0;i<4;i++){
    const idx = c*4+i;
    const topic = { s: cat.topics[i].s, t:cat.topics[i].t, d: cat.topics[i].d };
    addPost(cat, topic, cat.daysSeed[i], idx);
  }
}
// === 后 20 类 80 篇 ===
for (let c=0; c<REST_CATS.length; c++){
  const cat = REST_CATS[c];
  const seeds = restTitles[cat.id] || [];
  for (let i=0;i<4;i++){
    const idx = 20 + c*4+i;
    const s = seeds[i] || {};
    const slug = `${cat.id}-tutorial-${i+1}-2026`;
    const t = { en: s.i1 || `${cat.name.en} Tutorial ${i+1} 2026`, zh: s.t1 || `${cat.name.zh}教程 ${i+1} 2026`, es: s.f1 || `${cat.name.es} Tutorial ${i+1}`, fr: s.f2 || `${cat.name.fr} Tutoriel ${i+1}`, hi: s.h1 || `${cat.name.hi} ट्यूटोरियल ${i+1}`, ar: s.a1 || `${cat.name.ar} شرح ${i+1}` };
    const d_en = `${t.en} — Comprehensive 9-step audit playbook with 18 pitfalls checklist, Korelyy toolkit shortcut, and ready-to-use templates for teams.`;
    const d_zh = `${t.zh} — 9 步完整审计操作手册、18 条常见陷阱避坑清单、Korelyy 工具箱快捷入口，以及团队即用模板。`;
    const d_es = `${t.es} — Guía 9 pasos completa, 18 trampas comunes, atajo a Korelyy y plantillas listas para equipos.`;
    const d_fr = `${t.fr} — Playbook 9 étapes complet, 18 pièges, raccourci Korelyy + modèles prêts pour équipes.`;
    const d_hi = `${t.hi} — ९ स्टेप पूर्ण ऑडिट प्लेबुक, १८ पिटफॉल्स चेकलिस्ट, Korelyy टूलकिट शॉर्टकट और टीम टेम्पलेट्स।`;
    const d_ar = `${t.ar} — دليل تدقيق كامل بـ ٩ خطوات و ١٨ مخاطر شائعة و اختصار إلى حزمة Korelyy مع قوالب جاهزة للفرق.`;
    const topic = { s: slug, t: t, d: {en:d_en, zh:d_zh, es:d_es, fr:d_fr, hi:d_hi, ar:d_ar} };
    const daysAgo = 41 + c*7 + i*2;
    addPost(cat, topic, daysAgo, idx);
  }
}

// === 插入到 data/blog.ts BLOG_POSTS 数组末尾（倒数第 2 个 ]; 之前）===
const endMarker = /\n\s*\];\s*\n\s*\/\/\s*-{3,}\s*Queries\s*-{3,}\s*/;
const match = SRC.match(endMarker);
if (!match){ console.error('❌ End marker not found'); process.exit(1); }
const insertPos = match.index;
const prefix = SRC.slice(0, insertPos);
const suffix = SRC.slice(insertPos);
const NEW_CODE = postsCode.join('\n') + '\n';
fs.writeFileSync(BLOG_TS, prefix + (prefix.endsWith('\n')?'':'\n') + NEW_CODE + suffix, 'utf8');
console.log(`✅ 成功追加 ${postsCode.length} 篇博客到 data/blog.ts`);
