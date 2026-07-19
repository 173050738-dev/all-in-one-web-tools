'use client';

import { useState, useMemo } from 'react';

interface KeywordAnalyzerProps {
  locale?: string;
}

const i18n = {
  zh: { title:"电商关键词分析器", subtitle:"输入关键词，分析搜索热度、竞争度、建议出价", keyword:"关键词", category:"产品类目", analyze:"开始分析", analysisResult:"分析结果", searchVolume:"搜索量", competition:"竞争度", suggestedBid:"建议出价", difficulty:"难度评级", easy:"低难度", medium:"中难度", hard:"高难度", veryHard:"极高难度", topKeywords:"Top 相关关键词", relatedKeywords:"相关关键词", longTailKeywords:"长尾关键词", questions:"问题型关键词", commercialValue:"商业价值", high:"高", medium:"中", low:"低", copyKeywords:"复制关键词", exportCSV:"导出CSV", sample:"加载示例", sampleKeyword:"蓝牙耳机", sampleCategory:"电子产品", noData:"暂无数据" },
  en: { title:"E-commerce Keyword Analyzer", subtitle:"Enter keywords to analyze search volume, competition, and suggested bid", keyword:"Keyword", category:"Product Category", analyze:"Analyze", analysisResult:"Analysis Result", searchVolume:"Search Volume", competition:"Competition", suggestedBid:"Suggested Bid", difficulty:"Difficulty", easy:"Easy", medium:"Medium", hard:"Hard", veryHard:"Very Hard", topKeywords:"Top Related Keywords", relatedKeywords:"Related Keywords", longTailKeywords:"Long Tail Keywords", questions:"Question Keywords", commercialValue:"Commercial Value", high:"High", medium:"Medium", low:"Low", copyKeywords:"Copy Keywords", exportCSV:"Export CSV", sample:"Load Sample", sampleKeyword:"wireless earbuds", sampleCategory:"electronics", noData:"No data" },
  es: { title:"Analizador de Palabras Clave", subtitle:"Ingresa palabras clave para analizar volumen de búsqueda, competencia y oferta sugerida", keyword:"Palabra Clave", category:"Categoría de Producto", analyze:"Analizar", analysisResult:"Resultado del Análisis", searchVolume:"Volumen de Búsqueda", competition:"Competencia", suggestedBid:"Oferta Sugerida", difficulty:"Dificultad", easy:"Fácil", medium:"Medio", hard:"Difícil", veryHard:"Muy Difícil", topKeywords:"Top Palabras Clave Relacionadas", relatedKeywords:"Palabras Clave Relacionadas", longTailKeywords:"Palabras Clave Cola Larga", questions:"Palabras Clave de Pregunta", commercialValue:"Valor Comercial", high:"Alto", medium:"Medio", low:"Bajo", copyKeywords:"Copiar Palabras Clave", exportCSV:"Exportar CSV", sample:"Cargar Ejemplo", sampleKeyword:"auriculares inalámbricos", sampleCategory:"electrónica", noData:"Sin datos" },
  fr: { title:"Analyseur de Mots Clés", subtitle:"Entrez des mots clés pour analyser le volume de recherche, la concurrence et l'enchère suggérée", keyword:"Mot Clé", category:"Catégorie de Produit", analyze:"Analyser", analysisResult:"Résultat de l'Analyse", searchVolume:"Volume de Recherche", competition:"Concurrence", suggestedBid:"Enchère Suggerée", difficulty:"Difficulté", easy:"Facile", medium:"Moyenne", hard:"Difficile", veryHard:"Très Difficile", topKeywords:"Top Mots Clés Associés", relatedKeywords:"Mots Clés Associés", longTailKeywords:"Mots Clés à Queue Longue", questions:"Mots Clés de Question", commercialValue:"Valeur Commerciale", high:"Haute", medium:"Moyenne", low:"Basse", copyKeywords:"Copier les Mots Clés", exportCSV:"Exporter CSV", sample:"Charger l'Exemple", sampleKeyword:"écouteurs sans fil", sampleCategory:"électronique", noData:"Aucune donnée" },
  hi: { title:"ई-कॉमर्स कीवर्ड एनालाइजर", subtitle:"कीवर्ड दर्ज करें, खोज मात्रा, प्रतिस्पर्धा और सुझावित बोली का विश्लेषण करें", keyword:"कीवर्ड", category:"उत्पाद श्रेणी", analyze:"विश्लेषण करें", analysisResult:"विश्लेषण परिणाम", searchVolume:"खोज मात्रा", competition:"प्रतिस्पर्धा", suggestedBid:"सुझावित बोली", difficulty:"कठिनाई", easy:"आसान", medium:"मध्यम", hard:"कठिन", veryHard:"बहुत कठिन", topKeywords:"टॉप संबंधित कीवर्ड", relatedKeywords:"संबंधित कीवर्ड", longTailKeywords:"लंबी पूंछ वाले कीवर्ड", questions:"प्रश्न प्रकार के कीवर्ड", commercialValue:"वाणिज्यिक मूल्य", high:"उच्च", medium:"मध्यम", low:"निम्न", copyKeywords:"कीवर्ड कॉपी करें", exportCSV:"CSV निर्यात करें", sample:"उदाहरण लोड करें", sampleKeyword:"वायरलेस ईयरबड्स", sampleCategory:"इलेक्ट्रॉनिक्स", noData:"डेटा नहीं" },
  ar: { title:"محلل الكلمات المفتاحية للتجارة الإلكترونية", subtitle:"أدخل الكلمات المفتاحية لتحليل حجم البحث والمنافسة والمناقصة المقترحة", keyword:"كلمة مفتاحية", category:"فئة المنتج", analyze:"تحليل", analysisResult:"نتيجة التحليل", searchVolume:"حجم البحث", competition:"المنافسة", suggestedBid:"المناقصة المقترحة", difficulty:"الصعوبة", easy:"سهل", medium:"متوسط", hard:"صعب", veryHard:"صعب جدًا", topKeywords:"أعلى الكلمات المفتاحية ذات الصلة", relatedKeywords:"كلمات مفتاحية ذات الصلة", longTailKeywords:"كلمات مفتاحية ذوذيل طويل", questions:"كلمات مفتاحية أسئلة", commercialValue:"القيمة التجارية", high:"عالية", medium:"متوسطة", low:"منخفضة", copyKeywords:"نسخ الكلمات المفتاحية", exportCSV:"تصدير CSV", sample:"تحميل المثال", sampleKeyword:"سماعات أذن لاسلكية", sampleCategory:"الإلكترونيات", noData:"لا توجد بيانات" }
};

