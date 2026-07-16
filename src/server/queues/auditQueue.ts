/**
 * BullMQ queue for asynchronous audit log writes.
 *
 * @packageDocumentation
 */

import { Queue } from 'bullmq';
import type { AuditEventType } from '../../../generated/client.ts';
import { createDeadLetter } from '../../lib/dead-letter.ts';
import { DeadLetterPipeline } from '../../../generated/enums.ts';
import { problemFromError } from '../../lib/errors/problem-from-error.ts';
import { recordProcessError } from '../../lib/errors/record-process-error.ts';
import { redisConnection } from '../../lib/redis.ts';

/** BullMQ queue name: `audit-queue`. Processed by `auditWorker`. */
export const auditQueue = new Queue('audit-queue', { connection: redisConnection });

/** Payload for a single audit event job (`log-event`). */
export interface LogEventData {
  eventType: AuditEventType;
  /** Envelope id for document-level events (e.g. LINK_REVOKED). */
  documentId?: string;
  /** Specific outbound communication id for link-level events. */
  communicationId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  correlationId?: string;
}

/**
 * Enqueues an audit event for durable write via the audit worker.
 */
export function logEvent(data: LogEventData): void {
  auditQueue.add('log-event', data).catch(async (err) => {
    let deadLetterId: string | undefined;
    try {
      const deadLetter = await createDeadLetter({
        pipeline: DeadLetterPipeline.AUDIT,
        payload: data,
        error: err instanceof Error ? err.message : String(err),
      });
      deadLetterId = deadLetter.deadLetterId;
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
      communicationId: data.communicationId,
      userId: data.userId,
      internal: { ...internal, auditPayload: data },
      ...(data.correlationId ? { correlationId: data.correlationId } : {}),
      ...(deadLetterId ? { deadLetterId } : {}),
    });
  });
}
