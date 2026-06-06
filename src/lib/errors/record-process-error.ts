/**
 * Triple-write process error pipeline: disk, queue, HTTP.
 *
 * @packageDocumentation
 */

import { appendProcessErrorLog } from './process-error-logger.ts';
import { processErrorQueue, type ProcessErrorJobData } from '../../server/queues/processErrorQueue.ts';
import { prisma } from '../prisma.ts';
import type { ProblemDetails } from '../http/problem-details.ts';

/** Origin of a persisted `ProcessError` row. */
export type ProcessErrorSource = 'http' | 'worker' | 'bootstrap' | 'queue';

/** Payload for `recordProcessError` — same shape across HTTP and workers. */
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
  /** Linked `FailedAuditLog` when audit enqueue/worker failed. */
  failedAuditLogId?: string;
  /** Alias for {@link failedAuditLogId}. */
  relatedFailedAuditLogId?: string;
  /** Linked `AuditLog` when correlation is known at record time. */
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

const PROBLEM_RESERVED_KEYS = new Set(['type', 'title', 'status', 'detail', 'instance']);

function extractProblemExtensions(problem: ProblemDetails): Record<string, unknown> {
  const extensions: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(problem)) {
    if (!PROBLEM_RESERVED_KEYS.has(key)) {
      extensions[key] = value;
    }
  }
  return extensions;
}

/** Persists a normalized Problem Details envelope. */
export function recordProcessErrorFromProblem(
  problem: ProblemDetails,
  ctx: {
    source: ProcessErrorSource;
    instance?: string;
    requestId?: string;
    userId?: string;
    documentId?: string;
    internal?: Record<string, unknown>;
    correlationId?: string;
    failedAuditLogId?: string;
    auditLogId?: string;
    jobId?: string;
    jobName?: string;
  },
): void {
  const extensions = extractProblemExtensions(problem);
  const correlationId =
    ctx.correlationId ??
    (typeof extensions.correlationId === 'string' ? extensions.correlationId : undefined);

  recordProcessError({
    problemType: problem.type,
    title: problem.title,
    status: problem.status,
    detail: problem.detail ?? problem.title,
    instance: ctx.instance ?? problem.instance,
    requestId: ctx.requestId,
    source: ctx.source,
    userId: ctx.userId,
    documentId: ctx.documentId,
    extensions,
    internal: ctx.internal,
    correlationId,
    failedAuditLogId: ctx.failedAuditLogId,
    auditLogId: ctx.auditLogId,
    jobId: ctx.jobId,
    jobName: ctx.jobName,
  });
}
