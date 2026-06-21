/**
 * Persists process errors from the `process-errors-queue` to PostgreSQL.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import type { Prisma } from '../../../generated/client.ts';
import { createDeadLetter } from '../../lib/dead-letter.ts';
import { DeadLetterPipeline } from '../../../generated/enums.ts';
import {
  linkDeadLetterToProcessError,
  linkProcessErrorByCorrelationId,
} from '../../lib/errors/link-audit-process-error.ts';
import { prisma } from '../../lib/prisma.ts';
import { redisConnection } from '../../lib/redis.ts';
import type { ProcessErrorJobData } from '../queues/processErrorQueue.ts';

/**
 * Consumes `persist-process-error` jobs and inserts `ProcessError` rows.
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
        communicationId: data.communicationId,
        extensions: (data.extensions ?? undefined) as Prisma.InputJsonValue | undefined,
        internal: (data.internal ?? undefined) as Prisma.InputJsonValue | undefined,
        deadLetterId: data.deadLetterId,
        auditLogId: data.auditLogId,
        correlationId: data.correlationId,
      },
    });

    if (data.deadLetterId) {
      await linkDeadLetterToProcessError(data.deadLetterId, processError.processErrorId);
    }

    if (data.correlationId && !data.auditLogId) {
      await linkProcessErrorByCorrelationId(processError.processErrorId, data.correlationId);
    }
  },
  { connection: redisConnection },
);

processErrorWorker.on('failed', async (job, err) => {
  if (!job) return;
  try {
    await createDeadLetter({
      pipeline: DeadLetterPipeline.PROCESS_ERROR,
      payload: job.data as object,
      error: err instanceof Error ? err.message : String(err),
    });
  } catch {
    // Dead-letter write failed — already logged by BullMQ
  }
});
