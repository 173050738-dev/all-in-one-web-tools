'use client';

import { useState } from 'react';

interface EmailTemplateGeneratorProps {
  locale?: string;
}

const i18n = {
  zh: { title:"电商邮件模板生成器", subtitle:"输入产品信息，AI智能生成专业营销邮件", templateType:"邮件类型", productName:"产品名称", productPrice:"产品价格", discount:"折扣", deadline:"截止日期", generate:"生成邮件", generating:"生成中...", copyEmail:"复制邮件", preview:"预览", subject:"邮件主题", body:"邮件正文", welcome:"欢迎邮件", promotion:"促销邮件", reminder:"提醒邮件", thankyou:"感谢邮件", abandoned:"弃购召回", sample:"加载示例", sampleProduct:"无线蓝牙耳机", samplePrice:"¥299", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"暂无数据", error:"生成失败，请重试", signature:"邮件签名", cta:"行动号召", tips:"优化建议" },
  en: { title:"Email Template Generator", subtitle:"Enter product info for AI-powered professional marketing emails", templateType:"Template Type", productName:"Product Name", productPrice:"Product Price", discount:"Discount", deadline:"Deadline", generate:"Generate Email", generating:"Generating...", copyEmail:"Copy Email", preview:"Preview", subject:"Subject", body:"Body", welcome:"Welcome", promotion:"Promotion", reminder:"Reminder", thankyou:"Thank You", abandoned:"Abandoned Cart", sample:"Load Sample", sampleProduct:"Wireless Bluetooth Earbuds", samplePrice:"$49", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"No data", error:"Generation failed, please retry", signature:"Signature", cta:"CTA", tips:"Tips" },
  es: { title:"Generador de Plantillas de Correo", subtitle:"Ingrese información del producto para correos de marketing profesionales con IA", templateType:"Tipo de Correo", productName:"Nombre del Producto", productPrice:"Precio del Producto", discount:"Descuento", deadline:"Fecha Límite", generate:"Generar Correo", generating:"Generando...", copyEmail:"Copiar Correo", preview:"Previsualizar", subject:"Asunto", body:"Cuerpo", welcome:"Bienvenida", promotion:"Promoción", reminder:"Recordatorio", thankyou:"Gracias", abandoned:"Recuperación de Carrito", sample:"Cargar Ejemplo", sampleProduct:"Auriculares Bluetooth Inalámbricos", samplePrice:"$49", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"Sin datos", error:"Generación fallida, inténtelo de nuevo", signature:"Firma", cta:"CTA", tips:"Consejos" },
  fr: { title:"Générateur de Modèles d'Email", subtitle:"Entrez les informations du produit pour des emails marketing professionnels avec IA", templateType:"Type d'Email", productName:"Nom du Produit", productPrice:"Prix du Produit", discount:"Réduction", deadline:"Date Limite", generate:"Générer Email", generating:"Génération...", copyEmail:"Copier Email", preview:"Aperçu", subject:"Objet", body:"Corps", welcome:"Bienvenue", promotion:"Promotion", reminder:"Rappel", thankyou:"Merci", abandoned:"Panier Abandonné", sample:"Charger l'Exemple", sampleProduct:"Écouteurs Bluetooth Sans Fil", samplePrice:"49€", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"Aucune donnée", error:"Génération échouée, veuillez réessayer", signature:"Signature", cta:"CTA", tips:"Conseils" },
  hi: { title:"ईमेल टेम्पलेट जेनरेटर", subtitle:"उत्पाद की जानकारी दर्ज करें, AI से पेशेवर मार्केटिंग ईमेल उत्पन्न करें", templateType:"ईमेल प्रकार", productName:"उत्पाद नाम", productPrice:"उत्पाद की कीमत", discount:"छूट", deadline:"अंतिम तिथि", generate:"ईमेल उत्पन्न करें", generating:"उत्पन्न हो रहा है...", copyEmail:"ईमेल कॉपी करें", preview:"पूर्वावलोकन", subject:"विषय", body:"विषय में", welcome:"स्वागत", promotion:"प्रचार", reminder:"अनुस्मारक", thankyou:"धन्यवाद", abandoned:"छोड़ा हुआ कार्ट", sample:"उदाहरण लोड करें", sampleProduct:"वायरलेस ब्लूटूथ ईयरबड्स", samplePrice:"₹1,999", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"डेटा नहीं", error:"उत्पादन विफल, कृपया पुनः प्रयास करें", signature:"हस्ताक्षर", cta:"CTA", tips:"सुझाव" },
  ar: { title:"مُنشئ قوالب البريد الإلكتروني", subtitle:"أدخل معلومات المنتج لإنشاء رسائل تسويقية احترافية بالذكاء الاصطناعي", templateType:"نوع البريد", productName:"اسم المنتج", productPrice:"سعر المنتج", discount:"الخصم", deadline:"تاريخ النهاية", generate:"إنشاء البريد", generating:"ج الإنشاء...", copyEmail:"نسخ البريد", preview:"معاينة", subject:"الموضوع", body:"المحتوى", welcome:"ترحيب", promotion:"تسويق", reminder:"تذكير", thankyou:"شكراً", abandoned:"استعادة السلة", sample:"تحميل المثال", sampleProduct:"سماعات أذن بلوتوث لاسلكية", samplePrice:"299$", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"لا توجد بيانات", error:"فشل الإنشاء، يرجى المحاولة مرة أخرى", signature:"التوقيع", cta:"CTA", tips:"نصائح" }
};

