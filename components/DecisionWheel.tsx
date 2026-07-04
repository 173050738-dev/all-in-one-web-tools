'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Shuffle,
  Plus,
  Trash2,
  RotateCcw,
  Settings,
  Sparkles,
  Edit3,
  X,
} from 'lucide-react';

interface DecisionWheelProps {
  locale?: string;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1',
];

export default function DecisionWheel({ locale = 'zh' }: DecisionWheelProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'action.add': '添加',
      'action.save': '保存',
      'action.cancel': '取消',
      'action.delete': '删除',
      'action.reset': '重新开始',
      'action.spin': '开始转盘',
      'action.spinning': '转动中...',
      'title': '决定转盘',
      'subtitle': '纠结症患者的福音！让转盘帮你做决定，午餐吃什么、周末去哪玩，转一下就知道',
      'section.presets': '快捷模板',
      'section.options': '选项设置',
      'section.features': '功能特点',
      'placeholder.addOption': '输入新选项...',
      'button.go': '开始',
      'label.result': '结果是',
      'tip': '💡 提示：点击中间的"开始"或下方按钮转动转盘。支持 2-12 个选项，可以添加、编辑或删除。',
      'maxReached': '最多12个选项',
      'minRequired': '至少需要2个选项',
      'f1': '自定义选项（2-12个）',
      'f2': '内置常用快捷模板',
      'f3': '流畅的转盘动画',
      'f4': '完全随机公平公正',
      'f5': '支持编辑和删除',
      'f6': '完全免费无广告',
      'preset.lunch': '中午吃什么',
      'preset.weekend': '周末去哪玩',
      'preset.tonight': '今晚玩什么',
      'default.1': '火锅',
      'default.2': '烧烤',
      'default.3': '日料',
      'default.4': '快餐',
      'default.5': '面条',
      'default.6': '饺子',
      'default.7': '麻辣烫',
      'default.8': '沙拉',
      'preset1.1': '看电影',
      'preset1.2': '逛商场',
      'preset1.3': '公园散步',
      'preset1.4': '在家躺平',
      'preset1.5': '打游戏',
      'preset1.6': '读书',
      'preset1.7': '运动',
      'preset1.8': '喝咖啡',
      'preset2.1': '王者荣耀',
      'preset2.2': '原神',
      'preset2.3': '英雄联盟',
      'preset2.4': '吃鸡',
      'preset2.5': '塞尔达',
      'preset2.6': '看剧',
      'preset2.7': '刷抖音',
      'preset2.8': '睡觉',
    },
    en: {
      'action.add': 'Add',
      'action.save': 'Save',
      'action.cancel': 'Cancel',
      'action.delete': 'Delete',
      'action.reset': 'Reset',
      'action.spin': 'Spin',
      'action.spinning': 'Spinning...',
      'title': 'Decision Wheel',
      'subtitle': 'Can\'t decide? Spin the wheel and let fate decide!',
      'section.presets': 'Quick Presets',
      'section.options': 'Options',
      'section.features': 'Features',
      'placeholder.addOption': 'Enter new option...',
      'button.go': 'GO',
      'label.result': 'Result',
      'tip': '💡 Tip: Click "GO" in the center or the button below to spin. Supports 2-12 options.',
      'maxReached': 'Max 12 options',
      'minRequired': 'Need at least 2 options',
      'f1': 'Custom options (2-12 items)',
      'f2': 'Built-in quick presets',
      'f3': 'Smooth spin animation',
      'f4': 'Truly random & fair',
      'f5': 'Edit & delete options',
      'f6': '100% free, no ads',
      'preset.lunch': 'What to eat for lunch',
      'preset.weekend': 'Weekend activities',
      'preset.tonight': 'What to do tonight',
      'default.1': 'Hotpot',
      'default.2': 'BBQ',
      'default.3': 'Sushi',
      'default.4': 'Fast Food',
      'default.5': 'Noodles',
      'default.6': 'Dumplings',
      'default.7': 'Spicy Hotpot',
      'default.8': 'Salad',
      'preset1.1': 'Movies',
      'preset1.2': 'Shopping',
      'preset1.3': 'Park Walk',
      'preset1.4': 'Stay Home',
      'preset1.5': 'Gaming',
      'preset1.6': 'Reading',
      'preset1.7': 'Exercise',
      'preset1.8': 'Coffee',
      'preset2.1': 'Honor of Kings',
      'preset2.2': 'Genshin',
      'preset2.3': 'League of Legends',
      'preset2.4': 'PUBG',
      'preset2.5': 'Zelda',
      'preset2.6': 'TV Shows',
      'preset2.7': 'TikTok',
      'preset2.8': 'Sleep',
    },
    hi: {
      'action.add': 'जोड़ें',
      'action.save': 'सहेजें',
      'action.cancel': 'रद्द करें',
      'action.delete': 'हटाएं',
      'action.reset': 'रीसेट',
      'action.spin': 'स्पिन करें',
      'action.spinning': 'घूम रहा है...',
      'title': 'निर्णय व्हील',
      'subtitle': 'निर्णय नहीं ले पा रहे? व्हील घुमाएं और भाग्य को तय करने दें!',
      'section.presets': 'क्विक प्रीसेट',
      'section.options': 'विकल्प',
      'section.features': 'विशेषताएं',
      'placeholder.addOption': 'नया विकल्प दर्ज करें...',
      'button.go': 'शुरू',
      'label.result': 'परिणाम',
      'tip': '💡 सुझाव: घुमाने के लिए केंद्र में "शुरू" या नीचे बटन दबाएं। 2-12 विकल्प समर्थित।',
      'maxReached': 'अधिकतम 12 विकल्प',
      'minRequired': 'कम से कम 2 विकल्प चाहिए',
      'f1': 'कस्टम विकल्प (2-12 आइटम)',
      'f2': 'अंतर्निहित क्विक प्रीसेट',
      'f3': 'स्मूथ स्पिन एनीमेशन',
      'f4': 'वास्तव में यादृच्छिक और निष्पक्ष',
      'f5': 'संपादित और विकल्प हटाएं',
      'f6': '100% मुफ्त, कोई विज्ञापन नहीं',
      'preset.lunch': 'दोपहर का खाना क्या खाएं',
      'preset.weekend': 'सप्ताहांत कहां जाएं',
      'preset.tonight': 'आज रात क्या करें',
      'default.1': 'हॉटपॉट',
      'default.2': 'बीबीक्यू',
      'default.3': 'सुशी',
      'default.4': 'फास्ट फूड',
      'default.5': 'नूडल्स',
      'default.6': 'डमलिंग',
      'default.7': 'मसालेदार स्टू',
      'default.8': 'सलाद',
      'preset1.1': 'फिल्में',
      'preset1.2': 'शॉपिंग',
      'preset1.3': 'पार्क सैर',
      'preset1.4': 'घर पर आराम',
      'preset1.5': 'गेमिंग',
      'preset1.6': 'पढ़ना',
      'preset1.7': 'व्यायाम',
      'preset1.8': 'कॉफी',
      'preset2.1': 'गेम 1',
      'preset2.2': 'गेम 2',
      'preset2.3': 'गेम 3',
      'preset2.4': 'गेम 4',
      'preset2.5': 'गेम 5',
      'preset2.6': 'टीवी शो',
      'preset2.7': 'सोशल मीडिया',
      'preset2.8': 'सोना',
    },
    fr: {
      'action.add': 'Ajouter',
      'action.save': 'Enregistrer',
      'action.cancel': 'Annuler',
      'action.delete': 'Supprimer',
      'action.reset': 'Réinitialiser',
      'action.spin': 'Tourner',
      'action.spinning': 'En rotation...',
      'title': 'Roue de la Décision',
      'subtitle': 'Indécis? Tournez la roue et laissez le destin décider!',
      'section.presets': 'Modèles Rapides',
      'section.options': 'Options',
      'section.features': 'Fonctionnalités',
      'placeholder.addOption': 'Entrez une option...',
      'button.go': 'GO',
      'label.result': 'Résultat',
      'tip': '💡 Astuce: Cliquez sur "GO" au centre ou le bouton ci-dessous. 2-12 options supportées.',
      'maxReached': 'Max 12 options',
      'minRequired': 'Besoin d\'au moins 2 options',
      'f1': 'Options personnalisées (2-12 éléments)',
      'f2': 'Modèles rapides intégrés',
      'f3': 'Animation de rotation fluide',
      'f4': 'Vraiment aléatoire et équitable',
      'f5': 'Modifier et supprimer des options',
      'f6': '100% gratuit, sans pub',
      'preset.lunch': 'Que manger le midi',
      'preset.weekend': 'Sortie du week-end',
      'preset.tonight': 'Que faire ce soir',
      'default.1': 'Fondue',
      'default.2': 'BBQ',
      'default.3': 'Sushi',
      'default.4': 'Fast Food',
      'default.5': 'Pâtes',
      'default.6': 'Raviolis',
      'default.7': 'Ragoût Épicé',
      'default.8': 'Salade',
      'preset1.1': 'Cinéma',
      'preset1.2': 'Shopping',
      'preset1.3': 'Promenade au Parc',
      'preset1.4': 'Rester chez soi',
      'preset1.5': 'Jeux vidéo',
      'preset1.6': 'Lecture',
      'preset1.7': 'Sport',
      'preset1.8': 'Café',
      'preset2.1': 'Jeu 1',
      'preset2.2': 'Jeu 2',
      'preset2.3': 'Jeu 3',
      'preset2.4': 'Jeu 4',
      'preset2.5': 'Jeu 5',
      'preset2.6': 'Séries TV',
      'preset2.7': 'Réseaux Sociaux',
      'preset2.8': 'Dormir',
    },
    es: {
      'action.add': 'Añadir',
      'action.save': 'Guardar',
      'action.cancel': 'Cancelar',
      'action.delete': 'Eliminar',
      'action.reset': 'Reiniciar',
      'action.spin': 'Girar',
      'action.spinning': 'Girando...',
      'title': 'Rueda de la Decisión',
      'subtitle': '¿No puedes decidir? ¡Gira la rueda y deja que el destino decida!',
      'section.presets': 'Plantillas Rápidas',
      'section.options': 'Opciones',
      'section.features': 'Características',
      'placeholder.addOption': 'Introduce una opción...',
      'button.go': 'GO',
      'label.result': 'Resultado',
      'tip': '💡 Consejo: Haz clic en "GO" en el centro o el botón de abajo. Soporta 2-12 opciones.',
      'maxReached': 'Máx. 12 opciones',
      'minRequired': 'Necesitas al menos 2 opciones',
      'f1': 'Opciones personalizadas (2-12 elementos)',
      'f2': 'Plantillas rápidas integradas',
      'f3': 'Animación de giro fluida',
      'f4': 'Verdaderamente aleatorio y justo',
      'f5': 'Editar y eliminar opciones',
      'f6': '100% gratis, sin anuncios',
      'preset.lunch': 'Qué almorzar',
      'preset.weekend': 'A dónde ir el fin de semana',
      'preset.tonight': 'Qué hacer esta noche',
      'default.1': 'Hotpot',
      'default.2': 'BBQ',
      'default.3': 'Sushi',
      'default.4': 'Comida Rápida',
      'default.5': 'Fideos',
      'default.6': 'Empanadillas',
      'default.7': 'Estofado Picante',
      'default.8': 'Ensalada',
      'preset1.1': 'Cine',
      'preset1.2': 'Compras',
      'preset1.3': 'Paseo por el Parque',
      'preset1.4': 'Quedarse en casa',
      'preset1.5': 'Videojuegos',
      'preset1.6': 'Lectura',
      'preset1.7': 'Deporte',
      'preset1.8': 'Café',
      'preset2.1': 'Juego 1',
      'preset2.2': 'Juego 2',
      'preset2.3': 'Juego 3',
      'preset2.4': 'Juego 4',
      'preset2.5': 'Juego 5',
      'preset2.6': 'Series de TV',
      'preset2.7': 'Redes Sociales',
      'preset2.8': 'Dormir',
    },
    ar: {
      'action.add': 'إضافة',
      'action.save': 'حفظ',
      'action.cancel': 'إلغاء',
      'action.delete': 'حذف',
      'action.reset': 'إعادة تعيين',
      'action.spin': 'دوران',
      'action.spinning': 'يدور...',
      'title': 'عجلة القرار',
      'subtitle': 'لا تستطيع القرار؟ أدر العجلة ودع القدر يقرر!',
      'section.presets': 'قوالب سريعة',
      'section.options': 'الخيارات',
      'section.features': 'الميزات',
      'placeholder.addOption': 'أدخل خياراً جديداً...',
      'button.go': 'ابدأ',
      'label.result': 'النتيجة',
      'tip': '💡 نصيحة: انقر على "ابدأ" في المنتصف أو الزر أدناه. يدعم 2-12 خياراً.',
      'maxReached': 'الحد الأقصى 12 خياراً',
      'minRequired': 'تحتاج إلى خيارين على الأقل',
      'f1': 'خيارات مخصصة (2-12 عنصر)',
      'f2': 'قوالب سريعة مدمجة',
      'f3': 'رسوم متحركة سلسة',
      'f4': 'عشوائي وعادل حقاً',
      'f5': 'تعديل وحذف الخيارات',
      'f6': 'مجاني 100%، بدون إعلانات',
      'preset.lunch': 'ماذا نأكل للغداء',
      'preset.weekend': 'إلى أين نذهب في عطلة نهاية الأسبوع',
      'preset.tonight': 'ماذا نفعل الليلة',
      'default.1': 'هوت بوت',
      'default.2': 'شواء',
      'default.3': 'سوشي',
      'default.4': 'وجبات سريعة',
      'default.5': 'نودلز',
      'default.6': 'زلابية',
      'default.7': 'يخنة حارة',
      'default.8': 'سلطة',
      'preset1.1': 'أفلام',
      'preset1.2': 'تسوق',
      'preset1.3': 'نزهة في الحديقة',
      'preset1.4': 'البقاء في المنزل',
      'preset1.5': 'ألعاب',
      'preset1.6': 'قراءة',
      'preset1.7': 'رياضة',
      'preset1.8': 'قهوة',
      'preset2.1': 'لعبة 1',
      'preset2.2': 'لعبة 2',
      'preset2.3': 'لعبة 3',
      'preset2.4': 'لعبة 4',
      'preset2.5': 'لعبة 5',
      'preset2.6': 'مسلسلات',
      'preset2.7': 'وسائل التواصل',
      'preset2.8': 'نوم',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.zh[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    };
  };
  const t = getT(locale);

  const getPresetOptions = () => ([
    { name: t('preset.lunch'), options: [t('default.1'), t('default.2'), t('default.3'), t('default.4'), t('default.5'), t('default.6'), t('default.7'), t('default.8')] },
    { name: t('preset.weekend'), options: [t('preset1.1'), t('preset1.2'), t('preset1.3'), t('preset1.4'), t('preset1.5'), t('preset1.6'), t('preset1.7'), t('preset1.8')] },
    { name: t('preset.tonight'), options: [t('preset2.1'), t('preset2.2'), t('preset2.3'), t('preset2.4'), t('preset2.5'), t('preset2.6'), t('preset2.7'), t('preset2.8')] },
  ]);

  const getDefaultOptions = () => [
    t('default.1'), t('default.2'), t('default.3'), t('default.4'),
    t('default.5'), t('default.6'), t('default.7'), t('default.8'),
  ];

  const [loaded, setLoaded] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (!loaded) {
      setOptions(getDefaultOptions());
      setLoaded(true);
    }
  }, [loaded, locale]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(canvas.width, canvas.height);
    const center = size / 2;
    const radius = size / 2 - 10;
    const segmentAngle = (2 * Math.PI) / options.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    options.forEach((option, i) => {
      const startAngle = i * segmentAngle - Math.PI / 2;
      const endAngle = startAngle + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(12, radius / 8)}px sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 2;
      const displayText = option.length > 6 ? option.slice(0, 6) + '...' : option;
      ctx.fillText(displayText, radius - 15, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, 35, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t('button.go'), center, center);
  }, [options, t]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const spin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setResult(null);

    const segmentAngle = 360 / options.length;
    const randomIndex = Math.floor(Math.random() * options.length);
    const targetAngle = randomIndex * segmentAngle + segmentAngle / 2;
    const spins = 5 + Math.random() * 3;
    const finalRotation = rotation + spins * 360 + (360 - targetAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(options[randomIndex]);
    }, 4000);
  };

  const addOption = () => {
    if (!newOption.trim() || options.length >= 12) return;
    setOptions([...options, newOption.trim()]);
    setNewOption('');
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(options[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null || !editValue.trim()) return;
    const newOptions = [...options];
    newOptions[editingIndex] = editValue.trim();
    setOptions(newOptions);
    setEditingIndex(null);
    setEditValue('');
  };

  const loadPreset = (preset: { name: string; options: string[] }) => {
    setOptions([...preset.options]);
    setResult(null);
    setRotation(0);
  };

  const reset = () => {
    setResult(null);
    setRotation(0);
  };

  const presetOptions = getPresetOptions();

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'>
                <Shuffle className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div className='flex justify-center'>
                <div className='relative'>
                  <div className='absolute -top-2 left-1/2 -translate-x-1/2 z-10'>
                    <div className='w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg' />
                  </div>
                  <div
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      width={320}
                      height={320}
                      onClick={spin}
                      className='w-64 h-64 sm:w-80 sm:h-80 cursor-pointer select-none'
                    />
                  </div>
                </div>
              </div>

              {result && !isSpinning && (
                <div className='text-center animate-bounce'>
                  <div className='inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl shadow-lg'>
                    <p className='text-sm opacity-80 mb-1'>{t('label.result')} 🎉</p>
                    <p className='text-lg sm:text-xl font-bold'>{result}</p>
                  </div>
                </div>
              )}

              <div className='flex justify-center gap-3'>
                <button
                  onClick={spin}
                  disabled={isSpinning || options.length < 2}
                  className='flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                >
                  <Sparkles className='h-5 w-5' />
                  {isSpinning ? t('action.spinning') : t('action.spin')}
                </button>
                <button
                  onClick={reset}
                  disabled={isSpinning}
                  className='flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                  title={t('action.reset')}
                >
                  <RotateCcw className='h-5 w-5' />
                </button>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                    <Sparkles className='w-4 h-4 text-orange-500' />
                    {t('section.presets')}
                  </h3>
                  <div className='space-y-2'>
                    {presetOptions.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => loadPreset(preset)}
                        className='w-full text-left px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-sm'
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2'>
                    <Settings className='w-4 h-4 text-orange-500' />
                    {t('section.options')} ({options.length}/12)
                  </h3>
                  <div className='flex gap-2 mb-3'>
                    <input
                      type='text'
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addOption()}
                      placeholder={t('placeholder.addOption')}
                      maxLength={10}
                      className='flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                    />
                    <button
                      onClick={addOption}
                      disabled={!newOption.trim() || options.length >= 12}
                      className='px-3 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      title={t('action.add')}
                    >
                      <Plus className='w-4 h-4' />
                    </button>
                  </div>
                  <div className='space-y-1.5 max-h-48 overflow-y-auto'>
                    {options.map((option, i) => (
                      <div
                        key={i}
                        className='flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 group'
                      >
                        <div
                          className='w-3 h-3 rounded-full flex-shrink-0'
                          style={{ backgroundColor: colors[i % colors.length] }}
                        />
                        {editingIndex === i ? (
                          <>
                            <input
                              type='text'
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') setEditingIndex(null);
                              }}
                              autoFocus
                              maxLength={10}
                              className='flex-1 px-2 py-1 rounded border border-orange-300 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500'
                            />
                            <button
                              onClick={saveEdit}
                              className='p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded'
                              title={t('action.save')}
                            >
                              <span className='text-xs font-medium'>✓</span>
                            </button>
                            <button
                              onClick={() => setEditingIndex(null)}
                              className='p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
                              title={t('action.cancel')}
                            >
                              <X className='w-3 h-3' />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className='flex-1 text-sm text-gray-700 dark:text-gray-300 truncate'>{option}</span>
                            <button
                              onClick={() => startEdit(i)}
                              className='p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity'
                              title={t('action.save')}
                            >
                              <Edit3 className='w-3.5 h-3.5' />
                            </button>
                            <button
                              onClick={() => removeOption(i)}
                              disabled={options.length <= 2}
                              className='p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed'
                              title={t('action.delete')}
                            >
                              <Trash2 className='w-3.5 h-3.5' />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-orange-700 dark:text-orange-300'>
                  {t('tip')}
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('section.features')}</h3>
            <ul className='space-y-3'>
              {[t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6')].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0' />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
