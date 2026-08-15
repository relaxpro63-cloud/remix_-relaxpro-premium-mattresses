import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 3000);
const DIST = path.join(ROOT, 'dist');

function loadEnv(): void {
  const envFile = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envFile)) return;
  const lines = fs.readFileSync(envFile, 'utf8').split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

function buildIfNeeded(): void {
  if (fs.existsSync(path.join(DIST, 'index.html'))) return;
  console.log('[local-server] dist/ not found, running npm run build...');
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
}

type HandlerModule = { default: (req: any, res: any) => void | Promise<void> };

async function loadHandler(name: string): Promise<HandlerModule> {
  return (await import(pathToFileURL(path.join(ROOT, 'api', name + '.ts')).href)) as HandlerModule;
}

function notFound(res: any, message: string): void {
  res.status(404).json({ error: message });
}

function serveStatic(req: http.IncomingMessage, res: http.ServerResponse): void {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname.startsWith('/assets/')) {
    const file = path.join(DIST, pathname);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      const body = fs.readFileSync(file);
      res.writeHead(200, { 'Content-Type': mimeFor(pathname) });
      res.end(body);
      return;
    }
  }

  const index = fs.readFileSync(path.join(DIST, 'index.html'));
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(index);
}

function mimeFor(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const table: Record<string, string> = {
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };
  return table[ext] || 'application/octet-stream';
}

function readBody(req: http.IncomingMessage): Promise<Record<string, unknown> | null> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      if (chunks.length === 0) return resolve(null);
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
  });
}

function makeVercelReq(req: http.IncomingMessage, body: any): VercelReqLike {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const query: Record<string, string | string[] | undefined> = {};
  for (const [k, v] of url.searchParams) {
    if (k in query) {
      const prev = query[k];
      query[k] = Array.isArray(prev) ? [...prev, v] : prev != null ? [prev, v] : v;
    } else {
      query[k] = v;
    }
  }
  return {
    method: req.method || 'GET',
    url: req.url || '/',
    headers: req.headers as Record<string, string | string[] | undefined>,
    query,
    body,
    cookies: {},
    env: {} as Record<string, string>,
    ip: '127.0.0.1',
  };
}

function makeVercelRes(res: http.ServerResponse): VercelResLike {
  let statusCode = 200;
  const headers: Record<string, string | number> = {};
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    setHeader(name, value) {
      headers[name] = value;
      return this;
    },
    json(payload) {
      res.writeHead(statusCode, {
        ...headers,
        'Content-Type': 'application/json; charset=utf-8',
      });
      res.end(JSON.stringify(payload));
      return this;
    },
    send(body) {
      res.writeHead(statusCode, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(String(body));
      return this;
    },
    end(data) {
      res.writeHead(statusCode, headers);
      res.end(data);
      return this as any;
    },
  };
}

type VercelReqLike = {
  method: string;
  url: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body: any;
  cookies: Record<string, unknown>;
  env: Record<string, string>;
  ip: string;
};

type VercelResLike = {
  status(code: number): VercelResLike;
  setHeader(name: string, value: string | number): VercelResLike;
  json(payload: unknown): { status: (code: number) => VercelResLike };
  send(body: unknown): { status: (code: number) => VercelResLike };
  end(data?: unknown): { status: (code: number) => VercelResLike };
};

const API_FILES: Record<string, string> = {
  '/api/chat': 'chat',
  '/api/products': 'products',
  '/api/lead': 'lead',
};

loadEnv();
buildIfNeeded();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  try {
    const handlerName = API_FILES[url.pathname];
    if (handlerName) {
      const handler = await loadHandler(handlerName);
      const body = await readBody(req);
      await handler.default(makeVercelReq(req, body), makeVercelRes(res));
      return;
    }
    serveStatic(req, res);
  } catch (err) {
    console.error('[local-server] error handling', req.method, req.url, err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    } else {
      res.end();
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[local-server] RelaxPro running at http://localhost:${PORT}`);
  console.log(`[local-server] GROQ_API_KEY ${process.env.GROQ_API_KEY ? 'set' : 'NOT SET'}`);
  console.log(
    `[local-server] GOOGLE_SCRIPT_URL ${process.env.GOOGLE_SCRIPT_URL || process.env.VITE_PUBLIC_GOOGLE_SCRIPT_URL ? 'set' : 'NOT SET'}`,
  );
});