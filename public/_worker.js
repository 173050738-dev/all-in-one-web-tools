/**
 * Cloudflare Pages Advanced Mode Worker
 *
 * 功能：
 *  1) SEO 关键词矿工 API：POST /api/seo-miner 或 /{zh,en,es,fr,hi,ar}/api/seo-miner
 *  2) 根据 Accept-Language 或 Cookie 做边缘重定向（保留原有逻辑）
 *
 * 部署方式：Next.js 静态 export 后 post-build.cjs 自动把 public/_worker.js 复制到 out/_worker.js
 * wrangler pages deploy out/ → Pages Advanced Mode (无需额外 Worker 项目)
 */

// ============================================================
// ===== 模块 1：SEO 关键词矿工（Google Autocomplete + DeepSeek)
// ============================================================
const SEO_GOOGLE_SUGGEST_URL = 'https://suggestqueries.google.com/complete/search?client=firefox&q=';
const SEO_MODIFIERS = ['how', 'what', 'best', 'vs', 'for', 'near', 'free', 'online', '2025', '2026'];
const SEO_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const SEO_MAX_AUTOCOMPLETE_PER_QUERY = 15;
const SEO_MAX_CANDIDATE_KEYWORDS = 60;

function seoOkJson(data, status) {
  status = status || 200;
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, private',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
function seoErrJson(error, status) { return seoOkJson({ error: error }, status); }
function seoCorsPreflight() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  });
}
function seoEncodeKeyword(q) { return encodeURIComponent(String(q || '').trim()); }

async function seoFetchSuggestions(query, signal) {
  try {
    const res = await fetch(SEO_GOOGLE_SUGGEST_URL + seoEncodeKeyword(query), {
      signal: signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cf: { cacheTtl: 0 },
    });
    if (!res.ok) return [];
    const text = await res.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data) || !Array.isArray(data[1])) return [];
    return data[1].filter(function (s) { return typeof s === 'string'; }).slice(0, SEO_MAX_AUTOCOMPLETE_PER_QUERY);
  } catch (e) { return []; }
}

function seoClassifyHeatAndCompetition(kw, overallRank, total) {
  var words = (kw || '').trim().split(/\s+/).length;
  var len = (kw || '').length;
  var percentile = total <= 1 ? 1 : overallRank / total;
  var heat;
  if (percentile <= 0.25) heat = 'High';
  else if (percentile <= 0.6) heat = 'Medium';
  else heat = 'Low';
  var competition;
  if (words <= 2 && len <= 16) competition = 'High';
  else if (words <= 3 && len <= 28) competition = 'Medium';
  else competition = 'Low';
  return { heat: heat, competition: competition };
}

function seoIsSeoMinerPath(pathname) {
  var p = (pathname || '').replace(/\/+$/, '');
  if (!p) return false;
  if (/\/api\/seo-miner$/.test(p)) return true;
  if (/^\/(en|zh|es|fr|hi|ar)\/api\/seo-miner$/.test(p)) return true;
  return false;
}

async function seoMinerRequest(request, env) {
  if (request.method === 'OPTIONS') return seoCorsPreflight();
  if (request.method !== 'POST') return seoErrJson('Method Not Allowed (use POST)', 405);

  var payload;
  try { payload = await request.json(); } catch (e) { return seoErrJson('Invalid JSON body', 400); }

  var seedClean = typeof payload.seed === 'string' ? payload.seed.trim() : '';
  var localeRaw = payload.locale || 'en';
  var VALID_LOCALES = { en: 1, zh: 1, es: 1, fr: 1, hi: 1, ar: 1 };
  var locale = VALID_LOCALES[localeRaw] ? localeRaw : 'en';

  if (!seedClean) return seoErrJson('seed is required', 400);

  var queries = [];
  var seenQueries = {};
  function addQ(q) { if (!seenQueries[q]) { seenQueries[q] = 1; queries.push(q); } }
  addQ(seedClean);
  var i, j;
  for (i = 0; i < SEO_MODIFIERS.length; i++) { addQ(seedClean + ' ' + SEO_MODIFIERS[i]); addQ(SEO_MODIFIERS[i] + ' ' + seedClean); }
  for (j = 0; j < 8; j++) { addQ(seedClean + ' ' + SEO_ALPHABET[j]); addQ(SEO_ALPHABET[j] + ' ' + seedClean); }

  var controller = new AbortController();
  var timeoutId;
  try {
    timeoutId = setTimeout(function () { try { controller.abort(); } catch (e) {} }, 8000);
  } catch (e) { /* ignore */ }

  var allSug = [];
  var globalRank = 0;
  var queriesSlice = queries.slice(0, 28);
  for (i = 0; i < queriesSlice.length; i++) {
    var q = queriesSlice[i];
    var list = await seoFetchSuggestions(q, controller.signal);
    for (j = 0; j < list.length; j++) { allSug.push({ kw: list[j], rank: globalRank + j, query: q }); }
    globalRank += Math.max(list.length, 1);
  }
  try { if (timeoutId) clearTimeout(timeoutId); } catch (e) {}

  var seenKw = {};
  var ordered = [];
  var seedLow = seedClean.toLowerCase();
  for (i = 0; i < allSug.length; i++) {
    var row = allSug[i];
    var norm = (row.kw || '').toLowerCase().trim();
    if (seenKw[norm]) continue;
    if (norm.indexOf(seedLow) === -1) continue;
    seenKw[norm] = 1;
    ordered.push({ kw: row.kw, rank: ordered.length });
    if (ordered.length >= SEO_MAX_CANDIDATE_KEYWORDS) break;
  }

  var candidates = ordered.length ? ordered.slice(0, SEO_MAX_CANDIDATE_KEYWORDS) : [];

  if (candidates.length < 12) {
    var extraMods = ['how to', 'what is', 'best', 'top', 'vs', 'for', 'near me', 'free', 'online', '2025', '2026', 'review', 'guide', 'tips', 'tutorial', 'examples', 'ideas', 'for beginners', 'without', 'cheap', 'affordable', 'professional', 'open source'];
    var extraAhead = ['how to ', 'best ', 'top ', 'free ', 'cheap ', 'easy ', 'quick '];
    var extraBehind = [' for students', ' for business', ' for beginners', ' for small business', ' 2025', ' 2026', ' guide', ' review', ' tutorial', ' examples', ' tips', ' ideas', ' near me', ' online', ' free'];
    var manualSet = {};
    var manualArr = [];
    function addManual(k) { if (!manualSet[k]) { manualSet[k] = 1; manualArr.push(k); } }
    addManual(seedClean);
    for (i = 0; i < extraMods.length; i++) { addManual(seedClean + ' ' + extraMods[i]); addManual(extraMods[i] + ' ' + seedClean); }
    for (i = 0; i < extraAhead.length; i++) { addManual(extraAhead[i] + seedClean); }
    for (i = 0; i < extraBehind.length; i++) { addManual(seedClean + extraBehind[i]); }
    var extrasFiltered = manualArr.filter(function (k) { return k.toLowerCase().indexOf(seedLow) !== -1; }).filter(function (k) {
      for (var ci = 0; ci < candidates.length; ci++) if ((candidates[ci].kw || '').toLowerCase() === k.toLowerCase()) return false;
      return true;
    });
    var limit = Math.max(0, SEO_MAX_CANDIDATE_KEYWORDS - candidates.length);
    var mapped = extrasFiltered.slice(0, limit).map(function (kw, idx) { return { kw: kw, rank: candidates.length + idx }; });
    candidates = candidates.concat(mapped);
  }

  if (!candidates.length) candidates = [{ kw: seedClean, rank: 0 }];

  var baseLabels = candidates.map(function (c, idx) {
    var r = seoClassifyHeatAndCompetition(c.kw, idx, candidates.length);
    return { keyword: c.kw, heat: r.heat, competition: r.competition };
  });

  var apiKey = env && env.DEEPSEEK_API_KEY ? env.DEEPSEEK_API_KEY : '';
  var apiUrl = env && env.DEEPSEEK_API_URL ? env.DEEPSEEK_API_URL : 'https://api.deepseek.com/v1/chat/completions';
  var model = env && env.DEEPSEEK_MODEL ? env.DEEPSEEK_MODEL : 'deepseek-chat';
  var aiMap = {};

  if (apiKey) {
    var localePrompt;
    if (locale === 'zh') localePrompt = '用中文输出 suggestion 建议';
    else if (locale === 'es') localePrompt = 'Escribe suggestion en español';
    else if (locale === 'fr') localePrompt = 'Rédige suggestion en français';
    else if (locale === 'hi') localePrompt = 'suggestion ko hindi mein likhen';
    else if (locale === 'ar') localePrompt = 'اكتب suggestion باللغة العربية';
    else localePrompt = 'Write suggestion in English';

    var kwListStr = baseLabels.map(function (b) { return b.keyword; }).join('\n');
    var systemPrompt = '你是 SEO 关键词分析助手。针对候选关键词列表，为每词返回：{keyword, intent(Informational|Transactional|Navigational), suggestion(一句内容选题建议，不要太长)}。以 { keywords: [...] } 为顶层 JSON 返回。response_format: json_object。' + localePrompt + '。关键词列表:\n' + kwListStr;
    var userPrompt = locale === 'zh'
      ? ('为下列 SEO 长尾词分类 intent 并给出内容建议：\n' + kwListStr)
      : ('Classify intent and give 1 content suggestion for each keyword:\n' + kwListStr);

    try {
      var aiController;
      try { aiController = new AbortController(); } catch (e) { aiController = null; }
      var aiTimeout;
      if (aiController) {
        try { aiTimeout = setTimeout(function () { try { aiController.abort(); } catch (e2) {} }, 25000); } catch (e) {}
      }
      var response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        }),
        signal: aiController ? aiController.signal : void 0,
      });
      try { if (aiTimeout) clearTimeout(aiTimeout); } catch (e) {}
      if (response.ok) {
        var data = await response.json();
        var content = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ? data.choices[0].message.content : '{}';
        var parsed;
        try { parsed = JSON.parse(content); } catch (e) { parsed = { keywords: [] }; }
        var list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.keywords) ? parsed.keywords : []);
        for (var li = 0; li < list.length; li++) {
          var item = list[li];
          if (!item || !item.keyword) continue;
          var intentVal = (item.intent && (item.intent === 'Informational' || item.intent === 'Transactional' || item.intent === 'Navigational')) ? item.intent : 'Informational';
          aiMap[String(item.keyword).toLowerCase()] = { intent: intentVal, suggestion: (item.suggestion || '') };
        }
      } else {
        try {
          var errTxt = await response.text();
          console.warn('[seo-miner] DeepSeek upstream fail status=' + response.status + ' body=' + (errTxt || '').slice(0, 300));
        } catch (e3) {}
      }
    } catch (e) {
      console.warn('[seo-miner] DeepSeek fetch error:', e && e.message ? e.message : String(e));
    }
  }

  var results = baseLabels.map(function (b) {
    var ai = aiMap[b.keyword.toLowerCase()] || aiMap[b.keyword] || null;
    return {
      keyword: b.keyword,
      intent: ai ? ai.intent : 'Informational',
      heat: b.heat,
      competition: b.competition,
      suggestion: ai ? ai.suggestion : '',
    };
  });

  return seoOkJson({ keywords: results });
}