type TemplateType = 'welcome' | 'promotion' | 'reminder' | 'thankyou' | 'abandoned';

export default function EmailTemplateGenerator({ locale = 'zh' }: EmailTemplateGeneratorProps) {
  const t = i18n[locale as keyof typeof i18n];
  
  const [templateType, setTemplateType] = useState<TemplateType>('promotion');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateEmail = async () => {
    if (!productName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/email-template-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: t[templateType],
          product: `${productName} ${productPrice ? `(${productPrice})` : ''} ${discount ? `${discount}折扣` : ''}`,
          audience: '电商消费者',
          tone: templateType === 'promotion' ? '促销兴奋' : templateType === 'welcome' ? '友好热情' : templateType === 'thankyou' ? '真诚感谢' : '温和提醒',
          locale
        })
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedEmail(data);
      } else {
        setError(data.error || t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = () => {
    if (!generatedEmail) return;
    const fullEmail = `Subject: ${generatedEmail.subjects?.[0] || ''}\n\n${generatedEmail.body || ''}\n\n${generatedEmail.signature || ''}`;
    navigator.clipboard.writeText(fullEmail);
  };

  const loadSample = () => {
    setProductName(t.sampleProduct);
    setProductPrice(t.samplePrice);
    setDiscount(t.sampleDiscount);
    setDeadline(t.sampleDeadline);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">{t.templateType}</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {(['welcome', 'promotion', 'reminder', 'thankyou', 'abandoned'] as TemplateType[]).map(type => (
              <button
                key={type}
                onClick={() => setTemplateType(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  templateType === type 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.productPrice}</label>
            <input
              type="text"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t.samplePrice}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.discount}</label>
            <input
              type="text"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="30%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.deadline}</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
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
            onClick={generateEmail}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
          >
            {loading ? t.generating : t.generate}
          </button>
        </div>
      </div>

      {generatedEmail && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{t.preview}</h2>
            <button
              onClick={copyEmail}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {t.copyEmail}
            </button>
          </div>

          {generatedEmail.subjects && generatedEmail.subjects.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="font-semibold text-gray-800 mb-3">{t.subject}</h3>
              <div className="space-y-2">
                {generatedEmail.subjects.map((s: string, i: number) => (
                  <div key={i} className="px-3 py-2 bg-indigo-50 rounded-lg text-indigo-700">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-800 px-4 md:px-6 py-4">
              <div className="flex items-center gap-2 text-white">
                <span className="text-lg">📧</span>
                <span className="font-medium">{t.body}</span>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                {generatedEmail.body || ''}
              </pre>
            </div>
          </div>

          {generatedEmail.signature && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="font-semibold text-gray-800 mb-3">{t.signature}</h3>
              <pre className="whitespace-pre-wrap text-gray-600 font-sans text-sm">
                {generatedEmail.signature}
              </pre>
            </div>
          )}

          {generatedEmail.cta && (
            <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4 md:p-6">
              <h3 className="font-semibold text-indigo-900 mb-3">{t.cta}</h3>
              <p className="text-indigo-800 font-medium">{generatedEmail.cta}</p>
            </div>
          )}

          {generatedEmail.tips && generatedEmail.tips.length > 0 && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 md:p-6">
              <h3 className="font-semibold text-yellow-900 mb-3">{t.tips}</h3>
              <ul className="space-y-2">
                {generatedEmail.tips.map((tip: string, i: number) => (
                  <li key={i} className="text-yellow-800 flex items-start">
                    <span className="mr-2">💡</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}