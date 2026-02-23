@echo off
title CRYPTOBOOK FIXER
echo ---------------------------------------------------
echo  KILLING OLD BACKGROUND PROCESSES...
echo ---------------------------------------------------
taskkill /F /IM node.exe
echo.

echo ---------------------------------------------------
echo  RE-INSTALLING MISSING FILES...
echo ---------------------------------------------------
REM Adding Node to PATH just in case
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs

call npm.cmd install --ignore-scripts
echo.

echo ---------------------------------------------------
echo  STARTING SERVER CLEANLY...
echo ---------------------------------------------------
start http://localhost:3000
call npm.cmd run dev
pause
