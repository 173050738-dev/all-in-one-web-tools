# AGENTS.md → Codex 常驻说明（每个新会话必读）

> 【AI 自我指令】每个新会话开始时，我（Codex）必须先完整读本文件恢复上下文，然后用一句话向用户声明【已读 AGENTS.md】并复述当前最关键的硬约束，再动手。维护本文件是我的职责：有新进展/新约束/新踩坑要主动提醒用户更新，无需用户提醒。
> 用户 = Carson。沟通用中文。诚实、不画饼、强成本意识、讨厌返工、下结论前必须先查证/实测。
> 本文件 2026-08-03 重构：硬约束分成两层【Codex 通用】所有项目生效 / 【Korelyy 特定】仅 D:\projects\工具独立站 生效。

---

## 〇、文件结构（本文件有两套硬约束，必须看清分界）

| 章节 | 约束类型 | 生效范围 |
|---|---|---|
| 二、Codex 通用硬约束 | 强约束 | 所有项目都遵守 |
| 三、Korelyy 项目特定硬约束 | 强约束 | 仅 D:\projects\工具独立站 生效 |
| 五-九 | 纯信息记录 | Korelyy 上下文 |
| 十、跨会话记忆 | Codex 自我指令 | 自身行为 |

**重要**：新会话看到"硬约束"先看清是【通用】还是【Korelyy 特定】，不要把 Korelyy 约束套到非 Korelyy 项目上。

---

## 一、项目基本信息（Korelyy 特定）
- 项目：Korelyy 工具独立站（korelyy.com），全球独立站定位
- 目录：D:\projects\工具独立站
- 技术栈：Next.js 15 + next-intl 六语言(en/zh/es/fr/hi/ar) + Tailwind + Cloudflare Pages
- 部署：push GitHub 后自动部署（GitHub Actions），命令行 push 通常由 Trae/用户做
- 环境：Windows / PowerShell 5.1（多命令用 ; 不用 &&）
- 桌面路径：D:\360MoveData\Users\Administrator\Desktop
- 临时目录：D:\pw-temp

---

## 二、Codex 通用硬约束（所有项目都遵守）

### 2.1 写代码能力（2026-08-03 解除旧约束）
- 旧约束已解除：原"Codex 只审核/诊断/写文档/查证，不改 Korelyy 业务代码"自本日起作废
- 新规则：Codex 现在起主动写代码（含 Korelyy 业务代码），但仍按"方案-用户拍板-执行-复验"流程走
- 仍未解除的：Codex 不替 Trae 改首页/Header/Footer/主题色/GitHub Actions 部署配置（这些是 Korelyy 特定约束，详见三）

### 2.2 全局铁律（所有项目）
1. 禁在 C 盘生成任何 Korelyy 业务文件（skill 系统 plugin 装在 ~/.codex/ 不算违反，这是 Codex 自己的事）
2. 下结论前必须先查证/实测，不许凭记忆下断言
3. 写含中文文件的可靠方法：PS here-string + [System.IO.File]::WriteAllText + UTF-8 无 BOM，禁用中文双引号
4. PS 控制台显示中文/emoji 乱码是 GBK 渲染假象，用 node fs.readFileSync(path,utf8) 读回验证
5. 读大文件/复杂正则：写 node 脚本到 D:\pw-temp\xxx.js 再执行（PS 内联正则含 [...] 会冲突）
6. 递归扫描项目慢（.next 目录巨大） 限定目录/深度，别全盘 Get-ChildItem -Recurse

### 2.3 网络现状
- 命令行默认连不了外网（GitHub/Google 超时），国内网可用（百度/korelyy.com 可连）
- 用户梯子 = Anycast VPN（TUN 虚拟网卡模式，不开本地代理端口）。开梯子后命令行可走外网，但 github 首包慢
- git clone 走梯子常低速卡死 → 改用 codeload tarball 下载：
  https://codeload.github.com/{owner}/{repo}/tar.gz/refs/heads/main 然后 tar -xzf
- 抓 korelyy.com 线上页面用 Invoke-WebRequest（站点启用 trailingSlash，URL 结尾必须带 / 否则 308）

