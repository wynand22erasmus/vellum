/**
 * Purges expired audit logs and document rows on a monthly schedule.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import { purgeExpiredRecords } from '../../lib/retention/purge.ts';
import { recordProcessError } from '../../lib/errors/record-process-error.ts';
import { problemFromError } from '../../lib/errors/problem-from-error.ts';
import { redisConnection } from '../../lib/redis.ts';

/**
 * Handles `cleanup-queue` jobs named `purge-records`.
 */
export const recordPurgeWorker = new Worker(
  'cleanup-queue',
  async (job) => {
    if (job.name !== 'purge-records') return;

    await purgeExpiredRecords(new Date());
  },
  { connection: redisConnection },
);

recordPurgeWorker.on('failed', (job, err) => {
  const { problem, internal } = problemFromError(err);
  recordProcessError({
    problemType: problem.type,
    title: problem.title,
    status: problem.status,
    detail: problem.detail ?? problem.title,
    source: 'worker',
    jobId: job?.id,
    jobName: job?.name,
    internal,
  });
});
