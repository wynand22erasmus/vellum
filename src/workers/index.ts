import { cleanupQueue } from '../queues/cleanupQueue.ts';
import './emailWorker.ts';
import './auditWorker.ts';
import './fileScrubWorker.ts';
import './recordScrubWorker.ts';

async function registerSchedulers(): Promise<void> {
  await cleanupQueue.upsertJobScheduler(
    'scrub-files-hourly',
    { pattern: '0 * * * *' },
    { name: 'scrub-files', data: {} },
  );

  await cleanupQueue.upsertJobScheduler(
    'scrub-records-monthly',
    { pattern: '0 0 1 * *' },
    { name: 'scrub-records', data: {} },
  );

  console.log('[Workers] Schedulers registered');
}

registerSchedulers().catch((err) => {
  console.error('[Workers] Failed to register schedulers:', err);
});

console.log('[Workers] BullMQ workers started');

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));
