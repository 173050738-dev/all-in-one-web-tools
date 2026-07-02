'use client';
import { useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Code,
  Shield,
  Palette,
  FileText,
  GraduationCap,
  Video,
  Zap,
  X,
} from 'lucide-react';
import { categories } from '@/data/categories';
import { searchTools, listToolMetaByCategory } from '@/lib/workflow-tool-registry';
import type { ToolExecutorMeta } from '@/lib/workflow-tool-registry';

interface ToolPaletteProps {
  locale?: string;
  onAddNode?: (meta: ToolExecutorMeta) => void;
  onDragStart?: (e: React.DragEvent, meta: ToolExecutorMeta) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const CATEGORY_ICONS: Record<string, any> = {
  security: Shield,
  developer: Code,
  designer: Palette,
  'content-creator': Zap,
  'office-worker': FileText,
  student: GraduationCap,
  'video-creator': Video,
};

const T = {
  search: {
    zh: '搜索工具...',
    en: 'Search tools...',
    fr: 'Rechercher...',
    es: 'Buscar...',
    hi: 'टूल खोजें...',
    ar: 'بحث...',
  },
  addStep: {
    zh: '添加步骤',
    en: 'Add Step',
    fr: 'Ajouter',
    es: 'Añadir',
    hi: 'जोड़ें',
    ar: 'إضافة',
  },
  dragHint: {
    zh: '拖拽到画布或点击添加',
    en: 'Drag to canvas or click to add',
    fr: 'Glissez ou cliquez pour ajouter',
    es: 'Arrastra o haz clic para añadir',
    hi: 'खींचें या क्लिक करें',
    ar: 'اسحب أو انقر للإضافة',
  },
  empty: {
    zh: '未找到匹配的工具',
    en: 'No matching tools',
    fr: 'Aucun outil trouvé',
    es: 'Sin resultados',
    hi: 'कोई टूल नहीं मिला',
    ar: 'لا توجد أدوات مطابقة',
  },
  title: {
    zh: '工具面板',
    en: 'Tools',
    fr: 'Outils',
    es: 'Herramientas',
    hi: 'टूल्स',
    ar: 'الأدوات',
  },
};

function t(locale: string, key: keyof typeof T): string {
  const dict = T[key];
  return (dict as any)[locale] || dict.en;
}

export default function ToolPalette({
  locale = 'en',
  onAddNode,
  onDragStart,
  onClose,
  showCloseButton = true,
}: ToolPaletteProps) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const def: Record<string, boolean> = {};
    categories.forEach((c, i) => (def[c.id] = i < 2));
    return def;
  });

  const searchResults = useMemo(
    () => (query.trim() ? searchTools(query, 50) : null),
    [query]
  );

  const byCategory = useMemo(() => listToolMetaByCategory(), []);

  const toggle = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const renderItem = (meta: ToolExecutorMeta, key: string) => {
    const Icon = CATEGORY_ICONS[meta.category] || Code;
    return (
      <div
        key={key}
        draggable
        onDragStart={(e) => onDragStart && onDragStart(e, meta)}
        onClick={() => onAddNode && onAddNode(meta)}
        className="group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
      >
        <GripVertical className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 flex-shrink-0" />
        <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
            {meta.name}
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
            {meta.slug}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddNode && onAddNode(meta);
          }}
          className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 flex-shrink-0"
          title={t(locale, 'addStep')}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
            {t(locale, 'title')}
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
            {t(locale, 'dragHint')}
          </div>
        </div>
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0 sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-2 border-b border-gray-100 dark:border-gray-700/60">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(locale, 'search')}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {searchResults ? (
          searchResults.length ? (
            <div className="space-y-0.5">
              {searchResults.map((m) => renderItem(m, `s-${m.slug}`))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400 dark:text-gray-500">
              {t(locale, 'empty')}
            </div>
          )
        ) : (
          <div className="space-y-1">
            {categories.map((cat) => {
              const items = byCategory[cat.id] || [];
              if (items.length === 0) return null;
              const isOpen = expanded[cat.id];
              const CatIcon = CATEGORY_ICONS[cat.id] || Code;
              return (
                <div key={cat.id}>
                  <button
                    onClick={() => toggle(cat.id)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
                  >
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    )}
                    <CatIcon className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                    <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex-1 text-left">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">
                      {items.length}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="ml-1 mt-0.5 space-y-0.5 border-l border-gray-100 dark:border-gray-700/60 pl-2">
                      {items.map((m) => renderItem(m, `${cat.id}-${m.slug}`))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
