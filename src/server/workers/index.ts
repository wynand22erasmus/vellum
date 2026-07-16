/**
 * Worker process entrypoint: registers BullMQ schedulers and loads all workers.
 *
 * @packageDocumentation
 * @remarks Run via `npm run worker`. Registers hourly file purge and monthly record purge cron jobs.
 */

import { cleanupQueue } from '../queues/cleanupQueue.ts';
import { env } from '../../lib/env.ts';
import { recordProcessError } from '../../lib/errors/record-process-error.ts';
import { startSftpIngestion } from '../sftp/startSftpIngestion.ts';
import './emailWorker.ts';
import './auditWorker.ts';
import './filePurgeWorker.ts';
import './recordPurgeWorker.ts';
import './processErrorWorker.ts';
import './orphanReconciliationWorker.ts';
import './webhookWorker.ts';

/** @internal */
async function registerSchedulers(): Promise<void> {
  await cleanupQueue.upsertJobScheduler(
    'purge-files-hourly',
    { pattern: '0 * * * *' },
    { name: 'purge-files', data: {} },
  );

  await cleanupQueue.upsertJobScheduler(
    'purge-records-monthly',
    { pattern: '0 0 1 * *' },
    { name: 'purge-records', data: {} },
  );

  if (env.orphanReconcileEnabled) {
    await cleanupQueue.upsertJobScheduler(
      'reconcile-orphans-daily',
      { pattern: env.orphanReconcileCron },
      { name: 'reconcile-orphans', data: {} },
    );
  }

  console.log('[Workers] Schedulers registered');
}

registerSchedulers().catch((err) => {
  recordProcessError({
    problemType: 'https://vellum.dev/problems/internal-error',
    title: 'Internal Server Error',
    status: 500,
    detail: 'Failed to register worker schedulers.',
    source: 'bootstrap',
    internal: {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    },
  });
});

console.log('[Workers] BullMQ workers started');

startSftpIngestion().catch((err) => {
  recordProcessError({
    problemType: 'https://vellum.dev/problems/internal-error',
    title: 'Internal Server Error',
    status: 500,
    detail: 'Failed to start SFTP ingestion watcher.',
    source: 'bootstrap',
    internal: {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    },
  });
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
