/**
 * Deletes expired document objects from S3/MinIO on an hourly schedule.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import { prisma } from '../lib/prisma.ts';
import { deleteObject } from '../lib/storage/s3Client.ts';
import { auditQueue } from '../queues/auditQueue.ts';
import { redisConnection } from '../lib/redis.ts';

/**
 * Handles `cleanup-queue` jobs named `scrub-files`.
 *
 * @remarks Selects documents past `fileExpiresAt` with a non-null `s3Key`, deletes storage,
 * nulls `s3Key`, sets `deletedAt`, and emits `FILE_SCRUBBED` audit events.
 */
export const fileScrubWorker = new Worker(
  'cleanup-queue',
  async (job) => {
    if (job.name !== 'scrub-files') return;

    const expiredDocs = await prisma.document.findMany({
      where: {
        fileExpiresAt: { lt: new Date() },
        s3Key: { not: null },
      },
    });

    for (const doc of expiredDocs) {
      const originalS3Key = doc.s3Key!;
      try {
        await deleteObject(originalS3Key);
      } catch (err) {
        console.error(`[fileScrub] Failed to delete ${originalS3Key}:`, err);
        continue;
      }

      await prisma.document.update({
        where: { id: doc.id },
        data: { s3Key: null, deletedAt: new Date() },
      });

      await auditQueue.add('log-event', {
        eventType: 'FILE_SCRUBBED',
        documentId: doc.id,
        metadata: { originalS3Key },
      });
    }
  },
  { connection: redisConnection },
);

fileScrubWorker.on('failed', (job, err) => {
  console.error(`[fileScrubWorker] Job ${job?.id} failed:`, err);
});
