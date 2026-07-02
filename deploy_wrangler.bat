@echo off
chcp 65001 >nul
cd /d D:\projects\工具独立站
set CLOUDFLARE_API_TOKEN=cfat_RndvBpklEINvt0Y1FUkr3Lc4Lupz2G23s6GuS1Lc934464b1
npx --yes wrangler@latest pages deploy out --project-name korelyy-tools
pause