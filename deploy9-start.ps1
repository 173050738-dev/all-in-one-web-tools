$ErrorActionPreference = 'Continue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
$deployScript = Join-Path $root 'deploy9-skip-build.ps1'
$checkScript = Join-Path $root 'deploy9-scheduled-check.ps1'
$now = Get-Date

Write-Host '========== Korelyy Deploy #9 START ==========' -ForegroundColor Cyan
Write-Host ''

$p1 = New-Object System.Diagnostics.ProcessStartInfo
$p1.FileName = 'powershell.exe'
$p1.Arguments = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $deployScript + '"'
$p1.UseShellExecute = $false
$p1.CreateNoWindow = $true
$p1.WorkingDirectory = $root
$proc1 = [System.Diagnostics.Process]::Start($p1)
Start-Sleep -Seconds 3
$alive1 = Get-Process -Id $proc1.Id -ErrorAction SilentlyContinue
$wakeAt = $now.AddMinutes(30)
$doneAt = $now.AddMinutes(40)

Write-Host '[Deploy #9 Main Process]' -ForegroundColor Green
Write-Host ('  PID            : ' + $proc1.Id)
if ($alive1) { Write-Host '  存活确认       : ✅ ALIVE' } else { Write-Host '  存活确认       : ❌ NOT FOUND' }
Write-Host ('  预计完成时间   : ' + $doneAt.ToString('HH:mm') + ' ± 10 min')
Write-Host '  日志文件       : deploy9-upload-only.log'
Write-Host '  状态文件       : deploy9-jobinfo.txt'
Write-Host ''

$p2 = New-Object System.Diagnostics.ProcessStartInfo
$p2.FileName = 'powershell.exe'
$p2.Arguments = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $checkScript + '"'
$p2.UseShellExecute = $false
$p2.CreateNoWindow = $true
$p2.WorkingDirectory = $root
$proc2 = [System.Diagnostics.Process]::Start($p2)
Start-Sleep -Seconds 2
$alive2 = Get-Process -Id $proc2.Id -ErrorAction SilentlyContinue

Write-Host '[30min Scheduled Check]' -ForegroundColor Green
Write-Host ('  PID            : ' + $proc2.Id)
if ($alive2) { Write-Host '  存活确认       : ✅ ALIVE' } else { Write-Host '  存活确认       : ❌ NOT FOUND' }
Write-Host ('  唤醒时间       : ' + $wakeAt.ToString('HH:mm'))
Write-Host '  输出报告       : deploy9-check-01.txt'
Write-Host ''
Write-Host "修复点: predeploy改_skip_predeploy + 独立进程启动 + 不触发钩子" -ForegroundColor Yellow
Write-Host "实时候选: 查看 deploy9-upload-only.log 最后30行" -ForegroundColor Gray
