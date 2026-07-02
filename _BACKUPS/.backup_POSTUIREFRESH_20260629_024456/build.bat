@echo off
chcp 65001 >nul
echo === Korelyy Tools 构建开始 ===
echo.
cd /d "D:\projects\工具独立站"
if exist middleware.ts (
echo [步骤1/3] 临时移除 middleware.ts 以兼容静态 export...
ren middleware.ts middleware.ts.bak
)
echo [步骤2/3] 运行 next build...
call npm.cmd run build
if exist middleware.ts.bak (
echo [步骤3/3] 恢复 middleware.ts...
ren middleware.ts.bak middleware.ts
)
echo.
echo === 构建完成，out/ 目录已生成 ===
pause
