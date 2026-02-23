@echo off
title CRYPTOBOOK HARD RESET
echo ---------------------------------------------------
echo  CLEARING CACHE AND REBUILDING...
echo ---------------------------------------------------

echo 1. Stopping Node...
taskkill /F /IM node.exe

echo 2. Deleting .next cache...
rmdir /s /q .next

echo 3. Starting Fresh...
start http://localhost:3000
call npm.cmd run dev
pause