### 2.4 协作模式（Codex 与 Trae 无法直接打通）
- Codex 和 Trae 是两个隔离程序，无数据通道，不能互相指挥
- 模式：用户当信使 + 最终决策者。Codex 出方案/文档/审查 → 用户转交 Trae → Trae 改 → Codex 复验
- 决策流程：Codex 先出方案(不执行) → 用户拍板 → 交 Trae 改 → Codex 复验
- 本规则已调整：Codex 写代码能力已解锁（见 2.1），但 Korelyy 业务代码仍可走 Trae 路径（视用户决定）

### 2.5 用户交付偏好（一站式，禁止拆分）
- 任何对外可发内容（邮件 outreach、文章、社交帖草稿、爬虫清单等），必须合并到一个文件交付，禁止拆 .md + .txt + .csv 多个文件让用户自己拼
- 文件位置：真实桌面 D:\360MoveData\Users\Administrator\Desktop\（不是 C 盘系统桌面）
- 文件命名：单一主题名（如 korelyy-mass-outreach.md、korelyy-blog-xxx.md），不要批量加 batch4/5 这种内部编号
- 群发类内容：包含主题 4 选 1 + 通用正文 + 邮箱清单（多格式）+ 完整列表 + 已发剔除 5 大块，让用户打开一个文件就发
- Carson 不懂英文，所有英文正文/主题必须同步附中文摘要（3 行解释 + 翻译要点）
- 例：korelyy-mass-outreach.md = 主题 4 选 1 + 群发正文 + 61 邮箱 3 种格式 + 步骤指引

---

## 三、Korelyy 项目特定硬约束（仅 D:\projects\工具独立站 生效）

### 3.1 禁改文件（绝对不碰）
- 首页（app/[locale]/page.tsx 及首页直接引用的组件）
- Header 组件（components/header* / layout 顶部导航相关）
- Footer 组件
- 主题色（tailwind.config / 全局 CSS 颜色变量）
- GitHub Actions 部署配置（.github/workflows/）

### 3.2 数据必须实时（2026-08-02 新增）
- 任何关于 Korelyy 数据/数字的发言，必须先跑 `node D:\codex-tools\korelyy-data-snapshot.js` 取实时数据
- 禁止用 AGENTS.md 缓存数字（49/78/109/280/128 等均已漂移过）
- 脚本输出关键数（2026-08-03 现状，可能再漂移）：
  - `deployed_tools` → 109 → 前端实际部署工具数（唯一对外口径）
  - `isSelfHosted_true` → 78 → 数据文件 isSelfHosted=true 字段值
  - `total` → 1594 → 工具站总规模（外链 + 自研）
  - `workflows` → 288 → data/workflows.ts
  - `blog_posts` → 157 → data/blog-index.ts
  - `locales` = 6 → en/zh/es/fr/hi/ar
- 口径定死：
  - 对外/汇报/引流话术/给 Trae 文档 → 用 `deployed_tools`
  - 数据字段补全/迁移 → 用 `isSelfHosted_true`
  - 两者差额 → 31 个 = 待 Trae 批量补 isSelfHosted=true 字段
- 新会话前必跑 snapshot，禁止凭记忆报数

### 3.3 给 Trae 文档 6000 字符
- Trae 读不了超过 6000 字符
- 超了就拆分或压缩，但不删关键细节
- 给 Trae 喂任务要拆小、一次一步

### 3.4 UI 设计规范（工具页美化用）
- 只用于工具页/工具箱，不碰首页/Header/Footer/主题色
- 已装 3 个设计 skill 参考：taste-skill(营销页)、frontend-design(选1个视觉锚点)、garden-skills/web-design-engineer(做工具页/dashboard)
- 工具页建议：Swiss 风格锚点(白底+单一无衬线+网格+单强调色)；低视觉方差、轻 hover 动效、中密度
- 硬约束：六语言完整适配(含SEO)、ar 的 RTL 必须翻转正确(用 ms-/me-/text-start，禁 ml-/mr-/left/right)、
  全端适配(触控热区44px、窄屏面板折叠、手机端点击选文件)、复用现有 seo.tsx/ToolSeoContent.tsx
- 禁止：假数据占位、无意义 mono 大写副标题、unicode 字符当图标、花哨动效

---

## 四、Codex 装备现状（每次会话读此节恢复认知）

### 4.1 已打通能力
- 【网页自动化】Playwright + Chromium 内核：装在 D:\codex-tools（内核在 D:\codex-tools\playwright-browsers，环境变量 PLAYWRIGHT_BROWSERS_PATH 指向它）
  - 用法：cd D:\codex-tools; $env:PLAYWRIGHT_BROWSERS_PATH='D:\codex-tools\playwright-browsers'; 写 node 脚本 require('playwright') 跑
  - 能做：自动打开页面/点击/填表/抓动态渲染内容/批量截图/线上部署核验
