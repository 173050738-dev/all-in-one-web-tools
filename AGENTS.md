# AGENTS.md — Korelyy 项目常驻说明（每个新会话必读）

> 【AI 自我指令】每个新会话开始时，我（Codex）必须先完整读本文件恢复上下文，然后用一句话向用户声明【已读 AGENTS.md】并复述当前最关键的硬约束，再动手。维护本文件是我的职责：有新进展/新约束/新踩坑要主动提醒用户更新，无需用户提醒。
> 用户 = Carson。沟通用中文。诚实、不画饼、强成本意识、讨厌返工、下结论前必须先查证实测。

---

## 一、项目基本信息
- 项目：Korelyy 工具独立站（korelyy.com），全球独立站定位
- 目录：D:\projects\工具独立站
- 技术栈：Next.js 15 + next-intl 六语言(en/zh/es/fr/hi/ar) + Tailwind + Cloudflare Pages
- 部署：push GitHub 后自动部署（GitHub Actions），命令行 push 通常由 Trae/用户做
- 环境：Windows / PowerShell 5.1（多命令用【;】不用【&&】）
- 桌面路径：D:\360MoveData\Users\Administrator\Desktop
- 临时目录：D:\pw-temp

## 二、核心硬约束（最重要，违反会造成返工）
1. 【禁止在 C 盘生成任何文件】
2. 【Codex 只审核/诊断/写文档/查证，不改 Korelyy 业务代码】——代码改动一律交 Trae
3. 【禁改】：首页 / Header / Footer / 主题色 / GitHub Actions 部署配置
4. 【下结论前必须先查证/实测】，不许凭记忆下断言
5. 给 Trae 的文档【必须 ≤6000 字符】（Trae 读不了超过 6000 字符），超了就拆分或压缩，但不删关键细节
6. 给 Trae 喂任务要【拆小、一次一步】，一次喂太多 Trae 易出错
7. Codex 回复尽量做成【可直接转交 Trae】的格式，需用户决策处单独标出

## 三、协作模式（Codex 与 Trae 无法直接打通）
- Codex 和 Trae 是两个隔离程序，无数据通道，不能互相指挥
- 模式：用户当【信使 + 最终决策者】。Codex 出方案/文档/审查 → 用户转交 Trae → Trae 改 → Codex 复验
- 决策流程：Codex 先出方案(不执行) → 用户拍板 → 交 Trae 改 → Codex 复验

## 四、网络现状
- 命令行默认连不了外网（GitHub/Google 超时），国内网可用（百度/korelyy.com 可连）
- 用户梯子 = Anycast VPN（TUN 虚拟网卡模式，不开本地代理端口）。开梯子后命令行可走外网，但 github 首包慢
- git clone 走梯子常低速卡死 → 改用 codeload tarball 下载：
  https://codeload.github.com/{owner}/{repo}/tar.gz/refs/heads/main 然后 tar -xzf
- 抓 korelyy.com 线上页面用 Invoke-WebRequest（注意：站点启用 trailingSlash，URL 结尾必须带 / 否则 308）

## 五、写含中文文件的可靠方法（踩过坑）
- 用 PS here-string + [System.IO.File]::WriteAllText(path, doc, (New-Object System.Text.UTF8Encoding $false))
- here-string 里【禁用中文双引号】（破坏语法），中文引号用【】代替
- PS 控制台显示中文/emoji 乱码是 GBK 渲染假象，用 node -e "fs.readFileSync(path,'utf8')" 读回验证真实内容
- 读大文件/复杂正则：写 node 脚本到 D:\pw-temp\xxx.js 再执行（PS 内联正则含 [...] 会冲突报错）
- 递归扫描项目慢（.next 目录巨大）→ 限定目录/深度，别全盘 Get-ChildItem -Recurse

## 六、关键账号 / 配置
- GitHub: github.com/173050738-dev/all-in-one-web-tools.git
- Cloudflare Pages: 项目 korelyy-tools，account b650d5d21bddb5d98b5dcadcb2723522
- GSC: sc-domain:korelyy.com
- AdSense: pub-7235824755389632（ads.txt 已配；Google Ads/AdSense 曾拒审，暂搁置）
- 用户邮箱: 173050738@qq.com

