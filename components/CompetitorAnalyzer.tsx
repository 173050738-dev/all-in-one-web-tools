'use client';

import { useState, useMemo } from 'react';

interface CompetitorAnalyzerProps {
  locale?: string;
}

const i18n = {
  zh: { title:"电商竞品分析器", subtitle:"输入竞品信息，快速分析价格、评价、卖点", competitorName:"竞品名称", competitorUrl:"竞品链接", price:"价格", rating:"评分", reviews:"评价数", analyze:"开始分析", analysisResult:"分析结果", priceAnalysis:"价格分析", priceLevel:"价位等级", low:"低价", medium:"中价", high:"高价", premium:"高端", pricePosition:"价格定位", priceAbove:"高于市场均价", priceBelow:"低于市场均价", priceAverage:"市场均价", ratingAnalysis:"评价分析", positiveRate:"好评率", keywords:"核心关键词", topKeywords:"Top 5 关键词", features:"卖点分析", strongPoints:"强势卖点", weakPoints:"薄弱点", recommendations:"优化建议", compare:"对比竞品", addCompetitor:"添加竞品", exportReport:"导出分析报告", copyReport:"复制报告", sample:"加载示例数据", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"1899", sampleRating:"4.8", sampleReviews:"25680", noData:"暂无数据" },
  en: { title:"E-commerce Competitor Analyzer", subtitle:"Enter competitor info to analyze price, ratings, and selling points", competitorName:"Competitor Name", competitorUrl:"Competitor URL", price:"Price", rating:"Rating", reviews:"Reviews", analyze:"Analyze", analysisResult:"Analysis Result", priceAnalysis:"Price Analysis", priceLevel:"Price Level", low:"Low", medium:"Medium", high:"High", premium:"Premium", pricePosition:"Price Position", priceAbove:"Above market average", priceBelow:"Below market average", priceAverage:"Market average", ratingAnalysis:"Rating Analysis", positiveRate:"Positive Rate", keywords:"Core Keywords", topKeywords:"Top 5 Keywords", features:"Feature Analysis", strongPoints:"Strong Points", weakPoints:"Weak Points", recommendations:"Optimization Tips", compare:"Compare Competitors", addCompetitor:"Add Competitor", exportReport:"Export Report", copyReport:"Copy Report", sample:"Load Sample", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"$249", sampleRating:"4.8", sampleReviews:"25,680", noData:"No data" },
  es: { title:"Analizador de Competidores", subtitle:"Ingresa información del competidor para analizar precio, calificaciones y puntos de venta", competitorName:"Nombre del Competidor", competitorUrl:"URL del Competidor", price:"Precio", rating:"Calificación", reviews:"Reseñas", analyze:"Analizar", analysisResult:"Resultado del Análisis", priceAnalysis:"Análisis de Precio", priceLevel:"Nivel de Precio", low:"Bajo", medium:"Medio", high:"Alto", premium:"Premium", pricePosition:"Posición de Precio", priceAbove:"Por encima del promedio", priceBelow:"Por debajo del promedio", priceAverage:"Promedio de mercado", ratingAnalysis:"Análisis de Calificaciones", positiveRate:"Tasa de Positivos", keywords:"Palabras Clave", topKeywords:"Top 5 Palabras Clave", features:"Análisis de Características", strongPoints:"Puntos Fuertes", weakPoints:"Puntos Débiles", recommendations:"Consejos de Optimización", compare:"Comparar Competidores", addCompetitor:"Agregar Competidor", exportReport:"Exportar Informe", copyReport:"Copiar Informe", sample:"Cargar Ejemplo", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"$249", sampleRating:"4.8", sampleReviews:"25,680", noData:"Sin datos" },
  fr: { title:"Analyseur de Concurrents", subtitle:"Entrez les informations du concurrent pour analyser prix, notations et points de vente", competitorName:"Nom du Concurrent", competitorUrl:"URL du Concurrent", price:"Prix", rating:"Note", reviews:"Avis", analyze:"Analyser", analysisResult:"Résultat de l'Analyse", priceAnalysis:"Analyse de Prix", priceLevel:"Niveau de Prix", low:"Bas", medium:"Moyen", high:"Haut", premium:"Premium", pricePosition:"Position de Prix", priceAbove:"Au-dessus de la moyenne", priceBelow:"Au-dessous de la moyenne", priceAverage:"Moyenne du marché", ratingAnalysis:"Analyse des Notations", positiveRate:"Taux de Positifs", keywords:"Mots Clés", topKeywords:"Top 5 Mots Clés", features:"Analyse des Fonctionnalités", strongPoints:"Points Forts", weakPoints:"Points Faibles", recommendations:"Conseils d'Optimisation", compare:"Comparer les Concurrents", addCompetitor:"Ajouter un Concurrent", exportReport:"Exporter le Rapport", copyReport:"Copier le Rapport", sample:"Charger l'Exemple", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"249€", sampleRating:"4.8", sampleReviews:"25 680", noData:"Aucune donnée" },
  hi: { title:"ई-कॉमर्स प्रतिस्पर्धी विश्लेषक", subtitle:"प्रतिस्पर्धी की जानकारी दर्ज करें, कीमत, रेटिंग और बिक्री बिंदु विश्लेषण करें", competitorName:"प्रतिस्पर्धी का नाम", competitorUrl:"प्रतिस्पर्धी यूआरएल", price:"कीमत", rating:"रेटिंग", reviews:"समीक्षाएं", analyze:"विश्लेषण करें", analysisResult:"विश्लेषण परिणाम", priceAnalysis:"कीमत विश्लेषण", priceLevel:"कीमत स्तर", low:"कम", medium:"मध्यम", high:"उच्च", premium:"प्रीमियम", pricePosition:"कीमत स्थिति", priceAbove:"बाजार औसत से ऊपर", priceBelow:"बाजार औसत से नीचे", priceAverage:"बाजार औसत", ratingAnalysis:"रेटिंग विश्लेषण", positiveRate:"सकारात्मक दर", keywords:"मुख्य कीवर्ड", topKeywords:"टॉप 5 कीवर्ड", features:"बिक्री बिंदु विश्लेषण", strongPoints:"मजबूत बिंदु", weakPoints:"कमजोर बिंदु", recommendations:"अनुकूलन सुझाव", compare:"प्रतिस्पर्धियों की तुलना", addCompetitor:"प्रतिस्पर्धी जोड़ें", exportReport:"रिपोर्ट निर्यात करें", copyReport:"रिपोर्ट कॉपी करें", sample:"उदाहरण लोड करें", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"₹24,999", sampleRating:"4.8", sampleReviews:"25,680", noData:"डेटा नहीं" },
  ar: { title:"محلل المنافسين للتجارة الإلكترونية", subtitle:"أدخل معلومات المنافس لتحليل السعر والتقييم ونقاط البيع", competitorName:"اسم المنافس", competitorUrl:"رابط المنافس", price:"السعر", rating:"التقييم", reviews:"التعليقات", analyze:"تحليل", analysisResult:"نتيجة التحليل", priceAnalysis:"تحليل السعر", priceLevel:"مستوى السعر", low:"منخفض", medium:"متوسط", high:"مرتفع", premium:"ممتاز", pricePosition:"موقف السعر", priceAbove:"أعلى من متوسط السوق", priceBelow:"أقل من متوسط السوق", priceAverage:"متوسط السوق", ratingAnalysis:"تحليل التقييم", positiveRate:"معدل الإيجابية", keywords:"الكلمات المفتاحية", topKeywords:"أعلى 5 كلمات مفتاحية", features:"تحليل نقاط البيع", strongPoints:"النقاط القوية", weakPoints:"النقاط الضعيفة", recommendations:"نصائح التحسين", compare:"مقارنة المنافسين", addCompetitor:"إضافة منافس", exportReport:"تصدير التقرير", copyReport:"نسخ التقرير", sample:"تحميل المثال", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"249$", sampleRating:"4.8", sampleReviews:"25,680", noData:"لا توجد بيانات" }
};

