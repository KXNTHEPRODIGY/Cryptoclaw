@echo off
echo ==========================================
echo    FORCE DEPLOYMENT (Robust Mode) 🛡️
echo ==========================================
echo.
echo 1. Setting System Path...
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo.
echo 2. Force Installing Vercel CLI...
call npm install -g vercel
if %ERRORLEVEL% NEQ 0 (
    echo Global install failed. Trying local install...
    call npm install vercel
)

echo.
echo 3. Verifying Installation...
call vercel --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Vercel still not found.
    echo Please take a screenshot of this window.
    pause
    exit /b
)

echo.
echo 4. STARTING LOGIN (Browser will open)...
echo    PLEASE LOG IN WHEN PROMPTED.
call vercel login

echo.
echo 5. DEPLOYING...
echo    (Accept all defaults: Y, Enter, Enter...)
call vercel

echo.
echo ==========================================
echo DONE! URL should be above.
echo ==========================================
pause
