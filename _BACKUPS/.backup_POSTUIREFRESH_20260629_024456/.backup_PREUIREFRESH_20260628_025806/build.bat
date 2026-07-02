@echo off
cd /d "D:\projects\工具独立站"
echo Building...
call npx next build
echo Build exit code: %errorlevel%