import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createCanaryStore } from './canaryStore.mjs';
import { createHttpServer } from './httpServer.mjs';

async function createRunningServer() {
  const dir = await mkdtemp(join(tmpdir(), 'college-os-http-'));
  const distDir = join(dir, 'dist');
  await mkdir(distDir, { recursive: true });
  await writeFile(join(distDir, 'index.html'), '<!doctype html><div id="root"></div>');

  const store = await createCanaryStore({ filePath: join(dir, 'state.json') });
  const server = createHttpServer({ store, distDir });

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  return {
    server,
    url: `http://127.0.0.1:${address.port}`,
  };
}

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

describe('canary HTTP server', () => {
  it('returns health and canary state', async () => {
    const { server, url } = await createRunningServer();

    try {
      const healthResponse = await fetch(`${url}/api/health`);
      const health = await healthResponse.json();
      const stateResponse = await fetch(`${url}/api/canary-state`);
      const state = await stateResponse.json();

      expect(healthResponse.status).toBe(200);
      expect(health).toEqual({ ok: true, service: 'college-life-os-canary' });
      expect(stateResponse.status).toBe(200);
      expect(state.profile.name).toBe('Maya');
      expect(state.actions.map((action) => action.id)).toContain('care-red-flag');
    } finally {
      await closeServer(server);
    }
  });

  it('persists action completion and module activation through API mutations', async () => {
    const { server, url } = await createRunningServer();

    try {
      const completedResponse = await fetch(`${url}/api/actions/care-red-flag/complete`, { method: 'POST' });
      const completedState = await completedResponse.json();
      const activatedResponse = await fetch(`${url}/api/modules/nutrition-patterns/activate`, { method: 'POST' });
      const activatedState = await activatedResponse.json();

      expect(completedResponse.status).toBe(200);
      expect(completedState.completedActionIds).toContain('care-red-flag');
      expect(completedState.actions.find((action) => action.id === 'care-red-flag')).toMatchObject({
        completed: true,
      });
      expect(activatedResponse.status).toBe(200);
      expect(activatedState.activatedModuleIds).toContain('nutrition-patterns');
      expect(activatedState.recommendedModules.find((module) => module.id === 'nutrition-patterns')).toMatchObject({
        activated: true,
      });
    } finally {
      await closeServer(server);
    }
  });

  it('accepts student-owned memory and document ingestion without auth for the demo', async () => {
    const { server, url } = await createRunningServer();

    try {
      const memoryResponse = await fetch(`${url}/api/memory`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: 'Needs quiet breakfast before chemistry lab.' }),
      });
      const memoryState = await memoryResponse.json();
      const documentResponse = await fetch(`${url}/api/documents`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: 'Campus clinic receipt', kind: 'Receipt', status: 'Captured' }),
      });
      const documentState = await documentResponse.json();

      expect(memoryResponse.status).toBe(200);
      expect(memoryState.profile.memory).toContain('Needs quiet breakfast before chemistry lab.');
      expect(documentResponse.status).toBe(200);
      expect(documentState.profile.documents).toContainEqual(
        expect.objectContaining({ title: 'Campus clinic receipt', kind: 'Receipt', status: 'Captured' }),
      );
    } finally {
      await closeServer(server);
    }
  });

  it('serves the app shell for non-API routes', async () => {
    const { server, url } = await createRunningServer();

    try {
      const response = await fetch(`${url}/student/today`);
      const html = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/html');
      expect(html).toContain('<div id="root"></div>');
    } finally {
      await closeServer(server);
    }
  });
});
