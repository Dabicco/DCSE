// Server software made by WheatleyCrab55 & RedBoyGamer
// Compiled in Dabicco Engine 9.3
// Enhanced with HTTPS and security headers
// Do NOT launch with wine!

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

const quotes = [
    "You look great by the way, very healthy.",
    "I am not a moron.",
    "The light's on the blink.",
    "Yeah, take the lemons.",
    "This is the part where he kills you.",
    "For science- you monster.",
    "SPAAAAAACE!",
    "Bite me.",
    "Sure! I love doing anything.",
    "That's not true; everyone tells me I'm useless and terrible.",
    "You know, I left an-an extremely dangerous weapo- u-uh, excuse, o-outside.",
    "Wait, no, ah, I'm going to murder everyone.",
    "Root beer, no, root beer.",
    "Get a load of this.",
    "The soup is cold and the salad is hot.",
    "You know you love it.",
    "Hello... Do you want to play with me?",
    "The cake is a lie.",
    "The chosen one.",
    "The second coming.",
    "It means Earth, Venus.",
    "It's that time of the month again.",
    "Dabicco Extension.",
    "One thing I don't have control over; are your minds."
];

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.ico': 'image/x-icon',
    '.bin': 'application/octet-stream',
    '.otf': 'font/otf',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

// Security headers
const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// SSL Certificate configuration
let sslOptions = null;
const certPath = path.join(__dirname, 'ssl');
const keyPath = path.join(certPath, 'server.key');
const certPathFile = path.join(certPath, 'server.crt');
const chainPathFile = path.join(certPath, 'fullchain.pem');

// Check if SSL certificates exist (support both server.crt and fullchain.pem)
const certFile = fs.existsSync(chainPathFile) ? chainPathFile : certPathFile;
if (fs.existsSync(keyPath) && fs.existsSync(certFile)) {
    try {
        sslOptions = {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certFile)
        };
        console.log('✓ SSL certificates loaded successfully');
        console.log(`  Using: ${certFile}`);
    } catch (err) {
        console.warn('⚠ Failed to load SSL certificates:', err.message);
        console.log('  Running in HTTP-only mode');
    }
} else {
    console.log('⚠ SSL certificates not found in ./ssl/ directory');
    console.log('  Running in HTTP-only mode');
    console.log('  To enable HTTPS, generate certificates:');
    console.log('    mkdir ssl');
    console.log('    openssl req -x509 -newkey rsa:4096 -keyout ssl/server.key -out ssl/server.crt -days 365 -nodes');
    console.log('  Or use Let\'s Encrypt (see server/LETSENCRYPT_SETUP.md)');
}

// Request handler for both HTTP and HTTPS
const requestHandler = (req, res) => {
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<!DOCTYPE html><html><head><title>404</title></head><body><h1>404 - File Not Found</h1></body></html>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<!DOCTYPE html><html><head><title>500</title></head><body><h1>500 - Server Error</h1></body></html>');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
};

// Create HTTPS server if SSL certificates are available
let httpsServer = null;
if (sslOptions) {
    httpsServer = https.createServer(sslOptions, requestHandler);
    httpsServer.listen(HTTPS_PORT, () => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        console.log(randomQuote);
        console.log(`✓ Secure HTTPS server running on port ${HTTPS_PORT} (standard HTTPS)`);
        console.log(`  https://localhost`);
    });
}

// Create HTTP server (redirects to HTTPS if available, otherwise serves content)
const httpServer = http.createServer((req, res) => {
    if (httpsServer) {
        // Redirect HTTP to HTTPS (standard ports, no port number in URL)
        const httpsUrl = `https://${req.headers.host.split(':')[0]}${req.url}`;
        res.writeHead(301, { 'Location': httpsUrl });
        res.end();
    } else {
        // Serve content directly if HTTPS is not available
        requestHandler(req, res);
    }
});

httpServer.listen(HTTP_PORT, () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    console.log(randomQuote);
    if (httpsServer) {
        console.log(`✓ HTTP server running on port ${HTTP_PORT} (standard HTTP, redirects to HTTPS)`);
        console.log(`  http://localhost → https://localhost`);
    } else {
        console.log(`✓ HTTP server running on port ${HTTP_PORT} (standard HTTP)`);
        console.log(`  http://localhost`);
        console.log(`  ⚠ WARNING: Not using HTTPS. For production, enable SSL certificates.`);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down servers...');
    httpServer.close(() => {
        if (httpsServer) {
            httpsServer.close(() => {
                console.log('Servers closed.');
                process.exit(0);
            });
        } else {
            console.log('Server closed.');
            process.exit(0);
        }
    });
});

