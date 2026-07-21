'use client';

import { useState, useMemo } from 'react';

interface CompetitorAnalyzerProps {
  locale?: string;
}

const i18n = {
  zh: { title:"电商竞品分析器", subtitle:"输入竞品信息，AI智能分析价格、评价、卖点", competitorName:"竞品名称", competitorUrl:"竞品链接", price:"价格", rating:"评分", reviews:"评价数", analyze:"开始分析", analyzing:"分析中...", analysisResult:"分析结果", priceAnalysis:"价格分析", priceLevel:"价位等级", low:"低价", medium:"中价", high:"高价", premium:"高端", pricePosition:"价格定位", priceAbove:"高于市场均价", priceBelow:"低于市场均价", priceAverage:"市场均价", ratingAnalysis:"评价分析", positiveRate:"好评率", keywords:"核心关键词", topKeywords:"Top 5 关键词", features:"卖点分析", strongPoints:"强势卖点", weakPoints:"薄弱点", recommendations:"优化建议", compare:"对比竞品", addCompetitor:"添加竞品", exportReport:"导出分析报告", copyReport:"复制报告", sample:"加载示例数据", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"1899", sampleRating:"4.8", sampleReviews:"25680", noData:"暂无数据", error:"分析失败，请重试", summary:"分析总结", delete:"删除", placeholderUrl:"https://...", placeholderPrice:"¥100", placeholderRating:"4.5", placeholderReviews:"1000" },
  en: { title:"E-commerce Competitor Analyzer", subtitle:"Enter competitor info for AI-powered price, rating, and feature analysis", competitorName:"Competitor Name", competitorUrl:"Competitor URL", price:"Price", rating:"Rating", reviews:"Reviews", analyze:"Analyze", analyzing:"Analyzing...", analysisResult:"Analysis Result", priceAnalysis:"Price Analysis", priceLevel:"Price Level", low:"Low", medium:"Medium", high:"High", premium:"Premium", pricePosition:"Price Position", priceAbove:"Above market average", priceBelow:"Below market average", priceAverage:"Market average", ratingAnalysis:"Rating Analysis", positiveRate:"Positive Rate", keywords:"Core Keywords", topKeywords:"Top 5 Keywords", features:"Feature Analysis", strongPoints:"Strong Points", weakPoints:"Weak Points", recommendations:"Optimization Tips", compare:"Compare Competitors", addCompetitor:"Add Competitor", exportReport:"Export Report", copyReport:"Copy Report", sample:"Load Sample", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"$249", sampleRating:"4.8", sampleReviews:"25,680", noData:"No data", error:"Analysis failed, please retry", summary:"Analysis Summary", delete:"Delete", placeholderUrl:"https://...", placeholderPrice:"$100", placeholderRating:"4.5", placeholderReviews:"1000" },
  es: { title:"Analizador de Competidores", subtitle:"Ingresa información del competidor para análisis de precio, calificaciones y puntos de venta con IA", competitorName:"Nombre del Competidor", competitorUrl:"URL del Competidor", price:"Precio", rating:"Calificación", reviews:"Reseñas", analyze:"Analizar", analyzing:"Analizando...", analysisResult:"Resultado del Análisis", priceAnalysis:"Análisis de Precio", priceLevel:"Nivel de Precio", low:"Bajo", medium:"Medio", high:"Alto", premium:"Premium", pricePosition:"Posición de Precio", priceAbove:"Por encima del promedio", priceBelow:"Por debajo del promedio", priceAverage:"Promedio de mercado", ratingAnalysis:"Análisis de Calificaciones", positiveRate:"Tasa de Positivos", keywords:"Palabras Clave", topKeywords:"Top 5 Palabras Clave", features:"Análisis de Características", strongPoints:"Puntos Fuertes", weakPoints:"Puntos Débiles", recommendations:"Consejos de Optimización", compare:"Comparar Competidores", addCompetitor:"Agregar Competidor", exportReport:"Exportar Informe", copyReport:"Copiar Informe", sample:"Cargar Ejemplo", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"$249", sampleRating:"4.8", sampleReviews:"25,680", noData:"Sin datos", error:"Análisis fallido, inténtelo de nuevo", summary:"Resumen del Análisis", delete:"Eliminar", placeholderUrl:"https://...", placeholderPrice:"$100", placeholderRating:"4.5", placeholderReviews:"1000" },
  fr: { title:"Analyseur de Concurrents", subtitle:"Entrez les informations du concurrent pour une analyse IA des prix, notations et points de vente", competitorName:"Nom du Concurrent", competitorUrl:"URL du Concurrent", price:"Prix", rating:"Note", reviews:"Avis", analyze:"Analyser", analyzing:"Analysant...", analysisResult:"Résultat de l'Analyse", priceAnalysis:"Analyse de Prix", priceLevel:"Niveau de Prix", low:"Bas", medium:"Moyen", high:"Haut", premium:"Premium", pricePosition:"Position de Prix", priceAbove:"Au-dessus de la moyenne", priceBelow:"Au-dessous de la moyenne", priceAverage:"Moyenne du marché", ratingAnalysis:"Analyse des Notations", positiveRate:"Taux de Positifs", keywords:"Mots Clés", topKeywords:"Top 5 Mots Clés", features:"Analyse des Fonctionnalités", strongPoints:"Points Forts", weakPoints:"Points Faibles", recommendations:"Conseils d'Optimisation", compare:"Comparer les Concurrents", addCompetitor:"Ajouter un Concurrent", exportReport:"Exporter le Rapport", copyReport:"Copier le Rapport", sample:"Charger l'Exemple", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"249€", sampleRating:"4.8", sampleReviews:"25 680", noData:"Aucune donnée", error:"Analyse échouée, veuillez réessayer", summary:"Résumé de l'Analyse", delete:"Supprimer", placeholderUrl:"https://...", placeholderPrice:"100€", placeholderRating:"4.5", placeholderReviews:"1000" },
  hi: { title:"ई-कॉमर्स प्रतिस्पर्धी विश्लेषक", subtitle:"प्रतिस्पर्धी की जानकारी दर्ज करें, AI से कीमत, रेटिंग और बिक्री बिंदु विश्लेषण करें", competitorName:"प्रतिस्पर्धी का नाम", competitorUrl:"प्रतिस्पर्धी यूआरएल", price:"कीमत", rating:"रेटिंग", reviews:"समीक्षाएं", analyze:"विश्लेषण करें", analyzing:"विश्लेषण हो रहा है...", analysisResult:"विश्लेषण परिणाम", priceAnalysis:"कीमत विश्लेषण", priceLevel:"कीमत स्तर", low:"कम", medium:"मध्यम", high:"उच्च", premium:"प्रीमियम", pricePosition:"कीमत स्थिति", priceAbove:"बाजार औसत से ऊपर", priceBelow:"बाजार औसत से नीचे", priceAverage:"बाजार औसत", ratingAnalysis:"रेटिंग विश्लेषण", positiveRate:"सकारात्मक दर", keywords:"मुख्य कीवर्ड", topKeywords:"टॉप 5 कीवर्ड", features:"बिक्री बिंदु विश्लेषण", strongPoints:"मजबूत बिंदु", weakPoints:"कमजोर बिंदु", recommendations:"अनुकूलन सुझाव", compare:"प्रतिस्पर्धियों की तुलना", addCompetitor:"प्रतिस्पर्धी जोड़ें", exportReport:"रिपोर्ट निर्यात करें", copyReport:"रिपोर्ट कॉपी करें", sample:"उदाहरण लोड करें", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"₹24,999", sampleRating:"4.8", sampleReviews:"25,680", noData:"डेटा नहीं", error:"विश्लेषण विफल, कृपया पुनः प्रयास करें", summary:"विश्लेषण सारांश", delete:"हटाएं", placeholderUrl:"https://...", placeholderPrice:"₹100", placeholderRating:"4.5", placeholderReviews:"1000" },
  ar: { title:"محلل المنافسين للتجارة الإلكترونية", subtitle:"أدخل معلومات المنافس لتحليل السعر والتقييم ونقاط البيع بالذكاء الاصطناعي", competitorName:"اسم المنافس", competitorUrl:"رابط المنافس", price:"السعر", rating:"التقييم", reviews:"التعليقات", analyze:"تحليل", analyzing:"جاري التحليل...", analysisResult:"نتيجة التحليل", priceAnalysis:"تحليل السعر", priceLevel:"مستوى السعر", low:"منخفض", medium:"متوسط", high:"مرتفع", premium:"ممتاز", pricePosition:"موقف السعر", priceAbove:"أعلى من متوسط السوق", priceBelow:"أقل من متوسط السوق", priceAverage:"متوسط السوق", ratingAnalysis:"تحليل التقييم", positiveRate:"معدل الإيجابية", keywords:"الكلمات المفتاحية", topKeywords:"أعلى 5 كلمات مفتاحية", features:"تحليل نقاط البيع", strongPoints:"النقاط القوية", weakPoints:"النقاط الضعيفة", recommendations:"نصائح التحسين", compare:"مقارنة المنافسين", addCompetitor:"إضافة منافس", exportReport:"تصدير التقرير", copyReport:"نسخ التقرير", sample:"تحميل المثال", sampleName:"Apple AirPods Pro 2", sampleUrl:"https://example.com/airpods-pro", samplePrice:"249$", sampleRating:"4.8", sampleReviews:"25,680", noData:"لا توجد بيانات", error:"فشل التحليل، يرجى المحاولة مرة أخرى", summary:"ملخص التحليل", delete:"حذف", placeholderUrl:"https://...", placeholderPrice:"$100", placeholderRating:"4.5", placeholderReviews:"1000" }
};

