'use client';

import { useState } from 'react';

interface ReviewGeneratorProps {
  locale?: string;
}

const i18n = {
  zh: { title:"电商评价生成器", subtitle:"输入产品信息，AI智能生成高质量评价", productName:"产品名称", productFeatures:"产品特点", rating:"星级", type:"评价类型", typePositive:"好评", typeNeutral:"中评", typeNegative:"差评", generate:"生成评价", generating:"生成中...", copyReview:"复制评价", regenerate:"重新生成", review:"评价", sample:"加载示例", sampleProduct:"无线蓝牙耳机", sampleFeatures:"音质好，续航长，佩戴舒适", noData:"暂无数据", error:"生成失败，请重试" },
  en: { title:"Review Generator", subtitle:"Enter product info for AI-powered high-quality review generation", productName:"Product Name", productFeatures:"Product Features", rating:"Rating", type:"Review Type", typePositive:"Positive", typeNeutral:"Neutral", typeNegative:"Negative", generate:"Generate Review", generating:"Generating...", copyReview:"Copy Review", regenerate:"Regenerate", review:"Review", sample:"Load Sample", sampleProduct:"Wireless Bluetooth Earbuds", sampleFeatures:"Good sound quality, long battery life, comfortable fit", noData:"No data", error:"Generation failed, please retry" },
  es: { title:"Generador de Reseñas", subtitle:"Ingrese información del producto para generación de reseñas de alta calidad con IA", productName:"Nombre del Producto", productFeatures:"Características del Producto", rating:"Calificación", type:"Tipo de Reseña", typePositive:"Positiva", typeNeutral:"Neutral", typeNegative:"Negativa", generate:"Generar Reseña", generating:"Generando...", copyReview:"Copiar Reseña", regenerate:"Regenerar", review:"Reseña", sample:"Cargar Ejemplo", sampleProduct:"Auriculares Bluetooth Inalámbricos", sampleFeatures:"Buena calidad de sonido, batería duradera, cómodos", noData:"Sin datos", error:"Generación fallida, inténtelo de nuevo" },
  fr: { title:"Générateur d'Avis", subtitle:"Entrez les informations du produit pour la génération d'avis de haute qualité avec IA", productName:"Nom du Produit", productFeatures:"Caractéristiques du Produit", rating:"Note", type:"Type d'Avis", typePositive:"Positif", typeNeutral:"Neutre", typeNegative:"Négatif", generate:"Générer Avis", generating:"Génération...", copyReview:"Copier Avis", regenerate:"Régénérer", review:"Avis", sample:"Charger l'Exemple", sampleProduct:"Écouteurs Bluetooth Sans Fil", sampleFeatures:"Bonne qualité sonore, longue durée de vie de la batterie, confortable", noData:"Aucune donnée", error:"Génération échouée, veuillez réessayer" },
  hi: { title:"रिव्यू जेनरेटर", subtitle:"उत्पाद की जानकारी दर्ज करें, AI से उच्च गुणवत्ता वाले रिव्यू उत्पन्न करें", productName:"उत्पाद नाम", productFeatures:"उत्पाद विशेषताएं", rating:"रेटिंग", type:"रिव्यू प्रकार", typePositive:"सकारात्मक", typeNeutral:"तटस्थ", typeNegative:"नकारात्मक", generate:"रिव्यू उत्पन्न करें", generating:"उत्पन्न हो रहा है...", copyReview:"रिव्यू कॉपी करें", regenerate:"पुनरुत्पन्न करें", review:"रिव्यू", sample:"उदाहरण लोड करें", sampleProduct:"वायरलेस ब्लूटूथ ईयरबड्स", sampleFeatures:"अच्छी ध्वनि गुणवत्ता, लंबा बैटरी जीवन, आरामदायक फिट", noData:"डेटा नहीं", error:"उत्पादन विफल, कृपया पुनः प्रयास करें" },
  ar: { title:"مُنشئ المراجعات", subtitle:"أدخل معلومات المنتج لإنشاء مراجعات عالية الجودة بالذكاء الاصطناعي", productName:"اسم المنتج", productFeatures:"ميزات المنتج", rating:"التقييم", type:"نوع المراجعة", typePositive:"إيجابي", typeNeutral:"محايد", typeNegative:"سلبي", generate:"إنشاء مراجعة", generating:"ج الإنشاء...", copyReview:"نسخ المراجعة", regenerate:"إعادة إنشاء", review:"مراجعة", sample:"تحميل المثال", sampleProduct:"سماعات أذن بلوتوث لاسلكية", sampleFeatures:"جودة صوت جيدة، عمر بطارية طويل، ملاءمة مريحة", noData:"لا توجد بيانات", error:"فشل الإنشاء، يرجى المحاولة مرة أخرى" }
};

export default function ReviewGenerator({ locale = 'zh' }: ReviewGeneratorProps) {
  const t = i18n[locale as keyof typeof i18n];
  
  const [productName, setProductName] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [reviewType, setReviewType] = useState('positive');
  const [generatedReviews, setGeneratedReviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReviews = async () => {
    if (!productName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai-review-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productFeatures: productFeatures || t.sampleFeatures,
          reviewType,
          locale
        })
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedReviews(data.reviews || []);
      } else {
        setError(data.error || t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const copyReview = (review: string) => {
    navigator.clipboard.writeText(review);
  };

  const loadSample = () => {
    setProductName(t.sampleProduct);
    setProductFeatures(t.sampleFeatures);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.productName}</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t.sampleProduct}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.productFeatures}</label>
            <input
              type="text"
              value={productFeatures}
              onChange={(e) => setProductFeatures(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t.sampleFeatures}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">{t.type}</label>
          <div className="flex gap-2">
            {[
              { value: 'positive', label: t.typePositive, color: 'green' },
              { value: 'neutral', label: t.typeNeutral, color: 'blue' },
              { value: 'negative', label: t.typeNegative, color: 'red' }
            ].map(item => (
              <button
                key={item.value}
                onClick={() => setReviewType(item.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                  reviewType === item.value 
                    ? item.color === 'green' ? 'bg-green-600 text-white' :
                      item.color === 'blue' ? 'bg-blue-600 text-white' :
                      'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            {t.sample}
          </button>
          <button
            onClick={generateReviews}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
          >
            {loading ? t.generating : t.generate}
          </button>
        </div>
      </div>

      {generatedReviews.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t.review}</h2>
            <button
              onClick={generateReviews}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? t.generating : t.regenerate}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedReviews.map((review, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex items-center gap-1 mb-3">
                  {reviewType === 'positive' && '★★★★★'}
                  {reviewType === 'neutral' && '★★★☆☆'}
                  {reviewType === 'negative' && '★☆☆☆☆'}
                  <span className="text-gray-500 text-sm ml-1">{reviewType === 'positive' ? '5' : reviewType === 'neutral' ? '3' : '1'} {t.rating}</span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{review}</p>
                <button
                  onClick={() => copyReview(review)}
                  className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  {t.copyReview}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}