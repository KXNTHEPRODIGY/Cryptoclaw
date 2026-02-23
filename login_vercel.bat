@echo off
echo Starting Vercel Login...
powershell -ExecutionPolicy Bypass -Command "vercel login"
echo.
echo Login process finished. You can close this window if successful.
pause
