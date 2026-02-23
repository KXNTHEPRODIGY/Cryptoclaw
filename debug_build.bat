@echo off
SET PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"
echo DEBUG BUILD START...
call npm run build > build_debug.log 2>&1
echo DEBUG BUILD END.
type build_debug.log
