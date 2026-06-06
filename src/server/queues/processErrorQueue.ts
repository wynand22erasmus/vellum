/**
 * BullMQ queue for persisting process errors to PostgreSQL.
 *
 * @packageDocumentation
 */

import { Queue } from 'bullmq';
import { redisConnection } from '../../lib/redis.ts';

/** BullMQ queue name: `process-errors-queue`. */
export const processErrorQueue = new Queue('process-errors-queue', {
  connection: redisConnection,
});

/** Payload for a single process-error persistence job. */
export interface ProcessErrorJobData {
  problemType: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  requestId?: string;
  source: string;
  userId?: string;
  documentId?: string;
  extensions?: Record<string, unknown>;
  internal?: Record<string, unknown>;
  /** Linked `FailedAuditLog` when audit enqueue/worker failed. */
  failedAuditLogId?: string;
  /** Linked `AuditLog` when correlation is known at record time. */
  auditLogId?: string;
  /** Shared incident UUID across audit and process-error pipelines. */
  correlationId?: string;
}
