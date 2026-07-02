@echo off
chcp 65001 >nul
echo === Korelyy Tools Build Start ===
echo.
cd /d "D:\projects\工具独立站"
if exist middleware.ts (
echo [Step 1/4] Temporarily move middleware.ts for static export...
ren middleware.ts middleware.ts.bak
)
echo [Step 2/4] Running next build...
call npm.cmd run build
if exist middleware.ts.bak (
echo [Step 3/4] Restoring middleware.ts...
ren middleware.ts.bak middleware.ts
)
echo [Step 4/4] Copying CF Pages assets (_headers/_redirects/favicon/OG image) to out/ root...
if exist out (
  if exist public\_headers copy /Y public\_headers out\_headers >nul
  if exist public\_redirects copy /Y public\_redirects out\_redirects >nul
  if exist public\favicon.svg copy /Y public\favicon.svg out\favicon.svg >nul
  if exist public\og-image.svg copy /Y public\og-image.svg out\og-image.svg >nul
  if exist public\robots.txt copy /Y public\robots.txt out\robots.txt >nul
  if exist public\sitemap.xml copy /Y public\sitemap.xml out\sitemap.xml >nul
  REM SVG 内容直接复制一份为 favicon.ico 占位（现代浏览器按内容格式解析，不看后缀）
  if exist public\favicon.svg copy /Y public\favicon.svg out\favicon.ico >nul
)
echo.
echo === Build finished. out/ directory ready ===
exit /b 0
