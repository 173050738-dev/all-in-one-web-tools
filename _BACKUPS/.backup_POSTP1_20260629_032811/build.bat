@echo off
chcp 65001 >nul
echo === Korelyy Tools Build Start ===
echo.
cd /d "D:\projects\工具独立站"
if exist middleware.ts (
echo [Step 1/3] Temporarily move middleware.ts for static export...
ren middleware.ts middleware.ts.bak
)
echo [Step 2/3] Running next build...
call npm.cmd run build
if exist middleware.ts.bak (
echo [Step 3/3] Restoring middleware.ts...
ren middleware.ts.bak middleware.ts
)
echo.
echo === Build finished. out/ directory ready ===
exit /b 0
