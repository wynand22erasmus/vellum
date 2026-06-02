/**
 * Development API server (Express only, no Vite UI).
 *
 * @packageDocumentation
 */

import { createApp } from './app.ts';
import { recordProcessError } from './lib/errors/record-process-error.ts';
import { problemFromError } from './lib/errors/problem-from-error.ts';

const port = Number(process.env.PORT ?? 5173);
const host = '0.0.0.0';

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

app.listen(port, host, () => {
  console.log(`Vellum API listening on http://${host}:${port}`);
});
