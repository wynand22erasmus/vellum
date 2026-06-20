/**
 * Orphaned resource types and helpers for compensation failures.
 *
 * @packageDocumentation
 */

import { AppError } from '../errors/app-error.ts';

/** A resource left inconsistent after a failed compensation attempt. */
export type OrphanedResource =
  | { kind: 's3Object'; s3Key: string }
  | { kind: 'document'; id: string }
  | { kind: 'documentFile'; id: string }
  | { kind: 'presignedUrl'; documentId: string };

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
