'use client';

import { useState } from 'react';

interface ReviewGeneratorProps {
  locale?: string;
}

const i18n = {
  zh: { title:"电商评价生成器", subtitle:"输入产品信息，一键生成高质量评价", productName:"产品名称", productFeatures:"产品特点", rating:"星级", generate:"生成评价", copyReview:"复制评价", regenerate:"重新生成", review:"评价", sample:"加载示例", sampleProduct:"无线蓝牙耳机", sampleFeatures:"音质好，续航长，佩戴舒适", noData:"暂无数据" },
  en: { title:"Review Generator", subtitle:"Enter product info to generate high-quality reviews", productName:"Product Name", productFeatures:"Product Features", rating:"Rating", generate:"Generate Review", copyReview:"Copy Review", regenerate:"Regenerate", review:"Review", sample:"Load Sample", sampleProduct:"Wireless Bluetooth Earbuds", sampleFeatures:"Good sound quality, long battery life, comfortable fit", noData:"No data" },
  es: { title:"Generador de Reseñas", subtitle:"Ingrese información del producto para generar reseñas de alta calidad", productName:"Nombre del Producto", productFeatures:"Características del Producto", rating:"Calificación", generate:"Generar Reseña", copyReview:"Copiar Reseña", regenerate:"Regenerar", review:"Reseña", sample:"Cargar Ejemplo", sampleProduct:"Auriculares Bluetooth Inalámbricos", sampleFeatures:"Buena calidad de sonido, batería duradera, cómodos", noData:"Sin datos" },
  fr: { title:"Générateur d'Avis", subtitle:"Entrez les informations du produit pour générer des avis de haute qualité", productName:"Nom du Produit", productFeatures:"Caractéristiques du Produit", rating:"Note", generate:"Générer Avis", copyReview:"Copier Avis", regenerate:"Régénérer", review:"Avis", sample:"Charger l'Exemple", sampleProduct:"Écouteurs Bluetooth Sans Fil", sampleFeatures:"Bonne qualité sonore, longue durée de vie de la batterie, confortable", noData:"Aucune donnée" },
  hi: { title:"रिव्यू जेनरेटर", subtitle:"उत्पाद की जानकारी दर्ज करें, उच्च गुणवत्ता वाले रिव्यू उत्पन्न करें", productName:"उत्पाद नाम", productFeatures:"उत्पाद विशेषताएं", rating:"रेटिंग", generate:"रिव्यू उत्पन्न करें", copyReview:"रिव्यू कॉपी करें", regenerate:"पुनरुत्पन्न करें", review:"रिव्यू", sample:"उदाहरण लोड करें", sampleProduct:"वायरलेस ब्लूटूथ ईयरबड्स", sampleFeatures:"अच्छी ध्वनि गुणवत्ता, लंबा बैटरी जीवन, आरामदायक फिट", noData:"डेटा नहीं" },
  ar: { title:"مُنشئ المراجعات", subtitle:"أدخل معلومات المنتج لإنشاء مراجعات عالية الجودة", productName:"اسم المنتج", productFeatures:"ميزات المنتج", rating:"التقييم", generate:"إنشاء مراجعة", copyReview:"نسخ المراجعة", regenerate:"إعادة إنشاء", review:"مراجعة", sample:"تحميل المثال", sampleProduct:"سماعات أذن بلوتوث لاسلكية", sampleFeatures:"جودة صوت جيدة، عمر بطارية طويل، ملاءمة مريحة", noData:"لا توجد بيانات" }
};

