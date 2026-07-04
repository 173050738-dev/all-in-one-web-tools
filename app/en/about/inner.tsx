export const metadata = {
  title: 'About Us | Korelyy - Free Online Tools Hub for Global Creators',
  description:
    'Meet the Korelyy team and our mission. We curate 900+ browser-ready, privacy-first free tools across AI, image, PDF, office, developer and creative categories. Available in 6 languages to users in 180+ countries.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">About Korelyy</h1>
      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-5">
        Less downloading. Less setup. More actually getting your work done. One browser tab.
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">Who we are</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            Korelyy is a distributed team of independent developers, AI product managers, multilingual translators and
            content creators. Since our launch in mid-2024, every feature we ship serves one simple mission:
            <strong>bring the world&apos;s best browser-native tools under one roof,</strong> so nobody has to spend 20
            minutes Googling, downloading bloated installers or closing popup ads just to resize an image.
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            As of June 2026, Korelyy has <strong>900+ manually curated free tools</strong> live on the platform —
            covering AI writing &amp; image generation, PDF / image / audio conversion, text utilities, developer
            helpers, office productivity and creative play. The site is fully localized into
            <strong> English, Chinese, French, Spanish, Hindi and Arabic</strong>, and is used daily by creators,
            students and workers in 180+ countries and territories.
          </p>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">What we believe in</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">1. 100% free, zero lock-in</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Every core tool on Korelyy is free to use. No forced signup. No phone number. No &quot;watch an ad to
                unlock&quot; paywalls.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">2. Privacy-first by design</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Uploaded images, documents and media are only used for the task at hand and auto-deleted within an hour.
                Nothing is repurposed into AI training data.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">3. Human-reviewed. No dark patterns.</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Our team manually tests every listed tool. Bundled installers, fake &quot;Download&quot; buttons and
                forced redirects have no place on Korelyy.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">4. Localized &amp; transparent</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Privacy Policy, Disclaimer, Cookie settings and contact channels are provided in all 6 languages, in
                line with regional data-protection laws.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">Why Korelyy instead of a download portal</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            On a classic software download site, you open 5 tabs, get 3 toolbars and still walk away frustrated.
            Korelyy only lists <strong>tools that run directly in your browser</strong>:
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 leading-relaxed">
            <li>No exe / dmg / apk installers. <strong>Open the link, use it, close it.</strong> Zero disk footprint.</li>
            <li>Truly cross-platform: Windows, macOS, Linux, iOS, Android, tablets and niche browsers all work the same.</li>
            <li>Creator-friendly: copyediting, image compression, PDF splitting, AI rewriting, subtitle extraction, color conversions in one place.</li>
            <li>Developer-friendly: Regex tester, JSON formatter, Base64, QR codes, UUIDs and timestamp tools always one click away.</li>
          </ul>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">Get in touch</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            We welcome every kind of feedback: a broken tool, a bad ad, a tool idea, a partnership offer or a
            takedown request. Our small team reads every email personally.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Advertising &amp; Partnerships</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Support, Privacy &amp; Takedown</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
          </div>
          <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            We reply to every genuine message within 1 business day. Thanks for helping make Korelyy better.
          </p>
        </section>
      </div>
    </div>
  );
}
