export default function DisclaimerPage() {
  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Data Processing Rules & Disclaimer</h1>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>Version: V1.0 | Last Updated: June 23, 2026</p>

      <div className='prose prose-gray dark:prose-invert max-w-none'>
        <section className='mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>Preface</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            This page details the data processing rules and disclaimer of Korelyy Tool Station (hereinafter referred to as "this site", domain: korelyy.com). Please read all of the following terms carefully before using our services. Accessing, browsing, uploading files, or using any online tools on this site constitutes your full awareness, understanding, and unconditional agreement to all provisions of this disclaimer. If you disagree with any term, please immediately stop using all services of this site.
          </p>
          <p className='text-gray-600 dark:text-gray-400'>
            This disclaimer, together with the Privacy Policy and Terms of Service, constitutes the complete legal document system of this site. The three have equal legal effect and are mutually complementary. In case of any conflict between terms, interpretation shall be based on the principle of protecting users' legitimate rights and interests as well as this site's legitimate rights and interests.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>1. Data Processing Rules</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            We strictly comply with laws and regulations including the Personal Information Protection Law, Cybersecurity Law, Data Security Law, and Consumer Rights Protection Law. All tools on this site adhere to the following data processing principles:
          </p>

          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>1.1 Local Processing Priority</h3>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>Most tools (such as text conversion, encoding/decoding, formatting, image processing, etc.) run entirely locally in your browser. Data will not leave your device and will not be uploaded to our servers;</li>
            <li>Under local processing mode, we are completely unable to access, view, or store your processed content, and you have full control over your data;</li>
            <li>If a tool is explicitly marked as "Local Processing", it means no data upload occurs throughout the process, so there is no need to worry about privacy leaks.</li>
          </ul>

          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>1.2 Immediate Deletion Principle (Only for Tools Requiring Server Processing)</h3>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>For tools that require server-side processing, your uploaded data will be deleted from the server immediately after processing: free version automatically deleted within 1 hour, paid version within 24 hours at most;</li>
            <li>Temporary files and cache files generated during processing are cleaned up simultaneously, with no backups retained;</li>
            <li>Our operations staff strictly follow the principle of permission isolation and have no authority to view, download, or copy specific content of user-uploaded files;</li>
            <li>If files are not deleted on time due to server failure, you may provide feedback via 173050738@qq.com, and we will immediately assist in manual cleanup.</li>
          </ul>

          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>1.3 Minimal Collection Principle</h3>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>We only collect the minimum data necessary to provide services, strictly following the principles of "legality, legitimacy, necessity, and integrity";</li>
            <li>We do not forcibly collect information unrelated to services, including but not limited to phone numbers, ID numbers, facial features, contacts, geographic location (precise location), SMS records, complete bank card information, and other sensitive personal information;</li>
            <li>Necessary data scope: only includes access IP, browser type, operating system version, access time, and tool operation records (used for security protection, troubleshooting, and compliance log retention).</li>
          </ul>

          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>1.4 Transparent Processing Principle</h3>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>Each tool page clearly states the data processing method (local/server-side), data retention period, and whether login is required;</li>
            <li>For tools involving third-party services, third-party information processing instructions and privacy policy links are publicly displayed;</li>
            <li>When data processing rules change, they will be published in the legal section of this site to ensure users' right to know.</li>
          </ul>

          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>1.5 Special Statement on AI Tools</h3>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>AI tools collected on this site are only external link redirects, and this site does not directly provide generative AI services;</li>
            <li>If third-party AI tools provide services to domestic users, they must complete the algorithm filing required by the Interim Measures for the Management of Generative AI Services on their own;</li>
            <li>When users use third-party AI tools, they must comply with the tool's usage agreement and privacy policy. This site assumes no legal responsibility for the behavior of third-party AI tools;</li>
            <li>It is prohibited to use any AI tools to generate content involving politics, pornography, violence, false faces, forged certificates, defamation, or other illegal and non-compliant content;</li>
            <li>This site conducts regular compliance reviews of collected AI tools, and any violations will be removed immediately.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>2. Service Disclaimer</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            When using the services of this website, please note the following disclaimer terms. This site provides services on an "as-is, as-available" basis:
          </p>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li><strong>Disclaimer of Result Accuracy</strong>: The tools provided on this site are for reference and auxiliary use only. We do not guarantee the absolute accuracy, completeness, or applicability of processing results. We assume no responsibility for losses caused by tool result errors or file format compatibility issues;</li>
            <li><strong>Disclaimer of Service Availability</strong>: This site may temporarily interrupt, change, or terminate some or all services due to system maintenance, server upgrades, data center failures, operator network fluctuations, force majeure, or other reasons without prior notice;</li>
            <li><strong>Disclaimer of Indirect Losses</strong>: This site shall not be liable for any direct, indirect, incidental, special, punitive, or consequential losses resulting from the use of this site's tools, including but not limited to loss of profits, business interruption, data loss, damage to goodwill, loss of expected benefits, etc.;</li>
            <li><strong>Third-Party Tool Disclaimer</strong>: External tool links collected on this site are operated by third parties. Their service quality, security, privacy protection, and pricing policies are the responsibility of the third party. Clicking third-party links takes you out of this site's control, and related risks are borne by users themselves;</li>
            <li><strong>Advertising Content Disclaimer</strong>: Advertisements displayed on this site are provided by third-party advertising networks and have been marked with "Ad" labels. The authenticity of advertisements, quality of goods/services, and transaction security are the responsibility of advertisers. Disputes arising from transactions between users and advertisers are unrelated to us;</li>
            <li><strong>Right to Service Changes</strong>: This site reserves the right to modify, suspend, or terminate any tool or all services at any time without prior notice to users and without assuming liability for breach of contract;</li>
            <li><strong>User Responsibility</strong>: Users bear full responsibility for all behaviors and consequences arising from the use of this site's tools. If we are claimed by third parties due to users' improper use, we have the right to recover all losses from users (including but not limited to litigation fees, attorney fees, compensation, and administrative fines).</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>3. User Conduct Standards and Prohibited Behaviors</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            As a user, you promise and agree to strictly abide by the following conduct standards:
          </p>

          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>3.1 User Responsibilities</h3>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>Ensure that you have complete and legal rights to all files, images, text, and materials uploaded to this site, without infringement, piracy, or unauthorized use;</li>
            <li>Bear full legal responsibility for content you upload or process;</li>
            <li>Do not use this site for any illegal, non-compliant, public order-violating, or rights-infringing activities;</li>
            <li>Do not attempt to damage, interfere with, or unauthorized access to this site's servers, systems, or networks;</li>
            <li>Do not use this site for commercial resale, secondary sales, bulk crawling, mirror sites, or other commercial activities.</li>
          </ul>

          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>3.2 Absolutely Prohibited Behaviors (Violations will result in immediate account shutdown, IP blocking, and retention of right to pursue legal action)</h3>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>Uploading, processing, or distributing content involving politics, pornography, violence, terrorism, cults, gambling, fraud, rumors, or false financial information;</li>
            <li>Using this site's tools to forge or alter ID cards, business licenses, bills, official seals, certificates, document watermarks, official documents, or others' copyright marks;</li>
            <li>Using this site's tools to create cracking software, activation codes, membership cracks, game cheats, account/password cracking tools, or other infringement/illegal tools;</li>
            <li>Using this site's tools for mass downloading of paid videos/music, circumventing platform copyright protection (such as batch stealing paid short videos by removing watermarks), cloud disk resource scraping, document decryption, or other infringement behaviors;</li>
            <li>Using this site's tools to generate fake phone numbers, send SMS bombing, provide IP proxy/VPN services, create fake locations, forge certificates/bills/watermarks, or other illegal tools;</li>
            <li>Using this site's AI tools to generate false faces, forged certificates, defamation, pornography-related, or politics-related content;</li>
            <li>Launching DDoS attacks, CC attacks, bulk scraping interface data, reverse engineering, implanting Trojans/viruses, or other malicious behaviors against this site;</li>
            <li>Using this site's short link tools to redirect to fraud, gambling, illegal financing, pornography, or other illegal/non-compliant websites;</li>
            <li>Violating laws and regulations such as the Advertising Law, Anti-Unfair Competition Law, and Consumer Rights Protection Law, publishing false advertising or misleading propaganda.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>4. Intellectual Property Statement</h2>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>All content on this site (including but not limited to text, images, code, design, UI interfaces, icons, logos, domain names and trademarks, databases, tool algorithms, etc.) is protected by intellectual property laws and international treaties. The intellectual property belongs to Korelyy;</li>
            <li>Without prior written permission of this site, no entity may use this site's content in any way, including but not limited to copying, modifying, distributing, disseminating, mirroring, crawling, reverse engineering, or commercial use;</li>
            <li>Intellectual property of content uploaded to this site by users belongs to the users themselves. This site only obtains a limited, non-exclusive, non-transferable license necessary for temporary processing and does not acquire any ownership;</li>
            <li>This site respects third-party intellectual property rights. If you believe that tools or content collected on this site infringe your legitimate rights and interests, please submit a written infringement notice (including proof of ownership, infringing links, your contact information) via 173050738@qq.com. We will verify and process within 7 working days;</li>
            <li>Third-party open source components, fonts, and materials are owned by their respective rights holders, and this site has obtained legal authorization for use.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>5. Limitation of Liability</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            To the maximum extent permitted by law:
          </p>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>Our total liability to you shall not exceed the total service fees you have actually paid to this site in the past 12 months (if any); if you have not paid any fees, our total liability to you shall not exceed RMB 100;</li>
            <li>This site shall not be liable for any indirect, incidental, special, punitive, or consequential damages, including but not limited to loss of profits, damage to goodwill, data loss, business interruption, loss of expected benefits, etc.;</li>
            <li>This site does not assume warranty responsibility for the availability, security, and accuracy of tool links and third-party services provided to you;</li>
            <li>Due to force majeure (including but not limited to earthquakes, floods, typhoons, epidemics, policy changes, regulatory requirements, cyber attacks, operator interruptions, third-party service failures, etc.) causing this site to be unable to perform its obligations, this site shall not assume liability for breach of contract;</li>
            <li>If any of this site's exemption clauses are deemed invalid by a court with jurisdiction, it shall not affect the legal effect of other clauses;</li>
            <li>Some jurisdictions do not allow the exclusion or limitation of certain damages, so some of the above limitations may not apply to you. This site's exemption clauses shall be enforced to the maximum extent permitted by applicable law.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>6. Minors Protection</h2>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>This site's services are primarily aimed at adults with full civil capacity (18 years of age or older);</li>
            <li>Minors using this site's services must obtain the consent of their legal guardians and be supervised throughout the process. Guardians bear full responsibility for all behaviors and consequences of minors using this site's services;</li>
            <li>This site does not actively collect minors' information. If guardians discover that minors have uploaded personal information or private files without consent, they may apply for immediate deletion via 173050738@qq.com, and this site will verify and clean up within 24 hours;</li>
            <li>If this site discovers that minors' personal information has been collected without guardian consent, relevant data will be actively deleted.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>7. Terms Changes</h2>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>This site reserves the right to modify this disclaimer at any time based on changes in laws and regulations, business adjustments, and security compliance requirements;</li>
            <li>Modified terms will be published in the legal section of this site and will take effect immediately upon publication. Major changes will be notified to users through in-site notifications, pop-up windows, and other means;</li>
            <li>Users' continued use of this site's services after terms changes indicates acceptance of the modified terms;</li>
            <li>If you disagree with the modified terms, please stop using this site's services immediately and apply for deletion of your relevant data.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>8. Applicable Law and Dispute Resolution</h2>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li>The conclusion, effectiveness, interpretation, performance, modification, and dispute resolution of this disclaimer shall be governed by the laws and regulations of the People's Republic of China (mainland);</li>
            <li>If any provision of this disclaimer conflicts with laws and regulations, the laws and regulations shall prevail; it shall not affect the legal effect of other provisions;</li>
            <li>Disputes arising from the use of this site's services shall first be resolved through friendly negotiation between the parties. If negotiation fails, either party shall have the right to submit the dispute to the people's court with jurisdiction at the location of this site's operator for litigation;</li>
            <li>This site reserves the right to report to and cooperate with public security, internet information, market supervision, and other competent authorities in the investigation of all suspected illegal and non-compliant behaviors.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>9. Contact Information</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            If you have any questions, opinions, suggestions, or complaints regarding this Data Processing Rules & Disclaimer, please contact us through the following methods:
          </p>
          <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2'>
            <li><strong>Contact Email</strong>: 173050738@qq.com</li>
            <li><strong>Website Domain</strong>: korelyy.com</li>
            <li><strong>Operator</strong>: Korelyy</li>
            <li><strong>Response Time</strong>: Response to inquiries within 48 working hours; response to infringement complaints and illegal reports within 24 hours</li>
            <li><strong>Regulatory Complaint Channels</strong>: National Cyberspace Administration Reporting Center 12377; China Internet Illegal and Bad Information Reporting Center 12321</li>
          </ul>
          <p className='text-gray-600 dark:text-gray-400'>
            The final interpretation right of this Data Processing Rules & Disclaimer belongs to Korelyy.
          </p>
        </section>
      </div>
    </div>
  );
}
