const fs = require('fs');
const path = require('path');

const blogIndexPath = path.join(__dirname, '../data/blog-index.ts');
const blogDetailPath = path.join(__dirname, '../data/blog-detail.ts');

const newBlogIndex = `
{
"slug": "10-best-free-online-tools-for-developers-2026",
"coverImage": "https://picsum.photos/800/450?random=456&grayscale=false",
"author": "Korelyy Team",
"publishedAt": "2026-07-18T00:00:00.000Z",
"tags": [
{"en": "Developer Tools", "zh": "开发工具", "es": "Herramientas de Desarrollo", "fr": "Outils de Développeur", "hi": "डेवलपर टूल्स", "ar": "أدوات المطور"},
{"en": "Productivity", "zh": "生产力", "es": "Productividad", "fr": "Productivité", "hi": "उत्पादकता", "ar": "الإنتاجية"},
{"en": "Free Tools", "zh": "免费工具", "es": "Herramientas Gratuitas", "fr": "Outils Gratuits", "hi": "मुफ्त टूल्स", "ar": "أدوات مجانية"}
],
"relatedToolSlugs": ["regex-tester", "password-generator", "json-formatter", "base64-tool", "qr-code-generator"],
"readingMinutes": {"en": 12, "zh": 15, "es": 13, "fr": 13, "hi": 16, "ar": 14},
"title": {"en": "10 Best Free Online Tools for Developers in 2026", "zh": "2026 年开发者必备的 10 个免费在线工具", "es": "Las 10 Mejores Herramientas en Línea Gratuitas para Desarrolladores en 2026", "fr": "Les 10 Meilleurs Outils en Ligne Gratuits pour les Développeurs en 2026", "hi": "2026 में डेवलपर्स के लिए 10 सर्वश्रेष्ठ मुफ्त ऑनलाइन टूल्स", "ar": "أفضل 10 أدوات أونلاين مجانية للمطورين في 2026"},
"description": {"en": "Discover the best free online tools for developers in 2026. Regex tester, password generator, JSON formatter, and more. Boost your productivity without spending a dime.", "zh": "发现 2026 年开发者最佳免费在线工具。正则测试器、密码生成器、JSON格式化器等。无需花费一分钱提升你的生产力。", "es": "Descubre las mejores herramientas en línea gratuitas para desarrolladores en 2026. Prueba de regex, generador de contraseñas, formateador JSON y más.", "fr": "Découvrez les meilleurs outils en ligne gratuits pour les développeurs en 2026. Testeur regex, générateur de mots de passe, formateur JSON et plus.", "hi": "2026 में डेवलपर्स के लिए सर्वश्रेष्ठ मुफ्त ऑनलाइन टूल्स का पता लगाएं। रेगेक्स टेस्टर, पासवर्ड जनरेटर, JSON फॉर्मेटर और बहुत कुछ।", "ar": "اكتشف أفضل الأدوات المجانية عبر الإنترنت للمطورين في 2026. اختبار التعبيرات العادية، مولد كلمات المرور، صياغة JSON والمزيد."},
"keywords": {"en": ["free developer tools", "online developer tools", "regex tester", "password generator", "json formatter", "productivity tools", "2026 tools"], "zh": ["免费开发工具", "在线开发工具", "正则测试器", "密码生成器", "JSON格式化", "生产力工具", "2026工具"]}
}
`;

