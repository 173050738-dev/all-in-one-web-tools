'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';

type GuideKey = 'ios' | 'android' | 'desktop';

const I18N: Record<string, {
  btnText: string;
  btnAria: string;
  installPwa: string;
  installPwaStrong: string;
  installPwaHint: string;
  installPwaWait: string;
  installPwaWaitHint: string;
  recommendedBadge: string;
  downloadWin: string;
  downloadMac: string;
  downloadLinux: string;
  savedInDesktopNote: string;
  sectionDesktopTitle: string;
  iosGuide: string;
  androidGuide: string;
  desktopGuide: string;
  guideTitle: string;
  close: string;
  iosSteps: string[];
  androidSteps: string[];
  desktopSteps: string[];
  iosNote: string;
  androidNote: string;
  desktopNote: string;
  title: string;
  winFile: string;
  macFile: string;
  linuxFile: string;
  installedTip: string;
  gotIt: string;
  mobileSectionTitle: string;
}> = {
  zh: {
    btnText: '安装',
    btnAria: '添加到主屏幕 / 安装应用 · 桌面自动生成图标',
    installPwa: '⚡ 一键安装 Korelyy 桌面版',
    installPwaStrong: '系统级安装 → 桌面/开始菜单自动生成图标，独立全屏窗口（无浏览器栏）',
    installPwaHint: 'Chrome / Edge 支持：点我 → 弹出系统原生安装对话框，10秒完成',
    installPwaWait: '⏳ 当前会话暂未就绪',
    installPwaWaitHint: '刷新页面或再访问 1-2 次即可激活（浏览器安全策略）',
    recommendedBadge: '★ 推荐',
    downloadWin: '💻 Windows 快捷方式 (.url)  →  另存到桌面',
    downloadMac: '🍎 macOS 快捷方式 (.webloc)  →  另存到桌面',
    downloadLinux: '🐧 Linux 快捷方式 (.desktop)  →  另存到桌面',
    savedInDesktopNote: '对话框默认定位到「桌面」，直接按 Enter 保存即可，无需从下载文件夹再拖拽',
    sectionDesktopTitle: '电脑 · 桌面图标（推荐先试上方一键安装）',
    iosGuide: '📱 iOS Safari → 添加到主屏幕（4步）',
    androidGuide: '🤖 Android / Firefox → 手动添加（3步）',
    desktopGuide: '🖥️ 桌面浏览器 → 手动添加（3步）',
    guideTitle: '添加到桌面 · 详细步骤',
    close: '关闭',
    iosSteps: [
      '🌐 打开 Safari 浏览器访问 korelyy.com',
      '⬆️ 点击屏幕底部中间的「分享」方形图标',
      '➕ 向下滑动列表，找到「添加到主屏幕」',
      '✅ 右上角点击「添加」→ 桌面图标生成完成',
    ],
    androidSteps: [
      '🌐 Chrome / Edge 访问 korelyy.com',
      '⋮ 点击右上角三点菜单 → 选「安装应用」或「添加到主屏幕」',
      '✅ 弹出确认后点「安装」 → 自动生成桌面图标',
    ],
    desktopSteps: [
      '🌐 Chrome / Edge 访问 korelyy.com',
      '📦 地址栏右侧点击「安装 Korelyy Tools」图标，或菜单 → 安装',
      '✅ 完成后桌面出现图标，点击以独立全屏窗口打开（无浏览器栏）',
    ],
    iosNote: '⚠️ 苹果政策禁止网页自动弹出安装，仅支持通过上述分享菜单手动添加',
    androidNote: '💡 安装后默认独立窗口打开，像原生 App 一样使用',
    desktopNote: '💡 macOS Safari 可手动：文件 → 添加到程序坞/添加到主屏幕',
    title: 'Korelyy Tools · 百宝箱工具站',
    winFile: 'Korelyy 工具站.url',
    macFile: 'Korelyy 工具站.webloc',
    linuxFile: 'korelyy-tools.desktop',
    installedTip: '✅ 安装成功！桌面已生成图标，下次直接双击打开即可',
    gotIt: '明白了',
    mobileSectionTitle: '手机 / 平板 · 手动添加',
  },
  en: {
    btnText: 'Install',
    btnAria: 'Add to Home Screen · Desktop auto-icon creation',
    installPwa: '⚡ Install Korelyy (Desktop App)',
    installPwaStrong: 'System-level install → auto-icon on Desktop + Start Menu / Dock. Opens in standalone fullscreen window.',
    installPwaHint: 'Chrome / Edge: opens the native OS install dialog, done in 10 seconds',
    installPwaWait: '⏳ Not ready this session',
    installPwaWaitHint: 'Reload the page or visit 1-2 more times (browser security policy)',
    recommendedBadge: '★ RECOMMENDED',
    downloadWin: '💻 Windows Shortcut (.url)  →  Save to Desktop',
    downloadMac: '🍎 macOS Shortcut (.webloc)  →  Save to Desktop',
    downloadLinux: '🐧 Linux Shortcut (.desktop)  →  Save to Desktop',
    savedInDesktopNote: 'Dialog defaults to your Desktop folder — just press Enter. No more dragging from Downloads.',
    sectionDesktopTitle: 'Desktop · Save Shortcut (Try the one-click installer above first)',
    iosGuide: '📱 iOS Safari → Add to Home Screen (4 steps)',
    androidGuide: '🤖 Android / Firefox → Manual add (3 steps)',
    desktopGuide: '🖥️ Desktop Browser → Manual add (3 steps)',
    guideTitle: 'Add to Home Screen · Step by Step',
    close: 'Close',
    iosSteps: [
      '🌐 Open Safari and go to korelyy.com',
      '⬆️ Tap the Share square icon at bottom center',
      '➕ Scroll down and tap "Add to Home Screen"',
      '✅ Tap "Add" top-right → icon appears on home screen',
    ],
    androidSteps: [
      '🌐 Open korelyy.com in Chrome / Edge',
      '⋮ Tap top-right 3-dot menu → "Install app" or "Add to Home screen"',
      '✅ Confirm "Install" → desktop icon auto created',
    ],
    desktopSteps: [
      '🌐 Open korelyy.com in Chrome / Edge',
      '📦 Click the "Install Korelyy Tools" icon in address bar, or Menu → Install',
      '✅ Done. Desktop icon added. Opens in standalone window (no browser chrome)',
    ],
    iosNote: '⚠️ Apple policy blocks auto-install prompts on iOS — only manual via Share menu',
    androidNote: '💡 Opens in standalone window after install — behaves like a native app',
    desktopNote: '💡 macOS Safari users: File → Add to Dock / Add to Home Screen',
    title: 'Korelyy Tools · Free Online Tools Hub',
    winFile: 'Korelyy Tools.url',
    macFile: 'Korelyy Tools.webloc',
    linuxFile: 'korelyy-tools.desktop',
    installedTip: '✅ Installed! Icon added to your Desktop. Double-click to open next time.',
    gotIt: 'Got it',
    mobileSectionTitle: 'Mobile / Tablet · Guides',
  },
  es: {
    btnText: 'Instalar',
    btnAria: 'Añadir al escritorio / Instalar app',
    installPwa: '⚡ Instalar Korelyy (App de escritorio)',
    installPwaStrong: 'Instalación del sistema → icono automático en Escritorio + Menú Inicio / Dock. Ventana independiente a pantalla completa.',
    installPwaHint: 'Chrome / Edge: abre el diálogo nativo del SO, listo en 10 s',
    installPwaWait: '⏳ No disponible esta sesión',
    installPwaWaitHint: 'Recarga o visita 1-2 veces más (política de seguridad del navegador)',
    recommendedBadge: '★ RECOMENDADO',
    downloadWin: '💻 Acceso directo Windows (.url)  →  Guardar en escritorio',
    downloadMac: '🍎 Acceso directo macOS (.webloc)  →  Guardar en escritorio',
    downloadLinux: '🐧 Acceso directo Linux (.desktop)  →  Guardar en escritorio',
    savedInDesktopNote: 'El diálogo abre directamente en el Escritorio — solo pulsa Enter. No hace falta arrastrar desde Descargas.',
    sectionDesktopTitle: 'Escritorio · Guardar acceso directo (Prueba primero la instalación en 1 clic arriba)',
    iosGuide: '📱 iOS Safari → Añadir a pantalla de inicio (4 pasos)',
    androidGuide: '🤖 Android / Firefox → Añadir manualmente (3 pasos)',
    desktopGuide: '🖥️ Escritorio → Añadir manualmente (3 pasos)',
    guideTitle: 'Añadir a pantalla de inicio',
    close: 'Cerrar',
    iosSteps: [
      '🌐 Abre Safari y entra en korelyy.com',
      '⬆️ Toca el icono cuadrado Compartir en el centro abajo',
      '➕ Desliza hacia abajo y toca "Añadir a pantalla de inicio"',
      '✅ Toca "Añadir" arriba a la derecha → icono creado',
    ],
    androidSteps: [
      '🌐 Abre korelyy.com en Chrome / Edge',
      '⋮ Toca menú 3 puntos arriba → "Instalar app" o "Añadir a inicio"',
      '✅ Confirma "Instalar" → icono creado automáticamente',
    ],
    desktopSteps: [
      '🌐 Abre korelyy.com en Chrome / Edge',
      '📦 Clic en icono "Instalar Korelyy Tools" en la barra o Menú → Instalar',
      '✅ Listo. Abre en ventana independiente sin barra del navegador',
    ],
    iosNote: '⚠️ Apple bloquea avisos automáticos en iOS, solo manual vía menú Compartir',
    androidNote: '💡 Se abre en ventana independiente tras instalar, como app nativa',
    desktopNote: '💡 Safari macOS: Archivo → Añadir al Dock / Añadir a pantalla de inicio',
    title: 'Korelyy Tools · Herramientas online gratis',
    winFile: 'Korelyy Tools.url',
    macFile: 'Korelyy Tools.webloc',
    linuxFile: 'korelyy-tools.desktop',
    installedTip: '✅ ¡Instalado! Icono en el Escritorio. Doble clic la próxima vez.',
    gotIt: 'Entendido',
    mobileSectionTitle: 'Móvil / Tableta · Guías',
  },
  fr: {
    btnText: 'Installer',
    btnAria: 'Ajouter au bureau / Installer l\'app',
    installPwa: '⚡ Installer Korelyy (App de bureau)',
    installPwaStrong: 'Installation système → icône automatique sur le Bureau + Menu Démarrer / Dock. Fenêtre indépendante plein écran.',
    installPwaHint: 'Chrome / Edge : dialogue natif du système, terminé en 10 s',
    installPwaWait: '⏳ Pas disponible cette session',
    installPwaWaitHint: 'Rechargez ou revisitez 1-2 fois (politique de sécurité)',
    recommendedBadge: '★ RECOMMANDÉ',
    downloadWin: '💻 Raccourci Windows (.url)  →  Enregistrer sur le bureau',
    downloadMac: '🍎 Raccourci macOS (.webloc)  →  Enregistrer sur le bureau',
    downloadLinux: '🐧 Raccourci Linux (.desktop)  →  Enregistrer sur le bureau',
    savedInDesktopNote: 'La boîte de dialogue ouvre directement sur le Bureau — appuyez sur Entrée. Plus besoin de glisser depuis Téléchargements.',
    sectionDesktopTitle: 'Bureau · Enregistrer le raccourci (Essayez d\'abord l\'installateur en 1 clic ci-dessus)',
    iosGuide: '📱 iOS Safari → Ajouter à l\'écran d\'accueil (4 étapes)',
    androidGuide: '🤖 Android / Firefox → Ajout manuel (3 étapes)',
    desktopGuide: '🖥️ Bureau → Ajout manuel (3 étapes)',
    guideTitle: 'Ajouter à l\'écran d\'accueil',
    close: 'Fermer',
    iosSteps: [
      '🌐 Ouvrez Safari et allez sur korelyy.com',
      '⬆️ Touchez le carré Partager en bas centre',
      '➕ Faites défiler vers le bas → "Ajouter à l\'écran d\'accueil"',
      '✅ Touchez "Ajouter" en haut à droite → icône créée',
    ],
    androidSteps: [
      '🌐 Ouvrez korelyy.com dans Chrome / Edge',
      '⋮ Menu 3 points en haut → "Installer l\'app" ou "Ajouter à l\'accueil"',
      '✅ Confirmez "Installer" → icône créée automatiquement',
    ],
    desktopSteps: [
      '🌐 Ouvrez korelyy.com dans Chrome / Edge',
      '📦 Clic sur "Installer Korelyy Tools" dans barre d\'adresse ou Menu → Installer',
      '✅ Terminé. Ouvre dans une fenêtre indépendante sans barre navigateur',
    ],
    iosNote: '⚠️ Apple bloque les invites auto sur iOS — uniquement via menu Partager',
    androidNote: '💡 S\'ouvre en fenêtre indépendante après installation, comme une app native',
    desktopNote: '💡 Safari macOS : Fichier → Ajouter au Dock / Ajouter à l\'écran d\'accueil',
    title: 'Korelyy Tools · Boîte à outils en ligne gratuite',
    winFile: 'Korelyy Tools.url',
    macFile: 'Korelyy Tools.webloc',
    linuxFile: 'korelyy-tools.desktop',
    installedTip: '✅ Installé ! Icône ajoutée au Bureau. Double-clic pour ouvrir.',
    gotIt: 'Compris',
    mobileSectionTitle: 'Mobile / Tablette · Guides',
  },
  hi: {
    btnText: 'इंस्टॉल करें',
    btnAria: 'डेस्कटॉप पर जोड़ें / ऐप इंस्टॉल करें',
    installPwa: '⚡ Korelyy इंस्टॉल करें (डेस्कटॉप ऐप)',
    installPwaStrong: 'सिस्टम-स्तरीय इंस्टॉल → डेस्कटॉप + स्टार्ट मेन्यू / डॉक पर स्वतः आइकन। स्टैंडअलोन फुलस्क्रीन विंडो में खुलता है।',
    installPwaHint: 'Chrome / Edge: OS का नेटिव इंस्टॉल डायलॉग सीधे खुलता है, 10 सेकंड में',
    installPwaWait: '⏳ इस सत्र में उपलब्ध नहीं',
    installPwaWaitHint: 'पेज रीलोड करें या 1-2 बार और विज़िट करें (ब्राउज़र सुरक्षा नीति)',
    recommendedBadge: '★ अनुशंसित',
    downloadWin: '💻 Windows शॉर्टकट (.url)  →  डेस्कटॉप पर सहेजें',
    downloadMac: '🍎 macOS शॉर्टकट (.webloc)  →  डेस्कटॉप पर सहेजें',
    downloadLinux: '🐧 Linux शॉर्टकट (.desktop)  →  डेस्कटॉप पर सहेजें',
    savedInDesktopNote: 'डायलॉग सीधे डेस्कटॉप फोल्डर में खुलता है — बस Enter दबाएं। Downloads से घसीटने की ज़रूरत नहीं।',
    sectionDesktopTitle: 'डेस्कटॉप · शॉर्टकट सहेजें (ऊपर 1-क्लिक इंस्टॉलर पहले आज़माएं)',
    iosGuide: '📱 iOS Safari → होम स्क्रीन पर जोड़ें (4 स्टेप)',
    androidGuide: '🤖 Android / Firefox → मैन्युअल जोड़ें (3 स्टेप)',
    desktopGuide: '🖥️ डेस्कटॉप → मैन्युअल जोड़ें (3 स्टेप)',
    guideTitle: 'होम स्क्रीन पर जोड़ें · कदम दर कदम',
    close: 'बंद करें',
    iosSteps: [
      '🌐 Safari खोलें और korelyy.com पर जाएं',
      '⬆️ नीचे बीच में स्क्वायर शेयर आइकन टैप करें',
      '➕ नीचे स्क्रॉल करें → "होम स्क्रीन पर जोड़ें"',
      '✅ टॉप-राइट "जोड़ें" पर टैप → आइकन बन गया',
    ],
    androidSteps: [
      '🌐 Chrome / Edge में korelyy.com खोलें',
      '⋮ टॉप-राइट 3-डॉट मेन्यू → "ऐप इंस्टॉल करें" या "होम पर जोड़ें"',
      '✅ "इंस्टॉल" कन्फर्म → आइकन अपने आप बन जाएगा',
    ],
    desktopSteps: [
      '🌐 Chrome / Edge में korelyy.com खोलें',
      '📦 एड्रेस बार में "Korelyy Tools इंस्टॉल करें" पर क्लिक या मेन्यू → इंस्टॉल',
      '✅ हो गया। डेस्कटॉप आइकन से खोलें, स्टैंडअलोन विंडो (बिना ब्राउज़र बार के)',
    ],
    iosNote: '⚠️ iOS पर Apple ऑटो-इंस्टॉल प्रॉम्प्ट ब्लॉक करता है, केवल शेयर मेन्यू से',
    androidNote: '💡 इंस्टॉल के बाद स्टैंडअलोन विंडो में खुलता है, नेटिव ऐप जैसा',
    desktopNote: '💡 macOS Safari: फ़ाइल → Dock में जोड़ें / होम स्क्रीन पर जोड़ें',
    title: 'Korelyy Tools · मुफ्त ऑनलाइन टूल्स हब',
    winFile: 'Korelyy Tools.url',
    macFile: 'Korelyy Tools.webloc',
    linuxFile: 'korelyy-tools.desktop',
    installedTip: '✅ इंस्टॉल हो गया! डेस्कटॉप पर आइकन। अगली बार डबल-क्लिक करें।',
    gotIt: 'समझा',
    mobileSectionTitle: 'मोबाइल / टैबलेट · गाइड',
  },
  ar: {
    btnText: 'تثبيت',
    btnAria: 'أضف إلى سطح المكتب / تثبيت التطبيق',
    installPwa: '⚡ تثبيت Korelyy (تطبيق سطح المكتب)',
    installPwaStrong: 'تثبيت على مستوى النظام → أيقونة تلقائية على سطح المكتب + قائمة ابدأ / الرصيف. يفتح في نافذة مستقلة ملء الشاشة.',
    installPwaHint: 'Chrome / Edge: يفتح مربع حوار تثبيت النظام الأصلي مباشرة خلال 10 ثوانٍ',
    installPwaWait: '⏳ غير جاهز هذه الجلسة',
    installPwaWaitHint: 'أعد تحميل الصفحة أو زر 1-2 مرات أخرى (سياسة أمان المتصفح)',
    recommendedBadge: '★ مُفضّل',
    downloadWin: '💻 اختصار Windows (.url)  →  حفظ على سطح المكتب',
    downloadMac: '🍎 اختصار macOS (.webloc)  →  حفظ على سطح المكتب',
    downloadLinux: '🐧 اختصار Linux (.desktop)  →  حفظ على سطح المكتب',
    savedInDesktopNote: 'يفتح الحوار مباشرة على مجلد سطح المكتب — فقط اضغط Enter. لا حاجة للسحب من مجلد التنزيلات.',
    sectionDesktopTitle: 'سطح المكتب · احفظ الاختصار (جرّب المثبّت بنقرة واحدة أعلاه أولاً)',
    iosGuide: '📱 iOS Safari → أضف إلى الشاشة الرئيسية (4 خطوات)',
    androidGuide: '🤖 Android / Firefox → إضافة يدوية (3 خطوات)',
    desktopGuide: '🖥️ سطح المكتب → إضافة يدوية (3 خطوات)',
    guideTitle: 'أضف إلى الشاشة الرئيسية · خطوة بخطوة',
    close: 'إغلاق',
    iosSteps: [
      '🌐 افتح Safari واذهب إلى korelyy.com',
      '⬆️ اضغط على أيقونة المشاريع المربعة أسفل المنتصف',
      '➕ مرر للأسفل واختر "أضف إلى الشاشة الرئيسية"',
      '✅ اضغط "إضافة" أعلى اليمين → تم إنشاء الأيقونة',
    ],
    androidSteps: [
      '🌐 افتح korelyy.com في Chrome / Edge',
      '⋮ اضغط قائمة النقاط الثلاث أعلى اليمين → "تثبيت التطبيق" أو "أضف إلى البداية"',
      '✅ أكد "تثبيت" → تُنشأ الأيقونة تلقائيًا',
    ],
    desktopSteps: [
      '🌐 افتح korelyy.com في Chrome / Edge',
      '📦 اضغط على "تثبيت Korelyy Tools" في شريط العنوان أو القائمة → تثبيت',
      '✅ تم. يفتح في نافذة مستقلة بدون شريط المتصفح',
    ],
    iosNote: '⚠️ Apple تمنع النوافذ التلقائية على iOS — يدويا فقط عبر قائمة المشاركة',
    androidNote: '💡 يفتح في نافذة مستقلة بعد التثبيت، مثل التطبيق الأصلي',
    desktopNote: '💡 مستخدمو Safari macOS: ملف → أضف إلى الرصيف / أضف إلى الشاشة الرئيسية',
    title: 'Korelyy Tools · مركز أدوات مجانية عبر الإنترنت',
    winFile: 'Korelyy Tools.url',
    macFile: 'Korelyy Tools.webloc',
    linuxFile: 'korelyy-tools.desktop',
    installedTip: '✅ تم التثبيت! الأيقونة على سطح المكتب. انقر نقرًا مزدوجًا في المرة القادمة.',
    gotIt: 'فهمت',
    mobileSectionTitle: 'هاتف / تابلت · أدلة',
  },
};

