@echo off 
title Dabicco Engine Secure Server 
 
:: Change to script directory 
cd /d "%~dp0" 
 
echo. 
echo ======================================== 
echo   Dabicco Engine Secure Server 
echo ======================================== 
echo. 
 
:: Check for administrator privileges 
net session >nul 2>&1 
if %ERRORLEVEL% NEQ 0 ( 
    echo [ERROR] Administrator privileges required! 
    echo. 
    echo Ports 80 and 443 require administrator access. 
    echo Please right-click this file and select "Run as administrator" 
    echo. 
    pause 
    exit /b 1 
) 
 
echo [ADMIN] Running with administrator privileges 
echo. 
 
:: Check if SSL certificates exist 
if exist "ssl\server.crt" ( 
    if exist "ssl\server.key" ( 
        echo [SSL] Certificates found - HTTPS will be enabled 
        echo [SSL] Opening secure browser on port 443... 
        echo. 
        timeout /t 2 /nobreak >nul 
        start "" https://localhost 
    ) else ( 
        echo [SSL] Certificate key not found 
        echo [SSL] Running in HTTP-only mode on port 80 
        echo. 
        echo To enable HTTPS, run: generate-cert.bat 
        echo. 
        timeout /t 2 /nobreak >nul 
        start "" http://localhost 
    ) 
) else ( 
    echo [SSL] Certificates not found 
    echo [SSL] Running in HTTP-only mode on port 80 
    echo. 
    echo To enable HTTPS, run: generate-cert.bat 
    echo. 
    timeout /t 2 /nobreak >nul 
    start "" http://localhost 
) 
 
echo. 
echo Starting secure server on standard ports 80 and 443... 
echo. 
 
:: Start the web server 
start "Dabicco Web Server" cmd /k "node server.js" 
 
:: Start the multiplayer server 
echo Starting multiplayer server... 
start "Dabicco Multiplayer Server" cmd /k "node server\multiplayer-server.js" 
 
echo. 
echo Both servers started! 
echo - Web Server: HTTP port 80, HTTPS port 443 
echo - Multiplayer Server: HTTP port 1920, HTTPS port 1919 
echo. 
echo Press any key to stop all servers... 
pause 
 
:: Kill both server windows 
taskkill /FI "WINDOWTITLE eq Dabicco Web Server*" /F >nul 2>&1 
taskkill /FI "WINDOWTITLE eq Dabicco Multiplayer Server*" /F >nul 2>&1 
echo Servers stopped. 
