/**
 * Document compensation helpers.
 *
 * @packageDocumentation
 */

import { prisma } from '../prisma.ts';

/** Prior download-link fields captured before compensation rollback. */
export interface DocumentLinkSnapshot {
  downloadToken: string;
  linkExpiresAt: Date;
  isUsed: boolean;
}

/**
 * Deletes a document row if it exists (idempotent).
 *
 * @param id - Document primary key
 */
export async function deleteDocumentIfExists(id: string): Promise<void> {
  await prisma.document.deleteMany({ where: { id } });
}

/**
 * Restores link-related fields from a snapshot taken before mutation.
 *
 * @param id - Document primary key
 * @param snapshot - Prior token, expiry, and used flag
 */
export async function revertDocumentLinkState(
  id: string,
  snapshot: DocumentLinkSnapshot,
): Promise<void> {
  await prisma.document.update({
    where: { id },
    data: {
      downloadToken: snapshot.downloadToken,
      linkExpiresAt: snapshot.linkExpiresAt,
      isUsed: snapshot.isUsed,
    },
  });
}
