'use client';

import { useState, useMemo } from 'react';

interface EmailTemplateGeneratorProps {
  locale?: string;
}

const i18n = {
  zh: { title:"电商邮件模板生成器", subtitle:"选择邮件类型，一键生成专业营销邮件", templateType:"邮件类型", productName:"产品名称", productPrice:"产品价格", discount:"折扣", deadline:"截止日期", generate:"生成邮件", copyEmail:"复制邮件", preview:"预览", subject:"邮件主题", body:"邮件正文", welcome:"欢迎邮件", promotion:"促销邮件", reminder:"提醒邮件", thankyou:"感谢邮件", abandoned:"弃购召回", sample:"加载示例", sampleProduct:"无线蓝牙耳机", samplePrice:"¥299", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"暂无数据" },
  en: { title:"Email Template Generator", subtitle:"Select email type and generate professional marketing emails", templateType:"Template Type", productName:"Product Name", productPrice:"Product Price", discount:"Discount", deadline:"Deadline", generate:"Generate Email", copyEmail:"Copy Email", preview:"Preview", subject:"Subject", body:"Body", welcome:"Welcome", promotion:"Promotion", reminder:"Reminder", thankyou:"Thank You", abandoned:"Abandoned Cart", sample:"Load Sample", sampleProduct:"Wireless Bluetooth Earbuds", samplePrice:"$49", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"No data" },
  es: { title:"Generador de Plantillas de Correo", subtitle:"Selecciona el tipo de correo y genera correos de marketing profesionales", templateType:"Tipo de Correo", productName:"Nombre del Producto", productPrice:"Precio del Producto", discount:"Descuento", deadline:"Fecha Límite", generate:"Generar Correo", copyEmail:"Copiar Correo", preview:"Previsualizar", subject:"Asunto", body:"Cuerpo", welcome:"Bienvenida", promotion:"Promoción", reminder:"Recordatorio", thankyou:"Gracias", abandoned:"Recuperación de Carrito", sample:"Cargar Ejemplo", sampleProduct:"Auriculares Bluetooth Inalámbricos", samplePrice:"$49", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"Sin datos" },
  fr: { title:"Générateur de Modèles d'Email", subtitle:"Sélectionnez le type d'email et générez des emails marketing professionnels", templateType:"Type d'Email", productName:"Nom du Produit", productPrice:"Prix du Produit", discount:"Réduction", deadline:"Date Limite", generate:"Générer Email", copyEmail:"Copier Email", preview:"Aperçu", subject:"Objet", body:"Corps", welcome:"Bienvenue", promotion:"Promotion", reminder:"Rappel", thankyou:"Merci", abandoned:"Panier Abandonné", sample:"Charger l'Exemple", sampleProduct:"Écouteurs Bluetooth Sans Fil", samplePrice:"49€", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"Aucune donnée" },
  hi: { title:"ईमेल टेम्पलेट जेनरेटर", subtitle:"ईमेल प्रकार चुनें और पेशेवर मार्केटिंग ईमेल उत्पन्न करें", templateType:"ईमेल प्रकार", productName:"उत्पाद नाम", productPrice:"उत्पाद की कीमत", discount:"छूट", deadline:"अंतिम तिथि", generate:"ईमेल उत्पन्न करें", copyEmail:"ईमेल कॉपी करें", preview:"पूर्वावलोकन", subject:"विषय", body:"विषय में", welcome:"स्वागत", promotion:"प्रचार", reminder:"अनुस्मारक", thankyou:"धन्यवाद", abandoned:"छोड़ा हुआ कार्ट", sample:"उदाहरण लोड करें", sampleProduct:"वायरलेस ब्लूटूथ ईयरबड्स", samplePrice:"₹1,999", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"डेटा नहीं" },
  ar: { title:"مُنشئ قوالب البريد الإلكتروني", subtitle:"حدد نوع البريد الإلكتروني وقم بإنشاء رسائل تسويقية احترافية", templateType:"نوع البريد", productName:"اسم المنتج", productPrice:"سعر المنتج", discount:"الخصم", deadline:"تاريخ النهاية", generate:"إنشاء البريد", copyEmail:"نسخ البريد", preview:"معاينة", subject:"الموضوع", body:"المحتوى", welcome:"ترحيب", promotion:"تسويق", reminder:"تذكير", thankyou:"شكراً", abandoned:"استعادة السلة", sample:"تحميل المثال", sampleProduct:"سماعات أذن بلوتوث لاسلكية", samplePrice:"299$", sampleDiscount:"30%", sampleDeadline:"2024-12-31", noData:"لا توجد بيانات" }
};

