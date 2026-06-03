/**
 * Orphan reconciliation for ProcessError rows with unresolved resources.
 *
 * @packageDocumentation
 */

import type { Prisma } from '../../../generated/client.ts';
import { prisma } from '../prisma.ts';
import { deleteDocumentIfExists } from './document.ts';
import { deleteObjectIfExists } from './storage.ts';
import type { OrphanedResource } from './orphan.ts';

const MAX_RECONCILE_ATTEMPTS = 5;

/** Summary counts from a reconciliation batch run. */
export interface ReconcileResult {
  processed: number;
  reconciled: number;
  partialFailures: number;
}

function parseOrphans(extensions: unknown): OrphanedResource[] {
  if (!extensions || typeof extensions !== 'object') {
    return [];
  }
  const raw = (extensions as { orphanedResources?: unknown }).orphanedResources;
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter(isOrphanedResource);
}

function isOrphanedResource(value: unknown): value is OrphanedResource {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const kind = (value as { kind?: string }).kind;
  if (kind === 's3Object') {
    return typeof (value as { s3Key?: string }).s3Key === 'string';
  }
  if (kind === 'document') {
    return typeof (value as { id?: string }).id === 'string';
  }
  return false;
}

async function reconcileOrphan(entry: OrphanedResource): Promise<void> {
  if (entry.kind === 's3Object') {
    await deleteObjectIfExists(entry.s3Key);
    return;
  }
  if (entry.kind === 'document') {
    const doc = await prisma.document.findUnique({
      where: { id: entry.id },
      select: { s3Key: true, linkExpiresAt: true },
    });
    if (!doc) {
      return;
    }
    const linkActive = doc.s3Key !== null && new Date() <= doc.linkExpiresAt;
    if (linkActive) {
      return;
    }
    if (doc.s3Key === null) {
      await deleteDocumentIfExists(entry.id);
    }
  }
}

/**
 * Attempts to clean up orphaned resources recorded on open ProcessError rows.
 */
export async function reconcileOrphansFromProcessErrors(): Promise<ReconcileResult> {
  const rows = await prisma.processError.findMany({
    where: {
      reconciledAt: null,
      reconcileAttempts: { lt: MAX_RECONCILE_ATTEMPTS },
    },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  let reconciled = 0;
  let partialFailures = 0;

  for (const row of rows) {
    const orphans = parseOrphans(row.extensions);
    if (orphans.length === 0) {
      continue;
    }

    const failures: string[] = [];
    for (const orphan of orphans) {
      try {
        await reconcileOrphan(orphan);
      } catch (err) {
        failures.push(err instanceof Error ? err.message : String(err));
      }
    }

    if (failures.length === 0) {
      await prisma.processError.update({
        where: { id: row.id },
        data: {
          reconciledAt: new Date(),
          internal: {
            ...(typeof row.internal === 'object' && row.internal !== null
              ? (row.internal as Record<string, unknown>)
              : {}),
            orphanedResourcesResolved: true,
          } as Prisma.InputJsonValue,
        },
      });
      reconciled += 1;
    } else {
      await prisma.processError.update({
        where: { id: row.id },
        data: {
          reconcileAttempts: { increment: 1 },
          internal: {
            ...(typeof row.internal === 'object' && row.internal !== null
              ? (row.internal as Record<string, unknown>)
              : {}),
            reconcileFailures: failures,
          } as Prisma.InputJsonValue,
        },
      });
      partialFailures += 1;
    }
  }

  return { processed: rows.length, reconciled, partialFailures };
}