## 七、关键数据文件与体系
- data/tools-index.json：1537 个工具（自研约49 + 外链约1488）
- data/tools-detail.json、data/workflows.ts（280 工作流）
- SEO 体系：components/seo.tsx（JSON-LD 全套）、components/ToolSeoContent.tsx（读 translation.json seo段）、lib/toolFaqs.ts
- 六语言翻译：public/locales/{locale}/translation.json
- RTL：app/layout.tsx 已支持 <html dir>，RTL_LOCALES 含 ar
- 工作流路由：/{locale}/workflow/[slug]（单数），静态导出只预生成 lib/topSlugs.ts 里前10个，其余靠 ISR
- 备用 skill（D盘，非korelyy用）：D:\download\skill\（含 taste-skill、frontend-design、garden-skills、obscura、dashiai-ppt 等）

## 八、用户产品方向与战略
- 全球独立站；工具题材贴近普通人日常高频刚需；对游戏工具(易变现)、运动工具有兴趣
- 当前战略：放弃纠结 1488 外链，专心做【自研工具 + 工作流对齐】（工作流步骤从外链跳出改为站内闭环）
- 引流靠 blog(约128篇) + 外链；核心做能赚钱的；收费/会员搁置(先全免费，流量起来再收费)

## 九、UI 设计规范（工具页美化用）
- 只用于【工具页/工具箱】，不碰首页/Header/Footer/主题色
- 已装 3 个设计 skill 参考：taste-skill(营销页)、frontend-design(选1个视觉锚点)、garden-skills/web-design-engineer(做工具页/dashboard)
- 工具页建议：Swiss 风格锚点(白底+单一无衬线+网格+单强调色)；低视觉方差、轻 hover 动效、中密度
- 硬约束：六语言完整适配(含SEO)、ar 的 RTL 必须翻转正确(用 ms-/me-/text-start，禁 ml-/mr-/left/right)、
  全端适配(触控热区≥44px、窄屏面板折叠、手机端点击选文件)、复用现有 seo.tsx/ToolSeoContent.tsx
- 禁止：假数据占位、无意义 mono 大写副标题、unicode 字符当图标、花哨动效

## 十、验收工具页/功能的 10 条清单
1. 六语言 UI + SEO 都完整（非机翻占位）
2. ar RTL 翻转正确
3. 三端适配(PC/平板/手机)，触控热区≥44px
4. 无假数据/填充文案
5. 功能【实测】输入→输出可用，不是只有界面
6. 复用现有 SEO 组件，未另造轮子
7. 未改动首页/Header/Footer/主题色
8. 未在 C 盘生成文件
9. 线上验证(带尾斜杠抓 korelyy.com)已确认部署
10. git 已 push + Cloudflare 部署完成

---

## 十一、Codex 的能力与装备现状（每次会话读此节恢复认知）
> 我（Codex）不是只会写文档。已在本机实测打通以下能力，新会话务必按此认知行事，别再说【做不到】。

### 已打通（可直接用）
- 【网页自动化】Playwright + Chromium 内核已装在 D:\codex-tools（内核在 D:\codex-tools\playwright-browsers，环境变量 PLAYWRIGHT_BROWSERS_PATH 指向它）。
  - 用法：cd D:\codex-tools; $env:PLAYWRIGHT_BROWSERS_PATH='D:\codex-tools\playwright-browsers'; 写 node 脚本 require('playwright') 跑。
  - 能做：自动打开页面/点击/填表/抓动态渲染内容/批量截图/线上部署核验。已实测打开 korelyy.com 抓标题+截图成功。
- 【写/跑脚本】PowerShell、Node v24、Python 3.14、Git 均可用。
- 【网页抓取/查证】Invoke-WebRequest + Playwright 双路可用（korelyy 记得带尾斜杠）。