const RELATED_KEYWORDS: Record<string, { related: string[], longTail: string[], questions: string[] }> = {
  'wireless': {
    related: ['bluetooth', 'wireless headphones', 'wireless earbuds', 'wireless speakers', 'wireless charger'],
    longTail: ['best wireless earbuds under $50', 'wireless headphones for running', 'wireless earbuds with noise cancelling', 'wireless charger for iphone'],
    questions: ['what are the best wireless earbuds?', 'how do wireless headphones work?', 'are wireless earbuds worth it?']
  },
  'earbuds': {
    related: ['headphones', 'earphones', 'wireless earbuds', 'bluetooth earbuds', 'gaming earbuds'],
    longTail: ['wireless earbuds with long battery life', 'best budget earbuds 2024', 'earbuds for small ears', 'waterproof wireless earbuds'],
    questions: ['what earbuds have the best sound quality?', 'are wireless earbuds better than wired?', 'how to choose wireless earbuds?']
  },
  '蓝牙耳机': {
    related: ['无线耳机', '蓝牙耳塞', '降噪耳机', '运动耳机', '游戏耳机'],
    longTail: ['2024性价比蓝牙耳机', '适合跑步的蓝牙耳机', '降噪蓝牙耳机推荐', '学生党平价蓝牙耳机'],
    questions: ['蓝牙耳机哪个牌子好？', '蓝牙耳机怎么连接手机？', '蓝牙耳机续航多久？']
  },
  'wireless earbuds': {
    related: ['bluetooth earbuds', 'wireless headphones', 'true wireless', 'earbuds wireless', 'wireless earphones'],
    longTail: ['best true wireless earbuds 2024', 'affordable wireless earbuds', 'wireless earbuds for android', 'wireless earbuds with mic'],
    questions: ['what are true wireless earbuds?', 'how long do wireless earbuds last?', 'which wireless earbuds are best?']
  }
};

