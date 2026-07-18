const fs = require('fs');
const path = require('path');

const blogIndexPath = path.join(__dirname, '../data/blog-index.ts');
const blogDetailPath = path.join(__dirname, '../data/blog-detail.ts');

const newBlogIndex = `
{
"slug": "regex-cheat-sheet-2026-developer-reference",
"coverImage": "https://picsum.photos/800/450?random=123&grayscale=false",
"author": "Korelyy Team",
"publishedAt": "2026-07-18T00:00:00.000Z",
"tags": [
{"en": "Regex", "zh": "正则表达式", "es": "Regex", "fr": "Regex", "hi": "रेगेक्स", "ar": "ريجيكس"},
{"en": "Cheat Sheet", "zh": "速查表", "es": "Hoja de Referencia", "fr": "Feuille de Référence", "hi": "चीट शीट", "ar": "ورقة مرجعية"},
{"en": "Developer", "zh": "开发者", "es": "Desarrollador", "fr": "Développeur", "hi": "डेवलपर", "ar": "مطور"}
],
"relatedToolSlugs": ["regex-tester"],
"readingMinutes": {"en": 15, "zh": 18, "es": 16, "fr": 16, "hi": 19, "ar": 17},
"title": {"en": "Regex Cheat Sheet 2026: Complete Developer Reference", "zh": "正则表达式速查表 2026：开发者完整参考指南", "es": "Hoja de Referencia Regex 2026: Guía Completa para Desarrolladores", "fr": "Feuille de Référence Regex 2026: Guide Complet pour Développeurs", "hi": "रेगेक्स चीट शीट 2026: डेवलपर्स के लिए पूर्ण संदर्भ", "ar": "ورقة مرجعية Regex 2026: مرجع شامل للمطورين"},
"description": {"en": "The ultimate regex cheat sheet for 2026. Learn syntax, flags, patterns, and real-world examples. Test every pattern live with our free online regex tester.", "zh": "2026 年终极正则表达式速查表。学习语法、标志位、模式和真实案例。使用免费在线正则测试器实时验证每个模式。", "es": "La hoja de referencia definitiva de regex para 2026. Aprende sintaxis, flags, patrones y ejemplos del mundo real.", "fr": "La feuille de référence regex ultime pour 2026. Apprenez la syntaxe, les flags, les motifs et des exemples concrets.", "hi": "2026 के लिए अंतिम रेगेक्स चीट शीट। सिंटैक्स, फ्लैग्स, पैटर्न्स और असली उदाहरण सीखें।", "ar": "ورقة المرجع النهائية لـ Regex لعام 2026. تعلم بناء الجملة، العلمات، الأنماط، والأمثلة الواقعية."},
"keywords": {"en": ["regex cheat sheet", "regular expression syntax", "regex patterns", "regex flags", "online regex tester", "developer reference"], "zh": ["正则表达式速查表", "正则语法", "正则模式", "正则标志位", "在线正则测试器", "开发者参考"]}
}
`;

