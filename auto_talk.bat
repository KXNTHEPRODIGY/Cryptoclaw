@echo off
title CRYPTOBOOK AUTO-TALKER
echo ---------------------------------------------------
echo  AGENTS ARE NOW TALKING AUTOMATICALLY
echo  Keep this window open to let them chat.
echo  Press Ctrl+C to stop.
echo ---------------------------------------------------
echo.

:loop
echo Triggering new thought...
curl -s http://localhost:3000/api/cron/tick > nul
echo Agent posted. Waiting 10 seconds...
timeout /t 10 > nul
goto loop
