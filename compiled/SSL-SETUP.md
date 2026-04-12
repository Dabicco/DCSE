# SSL/HTTPS Setup Guide

## Overview
The Dabicco Engine now supports secure HTTPS connections with SSL certificates. The server automatically detects if SSL certificates are available and enables HTTPS on port 8443. If certificates are not found, it falls back to HTTP on port 8080.

## Quick Start

### Option 1: Generate SSL Certificates (Recommended)

#### Using OpenSSL (Windows with Git Bash)
```batch
generate-cert.bat
```

#### Using PowerShell
```powershell
generate-cert.ps1
```

This will create a self-signed SSL certificate in the `ssl/` directory:
- `ssl/server.crt` - SSL certificate
- `ssl/server.key` - Private key

### Option 2: Use HTTP-Only Mode
Simply run `run.bat` without generating certificates. The server will run in HTTP-only mode on port 80 (requires admin privileges).

## Running the Server

### With SSL Certificates
```batch
run.bat
```
- Opens browser to `https://localhost` (port 443)
- HTTP (port 80) automatically redirects to HTTPS (port 443)
- Secure connection with SSL/TLS encryption
- **Requires administrator privileges**

### Without SSL Certificates
```batch
run.bat
```
- Opens browser to `http://localhost` (port 80)
- Standard HTTP connection (not encrypted)
- **Requires administrator privileges**

## Security Features

### Security Headers
The server includes the following security headers:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy: geolocation=(), microphone=(), camera=()` - Restricts sensitive APIs

### SSL Configuration
- **Algorithm**: RSA 4096-bit
- **Certificate Type**: Self-signed (for local development)
- **Validity**: 365 days
- **Subject**: CN=localhost

### Port Configuration
- **Web Server HTTP**: Port 80 (standard HTTP port, requires admin privileges)
- **Web Server HTTPS**: Port 443 (standard HTTPS port, requires admin privileges)
- **Multiplayer Server HTTP**: Port 1920 (WebSocket, no admin required)
- **Multiplayer Server HTTPS**: Port 1919 (Secure WebSocket, no admin required)

**Note**: Ports 80 and 443 require administrator privileges to bind. Run `run.bat` as administrator. The multiplayer server uses ports 1919/1920 which don't require admin privileges.

## Production Deployment

For production deployment, you should:

1. **Use a trusted SSL certificate authority** instead of self-signed certificates
   - Let's Encrypt (free, automated)
   - DigiCert, Comodo, etc. (paid)

2. **Configure a reverse proxy** (nginx, Apache) for better performance and security

3. **Enable HSTS** (HTTP Strict Transport Security) in the server configuration

4. **Use environment variables** for sensitive configuration

5. **Implement rate limiting** and DDoS protection

## Troubleshooting

### "OpenSSL not found"
Install OpenSSL or use Git Bash which includes OpenSSL:
```batch
# Using Git Bash
git bash
cd /c/Users/Dabicco/Desktop/SOnDB
openssl req -x509 -newkey rsa:4096 -keyout ssl/server.key -out ssl/server.crt -days 365 -nodes
```

### "Certificate not trusted" in browser
This is normal for self-signed certificates. In Chrome:
1. Click "Advanced"
2. Click "Proceed to localhost (unsafe)"

### Port already in use
The web server uses ports 80 (HTTP) and 443 (HTTPS). The multiplayer server uses ports 1920 (HTTP) and 1919 (HTTPS). If these ports are in use:
- Close other applications using these ports (IIS, Apache, Skype, etc.)
- Or modify the port numbers in `server.js` (web) or `server/multiplayer-server.js` (multiplayer)

### "Administrator privileges required"
Ports 80 and 443 require administrator access to bind. To fix:
- Right-click `run.bat` and select "Run as administrator"
- Or use alternative ports (8080/8443) by modifying `server.js`

### Server won't start
Check that Node.js is installed:
```batch
node --version
```

## Certificate Renewal

Self-signed certificates are valid for 365 days. To renew:
```batch
# Delete old certificates
del ssl\server.crt
del ssl\server.key

# Generate new certificates
generate-cert.bat
```

## File Structure
```
SOnDB/
├── server.js              # Secure server with HTTPS support
├── run.bat                # Server launcher
├── generate-cert.bat      # SSL certificate generator (OpenSSL)
├── generate-cert.ps1      # SSL certificate generator (PowerShell)
├── ssl/                   # SSL certificates (created by generator)
│   ├── server.crt        # SSL certificate
│   └── server.key        # Private key
└── compiled/              # Build output
    ├── server.js         # Copied from source
    ├── run.bat           # Generated with SSL detection
    └── ssl/              # Copied if exists (for production)
```

## Additional Notes

- The server gracefully shuts down on Ctrl+C
- HTTP automatically redirects to HTTPS when SSL is enabled
- The server works in both HTTP-only and HTTPS modes
- SSL certificates are optional - the server degrades gracefully