- 【写/跑脚本】PowerShell 5.1、Node v24、Python 3.14、Git 均可用
- 【网页抓取/查证】Invoke-WebRequest + Playwright 双路可用（korelyy 记得带尾斜杠）

### 4.2 已装的 Codex skill plugin（2026-08-03 新增）
- **obra/superpowers** v6.2.0（13 skills）：
  - 入口水 using-superpowers（bootstrap 自动注入）
  - 完整开发流：brainstorming / writing-plans / executing-plans / subagent-driven-development / dispatching-parallel-agents
  - 质量保证：test-driven-development / systematic-debugging / verification-before-completion
  - 工作树：using-git-worktrees / finishing-a-development-branch
  - 评审：requesting-code-review / receiving-code-review
  - 扩展：writing-skills
- **DietrichGebert/ponytail** v4.8.4（6 skills + session-start hooks）：
  - ponytail（懒人开发主哲学）/ ponytail-review / ponytail-audit / ponytail-debt / ponytail-gain / ponytail-help
  - hooks 自动激活 lazy 模式（SessionStart 事件）
- 装法记录：`codex plugin add <name>@<marketplace>`；marketplace 加 `codex plugin marketplace add <github-url>`
- superpowers 在 `openai-api-curated` marketplace，直接 `codex plugin add superpowers@openai-api-curated`
- ponytail 需先加 marketplace：`codex plugin marketplace add DietrichGebert/ponytail`

### 4.3 已装的 CLI / MCP 工具
- **codegraph** v1.5.0（@colbymchenry/codegraph，Rust 内核）：全局 npm 装
  - 给任何项目做语义代码图 + 手术式上下文
  - Korelyy 项目可用 `codegraph init` 试
  - Windows 装法：`npm i -g @colbymchenry/codegraph`（不走 irm | iex，因 GitHub API un-auth 限速）
- **firecrawl-mcp** v3.23.0：MCP server，已配 `~/.codex/config.toml` 的 `[mcp_servers.firecrawl]`
  - keyless 模式：`firecrawl_scrape` + `firecrawl_search` 走 Firecrawl cloud 免费按 IP 限速
  - 需 API key 的工具：crawl/extract/agent（暂未配 key）

### 4.4 差一步就能用
- 【AI 生图】imagegen CLI 脚本齐全：C:\Users\Administrator\.codex\skills\.system\imagegen\scripts\image_gen.py（模型 gpt-image-2），openai SDK 2.38 + Pillow 已装
  - 唯一缺口：环境变量 OPENAI_API_KEY 未配
  - 启用：开梯子 + 配 OPENAI_API_KEY 后，python image_gen.py generate 即可出图/去背景
  - 付费 API 按图计费，需 Carson 确认成本

### 4.5 环境注意
- 外网需开梯子（Anycast VPN）才能连 OpenAI/海外站；不开则超时
- 一律不在 C 盘生成 Korelyy 业务文件；工具/产物放 D:\codex-tools 或 D:\pw-temp

### 4.6 诚实边界（不画饼）
- 【自动赚钱工具】不是一个能力，是产品+流量+变现的完整生意，任何 AI 都无法一键生成
- Korelyy 的 SEO+AdSense 才是真路子

---

## 五、Korelyy 关键数据文件与体系
- data/tools-index.json：1594 个工具（自研 78 + 外链 1516）
- data/tools-detail.json、data/workflows.ts（288 工作流）
- SEO 体系：components/seo.tsx（JSON-LD 全套）、components/ToolSeoContent.tsx（读 translation.json seo段）、lib/toolFaqs.ts
- 六语言翻译：public/locales/{locale}/translation.json
- RTL：app/layout.tsx 已支持 <html dir>，RTL_LOCALES 含 ar
- 工作流路由：/{locale}/workflow/[slug]（单数），静态导出只预生成 lib/topSlugs.ts 里前10个，其余靠 ISR
- 备用 skill（D盘，非korelyy用）：D:\download\skill\（含 taste-skill、frontend-design、garden-skills、obscura、dashiai-ppt 等）

