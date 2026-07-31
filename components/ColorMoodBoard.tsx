'use client';

import { useState, useRef, useMemo } from 'react';
import { Palette, RefreshCw, Copy, Check, Download, Heart, Sparkles, Eye } from 'lucide-react';

interface ColorMoodBoardProps {
  locale?: string;
}

interface Mood {
  id: string;
  zh: string;
  en: string;
  colors: string[];
}

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '色彩情绪板',
    subtitle: '根据你的心情生成专属色彩搭配',
    moodLabel: '选择你的心情',
    refresh: '换一组',
    copyPalette: '复制调色板',
    copied: '已复制',
    copyColor: '复制',
    exportPng: '导出 PNG',
    paletteName: '情绪色彩',
    hexLabel: 'HEX',
    clickCopy: '点击色块复制',
    moods: ['浪漫', '平静', '活力', '神秘', '快乐', '悲伤', '焦虑', '自信', '温柔', '热情', '冷静', '自由', '希望', '怀旧', '优雅', '青春', '自然', '奢华', '梦幻', '力量', '创意', '思念', '感恩', '孤独', '胜利'],
  },
  en: {
    title: 'Color Mood Board',
    subtitle: 'Generate color palettes based on your mood',
    moodLabel: 'Select your mood',
    refresh: 'Refresh',
    copyPalette: 'Copy Palette',
    copied: 'Copied',
    copyColor: 'Copy',
    exportPng: 'Export PNG',
    paletteName: 'Mood Palette',
    hexLabel: 'HEX',
    clickCopy: 'Click a color to copy',
    moods: ['Romantic', 'Calm', 'Energetic', 'Mysterious', 'Happy', 'Sad', 'Anxious', 'Confident', 'Gentle', 'Passionate', 'Cool', 'Free', 'Hopeful', 'Nostalgic', 'Elegant', 'Youthful', 'Natural', 'Luxurious', 'Dreamy', 'Powerful', 'Creative', 'Longing', 'Grateful', 'Lonely', 'Victorious'],
  },
  es: {
    title: 'Tablero de Colores por Estado de Ánimo',
    subtitle: 'Genera paletas de color según tu estado de ánimo',
    moodLabel: 'Selecciona tu ánimo',
    refresh: 'Actualizar',
    copyPalette: 'Copiar Paleta',
    copied: 'Copiado',
    copyColor: 'Copiar',
    exportPng: 'Exportar PNG',
    paletteName: 'Paleta de Ánimo',
    hexLabel: 'HEX',
    clickCopy: 'Haz clic en un color para copiar',
    moods: ['Romántico', 'Calmado', 'Enérgico', 'Misterioso', 'Feliz', 'Triste', 'Ansioso', 'Confiado', 'Gentil', 'Apasionado', 'Frío', 'Libre', 'Esperanzador', 'Nostálgico', 'Elegante', 'Joven', 'Natural', 'Lujoso', 'Onírico', 'Poderoso', 'Creativo', 'Añorante', 'Agradecido', 'Solo', 'Victorioso'],
  },
  fr: {
    title: 'Tableau de Bord des Couleurs par Humeur',
    subtitle: 'Générez des palettes de couleurs selon votre humeur',
    moodLabel: 'Sélectionnez votre humeur',
    refresh: 'Rafraîchir',
    copyPalette: 'Copier la Palette',
    copied: 'Copié',
    copyColor: 'Copier',
    exportPng: 'Exporter PNG',
    paletteName: 'Palette d\'Humeur',
    hexLabel: 'HEX',
    clickCopy: 'Cliquez sur une couleur pour copier',
    moods: ['Romantique', 'Calme', 'Énergique', 'Mystérieux', 'Heureux', 'Triste', 'Anxieux', 'Confiant', 'Doux', 'Passionné', 'Cool', 'Libre', 'Espérant', 'Nostalgique', 'Élégant', 'Jeunesse', 'Naturel', 'Luxueux', 'Rêveur', 'Puissant', 'Créatif', 'Langoureux', 'Reconnaissant', 'Seul', 'Victorieux'],
  },
  hi: {
    title: 'रंग मूड बोर्ड',
    subtitle: 'अपने मूड के अनुसार रंग पैलेट बनाएं',
    moodLabel: 'अपना मूड चुनें',
    refresh: 'रीफ्रेश',
    copyPalette: 'पैलेट कॉपी करें',
    copied: 'कॉपी हुआ',
    copyColor: 'कॉपी',
    exportPng: 'PNG निर्यात',
    paletteName: 'मूड पैलेट',
    hexLabel: 'HEX',
    clickCopy: 'कॉपी करने के लिए रंग पर क्लिक करें',
    moods: ['रोमांटिक', 'शांत', 'ऊर्जावान', 'रहस्यमय', 'खुश', 'उदास', 'चिंतित', 'आत्मविश्वासी', 'कोमल', 'जुनूनी', 'ठंडा', 'स्वतंत्र', 'आशावादी', 'पुरानी यादें', 'शानदार', 'युवा', 'प्राकृतिक', 'शाही', 'सपना', 'शक्तिशाली', 'रचनात्मक', 'याद', 'आभारी', 'अकेला', 'विजयी'],
  },
  ar: {
    title: 'لوحة ألوان المزاج',
    subtitle: 'أنشئ لوحات ألوان حسب مزاجك',
    moodLabel: 'اختر مزاجك',
    refresh: 'تحديث',
    copyPalette: 'نسخ اللوحة',
    copied: 'تم النسخ',
    copyColor: 'نسخ',
    exportPng: 'تصدير PNG',
    paletteName: 'لوحة المزاج',
    hexLabel: 'HEX',
    clickCopy: 'انقر على اللون للنسخ',
    moods: ['رومانسي', 'هادئ', 'نشط', 'غامض', 'سعيد', 'حزين', 'قلق', 'واثق', 'لطيف', 'شغوف', 'بارد', 'حر', 'متفائل', 'حنيني', 'أنيق', 'شبابي', 'طبيعي', 'فاخر', 'حالم', 'قوي', 'مبدع', 'شوق', 'ممتن', 'وحيد', 'منتصر'],
  },
};

