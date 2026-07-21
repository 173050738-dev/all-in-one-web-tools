'use client';

import { useState } from 'react';

interface KeywordAnalyzerProps {
  locale?: string;
}

const i18n = {
  zh: { title:"电商关键词分析器", subtitle:"输入关键词，AI智能分析搜索热度、竞争度、建议出价", keyword:"关键词", category:"产品类目", analyze:"开始分析", analyzing:"分析中...", analysisResult:"分析结果", searchVolume:"搜索量", competition:"竞争度", suggestedBid:"建议出价", difficulty:"难度评级", easy:"低难度", medium:"中难度", hard:"高难度", veryHard:"极高难度", low:"低", high:"高", topKeywords:"Top 相关关键词", relatedKeywords:"相关关键词", longTailKeywords:"长尾关键词", semanticKeywords:"语义扩展词", questions:"问题型关键词", commercialValue:"商业价值", copyKeywords:"复制关键词", exportCSV:"导出CSV", sample:"加载示例", sampleKeyword:"蓝牙耳机", sampleCategory:"电子产品", noData:"暂无数据", error:"分析失败，请重试", summary:"分析总结", informational:"信息型", navigational:"导航型", transactional:"交易型", commercial:"商业型" },
  en: { title:"E-commerce Keyword Analyzer", subtitle:"Enter keywords for AI-powered search volume, competition, and bid analysis", keyword:"Keyword", category:"Product Category", analyze:"Analyze", analyzing:"Analyzing...", analysisResult:"Analysis Result", searchVolume:"Search Volume", competition:"Competition", suggestedBid:"Suggested Bid", difficulty:"Difficulty", easy:"Easy", medium:"Medium", hard:"Hard", veryHard:"Very Hard", low:"Low", high:"High", topKeywords:"Top Related Keywords", relatedKeywords:"Related Keywords", longTailKeywords:"Long Tail Keywords", semanticKeywords:"Semantic Keywords", questions:"Question Keywords", commercialValue:"Commercial Value", copyKeywords:"Copy Keywords", exportCSV:"Export CSV", sample:"Load Sample", sampleKeyword:"wireless earbuds", sampleCategory:"electronics", noData:"No data", error:"Analysis failed, please retry", summary:"Analysis Summary", informational:"Informational", navigational:"Navigational", transactional:"Transactional", commercial:"Commercial" },
  es: { title:"Analizador de Palabras Clave", subtitle:"Ingresa palabras clave para análisis de volumen de búsqueda, competencia y oferta con IA", keyword:"Palabra Clave", category:"Categoría de Producto", analyze:"Analizar", analyzing:"Analizando...", analysisResult:"Resultado del Análisis", searchVolume:"Volumen de Búsqueda", competition:"Competencia", suggestedBid:"Oferta Sugerida", difficulty:"Dificultad", easy:"Fácil", medium:"Medio", hard:"Difícil", veryHard:"Muy Difícil", low:"Bajo", high:"Alto", topKeywords:"Top Palabras Clave Relacionadas", relatedKeywords:"Palabras Clave Relacionadas", longTailKeywords:"Palabras Clave Cola Larga", semanticKeywords:"Palabras Clave Semánticas", questions:"Palabras Clave de Pregunta", commercialValue:"Valor Comercial", copyKeywords:"Copiar Palabras Clave", exportCSV:"Exportar CSV", sample:"Cargar Ejemplo", sampleKeyword:"auriculares inalámbricos", sampleCategory:"electrónica", noData:"Sin datos", error:"Análisis fallido, inténtelo de nuevo", summary:"Resumen del Análisis", informational:"Informativo", navigational:"Navegacional", transactional:"Transaccional", commercial:"Comercial" },
  fr: { title:"Analyseur de Mots Clés", subtitle:"Entrez des mots clés pour analyser le volume de recherche, la concurrence et l'enchère avec IA", keyword:"Mot Clé", category:"Catégorie de Produit", analyze:"Analyser", analyzing:"Analysant...", analysisResult:"Résultat de l'Analyse", searchVolume:"Volume de Recherche", competition:"Concurrence", suggestedBid:"Enchère Suggerée", difficulty:"Difficulté", easy:"Facile", medium:"Moyenne", hard:"Difficile", veryHard:"Très Difficile", low:"Basse", high:"Haute", topKeywords:"Top Mots Clés Associés", relatedKeywords:"Mots Clés Associés", longTailKeywords:"Mots Clés à Queue Longue", semanticKeywords:"Mots Clés Sémantiques", questions:"Mots Clés de Question", commercialValue:"Valeur Commerciale", copyKeywords:"Copier les Mots Clés", exportCSV:"Exporter CSV", sample:"Charger l'Exemple", sampleKeyword:"écouteurs sans fil", sampleCategory:"électronique", noData:"Aucune donnée", error:"Analyse échouée, veuillez réessayer", summary:"Résumé de l'Analyse", informational:"Informationnel", navigational:"Navigational", transactional:"Transactionnel", commercial:"Commercial" },
  hi: { title:"ई-कॉमर्स कीवर्ड एनालाइजर", subtitle:"कीवर्ड दर्ज करें, AI से खोज मात्रा, प्रतिस्पर्धा और सुझावित बोली का विश्लेषण करें", keyword:"कीवर्ड", category:"उत्पाद श्रेणी", analyze:"विश्लेषण करें", analyzing:"विश्लेषण हो रहा है...", analysisResult:"विश्लेषण परिणाम", searchVolume:"खोज मात्रा", competition:"प्रतिस्पर्धा", suggestedBid:"सुझावित बोली", difficulty:"कठिनाई", easy:"आसान", medium:"मध्यम", hard:"कठिन", veryHard:"बहुत कठिन", low:"निम्न", high:"उच्च", topKeywords:"टॉप संबंधित कीवर्ड", relatedKeywords:"संबंधित कीवर्ड", longTailKeywords:"लंबी पूंछ वाले कीवर्ड", semanticKeywords:"सिमेंटिक कीवर्ड", questions:"प्रश्न प्रकार के कीवर्ड", commercialValue:"वाणिज्यिक मूल्य", copyKeywords:"कीवर्ड कॉपी करें", exportCSV:"CSV निर्यात करें", sample:"उदाहरण लोड करें", sampleKeyword:"वायरलेस ईयरबड्स", sampleCategory:"इलेक्ट्रॉनिक्स", noData:"डेटा नहीं", error:"विश्लेषण विफल, कृपया पुनः प्रयास करें", summary:"विश्लेषण सारांश", informational:"सूचनात्मक", navigational:"नेविगेशनल", transactional:"लेनदेन योग्य", commercial:"वाणिज्यिक" },
  ar: { title:"محلل الكلمات المفتاحية للتجارة الإلكترونية", subtitle:"أدخل الكلمات المفتاحية لتحليل حجم البحث والمنافسة والمناقصة المقترحة بالذكاء الاصطناعي", keyword:"كلمة مفتاحية", category:"فئة المنتج", analyze:"تحليل", analyzing:"جاري التحليل...", analysisResult:"نتيجة التحليل", searchVolume:"حجم البحث", competition:"المنافسة", suggestedBid:"المناقصة المقترحة", difficulty:"الصعوبة", easy:"سهل", medium:"متوسط", hard:"صعب", veryHard:"صعب جدًا", low:"منخفضة", high:"عالية", topKeywords:"أعلى الكلمات المفتاحية ذات الصلة", relatedKeywords:"كلمات مفتاحية ذات الصلة", longTailKeywords:"كلمات مفتاحية ذوذيل طويل", semanticKeywords:"كلمات مفتاحية دلالية", questions:"كلمات مفتاحية أسئلة", commercialValue:"القيمة التجارية", copyKeywords:"نسخ الكلمات المفتاحية", exportCSV:"تصدير CSV", sample:"تحميل المثال", sampleKeyword:"سماعات أذن لاسلكية", sampleCategory:"الإلكترونيات", noData:"لا توجد بيانات", error:"فشل التحليل، يرجى المحاولة مرة أخرى", summary:"ملخص التحليل", informational:"معرفي", navigational:"ملاحظة", transactional:"معاملات", commercial:"تجاري" }
};

