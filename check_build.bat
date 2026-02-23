@echo off
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files (x86)\nodejs
echo Running Local Build Check...
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo BUILD SUCCESS!
) ELSE (
    echo BUILD FAILED!
)
pause
