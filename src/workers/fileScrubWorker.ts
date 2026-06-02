/**
 * Deletes expired document objects from S3/MinIO on an hourly schedule.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import { prisma } from '../lib/prisma.ts';
import { CompensationStack } from '../lib/compensation/compensation-stack.ts';
import { deleteObjectIfExists } from '../lib/compensation/storage.ts';
import { recordProcessError } from '../lib/errors/record-process-error.ts';
import {
  problemFromError,
  type ProblemDetails,
} from '../lib/errors/problem-from-error.ts';
import { logEvent } from '../queues/auditQueue.ts';
import { redisConnection } from '../lib/redis.ts';

/**
 * Handles `cleanup-queue` jobs named `scrub-files`.
 *
 * @remarks DB update before S3 delete; per-document compensation on failure.
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
      const snapshot = {
        s3Key: doc.s3Key,
        deletedAt: doc.deletedAt,
      };

      const stack = new CompensationStack();

      try {
        await stack.run(async () => {
          await prisma.document.update({
            where: { id: doc.id },
            data: { s3Key: null, deletedAt: new Date() },
          });

          stack.registerUndo(
            'restore document s3Key',
            async () => {
              await prisma.document.update({
                where: { id: doc.id },
                data: { s3Key: snapshot.s3Key, deletedAt: snapshot.deletedAt },
              });
            },
            () => ({ kind: 's3Object', s3Key: originalS3Key }),
          );

          await deleteObjectIfExists(originalS3Key);
        });

        logEvent({
          eventType: 'FILE_SCRUBBED',
          documentId: doc.id,
          metadata: { originalS3Key },
        });
      } catch (err) {
        const { problem, internal } = problemFromError(err);
        const extensions = extensionsFromProblem(problem);
        recordProcessError({
          problemType: problem.type,
          title: problem.title,
          status: problem.status,
          detail: problem.detail ?? problem.title,
          source: 'worker',
          documentId: doc.id,
          jobId: job.id,
          jobName: job.name,
          ...(Object.keys(extensions).length > 0 ? { extensions } : {}),
          internal,
        });
      }
    }
  },
  { connection: redisConnection },
);

function extensionsFromProblem(problem: ProblemDetails): Record<string, unknown> {
  const reserved = new Set(['type', 'title', 'status', 'detail', 'instance']);
  const extensions: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(problem)) {
    if (!reserved.has(key)) {
      extensions[key] = value;
    }
  }
  return extensions;
}

fileScrubWorker.on('failed', (job, err) => {
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
