/**
 * Purges expired audit logs and document rows on a monthly schedule.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import { subYears } from 'date-fns';
import { prisma } from '../../lib/prisma.ts';
import { env } from '../../lib/env.ts';
import { recordProcessError } from '../../lib/errors/record-process-error.ts';
import { problemFromError } from '../../lib/errors/problem-from-error.ts';
import { redisConnection } from '../../lib/redis.ts';

/**
 * Handles `cleanup-queue` jobs named `scrub-records`.
 */
export const recordScrubWorker = new Worker(
  'cleanup-queue',
  async (job) => {
    if (job.name !== 'scrub-records') return;

    const now = new Date();
    const retentionCutoff = subYears(now, env.reportingLifetimeYears);

    await prisma.auditLog.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    await prisma.documentFile.deleteMany({
      where: { recordExpiresAt: { lt: now } },
    });

    await prisma.processError.deleteMany({
      where: { createdAt: { lt: retentionCutoff } },
    });

    await prisma.failedProcessError.deleteMany({
      where: { createdAt: { lt: retentionCutoff } },
    });
  },
  { connection: redisConnection },
);

recordScrubWorker.on('failed', (job, err) => {
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
