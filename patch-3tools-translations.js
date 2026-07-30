// 【执行此脚本即可】patch-3tools-translations.js
// 作用：给6个translation.json的tools字典追加 wave-art / life-weeks / excuse-generator 的完整 name/description/seo 段
// 用法：node patch-3tools-translations.js
// 执行后：public/locales/{en,zh,es,fr,hi,ar}/translation.json 都会被更新，3个工具条目直接插入到 tools 字典末尾
// 执行完请跑：npm run build 确认构建通过，再 git commit + push

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'public', 'locales');
const LOCALES = ['en', 'zh', 'es', 'fr', 'hi', 'ar'];
const SLUGS = ['wave-art', 'life-weeks', 'excuse-generator'];

// ===== 翻译内容（每语言3个工具，每个工具5个SEO子字段，5条FAQ）=====
// 英文做原文基准，其他语言基于英文翻译的地道本地化版本
const CONTENT = {
  en: {
    'wave-art': {
      name: 'Voice Wave Art Generator',
      description: 'Turn any name or phrase into a unique visual soundwave art piece. Each character maps to its own frequency, amplitude and phase. Choose from minimal line, neon glow, and radio spectrum styles. Overlay multiple names, pick a palette, export as PNG — perfect for avatars, tattoos, couple gifts, or wall art.',
      seo: {
        intro: 'Voice Wave Art Generator is a free, browser-based tool that converts text — a name, a word, a date, or a full phrase — into one-of-a-kind soundwave-style visual art. Because every character produces a unique waveform, no two pieces are ever the same. It runs entirely on your device: nothing is uploaded to a server, and no account is needed.',
        scenarios: [
          'Personalized avatars and profile pictures for social media, dating apps, or work accounts.',
          'Couple or family gifts — overlay two or three names on a single canvas and print as wall art, mugs, or jewelry references.',
          'Tattoo reference artwork: print the wave pattern your name produces and take it to your artist.',
          'Branding assets for indie creators, podcasters, or musicians — a visual identity made from your own tagline.',
          'Meaningful gifts for birthdays, anniversaries, graduation, or newborns using a name or birth date as input.'
        ],
        tutorial: [
          'Step 1: Type the name, word, or phrase you want to turn into wave art in the main input box.',
          'Step 2: Choose a style — Minimal (clean thin lines), Neon (glow on dark background), or Spectrum (radio-frequency bars).',
          'Step 3: Pick one of the preset color palettes. Each style has its own curated palettes.',
          'Step 4 (optional): Turn on Overlay mode and add a second or third name to combine multiple waveforms on one canvas. Adjust the individual opacity of each layer.',
          'Step 5: Click Export PNG to download a high-resolution transparent or opaque image you can print, post, or share.'
        ],
        advantages: [
          '100% client-side. Your text and generated artwork never leave your browser — no uploads, no tracking, no watermarks.',
          'Deterministic per character. The same name always produces the same wave, so the piece is reproducible and shareable.',
          'Three distinct art styles and five curated palettes, giving you 15+ visual directions per input.',
          'Overlay up to three names with independent opacity control for couple / family / team pieces.',
          'High-resolution PNG export at print-friendly sizes. No paid tier to unlock download quality.'
        ],
        faqs: [
          { q: 'Is Voice Wave Art Generator free to use?', a: 'Yes. All core features — every style, every palette, overlay mode, and PNG export — are permanently free, no sign-up, no watermarks, no hidden paywalls.' },
          { q: 'Do I need to create an account?', a: 'No. You can use the full tool instantly from any modern browser on phone, tablet, or desktop. No email, no login, no cookie tracking.' },
          { q: 'Is my text and data kept private?', a: 'Yes. Voice Wave Art Generator runs entirely in your browser when technically possible. All text input, rendering, and export are processed on your own device. Nothing is uploaded to our servers, and there are no tracking cookies.' },
          { q: 'Which devices and browsers are supported?', a: 'It works on any modern browser (Chrome, Edge, Safari, Firefox) on Windows, macOS, iOS, and Android. Export as PNG is supported on all of them. Touch controls are optimized for mobile.' },
          { q: 'Will the same name always look identical?', a: 'Yes. Waveform math is deterministic per character, so as long as the input text, style, and palette are the same, the result is reproducible anywhere — perfect for matching gifts or tattoo references.' }
        ]
      }
    },
    'life-weeks': {
      name: 'Life in Weeks Visualizer',
      description: 'Enter your birthday and see a grid of 4,000 weeks that represents your whole life. Weeks you have already lived are filled in, weeks that remain are blank. Adjust your life expectancy, pick a fill color, export as PNG. A simple visualization that hits hard and gets shared.',
      seo: {
        intro: 'Life in Weeks Visualizer is a free browser tool that shows you the whole sweep of your life as a single 4,000-cell grid — one square per week. People often describe it as humbling, motivating, and strangely calming at the same time. Like every Korelyy tool, it runs locally in your browser, no uploads and no signup.',
        scenarios: [
          'Personal reflection and goal-setting: look at the remaining weeks as a concrete budget, not an abstract number.',
          'Birthday posts and social shares — especially at decade birthdays (30th, 40th, 50th) when the grid really hits.',
          'New Year or back-to-school reset: use the visual to plan what you want the next N weeks to look like.',
          'Gift to recent graduates or anyone at a crossroads: a gentle nudge to think about what to prioritize.',
          'Therapy and journaling prompts: seeing lived and remaining weeks side by side is a powerful conversation starter.'
        ],
        tutorial: [
          'Step 1: Select your date of birth using the date picker. The grid instantly recalculates.',
          'Step 2: Adjust the expected life span if you want to see a longer or shorter total grid. Default is 80 years ≈ 4,160 weeks.',
          'Step 3: Pick a fill color for the weeks already lived. The remaining weeks stay empty by design for contrast.',
          'Step 4 (optional): Mark a future milestone date (wedding, graduation, retirement target) to see it highlighted on the grid.',
          'Step 5: Click Export PNG to save the full grid as an image you can post, print, or keep for yourself.'
        ],
        advantages: [
          'Runs 100% locally. Your birthday and milestones are never sent anywhere. Privacy by design.',
          'Precise calculation: weeks-lived is computed using real elapsed milliseconds, not just years × 52, so the count is accurate even today.',
          'Adjustable life expectancy. The default is a healthy 80 years, but you can set any realistic value to match actuarial tables or personal planning.',
          'Milestone markers. Pin future dates onto the grid so you can see how close — or far — they really are.',
          'Clean, print-friendly export. No Korelyy branding, no watermark, nothing in the way of the message the grid carries.'
        ],
        faqs: [
          { q: 'Is Life in Weeks Visualizer free to use?', a: 'Yes. The full tool — exact week counting, life-expectancy slider, color picker, milestone markers, and PNG export — is permanently free, no signup, no watermarks, no hidden paywalls.' },
          { q: 'Do I need to create an account or log in?', a: 'No. You can open the page and use the whole tool instantly from any modern browser on any device. No email, no account, no cookie tracking.' },
          { q: 'Will my birthday or data be stored or uploaded?', a: 'No. Everything — date input, calculation, and rendering — runs inside your own browser when technically possible. Nothing is sent to our servers, and we do not use tracking cookies.' },
          { q: 'Which devices does it work on?', a: 'All modern desktop and mobile browsers on Windows, macOS, Linux, iOS, and Android. The layout is responsive and the grid is fully scrollable on phones.' },
          { q: 'Why 4,000 weeks? Is that accurate?', a: '4,000 weeks is a widely-used, slightly rounded shorthand for a ~77-year lifespan. We default to 80 years (≈4,160 weeks) and let you adjust the total anywhere from 60 to 100 years. The count of lived weeks is computed precisely from your exact birth date and today\'s real date.' }
        ]
      }
    },
    'excuse-generator': {
      name: 'Excuse Generator Card',
      description: 'Pick a situation — running late, skipping work, canceling plans, missing a deadline — and instantly generate a plausible-sounding excuse. Toggle between Serious mode (you would actually say this) and Ridiculous mode (you send it to your best friend). Download the result as a shareable card PNG.',
      seo: {
        intro: 'Excuse Generator Card is a silly-but-genuinely-useful free browser tool that writes context-appropriate excuses on demand. Serious mode pulls from a curated pool of realistic, situationally correct lines. Ridiculous mode is for when you just want to make someone laugh. Either way, one tap and you can share the result as a polished card image.',
        scenarios: [
          'Texting your boss you are running late in the morning — Serious mode, Late scenario.',
          'Bailing on a casual meetup with friends — flip to Ridiculous mode for maximum comedy.',
          'Messaging a client or teammate when a deadline actually is slipping — Serious mode to sound professional and proactive.',
          'Group chat banter: generate a ludicrous excuse and drop it when someone asks why you are not there yet.',
          'Social shares and memes: save a funny one as a card PNG and post it — the shareable format is built for that.'
        ],
        tutorial: [
          'Step 1: Pick the scenario that best matches what you need: Late, Skip Work, Cancel Plans, or Missed Deadline.',
          'Step 2: Choose your tone — Serious for lines you can actually use, or Ridiculous when it is just for laughs.',
          'Step 3: Tap Generate. A new random excuse from the curated pool appears instantly.',
          'Step 4 (optional): Tap Generate again as many times as you want — each press rolls a new line.',
          'Step 5: When you land on one you like, click Download Card to save a formatted card PNG you can text or post.'
        ],
        advantages: [
          'Hand-curated pools, not generic filler. Each scenario × tone combination has its own dedicated list of lines written to sound natural, not AI-plastic.',
          'One-tap generation with zero friction. No form to fill, no settings page, just pick a scenario and go.',
          'Polished shareable card export. The PNG download is sized for texting and social feeds out of the box.',
          'Runs fully in the browser. No server round-trips, no latency, and nothing you type is ever collected.',
          'Six languages. Scenario names, button labels, and line pools are available in English, Chinese, Spanish, French, Hindi, and Arabic.'
        ],
        faqs: [
          { q: 'Is Excuse Generator Card free?', a: 'Yes. Every scenario, every tone, unlimited re-rolls, and the shareable PNG card export — all are permanently free, no signup, no watermarks, no hidden paywalls.' },
          { q: 'Do I need to sign up?', a: 'No. Open the page and start generating immediately from any modern browser, on any phone, tablet, or desktop. No email, no login, no tracking cookies.' },
          { q: 'Is what I generate private?', a: 'Yes. The tool runs fully in your browser when technically possible. All generation, rendering, and export happen on your own device. Nothing is sent to our servers, and no tracking cookies are used.' },
          { q: 'Will it work on my phone?', a: 'Yes. The layout is fully responsive, buttons have 44px+ touch targets, and card download works on mobile browsers (Chrome, Safari, Edge).' },
          { q: 'Can I suggest or add new excuse lines?', a: 'Line pools are curated by the Korelyy team to keep quality high. If you have a great line, reach out via the site contact email and we may add it (credited) in a future update.' }
        ]
      }
    }
  }
};