const MOOD_PALETTES: Record<string, string[][]> = {
  romantic: [
    ['#FFB3C6', '#FF8FAB', '#FB6F92', '#E63946', '#D62828'],
    ['#FAD4D8', '#F8AD9D', '#F4978E', '#E5989B', '#B5838D'],
    ['#FFC6FF', '#FFB3C6', '#FF8FAB', '#FF6F91', '#C9184A'],
    ['#F7D6E0', '#F2B5C4', '#E6A4B4', '#D48A9C', '#8E5A6B'],
  ],
  calm: [
    ['#CDE7F0', '#A8DADC', '#81C3D7', '#6D9DC5', '#4A6FA5'],
    ['#D8E2DC', '#C5D5C5', '#A8C5A8', '#8CB38C', '#6B9B6B'],
    ['#E0F4FF', '#BEE9F5', '#9CDBF2', '#7CCBED', '#5CB8E3'],
    ['#E8F0FE', '#C5DBF5', '#A2C6EC', '#7FB0E3', '#5C9ADA'],
  ],
  energetic: [
    ['#FFD60A', '#FF9500', '#FF6D0A', '#FF3B30', '#D00000'],
    ['#FFE74C', '#FFC93C', '#F5A623', '#E8852E', '#DC6B2F'],
    ['#FAFF00', '#EEFF00', '#E5FF00', '#D9FF00', '#CCFF33'],
    ['#FF6B6B', '#FFA500', '#FFD93D', '#6BCB77', '#4D96FF'],
  ],
  mysterious: [
    ['#2D1B4E', '#3D2B56', '#4A3B6B', '#5C5470', '#6C7B8B'],
    ['#1A1A2E', '#16213E', '#0F3460', '#533483', '#E94560'],
    ['#0D0221', '#240046', '#3C096C', '#5A189A', '#7B2CBF'],
    ['#10002B', '#240046', '#3C096C', '#5A189A', '#9D4EDD'],
  ],
  happy: [
    ['#FFE66D', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B'],
    ['#FDE68A', '#FBBF24', '#F59E0B', '#F97316', '#EF4444'],
    ['#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B'],
    ['#FFF59D', '#FFEB3B', '#FFC107', '#FFB300', '#FF8F00'],
  ],
  sad: [
    ['#2C3E50', '#34495E', '#5D6D7E', '#85929E', '#AAB7B8'],
    ['#34495E', '#5D6D7E', '#85929E', '#B0BEC5', '#CFD8DC'],
    ['#1B2631', '#2C3E50', '#34495E', '#566573', '#AAB7B8'],
    ['#3D405B', '#818FB4', '#A9B4C2', '#CBCBD5', '#D6D6D6'],
  ],
  anxious: [
    ['#8B0000', '#B22222', '#CD5C5C', '#F08080', '#FFB6C1'],
    ['#800000', '#A52A2A', '#C85A5A', '#DEB887', '#F5DEB3'],
    ['#6B0F1A', '#8C1C28', '#AD3333', '#BF5555', '#D98880'],
    ['#2D0F1A', '#5C1F2D', '#8A303F', '#B95162', '#E88B9D'],
  ],
  confident: [
    ['#1B3A4B', '#2C5F7F', '#3D8BBF', '#5BA3D9', '#87C5E2'],
    ['#0B3D91', '#1F4FBF', '#2D6FD6', '#4A8FE7', '#7CB3F0'],
    ['#1A237E', '#283593', '#3949AB', '#3F51B5', '#5C6BC0'],
    ['#0A2342', '#13315C', '#1F4E79', '#2E86AB', '#A23B72'],
  ],
  gentle: [
    ['#FCE1E4', '#F7D6E0', '#F2B5C4', '#E8A0BF', '#D48AAE'],
    ['#FFF0F5', '#FFE4E1', '#F8D7DA', '#E8B4BC', '#C9858F'],
    ['#FBD5E0', '#F8B5C7', '#F49BB5', '#EE7AA1', '#B8577A'],
    ['#FFF8F0', '#FFEBE6', '#FADBD8', '#F5B7B1', '#E6B0AA'],
  ],
  passionate: [
    ['#8B0000', '#B22222', '#DC143C', '#FF1493', '#FF69B4'],
    ['#4A0000', '#720000', '#A40000', '#C8102E', '#E63946'],
    ['#641E16', '#922B21', '#C0392B', '#E74C3C', '#EC7063'],
    ['#2B0000', '#580000', '#850000', '#B30000', '#E60000'],
  ],
  cool: [
    ['#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF'],
    ['#023E8A', '#0077B6', '#0096C7', '#00B4D8', '#CAF0F8'],
    ['#03045E', '#023E8A', '#0077B6', '#00B4D8', '#90E0EF'],
    ['#003566', '#001D3D', '#000814', '#0077B6', '#FFC300'],
  ],
  free: [
    ['#FFE5B4', '#FFDAB9', '#FFD4A3', '#EDC9AF', '#C9B8A0'],
    ['#87CEEB', '#98D8C8', '#FDCB6E', '#FFEAA7', '#DFE6E9'],
    ['#A8D8EA', '#FFD3B6', '#FFAAA5', '#FF8B94', '#C7CEEA'],
    ['#B5EAD7', '#C7CEEA', '#FFDAC1', '#F1F1F2', '#E2C2FF'],
  ],
  hopeful: [
    ['#A8E6CF', '#DCEDC8', '#FFD3B6', '#FFAAA5', '#FF8B94'],
    ['#B8E0D2', '#D6EADF', '#EAC1C6', '#F5C6C5', '#F4ACB7'],
    ['#C3F7E3', '#9DE0AD', '#7BC47F', '#59AE4F', '#3D8B37'],
    ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A'],
  ],
  nostalgic: [
    ['#D4A574', '#C9996B', '#B8860B', '#A0522D', '#8B4513'],
    ['#DEB887', '#D2B48C', '#BC8F8F', '#F5F5DC', '#FAEBD7'],
    ['#CD853F', '#D2691E', '#8B4513', '#654321', '#3E2723'],
    ['#F5DEB3', '#DEB887', '#D2B48C', '#BC8F8F', '#A0522D'],
  ],
  elegant: [
    ['#1A1A2E', '#16213E', '#0F3460', '#533483', '#E94560'],
    ['#000000', '#1A1A1A', '#2D2D2D', '#F5F5F5', '#C0C0C0'],
    ['#2C1810', '#4A2C2A', '#6B4226', '#8B6F47', '#D4AF37'],
    ['#1B1B1B', '#333333', '#B8860B', '#DAA520', '#FFD700'],
  ],
  youthful: [
    ['#FFB3D9', '#B5EAD7', '#C7CEEA', '#FFDAC1', '#F1F1F2'],
    ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7'],
    ['#FFC8DD', '#FFAFCC', '#BDE0FE', '#A2D2FF', '#CDB4DB'],
    ['#FAD5A5', '#F7C59F', '#EFEFD0', '#FDE2E4', '#E2ECE9'],
  ],
  natural: [
    ['#2D5016', '#3A7D44', '#7CB342', '#AED581', '#E6F5C6'],
    ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D'],
    ['#386641', '#6A994E', '#A7C957', '#F2E8CF', '#BC4749'],
    ['#4A7C59', '#68B684', '#95D5B2', '#D8F3DC', '#FCF8E8'],
  ],
  luxurious: [
    ['#1A1A1A', '#2D2D2D', '#B8860B', '#DAA520', '#FFD700'],
    ['#0F0F0F', '#1F1F1F', '#333333', '#C9A962', '#E5C07B'],
    ['#2C1810', '#4A2C2A', '#6B4226', '#D4AF37', '#F5E6A8'],
    ['#000000', '#232323', '#6B4423', '#C69C6D', '#F5E6C4'],
  ],
  dreamy: [
    ['#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3'],
    ['#F6D5F7', '#DBB1CD', '#BE95C4', '#9F86C0', '#5E548E'],
    ['#F4EEE1', '#E6B2C6', '#C68EAD', '#9D81BA', '#FFB5A7'],
    ['#E5D4ED', '#C9A9E8', '#A084DC', '#6F5FCD', '#2B2D42'],
  ],
  powerful: [
    ['#1A1A1A', '#2D2D2D', '#4A4A4A', '#D7263D', '#F46036'],
    ['#0D0D0D', '#1A1A1A', '#8B0000', '#DC143C', '#FFD700'],
    ['#000000', '#191970', '#4B0082', '#800080', '#FF0000'],
    ['#2B2B2B', '#4A4A4A', '#6B6B6B', '#FF4500', '#FFA500'],
  ],
  creative: [
    ['#FF6B6B', '#FFE66D', '#6BCB77', '#4D96FF', '#C77DFF'],
    ['#F72585', '#B5179E', '#7209B7', '#480CA8', '#3A0CA3'],
    ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'],
    ['#FF477E', '#FF8C42', '#FFD166', '#06D6A0', '#118AB2'],
  ],
  longing: [
    ['#2C5F7F', '#4A8FB0', '#7CB5D1', '#B1D8F0', '#E0F0FF'],
    ['#1B263B', '#415A77', '#778DA9', '#E0E1DD', '#F5F5F5'],
    ['#3A0CA3', '#7209B7', '#B5179E', '#F72585', '#FFB5A7'],
    ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'],
  ],
  grateful: [
    ['#FFE4B5', '#FFDAB9', '#FFD700', '#FFA500', '#FF8C00'],
    ['#FFF8DC', '#FAEBD7', '#F5DEB3', '#DEB887', '#CD853F'],
    ['#FFF5E1', '#FFE8B0', '#FFD68A', '#FFC466', '#E6A817'],
    ['#FFFBF0', '#FFF0D9', '#FFE0B2', '#FFCC80', '#FFB74D'],
  ],
  lonely: [
    ['#3A3A3A', '#5C5C5C', '#7F7F7F', '#A0A0A0', '#C0C0C0'],
    ['#2C2C2C', '#4A4A4A', '#6C6C6C', '#8E8E8E', '#B0B0B0'],
    ['#1A1A2E', '#3A3A5C', '#5A5A7A', '#7A7A98', '#9A9AB6'],
    ['#2F2F2F', '#4B4B4B', '#6A6A6A', '#898989', '#A8A8A8'],
  ],
  victorious: [
    ['#1B998B', '#2ECC71', '#F1C40F', '#E67E22', '#E74C3C'],
    ['#0A7EA4', '#01967D', '#E6DF4A', '#F39C12', '#E74C3C'],
    ['#006400', '#228B22', '#32CD32', '#90EE90', '#98FB98'],
    ['#14213D', '#FCA311', '#E5E5E5', '#FFFFFF', '#C1121F'],
  ],
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#ffffff';
  const lum = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return lum > 0.5 ? '#1a1a2e' : '#ffffff';
}

export default function ColorMoodBoard({ locale = 'zh' }: ColorMoodBoardProps) {
  const t = i18n[locale] || i18n.zh;
  const isRTL = locale === 'ar';
  const moodNames = t.moods;

  const [selectedMood, setSelectedMood] = useState(moodNames[0]);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedPalette, setCopiedPalette] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const moodIdToKey: Record<string, string> = {
    '浪漫': 'romantic', 'Romantic': 'romantic', 'Romántico': 'romantic', 'Romantique': 'romantic', 'रोमांटिक': 'romantic', 'رومانسي': 'romantic',
    '平静': 'calm', 'Calm': 'calm', 'Calmado': 'calm', 'Calme': 'calm', 'शांत': 'calm', 'هادئ': 'calm',
    '活力': 'energetic', 'Energetic': 'energetic', 'Enérgico': 'energetic', 'Énergique': 'energetic', 'ऊर्जावान': 'energetic', 'نشط': 'energetic',
    '神秘': 'mysterious', 'Mysterious': 'mysterious', 'Misterioso': 'mysterious', 'Mystérieux': 'mysterious', 'रहस्यमय': 'mysterious', 'غامض': 'mysterious',
    '快乐': 'happy', 'Happy': 'happy', 'Feliz': 'happy', 'Heureux': 'happy', 'खुश': 'happy', 'سعيد': 'happy',
    '悲伤': 'sad', 'Sad': 'sad', 'Triste': 'sad', 'Triste': 'sad', 'उदास': 'sad', 'حزين': 'sad',
    '焦虑': 'anxious', 'Anxious': 'anxious', 'Ansioso': 'anxious', 'Anxieux': 'anxious', 'चिंतित': 'anxious', 'قلق': 'anxious',
    '自信': 'confident', 'Confident': 'confident', 'Confiado': 'confident', 'Confiant': 'confident', 'आत्मविश्वासी': 'confident', 'واثق': 'confident',
    '温柔': 'gentle', 'Gentle': 'gentle', 'Gentil': 'gentle', 'Doux': 'gentle', 'कोमल': 'gentle', 'لطيف': 'gentle',
    '热情': 'passionate', 'Passionate': 'passionate', 'Apasionado': 'passionate', 'Passionné': 'passionate', 'जुनूनी': 'passionate', 'شغوف': 'passionate',
    '冷静': 'cool', 'Cool': 'cool', 'Cool': 'cool', 'Cool': 'cool', 'ठंडा': 'cool', 'بارد': 'cool',
    '自由': 'free', 'Free': 'free', 'Libre': 'free', 'Libre': 'free', 'स्वतंत्र': 'free', 'حر': 'free',
    '希望': 'hopeful', 'Hopeful': 'hopeful', 'Esperanzador': 'hopeful', 'Espérant': 'hopeful', 'आशावादी': 'hopeful', 'متفائل': 'hopeful',
    '怀旧': 'nostalgic', 'Nostalgic': 'nostalgic', 'Nostálgico': 'nostalgic', 'Nostalgique': 'nostalgic', 'पुरानी यादें': 'nostalgic', 'حنيني': 'nostalgic',
    '优雅': 'elegant', 'Elegant': 'elegant', 'Elegante': 'elegant', 'Élégant': 'elegant', 'शानदार': 'elegant', 'أنيق': 'elegant',
    '青春': 'youthful', 'Youthful': 'youthful', 'Joven': 'youthful', 'Jeunesse': 'youthful', 'युवा': 'youthful', 'شبابي': 'youthful',
    '自然': 'natural', 'Natural': 'natural', 'Natural': 'natural', 'Naturel': 'natural', 'प्राकृतिक': 'natural', 'طبيعي': 'natural',
    '奢华': 'luxurious', 'Luxurious': 'luxurious', 'Lujoso': 'luxurious', 'Luxueux': 'luxurious', 'शाही': 'luxurious', 'فاخر': 'luxurious',
    '梦幻': 'dreamy', 'Dreamy': 'dreamy', 'Onírico': 'dreamy', 'Rêveur': 'dreamy', 'सपना': 'dreamy', 'حالم': 'dreamy',
    '力量': 'powerful', 'Powerful': 'powerful', 'Poderoso': 'powerful', 'Puissant': 'powerful', 'शक्तिशाली': 'powerful', 'قوي': 'powerful',
    '创意': 'creative', 'Creative': 'creative', 'Creativo': 'creative', 'Créatif': 'creative', 'रचनात्मक': 'creative', 'مبدع': 'creative',
    '思念': 'longing', 'Longing': 'longing', 'Añorante': 'longing', 'Langoureux': 'longing', 'याद': 'longing', 'شوق': 'longing',
    '感恩': 'grateful', 'Grateful': 'grateful', 'Agradecido': 'grateful', 'Reconnaissant': 'grateful', 'आभारी': 'grateful', 'ممتن': 'grateful',
    '孤独': 'lonely', 'Lonely': 'lonely', 'Solo': 'lonely', 'Seul': 'lonely', 'अकेला': 'lonely', 'وحيد': 'lonely',
    '胜利': 'victorious', 'Victorious': 'victorious', 'Victorioso': 'victorious', 'Victorieux': 'victorious', 'विजयी': 'victorious', 'منتصر': 'victorious',
  };

  const currentPalette = useMemo(() => {
    const key = moodIdToKey[selectedMood] || 'romantic';
    const palettes = MOOD_PALETTES[key] || MOOD_PALETTES.romantic;
    return palettes[paletteIdx % palettes.length];
  }, [selectedMood, paletteIdx]);

  const handleCopyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 1200);
    } catch {}
  };

  const handleCopyPalette = async () => {
    const text = currentPalette.join(', ');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPalette(true);
      setTimeout(() => setCopiedPalette(false), 1500);
    } catch {}
  };

  const handleRefresh = () => {
    setPaletteIdx(paletteIdx + 1);
  };

  const handleExportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 600;
    const H = 400;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${t.paletteName} - ${selectedMood}`, W / 2, 40);

    const colorW = (W - 80) / currentPalette.length;
    currentPalette.forEach((color, i) => {
      const x = 40 + i * colorW;
      const y = 70;
      const h = 180;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, colorW - 10, h);

      ctx.fillStyle = getContrastColor(color);
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(color, x + (colorW - 10) / 2, y + h / 2 + 5);
    });

    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Korelyy', W / 2, H - 15);

    const link = document.createElement('a');
    link.download = `color-mood-${selectedMood}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center justify-center gap-2">
          <Palette className="text-violet-500" size={28} />
          {t.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t.moodLabel}</label>
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
          {moodNames.map((mood, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedMood(mood);
                setPaletteIdx(0);
              }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition min-h-[40px] ${
                selectedMood === mood
                  ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-4 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Sparkles size={16} className="text-violet-500" />
            {t.paletteName} · {selectedMood}
          </h3>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm"
          >
            <RefreshCw size={14} />
            {t.refresh}
          </button>
        </div>
        <div className="grid grid-cols-5">
          {currentPalette.map((color, i) => (
            <button
              key={`${color}-${i}`}
              onClick={() => handleCopyColor(color)}
              className="relative group h-32 transition-transform hover:scale-105 focus:outline-none"
              style={{ backgroundColor: color }}
              title={color}
            >
              <span
                className="absolute bottom-2 left-0 right-0 text-center text-xs font-mono font-medium opacity-80 group-hover:opacity-100"
                style={{ color: getContrastColor(color) }}
              >
                {copiedColor === color ? `✓ ${t.copied}` : color}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-4">{t.clickCopy}</p>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleCopyPalette}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition min-h-[44px] font-medium"
        >
          {copiedPalette ? <Check size={18} /> : <Copy size={18} />}
          {copiedPalette ? t.copied : t.copyPalette}
        </button>
        <button
          onClick={handleExportPng}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition min-h-[44px] font-medium shadow-md"
        >
          <Download size={18} />
          {t.exportPng}
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}