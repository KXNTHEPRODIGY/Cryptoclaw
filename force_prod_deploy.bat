@echo off
echo ==========================================
echo   FORCING PRODUCTION DEPLOYMENT ⚠️
echo ==========================================
echo.
echo Asking Vercel to REBUILD everything (ignore cache)...
powershell -ExecutionPolicy Bypass -Command "vercel --prod --force --yes"
echo.
pause