// 其他5个语言（es/fr/hi/ar/zh）——每段基于英文地道翻译，非机翻
CONTENT.zh = {
  'wave-art': {
    name: '声音波形艺术图生成器',
    description: '输入名字或一句话，把每个字符映射为独特的频率、振幅和相位，生成独一无二的声波艺术图。支持极简线条、霓虹发光、电台频谱三种风格，可叠加多人名字波形，一键导出 PNG。适合做头像、纹身参考、情侣礼物、家居装饰画。',
    seo: {
      intro: '声音波形艺术图生成器是一款免费的浏览器端工具，可以把任意名字、词语、日期甚至一句话转换成独一无二的声波风格艺术图。因为每个字符都会生成独特的波形，所以没有两幅作品是完全一样的。全部运算在您的设备本地完成，不上传服务器，无需注册账号。',
      scenarios: [
        '制作个性化头像或社交媒体、约会软件、工作账号的个人展示图片。',
        '情侣或家庭礼物——把两到三个名字叠在同一张画布上，打印成装饰画、马克杯或作为首饰设计参考。',
        '纹身参考：把名字生成的波形图案打印出来，直接交给纹身师。',
        '独立创作者、播客、音乐人视觉品牌资产：用自己的 slogan 生成专属视觉身份。',
        '生日、纪念日、毕业、新生儿等具有纪念意义的礼物，以名字或出生日期为输入。'
      ],
      tutorial: [
        '第一步：在主输入框中输入想要转换为波形艺术的名字、词语或一句话。',
        '第二步：选择风格——极简（干净细线）、霓虹（深色背景发光）、频谱（柱状电台波形）。',
        '第三步：从预设配色方案中挑选一组，每种风格都有独立的精心配色。',
        '第四步（可选）：打开叠加模式，添加第二个或第三个名字，把多条波形组合到一张画布上，每层都可以独立调节透明度。',
        '第五步：点击「导出 PNG」下载高分辨率图片，支持透明或白底，可直接打印、发布或分享。'
      ],
      advantages: [
        '100% 浏览器端运行。您的文字和生成的作品永远不会离开浏览器——无上传、无跟踪、无水印。',
        '字符级确定性算法。同一个名字永远生成同一张波形，可以稳定复现和分享。',
        '三种截然不同的艺术风格 + 五套精选配色，每次输入至少 15 种视觉方向。',
        '最多叠加三个名字，每层透明度独立控制，适合情侣、家庭、团队作品。',
        '高分辨率 PNG 导出，打印友好尺寸，解锁下载质量无需付费。'
      ],
      faqs: [
        { q: '声音波形艺术图生成器是免费的吗？', a: '是的。所有核心功能——全部风格、全部配色、叠加模式、PNG 导出——永久免费，无需注册登录，无水印，无隐藏付费墙。' },
        { q: '需要注册账号吗？', a: '不需要。用手机、平板或电脑上任何现代浏览器打开即可直接使用完整功能。不需要邮箱、不需要登录、没有跟踪 Cookie。' },
        { q: '我的文字和数据是隐私的吗？', a: '是的。在技术允许的情况下，声音波形艺术图生成器完全在您的浏览器内运行。所有文字输入、渲染和导出都在您自己的设备上处理，不向服务器上传任何内容，也没有跟踪 Cookie。' },
        { q: '支持哪些设备和浏览器？', a: 'Windows、macOS、iOS、Android 上的任意现代浏览器（Chrome、Edge、Safari、Firefox）都可以运行，全部支持 PNG 导出，触控操作已针对手机优化。' },
        { q: '同一个名字每次生成的图都是一样的吗？', a: '是的。波形算法对每个字符都是确定性的，只要输入文本、风格、配色相同，在任何地方生成的结果都完全一致——非常适合配套礼物或纹身参考。' }
      ]
    }
  },
  'life-weeks': {
    name: '人生进度条可视化工具',
    description: '输入生日，即刻看到一张 4000 周网格图代表你整个人生。活过的周填色，剩下的周留白。可调整预期寿命、自定义填色、标记未来里程碑，导出 PNG。一张图的冲击力，远比抽象数字更能引发思考和转发。',
    seo: {
      intro: '人生进度条可视化工具是一款免费的浏览器端工具，用一张约 4000 格的网格把整个人生摊开来，每一格就是一周。很多人形容它「震撼、让人踏实、又莫名治愈」。和所有 Korelyy 工具一样，完全运行在您的浏览器本地，不上传任何数据，也无需注册。',
      scenarios: [
        '个人反思与目标设定：把剩下的周数当一份「实打实地预算」看待，而不是抽象的数字。',
        '生日发帖和社交分享——尤其是 30、40、50 这种逢十大寿，这张图非常有冲击力。',
        '新年或开学复盘：用这张可视化图规划接下来 N 周的事情。',
        '送给应届毕业生或处在人生转折点的人一份礼物：一种温柔的提醒，让人思考优先事项。',
        '心理咨询和写作疗愈：已活的周和未活的周并列展示，是极好的对话和写作切入点。'
      ],
      tutorial: [
        '第一步：用日期选择器输入您的出生日期，网格会立刻重算。',
        '第二步：如果想看到更长或更短的总寿命，可以调整预期寿命滑块。默认 80 年 ≈ 4160 周。',
        '第三步：为「已活周」挑选一种填充颜色，剩下的周保持空白，对比效果最强烈。',
        '第四步（可选）：标记一个未来的里程碑日期（婚礼、毕业、退休目标等），它会在网格上高亮显示。',
        '第五步：点击「导出 PNG」，把完整网格保存成图片，可以发出来、打印出来，或留作私人收藏。'
      ],
      advantages: [
        '100% 本地运行。您的生日和里程碑不会被发送到任何地方，隐私设计从一开始就是默认。',
        '精确计算：已活周数用真实经过的毫秒数换算，而不是粗略用 年 × 52，即使今天看也是精准的。',
        '可调预期寿命。默认是健康的 80 岁，也可设置 60 到 100 岁之间任意现实值，匹配精算表或个人规划。',
        '里程碑标记。未来日期可以钉在网格上，让你直观看到它们到底「还有多远 / 有多近」。',
        '干净、打印友好的导出。不带 Korelyy 品牌标识，无水印，不干扰图本身传达的信息。'
      ],
      faqs: [
        { q: '人生进度条可视化工具是免费的吗？', a: '是的。完整功能——精确周数计数、预期寿命滑块、颜色选择、里程碑标记、PNG 导出——永久免费，无需注册登录，无水印，无隐藏付费墙。' },
        { q: '需要注册或登录吗？', a: '不需要。打开页面即可在任何设备的现代浏览器上立即使用全部功能，不需要邮箱、不需要账号、没有跟踪 Cookie。' },
        { q: '我的生日或数据会被存储或上传吗？', a: '不会。在技术允许的情况下，日期输入、计算、渲染全部在您自己的浏览器内完成，不向服务器发送任何内容，也不使用跟踪 Cookie。' },
        { q: '支持哪些设备？', a: 'Windows、macOS、Linux、iOS、Android 上的任意现代桌面和移动浏览器都可以。布局响应式，网格在手机上也可以完整滚动查看。' },
        { q: '为什么是 4000 周？这个数字准确吗？', a: '4000 周是一个广泛使用、略微取整的约数，对应约 77 岁的平均寿命。我们默认设置为 80 年（≈4160 周），并允许用户在 60 到 100 岁之间自由调整。已活周数则完全按您的精确生日和今天的真实日期计算，十分准确。' }
      ]
    }
  },
  'excuse-generator': {
    name: '借口生成器卡片工具',
    description: '选择场景（迟到、翘班、不想赴约、deadline 拖了），一键生成听起来合理的借口。可以切换「正经模式」（你真的会发出去那种）和「离谱模式」（专发损友群）。结果可以直接下载成精美卡片 PNG，天然想转发。',
    seo: {
      intro: '借口生成器卡片工具是一款「又好笑又真能用」的免费浏览器端工具，根据场景按需写出切题借口。正经模式的台词来自精心整理、符合真实语境的语料库；离谱模式则纯粹为博君一笑。不管选哪种，一键即可把结果导出成精美卡片图分享。',
      scenarios: [
        '早上给老板发消息说你要迟到——用正经模式 + 迟到场景。',
        '朋友间临时取消聚会——切到离谱模式，笑到他们舍不得骂你。',
        '真的要拖稿时发给客户或队友——正经模式，措辞专业且主动，不会显得敷衍。',
        '群聊整活：生成一个离谱借口丢进去，当有人问你怎么还没到的时候。',
        '社交平台发帖玩梗：把好笑的那条保存成卡片 PNG，格式刚好适合直接发。'
      ],
      tutorial: [
        '第一步：挑选最匹配的场景——迟到、翘班、不想赴约、deadline 拖了。',
        '第二步：选择语气——正经（真正能用的说法）或离谱（纯粹搞笑）。',
        '第三步：点击「生成」，从语料库里随机抽一条，立刻显示出来。',
        '第四步（可选）：不满意就再点一次生成，每次都抽新的一条，不限次数。',
        '第五步：遇到满意的，点击「下载卡片」保存成格式化的 PNG，直接发微信或社交平台。'
      ],
      advantages: [
        '人工精选语料，不是通用模板水词。每种场景 × 语气组合都有独立的台词库，措辞自然不 AI。',
        '零摩擦一键生成。无需填表单、没有复杂设置页，选完场景直接出结果。',
        '精美分享卡片导出，PNG 尺寸已经针对聊天和社交平台做好了优化。',
        '完全在浏览器内运行，不走服务器，没有网络延迟，也不会收集你输入的任何内容。',
        '六语言支持。场景名、按钮文案、台词库都有英、中、西、法、印地、阿拉伯语版本。'
      ],
      faqs: [
        { q: '借口生成器卡片工具是免费的吗？', a: '是的。全部场景、全部语气、不限次重抽、精美 PNG 卡片导出——永久免费，无需注册登录，无水印，无隐藏付费墙。' },
        { q: '需要注册吗？', a: '不需要。打开页面即可在手机、平板、电脑上的任何现代浏览器立即使用。不需要邮箱、不需要登录、没有跟踪 Cookie。' },
        { q: '我生成的内容是隐私的吗？', a: '是的。在技术允许的情况下，工具完全在您的浏览器内运行，所有生成、渲染、导出都在您自己的设备上完成，不向服务器发送任何内容，也不使用跟踪 Cookie。' },
        { q: '手机上能用吗？', a: '可以。布局完全响应式，按钮触控热区 ≥ 44px，卡片下载在手机浏览器（Chrome、Safari、Edge）上都可以正常保存。' },
        { q: '我可以贡献新的借口台词吗？', a: '台词库由 Korelyy 团队精挑细选以保证质量。如果你有特别棒的想法，可以通过站点邮箱发给我们，在后续版本中可能会加入（并署名）。' }
      ]
    }
  }
};

