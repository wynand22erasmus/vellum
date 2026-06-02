/**
 * BullMQ queue for asynchronous audit log writes.
 *
 * @packageDocumentation
 */

import { Queue } from 'bullmq';
import type { AuditEventType } from '../../generated/client.ts';
import { problemFromError } from '../lib/errors/problem-from-error.ts';
import { recordProcessError } from '../lib/errors/record-process-error.ts';
import { prisma } from '../lib/prisma.ts';
import { redisConnection } from '../lib/redis.ts';

/** BullMQ queue name: `audit-queue`. Processed by {@link ../workers/auditWorker.ts}. */
export const auditQueue = new Queue('audit-queue', { connection: redisConnection });

/** Payload for a single audit event job (`log-event`). */
export interface LogEventData {
  eventType: AuditEventType;
  documentId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  /** Shared incident UUID for linking to {@link ProcessError}. */
  correlationId?: string;
}

/**
 * Enqueues an audit event for durable write via the audit worker.
 */
export function logEvent(data: LogEventData): void {
  auditQueue.add('log-event', data).catch(async (err) => {
    let failedAuditLogId: string | undefined;
    try {
      const failedAuditLog = await prisma.failedAuditLog.create({
        data: {
          payload: data as object,
          error: err instanceof Error ? err.message : String(err),
        },
      });
      failedAuditLogId = failedAuditLog.id;
    } catch {
      // Continue to unified observability pipeline
    }

    const { problem, internal } = problemFromError(err);
    recordProcessError({
      problemType: problem.type,
      title: problem.title,
      status: problem.status,
      detail: problem.detail ?? problem.title,
      source: 'queue',
      documentId: data.documentId,
      userId: data.userId,
      internal: { ...internal, auditPayload: data },
      ...(data.correlationId ? { correlationId: data.correlationId } : {}),
      ...(failedAuditLogId ? { failedAuditLogId } : {}),
    });
  });
}
