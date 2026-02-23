@echo off
echo INSTALLING DEPENDENCIES...
echo --------------------------
cd /d "%~dp0"
echo Running in: %CD%

REM Fix Method 1: Add Node to Path automatically
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo.
echo Installing...
call npm.cmd install --ignore-scripts
echo.
echo DONE!
pause