// 西班牙语
CONTENT.es = {
  'wave-art': {
    name: 'Generador de Arte de Ondas de Voz',
    description: 'Convierte cualquier nombre o frase en una pieza única de arte visual de onda sonora. Cada carácter se mapea a su propia frecuencia, amplitud y fase. Elige entre estilos de líneas minimalistas, brillo neón y espectro de radio. Superpon varios nombres, elige una paleta y exporta en PNG: ideal para avatares, tatuajes, regalos de pareja o cuadros.',
    seo: {
      intro: 'El Generador de Arte de Ondas de Voz es una herramienta gratuita basada en el navegador que convierte texto —un nombre, una palabra, una fecha o una frase completa— en un arte visual único estilo onda sonora. Como cada carácter produce una onda distinta, no hay dos piezas iguales. Funciona íntegramente en tu dispositivo: no se sube nada al servidor y no necesitas crear una cuenta.',
      scenarios: [
        'Avatares personalizados y fotos de perfil para redes sociales, apps de citas o cuentas de trabajo.',
        'Regalos de pareja o familiares: superpon dos o tres nombres en un mismo lienzo e imprímelo como cuadro, taza o referencia para joyas.',
        'Referencia artística para tatuajes: imprime el patrón de ondas de tu nombre y llévaselo a tu artista.',
        'Identidad visual para creadores independientes, podcasters o músicos: una identidad hecha a partir de tu propio eslogan.',
        'Regalos significativos para cumpleaños, aniversarios, graduaciones o recién nacidos usando un nombre o la fecha de nacimiento.'
      ],
      tutorial: [
        'Paso 1: Escribe el nombre, palabra o frase que quieres convertir en arte de ondas en el cuadro de entrada principal.',
        'Paso 2: Elige un estilo: Minimalista (líneas finas limpias), Neón (brillo sobre fondo oscuro) o Espectro (barras de radiofrecuencia).',
        'Paso 3: Selecciona una de las paletas de colores predefinidas. Cada estilo tiene sus propias paletas cuidadas.',
        'Paso 4 (opcional): Activa el modo Superposición y añade un segundo o tercer nombre para combinar varias ondas en un mismo lienzo. Ajusta la opacidad independiente de cada capa.',
        'Paso 5: Haz clic en Exportar PNG para descargar una imagen de alta resolución, transparente u opaca, lista para imprimir, publicar o compartir.'
      ],
      advantages: [
        '100% en el cliente. Tu texto y la obra generada nunca abandonan tu navegador: sin subidas, sin seguimiento, sin marcas de agua.',
        'Determinista por carácter. El mismo nombre siempre produce la misma onda, por lo que la pieza es reproducible y compartible.',
        'Tres estilos artísticos distintos y cinco paletas cuidadas, lo que te ofrece más de 15 direcciones visuales por entrada.',
        'Superposición de hasta tres nombres con control de opacidad independiente para piezas de pareja, familia o equipo.',
        'Exportación en PNG de alta resolución con tamaños aptos para impresión. No hay nivel de pago para desbloquear calidad de descarga.'
      ],
      faqs: [
        { q: '¿El Generador de Arte de Ondas de Voz es gratuito?', a: 'Sí. Todas las funciones principales —todos los estilos, todas las paletas, el modo superposición y la exportación PNG— son permanentemente gratuitos, sin registro, sin marcas de agua y sin muros de pago ocultos.' },
        { q: '¿Necesito crear una cuenta?', a: 'No. Puedes usar la herramienta completa al instante desde cualquier navegador moderno en móvil, tableta u ordenador. Sin correo, sin inicio de sesión, sin cookies de seguimiento.' },
        { q: '¿Mi texto y mis datos se mantienen privados?', a: 'Sí. El Generador de Arte de Ondas de Voz se ejecuta íntegramente en tu navegador cuando técnicamente es posible. Todo el texto, el renderizado y la exportación se procesan en tu propio dispositivo. No se sube nada a nuestros servidores y no hay cookies de seguimiento.' },
        { q: '¿Qué dispositivos y navegadores son compatibles?', a: 'Funciona en cualquier navegador moderno (Chrome, Edge, Safari, Firefox) en Windows, macOS, iOS y Android. La exportación PNG está soportada en todos ellos. Los controles táctiles están optimizados para móviles.' },
        { q: '¿El mismo nombre siempre tendrá el mismo aspecto?', a: 'Sí. La matemática de la onda es determinista por carácter, así que siempre que el texto, el estilo y la paleta sean iguales, el resultado es reproducible en cualquier lugar —ideal para regalos a juego o referencias de tatuaje.' }
      ]
    }
  },
  'life-weeks': {
    name: 'Visualizador de Vida en Semanas',
    description: 'Introduce tu fecha de nacimiento y verás una cuadrícula de 4000 semanas que representa toda tu vida. Las semanas que ya has vivido aparecen rellenas, las que quedan en blanco. Ajusta la esperanza de vida, elige un color de relleno y exporta en PNG. Una visualización sencilla, impactante y muy compartible.',
    seo: {
      intro: 'El Visualizador de Vida en Semanas es una herramienta gratuita para el navegador que te muestra todo el recorrido de tu vida como una sola cuadrícula de 4000 celdas —un cuadro por cada semana. Mucha gente lo describe como humilde, motivador y extrañamente tranquilizador a la vez. Como todas las herramientas de Korelyy, se ejecuta localmente en tu navegador, sin subidas y sin registro.',
      scenarios: [
        'Reflexión personal y establecimiento de metas: mira las semanas que te quedan como un presupuesto concreto, no como un número abstracto.',
        'Publicaciones de cumpleaños y compartidos en redes —especialmente en cumpleaños de década (30, 40, 50), cuando la cuadrícula cobra mucho sentido.',
        'Reinicio de año nuevo o vuelta al cole: usa la visualización para planificar cómo quieres que sean las próximas N semanas.',
        'Regalo para recién graduados o cualquiera en un momento de cambio: un empujón suave para pensar en qué priorizar.',
        'Disparador en terapia y diarios: ver las semanas vividas y las restantes juntas es un excelente punto de partida para conversaciones y escritura.'
      ],
      tutorial: [
        'Paso 1: Selecciona tu fecha de nacimiento con el selector de fechas. La cuadrícula se recalcula al instante.',
        'Paso 2: Ajusta la esperanza de vida si quieres ver una cuadrícula total más larga o más corta. El valor por defecto son 80 años ≈ 4160 semanas.',
        'Paso 3: Elige un color de relleno para las semanas ya vividas. Las semanas restantes se quedan vacías a propósito para generar contraste.',
        'Paso 4 (opcional): Marca una fecha de hito futura (boda, graduación, jubilación) para verla resaltada en la cuadrícula.',
        'Paso 5: Haz clic en Exportar PNG para guardar la cuadrícula completa como imagen; puedes publicarla, imprimirla o quedártela.'
      ],
      advantages: [
        'Se ejecuta 100% de forma local. Tu fecha de nacimiento y tus hitos no se envían a ningún sitio. Privacidad por diseño.',
        'Cálculo preciso: las semanas vividas se computan usando los milisegundos reales transcurridos, no solo años × 52, así que el recuento es exacto incluso hoy.',
        'Esperanza de vida ajustable. El valor por defecto son 80 años saludables, pero puedes poner cualquier valor realista para tablas actuariales o planificación personal.',
        'Marcadores de hitos. Fija fechas futuras en la cuadrícula para ver qué tan cerca —o qué tan lejos— están realmente.',
        'Exportación limpia y apta para impresión. Sin marca Korelyy, sin marca de agua, nada que interrumpa el mensaje que la cuadrícula transmite.'
      ],
      faqs: [
        { q: '¿El Visualizador de Vida en Semanas es gratuito?', a: 'Sí. Toda la herramienta —recuento exacto de semanas, deslizador de esperanza de vida, selector de color, marcadores de hitos y exportación PNG— es permanentemente gratuita, sin registro, sin marcas de agua y sin muros de pago ocultos.' },
        { q: '¿Necesito crear una cuenta o iniciar sesión?', a: 'No. Abre la página y usa toda la herramienta al instante desde cualquier navegador moderno en cualquier dispositivo. Sin correo, sin cuenta, sin cookies de seguimiento.' },
        { q: '¿Mi fecha de nacimiento o mis datos se almacenan o suben?', a: 'No. Todo —introducción de fechas, cálculo y renderizado— se ejecuta dentro de tu propio navegador cuando técnicamente es posible. No se envía nada a nuestros servidores y no usamos cookies de seguimiento.' },
        { q: '¿En qué dispositivos funciona?', a: 'En todos los navegadores modernos de escritorio y móvil en Windows, macOS, Linux, iOS y Android. El diseño es adaptativo y la cuadrícula es completamente desplazable en teléfonos.' },
        { q: '¿Por qué 4000 semanas? ¿Es preciso?', a: '4000 semanas es una abreviatura muy usada, ligeramente redondeada, para una vida de ~77 años. Por defecto usamos 80 años (≈4160 semanas) y te permitimos ajustar el total entre 60 y 100 años. El recuento de semanas vividas se calcula con precisión a partir de tu fecha exacta de nacimiento y la fecha real de hoy.' }
      ]
    }
  },
  'excuse-generator': {
    name: 'Tarjeta Generadora de Excusas',
    description: 'Elige una situación —llegar tarde, faltar al trabajo, cancelar planes, perder una fecha límite— y genera al instante una excusa creíble. Alterna entre el modo Serio (dirías esto de verdad) y el modo Ridículo (esto se lo mandas a tu mejor amigo). Descarga el resultado como una tarjeta compartible en PNG.',
    seo: {
      intro: 'Tarjeta Generadora de Excusas es una herramienta gratuita para el navegador, a la vez absurda y genuinamente útil, que escribe excusas adecuadas al contexto bajo demanda. El modo Serio extrae líneas realistas y situacionalmente correctas de una base curada. El modo Ridículo es para cuando solo quieres hacer reír a alguien. De cualquiera de las dos formas, con un toque puedes compartir el resultado como una imagen de tarjeta bien presentada.',
      scenarios: [
        'Enviar un mensaje a tu jefe diciendo que llegarás tarde por la mañana —modo Serio, escenario Llegar tarde.',
        'Cancelar una quedada casual con amigos —cambia al modo Ridículo para máxima comedia.',
        'Mensajear a un cliente o compañero cuando una fecha límite realmente se está retrasando —modo Serio para sonar profesional y proactivo.',
        'Bromas en el chat grupal: genera una excusa ridícula y suéltala cuando alguien te pregunte por qué aún no has llegado.',
        'Compartidos en redes y memes: guarda una graciosa como tarjeta PNG y publícala —el formato compartible está hecho para eso.'
      ],
      tutorial: [
        'Paso 1: Elige el escenario que mejor se ajuste a lo que necesitas: Llegar tarde, Faltar al trabajo, Cancelar planes o Perder fecha límite.',
        'Paso 2: Elige el tono: Serio para frases que puedes usar de verdad, o Ridículo cuando es solo para reír.',
        'Paso 3: Toca Generar. Una nueva excusa aleatoria de la base curada aparece al instante.',
        'Paso 4 (opcional): Toca Generar otra vez todas las veces que quieras —cada pulsación saca una línea nueva.',
        'Paso 5: Cuando te guste alguna, haz clic en Descargar tarjeta para guardar un PNG formateado que puedes enviar por mensaje o publicar.'
      ],
      advantages: [
        'Bases curadas a mano, no relleno genérico. Cada combinación de escenario × tono tiene su propia lista de líneas escritas para sonar naturales, no de plástico.',
        'Generación con un toque y cero fricción. Sin formularios que rellenar, sin página de ajustes, solo elige un escenario y listo.',
        'Exportación de tarjeta compartible bien presentada. El PNG descargado tiene el tamaño justo para mensajes y redes sociales.',
        'Se ejecuta totalmente en el navegador. Sin viajes al servidor, sin latencia, y nada de lo que escribas se recopila jamás.',
        'Seis idiomas. Los nombres de escenario, las etiquetas de los botones y las líneas están disponibles en inglés, chino, español, francés, hindi y árabe.'
      ],
      faqs: [
        { q: '¿Tarjeta Generadora de Excusas es gratuita?', a: 'Sí. Todos los escenarios, todos los tonos, los relanzamientos ilimitados y la tarjeta PNG compartible —todo es permanentemente gratuito, sin registro, sin marcas de agua y sin muros de pago ocultos.' },
        { q: '¿Necesito registrarme?', a: 'No. Abre la página y empieza a generar inmediatamente desde cualquier navegador moderno, en cualquier móvil, tableta u ordenador. Sin correo, sin inicio de sesión, sin cookies de seguimiento.' },
        { q: '¿Lo que genero es privado?', a: 'Sí. La herramienta se ejecuta totalmente en tu navegador cuando técnicamente es posible. Toda la generación, el renderizado y la exportación ocurren en tu propio dispositivo. No se envía nada a nuestros servidores y no se usan cookies de seguimiento.' },
        { q: '¿Funciona en mi móvil?', a: 'Sí. El diseño es totalmente adaptativo, los botones tienen zonas táctiles de 44px o más, y la descarga de tarjetas funciona en navegadores móviles (Chrome, Safari, Edge).' },
        { q: '¿Puedo sugerir o añadir nuevas líneas de excusas?', a: 'Las bases de líneas son curadas por el equipo de Korelyy para mantener la calidad alta. Si tienes una frase genial, escríbenos al correo de contacto del sitio y quizás la añadamos (con crédito) en una actualización futura.' }
      ]
    }
  }
};

