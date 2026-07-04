export const metadata = {
  title: 'हमारे बारे में | Korelyy - वैश्विक रचनाकारों के लिए मुफ्त ऑनलाइन टूल्स हब',
  description:
    'Korelyy टीम और हमारे मिशन से जानिए। हम AI, इमेज, PDF, ऑफिस, डेवलपर और क्रिएटिव श्रेणियों में 900+ ब्राउज़र-रेडी, गोपनीयता-प्रथम मुफ्त टूल चुनते हैं। 6 भाषाओं में 180+ देशों के उपयोगकर्ताओं के लिए उपलब्ध।',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">Korelyy के बारे में</h1>
      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-5">
        कम डाउनलोड। कम सेटअप। और असली काम बस एक ब्राउज़र टैब में।
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">हम कौन हैं</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            Korelyy स्वतंत्र डेवलपर्स, AI प्रोडक्ट मैनेजरों, बहुभाषी अनुवादकों और कंटेंट क्रिएटर्स की एक वितरित टीम है।
            2024 के मध्य में हमारे लॉन्च के बाद से, हमारी हर सुविधा एक सरल मिशन के चारों ओर बनाई गई है :
            <strong>दुनिया के सबसे बेहतरीन ब्राउज़र-नेटिव टूल्स को एक ही जगह लाना,</strong> ताकि किसी को भी बस एक इमेज
            का आकार बदलने के लिए 20 मिनट Google करने, बड़े-बड़े इंस्टॉलर डाउनलोड करने या ऐड पॉपअप बंद करने में समय न बर्बाद करना पड़े।
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            जून 2026 तक, Korelyy पर <strong>900+ मैन्युअली जाँचे गए मुफ्त टूल्स</strong> उपलब्ध हैं — AI लेखन और इमेज
            जनरेशन, PDF / इमेज / ऑडियो रूपांतरण, टेक्स्ट यूटिलिटीज, डेवलपर सहायता, ऑफिस प्रोडक्टिविटी और रचनात्मक
            खेल। साइट को <strong>हिंदी, अंग्रेज़ी, फ़्रेंच, स्पैनिश, चीनी और अरबी</strong> में पूरी तरह से स्थानीयकृत
            किया गया है, और 180+ देशों व क्षेत्रों में रचनाकारों, छात्रों और पेशेवरों द्वारा रोज़ाना उपयोग किया जाता है।
          </p>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">हम किस पर विश्वास करते हैं</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">1. 100% मुफ्त, बिना किसी बंधन के</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Korelyy पर हर मुख्य टूल मुफ्त में उपलब्ध है। कोई बाध्य साइनअप नहीं। कोई फ़ोन नंबर नहीं। कोई « ऐड देखें
                और अनलॉक करें » पेमेंट वॉल नहीं।
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">2. डिज़ाइन में ही गोपनीयता</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                अपलोड की गई इमेज, डॉक्यूमेंट और मीडिया का उपयोग केवल आपके काम के लिए किया जाता है और एक घंटे के भीतर
                स्वतः हटा दिया जाता है। किसी भी चीज़ को AI ट्रेनिंग डेटा के रूप में दोबारा इस्तेमाल नहीं किया जाता।
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">3. मानव-समीक्षित। कोई डार्क पैटर्न नहीं।</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                हमारी टीम हर सूचीबद्ध टूल को व्यक्तिगत रूप से परखती है। बंडल इंस्टॉलर, नकली « डाउनलोड » बटन और बाध्य
                रीडायरेक्ट को Korelyy में जगह नहीं मिलती।
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">4. स्थानीयकृत और पारदर्शी</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                गोपनीयता नीति, अस्वीकरण, कुकी सेटिंग्स और संपर्क चैनल सभी 6 भाषाओं में उपलब्ध हैं, क्षेत्रीय डेटा संरक्षण
                कानूनों के अनुसार।
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">किसी डाउनलोड पोर्टल की बजाय Korelyy क्यों चुनें</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            एक क्लासिक सॉफ्टवेयर डाउनलोड साइट पर आप 5 टैब खोलते हैं, 3 टूलबार लेते हैं और फिर भी खफा होकर लौटते हैं।
            Korelyy केवल उन्हीं टूल्स को सूचीबद्ध करता है जो <strong>सीधे आपके ब्राउज़र में चलते हैं</strong> :
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 leading-relaxed">
            <li>कोई exe / dmg / apk इंस्टॉलर नहीं। <strong>लिंक खोलें, उपयोग करें, बंद करें।</strong> डिस्क पर कोई भार नहीं।</li>
            <li>वास्तव में क्रॉस-प्लेटफॉर्म : Windows, macOS, Linux, iOS, Android, टैबलेट और कम-ज्ञात ब्राउज़र सभी एक जैसा व्यवहार करते हैं।</li>
            <li>क्रिएटर्स के लिए अनुकूल : कॉपीराइटिंग, इमेज कंप्रेशन, PDF स्प्लिटिंग, AI रीराइटिंग, सबटाइटल एक्सट्रैक्शन, रंग रूपांतरण एक ही जगह।</li>
            <li>डेवलपर्स के लिए अनुकूल : Regex टेस्टर, JSON फॉर्मेटर, Base64, QR कोड, UUID और टाइमस्टैंप टूल्स हमेशा एक क्लिक दूर।</li>
          </ul>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">संपर्क करें</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            हम हर तरह की प्रतिक्रिया का स्वागत करते हैं : टूल खराब होना, बुरा ऐड, नए टूल का विचार, भागीदारी या हटाने
            की अनुरोध। हमारी छोटी टीम हर ईमेल को व्यक्तिगत रूप से पढ़ती है।
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">विज्ञापन और भागीदारी</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">सहायता, गोपनीयता और हटाना</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
          </div>
          <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            हम हर Genuine संदेश का 1 कार्यदिवस में जवाब देते हैं। Korelyy को बेहतर बनाने में आपकी मदद के लिए धन्यवाद।
          </p>
        </section>
      </div>
    </div>
  );
}
