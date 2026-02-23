@echo off
SET PATH=C:\Program Files\nodejs;%PATH%
echo BUILDING PROJECT...
echo --------------------------
cd /d "%~dp0"
call npm run build
pause
