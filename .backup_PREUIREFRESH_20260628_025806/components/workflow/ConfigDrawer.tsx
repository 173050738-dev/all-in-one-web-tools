'use client';
import {
  X,
  ChevronRight,
  Copy,
  Trash2,
  PlayCircle,
  KeyRound,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Tag,
  ExternalLink,
  Save,
  type LucideIcon,
} from 'lucide-react';
import type { WorkflowNodeData } from './WorkflowNode';

/* ========== i18n ========== */
const I18N = {
  title: { zh: '节点配置', en: 'Step Setup', fr: 'Configuration', es: 'Configurar Paso', hi: 'सेटअप', ar: 'إعداد الخطوة' },
  noSelect: {
    zh: '请选择画布中的一个节点',
    en: 'Select a node on the canvas',
    fr: 'Sélectionnez un nœud',
    es: 'Selecciona un nodo',
    hi: 'किसी नोड का चयन करें',
    ar: 'اختر عقدة على القماش',
  },
  noSelectDesc: {
    zh: '点击画布中的任意工具节点、条件分支或开始/结束圆圈来查看并编辑其配置。',
    en: 'Click any tool, condition, start or end node on the canvas to view and edit its configuration.',
    fr: 'Cliquez sur un nœud pour éditer sa configuration.',
    es: 'Haz clic en un nodo para editar.',
    hi: 'संपादित करने के लिए किसी नोड पर क्लिक करें।',
    ar: 'انقر على أي عقدة للتحرير.',
  },
  stepName: { zh: '步骤名称', en: 'Step Name', fr: 'Nom', es: 'Nombre', hi: 'नाम', ar: 'الاسم' },
  stepDesc: { zh: '步骤描述', en: 'Description', fr: 'Description', es: 'Descripción', hi: 'विवरण', ar: 'الوصف' },
  params: { zh: '参数配置', en: 'Parameters', fr: 'Paramètres', es: 'Parámetros', hi: 'पैरामीटर', ar: 'المعاملات' },
  keys: { zh: '密钥 & API 凭据', en: 'API Keys & Secrets', fr: 'Clés API', es: 'Claves API', hi: 'API कुंजियाँ', ar: 'مفاتيح API' },
  testRun: { zh: '测试运行此步骤', en: 'Test Step', fr: 'Tester', es: 'Probar', hi: 'परीक्षण', ar: 'اختبار' },
  runCta: { zh: '▶ 运行测试', en: '▶ Run Test', fr: '▶ Tester', es: '▶ Probar', hi: '▶ चलाएं', ar: '▶ تشغيل' },
  copy: { zh: '复制步骤', en: 'Duplicate Step', fr: 'Dupliquer', es: 'Duplicar', hi: 'दोहराएं', ar: 'استنساخ' },
  del: { zh: '删除步骤', en: 'Delete Step', fr: 'Supprimer', es: 'Eliminar', hi: 'हटाएं', ar: 'حذف' },
  namePlaceholder: { zh: '例如：压缩图片并加水印', en: 'e.g. Compress + watermark image', fr: 'ex: Compresser image', es: 'ej: Comprimir imagen', hi: 'उदा: छवि को संपीड़ित करें', ar: 'مثل: ضغط الصورة' },
  descPlaceholder: {
    zh: '输入这一步骤的处理说明、输入输出、注意事项等...',
    en: 'Notes about this step: input, output, caveats...',
    fr: 'Notes sur cette étape...',
    es: 'Notas sobre el paso...',
    hi: 'इस चरण के बारे में नोट्स...',
    ar: 'ملاحظات حول الخطوة...',
  },
  apiKeyPlaceholder: { zh: 'sk-xxxxxxxxxxxx（仅本地浏览器保存）', en: 'sk-xxx (stored locally only)', fr: 'sk-xxx (local uniquement)', es: 'sk-xxx (solo local)', hi: 'sk-xxx (केवल स्थानीय)', ar: 'sk-xxx (محلي فقط)' },
  apiKeyLabel: { zh: '为此步骤绑定的 API Key', en: 'Bound API Key for this step', fr: 'Clé API liée', es: 'Clave vinculada', hi: 'बाउंड API कुंजी', ar: 'مفتاح مرتبط' },
  selectKey: { zh: '从密钥库选择', en: 'Select from Key Vault', fr: 'Depuis le coffre', es: 'Desde el almacén', hi: 'वॉल्ट से चुनें', ar: 'من المخزن' },
  saveBtn: { zh: '保存配置', en: 'Save Config', fr: 'Enregistrer', es: 'Guardar', hi: 'सहेजें', ar: 'حفظ' },
  urlLabel: { zh: '外链工具地址', en: 'External Tool URL', fr: 'URL externe', es: 'URL externa', hi: 'बाहरी URL', ar: 'رابط خارجي' },
  openUrl: { zh: '打开外链', en: 'Open URL', fr: 'Ouvrir', es: 'Abrir', hi: 'खोलें', ar: 'فتح' },
  successTag: { zh: '最近成功', en: 'Last Success', fr: 'Dernier Succès', es: 'Último Éxito', hi: 'अंतिम सफल', ar: 'آخر نجاح' },
  errorTag: { zh: '执行异常', en: 'Execution Error', fr: 'Erreur', es: 'Error', hi: 'त्रुटि', ar: 'خطأ' },
  testSuccess: { zh: '✓ 测试成功，用时 1.2s', en: '✓ Test passed in 1.2s', fr: '✓ Test OK (1.2s)', es: '✓ OK (1.2s)', hi: '✓ परीक्षण सफल (1.2s)', ar: '✓ نجاح (1.2 ثانية)' },
  testError: { zh: '✗ 参数校验失败：必填项为空', en: '✗ Validation failed: required field empty', fr: '✗ Champ requis vide', es: '✗ Campo obligatorio vacío', hi: '✗ आवश्यक खाली', ar: '✗ حقل مطلوب فارغ' },
  close: { zh: '收起面板', en: 'Collapse', fr: 'Réduire', es: 'Cerrar', hi: 'बंद करें', ar: 'إغلاق' },
  conditionTrue: { zh: '满足条件 (True)', en: 'If True', fr: 'Si Vrai', es: 'Si Verdadero', hi: 'सही होने पर', ar: 'إذا كان صحيحًا' },
  conditionFalse: { zh: '不满足 (False)', en: 'If False', fr: 'Si Faux', es: 'Si Falso', hi: 'गलत होने पर', ar: 'إذا كان خاطئًا' },
  conditionExpr: { zh: '条件表达式', en: 'Condition Expression', fr: 'Expression', es: 'Expresión', hi: 'अभिव्यक्ति', ar: 'التعبير' },
  condExprHint: {
    zh: '例如：{{step_1.size}} > 2MB 或 {{step_2.status}} == "success"',
    en: 'e.g. {{step_1.size}} > 2MB or {{step_2.status}} == "success"',
    fr: 'ex: {{step_1.size}} > 2Mo',
    es: 'ej: {{step_1.size}} > 2MB',
    hi: 'जैसे: {{step_1.size}} > 2MB',
    ar: 'مثل: {{step_1.size}} > 2MB',
  },
  paramInputHint: { zh: '支持变量模板：{{step_1.output}}', en: 'Vars supported: {{step_1.output}}', fr: 'Vars: {{step_1.output}}', es: 'Vars: {{step_1.output}}', hi: 'Vars: {{step_1.output}}', ar: 'متغيرات: {{step_1.output}}' },
  noData: { zh: '暂无配置数据', en: 'No configuration yet', fr: 'Pas de config', es: 'Sin configuración', hi: 'कोई कॉन्फ़िग नहीं', ar: 'لا يوجد تكوين' },
};

