@echo off
echo ==================================================
echo   SETUP PRODUCTION KEYS (Vercel) 🔑
echo ==================================================
echo.
echo This script will ask you to PASTE your keys.
echo (Right-click to paste in this window).
echo.

set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo 1. Adding ANTHROPIC_API_KEY...
echo    (Paste your 'sk-ant...' key when prompted)
call npx vercel env add ANTHROPIC_API_KEY production

echo.
echo 2. Adding RESEND_API_KEY...
echo    (Paste your 're_...' key when prompted)
call npx vercel env add RESEND_API_KEY production

echo.
echo ==================================================
echo KEYS ADDED! 
echo Now you must REDEPLOY for them to work.
echo running 'npx vercel --prod' to finish up...
echo ==================================================
pause
call npx vercel --prod
pause
