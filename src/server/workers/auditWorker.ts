/**
 * Persists audit events from the `audit-queue` to PostgreSQL.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import type { AuditEventType, Prisma } from '../../../generated/client.ts';
import { addYears } from 'date-fns';
import { prisma } from '../../lib/prisma.ts';
import { env } from '../../lib/env.ts';
import {
  correlationIdFromAuditJob,
  linkAuditLogByCorrelationId,
} from '../../lib/errors/link-audit-process-error.ts';
import { recordProcessError } from '../../lib/errors/record-process-error.ts';
import { problemFromError } from '../../lib/errors/problem-from-error.ts';
import { redisConnection } from '../../lib/redis.ts';
import type { LogEventData } from '../queues/auditQueue.ts';
import { enqueueWebhookDelivery } from '../queues/webhookQueue.ts';

/**
 * Consumes `log-event` jobs and inserts `AuditLog` rows with compliance TTL.
 */
export const auditWorker = new Worker(
  'audit-queue',
  async (job) => {
    const data = job.data as LogEventData;
    const { eventType, documentId, userId, metadata, ip, userAgent } = data;

    const auditLog = await prisma.auditLog.create({
      data: {
        eventType: eventType as AuditEventType,
        documentId,
        userId,
        metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined,
        ipAddress: ip,
        userAgent,
        expiresAt: addYears(new Date(), env.reportingLifetimeYears),
      },
    });

    const correlationId = correlationIdFromAuditJob(data);
    if (correlationId) {
      await linkAuditLogByCorrelationId(auditLog.id, correlationId);
    }

    enqueueWebhookDelivery(auditLog.id, auditLog.eventType);
  },
  { connection: redisConnection },
);

auditWorker.on('failed', async (job, err) => {
  const jobData = (job?.data ?? {}) as LogEventData;
  const correlationId = correlationIdFromAuditJob(jobData);
  let failedAuditLogId: string | undefined;

  try {
    const failedAuditLog = await prisma.failedAuditLog.create({
      data: {
        payload: jobData as object,
        error: err instanceof Error ? err.message : String(err),
      },
    });
    failedAuditLogId = failedAuditLog.id;
  } catch {
    // Fall through to recordProcessError
  }

  const { problem, internal } = problemFromError(err);
  recordProcessError({
    problemType: problem.type,
    title: problem.title,
    status: problem.status,
    detail: problem.detail ?? problem.title,
    source: 'worker',
    documentId: jobData.documentId,
    userId: jobData.userId,
    jobId: job?.id,
    jobName: job?.name,
    internal,
    ...(correlationId ? { correlationId } : {}),
    ...(failedAuditLogId ? { failedAuditLogId } : {}),
  });
});