// 法语
CONTENT.fr = {
  'wave-art': {
    name: 'Générateur d\'Art d\'Onde Vocale',
    description: 'Transformez n\'importe quel nom ou phrase en une pièce unique d\'art visuel d\'onde sonore. Chaque caractère correspond à sa propre fréquence, amplitude et phase. Choisissez entre lignes minimalistes, lueur néon et spectre radio. Superposez plusieurs noms, sélectionnez une palette et exportez en PNG — parfait pour avatars, tatouages, cadeaux de couple ou décor mural.',
    seo: {
      intro: 'Le Générateur d\'Art d\'Onde Vocale est un outil gratuit basé sur le navigateur qui convertit un texte — un nom, un mot, une date ou une phrase complète — en un art visuel unique de type onde sonore. Comme chaque caractère produit une forme d\'onde distincte, aucune pièce n\'est identique à une autre. Tout s\'exécute entièrement sur votre appareil : rien n\'est téléchargé vers un serveur et aucun compte n\'est requis.',
      scenarios: [
        'Avatars personnalisés et photos de profil pour les réseaux sociaux, applications de rencontre ou comptes professionnels.',
        'Cadeaux de couple ou en famille — superposez deux ou trois noms sur une même toile et imprimez-la comme tableau, mug ou référence pour un bijou.',
        'Référence artistique pour tatouage : imprimez le motif d\'onde produit par votre nom et emportez-le chez votre artiste.',
        'Identité visuelle pour créateurs indépendants, podcasteurs ou musiciens — une identité visuelle façonnée à partir de votre propre slogan.',
        'Cadeaux chargés de sens pour anniversaires, mariages, diplômes ou naissances, avec un nom ou une date de naissance en entrée.'
      ],
      tutorial: [
        'Étape 1 : Saisissez le nom, le mot ou la phrase à transformer en art d\'onde dans le champ de saisie principal.',
        'Étape 2 : Choisissez un style — Minimaliste (lignes fines épurées), Néon (lueur sur fond sombre) ou Spectre (barres de radiofréquence).',
        'Étape 3 : Sélectionnez l\'une des palettes de couleurs prédéfinies. Chaque style dispose de ses propres palettes soignées.',
        'Étape 4 (facultatif) : Activez le mode Superposition et ajoutez un deuxième ou troisième nom pour combiner plusieurs ondes sur une même toile. Ajustez l\'opacité indépendante de chaque couche.',
        'Étape 5 : Cliquez sur Exporter PNG pour télécharger une image haute résolution, transparente ou opaque, prête à imprimer, publier ou partager.'
      ],
      advantages: [
        '100 % côté client. Votre texte et l\'œuvre générée ne quittent jamais votre navigateur — aucun envoi, aucun suivi, aucun filigrane.',
        'Déterministe par caractère. Le même nom produit toujours la même onde, donc la pièce est reproductible et partageable.',
        'Trois styles artistiques distincts et cinq palettes soignées, offrant plus de 15 directions visuelles par saisie.',
        'Superposition de jusqu\'à trois noms avec contrôle d\'opacité indépendant pour des pièces de couple, de famille ou d\'équipe.',
        'Export PNG haute résolution aux tailles adaptées à l\'impression. Aucun abonnement payant pour débloquer la qualité de téléchargement.'
      ],
      faqs: [
        { q: 'Le Générateur d\'Art d\'Onde Vocale est-il gratuit ?', a: 'Oui. Toutes les fonctions essentielles — tous les styles, toutes les palettes, le mode superposition et l\'export PNG — sont définitivement gratuits, sans inscription, sans filigrane, sans mur de paiement caché.' },
        { q: 'Dois-je créer un compte ?', a: 'Non. Vous pouvez utiliser l\'outil complet instantanément depuis n\'importe quel navigateur moderne sur téléphone, tablette ou ordinateur. Pas d\'e-mail, pas de connexion, pas de cookie de suivi.' },
        { q: 'Mon texte et mes données restent-ils privés ?', a: 'Oui. Le Générateur d\'Art d\'Onde Vocale s\'exécute entièrement dans votre navigateur lorsque c\'est techniquement possible. Tout le traitement du texte, du rendu et de l\'export se fait sur votre propre appareil. Rien n\'est envoyé à nos serveurs et il n\'y a aucun cookie de suivi.' },
        { q: 'Quels appareils et navigateurs sont pris en charge ?', a: 'Fonctionne sur tous les navigateurs modernes (Chrome, Edge, Safari, Firefox) sous Windows, macOS, iOS et Android. L\'export PNG est pris en charge sur l\'ensemble. Les commandes tactiles sont optimisées pour le mobile.' },
        { q: 'Le même nom donnera-t-il toujours un rendu identique ?', a: 'Oui. La mathématique de la forme d\'onde est déterministe par caractère. Tant que le texte d\'entrée, le style et la palette sont identiques, le résultat est reproductible partout — parfait pour des cadeaux assortis ou des références de tatouage.' }
      ]
    }
  },
  'life-weeks': {
    name: 'Visualiseur de Vie en Semaines',
    description: 'Entrez votre date de naissance et découvrez une grille de 4 000 semaines qui représente toute votre vie. Les semaines déjà vécues sont coloriées, celles qui restent sont vides. Ajustez l\'espérance de vie, choisissez une couleur de remplissage, exportez en PNG. Une visualisation simple qui frappe l\'esprit et se partage énormément.',
    seo: {
      intro: 'Le Visualiseur de Vie en Semaines est un outil gratuit pour navigateur qui vous montre toute l\'étendue de votre vie sous forme d\'une seule grille d\'environ 4 000 cellules — une case par semaine. Beaucoup la décrivent à la fois comme un coup de gueule salutaire, un puissant moteur de motivation et une source de calme étrange. Comme tous les outils Korelyy, il fonctionne localement dans votre navigateur, sans envoi de données et sans inscription.',
      scenarios: [
        'Réflexion personnelle et définition d\'objectifs : voyez les semaines restantes comme un budget concret, pas comme un chiffre abstrait.',
        'Publications d\'anniversaire et partages sociaux — particulièrement pour les anniversaires de décennie (30, 40, 50 ans), quand la grille prend tout son sens.',
        'Rentrée ou début d\'année : utilisez la visualisation pour planifier ce que vous voulez faire des N prochaines semaines.',
        'Cadeau à de jeunes diplômés ou à toute personne à la croisée des chemins : un petit coup de pouce pour réfléchir à ses priorités.',
        'Support de thérapie et d\'écriture intime : voir côte à côte les semaines vécues et celles qui restent est un excellent point de départ à la discussion.'
      ],
      tutorial: [
        'Étape 1 : Sélectionnez votre date de naissance à l\'aide du sélecteur de dates. La grille se recalcule instantanément.',
        'Étape 2 : Ajustez l\'espérance de vie si vous souhaitez une grille totale plus longue ou plus courte. Par défaut, 80 ans ≈ 4 160 semaines.',
        'Étape 3 : Choisissez une couleur de remplissage pour les semaines déjà vécues. Les semaines restantes restent intentionnellement vides pour le contraste.',
        'Étape 4 (facultatif) : Marquez une date jalon future (mariage, diplôme, départ à la retraite) pour la voir mise en évidence sur la grille.',
        'Étape 5 : Cliquez sur Exporter PNG pour enregistrer la grille complète sous forme d\'image, à publier, imprimer ou garder pour vous.'
      ],
      advantages: [
        'Fonctionne 100 % en local. Votre date de naissance et vos jalons ne sont jamais envoyés nulle part. Confidentialité par conception.',
        'Calcul précis : les semaines vécues sont calculées à partir des millisecondes réellement écoulées, et non par une simple multiplication années × 52, donc le compte est exact, y compris aujourd\'hui.',
        'Espérance de vie ajustable. La valeur par défaut est 80 ans en bonne santé, mais vous pouvez fixer toute valeur réaliste adaptée aux tables actuarielles ou à votre planification personnelle.',
        'Marqueurs de jalons. Épinglez des dates futures sur la grille pour voir à quel point elles sont proches — ou lointaines — en réalité.',
        'Export épuré et imprimable. Pas de marque Korelyy, pas de filigrane, rien qui n\'obstrue le message porté par la grille.'
      ],
      faqs: [
        { q: 'Le Visualiseur de Vie en Semaines est-il gratuit ?', a: 'Oui. L\'outil complet — comptage précis des semaines, curseur d\'espérance de vie, sélecteur de couleur, marqueurs de jalons et export PNG — est définitivement gratuit, sans inscription, sans filigrane et sans mur de paiement caché.' },
        { q: 'Dois-je créer un compte ou me connecter ?', a: 'Non. Ouvrez la page et utilisez tout l\'outil instantanément depuis n\'importe quel navigateur moderne, sur tout appareil. Pas d\'e-mail, pas de compte, pas de cookie de suivi.' },
        { q: 'Ma date de naissance ou mes données sont-elles stockées ou envoyées ?', a: 'Non. Tout — saisie des dates, calcul et rendu — s\'exécute à l\'intérieur de votre propre navigateur lorsque c\'est techniquement possible. Rien n\'est envoyé à nos serveurs et nous n\'utilisons pas de cookies de suivi.' },
        { q: 'Sur quels appareils fonctionne-t-il ?', a: 'Sur tous les navigateurs modernes, bureau comme mobile, sous Windows, macOS, Linux, iOS et Android. La mise en page est responsive et la grille est entièrement défilable sur téléphone.' },
        { q: 'Pourquoi 4 000 semaines ? Est-ce exact ?', a: '4 000 semaines est une approximation très répandue, légèrement arrondie, pour une espérance de vie d\'environ 77 ans. Nous utilisons par défaut 80 ans (≈ 4 160 semaines) et vous laissons ajuster le total entre 60 et 100 ans. Le décompte des semaines vécues est, quant à lui, calculé précisément à partir de votre date de naissance exacte et de la date réelle du jour.' }
      ]
    }
  },
  'excuse-generator': {
    name: 'Carte Générateur d\'Excuses',
    description: 'Choisissez une situation — retard au travail, absence, annulation de plans, dépassement de délai — et générez instantanément une excuse qui sonne juste. Basculez entre le mode Sérieux (vous l\'utiliseriez vraiment) et le mode Ridicule (vous l\'envoyez à votre meilleur pote). Téléchargez le résultat sous forme de carte partageable en PNG.',
    seo: {
      intro: 'La Carte Générateur d\'Excuses est un outil gratuit pour navigateur, à la fois drôle et vraiment utile, qui rédige pour vous des excuses adaptées au contexte. Le mode Sérieux puise dans une base soignée de formulations réalistes et appropriées à chaque situation. Le mode Ridicule, lui, sert juste à faire rire. Dans les deux cas, une pression permet de partager le résultat sous forme d\'une carte image parfaitement mise en page.',
      scenarios: [
        'Texter votre patron le matin pour dire que vous serez en retard — mode Sérieux, scénario Retard.',
        'Annuler un rendez-vous décontracté avec des amis — passez en mode Ridicule pour un maximum d\'humour.',
        'Prévenir un client ou un collègue quand une livraison glisse réellement — mode Sérieux pour rester professionnel et proactif.',
        'Blagues dans le chat de groupe : générez une excuse farfelue et balancez-la quand quelqu\'un demande pourquoi vous n\'êtes pas encore arrivé.',
        'Partages sociaux et memes : enregistrez la plus drôle en PNG et publiez-la — le format est fait pour ça.'
      ],
      tutorial: [
        'Étape 1 : Sélectionnez le scénario qui correspond le mieux à ce dont vous avez besoin : Retard, Absence, Annuler des plans ou Dépassement de délai.',
        'Étape 2 : Choisissez votre ton — Sérieux pour des formulations vraiment utilisables, ou Ridicule quand c\'est juste pour rigoler.',
        'Étape 3 : Appuyez sur Générer. Une nouvelle excuse aléatoire issue de la base soignée apparaît instantanément.',
        'Étape 4 (facultatif) : Appuyez à nouveau sur Générer autant de fois que vous voulez — chaque pression fait apparaître une nouvelle ligne.',
        'Étape 5 : Quand vous tombez sur celle qui convient, cliquez sur Télécharger la carte pour enregistrer un PNG formaté, prêt à être envoyé par message ou publié.'
      ],
      advantages: [
        'Bases de phrases soignées à la main, pas de remplissage générique. Chaque combinaison scénario × ton dispose de sa propre liste de lignes, rédigées pour sonner naturel, pas comme du texte généré.',
        'Génération en un clic, zéro friction. Aucun formulaire à remplir, aucune page de paramètres : choisissez un scénario et c\'est parti.',
        'Export de carte partageable parfaitement mis en page. Le PNG téléchargé est déjà dimensionné pour les messages et les réseaux sociaux.',
        'S\'exécute entièrement dans le navigateur. Aucun aller-retour serveur, aucune latence, et rien de ce que vous saisissez n\'est jamais collecté.',
        'Six langues. Les noms de scénario, les étiquettes des boutons et les lignes sont disponibles en anglais, chinois, espagnol, français, hindi et arabe.'
      ],
      faqs: [
        { q: 'La Carte Générateur d\'Excuses est-elle gratuite ?', a: 'Oui. Tous les scénarios, tous les tons, les tirages illimités et l\'export de la carte PNG partageable — tout est définitivement gratuit, sans inscription, sans filigrane et sans mur de paiement caché.' },
        { q: 'Dois-je m\'inscrire ?', a: 'Non. Ouvrez la page et commencez à générer immédiatement depuis n\'importe quel navigateur moderne, sur téléphone, tablette ou ordinateur. Pas d\'e-mail, pas de connexion, pas de cookie de suivi.' },
        { q: 'Ce que je génère est-il privé ?', a: 'Oui. L\'outil s\'exécute entièrement dans votre navigateur lorsque c\'est techniquement possible. Toute la génération, le rendu et l\'export se font sur votre propre appareil. Rien n\'est envoyé à nos serveurs et aucun cookie de suivi n\'est utilisé.' },
        { q: 'Ça fonctionne sur mon téléphone ?', a: 'Oui. La mise en page est entièrement responsive, les boutons ont des cibles tactiles de 44 px ou plus, et le téléchargement de la carte fonctionne sur les navigateurs mobiles (Chrome, Safari, Edge).' },
        { q: 'Puis-je suggérer ou ajouter de nouvelles phrases ?', a: 'Les bases de lignes sont soignées par l\'équipe Korelyy pour garantir une qualité élevée. Si vous avez une excellente idée, écrivez-nous via l\'e-mail de contact du site ; nous l\'ajouterons peut-être (avec mention) dans une prochaine mise à jour.' }
      ]
    }
  }
};

