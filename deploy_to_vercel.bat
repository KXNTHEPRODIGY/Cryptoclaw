@echo off
echo ==========================================
echo    CRYPTOBOOK DEPLOYMENT WIZARD 🚀
echo ==========================================
echo.
echo Setting up environment...
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo.
echo installing Vercel CLI...
call npm install -g vercel

echo.
echo ==========================================
echo INSTRUCTIONS:
echo 1. The browser might open to Login to Vercel.
echo 2. Come back here and select "Y" to setup.
echo 3. Scope: Select your name.
echo 4. Link to existing project? N
echo 5. Project Name: cryptobook
echo 6. Directory: ./ (Just press Enter)
echo 7. Settings: Default (Just press Enter)
echo ==========================================
echo.
echo Press any key to start deployment...
pause
call vercel
echo.
echo Deployment Complete! URL should be above.
pause
