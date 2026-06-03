/**
 * Bidirectional links between audit rows and process errors via explicit IDs or correlationId.
 *
 * @packageDocumentation
 */

import { prisma } from '../prisma.ts';

/**
 * Sets bidirectional {@link AuditLog} ↔ {@link ProcessError} links after both rows exist.
 */
export async function linkAuditLogToProcessError(
  auditLogId: string,
  processErrorId: string,
): Promise<void> {
  await prisma.$transaction([
    prisma.auditLog.update({
      where: { id: auditLogId },
      data: { processErrorId },
    }),
    prisma.processError.update({
      where: { id: processErrorId },
      data: { auditLogId },
    }),
  ]);
}

/** Sets {@link FailedAuditLog.processErrorId} after the process error row is persisted. */
export async function linkFailedAuditLogToProcessError(
  failedAuditLogId: string,
  processErrorId: string,
): Promise<void> {
  await prisma.failedAuditLog.update({
    where: { id: failedAuditLogId },
    data: { processErrorId },
  });
}

/**
 * Resolves a {@link ProcessError} by correlationId and links it to a new {@link AuditLog}.
 */
export async function linkAuditLogByCorrelationId(
  auditLogId: string,
  correlationId: string,
): Promise<void> {
  const processError = await prisma.processError.findFirst({
    where: { correlationId },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });
  if (processError) {
    await linkAuditLogToProcessError(auditLogId, processError.id);
  }
}

/**
 * Resolves an {@link AuditLog} by metadata.correlationId and links it to a new {@link ProcessError}.
 */
export async function linkProcessErrorByCorrelationId(
  processErrorId: string,
  correlationId: string,
): Promise<void> {
  const auditLog = await prisma.auditLog.findFirst({
    where: {
      metadata: {
        path: ['correlationId'],
        equals: correlationId,
      },
    },
    orderBy: { timestamp: 'desc' },
    select: { id: true },
  });
  if (auditLog) {
    await linkAuditLogToProcessError(auditLog.id, processErrorId);
  }
}

/** Reads correlationId from audit job metadata when not passed at the top level. */
export function correlationIdFromAuditJob(data: {
  correlationId?: string;
  metadata?: Record<string, unknown>;
}): string | undefined {
  if (typeof data.correlationId === 'string' && data.correlationId.length > 0) {
    return data.correlationId;
  }
  const fromMetadata = data.metadata?.correlationId;
  return typeof fromMetadata === 'string' && fromMetadata.length > 0 ? fromMetadata : undefined;
}
