# ⚡ Korelyy Tools One-Click Deploy Script
# Usage (Windows):
#   1) Right-click this file → "Run with PowerShell"
#      OR: Open a PowerShell window in project root → .\deploy-oneclick.ps1
#
# Flow:
#   A. Pre-flight checks: node/pnpm/out dir / ads.txt / wrangler in PATH / logs dir
#   B. [NEW] Patch Wrangler BULK_UPLOAD_CONCURRENCY2 = 1 (fix Gateway Timeout {} on 16k+ files)
#      -> Script: node scripts/patch-wrangler.cjs
#   C. Launch `wrangler login` → opens default browser to Cloudflare OAuth page
#      -> Click "Authorize Wrangler" in the browser tab that opens
#   D. Browser OAuth callback will save new refreshed token to default.toml
#   E. Auto-run `wrangler pages deploy ./out --branch main --project-name korelyy-tools`
#   F. Verify https://korelyy.com/ads.txt is 200 with correct contents

$ErrorActionPreference = 'Stop'
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $PROJECT_ROOT

Write-Host ""
Write-Host "===================================================================="
Write-Host "  Korelyy Tools — One-Click Cloudflare Deploy"
Write-Host "===================================================================="
Write-Host ""
Write-Host "Target        : https://korelyy.com  (Cloudflare Pages)"
Write-Host "Project name  : korelyy-tools"
Write-Host "Branch        : main"
Write-Host "Source dir    : .\out  (pre-built Next.js static export, includes ads.txt)"
Write-Host "Patch step    : BULK_UPLOAD_CONCURRENCY2=1  (fix Cloudflare API Gateway Timeout)"
Write-Host ""

# ------------------------------------------------------------
# Pre-flight
# ------------------------------------------------------------
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "PRE-FLIGHT: node.exe not in PATH. Install Node.js 20+."
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Host "[WARN] pnpm not in PATH, trying npm install commands instead"
}
if (-not (Test-Path -LiteralPath '.\out')) {
  throw "PRE-FLIGHT: .\out directory not found. Run `pnpm run build` first."
}
$ads = Join-Path $PROJECT_ROOT 'out\ads.txt'
if (-not (Test-Path -LiteralPath $ads)) {
  throw "PRE-FLIGHT: out\ads.txt missing. Run build + post-build scripts (auto-invoked by pnpm run build)."
}
$adsSize = (Get-Item -LiteralPath $ads).Length
Write-Host "[OK]  out\ads.txt present ($adsSize bytes)"
$wr = Get-Command wrangler -ErrorAction SilentlyContinue
if (-not $wr) {
  throw "PRE-FLIGHT: wrangler not in PATH. Run `pnpm add -g wrangler` or `npm i -g wrangler`."
}
Write-Host "[OK]  wrangler CLI found: $($wr.Source)"

# Ensure wrangler logs dir exists (wrangler 4.x Windows ENOENT workaround)
$wrLogDir = Join-Path $env:APPDATA 'xdg.config\.wrangler\logs'
if (-not (Test-Path -LiteralPath $wrLogDir)) {
  New-Item -ItemType Directory -Force -Path $wrLogDir | Out-Null
  Write-Host "[OK]  created wrangler logs dir: $wrLogDir"
} else {
  Write-Host "[OK]  wrangler logs dir exists: $wrLogDir"
}

# ------------------------------------------------------------
# Step 0 — Patch Wrangler BULK_UPLOAD_CONCURRENCY2 = 1 (CRITICAL)
# ------------------------------------------------------------
Write-Host ""
Write-Host "--------------------------------------------------------------------"
Write-Host "  STEP 0/3 — Patching Wrangler BULK_UPLOAD_CONCURRENCY2 = 1"
Write-Host "--------------------------------------------------------------------"
Write-Host " > Why: default value 3 causes Cloudflare API Gateway Timeout {}"
Write-Host "        when uploading 16000+ files. Must be 1 for large deployments."
Write-Host ""
$patchScript = Join-Path $PROJECT_ROOT 'scripts\patch-wrangler.cjs'
if (-not (Test-Path -LiteralPath $patchScript)) {
  throw "PRE-FLIGHT: scripts\patch-wrangler.cjs missing. Patch script required."
}
& node $patchScript
$patchExit = $LASTEXITCODE
if ($patchExit -ne 0) {
  throw "WRANGLER PATCH FAILED (exit code $patchExit). Gateway Timeout likely to occur without patch."
}