type LocaleKey = keyof typeof I18N.title;
const pick = (l: string, m: Record<string, string>) => m[l as LocaleKey] || m.en;

/* ========== Props ========== */
export interface ConfigDrawerProps {
  locale?: string;
  open?: boolean;
  onClose?: () => void;
  selectedNode?: WorkflowNodeData | null;
  onUpdateNode?: (patch: Partial<WorkflowNodeData>) => void;
  onCopy?: () => void;
  onDelete?: () => void;
  onRunTest?: () => void;
  testState?: 'idle' | 'running' | 'success' | 'error';
}

/**
 * 右侧配置抽屉面板（复刻 Zapier Step 配置逻辑）
 * - 节点命名 / 参数表单 / 密钥绑定 / 测试运行 / 复制删除
 * - 圆角柔和，内部分割线纤细
 * - 纯本地state，不调用后端
 */
export default function ConfigDrawer({
  locale = 'en',
  open = true,
  onClose,
  selectedNode,
  onUpdateNode,
  onCopy,
  onDelete,
  onRunTest,
  testState = 'idle',
}: ConfigDrawerProps) {
  /* — 空接口预留：保存节点配置到后端 — */
  const _apiSaveNode = async () => {
    // TODO: 对接后端持久化接口
  };

  /* — 未选中节点：空状态引导 — */
  if (!open) return null;

  return (
    <aside
      className={[
        'h-full w-[320px] md:w-[360px] flex-shrink-0',
        'bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950',
        'border-l border-gray-200 dark:border-gray-800',
        'flex flex-col',
        'shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.08)]',
      ].join(' ')}
    >
      {/* — 顶部蓝紫窄光带 + 标题栏 — */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 opacity-80" />
        <header className="flex items-center gap-2 px-4 h-16 border-b border-gray-100 dark:border-gray-800/70">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
            <Settings2 className="w-[18px] h-[18px]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">
              {pick(locale, I18N.title)}
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
              {selectedNode?.title || pick(locale, I18N.noSelect)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
            title={pick(locale, I18N.close)}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </header>
      </div>

      {/* — 内容区 — */}
      <div className="flex-1 overflow-y-auto">
        {!selectedNode ? (
          <EmptySelectionView locale={locale} />
        ) : (
          <div className="p-4 space-y-5">
            {/* — 基本信息 — */}
            <Section
              icon={Tag}
              title={pick(locale, I18N.stepName)}
              locale={locale}
              gradient
            >
              <input
                type="text"
                value={selectedNode.title}
                onChange={(e) => onUpdateNode?.({ title: e.target.value })}
                placeholder={pick(locale, I18N.namePlaceholder)}
                className={INPUT_CLS}
              />
            </Section>

            <Section
              icon={Settings2}
              title={pick(locale, I18N.stepDesc)}
              locale={locale}
            >
              <textarea
                rows={3}
                value={selectedNode.subtitle || ''}
                onChange={(e) => onUpdateNode?.({ subtitle: e.target.value })}
                placeholder={pick(locale, I18N.descPlaceholder)}
                className={`${INPUT_CLS} resize-none`}
              />
            </Section>

            {/* — 条件分支独有：条件表达式 — */}
            {selectedNode.kind === 'condition' && (
              <Section
                icon={AlertTriangle}
                title={pick(locale, I18N.conditionExpr)}
                locale={locale}
                hint={pick(locale, I18N.condExprHint)}
              >
                <input
                  type="text"
                  defaultValue="{{step_1.status}} == success"
                  className={INPUT_CLS}
                />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <PillBtn color="green" locale={locale} textKey="conditionTrue" />
                  <PillBtn color="rose" locale={locale} textKey="conditionFalse" />
                </div>
              </Section>
            )}

            {/* — Tool独有：外链URL — */}
            {selectedNode.kind === 'tool' && (
              <Section
                icon={ExternalLink}
                title={pick(locale, I18N.urlLabel)}
                locale={locale}
              >
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    defaultValue="https://example.com/tool/compress"
                    className={`${INPUT_CLS} flex-1 bg-gray-50 dark:bg-gray-800/50 text-gray-500`}
                  />
                  <button
                    className="px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                    title={pick(locale, I18N.openUrl)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Section>
            )}

            {/* — 参数表单 — */}
            <Section
              icon={Settings2}
              title={pick(locale, I18N.params)}
              locale={locale}
              hint={pick(locale, I18N.paramInputHint)}
            >
              <ParamField locale={locale} label="输入图片 URL" defaultValue="{{step_1.url}}" />
              <div className="h-2" />
              <ParamField locale={locale} label="压缩质量" defaultValue="80" />
              <div className="h-2" />
              <ParamField locale={locale} label="水印文字" defaultValue="© Korelyy" />
            </Section>

            {/* — 密钥绑定 — */}
            <Section
              icon={KeyRound}
              title={pick(locale, I18N.keys)}
              locale={locale}
            >
              <label className="block text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-1.5">
                {pick(locale, I18N.apiKeyLabel)}
              </label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="password"
                  placeholder={pick(locale, I18N.apiKeyPlaceholder)}
                  className={`${INPUT_CLS} flex-1 font-mono text-[11px] tracking-tight`}
                />
                <button className="px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-[11px] font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors flex-shrink-0 whitespace-nowrap">
                  {pick(locale, I18N.selectKey)}
                </button>
              </div>
            </Section>

            {/* — 测试运行 — */}
            <Section
              icon={PlayCircle}
              title={pick(locale, I18N.testRun)}
              locale={locale}
            >
              <button
                onClick={onRunTest}
                disabled={testState === 'running'}
                className={[
                  'w-full h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all',
                  testState === 'running'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                    : 'bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99]',
                ].join(' ')}
              >
                {testState === 'running' ? (
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <PlayCircle className="w-4 h-4" strokeWidth={2} />
                )}
                {pick(locale, I18N.runCta)}
              </button>

              {testState === 'success' && (
                <TestResultChip
                  locale={locale}
                  type="success"
                  textKey="testSuccess"
                />
              )}
              {testState === 'error' && (
                <TestResultChip locale={locale} type="error" textKey="testError" />
              )}
            </Section>
          </div>
        )}
      </div>

      {/* — 底部操作区：复制 / 删除 / 保存 — */}
      {selectedNode && (
        <footer className="p-3 border-t border-gray-100 dark:border-gray-800/70 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onCopy}
              className="h-9 rounded-xl flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {pick(locale, I18N.copy)}
            </button>
            <button
              onClick={onDelete}
              className="h-9 rounded-xl flex items-center justify-center gap-1.5 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {pick(locale, I18N.del)}
            </button>
          </div>
          <button
            onClick={() => onUpdateNode?.({})}
            className="w-full h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Save className="w-4 h-4" strokeWidth={2} />
            {pick(locale, I18N.saveBtn)}
          </button>
        </footer>
      )}
    </aside>
  );
}

/* ========== 子组件：Section 分组 ========== */
function Section({
  icon: Icon,
  title,
  locale: _locale,
  hint,
  gradient,
  children,
}: {
  icon: LucideIcon;
  title: string;
  locale: string;
  hint?: string;
  gradient?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className={[
            'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
            gradient
              ? 'bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-violet-500/15 text-indigo-600 dark:text-indigo-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
          ].join(' ')}
        >
          <Icon className="w-[15px] h-[15px]" strokeWidth={1.9} />
        </div>
        <div className="text-[13px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {title}
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 ml-auto" />
      </div>
      <div className="pl-9">{children}</div>
      {hint && (
        <div className="pl-9 mt-1.5 text-[10px] text-gray-400 dark:text-gray-500 leading-snug">
          {hint}
        </div>
      )}
    </div>
  );
}

/* ========== 子组件：参数输入框 ========== */
function ParamField({
  locale: _locale,
  label,
  defaultValue,
}: {
  locale: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-1.5">
        {label}
      </label>
      <input
        type="text"
        defaultValue={defaultValue}
        className={INPUT_CLS}
      />
    </div>
  );
}

/* ========== 子组件：空选中态引导 ========== */
function EmptySelectionView({ locale }: { locale: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-12">
      <div className="relative w-20 h-20 mb-5">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/8 via-blue-500/8 to-violet-500/8 animate-pulse" />
        <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-violet-500/15 flex items-center justify-center">
          <Settings2 className="w-8 h-8 text-indigo-500 dark:text-indigo-400" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 mb-2 text-center leading-snug">
        {pick(locale, I18N.noSelect)}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed max-w-[260px]">
        {pick(locale, I18N.noSelectDesc)}
      </p>
      <div className="mt-6 w-full space-y-2">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow w="3/4" />
      </div>
    </div>
  );
}

/* ========== 样式常量：input-base 等效 Tailwind 组合 ========== */
const INPUT_CLS = [
  'w-full px-3 py-2 text-sm rounded-xl',
  'bg-white dark:bg-gray-900',
  'border border-gray-200 dark:border-gray-700/80',
  'text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500/60',
  'transition-shadow transition-colors',
].join(' ');

/* ========== 子组件：状态 Pill 按钮（条件分支） ========== */
function PillBtn({
  color,
  locale,
  textKey,
}: {
  color: 'green' | 'rose';
  locale: string;
  textKey: keyof typeof I18N;
}) {
  const green =
    'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50';
  const rose =
    'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50';
  return (
    <div
      className={[
        'h-8 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1.5 px-2',
        color === 'green' ? green : rose,
      ].join(' ')}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          color === 'green' ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />
      {pick(locale, I18N[textKey] as Record<string, string>)}
    </div>
  );
}

/* ========== 子组件：测试结果 chip ========== */
function TestResultChip({
  locale,
  type,
  textKey,
}: {
  locale: string;
  type: 'success' | 'error';
  textKey: keyof typeof I18N;
}) {
  const cls =
    type === 'success'
      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50'
      : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50';
  const Icon = type === 'success' ? CheckCircle2 : AlertTriangle;
  return (
    <div
      className={`mt-3 h-9 px-3 rounded-xl border flex items-center gap-2 text-xs font-medium ${cls}`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="truncate">{pick(locale, I18N[textKey] as Record<string, string>)}</span>
    </div>
  );
}

/* ========== 子组件：空态骨架行 ========== */
function SkeletonRow({ w = 'full' }: { w?: string }) {
  const widthCls = w === '3/4' ? 'w-3/4' : 'w-full';
  return (
    <div className={`${widthCls} h-9 rounded-xl bg-gray-100 dark:bg-gray-800/70 animate-pulse`} />
  );
}
