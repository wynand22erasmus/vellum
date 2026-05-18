/**
 * BullMQ queue for asynchronous audit log writes.
 *
 * @packageDocumentation
 */

import { Queue } from 'bullmq';
import type { AuditEventType } from '../../generated/client.ts';
import { prisma } from '../lib/prisma.ts';
import { redisConnection } from '../lib/redis.ts';

/** BullMQ queue name: `audit-queue`. Processed by {@link ../workers/auditWorker.ts}. */
export const auditQueue = new Queue('audit-queue', { connection: redisConnection });

/** Payload for a single audit event job (`log-event`). */
export interface LogEventData {
  /** Event kind stored on {@link !AuditLog}. */
  eventType: AuditEventType;
  /** Related document id, when applicable. */
  documentId?: string;
  /** Dashboard user id, when applicable. */
  userId?: string;
  /** Extra JSON metadata (request context, scrub details, etc.). */
  metadata?: Record<string, unknown>;
  /** Client IP captured at request time. */
  ip?: string;
  /** `User-Agent` header captured at request time. */
  userAgent?: string;
}

/**
 * Enqueues an audit event for durable write via the audit worker.
 *
 * @param data - Event fields; failures are persisted to `FailedAuditLog`
 * @remarks Fire-and-forget; errors are logged and dead-lettered, not thrown to callers
 */
export function logEvent(data: LogEventData): void {
  auditQueue.add('log-event', data).catch(async (err) => {
    console.error('[AuditQueue] Failed to enqueue audit event:', err);
    try {
      await prisma.failedAuditLog.create({
        data: {
          payload: data as object,
          error: err instanceof Error ? err.message : String(err),
        },
      });
    } catch (fallbackErr) {
      console.error('[AuditQueue] Failed to write FailedAuditLog:', fallbackErr);
    }
  });
}
