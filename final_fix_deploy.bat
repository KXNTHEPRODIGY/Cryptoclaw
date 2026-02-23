@echo off
echo ==========================================
echo    FINAL FIX DEPLOYMENT 🚀
echo ==========================================
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo.
echo 1. Verifying package.json updates...
findstr "eslint" package.json
echo (You should see "latest" above)

echo.
echo 2. NUCLEAR CLEANUP...
taskkill /F /IM node.exe >nul 2>&1
if exist package-lock.json del /f /q package-lock.json
if exist node_modules rmdir /s /q node_modules

echo.
echo 3. INSTALLING (force legacy peer deps)...
call npm install --legacy-peer-deps

echo.
echo 4. DEPLOYING...
call npm run deploy

pause
