/**
 * Bidirectional links between audit rows and process errors via explicit IDs or correlationId.
 *
 * @packageDocumentation
 */

import { prisma } from '../prisma.ts';

/**
 * Sets bidirectional `AuditLog` ↔ `ProcessError` links after both rows exist.
 */
export async function linkAuditLogToProcessError(
  auditLogId: string,
  processErrorId: string,
): Promise<void> {
  await prisma.$transaction([
    prisma.auditLog.update({
      where: { auditLogId },
      data: { processErrorId },
    }),
    prisma.processError.update({
      where: { processErrorId },
      data: { auditLogId },
    }),
  ]);
}

/** Sets dead-letter `linkedTable`/`linkedId` after the process error row is persisted. */
export async function linkDeadLetterToProcessError(
  deadLetterId: string,
  processErrorId: string,
): Promise<void> {
  await prisma.deadLetter.update({
    where: { deadLetterId },
    data: {
      linkedTable: 'ProcessError',
      linkedId: processErrorId,
    },
  });
}

/**
 * Resolves a `ProcessError` by correlationId and links it to a new `AuditLog`.
 */
export async function linkAuditLogByCorrelationId(
  auditLogId: string,
  correlationId: string,
): Promise<void> {
  const processError = await prisma.processError.findFirst({
    where: { correlationId },
    orderBy: { createdAt: 'desc' },
    select: { processErrorId: true },
  });
  if (processError) {
    await linkAuditLogToProcessError(auditLogId, processError.processErrorId);
  }
}

/**
 * Resolves an `AuditLog` by metadata.correlationId and links it to a new `ProcessError`.
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
    orderBy: { createdAt: 'desc' },
    select: { auditLogId: true },
  });
  if (auditLog) {
    await linkAuditLogToProcessError(auditLog.auditLogId, processErrorId);
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
