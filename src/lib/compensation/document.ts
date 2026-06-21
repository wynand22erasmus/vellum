/**
 * Document compensation helpers.
 *
 * @packageDocumentation
 */

import { canDeleteDocument, canDeleteCommunication, canDeleteFile } from '../retention/expiry.ts';
import { prisma } from '../prisma.ts';

/** Prior link rows captured before regenerate rollback. */
export interface RegenerateLinkSnapshot {
  revokedCommunicationIds: string[];
  createdCommunicationId?: string;
}

/**
 * Deletes a document link row when purge rules allow (idempotent).
 */
export async function deleteCommunicationIfExists(communicationId: string): Promise<void> {
  if (await canDeleteCommunication(communicationId, new Date())) {
    await prisma.communication.deleteMany({ where: { communicationId } });
  }
}

/**
 * Deletes a document envelope when purge rules allow (idempotent).
 */
export async function deleteDocumentIfExists(documentId: string): Promise<void> {
  if (await canDeleteDocument(documentId, new Date())) {
    await prisma.communication.deleteMany({ where: { documentId } });
    await prisma.document.deleteMany({ where: { documentId } });
  }
}

/**
 * Deletes a file row when purge rules allow and no documents reference it.
 */
export async function deleteFileIfExists(fileId: string): Promise<void> {
  if (await canDeleteFile(fileId, new Date())) {
    await prisma.file.deleteMany({ where: { fileId } });
  }
}
