param(
  [int]$DelaySec = 1800,
  [string]$OutputFile = "deploy9-check-01.txt",
  [string]$LogFile = "deploy9-upload-only.log",
  [string]$InfoFile = "deploy9-jobinfo.txt"
)
$ErrorActionPreference = "Continue"
$root = "D:\projects\工具独立站"
Set-Location $root
$OutputFile = Join-Path $root $OutputFile
$LogFile = Join-Path $root $LogFile
$InfoFile = Join-Path $root $InfoFile
$startAt = Get-Date
$wakeAt = $startAt.AddSeconds($DelaySec)
$banner = "============================================================"
$banner | Out-File -FilePath $OutputFile -Encoding UTF8
("Korelyy Deploy #9 Scheduled Check #1 (SKIP BUILD, UPLOAD ONLY)") | Out-File -FilePath $OutputFile -Append -Encoding UTF8
("Scheduled at : " + $startAt.ToString("yyyy-MM-dd HH:mm:ss")) | Out-File -FilePath $OutputFile -Append -Encoding UTF8
("Wake up at   : " + $wakeAt.ToString("yyyy-MM-dd HH:mm:ss")) | Out-File -FilePath $OutputFile -Append -Encoding UTF8
("Delay        : " + $DelaySec + " sec (30 min)") | Out-File -FilePath $OutputFile -Append -Encoding UTF8
("Log file     : " + $LogFile) | Out-File -FilePath $OutputFile -Append -Encoding UTF8
("Output       : " + $OutputFile) | Out-File -FilePath $OutputFile -Append -Encoding UTF8
$banner | Out-File -FilePath $OutputFile -Append -Encoding UTF8
Start-Sleep -Seconds $DelaySec
$now2 = Get-Date
$body = "`n[" + $now2.ToString("yyyy-MM-dd HH:mm:ss") + "] 30-minute scheduled check triggered!`n"
$body | Out-File -FilePath $OutputFile -Append -Encoding UTF8
if (Test-Path $InfoFile) {
  ("`n[INFO FILE: " + $InfoFile + "]") | Out-File -FilePath $OutputFile -Append -Encoding UTF8
  Get-Content $InfoFile | ForEach-Object { $_ | Out-File -FilePath $OutputFile -Append -Encoding UTF8 }
  "" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
}
if (-not (Test-Path $LogFile)) {
  "  Log file not yet created." | Out-File -FilePath $OutputFile -Append -Encoding UTF8
  exit 0
}
$f = Get-Item $LogFile
("`n[LOG: " + $LogFile + "]") | Out-File -FilePath $OutputFile -Append -Encoding UTF8
("  SIZE = " + $f.Length + " bytes") | Out-File -FilePath $OutputFile -Append -Encoding UTF8
("  LAST_WRITE = " + $f.LastWriteTime) | Out-File -FilePath $OutputFile -Append -Encoding UTF8
$lines = @(Get-Content $LogFile)
("  TOTAL_LINES = " + $lines.Count) | Out-File -FilePath $OutputFile -Append -Encoding UTF8
"`n--- LAST 40 LINES ---" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
$lines | Select-Object -Last 40 | ForEach-Object { ("  | " + $_) | Out-File -FilePath $OutputFile -Append -Encoding UTF8 }
"--- END ---" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
$txt = $lines -join "`n"
"`n[STAGE DETECTION]" | Out-File -FilePath $OutputFile -Append -Encoding UTF8
function Add-Stage([string]$msg){ ("  " + $msg) | Out-File -FilePath $OutputFile -Append -Encoding UTF8 }
if ($txt -match "Step 4/6: Patch Wrangler") { Add-Stage "[4/6 PATCH 2] ✅ pre-deploy wrangler patch DONE" }
if ($txt -match "wrangler pages deploy") { Add-Stage "[5/6 DEPLOY]  ⏳ Pages upload in progress (30-45 min)" }
if ($txt -match "Deployment complete!|Built at:|Uploaded|Your site has been deployed") { Add-Stage "[5/6 DEPLOY]  🎉 Deployment build uploaded" }
if ($txt -match "deploy_exit=0") { Add-Stage "[6/6 DONE]    🎉✅ ALL DONE! deploy_exit=0" }
if ($txt -match "deploy_exit=([1-9][0-9]*)") { Add-Stage "[5/6 DEPLOY]  ❌ FAILED deploy_exit=" + $Matches[1] }
$banner | Out-File -FilePath $OutputFile -Append -Encoding UTF8
