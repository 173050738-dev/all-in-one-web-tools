param(
  [switch]$Full,
  [switch]$PurgeDeps,
  [switch]$WhatIf
)

$ErrorActionPreference = "Continue"
$ROOT = Split-Path -Parent $PSScriptRoot

function Remove-Permanent {
  param(
    [string]$RelativePath,
    [string]$Label = "Item",
    [bool]$IsDirectory = $true
  )
  $target = Join-Path $ROOT $RelativePath
  if (-not (Test-Path $target)) {
    Write-Host ("  [SKIP]  {0,-45} not found" -f $Label) -ForegroundColor DarkGray
    return 0
  }
  try {
    $item = Get-Item $target -Force -ErrorAction Stop
    $sizeBytes = if ($IsDirectory) {
      (Get-ChildItem $target -Recurse -Force -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
    } else { $item.Length }
    $sizeMB = [math]::Round($sizeBytes / 1MB, 2)

    if ($WhatIf) {
      Write-Host ("  [WHATIF] {0,-45} would be deleted ({1} MB)" -f $Label, $sizeMB) -ForegroundColor Cyan
      return $sizeBytes
    }

    if ($IsDirectory) {
      Remove-Item $target -Recurse -Force -ErrorAction Stop
    } else {
      Remove-Item $target -Force -ErrorAction Stop
    }
    Write-Host ("  [OK]     {0,-45} permanently deleted ({1} MB)" -f $Label, $sizeMB) -ForegroundColor Green
    return $sizeBytes
  }
  catch {
    Write-Host ("  [FAIL]   {0,-45} {1}" -f $Label, $_.Exception.Message) -ForegroundColor Red
    return 0
  }
}

function Remove-Wildcard {
  param(
    [string]$Pattern,
    [string]$Label
  )
  $items = @(Get-ChildItem -Path $ROOT -Filter $Pattern -Force -ErrorAction SilentlyContinue)
  if (-not $items -or $items.Count -eq 0) {
    Write-Host ("  [SKIP]  {0,-45} no matches" -f $Label) -ForegroundColor DarkGray
    return 0
  }
  $total = 0
  foreach ($item in $items) {
    $total += Remove-Permanent -RelativePath $item.Name -Label ("    " + $item.Name) -IsDirectory ($item.PSIsContainer)
  }
  if ($items.Count -gt 1) {
    Write-Host ("  -> {0}: {1} items, saved {2} MB" -f $Label, $items.Count, [math]::Round($total/1MB,2)) -ForegroundColor DarkGreen
  }
  return $total
}

$Banner = @"

====================================================
  Project Cleanup  (PERMANENT DELETE, NO RECYCLE BIN)
  Root: $ROOT
====================================================
"@
Write-Host $Banner -ForegroundColor Blue

if ($WhatIf) {
  Write-Host "`n[WHAT IF MODE] Nothing will actually be deleted. Just preview.`n" -ForegroundColor Cyan
}

# ======================================================
# Level 1  Cache (default) - Safe to delete anytime
# ======================================================
Write-Host "`n[1/3] Cleaning build cache (default level)...`n" -ForegroundColor Yellow
$saved = 0
$saved += Remove-Permanent ".next"                          "Next.js cache (.next)"
$saved += Remove-Permanent "out"                            "Static export (out)"
$saved += Remove-Permanent ".turbo"                         "Turbopack cache (.turbo)"
$saved += Remove-Permanent "tsconfig.tsbuildinfo"           "TS incremental cache" $false
$saved += Remove-Wildcard  "build_run_*.log"                "Build logs (build_run_*.log)"
$saved += Remove-Wildcard  "build_run_*.log.err"            "Build error logs"
$saved += Remove-Wildcard  "fix_*.js"                       "One-off fix scripts (fix_*.js)"
$saved += Remove-Wildcard  "*.log"                          "Root-level log files (*.log)"
$saved += Remove-Wildcard  "sitemap.xml.bak"                "sitemap backup" $false
Write-Host ("`n  [OK] Default level finished. Total saved: {0} MB`n" -f [math]::Round($saved/1MB,2)) -ForegroundColor Green

# ======================================================
# Level 2  Full (-Full) - Backups & historical outputs
# ======================================================
if ($Full) {
  Write-Host "[2/3] Cleaning backups & old outputs (-Full level)...`n" -ForegroundColor Yellow
  $savedFull = 0
  $savedFull += Remove-Permanent "_BACKUPS"                  "Project snapshot backups (_BACKUPS)"
  $savedFull += Remove-Permanent "out_old_bak"               "Old static export (out_old_bak)"
  $savedFull += Remove-Wildcard  "*.bak"                     "Misc *.bak files"
  $savedFull += Remove-Wildcard  "_OLD_*"                    "_OLD_* backup dirs"
  Write-Host ("`n  [OK] Full level finished. Extra saved: {0} MB`n" -f [math]::Round($savedFull/1MB,2)) -ForegroundColor Green
  $saved += $savedFull
} else {
  Write-Host "`n[2/3] Skipping Full level (no -Full flag: keeping _BACKUPS / out_old_bak)`n" -ForegroundColor DarkGray
}

# ======================================================
# Level 3  PurgeDeps (-PurgeDeps) - Also remove node_modules (REQUIRES REINSTALL)
# ======================================================
if ($PurgeDeps) {
  Write-Host "[3/3] Purging dependencies (-PurgeDeps level, reinstall required)...`n" -ForegroundColor Yellow
  $savedDeps = 0
  $savedDeps += Remove-Permanent "node_modules"              "Dependencies (node_modules)"
  Write-Host "`n  [WARNING] node_modules removed. You MUST run 'pnpm install' before dev/build!" -ForegroundColor Red
  Write-Host ("`n  [OK] PurgeDeps level finished. Extra saved: {0} MB`n" -f [math]::Round($savedDeps/1MB,2)) -ForegroundColor Green
  $saved += $savedDeps
} else {
  Write-Host "`n[3/3] Skipping PurgeDeps level (no -PurgeDeps flag: keeping node_modules)`n" -ForegroundColor DarkGray
}

$finalGB = [math]::Round($saved / 1GB, 3)
$finalMB = [math]::Round($saved / 1MB, 2)
Write-Host "==============================================================" -ForegroundColor Blue
if ($WhatIf) {
  Write-Host (" WHATIF complete. Estimated total recoverable space: {0} MB  ({1} GB)" -f $finalMB, $finalGB) -ForegroundColor Cyan
} else {
  Write-Host (" All done. Total permanently freed space: {0} MB  ({1} GB)" -f $finalMB, $finalGB) -ForegroundColor Green
}
Write-Host "==============================================================" -ForegroundColor Blue
Write-Host "`nUsage examples:" -ForegroundColor Yellow
Write-Host "  Safe default:  pnpm clean:cache           (or & .\scripts\cleanup.ps1)"
Write-Host "  Preview only:   pnpm clean:preview         (or -WhatIf, no real deletion)"
Write-Host "  Include backup: pnpm clean:full            (+ delete _BACKUPS/out_old_bak)"
Write-Host "  Nuke & reset:   pnpm clean:purge           (+ remove node_modules, reinstall needed)`n"