const REVIEW_TEMPLATES: Record<string, string[]> = {
  '5': {
    zh: [
      '这款{productName}真的太棒了！{features}，完全超出我的预期。强烈推荐给大家！',
      '购买{productName}是我做过最正确的决定。{features}，物超所值！',
      '{productName}质量非常好，{features}。使用体验极佳，已经推荐给朋友了。',
      '收到{productName}后非常惊喜，{features}，性价比很高。',
      '{productName}完美！{features}，客服态度也很好，下次还会回购。'
    ],
    en: [
      'This {productName} is amazing! {features}, completely exceeded my expectations. Highly recommended!',
      'Buying {productName} was the best decision I made. {features}, great value for money!',
      '{productName} is very good quality, {features}. Excellent user experience, already recommended to friends.',
      'Very surprised when I received {productName}, {features}, great value.',
      '{productName} is perfect! {features}, customer service was great too, will buy again.'
    ],
    es: [
      '¡Este {productName} es increíble! {features}, completamente superó mis expectativas. ¡Altamente recomendado!',
      'Comprar {productName} fue la mejor decisión que tomé. {features}, ¡excelente relación calidad-precio!',
      '{productName} es de muy buena calidad, {features}. Excelente experiencia de usuario, ya lo recomendé a amigos.',
      'Muy sorprendido cuando recibí {productName}, {features}, gran valor.',
      '{productName} es perfecto! {features}, el servicio al cliente fue genial también, compraré de nuevo.'
    ],
    fr: [
      'Ce {productName} est incroyable ! {features}, a complètement dépassé mes attentes. Hautement recommandé !',
      'Acheter {productName} a été la meilleure décision que j\'ai prise. {features}, excellent rapport qualité-prix !',
      '{productName} est de très bonne qualité, {features}. Excellente expérience utilisateur, déjà recommandé à des amis.',
      'Très surpris quand j\'ai reçu {productName}, {features}, grande valeur.',
      '{productName} est parfait ! {features}, le service client a été excellent aussi, je rachèterai.'
    ],
    hi: [
      'यह {productName} आश्चर्यजनक है! {features}, मेरी अपेक्षाओं को पूरी तरह से पार किया। अत्यधिक अनुशंसित!',
      '{productName} खरीदना मेरा सबसे सही निर्णय था। {features}, पैसे की बहुत अच्छी कीमत!',
      '{productName} बहुत अच्छी गुणवत्ता का है, {features}. उत्कृष्ट उपयोगकर्ता अनुभव, पहले से ही दोस्तों को अनुशंसित किया।',
      '{productName} प्राप्त करते समय बहुत आश्चर्यचकित हुआ, {features}, बहुत अच्छी कीमत।',
      '{productName} परिपूर्ण है! {features}, ग्राहक सेवा भी बहुत अच्छी थी, फिर से खरीदूंगा।'
    ],
    ar: [
      'هذا {productName} مذهل! {features}, تجاوز توقعاتي تماماً. توصي بشدة!',
      'شراء {productName} كان أفضل قرار اتخذته. {features}, قيمة ممتازة مقابل المال!',
      '{productName} جودة ممتازة, {features}. تجربة مستخدم ممتازة، أوصت بالفعل لأصدقائي.',
      'مغرباً جداً عندما استلمت {productName}, {features}, قيمة عالية.',
      '{productName} مثالي! {features}, خدمة العملاء كانت رائعة أيضاً، سأشتري مرة أخرى.'
    ]
  },
  '4': {
    zh: [
      '{productName}整体不错，{features}。唯一的小缺点是...不过总体来说很满意。',
      '这款{productName}值得购买，{features}，使用起来很方便。',
      '{productName}质量尚可，{features}。价格合理，推荐购买。',
      '收到{productName}了，{features}，基本符合预期。',
      '{productName}还可以，{features}，性价比不错。'
    ],
    en: [
      '{productName} is pretty good overall, {features}. Only minor downside is... but overall very satisfied.',
      'This {productName} is worth buying, {features}, very convenient to use.',
      '{productName} quality is decent, {features}. Reasonable price, recommended.',
      'Received {productName}, {features}, basically meets expectations.',
      '{productName} is okay, {features}, good value for money.'
    ],
    es: [
      '{productName} es bastante bueno en general, {features}. Única desventaja menor es... pero en general muy satisfecho.',
      'Este {productName} vale la pena comprar, {features}, muy conveniente de usar.',
      '{productName} calidad es decente, {features}. Precio razonable, recomendado.',
      'Recibí {productName}, {features}, básicamente cumple las expectativas.',
      '{productName} está bien, {features}, buena relación calidad-precio.'
    ],
    fr: [
      '{productName} est assez bon dans l\'ensemble, {features}. Seule petite inconvénient est... mais globalement très satisfait.',
      'Ce {productName} vaut la peine d\'acheter, {features}, très pratique à utiliser.',
      '{productName} qualité est décente, {features}. Prix raisonnable, recommandé.',
      'J\'ai reçu {productName}, {features}, répondant globalement aux attentes.',
      '{productName} est okay, {features}, bon rapport qualité-prix.'
    ],
    hi: [
      '{productName} कुल मिलाकर बहुत अच्छा है, {features}. केवल छोटी कमजोरी है... लेकिन कुल मिलाकर बहुत खुश हूँ।',
      'यह {productName} खरीदने लायक है, {features}, उपयोग करने में बहुत आसान है।',
      '{productName} गुणवत्ता अच्छी है, {features}. उचित कीमत, अनुशंसित।',
      '{productName} प्राप्त किया, {features}, मूल रूप से अपेक्षाओं को पूरा करता है।',
      '{productName} ठीक है, {features}, पैसे की अच्छी कीमत।'
    ],
    ar: [
      '{productName} جيد جداً بشكل عام, {features}. السلبيات الصغيرة فقط... ولكن بشكل عام راضٍ جداً.',
      'هذا {productName} يستحق الشراء, {features}, مراقب جداً.',
      '{productName} جودة لائق, {features}. سعر معقول, موصى به.',
      'لقد استلمت {productName}, {features}, تفي بشكل أساسي بالتوقعات.',
      '{productName} حسن, {features}, قيمة جيدة مقابل المال.'
    ]
  },
  '3': {
    zh: [
      '{productName}一般般，{features}。有一些地方需要改进。',
      '这款{productName}中规中矩，{features}。符合价位预期。',
      '{productName}还行吧，{features}。可以用，但没有惊喜。',
      '收到{productName}了，{features}，感觉一般。',
      '{productName}勉强及格，{features}。希望下次能改进。'
    ],
    en: [
      '{productName} is average, {features}. Some areas need improvement.',
      'This {productName} is mediocre, {features}. Meets price expectations.',
      '{productName} is okay, {features}. Usable but no surprises.',
      'Received {productName}, {features}, feels average.',
      '{productName} barely passes, {features}. Hope for improvement next time.'
    ],
    es: [
      '{productName} es promedio, {features}. Algunas áreas necesitan mejora.',
      'Este {productName} es mediocre, {features}. Cumple las expectativas de precio.',
      '{productName} está bien, {features}. Utilizable pero sin sorpresas.',
      'Recibí {productName}, {features}, se siente promedio.',
      '{productName} apenas pasa, {features}. Espero mejora la próxima vez.'
    ],
    fr: [
      '{productName} est moyen, {features}. Certaines zones nécessitent des améliorations.',
      'Ce {productName} est médiocre, {features}. Répond aux attentes de prix.',
      '{productName} est okay, {features}. Utilisable mais sans surprises.',
      'J\'ai reçu {productName}, {features}, semble moyen.',
      '{productName} passe à peine, {features}. Espérons des améliorations la prochaine fois.'
    ],
    hi: [
      '{productName} औसत है, {features}. कुछ क्षेत्रों में सुधार की जरूरत है।',
      'यह {productName} औसत है, {features}. मूल्य अपेक्षाओं को पूरा करता है।',
      '{productName} ठीक है, {features}. उपयोग योग्य लेकिन कोई आश्चर्य नहीं।',
      '{productName} प्राप्त किया, {features}, औसत लग रहा है।',
      '{productName} मुश्किल से उत्तीर्ण होता है, {features}. आशा है अगली बार सुधार होगा।'
    ],
    ar: [
      '{productName} متوسط, {features}. بعض المجالات تحتاج تحسين.',
      'هذا {productName} متوسط, {features}. يفي بالتوقعات السعرية.',
      '{productName} حسن, {features}. قابل للاستخدام ولكن لا يوجد مفاجآت.',
      'لقد استلمت {productName}, {features}, يبدو متوسط.',
      '{productName} بالكاد يمر, {features}. أتمنى التحسين في المرة القادمة.'
    ]
  }
};

