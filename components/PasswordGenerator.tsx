'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  History,
  Download,
  Star,
  StarOff,
  Trash2,
} from 'lucide-react';

const STORAGE_KEY_SETTINGS = 'korelyy-password-generator-settings';
const STORAGE_KEY_HISTORY = 'korelyy-password-generator-history';

interface PasswordGeneratorProps {
  locale?: string;
}

interface HistoryItem {
    id: string;
    password: string;
    length: number;
    timestamp: Date;
    favorite: boolean;
    options: {
      uppercase: boolean;
      lowercase: boolean;
      numbers: boolean;
      symbols: boolean;
    };
  }

  export default function PasswordGenerator({ locale = 'zh' }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [exportFormat, setExportFormat] = useState<'plain' | 'csv' | 'json'>('plain');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        if (settings.length !== undefined) setLength(settings.length);
        if (settings.includeUppercase !== undefined) setIncludeUppercase(settings.includeUppercase);
        if (settings.includeLowercase !== undefined) setIncludeLowercase(settings.includeLowercase);
        if (settings.includeNumbers !== undefined) setIncludeNumbers(settings.includeNumbers);
        if (settings.includeSymbols !== undefined) setIncludeSymbols(settings.includeSymbols);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (stored) {
      try {
        const historyData = JSON.parse(stored);
        setHistory(historyData.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        })));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const settings = { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  const translations: Record<string, Record<string, string>> = {
    zh: {
      'action.generate': '重新生成',
      'action.copy': '复制密码',
      'action.copied': '已复制',
      'action.hide': '隐藏',
      'action.show': '显示',
      'title': '密码生成器',
      'subtitle': '一键生成安全随机密码，本地生成，永不外泄',
      'generatedPassword': '生成的密码',
      'passwordLength': '密码长度',
      'characters': '字符类型',
      'uppercase': '大写字母 (A-Z)',
      'lowercase': '小写字母 (a-z)',
      'numbers': '数字 (0-9)',
      'symbols': '特殊符号 (!@#...)',
      'strength': '密码强度',
      'strength.weak': '弱',
      'strength.medium': '中',
      'strength.strong': '强',
      'tip': '💡 提示：建议使用16位以上包含大小写字母、数字和符号的密码，并定期更换。所有密码均在本地生成，不会上传到任何服务器。',
      'selectAtLeastOne': '请至少选择一种字符类型',
      'features': '功能特点',
      'f1': '使用加密安全随机数生成',
      'f2': '可自定义长度和字符类型',
      'f3': '实时密码强度评估',
      'f4': '一键复制到剪贴板',
      'f5': '本地生成，100%隐私安全',
      'f6': '完全免费，无使用限制',
      'history': '历史记录',
      'historyEmpty': '暂无历史记录',
      'export': '导出密码',
      'exportFormat': '导出格式',
      'plainText': '纯文本',
      'csv': 'CSV',
      'json': 'JSON',
      'favorite': '收藏',
      'unfavorite': '取消收藏',
      'delete': '删除',
      'timestamp': '时间',
      'length': '长度',
      'clearHistory': '清空历史',
      'confirmClear': '确定清空所有历史记录？',
    },
    en: {
      'action.generate': 'Regenerate',
      'action.copy': 'Copy',
      'action.copied': 'Copied',
      'action.hide': 'Hide',
      'action.show': 'Show',
      'title': 'Password Generator',
      'subtitle': 'Generate secure random passwords locally. Never leaves your device.',
      'generatedPassword': 'Generated Password',
      'passwordLength': 'Password Length',
      'characters': 'Character Types',
      'uppercase': 'Uppercase (A-Z)',
      'lowercase': 'Lowercase (a-z)',
      'numbers': 'Numbers (0-9)',
      'symbols': 'Symbols (!@#...)',
      'strength': 'Strength',
      'strength.weak': 'Weak',
      'strength.medium': 'Medium',
      'strength.strong': 'Strong',
      'tip': '💡 Tip: Use 16+ characters with a mix of letters, numbers, and symbols. All passwords are generated locally and never sent to any server.',
      'selectAtLeastOne': 'Please select at least one character type',
      'features': 'Features',
      'f1': 'Cryptographically secure random generation',
      'f2': 'Customizable length & character types',
      'f3': 'Real-time strength assessment',
      'f4': 'One-click copy to clipboard',
      'f5': 'Local generation, 100% private',
      'f6': 'Completely free, no limits',
      'history': 'History',
      'historyEmpty': 'No history yet',
      'export': 'Export',
      'exportFormat': 'Export format',
      'plainText': 'Plain text',
      'csv': 'CSV',
      'json': 'JSON',
      'favorite': 'Favorite',
      'unfavorite': 'Unfavorite',
      'delete': 'Delete',
      'timestamp': 'Time',
      'length': 'Length',
      'clearHistory': 'Clear history',
      'confirmClear': 'Clear all history?',
    },
    hi: {
      'action.generate': 'फिर से बनाएं',
      'action.copy': 'कॉपी करें',
      'action.copied': 'कॉपी हो गया',
      'action.hide': 'छिपाएं',
      'action.show': 'दिखाएं',
      'title': 'पासवर्ड जनरेटर',
      'subtitle': 'सुरक्षित यादृच्छिक पासवर्ड स्थानीय रूप से बनाएं। कभी भी आपके डिवाइस से बाहर नहीं जाता।',
      'generatedPassword': 'जनरेट किया गया पासवर्ड',
      'passwordLength': 'पासवर्ड लंबाई',
      'characters': 'अक्षर प्रकार',
      'uppercase': 'बड़े अक्षर (A-Z)',
      'lowercase': 'छोटे अक्षर (a-z)',
      'numbers': 'संख्याएं (0-9)',
      'symbols': 'विशेष प्रतीक (!@#...)',
      'strength': 'मजबूती',
      'strength.weak': 'कमजोर',
      'strength.medium': 'मध्यम',
      'strength.strong': 'मजबूत',
      'tip': '💡 सुझाव: 16+ अक्षरों का प्रयोग करें जिसमें अक्षर, संख्याएं और प्रतीक हों। सभी पासवर्ड स्थानीय रूप से बनाए जाते हैं।',
      'selectAtLeastOne': 'कम से कम एक अक्षर प्रकार चुनें',
      'features': 'विशेषताएं',
      'f1': 'क्रिप्टोग्राफिक सुरक्षित यादृच्छिक जनन',
      'f2': 'अनुकूलनीय लंबाई और अक्षर प्रकार',
      'f3': 'रीयल-टाइम मजबूती मूल्यांकन',
      'f4': 'एक क्लिक में कॉपी',
      'f5': 'स्थानीय जनन, 100% निजी',
      'f6': 'पूरी तरह से मुफ्त, कोई सीमा नहीं',
      'history': 'इतिहास',
      'historyEmpty': 'अभी तक कोई इतिहास नहीं',
      'export': 'निर्यात करें',
      'exportFormat': 'निर्यात प्रारूप',
      'plainText': 'सादा पाठ',
      'csv': 'CSV',
      'json': 'JSON',
      'favorite': 'पसंदीदा',
      'unfavorite': 'पसंदीदा हटाएं',
      'delete': 'हटाएं',
      'timestamp': 'समय',
      'length': 'लंबाई',
      'clearHistory': 'इतिहास साफ़ करें',
      'confirmClear': 'सभी इतिहास साफ़ करें?',
    },
    fr: {
      'action.generate': 'Régénérer',
      'action.copy': 'Copier',
      'action.copied': 'Copié',
      'action.hide': 'Masquer',
      'action.show': 'Afficher',
      'title': 'Générateur de Mots de Passe',
      'subtitle': 'Générez des mots de passe aléatoires sécurisés localement. Ne quitte jamais votre appareil.',
      'generatedPassword': 'Mot de passe généré',
      'passwordLength': 'Longueur du mot de passe',
      'characters': 'Types de caractères',
      'uppercase': 'Majuscules (A-Z)',
      'lowercase': 'Minuscules (a-z)',
      'numbers': 'Chiffres (0-9)',
      'symbols': 'Symboles (!@#...)',
      'strength': 'Force',
      'strength.weak': 'Faible',
      'strength.medium': 'Moyenne',
      'strength.strong': 'Forte',
      'tip': '💡 Astuce: Utilisez 16+ caractères avec un mélange de lettres, chiffres et symboles. Tous les mots de passe sont générés localement.',
      'selectAtLeastOne': 'Sélectionnez au moins un type de caractère',
      'features': 'Fonctionnalités',
      'f1': 'Génération aléatoire cryptographiquement sécurisée',
      'f2': 'Longueur et types personnalisables',
      'f3': 'Évaluation de la force en temps réel',
      'f4': 'Copie en un clic',
      'f5': 'Génération locale, 100% privée',
      'f6': 'Entièrement gratuit, sans limites',
      'history': 'Historique',
      'historyEmpty': 'Aucun historique',
      'export': 'Exporter',
      'exportFormat': 'Format d\'export',
      'plainText': 'Texte brut',
      'csv': 'CSV',
      'json': 'JSON',
      'favorite': 'Favori',
      'unfavorite': 'Retirer des favoris',
      'delete': 'Supprimer',
      'timestamp': 'Heure',
      'length': 'Longueur',
      'clearHistory': 'Vider l\'historique',
      'confirmClear': 'Vider tout l\'historique ?',
    },
    es: {
      'action.generate': 'Regenerar',
      'action.copy': 'Copiar',
      'action.copied': 'Copiado',
      'action.hide': 'Ocultar',
      'action.show': 'Mostrar',
      'title': 'Generador de Contraseñas',
      'subtitle': 'Genera contraseñas aleatorias seguras localmente. Nunca sale de tu dispositivo.',
      'generatedPassword': 'Contraseña generada',
      'passwordLength': 'Longitud de la contraseña',
      'characters': 'Tipos de caracteres',
      'uppercase': 'Mayúsculas (A-Z)',
      'lowercase': 'Minúsculas (a-z)',
      'numbers': 'Números (0-9)',
      'symbols': 'Símbolos (!@#...)',
      'strength': 'Fortaleza',
      'strength.weak': 'Débil',
      'strength.medium': 'Media',
      'strength.strong': 'Fuerte',
      'tip': '💡 Consejo: Usa 16+ caracteres con mezcla de letras, números y símbolos. Todas las contraseñas se generan localmente.',
      'selectAtLeastOne': 'Selecciona al menos un tipo de carácter',
      'features': 'Características',
      'f1': 'Generación aleatoria criptográficamente segura',
      'f2': 'Longitud y tipos personalizables',
      'f3': 'Evaluación de fortaleza en tiempo real',
      'f4': 'Copiar con un clic',
      'f5': 'Generación local, 100% privada',
      'f6': 'Completamente gratis, sin límites',
      'history': 'Historial',
      'historyEmpty': 'Sin historial',
      'export': 'Exportar',
      'exportFormat': 'Formato de exportación',
      'plainText': 'Texto plano',
      'csv': 'CSV',
      'json': 'JSON',
      'favorite': 'Favorito',
      'unfavorite': 'Quitar de favoritos',
      'delete': 'Eliminar',
      'timestamp': 'Hora',
      'length': 'Longitud',
      'clearHistory': 'Limpiar historial',
      'confirmClear': '¿Limpiar todo el historial?',
    },
    ar: {
      'action.generate': 'إعادة إنشاء',
      'action.copy': 'نسخ',
      'action.copied': 'تم النسخ',
      'action.hide': 'إخفاء',
      'action.show': 'إظهار',
      'title': 'مولد كلمات المرور',
      'subtitle': 'أنشئ كلمات مرور عشوائية آمنة محلياً. لا يغادر جهازك أبداً.',
      'generatedPassword': 'كلمة المرور المولدة',
      'passwordLength': 'طول كلمة المرور',
      'characters': 'أنواع الأحرف',
      'uppercase': 'حروف كبيرة (A-Z)',
      'lowercase': 'حروف صغيرة (a-z)',
      'numbers': 'أرقام (0-9)',
      'symbols': 'رموز خاصة (!@#...)',
      'strength': 'القوة',
      'strength.weak': 'ضعيفة',
      'strength.medium': 'متوسطة',
      'strength.strong': 'قوية',
      'tip': '💡 نصيحة: استخدم 16+ حرفاً مع مزيج من الحروف والأرقام والرموز. جميع كلمات المرور تُنشأ محلياً.',
      'selectAtLeastOne': 'اختر نوعاً واحداً على الأقل من الأحرف',
      'features': 'الميزات',
      'f1': 'توليد عشوائي آمن تشفيرياً',
      'f2': 'طول وأنواع قابلة للتخصيص',
      'f3': 'تقييم القوة في الوقت الفعلي',
      'f4': 'نسخ بنقرة واحدة',
      'f5': 'توليد محلي، خاص 100%',
      'f6': 'مجاني تماماً، بدون حدود',
      'history': 'التاريخ',
      'historyEmpty': 'لا يوجد تاريخ',
      'export': 'تصدير',
      'exportFormat': 'تنسيق التصدير',
      'plainText': 'نص عادي',
      'csv': 'CSV',
      'json': 'JSON',
      'favorite': 'مفضل',
      'unfavorite': 'إزالة من المفضلة',
      'delete': 'حذف',
      'timestamp': 'الوقت',
      'length': 'الطول',
      'clearHistory': 'مسح التاريخ',
      'confirmClear': 'هل ترغب في مسح جميع السجلات؟',
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

  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      setPassword('');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
    setCopied(false);

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      password: result,
      length,
      timestamp: new Date(),
      favorite: false,
      options: {
        uppercase: includeUppercase,
        lowercase: includeLowercase,
        numbers: includeNumbers,
        symbols: includeSymbols,
      },
    };
    setHistory(prev => [newItem, ...prev].slice(0, 20));
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async (pwd?: string) => {
    const textToCopy = pwd || password;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm(t('confirmClear'))) {
      setHistory([]);
    }
  };

  const exportHistory = () => {
    let content = '';
    let filename = '';
    
    if (exportFormat === 'json') {
      content = JSON.stringify(history.map(item => ({
        password: item.password,
        length: item.length,
        timestamp: item.timestamp.toISOString(),
        favorite: item.favorite,
        options: item.options
      })), null, 2);
      filename = `passwords-${new Date().toISOString().split('T')[0]}.json`;
    } else if (exportFormat === 'csv') {
      content = [
        '密码,长度,时间,收藏',
        ...history.map(item => 
          `"${item.password}",${item.length},"${item.timestamp.toLocaleString()}","${item.favorite ? '是' : '否'}"`
        )
      ].join('\n');
      filename = `passwords-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      content = history.map(item => {
        const timeStr = item.timestamp.toLocaleString();
        const favStr = item.favorite ? '★ ' : '';
        return `${favStr}[${timeStr}] ${item.password} (${item.length}位)`;
      }).join('\n');
      filename = `passwords-${new Date().toISOString().split('T')[0]}.txt`;
    }
    
    const blob = new Blob([content], { type: exportFormat === 'json' ? 'application/json' : exportFormat === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (includeUppercase && includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score <= 2) return { level: 'weak', label: t('strength.weak'), color: 'text-red-500', bg: 'bg-red-500', bgLight: 'bg-red-50 dark:bg-red-900/20' };
    if (score <= 4) return { level: 'medium', label: t('strength.medium'), color: 'text-yellow-500', bg: 'bg-yellow-500', bgLight: 'bg-yellow-50 dark:bg-yellow-900/20' };
    return { level: 'strong', label: t('strength.strong'), color: 'text-green-500', bg: 'bg-green-500', bgLight: 'bg-green-50 dark:bg-green-900/20' };
  };

  const strength = getStrength();
  const StrengthIcon = strength.level === 'weak' ? ShieldAlert : strength.level === 'medium' ? Shield : ShieldCheck;

  const noneSelected = !includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'>
                <Key className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {t('generatedPassword')}
                </label>
                <div className='relative'>
                  <div className='flex items-center gap-2 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 min-h-[56px] sm:min-h-[64px]'>
                    <div className='flex-1 font-mono text-base sm:text-lg text-gray-900 dark:text-gray-100 break-all select-all'>
                      {password ? (
                        showPassword ? password : '•'.repeat(password.length)
                      ) : (
                        <span className='text-gray-400 text-sm font-normal'>{t('selectAtLeastOne')}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className='p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0'
                      title={showPassword ? t('action.hide') : t('action.show')}
                    >
                      {showPassword ? <EyeOff className='h-4 w-4 sm:h-5 sm:w-5' /> : <Eye className='h-4 w-4 sm:h-5 sm:w-5' />}
                    </button>
                  </div>
                </div>

                {password && (
                  <div className={`mt-3 flex items-center gap-2 p-3 rounded-lg ${strength.bgLight}`}>
                    <StrengthIcon className={`h-5 w-5 ${strength.color} flex-shrink-0`} />
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className={`text-sm font-medium ${strength.color}`}>
                          {t('strength')}: {strength.label}
                        </span>
                      </div>
                      <div className='flex gap-1'>
                        {[1, 2, 3, 4, 5, 6].map((i) => {
                          const thresholds = [2, 3, 3, 4, 5, 6];
                          const score = (length >= 8 ? 1 : 0) + (length >= 12 ? 1 : 0) + (length >= 16 ? 1 : 0) + 
                            (includeUppercase && includeLowercase ? 1 : 0) + (includeNumbers ? 1 : 0) + (includeSymbols ? 1 : 0);
                          return (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${
                                score >= i ? strength.bg : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t('passwordLength')}</label>
                      <span className='text-sm font-bold text-purple-600 dark:text-purple-400'>{length}</span>
                    </div>
                    <input
                      type='range'
                      min='4'
                      max='64'
                      step='1'
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500'
                    />
                    <div className='flex justify-between mt-1 text-xs text-gray-400'>
                      <span>4</span>
                      <span>32</span>
                      <span>64</span>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2'>{t('characters')}</label>
                  {[
                    { key: 'upper', label: t('uppercase'), checked: includeUppercase, onChange: setIncludeUppercase },
                    { key: 'lower', label: t('lowercase'), checked: includeLowercase, onChange: setIncludeLowercase },
                    { key: 'number', label: t('numbers'), checked: includeNumbers, onChange: setIncludeNumbers },
                    { key: 'symbol', label: t('symbols'), checked: includeSymbols, onChange: setIncludeSymbols },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                        item.checked
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      } ${noneSelected && !item.checked ? 'opacity-50' : ''}`}
                    >
                      <input
                        type='checkbox'
                        checked={item.checked}
                        onChange={(e) => item.onChange(e.target.checked)}
                        className='w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500'
                      />
                      <span className='text-sm text-gray-700 dark:text-gray-300'>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                <button
                  onClick={generatePassword}
                  disabled={noneSelected}
                  className='flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm'
                >
                  <RefreshCw className='h-4 w-4 sm:h-5 sm:w-5' />
                  {t('action.generate')}
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!password}
                  className='flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm'
                >
                  {copied ? <Check className='h-4 w-4 sm:h-5 sm:w-5' /> : <Copy className='h-4 w-4 sm:h-5 sm:w-5' />}
                  {copied ? t('action.copied') : t('action.copy')}
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-lg border font-medium text-sm transition-colors ${
                    showHistory 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <History className='h-4 w-4 sm:h-5 sm:w-5' />
                  {t('history')}
                  {history.length > 0 && (
                    <span className='px-1.5 py-0.5 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'>
                      {history.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={exportHistory}
                  disabled={history.length === 0}
                  className='flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm'
                >
                  <Download className='h-4 w-4 sm:h-5 sm:w-5' />
                  {t('export')}
                </button>
              </div>

              {showHistory && (
                <div className='p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold text-gray-900 dark:text-gray-100'>{t('history')}</h4>
                    <div className='flex items-center gap-2'>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value as 'plain' | 'csv' | 'json')}
                        className='px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs focus:ring-2 focus:ring-purple-500'
                      >
                        <option value='plain'>{t('plainText')}</option>
                        <option value='csv'>{t('csv')}</option>
                        <option value='json'>{t('json')}</option>
                      </select>
                      <button
                        onClick={clearHistory}
                        disabled={history.length === 0}
                        className='flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50'
                      >
                        <Trash2 className='h-3 w-3' />
                        {t('clearHistory')}
                      </button>
                    </div>
                  </div>

                  {history.length === 0 ? (
                    <p className='text-sm text-gray-500 dark:text-gray-400 text-center py-4'>
                      {t('historyEmpty')}
                    </p>
                  ) : (
                    <div className='space-y-2 max-h-[300px] overflow-auto'>
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className='flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        >
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              item.favorite 
                                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                          >
                            {item.favorite ? <Star className='h-4 w-4 fill-current' /> : <StarOff className='h-4 w-4' />}
                          </button>
                          <div className='flex-1 min-w-0'>
                            <div className='font-mono text-sm text-gray-900 dark:text-gray-100 break-all'>
                              {item.password}
                            </div>
                            <div className='flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400'>
                              <span>{t('length')}: {item.length}</span>
                              <span>{t('timestamp')}: {item.timestamp.toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <div className='flex items-center gap-1'>
                            <button
                              onClick={() => copyToClipboard(item.password)}
                              className='p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                            >
                              <Copy className='h-4 w-4' />
                            </button>
                            <button
                              onClick={() => deleteHistoryItem(item.id)}
                              className='p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
                            >
                              <Trash2 className='h-4 w-4' />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className='p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-purple-700 dark:text-purple-300'>
                  {t('tip')}
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t('features')}</h3>
            <ul className='space-y-3'>
              {[t('f1'), t('f2'), t('f3'), t('f4'), t('f5'), t('f6')].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0' />
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
