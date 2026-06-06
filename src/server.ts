/**
 * Production HTTP server entrypoint (`npm run` via container CMD).
 *
 * @packageDocumentation
 * @remarks Listens on `env.port` (default 3000). Serves the SPA from `dist/` when `NODE_ENV=production`.
 */

import { createApp } from './server/create-app.ts';
import { env } from './lib/env.ts';
import { recordProcessError } from './lib/errors/record-process-error.ts';
import { problemFromError } from './lib/errors/problem-from-error.ts';

process.on('unhandledRejection', (reason) => {
  const { problem, internal } = problemFromError(reason);
  recordProcessError({
    problemType: problem.type,
    title: problem.title,
    status: problem.status,
    detail: problem.detail ?? problem.title,
    source: 'bootstrap',
    internal,
  });
});

process.on('uncaughtException', (err) => {
  const { problem, internal } = problemFromError(err);
  recordProcessError({
    problemType: problem.type,
    title: problem.title,
    status: problem.status,
    detail: problem.detail ?? problem.title,
    source: 'bootstrap',
    internal,
  });
});

const app = await createApp();

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Vellum API listening on port ${env.port}`);
});