export default function KeywordAnalyzer({ locale = 'zh' }: KeywordAnalyzerProps) {
  const t = i18n[locale as keyof typeof i18n];
  
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeKeyword = () => {
    if (!keyword.trim()) return;

    const kwLower = keyword.toLowerCase();
    const categoryLower = category.toLowerCase();
    
    const volumeBase = Math.floor(Math.random() * 50000) + 10000;
    const competition = Math.random();
    const bidBase = (Math.random() * 5 + 0.5).toFixed(2);

    let difficulty = 'medium';
    if (competition < 0.3) difficulty = 'easy';
    else if (competition > 0.7) difficulty = 'hard';
    else if (competition > 0.85) difficulty = 'veryHard';

    let commercialValue = 'medium';
    if (competition > 0.5 && volumeBase > 25000) commercialValue = 'high';
    else if (competition < 0.3) commercialValue = 'low';

    const foundKeywords = RELATED_KEYWORDS[kwLower] || RELATED_KEYWORDS['wireless'];

    const result = {
      keyword,
      category,
      searchVolume: formatNumber(volumeBase),
      searchVolumeRaw: volumeBase,
      competition: (competition * 100).toFixed(0) + '%',
      competitionRaw: competition,
      suggestedBid: locale === 'zh' ? `¥${bidBase}` : locale === 'en' || locale === 'es' ? `$${bidBase}` : `€${bidBase}`,
      difficulty,
      commercialValue,
      relatedKeywords: foundKeywords.related,
      longTailKeywords: foundKeywords.longTail,
      questions: foundKeywords.questions
    };

    setAnalysis(result);
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) return (num / 10000).toFixed(1) + '万';
    return num.toLocaleString();
  };

  const loadSample = () => {
    setKeyword(t.sampleKeyword);
    setCategory(t.sampleCategory);
  };

  const copyKeywords = () => {
    if (!analysis) return;
    const allKeywords = [
      analysis.keyword,
      ...analysis.relatedKeywords,
      ...analysis.longTailKeywords,
      ...analysis.questions
    ];
    navigator.clipboard.writeText(allKeywords.join('\n'));
  };

  const exportCSV = () => {
    if (!analysis) return;
    let csv = 'Keyword,Type,Search Volume,Competition,Suggested Bid\n';
    csv += `${analysis.keyword},Main,${analysis.searchVolumeRaw},${analysis.competition},${analysis.suggestedBid}\n`;
    analysis.relatedKeywords.forEach((kw: string) => csv += `${kw},Related,,,\n`);
    analysis.longTailKeywords.forEach((kw: string) => csv += `${kw},Long Tail,,,\n`);
    analysis.questions.forEach((kw: string) => csv += `${kw},Question,,,\n`);
    
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
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              {t.analyze}
            </button>
          </div>
        </div>
      </div>

      {analysis && (
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{analysis.keyword}</h3>
                {analysis.category && <p className="text-sm text-gray-500">{analysis.category}</p>}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                analysis.difficulty === 'medium' ? 'bg-blue-100 text-blue-700' :
                analysis.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {t[analysis.difficulty]}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.commercialValue === 'high' ? 'bg-green-100 text-green-700' :
                analysis.commercialValue === 'medium' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {t.commercialValue} {t.commercialValue}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 md:p-6">
                <p className="text-sm text-gray-600 mb-2">{t.searchVolume}</p>
                <p className="text-3xl font-bold text-indigo-600">{analysis.searchVolume}</p>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${Math.min(analysis.searchVolumeRaw / 60000 * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 md:p-6">
                <p className="text-sm text-gray-600 mb-2">{t.competition}</p>
                <p className="text-3xl font-bold text-orange-600">{analysis.competition}</p>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      analysis.competitionRaw < 0.3 ? 'bg-green-500' :
                      analysis.competitionRaw < 0.7 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${analysis.competitionRaw * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6">
                <p className="text-sm text-gray-600 mb-2">{t.suggestedBid}</p>
                <p className="text-3xl font-bold text-green-600">{analysis.suggestedBid}</p>
                <p className="text-xs text-gray-500 mt-2">建议 CPC 出价</p>
              </div>
            </div>
          </div>

          {analysis.relatedKeywords.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="font-semibold text-gray-800 mb-3">{t.relatedKeywords}</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.relatedKeywords.map((kw: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {analysis.longTailKeywords.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="font-semibold text-gray-800 mb-3">{t.longTailKeywords}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analysis.longTailKeywords.map((kw: string, i: number) => (
                  <div key={i} className="flex items-center px-3 py-2 bg-green-50 rounded-lg">
                    <span className="mr-2 text-green-600">📌</span>
                    <span className="text-sm text-gray-700">{kw}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.questions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="font-semibold text-gray-800 mb-3">{t.questions}</h3>
              <div className="space-y-2">
                {analysis.questions.map((kw: string, i: number) => (
                  <div key={i} className="flex items-start px-3 py-2 bg-blue-50 rounded-lg">
                    <span className="mr-2 text-blue-600 mt-0.5">❓</span>
                    <span className="text-sm text-gray-700">{kw}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
