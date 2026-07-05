$ErrorActionPreference = 'Stop'
$root = Get-Location
$outDir = Join-Path $root 'out'
$mwPath = Join-Path $root 'middleware.ts'
$mwBak = Join-Path $root 'middleware.ts.bak_deploy'

# 1) Remove out/
Write-Host '[1/5] Remove out/ ...'
if (Test-Path -LiteralPath $outDir) {
  Remove-Item -LiteralPath $outDir -Recurse -Force -ErrorAction Stop
  Write-Host '  done (deleted out/)'
} else {
  Write-Host '  out/ not found (skip)'
}

# 2) Backup middleware.ts
Write-Host '[2/5] Backup middleware.ts ...'
if (Test-Path -LiteralPath $mwPath) {
  if (Test-Path -LiteralPath $mwBak) { Remove-Item -LiteralPath $mwBak -Force -ErrorAction SilentlyContinue }
  Move-Item -LiteralPath $mwPath -Destination $mwBak -Force
  Write-Host '  done (bak = middleware.ts.bak_deploy)'
} else {
  Write-Host '  skip (no middleware.ts)'
}

# 3) Build
Write-Host '[3/5] npm run build ...'
Set-Location -LiteralPath $root
& npm run build
$buildEc = $LASTEXITCODE

# 4) Always restore middleware
Write-Host ''
Write-Host '[4/5] Restore middleware.ts ...'
if (Test-Path -LiteralPath $mwBak) {
  Move-Item -LiteralPath $mwBak -Destination $mwPath -Force -ErrorAction SilentlyContinue
  Write-Host '  done (restored middleware.ts)'
}

if ($buildEc -ne 0) {
  Write-Host "BUILD FAILED (exit $buildEc)"
  exit $buildEc
}

# 5) Verify out/
Write-Host ''
Write-Host '[5/5] Verify new out/ ...'
$ads = Join-Path $outDir 'ads.txt'
$adsExists = Test-Path -LiteralPath $ads
$adsSize = 0
if ($adsExists) { $adsSize = (Get-Item -LiteralPath $ads).Length }
Write-Host "  out/ads.txt exists? $adsExists size=$adsSize B"

$files = Get-ChildItem -LiteralPath $outDir -Recurse -File -ErrorAction SilentlyContinue
$compareChunks = @()
foreach ($f in $files) {
  if ($f.FullName -match 'compare') { $compareChunks += $f }
}
Write-Host "  compare-related files in out/ = $($compareChunks.Count)"
if ($compareChunks.Count -gt 0) {
  Write-Host '  (showing first 10):'
  $compareChunks | Select-Object -First 10 | ForEach-Object { Write-Host ('    ' + $_.FullName.Substring($outDir.Length + 1)) }
}

$buildIdDirs = Get-ChildItem -LiteralPath (Join-Path $outDir '_next\static') -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -notin @('css','chunks','media') }
Write-Host "  buildId dirs in static/ = $($buildIdDirs.Count)"
foreach ($d in $buildIdDirs) { Write-Host ('    buildId: ' + $d.Name) }
exit 0