const newBlogDetail = `
{
"slug": "10-best-free-online-tools-for-developers-2026",
"content": [
{"type": "h2", "text": {"en": "Why Free Online Tools Matter", "zh": "为什么免费在线工具很重要"}},
{"type": "p", "text": {"en": "As a developer, your time is valuable. Free online tools can save you hours of work, from debugging regex patterns to generating secure passwords. Here are the top 10 tools every developer should have in their toolkit.", "zh": "作为开发者，你的时间很宝贵。免费在线工具可以帮你节省数小时的工作时间，从调试正则表达式到生成安全密码。以下是每个开发者都应该拥有的Top 10工具。"}},
{"type": "h2", "text": {"en": "1. Regex Tester", "zh": "1. 正则表达式测试器"}},
{"type": "p", "text": {"en": "Test and debug regular expressions in real-time. See matches highlighted instantly, view explanation trees, and save your favorite patterns. Perfect for validating user input and parsing text.", "zh": "实时测试和调试正则表达式。即时查看匹配高亮，查看解释树，保存你最喜欢的模式。非常适合验证用户输入和解析文本。"}},
{"type": "h2", "text": {"en": "2. Password Generator", "zh": "2. 密码生成器"}},
{"type": "p", "text": {"en": "Generate strong, secure passwords in seconds. Customize length, character types, and avoid common patterns. Perfect for creating passwords for your apps, accounts, and more.", "zh": "在几秒钟内生成强大安全的密码。自定义长度、字符类型，避免常见模式。非常适合为你的应用、账户等创建密码。"}},
{"type": "h2", "text": {"en": "3. JSON Formatter", "zh": "3. JSON格式化器"}},
{"type": "p", "text": {"en": "Format and validate JSON data instantly. Collapse and expand nested objects, syntax highlighting, and error detection. Essential for working with APIs and configuration files.", "zh": "即时格式化和验证JSON数据。折叠和展开嵌套对象，语法高亮，错误检测。对于处理API和配置文件至关重要。"}},
{"type": "h2", "text": {"en": "4. Base64 Encoder/Decoder", "zh": "4. Base64编解码器"}},
{"type": "p", "text": {"en": "Encode and decode Base64 strings quickly. Perfect for working with APIs, email attachments, and data serialization. Supports URL-safe encoding.", "zh": "快速编码和解码Base64字符串。非常适合处理API、邮件附件和数据序列化。支持URL安全编码。"}},
{"type": "h2", "text": {"en": "5. QR Code Generator", "zh": "5. 二维码生成器"}},
{"type": "p", "text": {"en": "Create QR codes for URLs, text, contact information, and more. Customize colors, size, and error correction level. Download as PNG or SVG.", "zh": "为网址、文本、联系信息等创建二维码。自定义颜色、大小和纠错级别。下载为PNG或SVG格式。"}},
{"type": "h2", "text": {"en": "6. Case Converter", "zh": "6. 大小写转换器"}},
{"type": "p", "text": {"en": "Convert text between different case formats: camelCase, PascalCase, snake_case, kebab-case, UPPERCASE, lowercase, and more. Save time on code formatting.", "zh": "在不同大小写格式之间转换文本：camelCase、PascalCase、snake_case、kebab-case、UPPERCASE、lowercase等。节省代码格式化时间。"}},
{"type": "h2", "text": {"en": "7. Random Number Generator", "zh": "7. 随机数生成器"}},
{"type": "p", "text": {"en": "Generate random numbers with custom ranges and formats. Perfect for testing, simulations, and games. Supports integers, floats, and unique values.", "zh": "生成自定义范围和格式的随机数。非常适合测试、模拟和游戏。支持整数、浮点数和唯一值。"}},
{"type": "h2", "text": {"en": "8. URL Encoder/Decoder", "zh": "8. URL编解码器"}},
{"type": "p", "text": {"en": "Encode and decode URLs to handle special characters. Essential for working with query strings and API parameters. Supports both standard and percent-encoding.", "zh": "编码和解码URL以处理特殊字符。对于处理查询字符串和API参数至关重要。支持标准编码和百分比编码。"}},
{"type": "h2", "text": {"en": "9. Text Counter", "zh": "9. 文本计数器"}},
{"type": "p", "text": {"en": "Count words, characters, sentences, and paragraphs in your text. Track reading time and keyword density. Perfect for writers, content creators, and SEO professionals.", "zh": "统计文本中的单词、字符、句子和段落数量。跟踪阅读时间和关键词密度。非常适合作家、内容创作者和SEO专业人士。"}},
{"type": "h2", "text": {"en": "10. Emoji Mixer", "zh": "10. Emoji合成器"}},
{"type": "p", "text": {"en": "Combine two emojis to create unique new ones! Add fun and creativity to your projects, social media posts, and chat messages. One-click copy and share.", "zh": "将两个emoji合成为独特的新表情！为你的项目、社交媒体帖子和聊天消息添加乐趣和创意。一键复制分享。"}},
{"type": "callout", "kind": "info", "text": {"en": "All these tools are 100% free, no signup required, and run locally in your browser — your data never leaves your device.", "zh": "所有这些工具都是100%免费的，无需注册，在浏览器本地运行——你的数据永远不会离开你的设备。"}},
{"type": "cta", "toolSlug": "regex-tester", "text": {"en": "Explore All Tools", "zh": "探索所有工具"}, "sub": {"en": "100+ free tools waiting for you", "zh": "100+免费工具等你来用"}}
]
}
`;

let blogIndex = fs.readFileSync(blogIndexPath, 'utf8');
blogIndex = blogIndex.replace('];\n\n/* 排序 + 切片缓存', ',' + newBlogIndex + '\n];\n\n/* 排序 + 切片缓存');
fs.writeFileSync(blogIndexPath, blogIndex, 'utf8');
console.log('Added blog index entry');

let blogDetail = fs.readFileSync(blogDetailPath, 'utf8');
const lastBrace = blogDetail.lastIndexOf('}');
const secondLastBrace = blogDetail.lastIndexOf('}', lastBrace - 1);
blogDetail = blogDetail.substring(0, secondLastBrace) + ',' + newBlogDetail + '\n' + blogDetail.substring(secondLastBrace);
fs.writeFileSync(blogDetailPath, blogDetail, 'utf8');
console.log('Added blog detail entry');

console.log('Done!');
