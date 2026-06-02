/**
 * Persists process errors from the `process-errors-queue` to PostgreSQL.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import type { Prisma } from '../../generated/client.ts';
import {
  linkFailedAuditLogToProcessError,
  linkProcessErrorByCorrelationId,
} from '../lib/errors/link-audit-process-error.ts';
import { prisma } from '../lib/prisma.ts';
import { redisConnection } from '../lib/redis.ts';
import type { ProcessErrorJobData } from '../queues/processErrorQueue.ts';

/**
 * Consumes `persist-process-error` jobs and inserts {@link !ProcessError} rows.
 */
export const processErrorWorker = new Worker(
  'process-errors-queue',
  async (job) => {
    const data = job.data as ProcessErrorJobData;

    const processError = await prisma.processError.create({
      data: {
        problemType: data.problemType,
        title: data.title,
        status: data.status,
        detail: data.detail,
        instance: data.instance,
        requestId: data.requestId,
        source: data.source,
        userId: data.userId,
        documentId: data.documentId,
        extensions: (data.extensions ?? undefined) as Prisma.InputJsonValue | undefined,
        internal: (data.internal ?? undefined) as Prisma.InputJsonValue | undefined,
        failedAuditLogId: data.failedAuditLogId,
        auditLogId: data.auditLogId,
        correlationId: data.correlationId,
      },
    });

    if (data.failedAuditLogId) {
      await linkFailedAuditLogToProcessError(data.failedAuditLogId, processError.id);
    }

    if (data.correlationId && !data.auditLogId) {
      await linkProcessErrorByCorrelationId(processError.id, data.correlationId);
    }
  },
  { connection: redisConnection },
);

processErrorWorker.on('failed', async (job, err) => {
  if (!job) return;
  try {
    await prisma.failedProcessError.create({
      data: {
        payload: job.data as object,
        error: err instanceof Error ? err.message : String(err),
      },
    });
  } catch {
    // Dead-letter write failed — already logged by BullMQ
  }
});
