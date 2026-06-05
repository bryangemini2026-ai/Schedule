const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function readJson(name) {
  const file = path.join(DATA_DIR, name);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') return {};
    throw e;
  }
}

function writeJson(name, data) {
  const file = path.join(DATA_DIR, name);
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/a' && req.method === 'GET') {
      return send(res, 200, JSON.stringify(readJson('a.json')));
    }
    if (url.pathname === '/api/a' && req.method === 'PUT') {
      const body = await readBody(req);
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return send(res, 400, JSON.stringify({ error: 'object required' }));
      }
      writeJson('a.json', body);
      return send(res, 200, JSON.stringify({ ok: true }));
    }
    if (url.pathname === '/api/b' && req.method === 'GET') {
      return send(res, 200, JSON.stringify(readJson('b.json')));
    }
    if (url.pathname === '/api/b' && req.method === 'PUT') {
      const body = await readBody(req);
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return send(res, 400, JSON.stringify({ error: 'object required' }));
      }
      writeJson('b.json', body);
      return send(res, 200, JSON.stringify({ ok: true }));
    }
    if (url.pathname === '/api/messages' && req.method === 'GET') {
      return send(res, 200, JSON.stringify(readJson('messages.json')));
    }
    if (url.pathname === '/api/messages' && req.method === 'PUT') {
      const body = await readBody(req);
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return send(res, 400, JSON.stringify({ error: 'object required' }));
      }
      writeJson('messages.json', body);
      return send(res, 200, JSON.stringify({ ok: true }));
    }

    if (req.method !== 'GET') return send(res, 405, JSON.stringify({ error: 'method not allowed' }));

    let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
    filePath = path.join(ROOT, filePath);
    if (!filePath.startsWith(ROOT)) return send(res, 403, 'forbidden');

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return send(res, 404, 'not found', 'text/plain; charset=utf-8');
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(filePath).pipe(res);
  } catch (e) {
    send(res, 500, JSON.stringify({ error: e.message || 'server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`schedule-share running at http://localhost:${PORT}`);
});
