'use client';

import { useTranslations } from 'next-intl';
import { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Lock, FileCheck, Globe, Calendar, CheckCircle, Info, Clock } from 'lucide-react';
import type { Tool, ComplianceLevel } from '@/data/tools';
import { STATIC_COMPLIANCE_STATS } from '@/data/_static-counts.generated';
import { getComplianceDetails } from '@/data/compliance';

type FullBundle = {
  tools: Tool[];
  computeComplianceLevel: (t: Tool) => ComplianceLevel;
};

export default function CompliancePage() {
  const t = useTranslations('compliance');
  const [selectedTab, setSelectedTab] = useState<'all' | 'verified' | 'pending'>('all');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [bundle, setBundle] = useState<FullBundle | null>(null);

  // 懒加载：水合完成后再 import('@/data/tools')，避免 202KB next_f 数据内联到 HTML
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mod = await import('@/data/tools');
      if (cancelled) return;
      setBundle({
        tools: (mod.tools || []) as Tool[],
        computeComplianceLevel: mod.computeComplianceLevel,
      });
    })();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    if (bundle) {
      const verifiedCount = bundle.tools.filter(t => bundle.computeComplianceLevel(t) !== 'red').length;
      const pendingCount = bundle.tools.filter(t => bundle.computeComplianceLevel(t) === 'red').length;
      const totalCount = bundle.tools.length;
      return { verifiedCount, pendingCount, totalCount };
    }
    // 兜底：预计算静态常量（构建时生成，≈1054 条真实工具统计），首屏不依赖 tools 全量
    return STATIC_COMPLIANCE_STATS;
  }, [bundle]);

  const filteredTools = useMemo(() => {
    if (!bundle) return [] as Tool[];
    if (selectedTab === 'all') return bundle.tools;
    if (selectedTab === 'verified') return bundle.tools.filter(t => bundle.computeComplianceLevel(t) !== 'red');
    return bundle.tools.filter(t => bundle.computeComplianceLevel(t) === 'red');
  }, [selectedTab, bundle]);

  const selectedToolData = useMemo(() => {
    if (!selectedTool || !bundle) return null;
    const tool = bundle.tools.find(t => t.id === selectedTool);
    if (!tool) return null;
    return {
      ...tool,
      complianceLevel: bundle.computeComplianceLevel(tool),
      complianceDetails: getComplianceDetails(tool.externalUrl || '', tool.name),
    };
  }, [selectedTool, bundle]);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
          {t('title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{t('verified-tools')}</span>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">{stats.verifiedCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{t('pending-tools')}</span>
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-400 dark:text-gray-500">{stats.pendingCount}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 sm:mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedTab('all')}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${selectedTab === 'all' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {t('all-tools')}
          </button>
          <button
            onClick={() => setSelectedTab('verified')}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${selectedTab === 'verified' ? 'bg-emerald-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {t('verified')}
          </button>
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${selectedTab === 'pending' ? 'bg-amber-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {t('pending')}
          </button>
        </div>

        <div className="p-4 max-h-[600px] overflow-y-auto">
          {/* 骨架屏：水合前不依赖 tools 全量，用户看到整齐的 shimmer，不阻塞首屏 HTML 膨胀 */}
          {!bundle && (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-full flex items-center gap-3 p-3 rounded-lg animate-pulse" aria-hidden="true">
                  <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-600" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" />
                  </div>
                  <div className="h-5 w-14 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          )}
          {bundle && (
            <div className="space-y-2">
              {filteredTools.map((tool) => {
                const level = bundle.computeComplianceLevel(tool);
                const details = getComplianceDetails(tool.externalUrl || '', tool.name);
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${selectedTool === tool.id ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${level === 'red' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">{((tool as any).nameEn ?? "") || tool.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{details.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${level === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                      {level === 'red' ? t('pending') : t('verified')}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedToolData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                {selectedToolData.complianceLevel === 'red' ? (
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{((selectedToolData as any).nameEn ?? "") || selectedToolData.name}</h3>
                <p className={`text-sm ${selectedToolData.complianceLevel === 'red' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {selectedToolData.complianceLevel === 'red' ? t('pending') : t('verified')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTool(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                {t('compliance-details')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-8 h-8 rounded-lg ${selectedToolData.complianceDetails.copyright ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className={`w-4 h-4 ${selectedToolData.complianceDetails.copyright ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{t('copyright')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedToolData.complianceDetails.copyright ? t('verified-status') : t('not-verified')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-8 h-8 rounded-lg ${selectedToolData.complianceDetails.privacyPolicy ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className={`w-4 h-4 ${selectedToolData.complianceDetails.privacyPolicy ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{t('privacy-policy')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedToolData.complianceDetails.privacyPolicy ? t('verified-status') : t('not-verified')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{t('verification-date')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedToolData.complianceDetails.verificationDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedToolData.complianceDetails.networkRequirement && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] sm:text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">{t('network-note')}</h5>
                    <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-400">{selectedToolData.complianceDetails.networkRequirement}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedToolData.externalUrl && (
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <a
                  href={selectedToolData.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-primary-600 dark:text-primary-400 hover:underline truncate flex-1"
                >
                  {selectedToolData.externalUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3">{t('policy-title')}</h3>
        <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          <p>{t('policy-p1')}</p>
          <p>{t('policy-p2')}</p>
          <p>{t('policy-p3')}</p>
        </div>
      </div>
    </div>
  );
}