const TEMPLATES: Record<string, { subject: string; body: string }> = {
  'welcome': {
    subject: {
      zh: '🎉 欢迎加入 {productName} 大家庭！',
      en: '🎉 Welcome to the {productName} family!',
      es: '🎉 ¡Bienvenido a la familia {productName}!',
      fr: '🎉 Bienvenue dans la famille {productName} !',
      hi: '🎉 {productName} परिवार में आपका स्वागत है!',
      ar: '🎉 مرحباً بك في عائلة {productName}!'
    },
    body: {
      zh: '尊敬的用户，\n\n感谢您注册 {productName}！\n\n我们很高兴您加入我们的大家庭。为了庆祝您的加入，我们为您准备了专属新人优惠：\n\n🎁 首单立减 {discount}\n\n立即开始购物：[点击这里]\n\n如有任何问题，请随时联系我们的客服团队。\n\n祝您购物愉快！\n\n{productName} 团队',
      en: 'Dear Customer,\n\nThank you for signing up for {productName}!\n\nWe are thrilled to have you join our family. To celebrate your joining, we have prepared an exclusive welcome offer:\n\n🎁 {discount} off your first order\n\nStart shopping now: [Click Here]\n\nIf you have any questions, feel free to contact our support team.\n\nHappy shopping!\n\nThe {productName} Team',
      es: 'Estimado Cliente,\n\n¡Gracias por registrarte en {productName}!\n\nEstamos encantados de que te unas a nuestra familia. Para celebrar tu llegada, hemos preparado una oferta exclusiva de bienvenida:\n\n🎁 {discount} de descuento en tu primera compra\n\nEmpieza a comprar ahora: [Haz clic aquí]\n\nSi tienes preguntas, no dudes en contactar con nuestro equipo de soporte.\n\n¡Feliz compra!\n\nEl Equipo de {productName}',
      fr: 'Cher Client,\n\nMerci de vous être inscrit sur {productName} !\n\nNous sommes ravis de vous accueillir dans notre famille. Pour célébrer votre arrivée, nous avons préparé une offre exclusive de bienvenue :\n\n🎁 {discount} de réduction sur votre première commande\n\nCommencez à acheter maintenant : [Cliquez ici]\n\nSi vous avez des questions, n\'hésitez pas à contacter notre équipe de support.\n\nBonne shopping !\n\nL\'Équipe {productName}',
      hi: 'प्रिय ग्राहक,\n\n{productName} के लिए पंजीकृत होने के लिए धन्यवाद!\n\nहमें आपको हमारे परिवार में शामिल होते देखकर बहुत खुशी हुई है। आपके जुड़ने का जश्न मनाने के लिए, हमने एक विशेष स्वागत प्रस्ताव तैयार किया है:\n\n🎁 आपके पहले ऑर्डर पर {discount} की छूट\n\nअब खुदरा खरीदारी शुरू करें: [यहां क्लिक करें]\n\nयदि आपके कोई प्रश्न हैं, तो हमारी सपोर्ट टीम से संपर्क करने में संकोच न करें।\n\nखुश खरीदारी!\n\n{productName} टीम',
      ar: 'عزيزي العميل،\n\nشكراً لتسجيلك في {productName}!\n\nنحن سعيدون بكونك جزءاً من عائلتنا. لتهنئة انضمامك، قمنا بإعداد عرض ترحيبي حصري:\n\n🎁 خصم {discount} على أول طلبك\n\nابدأ التسوق الآن: [انقر هنا]\n\nإذا كان لديك أي أسئلة، لا تتردد في الاتصال فريق الدعم لدينا.\n\nتسوق سعيد!\n\nفريق {productName}'
    }
  },
  'promotion': {
    subject: {
      zh: '🔥 {productName} 限时特惠！{discount} 折扣等你来抢！',
      en: '🔥 {productName} Flash Sale! {discount} off - Limited Time Only!',
      es: '🔥 ¡Oferta Especial en {productName}! {discount} de descuento - Por Tiempo Limitado!',
      fr: '🔥 Soldes Flash sur {productName} ! {discount} de réduction - Temps Limité !',
      hi: '🔥 {productName} फ्लैश सेल! {discount} की छूट - सीमित समय तक!',
      ar: '🔥 عروض سريعة على {productName}! خصم {discount} - لفترة محدودة!'
    },
    body: {
      zh: '亲爱的用户，\n\n好消息！{productName} 正在进行限时特惠活动！\n\n🎯 原价 {productPrice}\n🎯 现价 {productPrice}（省 {discount}）\n\n⏰ 活动截止：{deadline}\n\n库存有限，先到先得！立即抢购：[点击这里]\n\n错过再等一年！\n\n{productName} 团队',
      en: 'Dear Customer,\n\nGreat news! {productName} is on flash sale!\n\n🎯 Original Price: {productPrice}\n🎯 Sale Price: {productPrice} (Save {discount})\n\n⏰ Offer ends: {deadline}\n\nLimited stock available! Shop now: [Click Here]\n\nDon\'t miss this chance!\n\nThe {productName} Team',
      es: 'Estimado Cliente,\n\n¡Gran noticia! {productName} está en oferta flash!\n\n🎯 Precio Original: {productPrice}\n🎯 Precio de Oferta: {productPrice} (Ahorra {discount})\n\n⏰ La oferta finaliza: {deadline}\n\n¡Stock limitado! ¡Compra ahora: [Haz clic aquí]\n\nNo te pierdas esta oportunidad!\n\nEl Equipo de {productName}',
      fr: 'Cher Client,\n\nExcellentes nouvelles ! {productName} est en soldes flash !\n\n🎯 Prix Original : {productPrice}\n🎯 Prix Soldes : {productPrice} (Économisez {discount})\n\n⏰ Offre valable jusqu\'au : {deadline}\n\nStock limité ! Achetez maintenant : [Cliquez ici]\n\nNe manquez pas cette occasion !\n\nL\'Équipe {productName}',
      hi: 'प्रिय ग्राहक,\n\nबड़ी खबर! {productName} पर फ्लैश सेल चल रही है!\n\n🎯 मूल कीमत: {productPrice}\n🎯 सेल कीमत: {productPrice} ({discount} बचत)\n\n⏰ ऑफर समाप्त होती है: {deadline}\n\nसीमित स्टॉक उपलब्ध! अभी खरीदें: [यहां क्लिक करें]\n\nइस अवसर को मत छोड़ो!\n\n{productName} टीम',
      ar: 'عزيزي العميل،\n\nأخبار جيدة! {productName} في عروض سريعة!\n\n🎯 السعر الأصلي: {productPrice}\n🎯 سعر العرض: {productPrice} (وفّر {discount})\n\n⏰ تنتهي العرض: {deadline}\n\nمخزون محدود! اشتر الآن: [انقر هنا]\n\nلا تفوت هذه الفرصة!\n\nفريق {productName}'
    }
  },
  'reminder': {
    subject: {
      zh: '📅 别忘了！{productName} 优惠即将结束',
      en: '📅 Don\'t forget! {productName} offer is ending soon',
      es: '📅 ¡No olvides! La oferta de {productName} está a punto de terminar',
      fr: '📅 N\'oubliez pas ! L\'offre {productName} se termine bientôt',
      hi: '📅 भूल मत जाओ! {productName} ऑफर जल्द ही समाप्त हो रही है',
      ar: '📅 لا تنسَ! عرض {productName} سينتهي قريباً'
    },
    body: {
      zh: '亲爱的用户，\n\n我们注意到您对 {productName} 很感兴趣！\n\n🎁 当前优惠：{discount} 折扣\n⏰ 优惠截止：{deadline}\n\n仅剩最后机会，立即购买：[点击这里]\n\n如有任何疑问，随时联系我们！\n\n{productName} 团队',
      en: 'Dear Customer,\n\nWe noticed you\'re interested in {productName}!\n\n🎁 Current Offer: {discount} off\n⏰ Offer ends: {deadline}\n\nLast chance to save! Shop now: [Click Here]\n\nFeel free to contact us with any questions!\n\nThe {productName} Team',
      es: 'Estimado Cliente,\n\n¡Notamos que estás interesado en {productName}!\n\n🎁 Oferta Actual: {discount} de descuento\n⏰ La oferta finaliza: {deadline}\n\n¡Última oportunidad para ahorrar! Compra ahora: [Haz clic aquí]\n\nNo dudes en contactarnos con cualquier pregunta!\n\nEl Equipo de {productName}',
      fr: 'Cher Client,\n\nNous avons remarqué que vous êtes intéressé par {productName} !\n\n🎁 Offre Actuelle : {discount} de réduction\n⏰ Offre valable jusqu\'au : {deadline}\n\nDernière chance d\'économiser ! Achetez maintenant : [Cliquez ici]\n\nN\'hésitez pas à nous contacter pour toute question !\n\nL\'Équipe {productName}',
      hi: 'प्रिय ग्राहक,\n\nहमने देखा कि आप {productName} में रुचि रखते हैं!\n\n🎁 वर्तमान ऑफर: {discount} की छूट\n⏰ ऑफर समाप्त होती है: {deadline}\n\nबचत करने का आखिरी मौका! अभी खरीदें: [यहां क्लिक करें]\n\nकिसी भी प्रश्न के लिए हमसे संपर्क करने में संकोच न करें!\n\n{productName} टीम',
      ar: 'عزيزي العميل،\n\nلقد لاحظنا أنك مهتم بـ {productName}!\n\n🎁 العرض الحالي: خصم {discount}\n⏰ تنتهي العرض: {deadline}\n\nآخر فرصة لتوفير! اشتر الآن: [انقر هنا]\n\nلا تتردد في الاتصال بنا لأي أسئلة!\n\nفريق {productName}'
    }
  },
  'thankyou': {
    subject: {
      zh: '💝 感谢您的购买！{productName} 已发货',
      en: '💝 Thank you for your purchase! {productName} has been shipped',
      es: '💝 ¡Gracias por tu compra! {productName} ha sido enviado',
      fr: '💝 Merci pour votre achat ! {productName} a été expédié',
      hi: '💝 आपकी खरीदारी के लिए धन्यवाद! {productName} शिप हो गया है',
      ar: '💝 شكراً لشرائك! {productName} تم شحنه'
    },
    body: {
      zh: '亲爱的用户，\n\n感谢您购买 {productName}！\n\n📦 订单已发货，预计 {deadline} 前送达。\n\n您可以点击这里查看物流信息：[追踪订单]\n\n如有任何问题，请随时联系我们。\n\n再次感谢您的信任！\n\n{productName} 团队',
      en: 'Dear Customer,\n\nThank you for purchasing {productName}!\n\n📦 Your order has been shipped, expected delivery by {deadline}.\n\nTrack your order here: [Track Order]\n\nFeel free to contact us with any questions.\n\nThank you again for your trust!\n\nThe {productName} Team',
      es: 'Estimado Cliente,\n\n¡Gracias por comprar {productName}!\n\n📦 Su pedido ha sido enviado, entrega esperada antes del {deadline}.\n\nPuede realizar un seguimiento de su pedido aquí: [Seguimiento de Pedido]\n\nNo dude en contactarnos con cualquier pregunta.\n\n¡Gracias de nuevo por su confianza!\n\nEl Equipo de {productName}',
      fr: 'Cher Client,\n\nMerci d\'avoir acheté {productName} !\n\n📦 Votre commande a été expédiée, livraison prévue d\'ici {deadline}.\n\nSuivez votre commande ici : [Suivre Commande]\n\nN\'hésitez pas à nous contacter pour toute question.\n\nMerci encore pour votre confiance !\n\nL\'Équipe {productName}',
      hi: 'प्रिय ग्राहक,\n\n{productName} खरीदने के लिए धन्यवाद!\n\n📦 आपका ऑर्डर शिप हो गया है, {deadline} तक वितरित होने की उम्मीद है।\n\nअपना ऑर्डर यहां ट्रैक करें: [ऑर्डर ट्रैक करें]\n\nकिसी भी प्रश्न के लिए हमसे संपर्क करने में संकोच न करें।\n\nआपके विश्वास के लिए फिर से धन्यवाद!\n\n{productName} टीम',
      ar: 'عزيزي العميل،\n\nشكراً لشراء {productName}!\n\n📦 تم شحن طلبك، التسليم المتوقع قبل {deadline}.\n\nيمكنك متابعة طلبك هنا: [متابعة الطلب]\n\nلا تتردد في الاتصال بنا لأي أسئلة.\n\nشكراً مجدداً على ثقتك!\n\nفريق {productName}'
    }
  },
  'abandoned': {
    subject: {
      zh: '😱 您的购物车还在等您！{productName} 优惠继续',
      en: '😱 Your cart is waiting! {productName} offer continues',
      es: '😱 ¡Tu carrito te espera! La oferta de {productName} continúa',
      fr: '😱 Votre panier vous attend ! L\'offre {productName} continue',
      hi: '😱 आपका कार्ट आपका इंतजार कर रहा है! {productName} ऑफर जारी है',
      ar: '😱 سلتك تنتظرك! عرض {productName} مستمر'
    },
    body: {
      zh: '亲爱的用户，\n\n我们注意到您在购物车中留下了 {productName}！\n\n💰 不要让这个好机会溜走！\n💰 限时优惠：{discount} 折扣\n\n立即回到购物车：[继续购买]\n\n优惠截止：{deadline}\n\n期待为您服务！\n\n{productName} 团队',
      en: 'Dear Customer,\n\nWe noticed you left {productName} in your cart!\n\n💰 Don\'t miss this great opportunity!\n💰 Limited time offer: {discount} off\n\nReturn to your cart: [Continue Shopping]\n\nOffer ends: {deadline}\n\nWe look forward to serving you!\n\nThe {productName} Team',
      es: 'Estimado Cliente,\n\n¡Notamos que dejaste {productName} en tu carrito!\n\n💰 ¡No dejes escapar esta gran oportunidad!\n💰 Oferta por tiempo limitado: {discount} de descuento\n\nRegresa a tu carrito: [Continuar Comprando]\n\nLa oferta finaliza: {deadline}\n\n¡Esperamos servirte!\n\nEl Equipo de {productName}',
      fr: 'Cher Client,\n\nNous avons remarqué que vous avez laissé {productName} dans votre panier !\n\n💰 Ne manquez pas cette excellente occasion !\n💰 Offre limitée dans le temps : {discount} de réduction\n\nRetournez à votre panier : [Continuer les Achats]\n\nOffre valable jusqu\'au : {deadline}\n\nNous avons hâte de vous servir !\n\nL\'Équipe {productName}',
      hi: 'प्रिय ग्राहक,\n\nहमने देखा कि आपने {productName} को अपने कार्ट में छोड़ा है!\n\n💰 इस शानदार अवसर को मत छोड़ो!\n💰 सीमित समय की ऑफर: {discount} की छूट\n\nअपने कार्ट में वापस जाएं: [खरीदारी जारी रखें]\n\nऑफर समाप्त होती है: {deadline}\n\nआपकी सेवा करने की हमें उम्मीद है!\n\n{productName} टीम',
      ar: 'عزيزي العميل،\n\nلقد لاحظنا أنك تركت {productName} في سلتك!\n\n💰 لا تفوت هذه الفرصة الرائعة!\n💰 عرض محدود في الوقت: خصم {discount}\n\nارجع إلى سلتك: [استمرار التسوق]\n\nتنتهي العرض: {deadline}\n\nنتطلع إلى خدمتك!\n\nفريق {productName}'
    }
  }
};

