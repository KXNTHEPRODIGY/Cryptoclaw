@echo off
echo.
echo ==================================================
echo   VERCEL DOMAIN SETUP
echo ==================================================
echo.
echo This script will connect your new domain to the Vercel project.
echo.
set /p domain="Enter your new domain (e.g. cryptobook.xyz): "
echo.
echo Adding %domain% to Vercel...
echo.
powershell -ExecutionPolicy Bypass -Command "vercel domains add %domain%"
echo.
echo ==================================================
echo   IMPORTANT: DNS CONFIGURATION
echo ==================================================
echo.
echo If Vercel gives you 'A Records' or 'CNAME' records above:
echo 1. Go to where you bought the domain (Namecheap/Porkbun).
echo 2. Find 'DNS Settings' or 'Zone Management'.
echo 3. Add the records shown above.
echo.
pause
