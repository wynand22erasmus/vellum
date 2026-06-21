/**
 * Orphaned resource types and helpers for compensation failures.
 *
 * @packageDocumentation
 */

import { AppError } from '../errors/app-error.ts';

/** A resource left inconsistent after a failed compensation attempt. */
export type OrphanedResource =
  | { kind: 's3Object'; s3Key: string }
  | { kind: 'file'; fileId: string }
  | { kind: 'document'; documentId: string }
  | { kind: 'communication'; communicationId: string };

/**
 * Builds RFC 9457 extension members for orphaned resources.
 *
 * @param resources - Resources that could not be cleaned up
 * @param compensationAttempted - Whether undo steps were attempted
 * @param compensationFailed - Whether any undo step failed
 */
export function toOrphanExtension(
  resources: OrphanedResource[],
  compensationAttempted = true,
  compensationFailed = true,
): Record<string, unknown> {
  return {
    orphanedResources: resources,
    compensationAttempted,
    compensationFailed,
  };
}

/**
 * Wraps a cause error with partial-failure semantics and orphan metadata.
 *
 * @param cause - Original failure
 * @param orphans - Resources that remain inconsistent
 * @param detail - User-safe message
 */
export function compensationFailedError(
  cause: unknown,
  orphans: OrphanedResource[],
  detail = 'The operation failed and automatic cleanup could not complete. Support has been notified.',
): AppError {
  return AppError.partialFailure(detail, {
    cause,
    orphanedResources: orphans,
    extensions: toOrphanExtension(orphans),
  });
}

/** Reads the primary key from a stored orphan entry (supports legacy `id` keys). */
export function orphanResourceKey(entry: OrphanedResource): string {
  switch (entry.kind) {
    case 's3Object':
      return entry.s3Key;
    case 'file':
      return entry.fileId;
    case 'document':
      return entry.documentId;
    case 'communication':
      return entry.communicationId;
  }
}