type TemplateType = 'welcome' | 'promotion' | 'reminder' | 'thankyou' | 'abandoned';

export default function EmailTemplateGenerator({ locale = 'zh' }: EmailTemplateGeneratorProps) {
  const t = i18n[locale as keyof typeof i18n];
  
  const [templateType, setTemplateType] = useState<TemplateType>('promotion');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);

  const generateEmail = () => {
    const template = TEMPLATES[templateType];
    const subject = template.subject[locale]
      .replace('{productName}', productName || t.sampleProduct)
      .replace('{discount}', discount || t.sampleDiscount);
    
    const body = template.body[locale]
      .replace('{productName}', productName || t.sampleProduct)
      .replace('{productPrice}', productPrice || t.samplePrice)
      .replace('{discount}', discount || t.sampleDiscount)
      .replace('{deadline}', deadline || t.sampleDeadline);
    
    setGeneratedEmail({ subject, body });
  };

  const copyEmail = () => {
    if (!generatedEmail) return;
    const fullEmail = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
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

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadSample}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            {t.sample}
          </button>
          <button
            onClick={generateEmail}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            {t.generate}
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-800 px-4 md:px-6 py-4">
              <div className="flex items-center gap-2 text-white">
                <span className="text-lg">📧</span>
                <span className="font-medium">{t.subject}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
              <p className="text-indigo-600 font-medium">{generatedEmail.subject}</p>
            </div>

            <div className="p-4 md:p-6">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                {generatedEmail.body}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
