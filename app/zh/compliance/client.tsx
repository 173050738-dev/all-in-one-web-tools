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
      <div className="text-center mb-5 sm:mb-6 lg:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mb-3 sm:mb-4">
          <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
          {t('title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t('description')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6 lg:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 dark:text-gray-400">{t('verified-tools')}</span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.verifiedCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 sm:gap-2.5 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 dark:text-gray-400">{t('pending-tools')}</span>
          </div>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-400 dark:text-gray-500">{stats.pendingCount}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-5 sm:mb-6 lg:mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSelectedTab('all')}
            className={`flex-1 px-2 sm:px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-medium transition-colors ${selectedTab === 'all' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {t('all-tools')}
          </button>
          <button
            onClick={() => setSelectedTab('verified')}
            className={`flex-1 px-2 sm:px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-medium transition-colors ${selectedTab === 'verified' ? 'bg-emerald-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {t('verified')}
          </button>
          <button
            onClick={() => setSelectedTab('pending')}
            className={`flex-1 px-2 sm:px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-medium transition-colors ${selectedTab === 'pending' ? 'bg-amber-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            {t('pending')}
          </button>
        </div>

        <div className="p-3 sm:p-4 max-h-[600px] overflow-y-auto">
          {!bundle && (
            <div className="space-y-1.5 sm:space-y-2" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-full flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-lg animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-600" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="h-3.5 sm:h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-2.5 sm:h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" />
                  </div>
                  <div className="h-5 sm:h-6 w-12 sm:w-14 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          )}
          {bundle && (
            <div className="space-y-1.5 sm:space-y-2">
              {filteredTools.map((tool) => {
                const level = bundle.computeComplianceLevel(tool);
                const details = getComplianceDetails(tool.externalUrl || '', tool.name);
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-lg text-left transition-colors ${selectedTool === tool.id ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${level === 'red' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[11px] sm:text-xs text-gray-900 dark:text-gray-100 truncate">{tool.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">{details.description}</p>
                    </div>
                    <span className={`text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${level === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                {selectedToolData.complianceLevel === 'red' ? (
                  <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                ) : (
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-[11px] sm:text-xs text-gray-900 dark:text-gray-100">{selectedToolData.name}</h3>
                <p className={`text-[10px] sm:text-[11px] ${selectedToolData.complianceLevel === 'red' ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {selectedToolData.complianceLevel === 'red' ? t('pending') : t('verified')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTool(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
              <h4 className="font-medium text-[11px] sm:text-xs text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400" />
                {t('compliance-details')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${selectedToolData.complianceDetails.copyright ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${selectedToolData.complianceDetails.copyright ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-medium text-gray-900 dark:text-gray-100">{t('copyright')}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{selectedToolData.complianceDetails.copyright ? t('verified-status') : t('not-verified')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${selectedToolData.complianceDetails.privacyPolicy ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${selectedToolData.complianceDetails.privacyPolicy ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-medium text-gray-900 dark:text-gray-100">{t('privacy-policy')}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{selectedToolData.complianceDetails.privacyPolicy ? t('verified-status') : t('not-verified')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-medium text-gray-900 dark:text-gray-100">{t('verification-date')}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">{selectedToolData.complianceDetails.verificationDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedToolData.complianceDetails.networkRequirement && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[10px] sm:text-[11px] font-medium text-amber-800 dark:text-amber-300 mb-0.5 sm:mb-1">{t('network-note')}</h5>
                    <p className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">{selectedToolData.complianceDetails.networkRequirement}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedToolData.externalUrl && (
              <div className="flex items-center gap-2.5 sm:gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" />
                <a
                  href={selectedToolData.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] sm:text-xs text-primary-600 dark:text-primary-400 hover:underline truncate flex-1"
                >
                  {selectedToolData.externalUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4 sm:sm:p-6">
        <h3 className="font-bold text-[11px] sm:text-xs text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">{t('policy-title')}</h3>
        <div className="space-y-2 sm:space-y-3 text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          <p>{t('policy-p1')}</p>
          <p>{t('policy-p2')}</p>
          <p>{t('policy-p3')}</p>
        </div>
      </div>
    </div>
  );
}
