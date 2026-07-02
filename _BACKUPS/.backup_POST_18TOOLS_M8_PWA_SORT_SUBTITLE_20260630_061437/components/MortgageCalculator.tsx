'use client';

import { useState, useMemo } from 'react';
import {
  Home,
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MortgageCalculatorProps {
  locale?: string;
}

type LoanType = 'equal-payment' | 'equal-principal';

export default function MortgageCalculator({ locale = 'zh' }: MortgageCalculatorProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'action.showMore': '展开全部明细',
      'action.showLess': '收起明细',
      'action.save': '保存',
      'action.cancel': '取消',
      'action.confirm': '确认',
      'title': '房贷计算器',
      'subtitle': '精准计算房贷月供，支持等额本息和等额本金两种还款方式',
      'loanAmount': '贷款金额',
      'wan': '万元',
      'yuan': '元',
      'unit.wan': '万',
      'unit.yuan': '元',
      'unit.nian': '年',
      'loanYears': '贷款年限',
      'nian': '年',
      'interestRate': '年利率',
      'percent': '%',
      'loanType': '还款方式',
      'equalPayment': '等额本息',
      'equalPrincipal': '等额本金',
      'monthlyPayment': '每月还款',
      'firstMonth': '首月还款',
      'lastMonth': '末月还款',
      'totalPayment': '还款总额',
      'totalInterest': '支付利息',
      'paymentSchedule': '还款明细',
      'month': '期数',
      'monthlyPaymentCol': '月供',
      'principal': '本金',
      'interest': '利息',
      'remaining': '剩余本金',
      'decreasing': '每月递减，末月约 ',
      'principalLabel': '本金',
      'interestLabel': '利息',
      'periodPrefix': '第',
      'periodSuffix': '期',
      'tip': '💡 提示：等额本息每月还款金额相同，前期利息占比高；等额本金每月本金相同，总利息较少，但前期还款压力大。',
      'features': '功能特点',
      'f1': '支持等额本息和等额本金',
      'f2': '实时计算月供和总利息',
      'f3': '完整还款明细列表',
      'f4': '可视化对比分析',
      'f5': '完全免费无广告',
      'f6': '数据本地计算，隐私安全',
    },
    en: {
      'action.showMore': 'Show all details',
      'action.showLess': 'Hide details',
      'action.save': 'Save',
      'action.cancel': 'Cancel',
      'action.confirm': 'Confirm',
      'title': 'Mortgage Calculator',
      'subtitle': 'Calculate your monthly mortgage payment with ease.',
      'loanAmount': 'Loan Amount',
      'wan': ' (10k)',
      'yuan': '',
      'unit.wan': '',
      'unit.yuan': '',
      'unit.nian': '',
      'loanYears': 'Loan Term',
      'nian': ' years',
      'interestRate': 'Interest Rate',
      'percent': '%',
      'loanType': 'Repayment Type',
      'equalPayment': 'Equal Payment',
      'equalPrincipal': 'Equal Principal',
      'monthlyPayment': 'Monthly Payment',
      'firstMonth': 'First Month',
      'lastMonth': 'Last Month',
      'totalPayment': 'Total Payment',
      'totalInterest': 'Total Interest',
      'paymentSchedule': 'Payment Schedule',
      'month': 'Month',
      'monthlyPaymentCol': 'Payment',
      'principal': 'Principal',
      'interest': 'Interest',
      'remaining': 'Remaining',
      'decreasing': 'Decreasing monthly, last month ~ ',
      'principalLabel': 'Principal',
      'interestLabel': 'Interest',
      'periodPrefix': '',
      'periodSuffix': '',
      'tip': '💡 Tip: Equal payment has the same monthly payment. Equal principal has lower total interest but higher initial payments.',
      'features': 'Features',
      'f1': 'Two repayment methods',
      'f2': 'Real-time calculation',
      'f3': 'Complete payment schedule',
      'f4': 'Visual comparison',
      'f5': '100% free, no ads',
      'f6': 'Local calculation, private',
    },
    hi: {
      'action.showMore': 'सभी विवरण दिखाएं',
      'action.showLess': 'विवरण छुपाएं',
      'action.save': 'सहेजें',
      'action.cancel': 'रद्द करें',
      'action.confirm': 'पुष्टि करें',
      'title': 'बंधक कैलकुलेटर',
      'subtitle': 'आसानी से अपना मासिक बंधक भुगतान गणना करें।',
      'loanAmount': 'ऋण राशि',
      'wan': ' (10k)',
      'yuan': '',
      'unit.wan': '',
      'unit.yuan': '',
      'unit.nian': '',
      'loanYears': 'ऋण अवधि',
      'nian': ' वर्ष',
      'interestRate': 'ब्याज दर',
      'percent': '%',
      'loanType': 'चुकौती प्रकार',
      'equalPayment': 'समान भुगतान',
      'equalPrincipal': 'समान मूलधन',
      'monthlyPayment': 'मासिक भुगतान',
      'firstMonth': 'पहला महीना',
      'lastMonth': 'आखिरी महीना',
      'totalPayment': 'कुल भुगतान',
      'totalInterest': 'कुल ब्याज',
      'paymentSchedule': 'भुगतान अनुसूची',
      'month': 'महीना',
      'monthlyPaymentCol': 'भुगतान',
      'principal': 'मूलधन',
      'interest': 'ब्याज',
      'remaining': 'शेष',
      'decreasing': 'मासिक घट रहा है, अंतिम महीना ~ ',
      'principalLabel': 'मूलधन',
      'interestLabel': 'ब्याज',
      'periodPrefix': '',
      'periodSuffix': '',
      'tip': '💡 सुझाव: समान भुगतान में हर महीने समान राशि। समान मूलधन में कुल ब्याज कम लेकिन शुरुआती भुगतान अधिक।',
      'features': 'विशेषताएं',
      'f1': 'दो चुकौती विधियां',
      'f2': 'रीयल-टाइम गणना',
      'f3': 'पूर्ण भुगतान अनुसूची',
      'f4': 'विजुअल तुलना',
      'f5': '100% मुफ्त, कोई विज्ञापन नहीं',
      'f6': 'स्थानीय गणना, निजी',
    },
    fr: {
      'action.showMore': 'Afficher tous les détails',
      'action.showLess': 'Masquer les détails',
      'action.save': 'Enregistrer',
      'action.cancel': 'Annuler',
      'action.confirm': 'Confirmer',
      'title': 'Calculateur Hypothécaire',
      'subtitle': 'Calculez facilement votre paiement hypothécaire mensuel.',
      'loanAmount': 'Montant du Prêt',
      'wan': ' (10k)',
      'yuan': '',
      'unit.wan': '',
      'unit.yuan': '',
      'unit.nian': '',
      'loanYears': 'Durée du Prêt',
      'nian': ' ans',
      'interestRate': 'Taux d\'Intérêt',
      'percent': '%',
      'loanType': 'Type de Remboursement',
      'equalPayment': 'Paiement Égal',
      'equalPrincipal': 'Principal Égal',
      'monthlyPayment': 'Paiement Mensuel',
      'firstMonth': 'Premier Mois',
      'lastMonth': 'Dernier Mois',
      'totalPayment': 'Paiement Total',
      'totalInterest': 'Intérêts Totaux',
      'paymentSchedule': 'Calendrier des Paiements',
      'month': 'Mois',
      'monthlyPaymentCol': 'Paiement',
      'principal': 'Principal',
      'interest': 'Intérêts',
      'remaining': 'Restant',
      'decreasing': 'Décroissant mensuel, dernier mois ~ ',
      'principalLabel': 'Principal',
      'interestLabel': 'Intérêts',
      'periodPrefix': '',
      'periodSuffix': '',
      'tip': '💡 Astuce : Paiement égal = même mensualité. Principal égal = moins d\'intérêts totaux mais paiements initiaux plus élevés.',
      'features': 'Fonctionnalités',
      'f1': 'Deux méthodes de remboursement',
      'f2': 'Calcul en temps réel',
      'f3': 'Calendrier complet',
      'f4': 'Comparaison visuelle',
      'f5': '100% gratuit, sans pub',
      'f6': 'Calcul local, privé',
    },
    es: {
      'action.showMore': 'Mostrar todos los detalles',
      'action.showLess': 'Ocultar detalles',
      'action.save': 'Guardar',
      'action.cancel': 'Cancelar',
      'action.confirm': 'Confirmar',
      'title': 'Calculadora de Hipoteca',
      'subtitle': 'Calcula fácilmente tu pago mensual de hipoteca.',
      'loanAmount': 'Monto del Préstamo',
      'wan': ' (10k)',
      'yuan': '',
      'unit.wan': '',
      'unit.yuan': '',
      'unit.nian': '',
      'loanYears': 'Plazo del Préstamo',
      'nian': ' años',
      'interestRate': 'Tasa de Interés',
      'percent': '%',
      'loanType': 'Tipo de Pago',
      'equalPayment': 'Pago Igual',
      'equalPrincipal': 'Principal Igual',
      'monthlyPayment': 'Pago Mensual',
      'firstMonth': 'Primer Mes',
      'lastMonth': 'Último Mes',
      'totalPayment': 'Pago Total',
      'totalInterest': 'Intereses Totales',
      'paymentSchedule': 'Calendario de Pagos',
      'month': 'Mes',
      'monthlyPaymentCol': 'Pago',
      'principal': 'Principal',
      'interest': 'Intereses',
      'remaining': 'Restante',
      'decreasing': 'Decreciente mensual, último mes ~ ',
      'principalLabel': 'Principal',
      'interestLabel': 'Intereses',
      'periodPrefix': '',
      'periodSuffix': '',
      'tip': '💡 Consejo: Pago igual = misma mensualidad. Principal igual = menos intereses totales pero pagos iniciales mayores.',
      'features': 'Características',
      'f1': 'Dos métodos de pago',
      'f2': 'Cálculo en tiempo real',
      'f3': 'Calendario completo',
      'f4': 'Comparación visual',
      'f5': '100% gratis, sin anuncios',
      'f6': 'Cálculo local, privado',
    },
    ar: {
      'action.showMore': 'عرض جميع التفاصيل',
      'action.showLess': 'إخفاء التفاصيل',
      'action.save': 'حفظ',
      'action.cancel': 'إلغاء',
      'action.confirm': 'تأكيد',
      'title': 'حاسبة الرهن العقاري',
      'subtitle': 'احسب دفعتك الشهرية للرهن العقاري بسهولة.',
      'loanAmount': 'مبلغ القرض',
      'wan': ' (10k)',
      'yuan': '',
      'unit.wan': '',
      'unit.yuan': '',
      'unit.nian': '',
      'loanYears': 'مدة القرض',
      'nian': ' سنوات',
      'interestRate': 'معدل الفائدة',
      'percent': '%',
      'loanType': 'نوع السداد',
      'equalPayment': 'دفع متساوي',
      'equalPrincipal': 'أساس متساوي',
      'monthlyPayment': 'الدفع الشهري',
      'firstMonth': 'الشهر الأول',
      'lastMonth': 'الشهر الأخير',
      'totalPayment': 'إجمالي الدفع',
      'totalInterest': 'إجمالي الفائدة',
      'paymentSchedule': 'جدول الدفعات',
      'month': 'الشهر',
      'monthlyPaymentCol': 'الدفعة',
      'principal': 'الأصل',
      'interest': 'الفائدة',
      'remaining': 'المتبقي',
      'decreasing': 'يتناقص شهرياً، الشهر الأخير ~ ',
      'principalLabel': 'الأصل',
      'interestLabel': 'الفائدة',
      'periodPrefix': '',
      'periodSuffix': '',
      'tip': '💡 نصيحة: الدفع المتساوي = نفس القيمة شهرياً. الأساس المتساوي = فائدة إجمالية أقل لكن دفعات أولية أعلى.',
      'features': 'الميزات',
      'f1': 'طريقتا سداد',
      'f2': 'حساب فوري',
      'f3': 'جدول دفعات كامل',
      'f4': 'مقارنة مرئية',
      'f5': 'مجاني 100%، بدون إعلانات',
      'f6': 'حساب محلي، خاص',
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

  const [loanAmount, setLoanAmount] = useState(100);
  const [loanYears, setLoanYears] = useState(30);
  const [interestRate, setInterestRate] = useState(3.1);
  const [loanType, setLoanType] = useState<LoanType>('equal-payment');
  const [showDetails, setShowDetails] = useState(false);

  const result = useMemo(() => {
    const principal = loanAmount * 10000;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanYears * 12;

    if (loanType === 'equal-payment') {
      const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
      const totalPayment = monthlyPayment * totalMonths;
      const totalInterest = totalPayment - principal;

      const schedule = [];
      let remainingPrincipal = principal;
      for (let i = 1; i <= totalMonths; i++) {
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingPrincipal -= principalPayment;
        schedule.push({
          month: i,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          remaining: Math.max(0, remainingPrincipal),
        });
      }

      return {
        monthlyPayment,
        totalPayment,
        totalInterest,
        firstMonthPayment: monthlyPayment,
        lastMonthPayment: monthlyPayment,
        schedule,
      };
    } else {
      const monthlyPrincipal = principal / totalMonths;
      const schedule = [];
      let totalPayment = 0;
      let totalInterest = 0;
      let remainingPrincipal = principal;

      for (let i = 1; i <= totalMonths; i++) {
        const interestPayment = remainingPrincipal * monthlyRate;
        const payment = monthlyPrincipal + interestPayment;
        remainingPrincipal -= monthlyPrincipal;
        totalPayment += payment;
        totalInterest += interestPayment;
        schedule.push({
          month: i,
          payment,
          principal: monthlyPrincipal,
          interest: interestPayment,
          remaining: Math.max(0, remainingPrincipal),
        });
      }

      return {
        monthlyPayment: schedule[0]?.payment || 0,
        totalPayment,
        totalInterest,
        firstMonthPayment: schedule[0]?.payment || 0,
        lastMonthPayment: schedule[schedule.length - 1]?.payment || 0,
        schedule,
      };
    }
  }, [loanAmount, loanYears, interestRate, loanType]);

  const formatMoney = (amount: number) => {
    if (amount >= 10000) {
      return (amount / 10000).toFixed(2) + t('unit.wan');
    }
    return amount.toFixed(2) + t('unit.yuan');
  };

  const formatMonthly = (amount: number) => {
    return amount.toFixed(2);
  };

  const principalRatio = ((loanAmount * 10000) / result.totalPayment * 100).toFixed(1);
  const interestRatio = (result.totalInterest / result.totalPayment * 100).toFixed(1);

  const displayedSchedule = showDetails ? result.schedule : result.schedule.slice(0, 12);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'>
                <Home className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t('subtitle')}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t('loanAmount')}</label>
                    <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>{loanAmount}{t('wan')}</span>
                  </div>
                  <input
                    type='range'
                    min='10'
                    max='1000'
                    step='10'
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500'
                  />
                  <div className='flex justify-between mt-1 text-xs text-gray-400'>
                    <span>10{t('unit.wan')}</span>
                    <span>100{t('unit.wan')}</span>
                    <span>500{t('unit.wan')}</span>
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t('loanYears')}</label>
                    <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>{loanYears}{t('nian')}</span>
                  </div>
                  <input
                    type='range'
                    min='1'
                    max='30'
                    step='1'
                    value={loanYears}
                    onChange={(e) => setLoanYears(parseInt(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500'
                  />
                  <div className='flex justify-between mt-1 text-xs text-gray-400'>
                    <span>1{t('unit.nian')}</span>
                    <span>15{t('unit.nian')}</span>
                    <span>30{t('unit.nian')}</span>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t('interestRate')}</label>
                    <span className='text-sm font-bold text-blue-600 dark:text-blue-400'>{interestRate}{t('percent')}</span>
                  </div>
                  <input
                    type='range'
                    min='1'
                    max='10'
                    step='0.1'
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500'
                  />
                  <div className='flex justify-between mt-1 text-xs text-gray-400'>
                    <span>1%</span>
                    <span>4%</span>
                    <span>10%</span>
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2'>{t('loanType')}</label>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setLoanType('equal-payment')}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                        loanType === 'equal-payment'
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {t('equalPayment')}
                    </button>
                    <button
                      onClick={() => setLoanType('equal-principal')}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                        loanType === 'equal-principal'
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {t('equalPrincipal')}
                    </button>
                  </div>
                </div>
              </div>

              <div className='bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 sm:p-6 text-white'>
                <div className='text-center mb-4'>
                  <p className='text-sm text-blue-100 mb-1'>{t('monthlyPayment')}</p>
                  <p className='text-3xl sm:text-4xl font-bold'>
                    ¥ {formatMonthly(loanType === 'equal-payment' ? result.monthlyPayment : result.firstMonthPayment)}
                  </p>
                  {loanType === 'equal-principal' && (
                    <p className='text-xs text-blue-100 mt-1'>
                      {t('decreasing')}
                      ¥ {formatMonthly(result.lastMonthPayment)}
                    </p>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-3 pt-4 border-t border-white/20'>
                  <div className='text-center'>
                    <p className='text-xs text-blue-100 mb-1'>{t('totalPayment')}</p>
                    <p className='text-lg font-bold'>{formatMoney(result.totalPayment)}</p>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs text-blue-100 mb-1'>{t('totalInterest')}</p>
                    <p className='text-lg font-bold'>{formatMoney(result.totalInterest)}</p>
                  </div>
                </div>

                <div className='mt-4'>
                  <div className='flex justify-between text-xs text-blue-100 mb-1'>
                    <span>{t('principalLabel')} {principalRatio}%</span>
                    <span>{t('interestLabel')} {interestRatio}%</span>
                  </div>
                  <div className='w-full h-2 bg-white/20 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-white rounded-full transition-all'
                      style={{ width: `${principalRatio}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <Calendar className='w-4 h-4 text-blue-500' />
                    {t('paymentSchedule')}
                  </h3>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className='text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline'
                  >
                    {showDetails ? (
                      <><ChevronUp className='w-3 h-3' />{t('action.showLess')}</>
                    ) : (
                      <><ChevronDown className='w-3 h-3' />{t('action.showMore')}</>
                    )}
                  </button>
                </div>

                <div className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
                  <div className='max-h-64 overflow-y-auto'>
                    <table className='w-full text-xs'>
                      <thead className='bg-gray-50 dark:bg-gray-800 sticky top-0'>
                        <tr>
                          <th className='px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400'>{t('month')}</th>
                          <th className='px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400'>{t('monthlyPaymentCol')}</th>
                          <th className='px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400'>{t('principal')}</th>
                          <th className='px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400'>{t('interest')}</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                        {displayedSchedule.map((item) => (
                          <tr key={item.month} className='hover:bg-gray-50 dark:hover:bg-gray-800/50'>
                            <td className='px-3 py-2 text-gray-600 dark:text-gray-400'>
                              {t('periodPrefix')}{item.month}{t('periodSuffix')}
                            </td>
                            <td className='px-3 py-2 text-right font-medium text-gray-900 dark:text-gray-100'>
                              {item.payment.toFixed(0)}
                            </td>
                            <td className='px-3 py-2 text-right text-blue-600 dark:text-blue-400'>
                              {item.principal.toFixed(0)}
                            </td>
                            <td className='px-3 py-2 text-right text-orange-500 dark:text-orange-400'>
                              {item.interest.toFixed(0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className='p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-blue-700 dark:text-blue-300'>
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
                  <span className='w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0' />
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
