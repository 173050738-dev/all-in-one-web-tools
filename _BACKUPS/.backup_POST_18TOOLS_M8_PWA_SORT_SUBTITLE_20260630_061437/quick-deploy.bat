@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ============================================================
REM  Korelyy Tool Hub - 极速一键部署脚本（生产环境）
REM  特点：无交互 / 自动清缓存 / 自动处理 middleware / 自动 copy CF 资源 / 自动上传
REM  使用：在 PowerShell 5 或 CMD 中直接运行：  quick-deploy.bat
REM  前置：设置好 Cloudflare API Token 环境变量，或已 wrangler login 过
REM     方式 A（推荐）：$env:CLOUDFLARE_API_TOKEN="你的Token"  ;  .\quick-deploy.bat
REM     方式 B：       先运行一次 npx wrangler login 授权，之后无需 Token
REM ============================================================

cd /d "D:\projects\工具独立站"

echo.
echo ================================================================
echo   Korelyy Tool Hub - 极速部署 (Quick Deploy)
echo ================================================================
echo.

REM ---------- 0. 检查 wrangler 登录 / Token ----------
echo [0/7] 检查 Cloudflare 授权...
set CF_AUTH_OK=0
if defined CLOUDFLARE_API_TOKEN (
  echo   使用 CLOUDFLARE_API_TOKEN 环境变量
  set CF_AUTH_OK=1
) else (
  for /f "delims=" %%i in ('npx.cmd --yes wrangler@latest whoami 2^>^&1 ^| findstr /c:"You are logged in" /c:"Email" /c:"Account"') do set CF_AUTH_OK=1
)
if "%CF_AUTH_OK%"=="0" (
  echo.
  echo [ERROR] 未检测到 Cloudflare 授权！请任选一种方式：
  echo   A. 先设置 Token：  $env:CLOUDFLARE_API_TOKEN="你的Token"
  echo   B. 先浏览器登录：  npx wrangler login
  echo.
  exit /b 1
)
echo   授权检查通过

REM ---------- 1. 读取 / 询问 Pages 项目名 ----------
echo [1/7] 确定部署目标项目...
set PAGES_PROJECT=korelyy-tools
if "%1" NEQ "" (
  set PAGES_PROJECT=%1
  echo   使用命令行参数指定项目: %PAGES_PROJECT%
) else (
  echo   使用默认项目名: %PAGES_PROJECT%  (如需其他项目: quick-deploy.bat 项目名)
)

REM ---------- 2. 清理缓存（加速 + 避免旧文件污染） ----------
echo [2/7] 清理 .next 缓存和旧 out/...
if exist .next ( rmdir /s /q .next 2>nul )
if exist out  ( rmdir /s /q out  2>nul )
echo   已清理

REM ---------- 3. 处理 middleware 冲突（静态导出不兼容） ----------
echo [3/7] 处理 middleware.ts（静态导出临时移除）...
set MIDDLEWARE_BAK=0
if exist middleware.ts (
  ren middleware.ts middleware.ts.bak
  set MIDDLEWARE_BAK=1
  echo   已临时移除
) else (
  echo   无 middleware.ts，跳过
)

REM ---------- 4. Build ----------
echo [4/7] 运行 next build（静态导出）...
call npm.cmd run build
if errorlevel 1 (
  echo.
  echo [ERROR] Build 失败！请先修复错误再重试。
  if "%MIDDLEWARE_BAK%"=="1" if exist middleware.ts.bak ren middleware.ts.bak middleware.ts
  exit /b 2
)
echo   Build 完成

REM ---------- 5. 恢复 middleware.ts ----------
echo [5/7] 恢复 middleware.ts...
if "%MIDDLEWARE_BAK%"=="1" if exist middleware.ts.bak (
  ren middleware.ts.bak middleware.ts
  echo   已恢复
)

REM ---------- 6. Copy CF Pages 特有静态资源到 out/ ----------
echo [6/7] 复制 CF Pages 静态资源 (_headers/_redirects/favicon/og-image/sitemap)...
if not exist out (
  echo [ERROR] 构建后找不到 out/ 目录！
  exit /b 3
)
set COPIED=0
for %%f in (_headers _redirects favicon.svg og-image.svg robots.txt sitemap.xml) do (
  if exist public\%%f (
    copy /Y public\%%f out\%%f >nul
    set /a COPIED+=1
  )
)
REM favicon.ico 从 svg 复制一份
if exist public\favicon.svg (
  copy /Y public\favicon.svg out\favicon.ico >nul
  set /a COPIED+=1
)
echo   已复制 %COPIED% 个文件到 out/

REM ---------- 7. 上传到 Cloudflare Pages ----------
echo [7/7] 上传到 Cloudflare Pages 项目: %PAGES_PROJECT%
echo   (上传 500~900 文件，预计 2~10 分钟，请耐心等待...)
echo.
npx.cmd --yes wrangler@latest pages deploy out --project-name %PAGES_PROJECT%

if errorlevel 1 (
  echo.
  echo [ERROR] 部署上传失败！
  exit /b 5
)

echo.
echo ================================================================
echo   🎉 部署成功！
echo   访问地址: https://%PAGES_PROJECT%.pages.dev
echo   （绑定自定义域名后: https://www.korelyy.com）
echo ================================================================
echo.
REM 记录本次部署快照目录，便于一键回滚
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%-%time:~0,2%%time:~3,2%
set TIMESTAMP=%TIMESTAMP: =0%
set BACKUP_DIR=snapshots\out-%TIMESTAMP%
if not exist snapshots mkdir snapshots
xcopy /e /i /q /y out %BACKUP_DIR% >nul
echo   本次部署快照已保存: %BACKUP_DIR%
echo   回滚命令:  npx wrangler pages deploy %BACKUP_DIR% --project-name %PAGES_PROJECT%
echo.
endlocal
exit /b 0