interface CompetitorData {
  name: string;
  url: string;
  price: string;
  rating: string;
  reviews: string;
}

export default function CompetitorAnalyzer({ locale = 'zh' }: CompetitorAnalyzerProps) {
  const t = i18n[locale as keyof typeof i18n];
  
  const [competitors, setCompetitors] = useState<CompetitorData[]>([
    { name: '', url: '', price: '', rating: '', reviews: '' }
  ]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeCompetitors = async () => {
    const validCompetitors = competitors.filter(c => c.name && c.price);
    if (validCompetitors.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/competitor-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitors: validCompetitors, locale })
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysis(data);
      } else {
        setError(data.error || t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
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
      name: t.sampleName,
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
      `关键词: ${c.topKeywords.join(', ')}\n` +
      `强势卖点: ${c.strongPoints.join(', ')}\n` +
      `薄弱点: ${c.weakPoints.join(', ')}\n` +
      `优化建议: ${c.recommendations.join(', ')}`
    ).join('\n') + (analysis.summary ? `\n\n=== 分析总结 ===\n${analysis.summary}` : '');
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
                  {t.delete}
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
                  placeholder={t.placeholderUrl}
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
                  placeholder={t.placeholderPrice}
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
                  placeholder={t.placeholderRating}
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
                  placeholder={t.placeholderReviews}
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
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
        >
          {loading ? t.analyzing : t.analyze}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

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

          {analysis.summary && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 md:p-6">
              <h3 className="font-semibold text-indigo-900 mb-2">{t.summary}</h3>
              <p className="text-indigo-800">{analysis.summary}</p>
            </div>
          )}

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

                  {c.topKeywords && c.topKeywords.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2">{t.topKeywords}</h4>
                      <div className="flex flex-wrap gap-2">
                        {c.topKeywords.map((k: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {k}
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