### 差一步就能用（缺钥匙/需授权）
- 【AI 生图】imagegen CLI 脚本齐全：C:\Users\Administrator\.codex\skills\.system\imagegen\scripts\image_gen.py（模型 gpt-image-2），openai SDK 2.38 + Pillow 已装。
  - 唯一缺口：环境变量 OPENAI_API_KEY 未配（脚本只认此变量，无自定义 base_url，第三方中转接不上，需真 OpenAI key）。
  - 启用：开梯子 + 配 OPENAI_API_KEY 后，python image_gen.py generate 即可出图/去背景（remove_chroma_key.py 也在）。付费 API 按图计费，需 Carson 确认成本。

### 环境注意
- 外网需开梯子（Anycast VPN）才能连 OpenAI/海外站；不开则超时。
- 一律不在 C 盘生成产物；工具/产物放 D:\codex-tools 或 D:\pw-temp。

### 诚实边界（不画饼）
- 【自动赚钱工具】不是一个能力，是产品+流量+变现的完整生意，任何 AI 都无法一键生成。Korelyy 的 SEO+AdSense 才是真路子。

---

## 十二、X（Twitter）引流运营进度与计划（每次会话读此节，主动提醒 Carson 推进）
> 【AI 自我指令】每个新会话读到此节，若发现有【待办】未完成，主动提醒 Carson：现在该做哪一步。Codex 无定时能力，靠此节做跨会话记忆。

### 账号
- X 账号：@Korelyybusiness（展示名 Carson | Korelyy），2026年6月注册的新号
- 人设：工具/独立开发者（走 #buildinpublic #indiehackers），已定死
- 连号方式：Node 脚本用 chromium.connectOverCDP('http://127.0.0.1:9222') 连 Carson 真实 Edge。
  启动：node -e 用 cmd 执行 'start msedge --remote-debugging-port=9222 --profile-directory=Default'，Carson 手动登录。
  脚本放 D:\codex-tools（playwright 模块在那），不能放 D:\pw-temp（无模块）。

### 已完成（2026-07-25）
1. 简介改造：Building free online tools for everyone；外链 korelyy.com/en/；城市 Guangzhou —— 已生效
2. 第1条养号推已发：【made 50 free tools on my site so far lol...】（口语风、去AI味、无链接）
3. 账号已【解锁曝光权限】(graduated-access)，新号限流期已过
4. 关注同赛道 18 个号（levelsio/theo/swyx/shadcn/rauchg/arvidkahl/tibo_maker 等 indie hacker 圈）
5. 发了 4 条针对性留言（tibo_maker/arvidkahl/gregisenberg/theo），含 1 条抛问题钩子

### 待办计划（按天推进，Carson 来了就提醒）
- 【待办·D+1 明天】发第2条养号推（口语风、无链接）+ 可选再留 2-3 条评论。
  第2条草稿参考：building a tool site is easy. getting people to actually use it is the hard part 类，口语化重写。
- 【待办·D+2 后天】发 emoji-mixer 引流视频（用 Jenny 版 D:\codex-tools\videos\emoji-mixer-jenny.mp4）。
  硬规则：正文【不放链接】(X 打压站外链)，链接 korelyy.com 放【第一条评论】，正文写 link in replies。
  文案已备好（趣味钩子版），发布时间选北京时间晚9点-凌晨（美国白天）。
- 每次发完隔几小时看互动（赞/评/涨粉），有互动的风格就是对的，后续多用。养号忌一天动作太密。

### 引流视频资产（已产出，D:\codex-tools\remotion-studio + videos）
- 通用模板 ToolPromo.tsx（配置表驱动，加新工具只改 Root.tsx 的 CONFIGS 数组）
- 已出片：emoji-mixer-ARIA版.mp4 / emoji-mixer-JENNY版.mp4（1080x1920/18s/带女声配音+BGM）
- 配音：Edge-TTS（免费神经女声，en-US-JennyNeural / AriaNeural），支持六语言女声
- BGM：Python 合成的无版权音乐 public/bgm.wav
- 下一步可扩：六语言配音版、横版 YouTube 版、给第2个自研工具套模板出片

