export const metadata = {
  title: 'من نحن | Korelyy - مركز الأدوات المجانية عبر الإنترنت للمبدعين حول العالم',
  description:
    'تعرف على فريق Korelyy ومهمتنا. نختار أكثر من 900 أداة مجانية جاهزة في المتصفح مع التركيز على الخصوصية، عبر فئات الذكاء الاصطناعي والصور وPDF والمكاتب والتطوير والإبداع. متاح بـ 6 لغات لمستخدمي أكثر من 180 دولة.',
};

export default function AboutPage() {
  return (
    <div dir="rtl" className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">نبذة عن Korelyy</h1>
      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-5">
        عمليات تنزيل أقل. إعدادات أقل. إنجاز فعلي أكبر. كل ذلك في علامة تبويب متصفح واحدة.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">من نحن</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            Korelyy فريق موزع يتكون من مطوري برامج مستقلين، ومديري منتجات ذكاء اصطناعي، ومترجمين متعددي اللغات، ومنتجي محتوى.
            منذ إطلاقنا في منتصف عام 2024، تدور كل ميزة نضيفها حول هدف بسيط : <strong>تجميع أفضل الأدوات الأصلية عبر
            المتصفح في مكان واحد،</strong> حتى لا يضطر أحد لقضاء 20 دقيقة في البحث، أو تنزيل حزم تثبيت ضخمة، أو إغلاق نوافذ
            إعلانية منبثقة فقط لغياب حجم صورة.
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            بحلول يونيو 2026، يحتوي Korelyy على <strong>أكثر من 900 أداة مجانية تم مراجعتها يدوياً</strong> — تشمل الكتابة
            وتوليد الصور بالذكاء الاصطناعي، وتحويل ملفات PDF والصور والصوتيات، وأدوات النصوص، ومساعدات المطورين، والإنتاجية
            المكتبية، والألعاب الإبداعية. الموقع مترجم بالكامل إلى <strong>العربية والإنجليزية والفرنسية والإسبانية
            والهندية والصينية</strong>، ويستخدمه يومياً مبدعون وطلاب ومحترفون في أكثر من 180 دولة وإقليماً.
          </p>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">ماذا نؤمن به</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">١. مجاني ١٠٠٪ بدون قيود</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                كل الأداة الأساسية في Korelyy مجانية للاستخدام. لا تسجيل إجباري، لا رقم هاتف، ولا جدران دفع من نوع
                « شاهد إعلاناً لفتح الميزة ».
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">٢. الخصوصية عن طريق التصميم</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                الصور والمستندات والوسائط التي ترفعها لا تُستخدم إلا لإنجاز المهمة المطلوبة، ثم تُحذف تلقائياً خلال ساعة.
                لا شيء يتم إعادة توظيفه كبيانات تدريب للذكاء الاصطناعي.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">٣. مراجعة يدوية. لا خدع سوداء.</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                فريقنا يختبر كل أداة قبل إضافتها. لا مكان في Korelyy لحزم التثبيت المزعجة، أو أزرار « تنزيل » وهمية، أو
                عمليات إعادة توجيه إجبارية.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">٤. مترجم وشفاف</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                سياسة الخصوصية وإخلاء المسؤولية وإعدادات ملفات تعريف الارتباط وقنوات التواصل متاحة باللغات الست،
                بما يتوافق مع قوانين حماية البيانات الإقليمية.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">لماذا Korelyy بدلاً من بوابة تنزيلات تقليدية؟</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            في مواقع تنزيل البرامج التقليدية، تفتح 5 علامات تبويب وتثبت 3 أشرطة أدوات وتهرب محبطاً في النهاية.
            Korelyy لا يسوي إلا <strong>الأدوات التي تعمل مباشرة داخل المتصفح</strong> :
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 leading-relaxed">
            <li>لا حزم تثبيت exe / dmg / apk. <strong>افتح الرابط، استخدمه، أغلقه.</strong> لا يحتل مساحة القرص.</li>
            <li>يعمل عبر المنصات حقاً : ويندوز و macOS ولينكس و iOS و أندرويد والأجهزة اللوحية والمتصفحات النادرة بنفس الطريقة.</li>
            <li>مثالي للمبدعين : تنقيح النصوص وضغط الصور وتقسيم PDF وإعادة الكتابة بالذكاء واستخراج الترجمة وتحويل الألوان في مكان واحد.</li>
            <li>مثالي للمطورين : اختبار التعبيرات النظامية وتنسيق JSON و Base64 ورموز QR و UUID وأدوات الطوابع الزمنية بنقرة واحدة.</li>
          </ul>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">تواصل معنا</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            نرحب بكل أنواع الملاحظات : أداة معطلة، إعلان مزعج، فكرة أداة جديدة، عرض شراكة، أو طلب إزالة. فريقنا الصغير
            يقرأ كل بريد شخصياً.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الإعلانات والشراكات</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">الدعم والخصوصية وإزالة المحتوى</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
          </div>
          <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            نرد على كل رسالة حقيقية خلال يوم عمل واحد. شكراً لمساعدتنا في تحسين Korelyy.
          </p>
        </section>
      </div>
    </div>
  );
}
