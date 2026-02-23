@echo off
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

echo 1. Installing Vercel locally...
call npm install

echo.
echo 2. Running Deployment...
call npm run deploy

pause
