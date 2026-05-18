/**
 * Purges expired audit logs and document rows on a monthly schedule.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import { prisma } from '../lib/prisma.ts';
import { redisConnection } from '../lib/redis.ts';

/**
 * Handles `cleanup-queue` jobs named `scrub-records`.
 *
 * @remarks Deletes `AuditLog` rows past `expiresAt` and `Document` rows past `recordExpiresAt`.
 */
export const recordScrubWorker = new Worker(
  'cleanup-queue',
  async (job) => {
    if (job.name !== 'scrub-records') return;

    const now = new Date();

    await prisma.auditLog.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    await prisma.document.deleteMany({
      where: { recordExpiresAt: { lt: now } },
    });
  },
  { connection: redisConnection },
);

recordScrubWorker.on('failed', (job, err) => {
  console.error(`[recordScrubWorker] Job ${job?.id} failed:`, err);
});