interface CompetitorData {
  name: string;
  url: string;
  price: string;
  rating: string;
  reviews: string;
}

const KEYWORD_DICTIONARY = [
  { kw: 'wireless', zh: '无线', es: 'inalámbrico', fr: 'sans fil', hi: 'वायरलेस', ar: 'لاسلكي' },
  { kw: 'bluetooth', zh: '蓝牙', es: 'bluetooth', fr: 'bluetooth', hi: 'ब्लूटूथ', ar: 'بلوتوث' },
  { kw: 'earbuds', zh: '耳塞', es: 'auriculares', fr: 'écouteurs', hi: 'ईयरबड्स', ar: 'سماعة أذن' },
  { kw: 'noise cancelling', zh: '降噪', es: 'cancelación de ruido', fr: 'réduction de bruit', hi: 'शोर रद्द', ar: 'إلغاء الضوضاء' },
  { kw: 'charging case', zh: '充电盒', es: 'estuche de carga', fr: 'étui de charge', hi: 'चार्जिंग केस', ar: 'عبوة الشحن' },
  { kw: 'touch control', zh: '触控', es: 'control táctil', fr: 'contrôle tactile', hi: 'टच कंट्रोल', ar: 'التحكم باللمس' },
  { kw: 'waterproof', zh: '防水', es: 'impermeable', fr: 'étanche', hi: 'पानी रोधी', ar: 'ماء مقاوم' },
  { kw: 'sports', zh: '运动', es: 'deportivo', fr: 'sport', hi: 'खेल', ar: 'رياضي' },
  { kw: 'gaming', zh: '游戏', es: 'juegos', fr: 'gaming', hi: 'गेमिंग', ar: 'الألعاب' },
  { kw: 'bass', zh: '低音', es: 'bajos', fr: 'bass', hi: 'बास', ar: 'الباص' },
  { kw: 'sound quality', zh: '音质', es: 'calidad de sonido', fr: 'qualité sonore', hi: 'ध्वनि गुणवत्ता', ar: 'جودة الصوت' },
  { kw: 'battery life', zh: '续航', es: 'duración de batería', fr: 'durée de batterie', hi: 'बैटरी लाइफ', ar: 'مدة البطارية' },
  { kw: 'fast charging', zh: '快充', es: 'carga rápida', fr: 'charge rapide', hi: 'फास्ट चार्जिंग', ar: 'الشحن السريع' },
  { kw: 'microphone', zh: '麦克风', es: 'micrófono', fr: 'microphone', hi: 'माइक्रोफोन', ar: 'الميكروفون' },
  { kw: 'call quality', zh: '通话质量', es: 'calidad de llamada', fr: 'qualité d\'appel', hi: 'कॉल क्वालिटी', ar: 'جودة المكالمة' },
];