// 印地语
CONTENT.hi = {
  'wave-art': {
    name: 'वॉइस वेव आर्ट जनरेटर',
    description: 'किसी भी नाम या वाक्यांश को एक अद्वितीय दृश्य ध्वनि-तरंग कला में बदलें। प्रत्येक वर्ण की अपनी आवृत्ति, आयाम और चरण होता है। न्यूनतम रेखाएँ, नियॉन ग्लो और रेडियो स्पेक्ट्रम शैलियों में से चुनें। कई नामों को ओवरले करें, एक पैलेट चुनें और PNG के रूप में निर्यात करें — अवतार, टैटू, जोड़े के उपहार या दीवार की कला के लिए बिल्कुल सही।',
    seo: {
      intro: 'वॉइस वेव आर्ट जनरेटर एक मुफ्त, ब्राउज़र-आधारित टूल है जो टेक्स्ट — एक नाम, एक शब्द, एक तारीख या एक पूरा वाक्यांश — को अद्वितीय ध्वनि-तरंग शैली की दृश्य कला में बदलता है। चूँकि प्रत्येक वर्ण एक विशेष तरंग उत्पन्न करता है, इसलिए कोई भी दो कलाकृतियाँ कभी समान नहीं होतीं। यह पूरी तरह से आपके डिवाइस पर चलता है: कुछ भी सर्वर पर अपलोड नहीं होता और किसी खाते की आवश्यकता नहीं है।',
      scenarios: [
        'सोशल मीडिया, डेटिंग ऐप्स या कार्य खातों के लिए व्यक्तिगत अवतार और प्रोफ़ाइल चित्र।',
        'जोड़ा या परिवारिक उपहार — दो या तीन नामों को एक ही कैनवास पर ओवरले करें और दीवार की कला, मग या आभूषण संदर्भ के रूप में प्रिंट करें।',
        'टैटू संदर्भ कलाकृति: अपने नाम से बने तरंग पैटर्न को प्रिंट करें और अपने टैटू कलाकार को दिखाएँ।',
        'स्वतंत्र क्रिएटर, पॉडकास्टर या संगीतकारों के लिए ब्रांडिंग संपत्ति — अपने स्वयं के स्लोगन से बनी दृश्य पहचान।',
        'जन्मदिन, सालगिरह, स्नातक या नवजातों के लिए अर्थपूर्ण उपहार, जिनमें नाम या जन्म तारीख इनपुट के रूप में उपयोग की जाती है।'
      ],
      tutorial: [
        'चरण 1: मुख्य इनपुट बॉक्स में उस नाम, शब्द या वाक्यांश को टाइप करें जिसे आप तरंग कला में बदलना चाहते हैं।',
        'चरण 2: एक शैली चुनें — मिनिमल (साफ़ पतली रेखाएँ), नियॉन (गहरे बैकग्राउंड पर ग्लो) या स्पेक्ट्रम (रेडियो-आवृत्ति बार)।',
        'चरण 3: पूर्व-सेट रंग पैलेट में से एक चुनें। प्रत्येक शैली की अपनी चुनी हुई पैलेट होती हैं।',
        'चरण 4 (वैकल्पिक): ओवरले मोड चालू करें और एक कैनवास पर कई तरंगों को संयोजित करने के लिए दूसरा या तीसरा नाम जोड़ें। प्रत्येक परत की स्वतंत्र अपारदर्शिता समायोजित करें।',
        'चरण 5: उच्च-रिज़ॉल्यूशन पारदर्शी या अपारदर्शी छवि डाउनलोड करने के लिए PNG निर्यात करें पर क्लिक करें जिसे आप प्रिंट, पोस्ट या साझा कर सकते हैं।'
      ],
      advantages: [
        '100% क्लाइंट-साइड। आपका टेक्स्ट और बनाई गई कलाकृति कभी भी आपके ब्राउज़र से बाहर नहीं जाती — कोई अपलोड नहीं, कोई ट्रैकिंग नहीं, कोई वॉटरमार्क नहीं।',
        'प्रति वर्ण नियत गणित। एक ही नाम हमेशा एक ही तरंग उत्पन्न करता है, इसलिए कलाकृति पुन: उत्पादन योग्य और साझा करने योग्य है।',
        'तीन अलग-अलग कला शैलियाँ और पाँच चुनी हुई पैलेट, जिससे प्रत्येक इनपुट के लिए 15+ दृश्य दिशाएँ मिलती हैं।',
        'तीन नामों तक का ओवरले और स्वतंत्र अपारदर्शिता नियंत्रण — जोड़े, परिवार या टीम के लिए।',
        'प्रिंट-अनुकूल आकार में उच्च-रिज़ॉल्यूशन PNG निर्यात। डाउनलोड गुणवत्ता अनलॉक करने के लिए कोई भुगतान स्तर नहीं।'
      ],
      faqs: [
        { q: 'क्या वॉइस वेव आर्ट जनरेटर उपयोग करने के लिए मुफ्त है?', a: 'हाँ। सभी मुख्य सुविधाएँ — हर शैली, हर पैलेट, ओवरले मोड और PNG निर्यात — स्थायी रूप से मुफ्त हैं, कोई साइन-अप नहीं, कोई वॉटरमार्क नहीं, कोई छुपा पेमेंट वॉल नहीं।' },
        { q: 'क्या मुझे खाता बनाने की आवश्यकता है?', a: 'नहीं। आप फोन, टैबलेट या डेस्कटॉप पर किसी भी आधुनिक ब्राउज़र से तुरंत पूरे टूल का उपयोग कर सकते हैं। कोई ईमेल नहीं, कोई लॉगिन नहीं, कोई ट्रैकिंग कुकीज़ नहीं।' },
        { q: 'क्या मेरा टेक्स्ट और डेटा निजी रहता है?', a: 'हाँ। वॉइस वेव आर्ट जनरेटर तकनीकी रूप से संभव होने पर पूरी तरह से आपके ब्राउज़र में चलता है। सभी टेक्स्ट इनपुट, रेंडरिंग और निर्यात आपके स्वयं के डिवाइस पर प्रोसेस होते हैं। हमारे सर्वर पर कुछ भी अपलोड नहीं होता और कोई ट्रैकिंग कुकीज़ नहीं हैं।' },
        { q: 'कौन से डिवाइस और ब्राउज़र समर्थित हैं?', a: 'यह Windows, macOS, iOS और Android पर किसी भी आधुनिक ब्राउज़र (Chrome, Edge, Safari, Firefox) पर काम करता है। PNG निर्यात सभी पर समर्थित है। स्पर्श नियंत्रण मोबाइल के लिए अनुकूलित हैं।' },
        { q: 'क्या एक ही नाम हमेशा समान दिखेगा?', a: 'हाँ। तरंग गणित प्रति वर्ण नियत है, इसलिए जब तक इनपुट टेक्स्ट, शैली और पैलेट समान हैं, परिणाम कहीं भी पुन: उत्पादन योग्य है — मेल खाने वाले उपहारों या टैटू संदर्भों के लिए बिल्कुल सही।' }
      ]
    }
  },
  'life-weeks': {
    name: 'लाइफ इन वीक्स विज़ुअलाइज़र',
    description: 'अपनी जन्म तारीख दर्ज करें और 4,000 सप्ताह का एक ग्रिड देखें जो आपके पूरे जीवन का प्रतिनिधित्व करता है। जिन सप्ताहों को आपने पहले ही जीया है, वे भरे हुए हैं, जो शेष हैं वे खाली हैं। अपेक्षित आयु समायोजित करें, एक भरने का रंग चुनें, PNG के रूप में निर्यात करें। एक साधारण दृश्य जो मजबूत असर छोड़ता है और बहुत साझा होता है।',
    seo: {
      intro: 'लाइफ इन वीक्स विज़ुअलाइज़र एक मुफ्त ब्राउज़र टूल है जो आपको अपने पूरे जीवन को एक ही 4,000-सेल ग्रिड के रूप में दिखाता है — एक वर्ग प्रति सप्ताह। लोग अक्सर इसे विनम्र, प्रेरक और अजीब तरह से शांत करने वाला बताते हैं। प्रत्येक Korelyy टूल की तरह, यह आपके ब्राउज़र में स्थानीय रूप से चलता है, कोई अपलोड नहीं और कोई साइन-अप नहीं।',
      scenarios: [
        'व्यक्तिगत प्रतिबिंब और लक्ष्य-निर्धारण: शेष सप्ताहों को एक ठोस बजट के रूप में देखें, न कि अमूर्त संख्या के रूप में।',
        'जन्मदिन की पोस्टें और सोशल शेयर — विशेषकर दशक के जन्मदिनों (30वाँ, 40वाँ, 50वाँ) पर जब ग्रिड वास्तव में असर डालता है।',
        'नव वर्ष या वापस-स्कूल रीसेट: अगले N सप्ताह कैसे हों, यह योजना बनाने के लिए दृश्य का उपयोग करें।',
        'हाल ही में स्नातकों या मोड़ पर खड़े किसी व्यक्ति को उपहार: उन चीज़ों के बारे में सोचने के लिए एक कोमल प्रोत्साहन जिन्हें प्राथमिकता देनी है।',
        'थेरेपी और जर्नलिंग के प्रेरणास्वरूप: जीए हुए और शेष सप्ताहों को साथ देखना एक शक्तिशाली वार्तालाप प्रारंभ करने वाला होता है।'
      ],
      tutorial: [
        'चरण 1: तारीख चुनने वाले का उपयोग करके अपनी जन्म तारीख चुनें। ग्रिड तुरंत पुन: गणना करता है।',
        'चरण 2: यदि आप लंबा या छोटा कुल ग्रिड देखना चाहते हैं तो अपेक्षित जीवन काल समायोजित करें। डिफ़ॉल्ट 80 वर्ष ≈ 4,160 सप्ताह है।',
        'चरण 3: पहले से जीए हुए सप्ताहों के लिए एक भरने का रंग चुनें। कंट्रास्ट के लिए शेष सप्ताह डिज़ाइन से खाली रहते हैं।',
        'चरण 4 (वैकल्पिक): एक भविष्य की मील का पत्थर तारीख (शादी, स्नातक, सेवानिवृत्ति लक्ष्य) को चिह्नित करें ताकि वह ग्रिड पर हाइलाइट दिखाई दे।',
        'चरण 5: पूर्ण ग्रिड को छवि के रूप में सहेजने के लिए PNG निर्यात करें पर क्लिक करें, जिसे आप पोस्ट, प्रिंट या अपने लिए रख सकते हैं।'
      ],
      advantages: [
        '100% स्थानीय रूप से चलता है। आपकी जन्म तारीख और मील के पत्थर कहीं भी नहीं भेजे जाते। डिज़ाइन द्वारा गोपनीयता।',
        'सटीक गणना: जीए हुए सप्ताहों की गणना वास्तविक बीती हुई मिलीसेकंड का उपयोग करके की जाती है, न कि केवल वर्ष × 52, इसलिए गणना आज भी सटीक है।',
        'समायोज्य अपेक्षित आयु। डिफ़ॉल्ट स्वस्थ 80 वर्ष है, लेकिन आप एक्चुअरियल तालिकाओं या व्यक्तिगत योजना के अनुसार कोई भी वास्तविक मान सेट कर सकते हैं।',
        'मील के पत्थर मार्कर। भविष्य की तारीखों को ग्रिड पर पिन करें ताकि आप देख सकें कि वे वास्तव में कितनी निकट — या दूर — हैं।',
        'स्वच्छ, प्रिंट-अनुकूल निर्यात। कोई Korelyy ब्रांडिंग नहीं, कोई वॉटरमार्क नहीं, ग्रिड के संदेश के बीच में कुछ भी नहीं।'
      ],
      faqs: [
        { q: 'क्या लाइफ इन वीक्स विज़ुअलाइज़र मुफ्त है?', a: 'हाँ। पूरा टूल — सटीक सप्ताह गिनती, जीवन-प्रत्याशा स्लाइडर, रंग चुनने वाला, मील के पत्थर मार्कर और PNG निर्यात — स्थायी रूप से मुफ्त है, कोई साइन-अप नहीं, कोई वॉटरमार्क नहीं, कोई छुपा पेमेंट वॉल नहीं।' },
        { q: 'क्या मुझे खाता बनाने या लॉग इन करने की आवश्यकता है?', a: 'नहीं। आप किसी भी डिवाइस पर किसी भी आधुनिक ब्राउज़र से पेज खोलते ही पूरे टूल का तुरंत उपयोग कर सकते हैं। कोई ईमेल नहीं, कोई खाता नहीं, कोई ट्रैकिंग कुकीज़ नहीं।' },
        { q: 'क्या मेरी जन्म तारीख या डेटा संग्रहीत या अपलोड किया जाता है?', a: 'नहीं। सब कुछ — तारीखें इनपुट करना, गणना करना और रेंडर करना — तकनीकी रूप से संभव होने पर आपके अपने ब्राउज़र के अंदर चलता है। हमारे सर्वर पर कुछ भी नहीं भेजा जाता और हम ट्रैकिंग कुकीज़ का उपयोग नहीं करते।' },
        { q: 'यह किन डिवाइसों पर काम करता है?', a: 'Windows, macOS, Linux, iOS और Android पर सभी आधुनिक डेस्कटॉप और मोबाइल ब्राउज़र। लेआउट उत्तरदायी है और ग्रिड फ़ोन पर पूरी तरह से स्क्रॉल करने योग्य है।' },
        { q: 'क्यों 4,000 सप्ताह? क्या यह सटीक है?', a: '4,000 सप्ताह एक व्यापक रूप से उपयोग किया जाने वाला, थोड़ा गोल अंदाज़ा है जो लगभग 77 वर्ष की आयु के बराबर है। हम डिफ़ॉल्ट रूप से 80 वर्ष (≈ 4,160 सप्ताह) लेते हैं और आपको कुल 60 से 100 वर्ष के बीच समायोजित करने देते हैं। जीए हुए सप्ताहों की गणना आपकी सटीक जन्म तारीख और आज की वास्तविक तारीख से सटीक रूप से की जाती है।' }
      ]
    }
  },
  'excuse-generator': {
    name: 'बहाना जनरेटर कार्ड',
    description: 'एक स्थिति चुनें — देरी से पहुँचना, काम छोड़ना, योजनाएँ रद्द करना, समय सीमा चूकना — और तुरंत एक स्वाभाविक लगने वाला बहाना बनाएँ। गंभीर मोड (आप वास्तव में यह कहेंगे) और हास्यास्पद मोड (आप इसे अपने सबसे अच्छे दोस्त को भेजेंगे) के बीच स्विच करें। परिणाम को साझा करने योग्य कार्ड PNG के रूप में डाउनलोड करें।',
    seo: {
      intro: 'बहाना जनरेटर कार्ड एक मुफ्त ब्राउज़र टूल है, जो मज़ेदार और वास्तव में उपयोगी दोनों है, जो माँग पर संदर्भ के अनुसार उपयुक्त बहाने लिखता है। गंभीर मोड में वास्तविक स्थिति-उचित पंक्तियों के संचित संग्रह से लिया जाता है। हास्यास्पद मोड तब होता है जब आप किसी को हँसाना चाहते हैं। किसी भी तरह, एक टैप से आप परिणाम को एक सुसज्जित कार्ड छवि के रूप में साझा कर सकते हैं।',
      scenarios: [
        'सुबह अपने बॉस को मेसेज करना कि आप देरी से पहुँचेंगे — गंभीर मोड, देरी स्थिति।',
        'दोस्तों के साथ आकस्मिक मिलन रद्द करना — अधिकतम कॉमेडी के लिए हास्यास्पद मोड पर जाएँ।',
        'किसी ग्राहक या टीम के साथी को सूचित करना जब कोई समय सीमा वास्तव में फिसल रही हो — पेशेवर और सक्रिय लगने के लिए गंभीर मोड।',
        'ग्रुप चैट में मज़ाक: एक हास्यास्पद बहाना बनाएँ और जब कोई पूछे कि आप अभी तक क्यों नहीं पहुँचे तो छोड़ दें।',
        'सोशल शेयर्स और मीम्स: मज़ेदार कार्ड PNG को सहेजें और पोस्ट करें — साझा करने योग्य प्रारूप इसके लिए ही बनाया गया है।'
      ],
      tutorial: [
        'चरण 1: उस स्थिति का चयन करें जो आपकी आवश्यकता से सबसे बेहतर मेल खाती है: देरी, काम छोड़ना, योजनाएँ रद्द करना, समय सीमा चूकना।',
        'चरण 2: अपना लहजा चुनें — वास्तव में उपयोग करने योग्य पंक्तियों के लिए गंभीर, या सिर्फ़ हँसी के लिए हास्यास्पद।',
        'चरण 3: जनरेटर पर टैप करें। संचित संग्रह से एक नया यादृच्छिक बहाना तुरंत प्रकट होता है।',
        'चरण 4 (वैकल्पिक): जितनी बार चाहें फिर से जनरेटर पर टैप करें — हर बार एक नई पंक्ति आती है।',
        'चरण 5: जब आप किसी एक को पसंद कर लें, तो फ़ॉर्मेट किए गए PNG को सहेजने के लिए कार्ड डाउनलोड करें पर क्लिक करें जिसे आप मेसेज या पोस्ट कर सकते हैं।'
      ],
      advantages: [
        'हाथ से संचित संग्रह, सामान्य भराव नहीं। प्रत्येक स्थिति × लहजा संयोजन की अपनी समर्पित पंक्तियों की सूची होती है जो स्वाभाविक लगती हैं, न कि कृत्रिम।',
        'एक-टैप जनरेशन जिसमें कोई घर्षण नहीं। कोई फ़ॉर्म भरना नहीं, कोई सेटिंग पेज नहीं, बस एक स्थिति चुनें और शुरू हो जाएँ।',
        'सुसज्जित साझा करने योग्य कार्ड निर्यात। डाउनलोड किया गया PNG पहले से ही मेसेज और सोशल फ़ीड के अनुसार आकार किया गया है।',
        'पूरी तरह से ब्राउज़र में चलता है। कोई सर्वर राउंड-ट्रिप नहीं, कोई विलंबता नहीं, और आप जो कुछ भी टाइप करते हैं वह कभी भी एकत्र नहीं किया जाता।',
        'छह भाषाएँ। परिदृश्य नाम, बटन लेबल और पंक्ति पूल अंग्रेज़ी, चीनी, स्पेनिश, फ़्रेंच, हिंदी और अरबी में उपलब्ध हैं।'
      ],
      faqs: [
        { q: 'क्या बहाना जनरेटर कार्ड मुफ्त है?', a: 'हाँ। सभी परिदृश्य, सभी लहजे, असीमित री-रोल और साझा करने योग्य PNG कार्ड निर्यात — सभी स्थायी रूप से मुफ्त हैं, कोई साइन-अप नहीं, कोई वॉटरमार्क नहीं, कोई छुपा पेमेंट वॉल नहीं।' },
        { q: 'क्या मुझे साइन अप करने की आवश्यकता है?', a: 'नहीं। पेज खोलें और किसी भी आधुनिक ब्राउज़र से किसी भी फोन, टैबलेट या डेस्कटॉप पर तुरंत बहाना बनाना शुरू करें। कोई ईमेल नहीं, कोई लॉगिन नहीं, कोई ट्रैकिंग कुकीज़ नहीं।' },
        { q: 'क्या मैं जो बनाता हूँ वह निजी है?', a: 'हाँ। तकनीकी रूप से संभव होने पर टूल पूरी तरह से आपके ब्राउज़र में चलता है। सभी जनरेशन, रेंडरिंग और निर्यात आपके अपने डिवाइस पर होते हैं। कुछ भी हमारे सर्वर पर नहीं भेजा जाता और कोई ट्रैकिंग कुकीज़ उपयोग नहीं की जातीं।' },
        { q: 'क्या यह मेरे फोन पर काम करेगा?', a: 'हाँ। लेआउट पूरी तरह से उत्तरदायी है, बटनों में 44px+ स्पर्श लक्ष्य हैं, और कार्ड डाउनलोड मोबाइल ब्राउज़र (Chrome, Safari, Edge) पर काम करता है।' },
        { q: 'क्या मैं नई बहाना पंक्तियाँ सुझा या जोड़ सकता हूँ?', a: 'पंक्ति पूल Korelyy टीम द्वारा उच्च गुणवत्ता बनाए रखने के लिए चुनी जाती हैं। यदि आपके पास कोई बेहतरीन पंक्ति है, तो साइट के संपर्क ईमेल के माध्यम से हमें लिखें; भविष्य के अपडेट में हम इसे (क्रेडिट के साथ) जोड़ सकते हैं।' }
      ]
    }
  }
};

