'use client';

import { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Shield,
  Clock,
  Zap,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  X,
  Settings,
  Lock,
  Activity,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from 'lucide-react';
import { usePreferencesStore, type ApiKey } from '@/stores/preferences';

export default function ApiKeysManager({ locale = 'zh' }: { locale?: string }) {
  const { apiKeys, addApiKey, removeApiKey, updateApiKey, revokeApiKey } = usePreferencesStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<ApiKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const key = addApiKey(newKeyName.trim());
    setCreatedKey(key);
    setNewKeyName('');
  };

  const handleCopyKey = async (keyValue: string, id: string) => {
    try {
      await navigator.clipboard.writeText(keyValue);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = keyValue;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartEdit = (key: ApiKey) => {
    setEditingKey(key.id);
    setEditName(key.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      updateApiKey(id, { name: editName.trim() });
    }
    setEditingKey(null);
    setEditName('');
  };

  const handleDelete = (id: string) => {
    removeApiKey(id);
    setDeleteConfirmId(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const activeKeys = apiKeys.filter((k) => k.status === 'active');
  const revokedKeys = apiKeys.filter((k) => k.status === 'revoked');
  const totalCalls = apiKeys.reduce((sum, k) => sum + k.totalCalls, 0);

  const t = {
    title: locale === 'zh' ? 'API 密钥管理' : 'API Keys',
    subtitle: locale === 'zh' ? '安全管理您的 API 密钥，本地加密存储，永不外泄' : 'Securely manage your API keys, encrypted local storage',
    createKey: locale === 'zh' ? '创建密钥' : 'Create Key',
    totalKeys: locale === 'zh' ? '活跃密钥' : 'Active Keys',
    totalCalls: locale === 'zh' ? '总调用次数' : 'Total Calls',
    security: locale === 'zh' ? '安全等级' : 'Security',
    highSecurity: locale === 'zh' ? '本地加密' : 'Encrypted',
    keyName: locale === 'zh' ? '密钥名称' : 'Key Name',
    enterKeyName: locale === 'zh' ? '输入密钥名称...' : 'Enter key name...',
    cancel: locale === 'zh' ? '取消' : 'Cancel',
    create: locale === 'zh' ? '创建' : 'Create',
    createdSuccess: locale === 'zh' ? '密钥创建成功！请立即复制保存，关闭后将无法再次查看完整密钥。' : 'Key created successfully! Copy it now - you won\'t be able to see it again.',
    copy: locale === 'zh' ? '复制' : 'Copy',
    copied: locale === 'zh' ? '已复制' : 'Copied',
    revoke: locale === 'zh' ? '撤销' : 'Revoke',
    delete: locale === 'zh' ? '删除' : 'Delete',
    edit: locale === 'zh' ? '编辑' : 'Edit',
    save: locale === 'zh' ? '保存' : 'Save',
    active: locale === 'zh' ? '活跃' : 'Active',
    revoked: locale === 'zh' ? '已撤销' : 'Revoked',
    lastUsed: locale === 'zh' ? '最后使用' : 'Last Used',
    never: locale === 'zh' ? '从未使用' : 'Never used',
    createdAt: locale === 'zh' ? '创建时间' : 'Created',
    calls: locale === 'zh' ? '调用次数' : 'Calls',
    scopes: locale === 'zh' ? '权限范围' : 'Scopes',
    usageStats: locale === 'zh' ? '使用统计' : 'Usage Stats',
    noKeys: locale === 'zh' ? '还没有 API 密钥' : 'No API keys yet',
    noKeysDesc: locale === 'zh' ? '创建您的第一个 API 密钥，开始安全地访问工具 API' : 'Create your first API key to start accessing tools securely',
    deleteConfirm: locale === 'zh' ? '确定要删除这个密钥吗？此操作不可恢复。' : 'Are you sure you want to delete this key? This cannot be undone.',
    revokeConfirm: locale === 'zh' ? '确定要撤销这个密钥吗？撤销后将无法使用。' : 'Are you sure you want to revoke this key? It will no longer work.',
    confirmDelete: locale === 'zh' ? '确认删除' : 'Confirm Delete',
    confirmRevoke: locale === 'zh' ? '确认撤销' : 'Confirm Revoke',
    securityTip: locale === 'zh' ? '安全提示' : 'Security Tip',
    securityTipText: locale === 'zh' ? '您的 API 密钥使用 AES-256 加密存储在本地浏览器中，我们的服务器无法访问。请勿在公共场合展示您的密钥。' : 'Your API keys are stored locally with AES-256 encryption. Our servers cannot access them. Never share your keys publicly.',
  };

  return (
    <div className='flex-1 min-w-0'>
      <div className='flex items-center gap-4 mb-4'>
        <a href={`/${locale}`} className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
          <ArrowLeft className='h-5 w-5' />
          <span className='text-sm font-medium'>{locale === 'zh' ? '返回首页' : 'Back'}</span>
        </a>
      </div>

      <div className='mb-4 sm:mb-6'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'>
            <Shield className='w-6 h-6 sm:w-7 sm:h-7' />
          </div>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100'>
              {t.title}
            </h1>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5 sm:mb-6'>
        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center'>
              <Key className='w-4 h-4 text-green-600 dark:text-green-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {activeKeys.length}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {t.totalKeys}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center'>
              <Zap className='w-4 h-4 text-blue-600 dark:text-blue-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {totalCalls}
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {t.totalCalls}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center'>
              <Lock className='w-4 h-4 text-purple-600 dark:text-purple-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            AES-256
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {t.highSecurity}
          </p>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center'>
              <Shield className='w-4 h-4 text-orange-600 dark:text-orange-400' />
            </div>
          </div>
          <p className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>
            100%
          </p>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {locale === 'zh' ? '本地存储' : 'Local Only'}
          </p>
        </div>
      </div>

      <div className='bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/30 rounded-xl p-4 mb-5 sm:mb-6'>
        <div className='flex items-start gap-3'>
          <Shield className='w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5' />
          <div>
            <p className='font-medium text-green-800 dark:text-green-300 text-sm sm:text-base mb-1'>
              {t.securityTip}
            </p>
            <p className='text-sm text-green-700 dark:text-green-400/80'>
              {t.securityTipText}
            </p>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between mb-4 sm:mb-5 gap-3 flex-wrap'>
        <h2 className='text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
          <Key className='w-5 h-5 text-primary-500' />
          {locale === 'zh' ? '我的密钥' : 'My Keys'}
        </h2>
        <button
          onClick={() => {
            setShowCreateModal(true);
            setCreatedKey(null);
            setNewKeyName('');
          }}
          className='inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm sm:text-base rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all'
        >
          <Plus className='w-5 h-5' />
          {t.createKey}
        </button>
      </div>

      {apiKeys.length === 0 ? (
        <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center'>
          <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center'>
            <Key className='w-8 h-8 text-gray-400' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            {t.noKeys}
          </h3>
          <p className='text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto'>
            {t.noKeysDesc}
          </p>
          <button
            onClick={() => {
              setShowCreateModal(true);
              setCreatedKey(null);
              setNewKeyName('');
            }}
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all'
          >
            <Plus className='w-5 h-5' />
            {t.createKey}
          </button>
        </div>
      ) : (
        <div className='space-y-3'>
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border transition-all ${
                key.status === 'revoked'
                  ? 'border-gray-200 dark:border-gray-700 opacity-60'
                  : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md'
              }`}
            >
              <div className='p-4 sm:p-5'>
                <div className='flex items-start justify-between gap-3 mb-3'>
                  <div className='flex items-center gap-3 min-w-0 flex-1'>
                    <div className={`p-2 rounded-xl flex-shrink-0 ${
                      key.status === 'revoked'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    }`}>
                      <Key className='w-5 h-5' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      {editingKey === key.id ? (
                        <div className='flex items-center gap-2'>
                          <input
                            type='text'
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className='flex-1 px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500'
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(key.id);
                              if (e.key === 'Escape') setEditingKey(null);
                            }}
                          />
                          <button
                            onClick={() => handleSaveEdit(key.id)}
                            className='p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors'
                          >
                            <Check className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className='p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className='font-semibold text-gray-900 dark:text-gray-100 truncate flex items-center gap-2'>
                            {key.name}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              key.status === 'active'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {key.status === 'active' ? t.active : t.revoked}
                            </span>
                          </h3>
                          <div className='flex items-center gap-2 mt-1'>
                            <code className='text-xs text-gray-500 dark:text-gray-400 font-mono flex-1 min-w-0 truncate'>
                              {visibleKeys[key.id]
                                ? key.key
                                : `${key.key.slice(0, 7)}••••••••••${key.key.slice(-4)}`}
                            </code>
                            <button
                              onClick={() => toggleKeyVisibility(key.id)}
                              className='p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0'
                              title={visibleKeys[key.id] ? (locale === 'zh' ? '隐藏' : 'Hide') : (locale === 'zh' ? '显示' : 'Show')}
                            >
                              {visibleKeys[key.id] ? <EyeOff className='w-3.5 h-3.5' /> : <Eye className='w-3.5 h-3.5' />}
                            </button>
                            <button
                              onClick={() => handleCopyKey(key.key, key.id)}
                              className='p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex-shrink-0'
                              title={t.copy}
                            >
                              {copiedId === key.id ? (
                                <Check className='w-3.5 h-3.5 text-green-500' />
                              ) : (
                                <Copy className='w-3.5 h-3.5' />
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-1 flex-shrink-0'>
                    {key.status === 'active' && editingKey !== key.id && (
                      <>
                        <button
                          onClick={() => handleStartEdit(key)}
                          className='p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors'
                          title={t.edit}
                        >
                          <Settings className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => revokeApiKey(key.id)}
                          className='p-1.5 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors'
                          title={t.revoke}
                        >
                          <AlertTriangle className='w-4 h-4' />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setDeleteConfirmId(key.id)}
                      className='p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'
                      title={t.delete}
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm'>
                  <div>
                    <p className='text-gray-400 dark:text-gray-500 mb-0.5'>{t.createdAt}</p>
                    <p className='text-gray-700 dark:text-gray-300 font-medium'>{formatDate(key.createdAt)}</p>
                  </div>
                  <div>
                    <p className='text-gray-400 dark:text-gray-500 mb-0.5'>{t.lastUsed}</p>
                    <p className='text-gray-700 dark:text-gray-300 font-medium'>
                      {key.lastUsedAt ? formatDate(key.lastUsedAt) : t.never}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-400 dark:text-gray-500 mb-0.5'>{t.calls}</p>
                    <p className='text-gray-700 dark:text-gray-300 font-medium'>{key.totalCalls}</p>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedKey(expandedKey === key.id ? null : key.id)}
                  className='w-full mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
                >
                  <Activity className='w-3.5 h-3.5' />
                  {t.usageStats}
                  {expandedKey === key.id ? <ChevronUp className='w-3.5 h-3.5' /> : <ChevronDown className='w-3.5 h-3.5' />}
                </button>

                {expandedKey === key.id && (
                  <div className='mt-3 pt-3 border-t border-gray-100 dark:border-gray-700'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-xs font-medium text-gray-600 dark:text-gray-400'>
                        {locale === 'zh' ? '最近 7 天调用趋势' : 'Last 7 days trend'}
                      </span>
                    </div>
                    <div className='flex items-end gap-1 h-20'>
                      {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (6 - i));
                        const dateStr = date.toISOString().split('T')[0];
                        const dayUsage = key.usage.find((u) => u.date === dateStr);
                        const calls = dayUsage?.calls || 0;
                        const maxCalls = Math.max(...key.usage.map((u) => u.calls), 1);
                        const height = (calls / maxCalls) * 100;
                        return (
                          <div key={i} className='flex-1 flex flex-col items-center gap-1'>
                            <div className='w-full bg-gray-100 dark:bg-gray-700 rounded-t-sm flex-1 flex items-end'>
                              <div
                                className='w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-sm transition-all'
                                style={{ height: `${Math.max(height, 4)}%` }}
                              />
                            </div>
                            <span className='text-[10px] text-gray-400'>
                              {date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'short' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className='mt-4'>
                      <p className='text-xs font-medium text-gray-600 dark:text-gray-400 mb-2'>
                        {t.scopes}
                      </p>
                      <div className='flex flex-wrap gap-1.5'>
                        {key.scopes.map((scope) => (
                          <span
                            key={scope}
                            className='text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => {
          if (!createdKey) {
            setShowCreateModal(false);
          }
        }}>
          <div
            className='w-full sm:max-w-md bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
                {createdKey ? (locale === 'zh' ? '密钥已创建' : 'Key Created') : t.createKey}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-4 overflow-y-auto flex-1'>
              {createdKey ? (
                <div className='text-center'>
                  <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25'>
                    <Check className='w-8 h-8 text-white' />
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                    {t.createdSuccess}
                  </p>
                  <div className='bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4 text-left'>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>{createdKey.name}</p>
                    <code className='text-sm font-mono text-gray-900 dark:text-gray-100 break-all'>
                      {createdKey.key}
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopyKey(createdKey.key, createdKey.id)}
                    className='w-full py-2.5 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2'
                  >
                    {copiedId === createdKey.id ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                    {copiedId === createdKey.id ? t.copied : t.copy}
                  </button>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                      {t.keyName} *
                    </label>
                    <input
                      type='text'
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className='w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all'
                      placeholder={t.enterKeyName}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newKeyName.trim()) {
                          handleCreateKey();
                        }
                      }}
                    />
                  </div>

                  <div className='bg-green-50 dark:bg-green-900/20 rounded-xl p-4'>
                    <div className='flex items-start gap-3'>
                      <Shield className='w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5' />
                      <div>
                        <p className='font-medium text-green-800 dark:text-green-300 text-sm mb-1'>
                          {t.securityTip}
                        </p>
                        <p className='text-xs text-green-700 dark:text-green-400/80'>
                          {t.securityTipText}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2'>
              {!createdKey && (
                <>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className='flex-1 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleCreateKey}
                    disabled={!newKeyName.trim()}
                    className='flex-1 py-2.5 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  >
                    <Plus className='w-4 h-4' />
                    {t.create}
                  </button>
                </>
              )}
              {createdKey && (
                <button
                  onClick={() => setShowCreateModal(false)}
                  className='flex-1 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                >
                  {locale === 'zh' ? '完成' : 'Done'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4' onClick={() => setDeleteConfirmId(null)}>
          <div
            className='w-full sm:max-w-sm bg-white dark:bg-gray-800 sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-6 text-center'>
              <div className='w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center'>
                <AlertTriangle className='w-7 h-7 text-red-500' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                {t.confirmDelete}
              </h3>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {t.deleteConfirm}
              </p>
            </div>
            <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2'>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className='flex-1 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              >
                {t.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className='flex-1 py-2.5 text-sm font-medium bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25'
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