export default function ReviewGenerator({ locale = 'zh' }: ReviewGeneratorProps) {
  const t = i18n[locale as keyof typeof i18n];
  
  const [productName, setProductName] = useState('');
  const [productFeatures, setProductFeatures] = useState('');
  const [rating, setRating] = useState('5');
  const [generatedReviews, setGeneratedReviews] = useState<string[]>([]);

  const generateReviews = () => {
    if (!productName.trim()) return;
    
    const templates = REVIEW_TEMPLATES[rating];
    const featuresText = productFeatures.trim() ? productFeatures : t.sampleFeatures;
    
    const reviews = templates[locale].map(template => 
      template
        .replace('{productName}', productName)
        .replace('{features}', featuresText)
    );
    
    setGeneratedReviews(reviews);
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
          <label className="block text-sm font-medium text-gray-700 mb-3">{t.rating}</label>
          <div className="flex gap-2">
            {['5', '4', '3'].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                  rating === star 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{'★'.repeat(parseInt(star))}</span>
                <span>{star} {t.rating}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            {t.sample}
          </button>
          <button
            onClick={generateReviews}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {t.generate}
          </button>
        </div>
      </div>

      {generatedReviews.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t.review}</h2>
            <button
              onClick={generateReviews}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {t.regenerate}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedReviews.map((review, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 relative">
                <div className="flex items-center gap-1 mb-3">
                  {['★'.repeat(parseInt(rating))]}
                  <span className="text-gray-500 text-sm ml-1">{rating} {t.rating}</span>
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
