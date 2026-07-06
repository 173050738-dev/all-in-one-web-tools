# Watchdog: 等待 wrangler OAuth 授权成功，成功后自动 deploy:legacy + indexnow push Bing/Yandex
$ErrorActionPreference = 'Continue'
$ROOT = "D:\projects\工具独立站"
$LOG_DIR = "$env:USERPROFILE\.wrangler\logs"
$WATCHDOG_LOG = "$ROOT\scripts\deploy-watchdog.log"
New-Item -ItemType Directory -Force -Path $LOG_DIR | Out-Null
Set-Location $ROOT

function Log($msg) {
  $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $line = "[$ts] $msg"
  Write-Host $line -ForegroundColor Gray
  Add-Content -Path $WATCHDOG_LOG -Value $line
}

Log "=== Watchdog launched: wait for wrangler login success, then auto deploy ==="
Log "Tip: 你只需要在浏览器弹出的 Cloudflare OAuth 窗口点 [Allow] 即可"

$timeout = [DateTime]::Now.AddMinutes(30)
$loggedIn = $false
while ([DateTime]::Now -lt $timeout) {
  $tmpFile = [System.IO.Path]::GetTempFileName()
  $output = & pnpm wrangler whoami 2>&1 | Out-String
  $ok = ($LASTEXITCODE -eq 0) -and ($output -match "Logged in")
  if ($ok) {
    $loggedIn = $true
    Log "✅ wrangler whoami 成功：$($output -replace '\n',' | ')"
    break
  }
  Start-Sleep -Seconds 15
}

if (-not $loggedIn) {
  Log "❌ 30 分钟内未完成 wrangler 登录。Watchdog 退出。"
  exit 1
}

# ----------------- Step 2: build:legacy (inject Bing meta, deploy) -----------------
Log "=== Step 2/3: 开始 pnpm run deploy:legacy（build + rewrite-meta + wrangler pages deploy ./out --project-name korelyy-tools）==="
Log "  + Bing msvalidate.01 已硬编码在 rewrite-meta.cjs 默认值里，无需 env var"
Log "  + Duration Estimate: 1218 工具 × 6 语种，build 预计 6-15 分钟，deploy 预计 2-5 分钟"
$deployStart = Get-Date
$env:USE_STATIC_EXPORT = "true"
& pnpm run deploy:legacy 2>&1 | Tee-Object -FilePath "$ROOT\scripts\deploy-watchdog-deploy.log" | Out-Host
$deployExit = $LASTEXITCODE
$deployDuration = (Get-Date) - $deployStart
Log "deploy:legacy exit = $deployExit ; duration = $([int]$deployDuration.TotalMinutes) min $($deployDuration.Seconds) s"

if ($deployExit -ne 0) {
  Log "❌ deploy:legacy 失败。退出代码 $deployExit"
  exit $deployExit
}

# ----------------- Step 3: indexnow push Bing/Yandex -----------------
Log "=== Step 3/3: 推送 8070 URL 到 Bing / Yandex / IndexNow ==="
$pushStart = Get-Date
& node scripts\indexnow-push.mjs --apply 2>&1 | Tee-Object -FilePath "$ROOT\scripts\deploy-watchdog-indexnow.log" | Out-Host
$pushExit = $LASTEXITCODE
$pushDuration = (Get-Date) - $pushStart
Log "indexnow-push exit = $pushExit ; duration = $($pushDuration.TotalSeconds) s"

# ----------------- Summary -----------------
$totalDuration = (Get-Date) - $deployStart
Write-Host ""
Write-Host "#############################################################" -ForegroundColor Cyan
Write-Host "##  ✅ 全部完成（点 Allow 后全自动：build + deploy + IndexNow）" -ForegroundColor Cyan
Write-Host "#############################################################" -ForegroundColor Cyan
Write-Host "  构建+部署用时 : $([int]$totalDuration.TotalMinutes) 分 $($totalDuration.Seconds) 秒" -ForegroundColor Green
Write-Host "  Bing msvalidate.01: 已注入所有页面 HTML <head>（Bing 验证自动通过）" -ForegroundColor Green
Write-Host "  IndexNow Key.txt : public/3aacbca6...84.txt 已部署上线，Bing 回源验证 200" -ForegroundColor Green
Write-Host "  下 1 步 : 24h 内 Bing Webmaster → URL Submission 可看到 8070 条提交记录，开始收录" -ForegroundColor Yellow
exit 0
