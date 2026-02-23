@echo off
echo ==========================================
echo    DEPLOYMENT ATTEMPT #2
echo ==========================================
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo.
echo 1. Checking Vercel Version...
call vercel --version

echo.
echo 2. STARTING DEPLOYMENT
echo    (If the browser does not open, LOOK BELOW for a link!)
echo    (Copy the link starting with https://vercel.com/... into your browser)
echo.
pause

call vercel

echo.
echo ==========================================
echo If you saw "Production" above, you are live!
echo Next: Add API Keys in Vercel Dashboard.
echo ==========================================
pause
