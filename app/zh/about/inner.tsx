export const metadata = {
  title: '关于我们 | Korelyy - 全球免费在线工具聚合平台',
  description:
    '了解 Korelyy 团队与使命。我们是一家专注浏览器端即用型免费工具的全球聚合平台，已上线 900+ 工具，覆盖 AI、图像处理、格式转换、办公文案等 6 大场景，支持 6 种语言、服务全球 180+ 国家与地区用户。',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">关于 Korelyy</h1>
      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-5">
        让每一次创作、工作与学习，都少一点繁琐工具下载，多一点即开即用的效率。
      </p>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">我们是谁</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            Korelyy 是一支由独立开发者、AI 产品经理、多语种译者与内容创作者组成的分布式团队。
            自 2024 年中上线以来，我们的全部工作都围绕一个朴素目标展开：
            <strong>把全球最好用的「浏览器即开即用型」工具，整理到同一个地方，</strong>
            让用户不必再在搜索引擎里翻页、下载捆绑软件、忍受弹窗广告，就能直接完成手头的任务。
          </p>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            截至 2026 年 6 月，Korelyy 已在站点内上线并人工审核 <strong>900+ 个免费工具</strong>，
            内容覆盖 AI 写作与绘画、PDF/图片/音视频格式转换、文本处理、代码开发辅助、办公效率、
            趣味创意 6 大类目，支持<strong>中文、英文、法文、西班牙文、印地语、阿拉伯语 6 种语言</strong>，
            日常用户来自全球 180 多个国家与地区。
          </p>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">我们相信什么</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">① 100% 免费，零门槛</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                站内所有核心工具均可免费使用，不强制注册、不绑定手机号、不设置「看广告解锁」式付费墙。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">② 隐私优先，用完即焚</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                用户上传的图片、文档、音视频等素材仅用于完成本次操作，1 小时内自动销毁，绝不沉淀为训练数据。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">③ 人工审核，拒绝恶意跳转</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                每一款收录工具都会经过团队人工试用，拒绝捆绑下载、诱导点击、强制跳转第三方页等行为。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3.5 sm:p-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">④ 本地化透明合规</h3>
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                全 6 语种同步提供隐私政策、免责声明、Cookie 设置与联系渠道，遵守各地区数据保护法规。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">为什么选择 Korelyy，而不是传统软件下载站</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            传统软件下载站的核心困扰，是「我只想把一张图片转成 PDF，却被迫安装了全家桶」。
            Korelyy 只收录<strong>浏览器端可直接运行的在线工具</strong>：
          </p>
          <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 leading-relaxed">
            <li>无需下载安装 exe / dmg / apk，<strong>打开链接即可使用</strong>，不占硬盘、不留注册表垃圾；</li>
            <li>跨平台天然可用：Windows、macOS、Linux、iOS、Android、鸿蒙、平板浏览器全部一致；</li>
            <li>对创作者特别友好：文案润色、图片压缩、PDF 拆分、AI 改写、字幕提取、色彩转换一次搞定；</li>
            <li>对开发者同样实用：正则测试、JSON 格式化、Base64、二维码、UUID、时间戳转换随时调用。</li>
          </ul>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3">联系我们</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            我们欢迎任何形式的反馈：工具失效、广告投诉、新工具建议、商务合作、侵权下架，都可以直接联系团队。
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">广告合作 / 商务邮箱</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">技术支持 / 隐私维权 / 投诉</div>
              <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-medium">173050738@qq.com</div>
            </div>
          </div>
          <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            收到邮件后我们会在 1 个工作日内回复，感谢你帮助 Korelyy 变得更好。
          </p>
        </section>
      </div>
    </div>
  );
}
