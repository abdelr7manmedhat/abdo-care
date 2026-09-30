@echo off
title GrowthOS AI - Node.js Server
echo ========================================================
echo   Starting GrowthOS AI Node.js Localhost App...
echo ========================================================
echo.

if not exist "node_modules" (
    echo [Setup] Installing express and cors packages...
    call npm install express cors --no-fund --no-audit
)

call npm start
pause