export default function KeywordAnalyzer({ locale = 'zh' }: KeywordAnalyzerProps) {
  const t = i18n[locale as keyof typeof i18n];
  
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeKeyword = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/keyword-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: [keyword], locale })
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

  const loadSample = () => {
    setKeyword(t.sampleKeyword);
    setCategory(t.sampleCategory);
  };

  const copyKeywords = () => {
    if (!analysis || !analysis.keywords) return;
    const allKeywords: string[] = [];
    analysis.keywords.forEach((k: any) => {
      allKeywords.push(k.keyword);
      if (k.relatedKeywords) allKeywords.push(...k.relatedKeywords);
      if (k.longTailKeywords) allKeywords.push(...k.longTailKeywords);
      if (k.semanticKeywords) allKeywords.push(...k.semanticKeywords);
    });
    navigator.clipboard.writeText(allKeywords.join('\n'));
  };

  const exportCSV = () => {
    if (!analysis || !analysis.keywords) return;
    let csv = 'Keyword,Search Volume,Competition,Suggested Bid,Difficulty,Intention\n';
    analysis.keywords.forEach((k: any) => {
      csv += `${k.keyword},${t[k.searchVolume] || k.searchVolume},${t[k.competition] || k.competition},${k.suggestedBid},${t[k.difficulty] || k.difficulty},${t[k.intention] || k.intention}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keywords.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.keyword}</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="输入关键词..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="电子产品、服装、家居..."
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={loadSample}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {t.sample}
            </button>
            <button
              onClick={analyzeKeyword}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
            >
              {loading ? t.analyzing : t.analyze}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {analysis && analysis.keywords && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t.analysisResult}</h2>
            <div className="flex gap-3">
              <button
                onClick={copyKeywords}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                {t.copyKeywords}
              </button>
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                {t.exportCSV}
              </button>
            </div>
          </div>

          {analysis.summary && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 md:p-6">
              <h3 className="font-semibold text-indigo-900 mb-2">{t.summary}</h3>
              <p className="text-indigo-800">{analysis.summary}</p>
            </div>
          )}

          {analysis.keywords.map((kw: any, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{kw.keyword}</h3>
                  {category && <p className="text-sm text-gray-500">{category}</p>}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  kw.difficulty <= 30 ? 'bg-green-100 text-green-700' :
                  kw.difficulty <= 60 ? 'bg-blue-100 text-blue-700' :
                  kw.difficulty <= 80 ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {t.difficulty}: {kw.difficulty}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  kw.intention === 'transactional' || kw.intention === 'commercial' ? 'bg-green-100 text-green-700' :
                  kw.intention === 'navigational' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {t[kw.intention] || kw.intention}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 md:p-6">
                  <p className="text-sm text-gray-600 mb-2">{t.searchVolume}</p>
                  <p className="text-3xl font-bold text-indigo-600">{t[kw.searchVolume] || kw.searchVolume}</p>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${kw.searchVolume === 'high' ? 80 : kw.searchVolume === 'medium' ? 50 : 20}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 md:p-6">
                  <p className="text-sm text-gray-600 mb-2">{t.competition}</p>
                  <p className="text-3xl font-bold text-orange-600">{t[kw.competition] || kw.competition}</p>
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        kw.competition === 'low' ? 'bg-green-500' :
                        kw.competition === 'medium' ? 'bg-yellow-500' :
                        kw.competition === 'high' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${kw.competition === 'low' ? 25 : kw.competition === 'medium' ? 50 : kw.competition === 'high' ? 75 : 90}%` }}
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6">
                  <p className="text-sm text-gray-600 mb-2">{t.suggestedBid}</p>
                  <p className="text-3xl font-bold text-green-600">{kw.suggestedBid}</p>
                  <p className="text-xs text-gray-500 mt-2">建议 CPC 出价</p>
                </div>
              </div>

              {kw.relatedKeywords && kw.relatedKeywords.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">{t.relatedKeywords}</h4>
                  <div className="flex flex-wrap gap-2">
                    {kw.relatedKeywords.map((k: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {kw.longTailKeywords && kw.longTailKeywords.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">{t.longTailKeywords}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {kw.longTailKeywords.map((k: string, i: number) => (
                      <div key={i} className="flex items-center px-3 py-2 bg-green-50 rounded-lg">
                        <span className="mr-2 text-green-600">📌</span>
                        <span className="text-sm text-gray-700">{k}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {kw.semanticKeywords && kw.semanticKeywords.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">{t.semanticKeywords}</h4>
                  <div className="flex flex-wrap gap-2">
                    {kw.semanticKeywords.map((k: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}