import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function sendJson(response, statusCode, payload) {
  const body = `${JSON.stringify(payload)}\n`;
  response.writeHead(statusCode, {
    'content-length': Buffer.byteLength(body),
    'content-type': 'application/json; charset=utf-8',
  });
  response.end(body);
}

function sendText(response, statusCode, body, contentType) {
  response.writeHead(statusCode, {
    'content-length': Buffer.byteLength(body),
    'content-type': contentType,
  });
  response.end(body);
}

async function readJsonBody(request) {
  const chunks = [];
  let totalSize = 0;

  for await (const chunk of request) {
    totalSize += chunk.byteLength;
    if (totalSize > 1024 * 1024) {
      const error = new Error('Request body is too large.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request body must be valid JSON.');
    error.statusCode = 400;
    throw error;
  }
}

async function sendStaticOrIndex(response, distDir, pathname) {
  const safeDist = resolve(distDir);
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const candidatePath = resolve(safeDist, `.${requestedPath}`);

  if (!candidatePath.startsWith(safeDist)) {
    sendJson(response, 403, { error: 'Forbidden' });
    return;
  }

  const pathHasExtension = Boolean(extname(candidatePath));
  const filePath = pathHasExtension ? candidatePath : resolve(safeDist, 'index.html');

  try {
    const file = await readFile(filePath);
    const type = contentTypes[extname(filePath)] ?? 'application/octet-stream';
    response.writeHead(200, {
      'content-length': file.byteLength,
      'content-type': type,
    });
    response.end(file);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    const indexFile = await readFile(resolve(safeDist, 'index.html'), 'utf8');
    sendText(response, 200, indexFile, contentTypes['.html']);
  }
}

async function routeApi(request, response, store, pathname) {
  if (request.method === 'GET' && pathname === '/api/health') {
    sendJson(response, 200, { ok: true, service: 'thread-canary' });
    return;
  }

  if (request.method === 'GET' && pathname === '/api/canary-state') {
    sendJson(response, 200, await store.getCanaryState());
    return;
  }

  const actionMatch = pathname.match(/^\/api\/actions\/([^/]+)\/complete$/);
  if (request.method === 'POST' && actionMatch) {
    sendJson(response, 200, await store.completeAction(decodeURIComponent(actionMatch[1])));
    return;
  }

  const moduleMatch = pathname.match(/^\/api\/modules\/([^/]+)\/activate$/);
  if (request.method === 'POST' && moduleMatch) {
    sendJson(response, 200, await store.activateModule(decodeURIComponent(moduleMatch[1])));
    return;
  }

  if (request.method === 'POST' && pathname === '/api/memory') {
    const body = await readJsonBody(request);
    sendJson(response, 200, await store.addMemory(body.text));
    return;
  }

  if (request.method === 'POST' && pathname === '/api/documents') {
    const body = await readJsonBody(request);
    sendJson(response, 200, await store.addDocument(body));
    return;
  }

  if (request.method === 'POST' && pathname === '/api/agent/messages') {
    const body = await readJsonBody(request);
    sendJson(response, 200, await store.sendAgentMessage(body.text));
    return;
  }

  sendJson(response, 404, { error: 'Not found' });
}

export function createHttpServer({ store, distDir }) {
  if (!store) {
    throw new Error('createHttpServer requires a canary store.');
  }

  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');

      if (url.pathname.startsWith('/api/')) {
        await routeApi(request, response, store, url.pathname);
        return;
      }

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        sendJson(response, 405, { error: 'Method not allowed' });
        return;
      }

      await sendStaticOrIndex(response, distDir, url.pathname);
    } catch (error) {
      const statusCode = error.statusCode ?? 500;
      sendJson(response, statusCode, {
        error: statusCode === 500 ? 'Internal server error' : error.message,
      });
    }
  });
}