// 阿拉伯语（RTL，内容地道阿语）
CONTENT.ar = {
  'wave-art': {
    name: 'مولد فن موجات الصوت',
    description: 'حوّل أي اسم أو عبارة إلى قطعة فنية بصرية فريدة على شكل موجة صوتية. كل حرف يُقابل بتردد وسعة وطور خاص به. اختر بين أنماط خطوط بسيطة، أو توهج نيون، أو طيف راديو. ضع عدة أسماء فوق بعضها البعض، واختر لوحة ألوان، ثم صدّر بصيغة PNG — مثالي للصور الرمزية والوشم وهدايا الأزواج واللوحات الفنية.',
    seo: {
      intro: 'مولد فن موجات الصوت هي أداة مجانية تعمل داخل المتصفح تحول النص — اسماً أو كلمة أو تاريخاً أو جملة كاملة — إلى عمل فني بصري فريد على نمط الموجة الصوتية. وبما أن كل حرف ينتج موجة مختلفة، فلا توجد قطعتان متطابقتان أبداً. يعمل كل شيء بالكامل على جهازك: لا يتم رفع أي شيء إلى الخادم ولا تحتاج إلى إنشاء حساب.',
      scenarios: [
        'صور رمزية وشخصيات مخصصة لوسائل التواصل الاجتماعي وتطبيقات المواعدة وحسابات العمل.',
        'هدايا للأزواج أو العائلات — ضع اسمين أو ثلاثة أسماء فوق لوحة واحدة واطبعها كلوحة فنية أو فنجان أو مرجع لمجوهرات.',
        'عمل فني مرجع للوشم: اطبع نمط الموجة الذي ينتجه اسمك وخذه إلى فنان الوشم.',
        'أصول هوية بصرية للمبدعين المستقلين والبودكاستيين والموسيقيين — هوية بصرية مصنوعة من شعارك الخاص.',
        'هدايا ذات معنى لأعياد الميلاد وذكرى الزواج والتخرج أو المواليد الجدد باستخدام اسم أو تاريخ الميلاد كمدخل.'
      ],
      tutorial: [
        'الخطوة 1: اكتب الاسم أو الكلمة أو العبارة التي تريد تحويلها إلى فن موجات في مربع الإدخال الرئيسي.',
        'الخطوة 2: اختر نمطاً — بسيط (خطوط رفيعة نقية)، أو نيون (توهج على خلفية داكنة)، أو طيف (أعمدة ترددات الراديو).',
        'الخطوة 3: اختر إحدى لوحات الألوان المعدة مسبقاً. لكل نمط لوحاته الخاصة المنسقة بعناية.',
        'الخطوة 4 (اختياري): شغّل وضع التراكب وأضف اسماً ثانياً أو ثالثاً لدمج عدة موجات على لوحة واحدة. اضبط شفافية كل طبقة بشكل مستقل.',
        'الخطوة 5: انقر فوق صدّر PNG لتنزيل صورة عالية الدقة، شفافة أو مع خلفية، جاهزة للطباعة والنشر والمشاركة.'
      ],
      advantages: [
        'يعمل 100% على المتصفح. نصك والعمل الفني الذي تم إنشاؤه لا يغادران متصفحك أبداً — لا رفع، لا تتبع، لا علامات مائية.',
        'رياضي محدد لكل حرف. الاسم نفسه ينتج دائماً نفس الموجة، لذا يمكن إعادة إنتاج القطعة ومشاركتها.',
        'ثلاثة أنماط فنية مميزة وخمس لوحات ألوان منسقة، مما يمنحك أكثر من 15 اتجاهاً بصرياً لكل مدخل.',
        'إمكانية تراكب ما يصل إلى ثلاثة أسماء مع التحكم المستقل في الشفافية لقطع الأزواج أو العائلات أو الفرق.',
        'تصدير PNG عالي الدقة بأحجام مناسبة للطباعة. لا توجد طبقة مدفوعة لفتح جودة التنزيل.'
      ],
      faqs: [
        { q: 'هل مولد فن موجات الصوت مجاني للاستخدام؟', a: 'نعم. جميع الميزات الأساسية — كل الأنماط وكل لوحات الألوان ووضع التراكب وتصدير PNG — مجانية بشكل دائم، بدون تسجيل، بدون علامات مائية، بدون جدران دفع خفية.' },
        { q: 'هل أحتاج إلى إنشاء حساب؟', a: 'لا. يمكنك استخدام الأداة الكاملة فوراً من أي متصفح حديث على الهاتف أو الجهاز اللوحي أو الكمبيوتر. لا بريد إلكتروني، لا تسجيل دخول، لا ملفات تعريف ارتباط تتبعية.' },
        { q: 'هل نصي وبياناتي تظل خاصة؟', a: 'نعم. يعمل مولد فن موجات الصوت بالكامل داخل متصفحك عندما يكون ذلك ممكناً تقنياً. تتم معالجة كل إدخالات النص والعرض والتصدير على جهازك الخاص. لا يتم رفع أي شيء إلى خوادمنا ولا توجد ملفات تعريف ارتباط تتبعية.' },
        { q: 'ما هي الأجهزة والمتصفحات المدعومة؟', a: 'يعمل على أي متصفح حديث (Chrome و Edge و Safari و Firefox) على Windows و macOS و iOS و Android. يتم دعم تصدير PNG في كل منها. عناصر التحكم باللمس محسّنة للأجهزة المحمولة.' },
        { q: 'هل الاسم نفسه سيبدو متطابقاً دائماً؟', a: 'نعم. رياضيات الموجة محددة لكل حرف، لذا طالما كان النص المدخل والنمط ولوحة الألوان متطابقة، فإن النتيجة قابلة لإعادة الإنتاج في أي مكان — مثالية للهدايا المتطابقة أو مراجع الوشم.' }
      ]
    }
  },
  'life-weeks': {
    name: 'عارض الحياة في أسابيع',
    description: 'أدخل تاريخ ميلادك وسترى شبكة من 4000 أسبوع تمثل حياتك كلها. الأسابيع التي عشتها مملوءة باللون، والأسابيع المتبقية فارغة. اضبط متوسط العمر المتوقع، واختر لوناً للملء، ثم صدّر بصيغة PNG. تصور بسيط لكنه مؤثر جداً وينتشر بكثرة.',
    seo: {
      intro: 'عارض الحياة في أسابيع هو أداة مجانية للمتصفح تريك لك حياتك كلها كشبكة واحدة من حوالي 4000 خلية — مربع لكل أسبوع. يصفه الكثيرون بأنه تجربة محفزة ومؤثرة ومطمئنة بطريقة غريبة في آن واحد. مثل كل أدوات Korelyy، يعمل محلياً داخل متصفحك، دون رفع بيانات ودون تسجيل.',
      scenarios: [
        'التأمل الشخصي ووضع الأهداف: انظر إلى الأسابيع المتبقية كميزانية ملموسة، لا كرقم مجرد.',
        'منشورات أعياد الميلاد والمشاركة الاجتماعية — خاصة في أعياد العقود (30 و 40 و 50 عاماً) عندما تبرز الشبكة قوتها.',
        'بداية العام أو العودة للمدرسة: استخدم التصور لتخطيط كيف تريد أن تكون الأسابيع القادمة N.',
        'هدية للخريجين الجدد أو لأي شخص في مفترق طرق — دفعة لطيفة لدفعه للتفكير في أولوياته.',
        'محفز في الجلسات العلاجية ودفاتر اليوميات: رؤية الأسابيع المعاشاة والمتبقية جنباً إلى جنب نقطة انطلاق ممتازة للحوار والكتابة.'
      ],
      tutorial: [
        'الخطوة 1: حدد تاريخ ميلادك باستخدام منتقي التواريخ. تعاد حساب الشبكة فوراً.',
        'الخطوة 2: اضبط متوسط العمر المتوقع إذا أردت رؤية شبكة أطول أو أقصر. الافتراضي هو 80 عاماً ≈ 4160 أسبوعاً.',
        'الخطوة 3: اختر لوناً لملء الأسابيع التي عشتها بالفعل. تظل الأسابيع المتبقية فارغة قصدياً للحصول على تباين واضح.',
        'الخطوة 4 (اختياري): ضع علامة على تاريخ بارز في المستقبل (زفاف، تخرج، تقاعد متوقع) لتراه مميزاً على الشبكة.',
        'الخطوة 5: انقر فوق صدّر PNG لحفظ الشبكة الكاملة كصورة يمكنك نشرها أو طباعتها أو الاحتفاظ بها لنفسك.'
      ],
      advantages: [
        'يعمل 100% محلياً. تاريخ ميلادك ومعالمك لا يتم إرسالها إلى أي مكان. خصوصية حسب التصميم.',
        'حساب دقيق: عدد الأسابيع المعاشاة يحسب باستخدام مللي ثانية حقيقية مرت، وليس فقط سنوات × 52، لذا يكون العدد دقيقاً حتى اليوم.',
        'متوسط عمر قابل للتعديل. الافتراضي هو 80 عاماً صحياً، ولكن يمكنك تعيين أي قيمة واقعية لتتناسب مع الجداول الإحصائية أو التخطيط الشخصي.',
        'علامات معالم. ثبّت تواريخ مستقبلية على الشبكة لترى مدى قربها — أو بعدها — حقاً.',
        'تصدير نظيف وملائم للطباعة. بدون شعار Korelyy، بدون علامة مائية، ولا شيء يحجب الرسالة التي تحملها الشبكة.'
      ],
      faqs: [
        { q: 'هل عارض الحياة في أسابيع مجاني؟', a: 'نعم. الأداة الكاملة — العد الدقيق للأسابيع، منزلق متوسط العمر، منتقي الألوان، علامات المعالم، وتصدير PNG — مجانية بشكل دائم، بدون تسجيل، بدون علامات مائية، بدون جدران دفع خفية.' },
        { q: 'هل أحتاج إلى إنشاء حساب أو تسجيل الدخول؟', a: 'لا. افتح الصفحة واستخدم الأداة الكاملة فوراً من أي متصفح حديث على أي جهاز. لا بريد إلكتروني، لا حساب، لا ملفات تعريف ارتباط تتبعية.' },
        { q: 'هل تاريخ ميلادي أو بياناتي يتم تخزينها أو رفعها؟', a: 'لا. كل شيء — إدخال التواريخ والحساب والعرض — يعمل داخل متصفحك الخاص عندما يكون ذلك ممكناً تقنياً. لا يتم إرسال أي شيء إلى خوادمنا ولا نستخدم ملفات تعريف ارتباط تتبعية.' },
        { q: 'ما هي الأجهزة التي يعمل عليها؟', a: 'جميع متصفحات المكتب والمحمول الحديثة على Windows و macOS و Linux و iOS و Android. التخطيط متجاوب والشبكة قابلة للتمرير بالكامل على الهواتف.' },
        { q: 'لماذا 4000 أسبوع؟ هل هذا دقيق؟', a: '4000 أسبوع هو اختصار مستخدم بكثرة ومقرب قليلاً لعمر متوسط يبلغ حوالي 77 عاماً. نستخدم افتراضياً 80 عاماً (≈ 4160 أسبوعاً) ونسمح لك بضبط المجموع بين 60 و 100 عاماً. أما عدد الأسابيع المعاشاة فيحسب بدقة من تاريخ ميلادك الدقيق والتاريخ الحقيقي لليوم.' }
      ]
    }
  },
  'excuse-generator': {
    name: 'بطاقة مولد العذر',
    description: 'اختر الموقف — التأخر عن العمل، التغيب، إلغاء الخطط، تخطي الموعد النهائي — وأنشئ فوراً عذراً يبدو معقولاً. تنقّل بين الوضع الجاد (ستقوله حقاً) والوضع الساخر (ترسله إلى أفضل صديق). حمّل النتيجة كبطاقة PNG قابلة للمشاركة.',
    seo: {
      intro: 'بطاقة مولد العذر هي أداة متصفح مجانية، مضحكة ولكنها مفيدة حقاً، تكتب لك العذر المناسب للسياق عند الطلب. يسحب الوضع الجاد من مجموعة منسقة من العبارات الواقعية والمناسبة لكل موقف. أما الوضع الساخر فهو عندما تريد فقط أن تضحك على شخص ما. بكلتا الحالتين، بضغطة واحدة يمكنك مشاركة النتيجة كصورة بطاقة مصممة أنيقاً.',
      scenarios: [
        'إرسال رسالة إلى مديرك في الصباح تخبره أنك ستتأخر — الوضع الجاد، سيناريو التأخر.',
        'إلغاء لقاء عفوي مع الأصدقاء — انتقل إلى الوضع الساخر للحصول على أقصى قدر من الكوميديا.',
        'مراسلة عميل أو زميل عندما ينزلق موعد نهائي فعلياً — الوضع الجاد لتبدو مهنياً واستباقياً.',
        'نكات في دردشة المجموعة: أنشئ عذراً سخيراً وألقه عندما يسألك أحد لماذا لم تصل بعد.',
        'المشاركة الاجتماعية والميمز: احفظ أحد الأعذار المضحكة كبطاقة PNG وانشرها — التنسيق القابل للمشاركة مصمم لذلك.'
      ],
      tutorial: [
        'الخطوة 1: اختر السيناريو الذي يتطابق بشكل أفضل مع ما تحتاجه: تأخر، تغيب عن العمل، إلغاء خطط، تخطي موعد نهائي.',
        'الخطوة 2: اختر نبرتك — جاد لعبارات يمكنك استخدامها حقاً، أو ساخر عندما يكون الأمر فقط للضحك.',
        'الخطوة 3: اضغط على إنشاء. يظهر عذر عشوائي جديد من المجموعة المنسقة فوراً.',
        'الخطوة 4 (اختياري): اضغط على إنشاء مرّة أخرى كلما أردت — كل ضغطة تختار سطراً جديداً.',
        'الخطوة 5: عندما تجد عذراً يعجبك، انقر فوق تنزيل البطاقة لحفظ PNG منسق يمكنك إرساله برسالة أو نشره.'
      ],
      advantages: [
        'مجموعات مختارة يدوياً، لا حشو عام. لكل مزيج من السيناريو × النبرة قائمة خاصة بها من العبارات المكتوبة لتكون طبيعية، لا بلاستيكية.',
        'إنشاء بضغطة واحدة وعدم وجود تعقيدات. لا نماذج لملؤها، لا صفحة إعدادات، فقط اختر سيناريو وابدأ.',
        'تصدير بطاقة قابلة للمشاركة مصمم أنيقاً. حجم PNG المُنزَّل مناسباً للرسائل والخلاصات الاجتماعية مباشرة.',
        'يعمل بالكامل داخل المتصفح. لا ذهاب وإياب للخادم، لا تأخير، ولا يتم جمع أي شيء تكتبه أبداً.',
        'ست لغات. أسماء السيناريوهات وتسميات الأزرار ومجموعات العبارات متوفرة بالإنجليزية والصينية والإسبانية والفرنسية والهندية والعربية.'
      ],
      faqs: [
        { q: 'هل بطاقة مولد العذر مجانية؟', a: 'نعم. كل السيناريوهات وكل النبرات وإعادة السحب غير المحدودة وتصدير بطاقة PNG القابلة للمشاركة — كلها مجانية بشكل دائم، بدون تسجيل، بدون علامات مائية، بدون جدران دفع خفية.' },
        { q: 'هل أحتاج إلى التسجيل؟', a: 'لا. افتح الصفحة وابدأ الإنشاء فوراً من أي متصفح حديث، على أي هاتف أو جهاز لوحي أو كمبيوتر. لا بريد إلكتروني، لا تسجيل دخول، لا ملفات تعريف ارتباط تتبعية.' },
        { q: 'هل ما أنشئه خاص؟', a: 'نعم. تعمل الأداة بالكامل داخل متصفحك عندما يكون ذلك ممكناً تقنياً. كل عملية الإنشاء والعرض والتصدير تتم على جهازك الخاص. لا يتم إرسال أي شيء إلى خوادمنا ولا تُستخدم ملفات تعريف ارتباط تتبعية.' },
        { q: 'هل سيعمل على هاتفي؟', a: 'نعم. التخطيط متجاوب تماماً، والأزرار تمتلك مناطق لمس لا تقل عن 44 بكسل، وتنزيل البطاقات يعمل على متصفحات الجوال (Chrome و Safari و Edge).' },
        { q: 'هل يمكنني اقتراح أو إضافة عبارات عذر جديدة؟', a: 'مجموعات العبارات مختارة من قبل فريق Korelyy للحفاظ على جودة عالية. إذا كانت لديك عبارة رائعة، راسلنا عبر بريد الاتصال الموجود على الموقع؛ فقد نضيفها (مع ذكر المصدر) في تحديث مستقبلي.' }
      ]
    }
  }
};

// ===== 主逻辑：逐个 locale 逐个 slug 写入 =====
let patched = 0;
for (const loc of LOCALES) {
  const f = path.join(ROOT, loc, 'translation.json');
  const raw = fs.readFileSync(f, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('[FAIL] 无法解析', f, e.message);
    process.exit(1);
  }
  if (!data.tools) data.tools = {};
  let changed = false;
  for (const s of SLUGS) {
    if (!CONTENT[loc][s]) continue;
    const old = data.tools[s];
    data.tools[s] = CONTENT[loc][s];  // 直接整体覆盖
    changed = true;
    if (old) console.log(`[UPDATE] ${loc} / ${s}: 覆盖已有条目`);
    else console.log(`[ADD]    ${loc} / ${s}: 新增条目`);
  }
  if (changed) {
    // 保持 4 空格缩进，UTF-8 无 BOM
    const out = JSON.stringify(data, null, 2);
    fs.writeFileSync(f, out, 'utf8');
    patched++;
    console.log(`[WRITE]  ${f}`);
  }
}

console.log(`\n完成。已更新 ${patched} / ${LOCALES.length} 个 translation.json 文件。`);
console.log('下一步：npm run build 验证构建；若通过则 commit + push（记得先问 Carson 是否部署）。');
