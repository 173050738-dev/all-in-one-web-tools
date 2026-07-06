# ============================================================
# Korelyy Tool Hub - Cloudflare Pages 一键部署脚本
# 方式：本地 build → wrangler pages deploy 上传到 Pages
# 使用：在 PowerShell 5 中运行：  .\cf-deploy.ps1
# ============================================================

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
$Script:ProjectName = $null

function Write-Step([string]$msg)  { Write-Host "`n[STEP] $msg" -ForegroundColor Cyan }
function Write-Ok([string]$msg)    { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Warn([string]$msg)  { Write-Host "  [!!] $msg" -ForegroundColor Yellow }
function Write-Fail([string]$msg)  { Write-Host "  [FAIL] $msg" -ForegroundColor Red }
function Pause-User([string]$msg)  { Write-Host "`n$msg" -ForegroundColor DarkCyan; Read-Host "按 Enter 继续（或关闭窗口退出）" | Out-Null }

# ------------------------------------------------------------
# Step 1: 检查基础环境
# ------------------------------------------------------------
Write-Step "1/7 检查基础运行环境"

try {
  $nodeVer = & node --version 2>$null
  if (-not $nodeVer) { throw "Node.js 未安装" }
  Write-Ok "Node.js 版本: $nodeVer"
} catch {
  Write-Fail "未检测到 Node.js，请先安装 Node.js 20+  https://nodejs.org/"
  exit 1
}

try {
  $npmVer = & npm --version 2>$null
  Write-Ok "npm 版本: $npmVer"
} catch {
  Write-Fail "npm 不可用，请检查 Node.js 安装。"
  exit 1
}

# ------------------------------------------------------------
# Step 2: 检查并安装 wrangler CLI
# ------------------------------------------------------------
Write-Step "2/7 检查 Cloudflare Wrangler CLI"

$wranglerInstalled = $false
try {
  $wranglerVer = & npx.cmd --yes wrangler@latest --version 2>$null
  if ($wranglerVer) { $wranglerInstalled = $true; Write-Ok "wrangler 可用: v$wranglerVer (通过 npx 调用)" }
} catch {
  $wranglerInstalled = $false
}

if (-not $wranglerInstalled) {
  Write-Warn "wrangler CLI 首次使用，开始全局安装..."
  try {
    & npm.cmd install -g wrangler@latest
    if ($LASTEXITCODE -ne 0) { throw "npm install wrangler 失败" }
    Write-Ok "wrangler 已全局安装"
  } catch {
    Write-Fail "wrangler 安装失败，请手动执行：  npm install -g wrangler@latest"
    exit 2
  }
}

# ------------------------------------------------------------
# Step 3: 检查 out/ 静态目录，没有就自动 build
# ------------------------------------------------------------
Write-Step "3/7 检查静态产物 out/ 目录"

$outDir = Join-Path $ScriptDir "out"
$outReady = (Test-Path $outDir) -and (Get-ChildItem $outDir -Recurse -File | Measure-Object).Count -gt 50
if (-not $outReady) {
  Write-Warn "out/ 目录不存在或文件太少，现在自动运行 build.bat 生成..."
  Pause-User "确认现在开始打包？（会先执行 build.bat，大约 3~8 分钟）"
  if (Test-Path (Join-Path $ScriptDir "build.bat")) {
    & .\build.bat
    if ($LASTEXITCODE -ne 0) {
      Write-Fail "build.bat 执行失败，请先修复 build 错误后重试。"
      exit 3
    }
  } else {
    Write-Fail "找不到 build.bat，请手动运行打包命令再重试。"
    exit 3
  }
  if (-not (Test-Path $outDir)) {
    Write-Fail "build 后依然找不到 out/ 目录，请检查。"
    exit 3
  }
  Write-Ok "out/ 目录生成成功，文件数: $((Get-ChildItem $outDir -Recurse -File).Count)"
} else {
  Write-Ok "out/ 目录已就绪，文件数: $((Get-ChildItem $outDir -Recurse -File).Count)"
}

# ------------------------------------------------------------
# Step 4: 检查 wrangler 登录状态
# ------------------------------------------------------------
Write-Step "4/7 检查 Cloudflare 登录状态"

$whoami = & npx.cmd --yes wrangler@latest whoami 2>&1
$isLoggedIn = ($LASTEXITCODE -eq 0) -and ($whoami -match 'You are logged in|account ID|Email')

if (-not $isLoggedIn) {
  Write-Warn "未检测到 wrangler 登录。即将打开浏览器授权登录 Cloudflare。"
  Write-Host "  如果浏览器未自动打开，请复制下方链接手动打开。" -ForegroundColor DarkYellow
  Pause-User "准备好后按 Enter 开始 wrangler login"
  & npx.cmd --yes wrangler@latest login
  if ($LASTEXITCODE -ne 0) {
    Write-Fail "wrangler login 失败，请重试或查看错误提示。"
    Write-Host "  提示：你也可以生成 API Token（Cloudflare 后台 → My Profile → API Tokens → Create Token → Edit Cloudflare Pages），然后在本窗口运行：" -ForegroundColor Yellow
    Write-Host '    $env:CLOUDFLARE_API_TOKEN = "你的Token" ;  .\cf-deploy.ps1' -ForegroundColor Yellow
    exit 4
  }
  Write-Ok "wrangler 登录成功"
} else {
  $whoamiText = ($whoami | Select-Object -First 3) -join "  "
  Write-Ok "已登录 Cloudflare: $whoamiText"
}

# ------------------------------------------------------------
# Step 5: 获取/询问 Pages 项目名
# ------------------------------------------------------------
Write-Step "5/7 确定 Pages 项目名称"

$defaultName = "korelyy-tools"
$inputName = Read-Host "`n请输入 Pages 项目名（纯小写字母/数字/短横杠，回车使用默认 $defaultName）"
if ([string]::IsNullOrWhiteSpace($inputName)) {
  $Script:ProjectName = $defaultName
} else {
  $Script:ProjectName = $inputName.Trim().ToLower() -replace '[^a-z0-9-]', '-'
}
Write-Ok "目标 Pages 项目名: $($Script:ProjectName)  （部署后访问: https://$($Script:ProjectName).pages.dev）"

# ------------------------------------------------------------
# Step 5.5: 防御式兜底 — 确保 CF Pages 特有静态资源在 out/ 根目录
# （防止用户直接 next build 跳过 build.bat，导致 _headers/_redirects 缺失）
# ------------------------------------------------------------
Write-Step "5.5/7 兜底复制 CF Pages 静态资源到 out/ 根目录"
function Copy-IfExists([string]$src, [string]$dst) {
  if (Test-Path $src) {
    Copy-Item -Path $src -Destination $dst -Force
    Write-Ok "  copied $(Split-Path $src -Leaf)  ($((Get-Item $src).Length) bytes)"
  } else {
    Write-Warn "  skip (not found): $(Split-Path $src -Leaf)"
  }
}
function Copy-Glob([string]$pattern, [string]$srcDir, [string]$dstDir) {
  $files = Get-ChildItem -Path $srcDir -Filter $pattern -File -ErrorAction SilentlyContinue
  foreach ($f in $files) {
    Copy-Item -Path $f.FullName -Destination (Join-Path $dstDir $f.Name) -Force
    Write-Ok "  copied $($f.Name)  ($($f.Length) bytes)"
  }
  if (-not $files -or $files.Count -eq 0) {
    Write-Warn "  no matches for $pattern"
  }
}
$pub = Join-Path $ScriptDir "public"
if (Test-Path $outDir) {
  Copy-IfExists (Join-Path $pub "_headers")    (Join-Path $outDir "_headers")
  Copy-IfExists (Join-Path $pub "_redirects")  (Join-Path $outDir "_redirects")
  Copy-IfExists (Join-Path $pub "favicon.svg") (Join-Path $outDir "favicon.svg")
  Copy-IfExists (Join-Path $pub "favicon.svg") (Join-Path $outDir "favicon.ico")
  Copy-IfExists (Join-Path $pub "og-image.png")(Join-Path $outDir "og-image.png")
  Copy-IfExists (Join-Path $pub "robots.txt")  (Join-Path $outDir "robots.txt")
  Copy-IfExists (Join-Path $pub "sitemap.xml") (Join-Path $outDir "sitemap.xml")
  Copy-IfExists (Join-Path $pub "ads.txt")     (Join-Path $outDir "ads.txt")
  Copy-IfExists (Join-Path $pub "BingSiteAuth.xml") (Join-Path $outDir "BingSiteAuth.xml")
  # 复制所有 TXT / HTML / XML 验证文件（Google GSC、Yandex、IndexNow key 等）
  Copy-Glob "*.txt"  $pub $outDir
  Copy-Glob "*.html" $pub $outDir
  Copy-Glob "*.xml"  $pub $outDir
} else {
  Write-Warn "  out/ 目录不存在，跳过兜底复制（上传前会被检测拦截）"
}

# ------------------------------------------------------------
# Step 6: 上传部署
# ------------------------------------------------------------
Write-Step "6/7 上传 out/ 到 Cloudflare Pages（首次部署会自动创建新项目）"
Pause-User "确认现在开始上传部署？"

Write-Host "`n  正在执行: npx wrangler pages deploy out --project-name $($Script:ProjectName)" -ForegroundColor Gray
Write-Host "  首次上传文件较多（约 500~900 个），请耐心等待 2~10 分钟...`n" -ForegroundColor Gray

& npx.cmd --yes wrangler@latest pages deploy (Join-Path $ScriptDir "out") --project-name $Script:ProjectName

if ($LASTEXITCODE -ne 0) {
  Write-Fail "部署失败！"
  Write-Host "  常见原因：" -ForegroundColor Yellow
  Write-Host "   - 账户无 Pages 权限 → 换一个有 Pages:Edit 权限的 API Token/账号" -ForegroundColor Yellow
  Write-Host "   - 项目名已被别人占用 → 换一个项目名重试（例如 korelyy-toolhub-2026）" -ForegroundColor Yellow
  Write-Host "   - 网络问题 → 重新执行本脚本继续" -ForegroundColor Yellow
  exit 5
}

Write-Ok "部署上传完成！"

# ------------------------------------------------------------
# Step 7: 主动推 Bing/Yandex/IndexNow（触发即时爬取，不用等 Bing 自然爬）
# ------------------------------------------------------------
Write-Step "7/8 推送 8000+ URL 到 Bing / Yandex / IndexNow（加速收录）"
Write-Host "  调用 scripts/indexnow-push.mjs --apply，推送到 Bing + Yandex + IndexNow 联盟" -ForegroundColor Gray
Write-Host "  （若 key.txt 还未在线，Bing 会返回 403；等 DNS 生效后重新执行本步骤再推一次）`n" -ForegroundColor Gray

$indexnowExit = 0
try {
  & node (Join-Path $ScriptDir "scripts/indexnow-push.mjs") --apply
  $indexnowExit = $LASTEXITCODE
} catch {
  Write-Warning "  IndexNow 脚本执行异常: $($_.Exception.Message)"
  $indexnowExit = 99
}

if ($indexnowExit -eq 0) {
  Write-Ok "IndexNow 推送完成（Yandex 一般立即生效；Bing 需等 key.txt 在线成功后 24h 内抓取）"
} else {
  Write-Warning "IndexNow 推送返回非 0 (exit=$indexnowExit)。等部署生效后可手动执行:  node scripts/indexnow-push.mjs --apply"
}

# ------------------------------------------------------------
# Step 8: 收尾 & 后续步骤说明
# ------------------------------------------------------------
Write-Step "8/8 部署已提交 🎉"

Write-Host @"

===================================================================
  你的 Pages 临时访问地址:   https://$($Script:ProjectName).pages.dev
===================================================================

  🔒 你还需要在 Cloudflare 后台做 3 个小配置（安全 & 自定义域名）：

  ① 开启强制 HTTPS
     Cloudflare Dashboard → SSL/TLS → Edge Certificates
     → 打开 "Always Use HTTPS"
     → SSL/TLS encryption mode 选 "Full (strict)"

  ② 绑定你自己的域名 korelyy.com
     Pages 项目 → Custom domains → Set up a custom domain
     输入 www.korelyy.com → 按提示加 DNS CNAME 记录
     再添加一次根域 korelyy.com（Cloudflare 会自动配置）
     等待几分钟 SSL 证书签发 → 状态变 Active 就完成了

  ③ Headers 已通过 public/_headers 自动生效 ✅（无需手动填 CSP）

  📌 想再次部署？直接再次运行本脚本：  .\cf-deploy.ps1

===================================================================
"@ -ForegroundColor DarkCyan
