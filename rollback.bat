@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ============================================================
REM  Korelyy Tool Hub - 一键回滚脚本
REM  场景：上线后出问题，1分钟内切回上个稳定版本
REM  用法：
REM    方式1（交互式选快照）：rollback.bat
REM    方式2（指定目录回滚）：rollback.bat snapshots\out-20260629-1150
REM    方式3（指定项目名）：  rollback.bat snapshots\out-xxx 项目名
REM ============================================================

cd /d "D:\projects\工具独立站"
set PAGES_PROJECT=korelyy-tools
if "%2" NEQ "" set PAGES_PROJECT=%2

echo.
echo ================================================================
echo   Korelyy Tool Hub - 一键回滚
echo   目标项目: %PAGES_PROJECT%
echo ================================================================
echo.

REM ---- 授权检查 ----
set CF_AUTH_OK=0
if defined CLOUDFLARE_API_TOKEN set CF_AUTH_OK=1
if "%CF_AUTH_OK%"=="0" (
  for /f "delims=" %%i in ('npx.cmd --yes wrangler@latest whoami 2^>^&1 ^| findstr /c:"You are logged in" /c:"Email" /c:"Account"') do set CF_AUTH_OK=1
)
if "%CF_AUTH_OK%"=="0" (
  echo [ERROR] 未授权！先设置 Token 或 wrangler login
  exit /b 1
)

REM ---- 方式2：命令行指定快照 ----
set TARGET_DIR=%1
if "%TARGET_DIR%" NEQ "" (
  if not exist "%TARGET_DIR%\index.html" (
    echo [ERROR] %TARGET_DIR% 不是有效的 out/ 快照（找不到 index.html）
    exit /b 2
  )
  echo 开始回滚到: %TARGET_DIR%
  goto :do_rollback
)

REM ---- 方式1：交互式列出最近 10 个快照 ----
if not exist snapshots (
  echo [ERROR] 找不到 snapshots\ 目录，没有可回滚的版本快照
  echo   解决：下次部署时用 quick-deploy.bat 会自动生成快照
  exit /b 3
)
echo 最近可用的快照（按时间倒序）：
echo -------------------------------------------------
set /a idx=0
set "SNAP_LIST="
for /f "delims=" %%d in ('dir /b /o-n /a:d snapshots\out-* 2^>nul') do (
  set /a idx+=1
  set SNAP_LIST=!SNAP_LIST! %%d
  echo   !idx!. snapshots\%%d
)
if %idx%==0 (
  echo   （没有历史快照，无法回滚）
  exit /b 3
)
echo -------------------------------------------------
set /p CHOICE="请输入要回滚的编号 (1-%idx%)，回车取消："
if "%CHOICE%"=="" (
  echo 已取消
  exit /b 0
)
set /a n=0
set SELECTED=
for %%s in (%SNAP_LIST%) do (
  set /a n+=1
  if "!n!"=="%CHOICE%" set SELECTED=snapshots\%%s
)
if "%SELECTED%"=="" (
  echo [ERROR] 无效编号
  exit /b 4
)
set TARGET_DIR=%SELECTED%
echo.
echo 已选择: %TARGET_DIR%

:do_rollback
echo.
echo 检查关键文件...
set OK=1
for %%f in (_headers _redirects favicon.ico index.html) do (
  if exist "%TARGET_DIR%\%%f" ( echo   ✅ %%f ) else ( echo   ❌ %%f MISSING & set OK=0 )
)
if "%OK%"=="0" (
  echo [WARN] 部分关键文件缺失，确认要继续吗？ Ctrl+C 可取消
  pause
)
echo.
echo 正在回滚上传到 Cloudflare Pages...
echo.
npx.cmd --yes wrangler@latest pages deploy "%TARGET_DIR%" --project-name %PAGES_PROJECT%

if errorlevel 1 (
  echo [ERROR] 回滚上传失败
  exit /b 5
)
echo.
echo ================================================================
echo   ✅ 回滚完成！
echo   地址: https://%PAGES_PROJECT%.pages.dev   https://www.korelyy.com
echo ================================================================
echo   注意：Cloudflare CDN 缓存最长 5 分钟生效，可 Ctrl+F5 强刷查看
echo.
endlocal
exit /b 0
