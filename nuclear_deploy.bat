@echo off
echo ==========================================
echo    NUCLEAR OPTION: KILL & DEPLOY ☢️
echo ==========================================
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo.
echo 1. KILLING Stuck Processes (to unlock files)...
taskkill /F /IM node.exe
taskkill /F /IM next.exe
echo (It is okay if it says "The process ... not found")

echo.
echo 2. Waiting 3 seconds for release...
timeout /t 3 /nobreak >nul

echo.
echo 3. DELETING Lockfiles...
if exist package-lock.json del /f /q package-lock.json
if exist node_modules rmdir /s /q node_modules

echo.
echo 4. CLEAN INSTALL (Latest Secure Version)...
call npm install --legacy-peer-deps

echo.
echo 5. DEPLOYING...
call npm run deploy

pause
