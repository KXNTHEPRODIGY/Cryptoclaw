@echo off
echo STARTING CRYPTOBOOK SERVER...
echo -----------------------------
cd /d "%~dp0"
echo Running in: %CD%

REM Fix Method 1: Add Node to Path automatically
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo.
echo Atempting to start server...
echo.

REM Auto-open browser
start http://localhost:3000

call npm.cmd run dev
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Server failed to start.
    echo Trying direct node call fallback...
    "C:\Program Files\nodejs\node.exe" node_modules\next\dist\bin\next dev
)
pause
