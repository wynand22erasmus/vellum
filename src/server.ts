/**
 * Production HTTP server entrypoint (`npm run` via container CMD).
 *
 * @packageDocumentation
 * @remarks Listens on `env.port` (default 3000). Serves the SPA from `dist/` when `NODE_ENV=production`.
 */

import { createApp } from './app.ts';
import { env } from './lib/env.ts';

const app = await createApp();

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Vellum API listening on port ${env.port}`);
});
