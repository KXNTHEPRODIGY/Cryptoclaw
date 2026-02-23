@echo off
echo Starting Vercel Login (Manual Mode)...
echo.
echo 1. Wait for the URL to appear below.
echo 2. COPY and PASTE it into your browser.
echo 3. Login with your email or GitHub.
echo.
powershell -ExecutionPolicy Bypass -Command "vercel login --no-launch"
echo.
echo Login process finished.
pause