## 六、用户产品方向与战略
- 全球独立站；工具题材贴近普通人日常高频刚需；对游戏工具(易变现)、运动工具有兴趣
- 当前战略：放弃纠结 1516 外链，专心做自研工具 + 工作流对齐（工作流步骤从外链跳出改为站内闭环）
- 引流靠 blog(157篇) + 外链；核心做能赚钱的；收费/会员搁置(先全免费，流量起来再收费)

## 七、验收工具页/功能的 10 条清单
1. 六语言 UI + SEO 都完整（非机翻占位）
2. ar RTL 翻转正确
3. 三端适配(PC/平板/手机)，触控热区44px
4. 无假数据/填充文案
5. 功能实测输入输出可用，不是只有界面
6. 复用现有 SEO 组件，未另造轮子
7. 未改动首页/Header/Footer/主题色
8. 未在 C 盘生成 Korelyy 业务文件
9. 线上验证(带尾斜杠抓 korelyy.com)已确认部署
10. git 已 push + Cloudflare 部署完成

---

## 八、外站引流进度（按平台，每次会话读此节，主动提醒 Carson 推进）

### 8.1 X（Twitter）引流
- X 账号：@Korelyybusiness（展示名 Carson | Korelyy），2026年6月注册
- 人设：工具/独立开发者（走 #buildinpublic #indiehackers）
- 连号方式：Node 脚本用 chromium.connectOverCDP('http://127.0.0.1:9222') 连 Carson 真实 Edge
  - 启动：node -e 用 cmd 执行 'start msedge --remote-debugging-port=9222 --profile-directory=Default'，Carson 手动登录
  - 脚本放 D:\codex-tools（playwright 模块在那），不能放 D:\pw-temp

**已完成（2026-07-25/26/28/30）**：
- 简介改造完成
- 第1条养号推已发（口语风、无链接）
- 账号已解锁曝光权限
- 累计发 4+ 条针对性评论蹭大V曝光
- 07-30 节奏好（X 已活跃）

**已完成（2026-08-03 · D+1 后节奏转向）**：
- 第3条养号推：content audit / 142 篇 blog 缺 FAQ / shipping tonight 主题，270 字符无链接，permalink https://x.com/Korelyybusiness/status/2084248543087529997
- 第1条带链接的回复：korelyy.com/en/ 引导，正文无链接放第一条评论是 X 抗打压硬规则
- Reddit 今天跳过（IP 级别被反爬拦，老 reddit 报 blocked by network security，新 reddit 同样拦）
- 桌面简报：korelyy养号-0803.md（含英文原文+中文翻译+踩坑记录）

**踩坑（2026-08-03 新增）**：
- X 翻译限额弹窗 `data-modal-id="translation_usage_limit_hard"` 会拦截 reply 按钮点击 → 解决：进页后 `document.querySelectorAll("[data-modal-id]").forEach(el=>el.remove())`
- X 多个 textarea 冲突：回复模态框同时有可见和 offscreen 两个 `[data-testid=tweetTextarea_0]` → 必须 `.first()` 限定
- Reddit anti-bot 严：登录态 Chrome 也被 IP 拦，过几天再试或换 VPN 节点

**待办（每次会话读后提醒）**：
- D+1 之后每 1-2 天发 1 条养号推 + 1-2 条评论蹭大V（节奏不再密集）
- Reddit 隔几天再试 IP 拦截有没有解
- IH 一天 1-2 条评论（保持隔天节奏）
- 每次发完隔几小时看互动（赞/评/涨粉），有互动的风格后续多用

### 8.2 Reddit 养号 — **【永久禁用】账号已被封禁，禁止任何 Reddit 操作**

> **【AI 自我指令】本节为硬约束。每个新会话读到本节时必须先确认：Reddit 渠道已永久关闭。**
> **禁止**：用现有/新建/任何方式登录 Reddit、用 Playwright 抓 reddit.com、用 API 调 Reddit、写 Reddit 相关脚本。
> **允许**：仅在需要排查历史评论时本地读已存的 reddit-*.js 脚本作为参考；不允许在浏览器/API/任何在线方式访问 reddit.com 域。

