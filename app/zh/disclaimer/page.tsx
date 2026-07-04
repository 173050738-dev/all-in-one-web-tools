export default function DisclaimerPage() {
  return (
    <div className='max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2'>数据处理规则及免责声明</h1>
      <p className='text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-5'>版本号：V1.0｜最后更新：2026年6月23日</p>

      <div className='prose prose-gray dark:prose-invert max-w-none'>
        <section className='mb-6 sm:mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 sm:p-5 border border-blue-200 dark:border-blue-800'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>前言</h2>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
            本页面详细说明了 Korelyy 工具站（以下简称"本站"，域名：korelyy.com）的数据处理规则和免责声明。使用我们的服务前，请仔细阅读以下全部条款。访问、浏览、上传文件、使用本站任意在线工具，即代表您已充分知悉、理解并无条件同意本免责声明全部约定。如不同意任一条款，请立即停止使用本站全部服务。
          </p>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
            本免责声明与《隐私政策》《用户服务协议》共同构成本站完整法律文件体系，三者具备同等法律效力，互为补充。若条款之间存在冲突，以保护用户合法权益、保护本站合法权益为原则进行解释。
          </p>
        </section>

        <section className='mb-6 sm:mb-8'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>一、数据处理规则</h2>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
            我们严格遵循《个人信息保护法》《网络安全法》《数据安全法》《消费者权益保护法》等法律法规，本站所有工具遵循以下数据处理原则：
          </p>

          <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2'>（一）本地处理优先</h3>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>大部分工具（如文本转换、编码解码、格式化、图片处理等）完全在您的浏览器中本地运行，数据不会离开您的设备，不会上传至我方服务器；</li>
            <li>本地处理模式下，我方完全无法获取、查看、存储您处理的内容，您对数据享有完全控制权；</li>
            <li>如工具明确标注"本地处理"标识，则代表全程无数据上传，无需担心隐私泄露。</li>
          </ul>

          <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2'>（二）即时删除原则（仅针对需服务器处理的工具）</h3>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>对于需要服务器端处理的工具，您上传的数据将在处理完成后立即从服务器删除：免费版 1 小时内自动删除，付费版最长不超过 24 小时；</li>
            <li>处理产生的临时文件、缓存文件同时清理，不留存任何备份；</li>
            <li>我方运维人员严格遵循权限隔离原则，无权限查看、下载、复制用户上传的具体文件内容；</li>
            <li>如因服务器故障导致文件未按时删除，您可通过 173050738@qq.com 反馈，我方将立即人工协助清理。</li>
          </ul>

          <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2'>（三）最小化收集原则</h3>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>我方只收集提供服务所必需的最少数据，严格遵循"合法、正当、必要、诚信"原则；</li>
            <li>不强制收集与服务无关的信息：包括但不限于手机号、身份证号、人脸信息、通讯录、地理位置（精确位置）、短信记录、银行卡完整信息等敏感个人信息；</li>
            <li>必要数据范围：仅包括访问 IP、浏览器类型、操作系统版本、访问时间、工具操作记录（用于安全防护、故障排查、合规日志留存）。</li>
          </ul>

          <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2'>（四）透明处理原则</h3>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>每个工具页面均明确说明数据处理方式（本地 / 服务器端）、数据保留期限、是否需要登录；</li>
            <li>涉及第三方服务的工具，公示第三方信息处理说明、隐私政策链接；</li>
            <li>数据处理规则发生变更时，在本站法律专区公示，确保用户知情权。</li>
          </ul>

          <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2'>（五）AI 工具特别说明</h3>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>本站收录的 AI 工具仅为外部链接跳转，不直接提供生成式 AI 服务；</li>
            <li>如第三方 AI 工具面向国内用户提供服务，须自行完成《生成式人工智能服务管理暂行办法》规定的算法备案；</li>
            <li>用户使用第三方 AI 工具时，须遵守该工具的使用协议、隐私政策，本站不为第三方 AI 工具的行为承担法律责任；</li>
            <li>禁止使用任何 AI 工具生成涉政、涉黄、涉暴、虚假人脸、伪造证件、诽谤他人等违法违规内容；</li>
            <li>本站对收录的 AI 工具定期合规审查，发现违规立即下架。</li>
          </ul>
        </section>

        <section className='mb-6 sm:mb-8'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>二、服务免责声明</h2>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
            使用本网站服务时，请注意以下免责条款，本站按"现状、可用"原则提供服务：
          </p>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li><strong>结果准确性免责</strong>：本站提供的工具仅供参考和辅助使用，不保证处理结果的绝对准确性、完整性、适用性。因工具结果误差、文件格式兼容问题导致的损失，我方不承担责任；</li>
            <li><strong>服务可用性免责</strong>：本站可能因系统维护、服务器升级、机房故障、运营商网络波动、不可抗力或其他原因暂时中断、变更、终止部分或全部服务，恕不另行通知；</li>
            <li><strong>间接损失免责</strong>：本站不对因使用本站工具而导致的任何直接、间接、附带、特殊、惩罚性或后果性损失承担责任，包括但不限于利润损失、业务中断、数据丢失、商誉损失、预期收益损失等；</li>
            <li><strong>第三方工具免责</strong>：本站收录的外部工具链接由第三方运营，其服务质量、安全性、隐私保护、收费政策由第三方负责。点击第三方链接后脱离本站管控，相关风险由用户自行承担；</li>
            <li><strong>广告内容免责</strong>：本站展示的广告由第三方广告联盟提供，已标注"广告"标识。广告真实性、商品 / 服务质量、交易安全由广告主负责，用户与广告主交易产生的纠纷与我方无关；</li>
            <li><strong>服务变更权利</strong>：本站保留随时修改、暂停、终止任何工具或全部服务的权利，无需提前通知用户，亦无需承担违约责任；</li>
            <li><strong>用户责任</strong>：用户对使用本站工具产生的一切行为及后果承担全部责任。我方因用户违规使用被第三方主张权利的，有权向用户追偿全部损失（包括但不限于诉讼费、律师费、赔偿金、行政罚款）。</li>
          </ul>
        </section>

        <section className='mb-6 sm:mb-8'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>三、用户行为规范与禁止行为</h2>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
            作为用户，您承诺并同意严格遵守以下行为规范：
          </p>

          <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2'>（一）用户责任</h3>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>保证对上传至本站的所有文件、图片、文本、素材享有完整、合法的权利，不存在侵权、盗版、冒用情形；</li>
            <li>对您上传或处理的内容负全部法律责任；</li>
            <li>不使用本站进行任何违法、违规、违反公序良俗、侵害他人合法权益的活动；</li>
            <li>不尝试破坏、干扰、未经授权访问本站的服务器、系统、网络；</li>
            <li>不利用本站从事商业转售、二次售卖、批量爬取、镜像站点等商业化行为。</li>
          </ul>

          <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2'>（二）绝对禁止行为（违反将立即关停账号、封禁 IP、保留追责权利）</h3>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>上传、处理、传播含有涉政、色情、暴力、恐怖、邪教、赌博、诈骗、谣言、虚假金融信息的内容；</li>
            <li>使用本站工具伪造、变造身份证、营业执照、票据、公章、证书、证件水印、官方文件、他人版权标识等；</li>
            <li>利用本站工具制作破解软件、激活码、会员破解、游戏外挂、账号密码破解等侵权 / 违法工具；</li>
            <li>利用本站工具批量下载付费影视 / 音乐、规避平台版权保护（如短视频去水印批量盗取）、网盘资源抓取、文档解密等侵权行为；</li>
            <li>使用本站工具生成虚假手机号、发送短信轰炸、提供 IP 代理 / 翻墙服务、制作虚假定位、伪造证件 / 票据 / 水印等违法工具；</li>
            <li>利用本站 AI 工具生成虚假人脸、伪造证件、诽谤内容、涉黄涉政内容；</li>
            <li>对本站实施 DDOS 攻击、CC 攻击、批量爬取接口数据、逆向破解、植入木马 / 病毒等行为；</li>
            <li>利用本站短链接工具跳转至诈骗、赌博、非法融资、色情等违法违规网站；</li>
            <li>违反《广告法》《反不正当竞争法》《消费者权益保护法》等法律法规，发布虚假广告、误导性宣传。</li>
          </ul>
        </section>

        <section className='mb-6 sm:mb-8'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>四、知识产权声明</h2>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>本站所有内容（包括但不限于文字、图片、代码、设计、UI 界面、图标、Logo、域名商标、数据库、工具算法等）均受知识产权法律法规及国际公约保护，知识产权归 Korelyy 所有；</li>
            <li>未经本站书面许可，任何主体不得以复制、修改、分发、传播、镜像、爬取、反向工程、商业利用等任何方式使用本站内容；</li>
            <li>用户上传至本站的内容，知识产权归用户本人所有；本站仅获得临时处理所需的有限、非独家、不可转让的许可，不取得任何所有权；</li>
            <li>本站尊重第三方知识产权，如您认为本站收录的工具或内容侵犯您的合法权益，请通过 173050738@qq.com 提交书面侵权通知（含权属证明、侵权链接、您的联系方式），我方将在 7 个工作日内核实处理；</li>
            <li>第三方开源组件、字体、素材由对应权利人持有知识产权，本站已获得合法授权使用。</li>
          </ul>
        </section>

        <section className='mb-6 sm:mb-8'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>五、责任限制</h2>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
            在法律允许的最大范围内：
          </p>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>本站对您承担的全部责任总额，不超过您在过去 12 个月内实际支付给本站的服务费用（如有）；如您未支付任何费用，本站对您的责任总额不超过人民币 100 元；</li>
            <li>本站不对任何间接、附带、特殊、惩罚性或后果性损害承担责任，包括但不限于利润损失、商誉损失、数据丢失、业务中断、预期利益损失等；</li>
            <li>本站对您提供的工具链接、第三方服务的可用性、安全性、准确性不承担保证责任；</li>
            <li>因不可抗力（包括但不限于地震、洪水、台风、疫情、政策变化、监管要求、网络攻击、运营商中断、第三方服务故障等）导致本站无法履行义务的，本站不承担违约责任；</li>
            <li>若本站部分免责条款被有管辖权的法院认定为无效，不影响其他条款的法律效力；</li>
            <li>某些司法管辖区不允许排除或限制某些损害赔偿，因此上述部分限制可能不适用于您；本站的免责条款将在适用法律允许的最大范围内执行。</li>
          </ul>
        </section>

        <section className='mb-6 sm:mb-8'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>六、未成年人保护</h2>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>本站服务主要面向具备完全民事行为能力的成年人（年满 18 周岁）；</li>
            <li>未成年人使用本站服务必须经法定监护人同意并全程监护；监护人对未成年人使用本站服务的一切行为及后果承担全部责任；</li>
            <li>本站不主动收集未成年人信息；如监护人发现未成年人在未经同意的情况下上传了个人信息或隐私文件，可通过 173050738@qq.com 申请立即删除，本站将在 24 小时内核实清理；</li>
            <li>如本站发现未经监护人同意收集了未成年人个人信息，将主动删除相关数据。</li>
          </ul>
        </section>

        <section className='mb-6 sm:mb-8'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>七、条款变更</h2>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>本站保留根据法律法规变更、业务调整、安全合规需要，随时修改本免责声明的权利；</li>
            <li>修改后的条款将在本站法律专区公示，公示后立即生效；重大变更将通过站内通知、弹窗等方式告知用户；</li>
            <li>用户在条款变更后继续使用本站服务，即表示接受修改后的条款；</li>
            <li>如您不同意修改后的条款，请立即停止使用本站服务，并可申请删除您的相关数据。</li>
          </ul>
        </section>

        <section className='mb-6 sm:mb-8'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>八、适用法律与争议解决</h2>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li>本免责声明的订立、生效、解释、履行、修改及争议解决均适用中华人民共和国大陆地区法律法规；</li>
            <li>如本免责声明部分条款与法律法规存在冲突，以法律法规为准；不影响其他条款的法律效力；</li>
            <li>因使用本站服务产生的争议，双方应首先友好协商解决；协商不成的，任何一方均有权将争议提交至本站运营方所在地有管辖权的人民法院诉讼解决；</li>
            <li>本站对所有涉嫌违法违规的行为保留向公安、网信、市场监管等主管部门举报、配合调查的权利。</li>
          </ul>
        </section>

        <section className='mb-6 sm:mb-8'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>九、联系方式</h2>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
            如果您对本数据处理规则及免责声明有任何疑问、意见、建议或投诉，请通过以下方式联系我们：
          </p>
          <ul className='list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 leading-relaxed'>
            <li><strong>联系邮箱</strong>：173050738@qq.com</li>
            <li><strong>网站域名</strong>：korelyy.com</li>
            <li><strong>运营主体</strong>：Korelyy</li>
            <li><strong>响应时间</strong>：工作日 48 小时内回复咨询；涉及侵权投诉、违法违规举报 24 小时内响应处理</li>
            <li><strong>监管投诉渠道</strong>：国家网信办举报中心 12377；中国互联网举报中心 12321</li>
          </ul>
          <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
            本数据处理规则及免责声明的最终解释权归 Korelyy 所有。
          </p>
        </section>
      </div>
    </div>
  );
}
