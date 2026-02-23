@echo off
echo ==========================================
echo    HARD RESET & DEPLOY 🛡️
echo ==========================================
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo.
echo 1. Clearing old lockfiles...
if exist package-lock.json del package-lock.json
if exist node_modules rmdir /s /q node_modules

echo.
echo 2. Installing CLEAN dependencies (Latest Secure Versions)...
call npm install

echo.
echo 3. Deploying...
call npm run deploy

pause