// ============================================================
// ===== 模块 1.1.1：Excel 公式本地知识库（兜底，DeepSeek失败时使用）
// ============================================================
var EXCEL_KB = [
  { id:'SUM_IF_GT', kwZh:['求','大于','数字之和','求和>','列>','sum','greater'], kwEn:['sum','greater','>','total','column'],
    match:function(r,zh){ return (zh?(/求|之和|求和/.test(r)&&/大于|>|\d+/.test(r)):/sum.*greater|sum.*>|total.*greater/.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=SUMIF(A:A,\">\"&100,A:A)',
      example:'=SUMIF(A2:A100, \">80\", E2:E100)    // 对 E 列中 A 列值>80 的行求和',
      explanation:['SUMIF(范围, 条件, 求和范围) — 单条件求和', '第1参数：条件判断的列（如 A:A 金额分类）', '第2参数：\">100\" 表示大于 100 的单元格', '第3参数：实际求和的列，省略则对第1列本身求和'],
      notes:['条件要加英文双引号：\">100\" 正确，>100 错误', '如果含引用单元格写法：\">\"&B2，用 & 拼接', 'Excel 365 / 2021 及 Sheets 语法完全一致，无需改动']
    }:{
      formula:'=SUMIF(A:A, \">100\", A:A)',
      example:'=SUMIF(A2:A100, \">80\", E2:E100)    // Sums column E where row A value > 80',
      explanation:['SUMIF(range, criteria, sum_range) — conditional sum', 'Arg 1: the column checked against the criteria (e.g., A:A amount category)', 'Arg 2: \">100\" matches cells strictly greater than 100', 'Arg 3: actual column to sum; omit to sum arg 1 itself'],
      notes:['Criteria MUST be wrapped in double quotes: \">100\" is valid, >100 is not', 'To reference a cell: \">\"&B2, concatenate with &', 'Excel 365/2021 and Sheets share identical syntax here']
    }; } },
  { id:'IF_PASS_FAIL', kwZh:['判断','及格','不及格','大于等于','pass','fail','if 60','return'], kwEn:['if','pass','fail','>= 60','>=60','greater or equal','return'],
    match:function(r,zh){ return (zh?(/是否|判断|返回|及格|大于等于/.test(r)):/if.*(pass|fail|60|>=|greater|equal)/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=IF(B2>=60,\"及格\",\"不及格\")',
      example:'=IF(B2>=60, \"及格\", \"不及格\")     // B2 分数 ≥60 返回及格，否则不及格',
      explanation:['IF(条件, 真值, 假值) — 三参数判断函数', '第1参数：B2>=60 计算返回 TRUE/FALSE', '第2参数：条件真时返回的结果（文本加英文引号）', '第3参数：条件假时返回的结果'],
      notes:['文本必须用英文双引号 \"\"，不能用中文 \"\"', '多层嵌套用 IFS 或 IF 嵌套：=IFS(B2>=90,\"A\",B2>=80,\"B\",B2>=60,\"C\",TRUE,\"D\")', '条件可用 AND() / OR() 组合多条件：=IF(AND(B2>=60,C2=\"是\"),\"通过\",\"不通过\")']
    }:{
      formula:'=IF(B2>=60, \"Pass\", \"Fail\")',
      example:'=IF(B2>=60, \"Pass\", \"Fail\")     // Returns Pass when score >=60, else Fail',
      explanation:['IF(condition, value_if_true, value_if_false) — 3-arg decision function', 'Arg 1: B2>=60 evaluates to TRUE/FALSE', 'Arg 2: result returned when condition is TRUE (wrap text in double quotes)', 'Arg 3: result returned when condition is FALSE'],
      notes:['Strings need plain ASCII double quotes \"\", never typographic \u201c \u201d', 'For multiple levels use IFS or nested IF: =IFS(B2>=90,\"A\",B2>=80,\"B\",B2>=60,\"C\",TRUE,\"D\")', 'Combine conditions with AND()/OR(): =IF(AND(B2>=60,C2=\"Yes\"),\"Pass\",\"No Pass\")']
    }; } },
  { id:'TEXTBEFORE_FIRST_SPACE', kwZh:['提取','空格前','第一个','文字','字符串','extract','text before','first','space'], kwEn:['extract','before','first space','text before','split left','get text'],
    match:function(r,zh){ return (zh?(/提取|空格前|第一个|文字/.test(r)&&/单元格|C2|D2/.test(r)):/extract.*(before|first|space|text)/i.test(r)); },
    build:function(plat,zh){
      var f = plat==='sheets'
        ? '=LEFT(C2,FIND(\" \",C2&\" \")-1)'
        : '=TEXTBEFORE(C2,\" \",,,\"\",C2)';
      return zh?{
        formula:f,
        example:(plat==='sheets'
          ? '=LEFT(C2, FIND(\" \", C2&\" \") - 1)     // 取 C2 中第一个空格前的所有字符；C2&\" \" 确保无空格不报错'
          : '=TEXTBEFORE(C2, \" \",,, \"\", C2)        // 第5参数 match_mode 不敏感，第6参数 C2 为找不到空格时兜底值'),
        explanation:['方法A — Excel 365 原生函数 TEXTBEFORE(文本,分隔符,[第N个],[忽略大小写],[匹配模式],[未找到兜底])', '方法B — LEFT+FIND 兼容老版 Excel / 所有 Sheets：找空格位置再截左', 'FIND 区分大小写，SEARCH 不区分大小写', '分隔符没找到会 #VALUE!，用 &\" \" 兜底或加兜底参数'],
        notes:['TEXTBEFORE 仅 Excel 365 / 2021+，Sheets 请用 LEFT+FIND 写法', '分隔符是英文空格 \" \"，不要写成中文全角空格', '取 @ 前的邮箱用户名写法：=TEXTBEFORE(A2,\"@\")']
      }:{
        formula:f,
        example:(plat==='sheets'
          ? '=LEFT(C2, FIND(\" \", C2&\" \") - 1)     // Chars before first space in C2; C2&\" \" prevents #VALUE when no space exists'
          : '=TEXTBEFORE(C2, \" \",,, \"\", C2)        // 5th arg case-insensitive; 6th arg C2 = fallback when delimiter is missing'),
        explanation:['Approach A — Excel 365 native: TEXTBEFORE(text,delimiter,[Nth],[case],[mode],[if-not-found])', 'Approach B — LEFT+FIND compatible with legacy Excel / all Sheets: find space index then slice left', 'FIND is case-sensitive, use SEARCH for case-insensitive', 'Missing delimiter throws #VALUE!; guard with &delimiter or the fallback arg'],
        notes:['TEXTBEFORE requires Excel 365 / 2021+; Sheets users must use LEFT+FIND form', 'Delimiter is a plain ASCII space \" \", never a full-width Chinese space', 'Extract username before @: =TEXTBEFORE(A2,\"@\")']
      };
    } },
  { id:'SUMIF_GROUP_BY', kwZh:['分组','按列','分类汇总','group','sum by','category','sumif group'], kwEn:['group by','sum by','group','category','sumif category','aggregate group'],
    match:function(r,zh){ return (zh?(/分组|分类|汇总|按.*求和|分组求和/.test(r)):/group.*(sum|by|category|aggregate)/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=SUMIF($F:$F,H2,$E:$E)',
      example:'=SUMIF($F:$F, H2, $E:$E)     // F 列为分类名称，H2 为当前分类名，E 列为金额；向下拖拽得到所有分类汇总',
      explanation:['SUMIF(分类列, 分类名, 金额列) — 典型分组汇总写法', '$ 绝对引用，向下拖拽时分类列和金额列不偏移', 'H2 相对引用，每行自动对应当前分类名', '多列多条件分组用 SUMIFS(金额列, 列1,条件1, 列2,条件2, ...)'],
      notes:['绝对引用 $F:$F 和 $E:$E 是拖拽正确的关键，漏 $ 会错位', '分类去重名单用 UNIQUE(F:F) 365 原生或数据→删除重复项', 'Sheets 与 Excel 语法完全一致']
    }:{
      formula:'=SUMIF($F:$F, H2, $E:$E)',
      example:'=SUMIF($F:$F, H2, $E:$E)     // Col F = category label, H2 = current category, Col E = amount; drag down to get totals for all groups',
      explanation:['SUMIF(category_column, category_name, amount_column) — the standard group-aggregate pattern', '$ locks ranges so category and amount columns stay fixed when you drag the formula down', 'H2 stays relative so each row references its own category', 'For multi-column conditions use SUMIFS(sum_col, col1,crit1, col2,crit2, ...)'],
      notes:['Absolute $F:$F / $E:$F are critical for correct drag-fill; omitting $ breaks references', 'Get unique category names with =UNIQUE(F:F) (365 native) or Data → Remove Duplicates', 'Excel and Sheets share 100% identical syntax here']
    }; } },
  { id:'TOP3_LARGE', kwZh:['最大','三个','前三名','top 3','large','前n','最大的3'], kwEn:['top 3','top n','largest 3','max 3','largest values','first 3'],
    match:function(r,zh){ return (zh?(/最大|前三名|top.?3|前.?三|值中最大/.test(r)):/(top|largest).*(3|three|values|n)/i.test(r)); },
    build:function(plat,zh){
      var draggable = plat==='excel'
        ? '=LARGE($A$2:$A$100,SEQUENCE(3))'
        : '=ArrayFormula(LARGE($A$2:$A$100,SEQUENCE(3)))';
      return zh?{
        formula:draggable,
        example: (plat==='excel'
          ? '=LARGE($A$2:$A$100, SEQUENCE(3))     // 输入到任意3行起点单元格回车，自动溢出第1/2/3大值'
          : '=ArrayFormula(LARGE($A$2:$A$100, SEQUENCE(3)))    // Sheets 要外套 ArrayFormula，选3格或自动溢出'),
        explanation:['LARGE(数据区域, N) — 返回区域中第 N 大的值', 'SEQUENCE(3) = {1;2;3} 生成 1 到 3 的连续序号', 'Excel 365 动态数组自动溢出 3 行；旧版 Excel 手动写 3 个 =LARGE(...,1) / LARGE(...,2) / LARGE(...,3)', '最小3个用 SMALL 替换 LARGE'],
        notes:['SEQUENCE 仅 365+，Sheets 也内建支持；老版 Excel 手动写 3 条', '前 3 名对应姓名：=INDEX($B:$B, MATCH(LARGE(A:A,1), A:A, 0))', '有并列相同值会返回同一个排名对应第一个位置']
      }:{
        formula:draggable,
        example:(plat==='excel'
          ? '=LARGE($A$2:$A$100, SEQUENCE(3))     // Enter on any 3-row anchor, auto-spills 1st/2nd/3rd largest values'
          : '=ArrayFormula(LARGE($A$2:$A$100, SEQUENCE(3)))    // Sheets wraps in ArrayFormula; select 3 cells or allow auto-spill'),
        explanation:['LARGE(range, N) — returns the Nth-largest value in the range', 'SEQUENCE(3) = {1;2;3} generates the rank sequence', 'Excel 365 dynamic arrays auto-spill 3 rows; legacy Excel write 3 explicit formulas: =LARGE(r,1) / LARGE(r,2) / LARGE(r,3)', 'For 3 SMALLEST values replace LARGE with SMALL'],
        notes:['SEQUENCE exists in 365+ and Sheets; legacy Excel users write 3 separate formulas', 'Top-3 values + their names: =INDEX($B:$B, MATCH(LARGE(A:A,1), A:A, 0))', 'Ties (duplicate values) return the first occurrence the rank points to']
      };
    } },
  { id:'VLOOKUP_BASIC', kwZh:['查找','vlookup','匹配','根据','对应值','xlookup','查找对应'], kwEn:['vlookup','xlookup','lookup','find match','corresponding value','match against'],
    match:function(r,zh){ return (zh?(/查找|根据.*值|匹配|对应值/.test(r)):/vlookup|xlookup|lookup.*match|find.*(corresponding|value)/i.test(r)); },
    build:function(plat,zh){
      var modern = (plat==='excel') ? '=XLOOKUP(H2,$A:$A,$C:$C,\"未找到\",0)' : '=XLOOKUP(H2,$A:$A,$C:$C,\"Not found\",0)';
      return zh?{
        formula:modern,
        example:(plat==='excel'
          ? '=XLOOKUP(H2, $A:$A, $C:$C, \"未找到\", 0)    // 在 A 列精确匹配 H2 的值，找到返回同一行 C 列；找不到显示"未找到"'
          : '=XLOOKUP(H2, $A:$A, $C:$C, \"Not found\", 0)    // Sheets 的 XLOOKUP 已于 2023 全量支持，参数顺序与 Excel 一致'),
        explanation:['XLOOKUP(查找值, 查找列, 返回列, [未找到兜底], [匹配模式]) — Excel 365+ 和 Sheets 都已支持', '匹配模式 0=精确（最常用）；1=近似升序；-1=近似降序；2=通配符', '查找列表在左边用 VLOOKUP 也行；但 XLOOKUP 支持从下往上、从右往左、自动兜底', '老版兼容写法：=IFERROR(VLOOKUP(H2,$A:$C,3,FALSE),\"未找到\")'],
        notes:['精确匹配第4参数要显式写 FALSE / 0，否则默认近似匹配会返回乱匹配的行', '查找列不要有重复首值；多个结果用 FILTER 全部取出来', 'Excel 2019 及更早没有 XLOOKUP 用 VLOOKUP + IFERROR 兜底']
      }:{
        formula:modern,
        example:(plat==='excel'
          ? '=XLOOKUP(H2, $A:$A, $C:$C, \"Not found\", 0)    // Exact-match H2 in col A; return same-row col C; show \"Not found\" when absent'
          : '=XLOOKUP(H2, $A:$A, $C:$C, \"Not found\", 0)    // Sheets has full XLOOKUP support since 2023, identical argument order to Excel'),
        explanation:['XLOOKUP(lookup, lookup_col, return_col, [if_missing], [match_mode]) — supported in Excel 365+ and all modern Sheets', 'Match modes: 0=exact (default here); 1=approx ascending; -1=approx descending; 2=wildcard', 'XLOOKUP supports right-to-left searches and search-last; fallback arg eliminates IFERROR wrapping', 'Legacy-compatible form: =IFERROR(VLOOKUP(H2,$A:$C,3,FALSE),\"Not found\")'],
        notes:['For exact matches always pass 0/FALSE explicitly; default approximate can return wrong rows silently', 'Avoid duplicates in the lookup column; to get multiple matches use FILTER', 'Excel 2019 and earlier lack XLOOKUP; use VLOOKUP + IFERROR wrapper as fallback']
      };
    } },
  { id:'AVERAGEIFS_RANGE', kwZh:['平均值','区间','平均大于','and','小于','介于','between','平均值条件'], kwEn:['average','between','avg of','greater than','less than','and','in range'],
    match:function(r,zh){ return (zh?(/平均|avg|介于|大于.*小于|小于.*大于/.test(r)):/average|avg|between.*and|greater.*less/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=AVERAGEIFS(A:A,A:A,\">80\",A:A,\"<90\")',
      example:'=AVERAGEIFS(A:A, A:A, \">80\", A:A, \"<90\")     // 求 A 列中 >80 且 <90 所有值的平均值（双条件）',
      explanation:['AVERAGEIFS(求平均列, 条件列1, 条件1, 条件列2, 条件2, ...) — 多条件平均', '第一参数永远是「实际求平均值」的列', '每一组条件列+条件成对出现，条件之间是 AND（并且）关系', '单条件用单参数版 AVERAGEIF(条件列,条件,求平均列)'],
      notes:['AVERAGEIF(S) 自动忽略文本、空单元格和逻辑值', '包含边界用 >= 或 <=，比如 \">=80\" 和 \"<=90\"', '日期条件示例：A:A,\">=\"&DATE(2026,1,1) 拼接日期']
    }:{
      formula:'=AVERAGEIFS(A:A, A:A, \">80\", A:A, \"<90\")',
      example:'=AVERAGEIFS(A:A, A:A, \">80\", A:A, \"<90\")     // Average of column A where value >80 AND <90 (two conditions)',
      explanation:['AVERAGEIFS(avg_col, crit_col1, crit1, crit_col2, crit2, ...) — multi-condition average', 'First argument is ALWAYS the actual column to average', 'Each (col, criterion) pair is ANDed together', 'Single-condition: use the simpler AVERAGEIF(crit_col,crit,avg_col)'],
      notes:['AVERAGEIF(S) silently skip text, blanks and boolean TRUE/FALSE', 'Include boundaries use >= or <= such as \">=80\" and \"<=90\"', 'Date criterion example: A:A,\">=\"&DATE(2026,1,1) concatenate with DATE()']
    }; } },
  { id:'COUNTIF_DUPLICATE', kwZh:['重复','计数','去重计数','countif','distinct','重复次数','出现多少次'], kwEn:['countif','duplicate','distinct count','how many times','repeat','frequency','count unique'],
    match:function(r,zh){ return (zh?(/重复|计数|出现.*次|多少次|去重|countif/.test(r)):/countif|duplicate|distinct.*count|how many times|unique count/i.test(r)); },
    build:function(plat,zh){
      var countDup = '=COUNTIF($A:$A,A2)';
      return zh?{
        formula:countDup,
        example: (
          '统计重复次数：B2 =COUNTIF($A:$A, A2)   拖拽到 B100 看每行出现几次。\n' +
          '去重数量（365 / Sheets）：=ROWS(UNIQUE(FILTER($A:$A,$A:$A<>\"\")))'
        ),
        explanation:['COUNTIF(列, 单元格) — 返回这个单元格值在列里出现的次数', '值>1 表示这一行是重复或重复第 N 次', '去重数量统计公式：UNIQUE 先去重，FILTER 去掉空行，ROWS 数结果行数', '老版无动态数组的兼容写法：=SUMPRODUCT(($A$2:$A$100<>\"\")/COUNTIF($A$2:$A$100,$A$2:$A$100&\"\"))'],
        notes:['UNIQUE + FILTER 只在 Excel 365 / 2021+ 和 Sheets 有效', '大小写 COUNTIF 默认不敏感，如要大小写敏感用 SUMPRODUCT+EXACT', 'COUNTIF 对整列 $A:$A 大表会稍慢，实际范围改成 $A$2:$A$100 更高效']
      }:{
        formula:countDup,
        example:(
          'Per-row duplicate count: B2 =COUNTIF($A:$A, A2)   drag to B100 to see occurrences per row.\n' +
          'Distinct count (365 / Sheets): =ROWS(UNIQUE(FILTER($A:$A,$A:$A<>\"\")))'
        ),
        explanation:['COUNTIF(range, cell) — how many times this cell value occurs in the range', 'Any row with result > 1 is a duplicate or Nth occurrence', 'Distinct-count formula: UNIQUE removes dupes, FILTER strips blanks, ROWS counts rows', 'Legacy Excel without dynamic arrays: =SUMPRODUCT(($A$2:$A$100<>\"\")/COUNTIF($A$2:$A$100,$A$2:$A$100&\"\"))'],
        notes:['UNIQUE+FILTER require Excel 365 / 2021+ or Sheets', 'COUNTIF is case-insensitive; for case-sensitive count use SUMPRODUCT + EXACT()', 'Applying COUNTIF to whole-column $A:$A can be slow on big tables; narrow to $A$2:$A$100']
      };
    } },
  { id:'DATEDIF_YEAR_MONTH', kwZh:['年龄','工龄','周岁','日期差','年数','月数','datedif','年月日','生日','年龄计算'], kwEn:['datedif','age','years between','months between','birthday','tenure','anniversary','year diff','month diff'],
    match:function(r,zh){ return (zh?(/年龄|周岁|生日|日期.*差|年数|月数|工龄|相差.*天/.test(r)):/datedif|age|years between|months between|birthday|tenure|year.*diff/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=DATEDIF(A2,TODAY(),\"Y\")&\"岁\"&DATEDIF(A2,TODAY(),\"YM\")&\"个月\"&DATEDIF(A2,TODAY(),\"MD\")&\"天\"',
      example:'=DATEDIF(A2, TODAY(), \"Y\") & \"岁\" & DATEDIF(A2,TODAY(),\"YM\") & \"个月\" & DATEDIF(A2,TODAY(),\"MD\") & \"天\"   // A2 是出生日期；自动算出几岁几个月零几天',
      explanation:['DATEDIF(起始日, 结束日, 单位) — 计算两日期之差，单位代码：\"Y\"整年，\"M\"整月，\"D\"整天，\"YM\"忽略年月后剩余月，\"MD\"忽略月日剩余日，\"YD\"忽略年的剩余日', 'TODAY() 返回当前系统日期，不需要参数', '& 是字符串连接符，把数字和中文单位拼接'],
      notes:['DATEDIF 参数 1（起始）必须早于参数 2（结束），否则 #NUM!', 'Sheets 原生支持 DATEDIF，参数与 Excel 一致', '如果出生日期是文本格式用 DATEVALUE 转：DATEDIF(DATEVALUE(A2), TODAY(), \"Y\")']
    }:{
      formula:'=DATEDIF(A2,TODAY(),\"Y\")&\"y \"&DATEDIF(A2,TODAY(),\"YM\")&\"m \"&DATEDIF(A2,TODAY(),\"MD\")&\"d\"',
      example:'=DATEDIF(A2, TODAY(), \"Y\") & \"y \" & DATEDIF(A2,TODAY(),\"YM\") & \"m \" & DATEDIF(A2,TODAY(),\"MD\") & \"d\"   // A2 = birth date; returns years/months/days of age',
      explanation:['DATEDIF(start, end, unit) — computes the gap between two dates. Units: \"Y\" full years, \"M\" full months, \"D\" full days, \"YM\" remaining months ignoring years, \"MD\" remaining days ignoring months, \"YD\" days ignoring the year', 'TODAY() returns the OS current date with no arguments needed', '& concatenates numbers with unit suffixes into a single string'],
      notes:['DATEDIF throws #NUM! if arg 1 (start) is after arg 2 (end). Double-check column order', 'Sheets supports DATEDIF with identical unit codes to Excel', 'If birth date is stored as text convert first: DATEDIF(DATEVALUE(A2), TODAY(), \"Y\")']
    }; } },
  { id:'FILTER_ALL_MATCHES', kwZh:['所有匹配','筛选出','条件筛选','列出所有','多行结果','filter函数','所有行'], kwEn:['filter','all matches','all rows','list all rows','criteria filter','multiple results'],
    match:function(r,zh){ return (zh?(/筛选|所有.*(行|条|匹配|结果)|列出.*所有|filter/.test(r)):/filter\(|all rows|all matches|list all|multiple matches/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=FILTER($A:$E,($B:$B=H2)*(C:C>=80),\"无匹配\")',
      example:'=FILTER($A:$E, ($B:$B=H2) * (C:C>=80), \"无匹配\")    // 在 A:E 五行数据中：选 B 列=H2 AND C 列≥80 的全部行，有多少返回多少，无匹配显示兜底文本',
      explanation:['FILTER(数据区域, 条件数组, [未找到兜底]) — 返回所有条件为真的行', '多条件 AND 用乘号 (*) 把两个 TRUE/FALSE 数组相乘；TRUE=1 FALSE=0 相乘后只有都为 1 的行保留', 'OR 条件用加号 (+)', '条件数组必须和数据区域行高一致，否则 #CALC!'],
      notes:['FILTER 仅 Excel 365 / 2021+ 和 Sheets 支持，老版要用高级筛选或 INDEX 小技巧', '输出行超出下方单元格时自动溢出；有内容挡住会 #SPILL!，请清出空间', '结果空时兜底参数避免 #CALC! 错误']
    }:{
      formula:'=FILTER($A:$E, ($B:$B=H2) * (C:C>=80), \"No matches\")',
      example:'=FILTER($A:$E, ($B:$B=H2) * (C:C>=80), \"No matches\")    // Return all rows from A:E where column B equals H2 AND col C >= 80; fallback when empty',
      explanation:['FILTER(data_range, boolean_condition_array, [if_empty]) — returns every row where condition evaluates TRUE', 'Multi-condition AND: multiply (*) two TRUE/FALSE arrays together; TRUE=1 FALSE=0, so only rows with ALL TRUE survive', 'Multi-condition OR: use addition (+)', 'Condition array height MUST equal data array height, otherwise #CALC!'],
      notes:['FILTER is Excel 365 / 2021+ and Sheets only; legacy users resort to Advanced Filter or INDEX+SMALL workarounds', 'Output auto-spills down; if destination cells are occupied you see #SPILL!; clear the area', 'Always provide an if-empty string to avoid ugly #CALC! when zero rows match']
    }; } },
  { id:'CONCAT_TEXTJOIN', kwZh:['合并','拼接','连接','合并文本','带分隔符','textjoin','concat','合并多个'], kwEn:['concatenate','concat','textjoin','merge text','join with','delimiter','combine cells'],
    match:function(r,zh){ return (zh?(/合并|拼接|连接|文本.*合并|textjoin|concat/.test(r)):/concat|textjoin|concatenate|join.*delimiter|merge text|combine/i.test(r)); },
    build:function(plat,zh){
      var tj = '=TEXTJOIN(\", \",TRUE,A2:A20)';
      return zh?{
        formula:tj,
        example:'=TEXTJOIN(\", \", TRUE, A2:A20)     // 用英文逗号+空格连接 A2:A20 中所有非空单元格内容，空的自动跳过',
        explanation:['TEXTJOIN(分隔符, 是否忽略空值, 文本区域/数组) — 最强大的多值合并函数', '第2参数 TRUE = 跳过空白单元格（几乎永远用 TRUE）', '旧版无 TEXTJOIN 用 CONCAT 或 & 手动拼接：=A2&\", \"&B2&\", \"&C2', 'Sheets 与 Excel 365 都内建支持'],
        notes:['TEXTJOIN 仅 Excel 2019 / 365+ 和 Sheets，老 Excel 用 CONCAT 或辅助列 &', '分隔符要加英文双引号：\", \"', '输出超过 32767 字符会被截断（Excel 单元格最大限制）']
      }:{
        formula:tj,
        example:'=TEXTJOIN(\", \", TRUE, A2:A20)     // Joins every non-empty value in A2:A20 with comma-space; blanks are skipped automatically',
        explanation:['TEXTJOIN(delimiter, ignore_empty, texts) — the most robust multi-value merge function', 'Arg 2 TRUE tells it to skip blanks — this is almost always the desired behavior', 'Legacy Excel without TEXTJOIN: fall back to CONCAT or manual &: =A2&\", \"&B2&\", \"&C2', 'Built into Excel 365 / 2019+ and all Sheets'],
        notes:['TEXTJOIN exists in Excel 2019 / 365 and Sheets only; older versions use CONCAT or helper columns with &', 'Wrap delimiter in plain ASCII double quotes: \", \"', 'Output truncates at 32767 chars (Excel cell hard limit); split across cells if needed']
      };
    } },
  { id:'REMOVE_SPACES_CLEAN', kwZh:['去空格','清除空格','清理多余空格','trim','前后空格','去除空格'], kwEn:['trim spaces','remove spaces','leading trailing','extra spaces','clean whitespace','clean function'],
    match:function(r,zh){ return (zh?(/去空格|去除空格|清理.*空格|前后空格|trim/.test(r)):/trim|remove.*spaces|leading|trailing|clean.*whitespace/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=TRIM(CLEAN(A2))',
      example:'=TRIM(CLEAN(A2))     // TRIM 去前后空格+单词间多余空格，CLEAN 去 ASCII 0-31 不可见换行/制表符等；两者叠加是最稳妥的文本清理方案',
      explanation:['TRIM(文本) — 删除文本开头/结尾空格，单词/中文中间连续的多个空格只留一个', 'CLEAN(文本) — 去掉 ASCII 控制字符（换行符、回车符、制表符等 0-31 号），从网页/ERP 导出的数据常带', '两者组合 TRIM(CLEAN(A2)) 是业界最常用的文本清洗万能写法', '要去所有空格（中间也要去掉）用 SUBSTITUTE(A2,\" \",\"\")'],
      notes:['中文全角空格 TRIM 不能直接去除，先 SUBSTITUTE(A2,CHAR(160),\"\") 替换不间断空格再 TRIM', 'Sheets 与 Excel 两个函数 100% 兼容', '去所有空格：=SUBSTITUTE(SUBSTITUTE(A2,\" \",\"\"),CHAR(160),\"\")']
    }:{
      formula:'=TRIM(CLEAN(A2))',
      example:'=TRIM(CLEAN(A2))     // TRIM strips leading/trailing + collapses duplicate internal spaces; CLEAN removes ASCII 0-31 invisible chars (CR/LF/Tab); combined = the universal cleaning idiom',
      explanation:['TRIM(text) — strips whitespace at ends; collapses repeated spaces between words/chars to a single space', 'CLEAN(text) — strips ASCII control chars 0-31 (newline, carriage return, tab, etc.) typical of ERP/web exports', 'Combined TRIM(CLEAN(A2)) is the idiomatic universal sanitizer', 'To remove ALL spaces including middle ones: =SUBSTITUTE(A2,\" \",\"\")'],
      notes:['TRIM does NOT handle non-breaking spaces (HTML &nbsp; / CHAR 160); chain: SUBSTITUTE(A2,CHAR(160),\"\") first, then TRIM', 'TRIM/CLEAN are 100% compatible between Excel and Sheets', 'Remove every space: =SUBSTITUTE(SUBSTITUTE(A2,\" \",\"\"),CHAR(160),\"\")']
    }; } },
  { id:'NETWORKDAYS_WORKDAYS', kwZh:['工作日','工作天数','不含周末','工作日差','networkdays','工作日之间','除去周末'], kwEn:['networkdays','workdays','business days','exclude weekends','working days','between two dates','workday diff'],
    match:function(r,zh){ return (zh?(/工作日|工作天数|不含周末|除去周末|多少个工作/.test(r)):/networkdays|workdays|business days|exclude weekends|working days between/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=NETWORKDAYS(A2,B2,$H$2:$H$20)',
      example:'=NETWORKDAYS(开始日, 结束日, H2:H20 节假日表)     // 计算 A2 到 B2 之间除去周六周日，再额外扣除 H2:H20 列出来的法定节假日后的工作日数量',
      explanation:['NETWORKDAYS(起始日, 结束日, [节假日区域]) — 标准工作日天数计算（按周一到周五算工作日）', '第3参数是可选的自定义节假日列表（把法定节假日日期放在单独一列引用）', '省略第3参数就只扣周六日', '反函数 WORKDAY(起始日, 天数, 节假日) 推算 N 个工作日后是哪天'],
      notes:['两个日期同一天返回 1 个工作日（当天算 1 天）', '结束早于起始日返回负数，可加 ABS() 取绝对值', 'Sheets 完全支持；Excel 老版需加载分析工具库（2013 后默认装）']
    }:{
      formula:'=NETWORKDAYS(A2, B2, $H$2:$H$20)',
      example:'=NETWORKDAYS(start_date, end_date, H2:H20 holiday_table)     // Weekdays from start to end: Sat/Sun auto-deducted; any date listed in H2:H20 (public holidays) is also deducted',
      explanation:['NETWORKDAYS(start, end, [holiday_range]) — standard business-day counter (Mon–Fri = workdays)', 'Arg 3 is the optional custom holiday list; put public/company holidays in a dedicated column and reference it', 'Omit arg 3 to strip ONLY weekends', 'Inverse function: WORKDAY(start, N_days, [holidays]) — computes the date N working days later'],
      notes:['Identical start/end returns 1 (that single day counts as one workday)', 'Returns a negative number when end < start; wrap in ABS() for absolute distance', '100% supported in Sheets; Excel pre-2013 required Analysis ToolPak add-in (loaded by default since 2013)']
    }; } },
  { id:'SORT_RANK', kwZh:['排名','排序','rank','排第几','名次','自动排名','第几位'], kwEn:['rank','ranking','sort by order','position','what place','ordinal','placement'],
    match:function(r,zh){ return (zh?(/排名|排第几|名次|rank|第几名|自动排名/.test(r)):/rank\(|ranking|what place|what position|order number|ordinal/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=RANK(A2,$A$2:$A$100,0)',
      example:'=RANK(A2, $A$2:$A$100, 0)     // 计算 A2 这个分数在 A2:A100 中排第几名；第3参数 0=降序（分数越大第1名），1=升序（用时越少第1名）',
      explanation:['RANK(要排名的值, 全体数据范围, 排序方向) — Excel 自带排名函数', '第3参数 0 或省略：由大到小排（分数/金额用）；1 由小到大排（用时/天数用）', '并列值会占同一个名次，下一个不同值的排名直接跳号（1,2,2,4）；想要不跳号用 RANK.EQ + COUNTIF 技巧', '365 新增 RANK.AVG 并列取平均排名'],
      notes:['区域要绝对引用 $A$2:$A$100，向下拖拽不偏移', '排名是动态的，源数据变化后排名自动刷新', 'Sheets 的 RANK 行为与 Excel 一致，还有等价的 RANK.EQ/RANK.AVG']
    }:{
      formula:'=RANK(A2, $A$2:$A$100, 0)',
      example:'=RANK(A2, $A$2:$A$100, 0)     // Rank of value in A2 across A2:A100; 3rd arg 0=descending (largest #1, for scores/amounts), 1=ascending (smallest #1, for times/days)',
      explanation:['RANK(value, full_data_range, order) — built-in ranking function', 'Order 0 / omitted: descending; Order 1: ascending', 'Ties share the same rank and next rank skips (pattern 1,2,2,4); dense-no-skip requires RANK.EQ + COUNTIF trick', '365 family adds RANK.AVG that averages tied ranks'],
      notes:['Data range must be absolute $A$2:$A$100 so drag-fill does not shift it', 'Ranks recompute automatically when source numbers change', 'Sheets fully supports RANK, RANK.EQ, and RANK.AVG with identical semantics to Excel']
    }; } },
  { id:'PIVOT_COUNTIF_MATRIX', kwZh:['交叉表','透视','二维统计','出现次数矩阵','countifs 二维','行*列','crosstab'], kwEn:['crosstab|countifs matrix|2-way count|pivot count|row by column|two dimensional|matrix'],
    match:function(r,zh){ return (zh?(/透视|交叉|二维|矩阵|crosstab|行.*列.*数/.test(r)):/crosstab|countifs.*matrix|two.?way|2.?way|pivot count|row by column/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=COUNTIFS($A:$A,$E2,$B:$B,F$1)',
      example:'=COUNTIFS($A:$A, $E2, $B:$B, F$1)     // 左上角交叉单元格：$E2 行标题（客户），F$1 列标题（城市）；$A列=客户列，$B列=城市列；向右向下拖拽即生成二维统计矩阵',
      explanation:['COUNTIFS 做二维矩阵是最常用的无透视表方案', '关键是「混合引用」：行标题 E2 列锁定$行随动 $E2；列标题 F1 行锁定$列随动 F$1', '两个条件列也要全列绝对 $A:$A $B:$B', '统计和用 SUMIFS($D:$D, $A:$A,$E2, $B:$B,F$1) 把条件列换成金额列即可'],
      notes:['混合引用（$在列号或行号前）是能否正确拖拽填充的关键', 'Excel 与 Sheets 的混合引用语法完全相同', '大数据量（10万行+）建议改用真正的数据透视表性能更好']
    }:{
      formula:'=COUNTIFS($A:$A, $E2, $B:$B, F$1)',
      example:'=COUNTIFS($A:$A, $E2, $B:$B, F$1)     // Anchor at top-left crosstab cell: $E2 = row header (customer), F$1 = col header (city); col A = customers, col B = cities; drag right+down to fill the 2D count matrix',
      explanation:['COUNTIFS as a 2D matrix is the #1 pivot-table-free workhorse pattern', 'The KEY is mixed references: row label E2 locks the COLUMN with $E so row changes, column label F1 locks the ROW with F$ so column changes as you drag', 'Both data ranges stay full-column absolute $A:$A $B:$B', 'To sum amounts instead of counting swap COUNTIFS for SUMIFS($D:$D, same criteria) with $D = amount column'],
      notes:['Mixed references ($ before letter OR number but not both) are what make drag-fill correct; if you get wrong pattern this is the first thing to audit', 'Excel and Sheets share 100% identical mixed-reference syntax', 'For 100k+ rows switch to an actual Pivot Table for significantly better performance']
    }; } },
  { id:'IFERROR_WRAP', kwZh:['报错','错误值','#N/A','#VALUE','#DIV/0','不显示错误','iferror','错误显示空'], kwEn:['iferror|hide error|#N/A|#VALUE|#DIV/0|blank when error|show empty on error|replace error'],
    match:function(r,zh){ return (zh?(/报错|错误|#N\/A|#VALUE|#DIV|不显示.*错误|显示为空|iferror/.test(r)):/iferror|hide error|#n\/a|#value|#div\/0|show.*blank.*error|empty.*error/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=IFERROR(VLOOKUP(H2,$A:$C,3,FALSE),\"\")',
      example:'=IFERROR( VLOOKUP(H2,$A:$C,3,FALSE), \"\" )    // VLOOKUP 找不到时原本返回 #N/A，被 IFERROR 捕获后改为返回空单元格，报表看起来整洁',
      explanation:['IFERROR(要试的公式, 出错时返回值) — 最优雅的错误兜底写法', '可捕获所有 Excel 错误代码：#N/A / #VALUE! / #REF! / #DIV/0! / #NUM! / #NAME? / #NULL! / #SPILL! / #CALC!', '第2参数写 \"\" 显示空；写 0 显示 0；写 \"无数据\" 显示自定义文本', '老版 Excel 2003 无 IFERROR 写 =IF(ISERROR(公式), 兜底, 公式) 会计算两次效率低'],
      notes:['IFERROR 不要大面积整列套空公式，大表会慢，只套在确实可能报错的查找/除法/日期计算上', '除法除零：=A2/IFERROR(1/B2,0) 或外层 IFERROR(A2/B2,\"\")', 'Sheets 与 Excel 完全兼容 IFERROR']
    }:{
      formula:'=IFERROR(VLOOKUP(H2,$A:$C,3,FALSE),\"\")',
      example:'=IFERROR( VLOOKUP(H2,$A:$C,3,FALSE), \"\" )    // VLOOKUP would return #N/A when missing the key; IFERROR traps that and returns an empty cell so reports look clean',
      explanation:['IFERROR(value_formula, fallback_if_error) — the cleanest error wrapper in the Excel/Sheets language', 'Catches every standard error code: #N/A / #VALUE! / #REF! / #DIV/0! / #NUM! / #NAME? / #NULL! / #SPILL! / #CALC!', 'Fallback \"\" = blank; 0 = zero; \"No data\" = custom label', 'Legacy Excel 2003 lacks IFERROR; use =IF(ISERROR(formula),fallback,formula) which evaluates twice'],
      notes:['Do not blanket-wrap entire columns in IFERROR; tables with 10k+ rows slow down dramatically — wrap only lookups/divisions/date math that legitimately can fail', 'Divide-by-zero guard: =A2/IFERROR(1/B2,0) or outer IFERROR(A2/B2,\"\")', '100% compatible between Excel and Sheets']
    }; } },
  { id:'UNIQUE_DISTINCT_LIST', kwZh:['去重','不重复','唯一值','unique','distinct','列出不重复值'], kwEn:['unique|distinct|remove duplicates|list unique|distinct list|no duplicates'],
    match:function(r,zh){ return (zh?(/去重|不重复|唯一值|distinct|列出.*不重复|提取.*不重复/.test(r)):/unique\(|distinct list|list.*unique|remove duplicate|drop duplicates/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=UNIQUE(FILTER(A:A,A:A<>\"\"))',
      example:'=UNIQUE(FILTER(A:A, A:A<>\"\"))    // 先 FILTER 去掉 A 列空单元格再 UNIQUE 去重；Excel 365 和 Sheets 回车自动溢出所有不重复值',
      explanation:['UNIQUE(区域或数组) — 返回区域中所有不重复值，自动溢出', '先套 FILTER 去空是最佳实践，否则结果里会有一个 0 对应空白行', '按两列组合去重：UNIQUE(A:B) 选两列范围', '老版 Excel 无动态数组 → 数据 → 删除重复项 或 高级筛选'],
      notes:['UNIQUE 仅 Excel 365 / 2021+ 和 Sheets，老版 Excel 用界面功能', '结果行/列可继续被 COUNTA / SORT / FILTER 包套组合', '排序后的去重：SORT(UNIQUE(FILTER(...))) 最常用的组合拳']
    }:{
      formula:'=UNIQUE(FILTER(A:A, A:A<>\"\"))',
      example:'=UNIQUE(FILTER(A:A, A:A<>\"\"))    // First FILTER strips blank cells in column A; then UNIQUE keeps only distinct values; Excel 365 and Sheets auto-spill the whole list on Enter',
      explanation:['UNIQUE(range_or_array) — returns every distinct value once; auto-spills', 'Pre-filtering blanks is best-practice; without it you usually get a stray 0 in the output representing the empty row', 'Two-column composite dedup: pass a 2D range UNIQUE(A:B)', 'Legacy Excel pre-365 → Ribbon Data → Remove Duplicates or Advanced Filter instead'],
      notes:['UNIQUE only in Excel 365 / 2021+ and Sheets; for very old Excel use menu-based Remove Duplicates', 'The resulting spill range feeds directly into COUNTA / SORT / FILTER — composable', 'The idiomatic sorted-distinct combo: SORT(UNIQUE(FILTER(...))) is used all the time in dashboards']
    }; } },
  { id:'MONTHLY_ROLLUP_EOMONTH', kwZh:['按月份汇总','按月','每月合计','月初月末','eomonth','sumifs月份','分组按月','日期按月份'], kwEn:['monthly|sum by month|group by month|eomonth|monthly total|rollup by month|aggregate per month'],
    match:function(r,zh){ return (zh?(/按月|每月|月份.*汇总|月份.*合计|按月分组|eomonth/.test(r)):/monthly|sum.*month|group.*month|eomonth|per month|rollup.*month/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=SUMIFS($E:$E,$A:$A,\">=\"&H2,$A:$A,\"<=\"&EOMONTH(H2,0))',
      example:'=SUMIFS($E:$E, $A:$A, \">=\"&H2, $A:$A, \"<=\"&EOMONTH(H2,0))   // H2 单元格放一个月份的第一天（如 2026/1/1）；公式算出 E 列金额在该月所有日期之和，向下拖拽可做 1~12 月逐月汇总表',
      explanation:['按月汇总最佳写法 = SUMIFS 配对「>= 月初」和「<= 月末」', 'EOMONTH(日期, N) — 返回那个日期起第 N 个月的最后一天；N=0 就是当月月底；N=1 下个月月底', '月初不用专门函数，直接在 H 列写 1/1、2/1 就行；或用 DATE(YEAR(H2),SEQUENCE(12),1) 生成整年', '条件里必须用 \">=\"&H2 的 & 拼接，不能写成 \">=H2\" 变成字符串'],
      notes:['日期条件拼接是最常犯的错：\">=\"&H2 正确 \">=H2\" 错误（后者直接拿字面量 \"H2\" 和日期比）', 'Sheets 原生支持 EOMONTH，语法一致', '按年汇总同理：SUMIFS(E:E,A:A,\">=\"&DATE(Y,1,1),A:A,\"<=\"&DATE(Y,12,31))']
    }:{
      formula:'=SUMIFS($E:$E, $A:$A, \">=\"&H2, $A:$A, \"<=\"&EOMONTH(H2,0))',
      example:'=SUMIFS($E:$E, $A:$A, \">=\"&H2, $A:$A, \"<=\"&EOMONTH(H2,0))   // Put the 1st of a month like 2026/1/1 in H2; sums column E amounts whose date falls in that same month. Drag down for Jan–Dec rollups.',
      explanation:['The canonical monthly-rollup pattern = SUMIFS with a pair of criteria: \">= first day of month\" and \"<= last day of month\"', 'EOMONTH(date, N_months_ahead) — returns the last calendar day N months forward; N=0 = same-month end; N=1 = next month end', 'Populate H with first-of-month dates manually (1/1, 2/1 …) or use =DATE(2026,SEQUENCE(12),1) to spill a whole year', 'Concatenate the operator and cell with &: \">=\"&H2 is correct; \">=H2\" becomes the literal string']
    ,
      notes:['Mis-typed date criteria is the #1 mistake: \">=\"&H2 is valid, \">=H2\" is a literal string comparison (always false)', 'Sheets includes EOMONTH built-in with identical semantics to Excel', 'Yearly rollup: SUMIFS(E:E, A:A, \">=\"&DATE(Y,1,1), A:A, \"<=\"&DATE(Y,12,31))']
    }; } },
  { id:'SUBTOTAL_VISIBLE', kwZh:['只求和筛选的','忽略隐藏行','subtotal','小计','仅筛选后','筛选后的和'], kwEn:['subtotal|visible rows only|ignore hidden|after filter|filtered sum|running subtotal'],
    match:function(r,zh){ return (zh?(/subtotal|只算筛选|小计|忽略.*隐藏|只显示.*的|筛选.*求和/.test(r)):/subtotal\(|visible only|ignore hidden|after filter|filtered sum|subtotal/i.test(r)); },
    build:function(plat,zh){ return zh?{
      formula:'=SUBTOTAL(109,E:E)',
      example:'=SUBTOTAL(109, E:E)    // 对 E 列求和，但只计算「当前可见行」（被筛选器/手动隐藏行会被忽略）；109=忽略隐藏行的SUM；9=包含手动隐藏行的SUM',
      explanation:['SUBTOTAL(功能号, 区域) — 只计算筛选后可见单元格', '常用功能号：101=AVERAGE忽略隐藏 1=含隐藏行  102=COUNT 2=  103=COUNTA 3=  104=MAX 4=  105=MIN 5=  109=SUM 9=', '百位加 1 表示「同时忽略手动隐藏行」；不加 1 只忽略筛选隐藏行', 'SUBTOTAL 永远不会把其他 SUBTOTAL 单元格重复计入（避免合计重复）'],
      notes:['做总表「总计行」永远优先用 SUBTOTAL 109 不用 SUM，筛选分类后总计自动跟着变', '功能号加不加 1 百位数只有手动隐藏行有区别；用筛选器隐藏的两种都会忽略', 'Sheets 功能号和 Excel 完全一致']
    }:{
      formula:'=SUBTOTAL(109, E:E)',
      example:'=SUBTOTAL(109, E:E)    // Sum column E but ONLY for rows CURRENTLY VISIBLE. Filter-hidden / manually hidden rows are skipped. 109 = SUM ignoring manual hidden rows; plain 9 = SUM including manually-hidden, filter-hidden still skipped',
      explanation:['SUBTOTAL(function_code, range) — aggregates ONLY visible / non-filtered rows', 'Common codes: 101=AVERAGE hidden-skipped, 1=hidden-included; 102=COUNT, 2=; 103=COUNTA,3=; 104=MAX,4=; 105=MIN,5=; 109=SUM,9=', 'Adding 100 to the code means ALSO skip manually hidden rows; without 1xx only filter-hidden rows are skipped', 'SUBTOTAL automatically ignores cells containing other SUBTOTAL — prevents double-counting grand totals'],
      notes:['Dashboard totals rows should ALWAYS use SUBTOTAL(109,…) instead of SUM so totals adapt live when you apply filters', 'The 1xx vs plain code difference only applies to manually hidden rows; filter-hidden rows are skipped by both', 'Function codes are 100% identical between Excel and Sheets']
    }; } },
  { id:'SPLIT_FLASHFILL', kwZh:['拆分','分列','分开','split','按分隔符拆','split列','拆分成多列'], kwEn:['split|textsplit|split column|separate columns|delimited split|split cells'],
    match:function(r,zh){ return (zh?(/拆分|分列|split|分成.*列|按.*拆|分开.*列/.test(r)):/split\(|textsplit|separate column|delimited|split cell/i.test(r)); },
    build:function(plat,zh){
      var splitFx = (plat==='excel')
        ? '=TEXTSPLIT(A2,{\" \",\",\",\"-\"},,\")'
        : '=SPLIT(A2, \" ,-\", TRUE)';
      return zh?{
        formula:splitFx,
        example: (plat==='excel'
          ? '=TEXTSPLIT(A2, {\" \",\",\",\"-\"}, , TRUE)    // 同时按 空格/逗号/减号 拆 A2，第4参数 TRUE=忽略空片段；回车自动溢出多列'
          : '=SPLIT(A2, \" ,-\", TRUE)    // Sheets 原生 SPLIT；第二个参数字符串里每个字符都是分隔符（空格、逗号、减号），第三个 TRUE=去掉空格片段'
        ),
        explanation:['拆分字符串到多列的原生函数', 'Excel 365 用 TEXTSPLIT(文本, [列分隔符], [行分隔符], [忽略空片段])，支持多分隔符数组 {\";\" , \"-\"}', 'Sheets 用 SPLIT(文本, 分隔符集合字符串, 是否去空, 是否拆分每个字符)', '无原生函数的老版 Excel 用「数据 → 分列」向导按分隔符批量拆'],
        notes:['TEXTSPLIT 输出溢出；右边有其他列内容会 #SPILL!，先清空', '中文全角逗号 / 全角空格要另加进分隔符列表', '不想溢出写 INDEX(TEXTSPLIT(...),, 第N列) 单独取第 N 列']
      }:{
        formula:splitFx,
        example:(plat==='excel'
          ? '=TEXTSPLIT(A2, {\" \",\",\",\"-\"}, , TRUE)    // Split A2 by space / comma / dash simultaneously; 4th arg TRUE skips empty segments; result auto-spills across columns'
          : '=SPLIT(A2, \" ,-\", TRUE)    // Native Sheets SPLIT; 2nd arg is a string where each char acts as delimiter (space / comma / dash); 3rd TRUE removes empty pieces'
        ),
        explanation:['Built-in functions for splitting one text column into many', 'Excel 365: TEXTSPLIT(text, [col_delim], [row_delim], [ignore_empty]); accepts multiple delimiters via inline array {\";\" , \"-\"}', 'Sheets: SPLIT(text, delimiter_string, remove_empty, split_each_char)', 'Legacy Excel without TEXTSPLIT → menu Data → Text to Columns wizard'],
        notes:['TEXTSPLIT output auto-spills right; if existing content lives there you see #SPILL! — clear the target area', 'Chinese full-width comma / ideographic space need to be added to the delimiter list explicitly', 'Capture only a specific column from the split without spilling: INDEX(TEXTSPLIT(...),, N) grabs column N']
      };
    } },
  { id:'POWER_QUERY_ALTERNATIVE', kwZh:['默认','通用','综合查询','常用公式','基本公式','空值','fallback','怎么用','通用用法'], kwEn:['common formula|general usage|give an example|how to use|default formula|basic formula'],
    match:function(r,zh){ return true; },  // 最终兜底：所有没匹配到的返回这个
    build:function(plat,zh){ return zh?{
      formula:'=IFERROR(你的主公式,\"\")',
      example:'根据你的需求，组合使用下面的万能函数组合：\n• 条件选择：IF / IFS / SWITCH\n• 查找：XLOOKUP / FILTER / INDEX+MATCH\n• 统计：SUMIFS / COUNTIFS / AVERAGEIFS / MAXIFS / MINIFS\n• 文本：TEXTBEFORE / TEXTAFTER / TEXTJOIN / TRIM / SUBSTITUTE\n• 日期：EOMONTH / NETWORKDAYS / DATEDIF / TODAY()\n• 数组：UNIQUE / SORT / SEQUENCE / FILTER / LARGE',
      explanation:['先按功能选类别：需要判断？IF/IFS；需要找值？XLOOKUP；需要挑行？FILTER；需要分组算？SUMIFS/COUNTIFS', '再想「范围+条件+目标列」三要素分别是什么', '永远在外层套 IFERROR(原公式,\"\"/0) 防止 #N/A / #VALUE 破坏报表', '单元格引用用 F4 键快速切换 $A$1 / A$1 / $A1 / A1 四种形式'],
      notes:['描述越具体返回越准确：请写出「哪一列、条件、返回哪一列」', '大表优先用 SUMIFS/COUNTIFS/UNIQUE 动态数组，少用整列拖慢计算', '结果不对时用「公式求值」(Formulas → Evaluate) 单步调试每个部分']
    }:{
      formula:'=IFERROR(your_main_formula, \"\")',
      example:'Combine these idiomatic building blocks depending on your goal:\n• Conditionals: IF / IFS / SWITCH\n• Lookups: XLOOKUP / FILTER / INDEX+MATCH\n• Aggregates: SUMIFS / COUNTIFS / AVERAGEIFS / MAXIFS / MINIFS\n• Text: TEXTBEFORE / TEXTAFTER / TEXTJOIN / TRIM / SUBSTITUTE\n• Dates: EOMONTH / NETWORKDAYS / DATEDIF / TODAY()\n• Arrays: UNIQUE / SORT / SEQUENCE / FILTER / LARGE',
      explanation:['Pick the category first: decisions → IF/IFS; finding a match → XLOOKUP; selecting rows → FILTER; group-by math → SUMIFS/COUNTIFS', 'Identify the three core pieces: which data range, which criterion, which output column', 'Always wrap outer layer with IFERROR(main, \"\" or 0) to stop #N/A / #VALUE breaking reports', 'Use F4 inside the formula bar to cycle cell reference forms $A$1 / A$1 / $A1 / A1 quickly'],
      notes:['For better matches describe your task explicitly: state column letters / the condition / which column should be returned', 'For very large tables prefer SUMIFS / COUNTIFS / dynamic arrays over whole-column drag-downs for speed', 'When results look wrong use Formulas → Evaluate Formula to step through each piece one operation at a time']
    }; } }
];

function _normExcelReq(s, zh){
  if (!s) return '';
  s = String(s).toLowerCase();
  s = s.replace(/[\r\n\t]+/g,' ').replace(/\s+/g,' ').trim();
  return s;
}

function excelFallbackKb(reqText, platform, locale){
  var zh = locale === 'zh';
  var req = _normExcelReq(reqText, zh);
  var best = null, bestScore = 0;
  for (var i=0; i<EXCEL_KB.length; i++){
    var entry = EXCEL_KB[i];
    var score = 0;
    try {
      if (typeof entry.match === 'function' && entry.match(req, zh)) score += 30;
    } catch (e) {}
    var kws = zh ? (entry.kwZh || []) : (entry.kwEn || []);
    for (var k=0; k<kws.length; k++){
      var kw = String(kws[k]).toLowerCase();
      if (!kw) continue;
      if (req.indexOf(kw) !== -1) score += (kw.length >= 4 ? 6 : 3);
    }
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  if (!best) best = EXCEL_KB[EXCEL_KB.length - 1];
  var obj = {};
  try { obj = best.build(platform, zh); } catch (e) { obj = {}; }
  return {
    formula: obj.formula || '',
    explanation: Array.isArray(obj.explanation) ? obj.explanation : [],
    example: obj.example || '',
    notes: Array.isArray(obj.notes) ? obj.notes : []
  };
}

// ============================================================
// ===== 模块 1.1：Excel/Sheets 公式生成器（内嵌 DeepSeek）
// ============================================================
function isExcelFormulaPath(pathname) {
  var p = (pathname || '').replace(/\/+$/, '');
  if (!p) return false;
  if (/\/api\/excel-formula$/.test(p)) return true;
  if (/^\/(en|zh|es|fr|hi|ar)\/api\/excel-formula$/.test(p)) return true;
  return false;
}

async function excelFormulaRequest(request, env) {
  if (request.method === 'OPTIONS') return seoCorsPreflight();
  if (request.method !== 'POST') return seoErrJson('Method Not Allowed (use POST)', 405);

  var payload;
  try { payload = await request.json(); } catch (e) { return seoErrJson('Invalid JSON body', 400); }

  var reqText = typeof payload.request === 'string' ? payload.request.trim() : '';
  var platform = payload.platform === 'sheets' ? 'sheets' : 'excel';
  var VALID_LOCALES = { en: 1, zh: 1, es: 1, fr: 1, hi: 1, ar: 1 };
  var localeRaw = payload.locale || 'en';
  var locale = VALID_LOCALES[localeRaw] ? localeRaw : 'en';
  locale = locale === 'zh' ? 'zh' : 'en';
  if (!reqText) return seoErrJson('Request is required', 400);

  function fallbackKb() {
    try {
      var fb = excelFallbackKb(reqText, platform, locale);
      return seoOkJson({
        formula: fb.formula || '',
        explanation: Array.isArray(fb.explanation) ? fb.explanation : [],
        example: fb.example || '',
        notes: Array.isArray(fb.notes) ? fb.notes : []
      });
    } catch (e) {
      return seoErrJson('Formula generator unavailable', 503);
    }
  }

  var apiKey = env && env.DEEPSEEK_API_KEY ? env.DEEPSEEK_API_KEY : '';
  var apiUrl = env && env.DEEPSEEK_API_URL ? env.DEEPSEEK_API_URL : 'https://api.deepseek.com/v1/chat/completions';
  var model = env && env.DEEPSEEK_MODEL ? env.DEEPSEEK_MODEL : 'deepseek-chat';
  if (!apiKey) return fallbackKb();

  var platformLabel = platform === 'sheets' ? 'Google Sheets' : 'Microsoft Excel';
  var langLabel = locale === 'zh' ? 'Simplified Chinese' : 'English';

  var systemPrompt = 'You are an expert formula generator for ' + platformLabel + '. Based on the user\'s natural language requirement, output a correct formula.\n'
    + 'Return STRICTLY follow these rules:\n'
    + '1. Platform syntax: Use ONLY ' + platformLabel + ' function names and syntax.\n'
    + '2. Return a VALID JSON object with this EXACT shape: {"formula": string, "explanation": string[], "example": string, "notes": string[]}\n'
    + '3. formula: the raw formula string starting with =, NO extra spaces or markdown backticks.\n'
    + '4. explanation: step-by-step explanation as an array of short strings.\n'
    + '5. example: one concrete usage example with sample cell references.\n'
    + '6. notes: 2-4 practical caveats or tips as a string array.\n'
    + '7. The user locale is ' + (locale === 'zh' ? 'Chinese' : 'English') + ', so write explanation/example/notes in ' + langLabel + '.\n'
    + 'DO NOT wrap the JSON in markdown code fences.';

  var userPrompt = locale === 'zh'
    ? ('平台：' + platformLabel + '\n用户需求：' + reqText + '\n\n请生成正确公式。')
    : ('Platform: ' + platformLabel + '\nUser requirement: ' + reqText + '\n\nGenerate the correct formula.');

  var response;
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
    });
  } catch (e) { return fallbackKb(); }

  if (!response.ok) return fallbackKb();

  var data;
  try { data = await response.json(); } catch (e) { return fallbackKb(); }
  var content = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '{}';
  var result;
  try { result = JSON.parse(content); } catch (e) { result = {}; }

  var formula = result.formula || '';
  var explanation = Array.isArray(result.explanation) ? result.explanation : [];
  var example = result.example || '';
  var notes = Array.isArray(result.notes) ? result.notes : [];

  if (!formula || formula.indexOf('=') !== 0) return fallbackKb();

  return seoOkJson({
    formula: formula,
    explanation: explanation,
    example: example,
    notes: notes
  });
}

// ============================================================
// ===== 模块 2：语言重定向（原有逻辑）
// ============================================================
const SUPPORTED_LOCALES = new Set(['en', 'zh', 'es', 'hi', 'fr', 'ar']);
const LOCALE_COOKIE_KEY = 'korelyy-locale';

const STATIC_BYPASS_PREFIXES = ['/_next/', '/_headers', '/_redirects', '/yandex_', '/google'];
const STATIC_BYPASS_FILES = new Set([
  '/robots.txt',
  '/sitemap.xml',
  '/site.webmanifest',
  '/sw.js',
  '/favicon.svg',
  '/og-image.svg',
  '/favicon.ico',
  '/ads.txt',
  '/index.txt',
]);

function hasStaticExtension(pathname) {
  return /\.[a-zA-Z0-9]{1,6}$/.test(pathname);
}

function parsePathLocale(pathname) {
  const first = pathname.split('/').filter(Boolean)[0];
  if (!first) return null;
  return SUPPORTED_LOCALES.has(first) ? first : null;
}

function readCookieLocale(cookieHeader) {
  if (!cookieHeader) return null;
  const pairs = cookieHeader.split(';');
  for (const p of pairs) {
    const [k, v] = p.trim().split('=');
    if (k === LOCALE_COOKIE_KEY && v && SUPPORTED_LOCALES.has(v)) {
      return v;
    }
  }
  return null;
}

function parseAcceptLanguage(header) {
  if (!header) return [];
  return header
    .split(',')
    .map((raw) => {
      const parts = raw.trim().split(';');
      const tag = parts[0].trim().toLowerCase();
      let q = 1;
      for (let i = 1; i < parts.length; i++) {
        const [k, v] = parts[i].trim().split('=');
        if (k === 'q' && v) {
          const n = parseFloat(v);
          if (!Number.isNaN(n)) q = n;
        }
      }
      return { tag, q };
    })
    .filter((x) => x.tag && x.q > 0)
    .sort((a, b) => b.q - a.q);
}

function pickLocaleFromAccept(header) {
  const entries = parseAcceptLanguage(header);
  for (const { tag } of entries) {
    if (SUPPORTED_LOCALES.has(tag)) return tag;
    const prefix = tag.split('-')[0];
    if (SUPPORTED_LOCALES.has(prefix)) return prefix;
  }
  return 'en';
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, search, hostname } = url;

    // 0) www 子域名 -> 主域名（SEO 权重合并）
    if (hostname === 'www.korelyy.com') {
      const apex = new URL(pathname + search, 'https://korelyy.com');
      return Response.redirect(apex.toString(), 308);
    }

    // 0.1) SEO 关键词矿工 API：优先拦截（在任何 static bypass 检查前）
    if (seoIsSeoMinerPath(pathname)) {
      return seoMinerRequest(request, env);
    }

    // 0.2) Excel/Sheets 公式生成器 API
    if (isExcelFormulaPath(pathname)) {
      return excelFormulaRequest(request, env);
    }

    // 1) 静态资源白名单：直接放行
    if (
      STATIC_BYPASS_PREFIXES.some((p) => pathname.startsWith(p)) ||
      STATIC_BYPASS_FILES.has(pathname) ||
      hasStaticExtension(pathname)
    ) {
      return env.ASSETS.fetch(request);
    }

    // 2) 已经在带语言前缀的路径下 → 直接透传到 Pages 静态
    if (parsePathLocale(pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 3) 未带语言前缀 → Cookie 或 Accept-Language 检测后跳转
    const cookie = request.headers.get('Cookie');
    const cookieLocale = readCookieLocale(cookie);
    const accept = request.headers.get('Accept-Language');
    const target = cookieLocale ?? pickLocaleFromAccept(accept);

    const rest = pathname === '/' ? '' : pathname;
    const redirectTo = `/${target}${rest}${search}`;

    return Response.redirect(new URL(redirectTo, url).toString(), 307);
  },
};