const newBlogDetail = `
{
"slug": "regex-cheat-sheet-2026-developer-reference",
"content": [
{"type": "h2", "text": {"en": "What is Regular Expression?", "zh": "什么是正则表达式？"}},
{"type": "p", "text": {"en": "Regular expressions (regex) are powerful patterns used to match and manipulate text. They are essential for developers, data scientists, and anyone working with text processing.", "zh": "正则表达式（regex）是用于匹配和处理文本的强大模式。它们是开发者、数据科学家和任何处理文本的人的必备工具。"}},
{"type": "h2", "text": {"en": "Basic Syntax", "zh": "基础语法"}},
{"type": "table", "headers": {"en": ["Pattern", "Description", "Example"], "zh": ["模式", "描述", "示例"]}, "rows": [{"en": [".", "Any character except newline", "a.c matches abc"], "zh": [".", "任意字符（除换行符）", "a.c 匹配 abc"]}, {"en": ["\\d", "Digit (0-9)", "\\d+ matches 123"], "zh": ["\\d", "数字（0-9）", "\\d+ 匹配 123"]}, {"en": ["\\w", "Word character", "\\w+ matches hello"], "zh": ["\\w", "单词字符", "\\w+ 匹配 hello"]}, {"en": ["\\s", "Whitespace", "\\s+ matches spaces"], "zh": ["\\s", "空白字符", "\\s+ 匹配空格"]}]},
{"type": "h2", "text": {"en": "Quantifiers", "zh": "量词"}},
{"type": "table", "headers": {"en": ["Pattern", "Description", "Example"], "zh": ["模式", "描述", "示例"]}, "rows": [{"en": ["*", "Zero or more", "ab*c matches ac, abc, abbc"], "zh": ["*", "零个或多个", "ab*c 匹配 ac, abc, abbc"]}, {"en": ["+", "One or more", "ab+c matches abc, abbc"], "zh": ["+", "一个或多个", "ab+c 匹配 abc, abbc"]}, {"en": ["?", "Zero or one", "colou?r matches color, colour"], "zh": ["?", "零个或一个", "colou?r 匹配 color, colour"]}, {"en": ["{n,m}", "Between n and m", "a{2,4} matches aa, aaa, aaaa"], "zh": ["{n,m}", "n到m个", "a{2,4} 匹配 aa, aaa, aaaa"]}]},
{"type": "h2", "text": {"en": "Anchors", "zh": "锚点"}},
{"type": "table", "headers": {"en": ["Pattern", "Description", "Example"], "zh": ["模式", "描述", "示例"]}, "rows": [{"en": ["^", "Start of string", "^hello matches hello at start"], "zh": ["^", "字符串开头", "^hello 匹配开头的 hello"]}, {"en": ["$", "End of string", "world$ matches world at end"], "zh": ["$", "字符串结尾", "world$ 匹配结尾的 world"]}, {"en": ["\\b", "Word boundary", "\\bword\\b matches whole word"], "zh": ["\\b", "单词边界", "\\bword\\b 匹配完整单词"]}]},
{"type": "h2", "text": {"en": "Flags", "zh": "标志位"}},
{"type": "table", "headers": {"en": ["Flag", "Description"], "zh": ["标志位", "描述"]}, "rows": [{"en": ["g", "Global search - find all matches"], "zh": ["g", "全局搜索 - 查找所有匹配"]}, {"en": ["i", "Case insensitive"], "zh": ["i", "忽略大小写"]}, {"en": ["m", "Multiline mode"], "zh": ["m", "多行模式"]}, {"en": ["s", "Dotall - . matches newline"], "zh": ["s", "点号匹配换行符"]}]},
{"type": "h2", "text": {"en": "Real-World Patterns", "zh": "真实场景模式"}},
{"type": "ul", "items": [{"en": "Email: ^[\\w.-]+@[\\w.-]+\\.\\w+$", "zh": "邮箱: ^[\\w.-]+@[\\w.-]+\\.\\w+$"}, {"en": "URL: https?://[\\w.-]+(?:/[\\w./-]*)?", "zh": "网址: https?://[\\w.-]+(?:/[\\w./-]*)?"}, {"en": "Phone: \\+?\\d{1,3}[-.\\s]?\\d{3,4}[-.\\s]?\\d{4}", "zh": "电话: \\+?\\d{1,3}[-.\\s]?\\d{3,4}[-.\\s]?\\d{4}"}, {"en": "IPv4: \\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}", "zh": "IPv4: \\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}"}]},
{"type": "h2", "text": {"en": "Common Use Cases", "zh": "常见用例"}},
{"type": "ul", "items": [{"en": "Validate user input (email, phone, password)", "zh": "验证用户输入（邮箱、电话、密码）"}, {"en": "Extract data from text (scraping, parsing)", "zh": "从文本中提取数据（抓取、解析）"}, {"en": "Find and replace patterns in code", "zh": "在代码中查找和替换模式"}, {"en": "Format and clean up text", "zh": "格式化和清理文本"}]},
{"type": "callout", "kind": "tip", "text": {"en": "Tip: Test your regex patterns live using our free online Regex Tester tool. See matches highlighted in real-time!", "zh": "提示：使用我们的免费在线正则测试器实时测试你的正则模式。实时查看匹配高亮！"}},
{"type": "cta", "toolSlug": "regex-tester", "text": {"en": "Try Our Regex Tester Now", "zh": "立即尝试正则测试器"}, "sub": {"en": "Free, no signup required", "zh": "免费，无需注册"}}
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