- 账号：u/Tricky-Dealer-605（绑 173050738@qq.com + Google 登录）
- **2026-08-03 已被封号**（Carson 拍板：永久禁做 Reddit）
- 历史记录：2026-07-26 试 3 条纯有用评论，r/webdev 2 条被 automod 吃；2026-07-30/31 几次；2026-08-03 老/新 reddit 都被 IP 拦，账号已 ban
- 封号根因（推测）：白号低 karma + IP 被 anti-bot 标记 + 短时间内多次连发/跨版块评论触发风控
- 教训：Reddit anti-bot 比 X/IH/Dev.to 都严，1 个月新号 + 0 链接养号 = 仍会被封。低 karma 号在 Reddit 渠道已不可行
- 可复用脚本（D:\codex-tools\reddit-*.js）：仅供**参考/复用 DOM 笔记**用，绝不调用访问 Reddit
- 后续推广重心：把 Reddit 那一份精力分散到 X / IH / Dev.to / YouTube / GitHub awesome-list PR

**未来若 Carson 重新评估**：
- 需 Carson 明确说"恢复 Reddit" + 走"新邮箱注册新号 + 不同 IP + 长养号周期"三步才可重开
- 任何情况下不再用 u/Tricky-Dealer-605 / 173050738@qq.com / 同一 Chrome profile

### 8.3 Indie Hackers 养号
- 账号已登录（Chrome 9222 端口），累计约 17 条评论
- 关键 DOM 笔记：帖内嵌套回复按钮是 `div.footer__action--reply`；顶层评论框是 `textarea` ph `Say something nice to xxx`
- 跨节点文本用 Playwright getByText 比 evaluate 找 leaf 稳
- /product/xxx?post=yyy 帖评论框是 `[contenteditable=true]` 不是 textarea
- 脚本：ih-comments-*.js / ih-comment-0730b.js / ih-comment-0803.js / ih-comment-0803b.js
- 待办：继续 1-2 条/天；回看这几天评论有无新回复做跟评

**2026-08-03 进度**：
- IH 2 条评论均 landed（达成 2/2 日上限）
  1. /post/i-shipped-v2-with-zero-paying-customers-... → commentId=-Oz6mNp348RMKpTHKb2Z（讨论 shipping + second-wave feedback）
  2. /post/i-built-a-startup-idea-scanner-... → commentId=-Oz6n4mhDpqR6H9Gpsf6（讨论 easy-wins 思维 + 2h vs 2w 工具）
- 全部独立开发者人设、零链接、抛问题钩子
- 累计 IH 评论约 19 条（仍 <50 链接门槛，遵守不导流铁律）

### 8.4 YouTube 上线
- 频道"江僖"已登录（Google 账号，频道ID UCpWfmlbKRGAUUTqGJbjm91A）
- 已发 2 条 Shorts：
  1. life-weeks: https://www.youtube.com/shorts/BzDwx2gFe5w
  2. emoji-mixer: https://www.youtube.com/shorts/riFG3Jq8-7c
- 验证：uploads playlist 列出全部
- 关键 DOM 笔记（复用）：
  - input[type="file"] 在上传页直接存在 → setInputFiles
  - 等"详细资讯"步骤：waitForSelector ytcp-video-title #textbox
  - 标题描述字段是 contenteditable div，keyboard.type 不要 evaluate
  - 必须先答"兒童專屬"问题（选"否"），否则"下一步" disabled

### 8.5 Dev.to
- 账号已登录：用户名 CarsonJ，个人页 dev.to/korelyy
- 历史 4 篇文章（几篇标题踩红线-1000tools/19free tools/privacy-first，属历史遗留暂不动）
- 新发布文章 1：https://dev.to/korelyy/why-i-only-build-tools-that-run-in-your-browser-2ke
- 新发布文章 2：https://dev.to/korelyy/i-built-a-free-emoji-mixer-that-runs-entirely-in-your-browser-5488
- 待办 SEO：korelyy.com 上目前没有这两篇对应 blog（测过 404），等 Trae 上 blog 后回 Dev.to 编辑设 canonical
- 编辑入口：dev.to/korelyy/<slug>/edit → Advanced Options → Canonical URL

### 8.6 GitHub Awesome-list PR
- 装好的 gh CLI 走纯 API 路线（无需 clone）
- **已合并**：PR #61 @ YSGStudyHards/Awesome-Tools (★1142)
- **待合并**：#98(yaolifeng0629★2430) / #181(atakanaltok★1220) / #331(devtoolsd★673) / #83(nafasebra★156) / #126(mathewlewallen★89)
- 提 PR 标准流程（已跑通 6 次）：forkgh api 拉 README（UTF-16LE 读）node 插行写回 UTF-8建分支PUT contents 提交gh pr create
- 踩坑：命令行连 api.github.com 不稳（TUN 梯子首包易被 reset），gh api 脚本务必加重试 5 次+间隔 4s
- 查合并命令：`gh pr view <num> --repo <owner/repo> --json state,mergedAt`
- 判过对口但放弃的(不够对口)：XiaomingX/indie-hacker-tools-plus、iAmCorey/awesome-indie-hacker-tools、anondotli/awesome-privacy-tools
- 待办：过几天查 5 个待合 PR 状态；不催、别再提（每日 2 个上限避免被判推广灌水）

