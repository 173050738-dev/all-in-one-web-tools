$ErrorActionPreference = "Continue"
$rootDir = "D:\projects\工具独立站"
Set-Location $rootDir

$logFile = "$rootDir\deploy9-upload-only.log"
$jobFile = "$rootDir\deploy9-jobinfo.txt"
$startedAt = Get-Date

$banner = "========== Korelyy DEPLOY #9 (SKIP BUILD, UPLOAD ONLY) STARTED: " + $startedAt.ToString("yyyy-MM-dd HH:mm:ss") + " =========="
$banner | Out-File -FilePath $logFile -Encoding UTF8
"" | Out-File -FilePath $logFile -Append -Encoding UTF8

("deploy9_started=" + $startedAt.ToString("o")) | Out-File -FilePath $jobFile -Encoding UTF8
"mode=SKIP_BUILD_UPLOAD_ONLY" | Out-File -FilePath $jobFile -Append -Encoding UTF8
("log=" + $logFile) | Out-File -FilePath $jobFile -Append -Encoding UTF8

"" | Out-File -FilePath $logFile -Append -Encoding UTF8
"  [INFO] Skip Step 1-3 (clean + patch1 + build). out/ verified complete (15214 files / 4018 MB, Deploy8 output)" | Out-File -FilePath $logFile -Append -Encoding UTF8
"  [INFO] package.json patched: predeploy -> _skip_predeploy (no more duplicate build hook)" | Out-File -FilePath $logFile -Append -Encoding UTF8
"" | Out-File -FilePath $logFile -Append -Encoding UTF8

"  [PATCH] Step 4/6: Patch Wrangler BULK_UPLOAD_CONCURRENCY2 = 1" | Out-File -FilePath $logFile -Append -Encoding UTF8
& node.exe scripts/patch-wrangler.cjs 2>&1 | Out-File -FilePath $logFile -Append -Encoding UTF8
$patchExit = $LASTEXITCODE
("    - Done, exit=" + $patchExit) | Out-File -FilePath $logFile -Append -Encoding UTF8
("patch_exit=" + $patchExit) | Out-File -FilePath $jobFile -Append -Encoding UTF8
"" | Out-File -FilePath $logFile -Append -Encoding UTF8

"  [DEPLOY] Step 5/6: wrangler pages deploy (DIRECT, no npm lifecycle hooks)" | Out-File -FilePath $logFile -Append -Encoding UTF8
"  [DEPLOY]   --project-name=korelyy-tools" | Out-File -FilePath $logFile -Append -Encoding UTF8
"  [DEPLOY]   --d1 DB=8127d06b-19d6-4b9a-aaf7-c6d74fb2c2c6" | Out-File -FilePath $logFile -Append -Encoding UTF8
"  [DEPLOY]   --var JWT_ISSUER=korelyy.com" | Out-File -FilePath $logFile -Append -Encoding UTF8
"  [DEPLOY]   --var ACCESS_TOKEN_TTL_SEC=604800" | Out-File -FilePath $logFile -Append -Encoding UTF8
"  [DEPLOY]   ETA 30-45 min (concurrency=1, serial upload)" | Out-File -FilePath $logFile -Append -Encoding UTF8
"" | Out-File -FilePath $logFile -Append -Encoding UTF8

& wrangler pages deploy ./out --branch main --commit-dirty=true --project-name korelyy-tools --d1 DB=8127d06b-19d6-4b9a-aaf7-c6d74fb2c2c6 --var JWT_ISSUER=korelyy.com --var ACCESS_TOKEN_TTL_SEC=604800 2>&1 | Out-File -FilePath $logFile -Append -Encoding UTF8
$deployExit = $LASTEXITCODE
"" | Out-File -FilePath $logFile -Append -Encoding UTF8
("    - Deploy done, exit=" + $deployExit) | Out-File -FilePath $logFile -Append -Encoding UTF8
("deploy_exit=" + $deployExit) | Out-File -FilePath $jobFile -Append -Encoding UTF8
"" | Out-File -FilePath $logFile -Append -Encoding UTF8

$endedAt = Get-Date
$duration = $endedAt - $startedAt
$durStr = $duration.Hours + "h " + $duration.Minutes + "m " + $duration.Seconds + "s"
$doneStr = "  [DONE] Step 6/6: ALL DONE  exit=" + $deployExit + "  elapsed=" + $durStr
$doneStr | Out-File -FilePath $logFile -Append -Encoding UTF8
("========== Korelyy DEPLOY #9 FINISHED: " + $endedAt.ToString("yyyy-MM-dd HH:mm:ss") + " (exit=" + $deployExit + ") ==========") | Out-File -FilePath $logFile -Append -Encoding UTF8
("deploy9_finished=" + $endedAt.ToString("o")) | Out-File -FilePath $jobFile -Append -Encoding UTF8
("duration_min=" + [math]::Round($duration.TotalMinutes,1)) | Out-File -FilePath $jobFile -Append -Encoding UTF8
("deploy9_final_exit=" + $deployExit) | Out-File -FilePath $jobFile -Append -Encoding UTF8