# ------------------------------------------------------------
# Step 1 — OAuth login via wrangler login (browser flow)
# ------------------------------------------------------------
Write-Host ""
Write-Host "--------------------------------------------------------------------"
Write-Host "  STEP 1/3 — Running  wrangler login   (Cloudflare OAuth)"
Write-Host "--------------------------------------------------------------------"
Write-Host " > Your default browser will open the Cloudflare authorization page."
Write-Host " > Click  [Authorize Wrangler]   on that page."
Write-Host " > Once you see 'You have successfully logged in' you can close the tab."
Write-Host " > This script will continue automatically when wrangler login exits."
Write-Host ""
Read-Host "Press ENTER to open Cloudflare OAuth in your browser and start"

& wrangler login
$loginCode = $LASTEXITCODE
if ($loginCode -ne 0) {
  Write-Warning "wrangler login exited with code $loginCode (may already be logged in; continuing)"
}

# Show refreshed token info
try {
  $tomlPath = Join-Path $env:APPDATA 'xdg.config\.wrangler\config\default.toml'
  if (Test-Path -LiteralPath $tomlPath) {
    $toml = Get-Content -LiteralPath $tomlPath -Raw
    $exp = [regex]::Match($toml, 'expiration_time\s*=\s*"([^"]+)"')
    $tok = [regex]::Match($toml, 'oauth_token\s*=\s*"([^"]+)"')
    if ($exp.Success) { Write-Host "[auth] token expiration = $($exp.Groups[1].Value)" }
    if ($tok.Success) { Write-Host "[auth] token prefix    = $($tok.Groups[1].Value.Substring(0,8))..." }
  }
} catch {}

# ------------------------------------------------------------
# Step 2 — Deploy
# ------------------------------------------------------------
Write-Host ""
Write-Host "--------------------------------------------------------------------"
Write-Host "  STEP 2/3 — Running  wrangler pages deploy ./out"
Write-Host "--------------------------------------------------------------------"
Write-Host ""

$outFull = (Resolve-Path '.\out').Path
& wrangler pages deploy $outFull --branch main --project-name korelyy-tools --commit-dirty=true
$deployCode = $LASTEXITCODE

if ($deployCode -ne 0) {
  Write-Host ""
  throw "DEPLOY FAILED (wrangler exit code $deployCode). See output above — common causes: not logged in, token missing pages:write scope, account suspended."
}

Write-Host ""
Write-Host "===================================================================="
Write-Host "  ✅ wrangler reports deploy success"
Write-Host "===================================================================="
Write-Host ""
Write-Host "Preview domain : https://korelyy-tools.pages.dev"
Write-Host "Custom domain  : https://korelyy.com"
Write-Host "Custom domain 2: https://www.korelyy.com"
Write-Host ""

# ------------------------------------------------------------
# Step 3 — Verify ads.txt (wait up to 120s for propagation)
# (slightly longer: Pages may take a bit to update custom domain aliases)
# ------------------------------------------------------------
Write-Host "Checking ads.txt (up to 120s for new deployment to propagate)..."
$expected = 'google.com, pub-7235824755389632, DIRECT, f08c47fec0942fa0'
$ok = $false
for ($i = 1; $i -le 40; $i++) {
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Uri 'https://korelyy.com/ads.txt' -TimeoutSec 10
    if ($resp.StatusCode -eq 200 -and $resp.Content -match [regex]::Escape($expected)) {
      Write-Host "  [try $i/40] 200 OK — ads.txt matches expected publisher line."
      $ok = $true
      break
    } else {
      Write-Host "  [try $i/40] HTTP $($resp.StatusCode) — content NOT expected yet. Sleeping 3s."
    }
  } catch {
    Write-Host "  [try $i/40] network/curl error: $($_.Exception.Message). Sleeping 3s."
  }
  Start-Sleep -Seconds 3
}

Write-Host ""
if ($ok) {
  Write-Host "===================================================================="
  Write-Host "  ✅ DEPLOYMENT COMPLETE — ads.txt is LIVE at https://korelyy.com/ads.txt"
  Write-Host "===================================================================="
} else {
  Write-Host "WARNING: ads.txt not verified within 120s. Try manually in 1-2 minutes:"
  Write-Host "   → Invoke-WebRequest -UseBasicParsing https://korelyy.com/ads.txt | Select-Object StatusCode,Content"
  Write-Host "   (Custom domain CDN cache takes a bit longer than preview domain)"
}
Write-Host ""
Write-Host "Press Enter to close."
[void][System.Console]::ReadKey($true)