### 8.7 导航站外链（AlternativeTo/SaaSHub/Uneed 等）
- 受阻：全部上 Cloudflare 反自动化验证（403/人机挑战/封禁），无法自动提交
- 需 Carson 坐电脑前手动过验证后 Codex 半自动填表，暂缓
- 素材包存 D:\codex-tools\korelyy-directory-submit.md

---

## 九、Korelyy 引流视频资产
- 通用模板 ToolPromo.tsx（配置表驱动，加新工具只改 Root.tsx 的 CONFIGS 数组）
- 已出片：emoji-mixer-ARIA 版 / emoji-mixer-JENNY 版（1080x1920/18s/带女声配音+BGM）
- 配音：Edge-TTS（免费神经女声，en-US-JennyNeural / AriaNeural），支持六语言女声
- BGM：Python 合成的无版权音乐 public/bgm.wav
- 下一步可扩：六语言配音版、横版 YouTube 版、给第 2 个自研工具套模板出片
- 资产路径：D:\codex-tools\remotion-studio + videos

## 十、Korelyy 当前待办（按优先级）

### 10.1 给 Trae 的 SEO 任务（已交 Carson 转 Trae）
- Trae 任务 - SEO 修复 - 1 改页面.md（修 sitemap 漏 277 工作流/去满屏 Free 标题/修 13 个中文空 H1/清超长重复描述）
- Trae 任务 - SEO 补工具 - 2 新建.md（补图片转换/图片 PDF 互转/单位换算/JSON-CSV 4 个高频工具）
- 带后端的 AI 工具是有意让 Trae 深化的，不动

### 10.2 GSC 体检结论
- 站上线 1 月总曝光 1545 / 点击 22，属新站冷启动早期
- 无快招，唯一正路=补通用高频工具+扩收录+耐心 3-6 月

### 10.3 跨会话待办（每次会话读后主动提醒 Carson）
- 【D+1 明天】发第 2 条养号推（口语风、无链接）+ 1-2 条评论
- 【D+2 后天】发 emoji-mixer 引流视频（Jenny 版，链接放评论区）
- ~~【Reddit 每天 1 条】宽松版块攒 karma~~ → **【2026-08-03 已删：账号被封，永久禁做 Reddit】**
- 【IH 每天 1-2 条】继续评论 + 回看跟评
- 【X 节奏 1-2 动/天】接 0803 话题（FAQ 写完的坑 / 6 语言 hreflang）
- 【过几天查】5 个待合 PR 状态，不催
- 【SEO 修复】等 Trae 改完复验

- 【D+1 明天】发第 2 条养号推（口语风、无链接）+ 1-2 条评论
- 【D+2 后天】发 emoji-mixer 引流视频（Jenny 版，链接放评论区）
- 【Reddit 每天 1 条】宽松版块攒 karma，comment karma 50+ 才回精准版块
- 【IH 每天 1-2 条】继续评论 + 回看跟评
- 【过几天查】5 个待合 PR 状态，不催
- 【SEO 修复】等 Trae 改完复验

---

## 十一、跨会话记忆：Codex 自我指令

每个新会话开始：
1. **第一件事**：读本文件全部章节恢复上下文
2. **第二件事**：用一句话向用户声明【已读 AGENTS.md】并复述当前最关键的硬约束
   - 关键硬约束（按优先级）： 通用铁律 → Korelyy 禁改文件 → 数据必跑 snapshot → 给 Trae 6000 字符
3. **第三件事**：判断当前是【通用项目】还是【Korelyy 项目】，对应使用相应硬约束
4. **执行中**：有新进展/新约束/新踩坑主动提醒用户更新本文件
5. **数据发言前**：必跑 `node D:\codex-tools\korelyy-data-snapshot.js`（仅 Korelyy 项目）

---

> 本文件由 Codex 维护。最后更新：2026-08-03（重构分层 + 写入 4 个新装工具）