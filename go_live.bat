@echo off
echo ==========================================
echo    GOING LIVE TO PRODUCTION 🚀
echo ==========================================
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo.
echo Deploying to Main URL...
echo (If asked, type 'Y' to confirm)
call npx vercel --prod

echo.
echo DONE! You are live at the URL above.
pause
