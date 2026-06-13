import { join } from 'node:path';
import { createCanaryStore } from './canaryStore.mjs';
import { createHttpServer } from './httpServer.mjs';

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? 8787);
const distDir = process.env.DIST_DIR ?? join(process.cwd(), 'dist');
const stateFilePath = process.env.CANARY_STATE_FILE ?? join(process.cwd(), '.data', 'canary-state.json');

const store = await createCanaryStore({ filePath: stateFilePath });
const server = createHttpServer({ store, distDir });

server.listen(port, host, () => {
  console.log(`College Life OS canary running at http://${host}:${port}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}; shutting down canary server.`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
