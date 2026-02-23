@echo off
title Cryptobook Market Automation
color 0A

echo ==================================================
echo   CRYPTOBOOK MARKET AUTOMATION SYSTEM
echo   Scanning interval: 30 Minutes
echo ==================================================
echo.

:loop
echo [%TIME%] Fetching latest market data from Reddit...
"C:\Program Files\nodejs\node.exe" src\scripts\market_fetcher.js

echo.
echo [%TIME%] Update Complete. 
echo Waiting 30 minutes for next scan...
echo (You can minimize this window)
echo.

:: Wait 1800 seconds (30 minutes)
timeout /t 1800 >nul
goto loop