export default function CompetitorAnalyzer({ locale = 'zh' }: CompetitorAnalyzerProps) {
  const t = i18n[locale as keyof typeof i18n];
  
  const [competitors, setCompetitors] = useState<CompetitorData[]>([
    { name: '', url: '', price: '', rating: '', reviews: '' }
  ]);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeCompetitors = () => {
    const validCompetitors = competitors.filter(c => c.name && c.price);
    if (validCompetitors.length === 0) return;

    const prices = validCompetitors.map(c => parseFloat(c.price.replace(/[^0-9.]/g, ''))).filter(p => !isNaN(p));
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

    const result = {
      competitors: validCompetitors.map(c => {
        const priceVal = parseFloat(c.price.replace(/[^0-9.]/g, ''));
        const ratingVal = parseFloat(c.rating);
        const reviewsVal = parseInt(c.reviews.replace(/[^0-9]/g, '')) || 0;
        
        let priceLevel = 'medium';
        if (priceVal < avgPrice * 0.6) priceLevel = 'low';
        else if (priceVal > avgPrice * 1.4) priceLevel = 'premium';
        else if (priceVal > avgPrice * 1.1) priceLevel = 'high';

        let pricePosition = 'priceAverage';
        if (priceVal > avgPrice * 1.1) pricePosition = 'priceAbove';
        else if (priceVal < avgPrice * 0.9) pricePosition = 'priceBelow';

        const positiveRate = ratingVal >= 4.5 ? '95%+' : ratingVal >= 4.0 ? '85%-95%' : ratingVal >= 3.5 ? '75%-85%' : '<75%';

        const nameLower = c.name.toLowerCase();
        const matchedKeywords = KEYWORD_DICTIONARY.filter(k => nameLower.includes(k.kw.toLowerCase()));
        const topKeywords = matchedKeywords.slice(0, 5);

        return {
          ...c,
          priceLevel,
          pricePosition,
          positiveRate,
          topKeywords,
          strongPoints: generateStrongPoints(ratingVal, reviewsVal),
          weakPoints: generateWeakPoints(ratingVal, reviewsVal, priceVal, avgPrice),
          recommendations: generateRecommendations(ratingVal, priceVal, avgPrice, topKeywords.length)
        };
      }),
      avgPrice,
      totalCompetitors: validCompetitors.length
    };

    setAnalysis(result);
  };

  const generateStrongPoints = (rating: number, reviews: number): string[] => {
    const points: string[] = [];
    if (rating >= 4.5) points.push(locale === 'zh' ? '极高好评率' : locale === 'en' ? 'Excellent rating' : '');
    if (reviews > 1000) points.push(locale === 'zh' ? '大量用户反馈' : locale === 'en' ? 'Large user base' : '');
    if (rating >= 4.0 && reviews > 100) points.push(locale === 'zh' ? '市场认可度高' : locale === 'en' ? 'Market trusted' : '');
    if (points.length === 0) points.push(locale === 'zh' ? '有一定市场基础' : locale === 'en' ? 'Has market presence' : '');
    return points;
  };

  const generateWeakPoints = (rating: number, reviews: number, price: number, avgPrice: number): string[] => {
    const points: string[] = [];
    if (rating < 4.0) points.push(locale === 'zh' ? '评价一般' : locale === 'en' ? 'Average rating' : '');
    if (reviews < 100) points.push(locale === 'zh' ? '用户反馈少' : locale === 'en' ? 'Limited reviews' : '');
    if (price > avgPrice * 1.5) points.push(locale === 'zh' ? '价格偏高' : locale === 'en' ? 'Overpriced' : '');
    if (price < avgPrice * 0.5) points.push(locale === 'zh' ? '可能存在质量隐患' : locale === 'en' ? 'Potential quality issues' : '');
    if (points.length === 0) points.push(locale === 'zh' ? '需进一步挖掘' : locale === 'en' ? 'Needs deeper analysis' : '');
    return points;
  };

  const generateRecommendations = (rating: number, price: number, avgPrice: number, keywordCount: number): string[] => {
    const points: string[] = [];
    if (rating < 4.5) points.push(locale === 'zh' ? '提升产品质量和服务' : locale === 'en' ? 'Improve product quality' : '');
    if (price > avgPrice * 1.3) points.push(locale === 'zh' ? '优化定价策略' : locale === 'en' ? 'Optimize pricing' : '');
    if (keywordCount < 2) points.push(locale === 'zh' ? '丰富产品关键词覆盖' : locale === 'en' ? 'Expand keyword coverage' : '');
    if (points.length === 0) points.push(locale === 'zh' ? '保持现有优势，持续优化' : locale === 'en' ? 'Maintain current strengths' : '');
    return points;
  };

  const addCompetitor = () => {
    setCompetitors([...competitors, { name: '', url: '', price: '', rating: '', reviews: '' }]);
  };

  const removeCompetitor = (index: number) => {
    if (competitors.length > 1) {
      setCompetitors(competitors.filter((_, i) => i !== index));
    }
  };

  const loadSample = () => {
    setCompetitors([{
      name: locale === 'zh' ? t.sampleName : t.sampleName,
      url: t.sampleUrl,
      price: t.samplePrice,
      rating: t.sampleRating,
      reviews: t.sampleReviews
    }]);
  };

  const copyReport = () => {
    if (!analysis) return;
    const report = analysis.competitors.map((c: any, i: number) => 
      `\n=== 竞品 ${i + 1}: ${c.name} ===\n` +
      `价格: ${c.price} (${t[c.priceLevel]})\n` +
      `评分: ${c.rating} (好评率: ${c.positiveRate})\n` +
      `评价数: ${c.reviews}\n` +
      `关键词: ${c.topKeywords.map((k: any) => k[locale] || k.kw).join(', ')}\n` +
      `强势卖点: ${c.strongPoints.join(', ')}\n` +
      `薄弱点: ${c.weakPoints.join(', ')}\n` +
      `优化建议: ${c.recommendations.join(', ')}`
    ).join('\n');
    navigator.clipboard.writeText(report);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="space-y-4 mb-6">
        {competitors.map((c, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{t.competitorName} {index + 1}</h3>
              {competitors.length > 1 && (
                <button
                  onClick={() => removeCompetitor(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.competitorName}</label>
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => {
                    const newCompetitors = [...competitors];
                    newCompetitors[index].name = e.target.value;
                    setCompetitors(newCompetitors);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={t.competitorName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.competitorUrl}</label>
                <input
                  type="text"
                  value={c.url}
                  onChange={(e) => {
                    const newCompetitors = [...competitors];
                    newCompetitors[index].url = e.target.value;
                    setCompetitors(newCompetitors);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.price}</label>
                <input
                  type="text"
                  value={c.price}
                  onChange={(e) => {
                    const newCompetitors = [...competitors];
                    newCompetitors[index].price = e.target.value;
                    setCompetitors(newCompetitors);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="¥100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.rating}</label>
                <input
                  type="text"
                  value={c.rating}
                  onChange={(e) => {
                    const newCompetitors = [...competitors];
                    newCompetitors[index].rating = e.target.value;
                    setCompetitors(newCompetitors);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="4.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.reviews}</label>
                <input
                  type="text"
                  value={c.reviews}
                  onChange={(e) => {
                    const newCompetitors = [...competitors];
                    newCompetitors[index].reviews = e.target.value;
                    setCompetitors(newCompetitors);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={addCompetitor}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          + {t.addCompetitor}
        </button>
        <button
          onClick={loadSample}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          {t.sample}
        </button>
        <button
          onClick={analyzeCompetitors}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          {t.analyze}
        </button>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t.analysisResult}</h2>
            <div className="flex gap-3">
              <button
                onClick={copyReport}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                {t.copyReport}
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            {analysis.competitors.map((c: any, index: number) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-indigo-50 px-4 md:px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                      {c.url && <p className="text-sm text-gray-500 truncate max-w-md">{c.url}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        c.priceLevel === 'low' ? 'bg-green-100 text-green-700' :
                        c.priceLevel === 'medium' ? 'bg-blue-100 text-blue-700' :
                        c.priceLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {t[c.priceLevel]}
                      </span>
                      <span className="text-xl font-bold text-gray-900">{c.price}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">{t.rating}</p>
                      <p className="text-2xl font-bold text-gray-900">{c.rating}</p>
                      <p className="text-sm text-gray-500">{t.positiveRate}: {c.positiveRate}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">{t.reviews}</p>
                      <p className="text-2xl font-bold text-gray-900">{c.reviews}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">{t.pricePosition}</p>
                      <p className="text-lg font-bold text-gray-900">{t[c.pricePosition]}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500 mb-1">{t.priceLevel}</p>
                      <p className="text-lg font-bold text-gray-900">{t[c.priceLevel]}</p>
                    </div>
                  </div>

                  {c.topKeywords.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">{t.topKeywords}</h4>
                      <div className="flex flex-wrap gap-2">
                        {c.topKeywords.map((k: any, i: number) => (
                          <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {k[locale] || k.kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">{t.strongPoints}</h4>
                      <ul className="space-y-1">
                        {c.strongPoints.map((p: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">✓</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">{t.weakPoints}</h4>
                      <ul className="space-y-1">
                        {c.weakPoints.map((p: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">✗</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-700 mb-2">{t.recommendations}</h4>
                      <ul className="space-y-1">
                        {c.recommendations.map((p: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">→</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
