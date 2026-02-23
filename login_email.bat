@echo off
echo.
echo ==================================================
echo   VERCEL LOGIN (EMAIL MODE)
echo ==================================================
echo.
echo Since the browser launch is failing, we will try email login.
echo.
set /p email="1. Enter your Vercel email address: "
echo.
echo 2. Sending login request to %email%...
echo 3. Check your email inbox and click the 'Verify' button.
echo.
powershell -ExecutionPolicy Bypass -Command "vercel login %email%"
echo.
pause
