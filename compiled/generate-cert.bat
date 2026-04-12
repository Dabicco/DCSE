@echo off
REM SSL Certificate Generator for Dabicco Engine
REM Generates self-signed SSL certificates for HTTPS support

echo Generating SSL certificates...
echo.

REM Create ssl directory if it doesn't exist
if not exist ssl mkdir ssl

REM Check if OpenSSL is available
where openssl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: OpenSSL not found in PATH
    echo.
    echo Please install OpenSSL or use Git Bash which includes OpenSSL
    echo.
    echo Alternative: Use the generate-cert.ps1 PowerShell script
    pause
    exit /b 1
)

REM Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout ssl\server.key -out ssl\server.crt -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ SSL certificates generated successfully!
    echo   Key: ssl\server.key
    echo   Certificate: ssl\server.crt
    echo.
    echo The server will now use HTTPS on port 8443
) else (
    echo.
    echo ERROR: Failed to generate SSL certificates
    pause
    exit /b 1
)

pause
