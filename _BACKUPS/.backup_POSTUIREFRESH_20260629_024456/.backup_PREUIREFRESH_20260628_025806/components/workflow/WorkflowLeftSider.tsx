'use client';
import {
  Blocks,
  ShoppingBag,
  GitBranch,
  Sparkles,
  User,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

/* ========== i18n 文案（6语言，en兜底） ========== */
const I18N = {
  brand: {
    zh: 'Korelyy Flow',
    en: 'Korelyy Flow',
    fr: 'Korelyy Flow',
    es: 'Korelyy Flow',
    hi: 'Korelyy Flow',
    ar: 'Korelyy Flow',
  },
  tools: { zh: '工具市场', en: 'Tool Store', fr: 'Boutique', es: 'Tienda', hi: 'टूल स्टोर', ar: 'متجر الأدوات' },
  myFlows: {
    zh: '我的工作流',
    en: 'My Workflows',
    fr: 'Mes Workflows',
    es: 'Mis Flujos',
    hi: 'मेरे वर्कफ़्लो',
    ar: 'تدفقات العمل الخاصة بي',
  },
  templates: {
    zh: '模板商店',
    en: 'Templates',
    fr: 'Modèles',
    es: 'Plantillas',
    hi: 'टेम्पलेट',
    ar: 'القوالب',
  },
  ideas: {
    zh: '威客接单',
    en: 'Gigs & Ideas',
    fr: 'Idées & Jobs',
    es: 'Ideas & Trabajos',
    hi: 'आइडिया और गिग्स',
    ar: 'الأفكار والعمل',
  },
  me: { zh: '个人中心', en: 'Profile', fr: 'Profil', es: 'Perfil', hi: 'प्रोफ़ाइल', ar: 'الملف الشخصي' },
  admin: {
    zh: '管理后台',
    en: 'Admin Panel',
    fr: 'Administration',
    es: 'Panel Admin',
    hi: 'एडमिन पैनल',
    ar: 'لوحة الإدارة',
  },
  settings: { zh: '设置', en: 'Settings', fr: 'Réglages', es: 'Ajustes', hi: 'सेटिंग्स', ar: 'الإعدادات' },
  collapse: { zh: '收起', en: 'Collapse', fr: 'Réduire', es: 'Contraer', hi: 'संकुचित', ar: 'طي' },
  expand: { zh: '展开', en: 'Expand', fr: 'Développer', es: 'Expandir', hi: 'विस्तृत', ar: 'توسيع' },
};

type LocaleKey = keyof typeof I18N.brand;

const pick = (locale: string, map: Record<string, string>) =>
  map[locale as LocaleKey] || map.en;

/* ========== 菜单项类型 ========== */
interface MenuItemDef {
  id: string;
  key: keyof typeof I18N.tools;
  icon: LucideIcon;
  badge?: string;
}

const MENU: MenuItemDef[] = [
  { id: 'tools', key: 'tools', icon: ShoppingBag },
  { id: 'myFlows', key: 'myFlows', icon: Blocks, badge: '12' },
  { id: 'templates', key: 'templates', icon: GitBranch },
  { id: 'ideas', key: 'ideas', icon: Sparkles },
  { id: 'me', key: 'me', icon: User },
  { id: 'admin', key: 'admin', icon: ShieldCheck },
  { id: 'settings', key: 'settings', icon: Settings },
];

/* ========== Props ========== */
export interface WorkflowLeftSiderProps {
  locale?: string;
  collapsed?: boolean;
  activeId?: string;
  onToggleCollapse?: () => void;
  onSelect?: (id: string) => void;
}

/**
 * 左侧可折叠导航栏
 * - 折叠后仅图标，hover浮现tooltip文字
 * - 浅灰白极简底色，无厚重阴影
 * - 菜单点击走本地state回调，预留空接口不调用后端
 */
export default function WorkflowLeftSider({
  locale = 'en',
  collapsed = false,
  activeId = 'myFlows',
  onToggleCollapse,
  onSelect,
}: WorkflowLeftSiderProps) {
  /* — 空接口预留：真实环境中可对接用户菜单权限 — */
  const _apiFetchMenu = async () => {
    // TODO: 对接后端权限接口，暂不实现
  };

  /* — 选中态墨绿渐变下划线 — */
  const renderItem = (item: MenuItemDef, index: number) => {
    const Icon = item.icon;
    const isActive = activeId === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onSelect?.(item.id)}
        className={[
          'group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
          isActive
            ? 'bg-gradient-to-r from-[#0F5759]/10 via-[#34A89C]/8 to-[#86D3C5]/10 text-[#0A2C2D] dark:text-gray-100'
            : 'text-[#466B6C] dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800/70 hover:text-[#0A2C2D] dark:hover:text-gray-100',
        ].join(' ')}
      >
        {isActive && (
          <span
            aria-hidden
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#0F5759] via-[#34A89C] to-[#86D3C5]"
          />
        )}
        <span
          className={[
            'w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-all',
            isActive
              ? 'bg-gradient-to-br from-[#0F5759] via-[#34A89C] to-[#86D3C5] text-white shadow-md shadow-[#0F5759]/15'
              : 'bg-primary-50 dark:bg-gray-800 text-[#466B6C] dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-gray-700',
          ].join(' ')}
        >
          <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 min-w-0 text-left truncate font-medium">
              {pick(locale, I18N[item.key] as Record<string, string>)}
            </span>
            {item.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#0F5759]/10 to-[#86D3C5]/10 text-[#0F5759] dark:text-primary-300 font-semibold">
                {item.badge}
              </span>
            )}
            {index === 0 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-[#34A89C] to-[#86D3C5] shadow-md shadow-[#34A89C]/30" />
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <aside
      className={[
        'h-full flex flex-col bg-gradient-to-b from-[#F7FBFB] to-white dark:from-gray-900 dark:to-gray-950 border-r border-[#D8EBEA] dark:border-gray-800 transition-all duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-[232px] md:w-[248px]',
      ].join(' ')}
    >
      {/* — 顶部Logo + 墨绿渐变窄光带 — */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0F5759] via-[#34A89C] to-[#86D3C5] opacity-90" />
        <div className="flex items-center gap-3 px-4 h-16 border-b border-[#D8EBEA] dark:border-gray-800/70">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F5759] via-[#34A89C] to-[#86D3C5] flex items-center justify-center shadow-lg shadow-[#0F5759]/20 flex-shrink-0">
            <Blocks className="w-[18px] h-[18px] text-white" strokeWidth={2} />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold text-[#0A2C2D] dark:text-gray-100 tracking-tight truncate">
                {pick(locale, I18N.brand)}
              </div>
              <div className="text-[11px] text-[#466B6C] dark:text-gray-500">
                {collapsed ? '' : 'Automation Studio'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* — 菜单项列表 — */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {MENU.map((it, i) => renderItem(it, i))}
      </nav>

      {/* — 底部折叠按钮 — */}
      <div className="p-2.5 border-t border-[#D8EBEA] dark:border-gray-800/70">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-xl text-[#466B6C] dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-gray-800/70 hover:text-[#0A2C2D] dark:hover:text-gray-100 transition-colors text-xs"
          title={collapsed ? pick(locale, I18N.expand) : pick(locale, I18N.collapse)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          ) : (
            <>
              <span className="flex-1 text-left truncate font-medium">
                {pick(locale, I18N.collapse)}
              </span>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
