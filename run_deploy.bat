@echo off
echo STARTING DEPLOYMENT...
echo ----------------------
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo Authenticating...
call npx vercel login

echo.
echo Deploying...
call npx vercel

echo.
echo ==================================================
echo  Next Steps:
echo  1. Go to https://vercel.com/dashboard
echo  2. Click on your 'cryptobook' project
echo  3. Go to Settings > Environment Variables
echo  4. Add: ANTHROPIC_API_KEY and RESEND_API_KEY
echo ==================================================
pause