type SaveFilePickerFsHandleLike = {
  createWritable: () => Promise<{ write: (b: Blob) => Promise<void>; close: () => Promise<void> }>;
};
type ShowSaveFilePickerFn = (opts: {
  suggestedName?: string;
  startIn?: 'desktop' | 'documents' | 'downloads';
  types?: Array<{ description: string; accept: Record<string, string[]> }>;
}) => Promise<SaveFilePickerFsHandleLike>;

export default function InstallToHomeButton() {
  const locale = useLocale();
  const t = I18N[locale] || I18N.en;

  const [menuOpen, setMenuOpen] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);
  const [activeGuide, setActiveGuide] = useState<GuideKey | null>(null);
  const [isCoarse, setIsCoarse] = useState(false);

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const deferredPromptRef = useRef<unknown | null>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://korelyy.com';

  useEffect(() => {
    setIsCoarse(
      typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: coarse)').matches
    );
  }, []);

  const hasSaveFilePicker: boolean = useMemo(
    () => typeof window !== 'undefined' && typeof (window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker === 'function',
    []
  );

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setCanInstall(true);
    };
    const onInstalled = () => {
      setCanInstall(false);
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 5000);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen || activeGuide) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        btnRef.current && !btnRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen, activeGuide]);

  const triggerInstall = async () => {
    const ev = deferredPromptRef.current as { prompt: () => Promise<void>; userChoice?: Promise<{ outcome: string }> } | null;
    if (!ev) {
      alert(`${t.installPwaWait}\n\n${t.installPwaWaitHint}`);
      return;
    }
    try {
      await ev.prompt();
      if (ev.userChoice) {
        const choice = await ev.userChoice;
        if (choice.outcome === 'accepted') {
          setCanInstall(false);
        }
      }
    } catch (err) {
      console.error('install prompt failed:', err);
    } finally {
      deferredPromptRef.current = null;
    }
    setMenuOpen(false);
  };

  const downloadBlob = async (content: string, filename: string, mime: string) => {
    if (typeof document === 'undefined') return;
    const blob = new Blob([content], { type: mime });

    if (hasSaveFilePicker) {
      try {
        const fn = (window as unknown as { showSaveFilePicker: ShowSaveFilePickerFn }).showSaveFilePicker;
        const extWithDot = filename.includes('.') ? filename.slice(filename.lastIndexOf('.')) : '';
        const handle = await fn({
          suggestedName: filename,
          startIn: 'desktop',
          types: extWithDot
            ? [{
                description: filename,
                accept: { [mime]: [extWithDot] },
              }]
            : undefined,
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        setMenuOpen(false);
        return;
      } catch (err) {
        if (err && (err as { name?: string }).name === 'AbortError') return;
        // fall through to anchor-based fallback
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMenuOpen(false);
  };

  const downloadWinShortcut = () => {
    const content = `[InternetShortcut]
URL=${currentUrl}
IconIndex=0
HotKey=0
IDList=
LocalFile=
[InternetShortcut.A]
WorkingDirectory=
[InternetShortcut.W]
`;
    downloadBlob(content, t.winFile, 'application/internet-shortcut');
  };

  const downloadMacShortcut = () => {
    const content = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>URL</key>
  <string>${currentUrl}</string>
</dict>
</plist>`;
    downloadBlob(content, t.macFile, 'application/xml');
  };

  const downloadLinuxShortcut = () => {
    const content = `[Desktop Entry]
Version=1.0
Type=Link
Name=Korelyy Tools
Comment=${t.title}
URL=${currentUrl}
Icon=text-html
Categories=Utility;Productivity;
`;
    downloadBlob(content, t.linuxFile, 'text/plain');
  };

  const steps = (key: GuideKey) =>
    key === 'ios' ? t.iosSteps : key === 'android' ? t.androidSteps : t.desktopSteps;
  const note = (key: GuideKey) =>
    key === 'ios' ? t.iosNote : key === 'android' ? t.androidNote : t.desktopNote;
  const guideTitle = (key: GuideKey) =>
    key === 'ios' ? t.iosGuide : key === 'android' ? t.androidGuide : t.desktopGuide;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={t.btnAria}
        title={t.btnAria}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors text-xs font-medium"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18v-10m0 0l-3 3m3-3l3 3M5 20h14a1 1 0 001-1v-5a1 1 0 10-2 0v4H6v-4a1 1 0 10-2 0v5a1 1 0 001 1z"
          />
        </svg>
        <span className="hidden sm:inline">{justInstalled ? '✓' : t.btnText}</span>
      </button>

      {justInstalled && (
        <div className="absolute right-0 mt-2 w-60 sm:w-72 z-50 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 text-xs px-3 py-2.5 shadow-2xl animate-in fade-in slide-in-from-top-2 ring-1 ring-emerald-500/20">
          <div className="flex items-start gap-2">
            <span className="text-base mt-0.5">🎊</span>
            <div className="flex-1 leading-relaxed">{t.installedTip}</div>
          </div>
        </div>
      )}

      {menuOpen && !activeGuide && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-[min(94vw,380px)] sm:w-[420px] z-50 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-2"
          >
            <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 flex items-start gap-3 bg-gradient-to-b from-indigo-50/60 to-transparent dark:from-indigo-950/30">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-[#2A3154] flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-900/30 ring-2 ring-white/40">
                📱
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  {t.btnAria}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {t.title}
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={t.close}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-2.5 py-2.5 max-h-[72vh] overflow-y-auto space-y-1.5">
              {/* ════════════ C 优化：一键安装视觉升级 ════════════ */}
              <div
                className={`relative w-full rounded-2xl overflow-hidden border transition-all ${
                  canInstall
                    ? 'bg-gradient-to-br from-[#4338ca] via-[#4f46e5] to-[#2A3154] text-white border-transparent shadow-[0_8px_30px_rgb(79,70,229,0.35)]'
                    : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 dark:from-gray-900/50 dark:to-gray-950/50 text-gray-400 dark:text-gray-500 border-gray-200/80 dark:border-gray-700/80'
                }`}
              >
                <button
                  onClick={triggerInstall}
                  disabled={!canInstall}
                  className={`w-full text-left p-3.5 sm:p-4 relative z-10 ${
                    canInstall ? 'cursor-pointer hover:brightness-110 active:brightness-95' : 'cursor-not-allowed'
                  }`}
                >
                  {canInstall && (
                    <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold tracking-wider bg-amber-400 text-amber-950 shadow-[0_1px_2px_rgba(0,0,0,0.2)] ring-1 ring-amber-200/80 uppercase">
                      {t.recommendedBadge}
                    </span>
                  )}
                  <div className="flex items-start gap-3 pr-16">
                    <div className={`text-2xl sm:text-[28px] leading-none mt-0.5 flex-shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] ${canInstall ? '' : 'opacity-50'}`}>
                      {canInstall ? '🪄' : '⏳'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm sm:text-[15px] font-bold leading-snug ${canInstall ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                        {canInstall ? t.installPwa : t.installPwaWait}
                      </div>
                      <div className={`text-[11px] sm:text-xs mt-1.5 leading-relaxed ${canInstall ? 'text-indigo-50/95' : 'text-gray-400 dark:text-gray-500'}`}>
                        {canInstall ? t.installPwaStrong : t.installPwaWaitHint}
                      </div>
                      <div className={`flex items-center gap-1.5 mt-2.5 text-[10px] sm:text-[11px] font-medium ${canInstall ? 'text-indigo-100/95' : 'text-gray-400 dark:text-gray-500'}`}>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${canInstall ? 'border-white/20 bg-white/10' : 'border-transparent bg-transparent'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                          Chrome / Edge
                        </span>
                        {canInstall && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/20 bg-white/10`}>
                            💡 {t.installPwaHint}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* ════════════ B 优化：3 平台快捷方式 + showSaveFilePicker 定位桌面 ════════════ */}
              {!isCoarse && (
                <div className="pt-1">
                  <div className="flex items-baseline justify-between px-1 mb-1.5">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 font-bold">
                      {t.sectionDesktopTitle}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 space-y-1.5">
                    <button
                      onClick={downloadWinShortcut}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center justify-between gap-3 text-gray-800 dark:text-gray-100 border border-transparent hover:border-indigo-200/60 dark:hover:border-indigo-800/60"
                    >
                      <span className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="text-lg sm:text-xl flex-shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300">💻</span>
                        <span className="text-xs sm:text-sm font-medium leading-tight truncate">{t.downloadWin}</span>
                      </span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold shrink-0 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 ring-1 ring-indigo-100 dark:ring-indigo-900/70">
                        {hasSaveFilePicker ? '→ Desktop' : '↧'}
                      </span>
                    </button>
                    <button
                      onClick={downloadMacShortcut}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center justify-between gap-3 text-gray-800 dark:text-gray-100 border border-transparent hover:border-indigo-200/60 dark:hover:border-indigo-800/60"
                    >
                      <span className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="text-lg sm:text-xl flex-shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-lg bg-gray-800/10 text-gray-800 dark:text-gray-200 dark:bg-white/10">🍎</span>
                        <span className="text-xs sm:text-sm font-medium leading-tight truncate">{t.downloadMac}</span>
                      </span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold shrink-0 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 ring-1 ring-indigo-100 dark:ring-indigo-900/70">
                        {hasSaveFilePicker ? '→ Desktop' : '↧'}
                      </span>
                    </button>
                    <button
                      onClick={downloadLinuxShortcut}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center justify-between gap-3 text-gray-800 dark:text-gray-100 border border-transparent hover:border-indigo-200/60 dark:hover:border-indigo-800/60"
                    >
                      <span className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span className="text-lg sm:text-xl flex-shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">🐧</span>
                        <span className="text-xs sm:text-sm font-medium leading-tight truncate">{t.downloadLinux}</span>
                      </span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold shrink-0 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 ring-1 ring-indigo-100 dark:ring-indigo-900/70">
                        {hasSaveFilePicker ? '→ Desktop' : '↧'}
                      </span>
                    </button>
                    <div className="mt-1.5 p-2 rounded-lg text-[10px] sm:text-[11px] leading-relaxed bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-800/95 dark:text-indigo-200/95 border border-indigo-100/70 dark:border-indigo-900/60 flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">💾</span>
                      <span>{t.savedInDesktopNote}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════════ 手机 / 平板 引导区 ════════════ */}
              <div className="pt-1">
                <div className="px-1 mb-1.5">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400 font-bold">
                    {t.mobileSectionTitle}
                  </div>
                </div>
                <div className="space-y-1">
                  {(['ios', 'android', 'desktop'] as GuideKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveGuide(key)}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between gap-3 text-gray-800 dark:text-gray-100"
                    >
                      <span className="text-xs sm:text-sm leading-tight flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-base shrink-0">
                          {key === 'ios' ? '📱' : key === 'android' ? '🤖' : '🖥️'}
                        </span>
                        <span className="truncate">
                          {key === 'ios' ? t.iosGuide : key === 'android' ? t.androidGuide : t.desktopGuide}
                        </span>
                      </span>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeGuide && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-[2px] animate-in fade-in">
          <div className="w-full sm:max-w-lg bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 duration-200">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-b from-gray-50/70 to-transparent dark:from-gray-900/40">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight pr-4">
                {guideTitle(activeGuide)}
              </h3>
              <button
                onClick={() => setActiveGuide(null)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0"
                aria-label={t.close}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3.5 max-h-[72vh] overflow-y-auto">
              <ol className="space-y-2.5">
                {steps(activeGuide).map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-[#2A3154] text-white text-xs font-bold flex items-center justify-center shadow-sm ring-2 ring-white/60 dark:ring-transparent">
                      {i + 1}
                    </div>
                    <div className="text-sm sm:text-[15px] text-gray-800 dark:text-gray-100 leading-relaxed pt-0.5">
                      {s}
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-1 p-3 rounded-xl text-[11px] sm:text-xs leading-relaxed border border-amber-100 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/35 text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0 text-base">💡</span>
                <span>{note(activeGuide)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => setActiveGuide(null)}
                  className="col-span-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-semibold transition-colors"
                >
                  {t.close}
                </button>
                <button
                  onClick={() => {
                    setActiveGuide(null);
                    setMenuOpen(false);
                  }}
                  className="col-span-1 py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-[#2A3154] text-white text-xs sm:text-sm font-semibold hover:brightness-110 active:brightness-95 transition-all shadow-md shadow-indigo-900/20 ring-1 ring-white/10"
                >
                  ✓ {t.gotIt}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
