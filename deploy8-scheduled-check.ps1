param(
  [int]$DelaySec = 900,
  [string]$OutputFile = "deploy8-check-01.txt",
  [string]$LogFile = "deploy8-build+deploy.log",
  [string]$InfoFile = "deploy8-jobinfo.txt"
)

$ErrorActionPreference = "Continue"
$startAt = Get-Date
$wakeAt = $startAt.AddSeconds($DelaySec)

$banner = @"
============================================================
Korelyy Deploy #8 定时检查 #1
  Scheduled at : $($startAt.ToString('yyyy-MM-dd HH:mm:ss'))
  Wake up at   : $($wakeAt.ToString('yyyy-MM-dd HH:mm:ss'))
  Delay        : $DelaySec sec (15 min)
  Log file     : $LogFile
  Output       : $OutputFile
============================================================
"@
Write-Host $banner -ForegroundColor Cyan
$banner | Out-File -FilePath $OutputFile -Encoding UTF8

Start-Sleep -Seconds $DelaySec

$now = Get-Date
$body = @"

[$($now.ToString('yyyy-MM-dd HH:mm:ss'))] 15分钟定时检查触发！
"@
Write-Host $body -ForegroundColor Green
$body | Out-File -FilePath $OutputFile -Append -Encoding UTF8

if (Test-Path $InfoFile) {
  $infoBody = @"

[INFO FILE: $InfoFile]
$(Get-Content $InfoFile -Raw)
"@
  Write-Host $infoBody
  $infoBody | Out-File -FilePath $OutputFile -Append -Encoding UTF8
}

if (-not (Test-Path $LogFile)) {
  $m = "  Log file [$LogFile] NOT FOUND — deploy process may not have started."
  Write-Host $m -ForegroundColor Red
  $m | Out-File -FilePath $OutputFile -Append -Encoding UTF8
  exit 0
}

$f = Get-Item $LogFile
$head = @"

[LOG: $LogFile]
  SIZE        = $($f.Length) bytes
  LAST_WRITE  = $($f.LastWriteTime)
"@
Write-Host $head -ForegroundColor Yellow
$head | Out-File -FilePath $OutputFile -Append -Encoding UTF8

$lines = @(Get-Content $LogFile)
$total = $lines.Count
$lc = "  TOTAL_LINES = $total"
Write-Host $lc
$lc | Out-File -FilePath $OutputFile -Append -Encoding UTF8

$sep = "`n--- LAST 35 LINES ---"
Write-Host $sep -ForegroundColor Green
$sep | Out-File -FilePath $OutputFile -Append -Encoding UTF8
$tail = $lines | Select-Object -Last 35
$tail | ForEach-Object {
  Write-Host "  | $_"
  "  | $_" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
}
$endSep = "--- END OF TAIL ---"
Write-Host $endSep -ForegroundColor Green
$endSep | Out-File -FilePath $OutputFile -Append -Encoding UTF8

$txt = $lines -join "`n"
$stage = "`n[STAGE DETECTION]"
Write-Host $stage -ForegroundColor Green
$stage | Out-File -FilePath $OutputFile -Append -Encoding UTF8

function Add-Stage([string]$msg) {
  Write-Host "  $msg"
  "  $msg" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
}

if ($txt -match '清理旧 out') { Add-Stage "[1/6 CLEANUP] ✅ out/ cleanup DONE" }
if ($txt -match 'Patch Wrangler BULK_UPLOAD_CONCURRENCY2') { Add-Stage "[2/6 PATCH 1] ✅ wrangler pre-patch DONE" }
if ($txt -match 'Next\.js 生产构建|pnpm run build') { Add-Stage "[3/6 BUILD]   ⏳ Next.js build in progress" }
if ($txt -match '构建 exit=0') { Add-Stage "[3/6 BUILD]   ✅ Next.js build SUCCESS exit=0" }
if ($txt -match '构建 exit=([1-9][0-9]*)') { Add-Stage "[3/6 BUILD]   ❌ FAILED exit=$($Matches[1]) — CHECK LOG" }
if ($txt -match '部署前再次 Patch') { Add-Stage "[4/6 PATCH 2] ✅ pre-deploy wrangler patch DONE" }
if ($txt -match 'Pages 部署|pnpm\.cmd run deploy') { Add-Stage "[5/6 DEPLOY]  ⏳ Pages upload in progress (20-40 min)" }
if ($txt -match 'Deployment complete!|Built at:') { Add-Stage "[5/6 DEPLOY]  🎉 Deployment build uploaded" }
if ($txt -match 'deploy_exit=0') { Add-Stage "[6/6 DONE]    🎉✅ ALL DONE! deploy_exit=0" }
if ($txt -match 'deploy_exit=([1-9][0-9]*)') { Add-Stage "[5/6 DEPLOY]  ❌ FAILED deploy_exit=$($Matches[1])" }

$done = @"

============================================================
定时检查 #1 完成 [$($now.ToString('yyyy-MM-dd HH:mm:ss'))]
完整报告已保存到: $((Resolve-Path $OutputFile).Path)
如需再次查看: Get-Content $OutputFile
============================================================
"@
Write-Host $done -ForegroundColor Cyan
$done | Out-File -FilePath $OutputFile -Append -Encoding UTF8
