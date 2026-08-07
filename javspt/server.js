const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const CACHE_CONTROL = {
  '/sw.js': 'no-cache, no-store, must-revalidate',
  '/manifest.json': 'no-cache, no-store, must-revalidate',
  '/index.html': 'no-cache, no-store, must-revalidate',
  default: 'public, max-age=3600',
};

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = decodeURIComponent(filePath);
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  if (req.url === '/sw.js') {
    res.setHeader('Service-Worker-Allowed', '/');
  }

  const cacheControlKey = Object.keys(CACHE_CONTROL).find(
    (key) => key !== 'default' && req.url.includes(key)
  );
  res.setHeader(
    'Cache-Control',
    cacheControlKey ? CACHE_CONTROL[cacheControlKey] : CACHE_CONTROL.default
  );

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Server running at port', process.env.PORT || 8080);
});
