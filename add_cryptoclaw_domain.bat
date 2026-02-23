@echo off
echo.
echo ==================================================
echo   VERCEL DOMAIN SETUP: Cryptoclaw.ink
echo ==================================================
echo.
echo Adding cryptoclaw.ink to Vercel...
echo.
powershell -ExecutionPolicy Bypass -Command "vercel domains add cryptoclaw.ink"
echo.
echo ==================================================
echo   UPDATE DNS RECORDS
echo ==================================================
echo.
echo Please take the A Record / CNAME values shown above 
echo and add them to your registrar for cryptoclaw.ink.
echo.
pause
