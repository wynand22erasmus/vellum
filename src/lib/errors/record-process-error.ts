/**
 * Triple-write process error pipeline: disk, queue, HTTP.
 *
 * @packageDocumentation
 */

import { appendProcessErrorLog } from './process-error-logger.ts';
import { processErrorQueue, type ProcessErrorJobData } from '../../queues/processErrorQueue.ts';
import { prisma } from '../prisma.ts';

export type ProcessErrorSource = 'http' | 'worker' | 'bootstrap' | 'queue';

/** Payload for {@link recordProcessError} — same shape across HTTP and workers. */
export interface RecordProcessErrorInput {
  problemType: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  requestId?: string;
  source: ProcessErrorSource;
  userId?: string;
  documentId?: string;
  extensions?: Record<string, unknown>;
  internal?: Record<string, unknown>;
  jobId?: string;
  jobName?: string;
  /** Linked {@link FailedAuditLog} when audit enqueue/worker failed. */
  failedAuditLogId?: string;
  /** Alias for {@link failedAuditLogId}. */
  relatedFailedAuditLogId?: string;
  /** Linked {@link AuditLog} when correlation is known at record time. */
  auditLogId?: string;
  /** Shared incident UUID across audit and process-error pipelines. */
  correlationId?: string;
}

/**
 * Records an operational failure to disk and the process-errors queue (non-throwing).
 *
 * @param input - Normalized error fields
 */
export function recordProcessError(input: RecordProcessErrorInput): void {
  const failedAuditLogId = input.failedAuditLogId ?? input.relatedFailedAuditLogId;

  const record = {
    ...input,
    failedAuditLogId,
    recordedAt: new Date().toISOString(),
  };

  appendProcessErrorLog(record);

  const jobData: ProcessErrorJobData = {
    problemType: input.problemType,
    title: input.title,
    status: input.status,
    detail: input.detail,
    instance: input.instance,
    requestId: input.requestId,
    source: input.source,
    userId: input.userId,
    documentId: input.documentId,
    extensions: input.extensions,
    internal: {
      ...(input.internal ?? {}),
      ...(input.jobId ? { jobId: input.jobId } : {}),
      ...(input.jobName ? { jobName: input.jobName } : {}),
    },
    ...(failedAuditLogId ? { failedAuditLogId } : {}),
    ...(input.auditLogId ? { auditLogId: input.auditLogId } : {}),
    ...(input.correlationId ? { correlationId: input.correlationId } : {}),
  };

  processErrorQueue.add('persist-process-error', jobData).catch(async (err) => {
    try {
      await prisma.failedProcessError.create({
        data: {
          payload: jobData as object,
          error: err instanceof Error ? err.message : String(err),
        },
      });
    } catch {
      // Last-resort — nothing more we can do synchronously
    }
  });
}
