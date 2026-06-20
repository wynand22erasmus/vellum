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
 * Deletes a recipient link row if it exists (idempotent).
 *
 * @param id - {@link DocumentUserLink} primary key (legacy "document id")
 */
export async function deleteDocumentUserLinkIfExists(id: string): Promise<void> {
  await prisma.documentUserLink.deleteMany({ where: { id } });
}

/** @deprecated Use {@link deleteDocumentUserLinkIfExists}. */
export const deleteDocumentIfExists = deleteDocumentUserLinkIfExists;

/**
 * Deletes a shared file row if it exists (idempotent).
 *
 * @param id - {@link DocumentFile} primary key
 */
export async function deleteDocumentFileIfExists(id: string): Promise<void> {
  await prisma.documentFile.deleteMany({ where: { id } });
}

/**
 * Restores link-related fields from a snapshot taken before mutation.
 *
 * @param id - {@link DocumentUserLink} primary key
 * @param snapshot - Prior token, expiry, and used flag
 */
export async function revertDocumentLinkState(
  id: string,
  snapshot: DocumentLinkSnapshot,
): Promise<void> {
  await prisma.documentUserLink.update({
    where: { id },
    data: {
      downloadToken: snapshot.downloadToken,
      linkExpiresAt: snapshot.linkExpiresAt,
      isUsed: snapshot.isUsed,
    },
  });
}
