import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('privacy');
  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>{t('title')}</h1>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>版本号：V1.0｜生效日期：2026年6月22日</p>

      <div className='prose prose-gray dark:prose-invert max-w-none'>
        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>前言</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            我方严格遵循《个人信息保护法》《网络安全法》《数据安全法》，坚持合法、正当、必要、最小收集原则，本政策向您完整告知我们收集何种个人信息、用途、存储期限、您享有的全部隐私权利。使用本站服务即代表您同意本政策约定；如不同意收集非必要Cookie/追踪信息，可在浏览器关闭Cookie，但部分工具功能可能受限。
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>一、信息处理主体</h2>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li><strong>数据处理者</strong>：Korelyy</li>
            <li><strong>联系邮箱（隐私维权专用）</strong>：173050738@qq.com</li>
            <li><strong>网站域名</strong>：korelyy.com</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>二、我们收集的信息及使用目的（分两类：必要信息、非必要可选信息）</h2>
          
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>（一）为提供工具服务必须收集的必要信息（不收集则无法使用工具）</h3>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li><strong>设备与访问日志</strong>：访问IP地址、浏览器类型、系统版本、访问时间、页面停留记录、工具操作记录。用途：服务器安全防护、防攻击、统计工具访问量、排查故障、配合公安网安日志留存要求（日志留存不少于6个月）。</li>
            <li><strong>用户上传文件内容</strong>：图片、文档、文本等处理素材。用途：仅完成您发起的格式转换、编辑、生成操作；处理完毕自动删除，不用于其他用途。</li>
            <li><strong>付费用户额外必要信息</strong>：支付订单号、支付渠道返回的交易凭证（不收集银行卡、微信支付密码）。用途：对账、会员权限发放、处理订单咨询、退款核验。</li>
          </ul>

          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>（二）非必要、可选收集信息（您可自主拒绝，不影响基础工具使用）</h3>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li><strong>Cookie与行为追踪标识</strong>：广告联盟用于个性化广告的设备标识符、页面点击埋点。用途：展示匹配您偏好的广告、统计广告转化；您可随时在浏览器清除Cookie撤回同意。</li>
            <li><strong>主动提交信息</strong>：您发邮件咨询、投诉时自愿提供的邮箱、姓名。用途：回复您的问题、处理投诉侵权工单，咨询结束后留存记录不超过1年。</li>
          </ul>

          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            <strong>明确说明：我站不会主动收集以下敏感个人信息</strong><br/>
            不会强制收集手机号、身份证号、人脸、通讯录、相册定位、银行卡完整卡号、短信记录等敏感信息；仅您主动上传证件图片处理时临时获取图片内容，处理完成立即清除。
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>三、信息存储、清理与数据出境规则</h2>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li><strong>存储地域</strong>：所有用户数据、访问日志、临时文件均存储于中国大陆合规服务器。</li>
            <li><strong>存储时限</strong>：
              <ul className='list-disc list-inside ml-4 mt-2'>
                <li>上传处理文件：免费版1小时自动删除，付费版最长24小时；</li>
                <li>访问安全日志：强制留存6个月，到期自动彻底销毁；</li>
                <li>咨询邮件记录：保存1年，逾期删除；</li>
                <li>付费订单记录：按财税法规留存3年。</li>
              </ul>
            </li>
            <li><strong>数据出境限制</strong>：未经您单独书面同意，不会将您的个人信息、上传文件传输至境外服务器、第三方海外服务商。</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>四、第三方共享信息情形（仅以下合法场景可共享，无其他出售/倒卖行为）</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            我方绝不向第三方出售、出租用户个人信息；仅在下列法定场景有限共享：
          </p>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>经您主动、明确单独同意后共享；</li>
            <li>配合公安、网信、法院、市场监管等国家机关依法调取，出具正规文书；</li>
            <li>合作服务商（支付平台、CDN加速、服务器厂商、广告联盟）：服务商仅能按约定用途处理数据，且签署数据保密协议，无权私自使用；</li>
            <li>公司合并、转让、破产等主体变更，接收方继续遵守本隐私政策约束，提前公示告知用户。</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>五、您享有的个人信息法定权利</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            依据《个人信息保护法》，您随时享有以下权利，发送邮件至173050738@qq.com即可申请，核验身份后15个工作日内回复处理，不设置不合理门槛：
          </p>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li><strong>知情权、复制权</strong>：查询我方存储的您的访问日志、订单记录，申请导出副本；</li>
            <li><strong>删除权</strong>：要求立即清除所有您的临时文件、历史操作记录；</li>
            <li><strong>撤回同意权</strong>：随时关闭个性化广告追踪Cookie，撤回不影响此前合法数据处理；</li>
            <li><strong>更正权</strong>：订单、咨询信息有误可申请更正；</li>
            <li><strong>限制处理权</strong>：要求暂停非必要信息收集；</li>
            <li><strong>投诉申诉权</strong>：对我方隐私处理行为不满，可向网信部门、12377举报，也可直接联系我方维权邮箱协商。</li>
          </ul>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            <strong>禁止条款</strong>：我方不得因您撤回Cookie同意、申请删除数据而拒绝提供基础免费工具服务。
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>六、数据安全保护措施</h2>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li><strong>传输加密</strong>：全站启用HTTPS加密传输，防止文件、访问数据中途窃取；</li>
            <li><strong>访问权限隔离</strong>：服务器后台分级权限，仅运维人员可查看加密日志，禁止人工浏览用户上传文件；</li>
            <li><strong>病毒与违禁内容查杀</strong>：上传接口部署恶意文件检测、涉敏内容机器拦截；</li>
            <li><strong>定期安全巡检</strong>：修复漏洞，防范入侵、数据泄露风险。</li>
          </ul>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            若发生个人信息泄露、篡改事件，我方将第一时间采取补救措施，并按法规向监管报备、通知受影响用户。
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>七、未成年人信息保护</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            未满18周岁未成年人请勿主动提交任何个人信息；若监护人发现子女未经许可上传隐私文件，可发邮件申请全部删除，我方立即清理相关数据。
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>八、Cookie使用说明</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            我站使用两类Cookie：功能性Cookie（维持登录、工具会话，必须启用）；广告统计Cookie（可选，用于个性化推广）。
          </p>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            您可通过浏览器设置拒绝、清除广告类Cookie，仅功能性Cookie保留，不影响基础转换、处理功能。
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>九、政策更新与通知</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            我方更新本隐私政策将在网站法律专区公示，重大变更（数据收集范围调整、数据出境规则修改）将弹窗提示用户；更新后持续使用即视为接受新版政策。
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>十、投诉渠道</h2>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li><strong>隐私相关疑问、删除数据申请、侵权投诉、信息泄露反馈</strong>：173050738@qq.com</li>
            <li><strong>监管投诉渠道</strong>：国家网信办举报中心12377</li>
          </ul>
        </section>
      </div>
    </div>
  );
}