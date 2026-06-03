/**
 * Orphan reconciliation worker — cleans up resources from failed compensations.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import { reconcileOrphansFromProcessErrors } from '../lib/compensation/reconcile-orphan.ts';
import { recordProcessError } from '../lib/errors/record-process-error.ts';
import { problemFromError } from '../lib/errors/problem-from-error.ts';
import { redisConnection } from '../lib/redis.ts';

/** BullMQ worker that reconciles orphaned resources from {@link ProcessError} rows. */
export const orphanReconciliationWorker = new Worker(
  'cleanup-queue',
  async (job) => {
    if (job.name !== 'reconcile-orphans') return;

    const result = await reconcileOrphansFromProcessErrors();

    if (result.partialFailures > 0) {
      recordProcessError({
        problemType: 'https://vellum.dev/problems/partial-failure',
        title: 'Partial Failure',
        status: 500,
        detail: `Orphan reconciliation completed with ${result.partialFailures} partial failure(s).`,
        source: 'worker',
        jobId: job.id,
        jobName: job.name,
        internal: { result },
      });
    }
  },
  { connection: redisConnection },
);

orphanReconciliationWorker.on('failed', (job, err) => {
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
