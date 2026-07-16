/**
 * Shared document envelope revocation for admin and integrator API callers.
 *
 * @packageDocumentation
 */

import { prisma } from './prisma.ts';
import { AppError } from './errors/app-error.ts';
import { revokeActiveCommunications } from './documents/createCommunication.ts';
import { logEvent } from '../server/queues/auditQueue.ts';

export type RevokeDocumentOptions = {
  documentId: string;
  revokedBy: string;
  authMode: 'admin' | 'apiKey';
  ip?: string;
  userAgent?: string;
};

/** Revokes all active links on a document envelope; shared S3 file is retained. */
export async function revokeDocument(options: RevokeDocumentOptions): Promise<void> {
  const document = await prisma.document.findUnique({
    where: { documentId: options.documentId },
    include: { file: true },
  });
  if (!document) {
    throw AppError.notFound(
      `Document with id "${options.documentId}" was not found.`,
    );
  }

  const now = new Date();
  const activeCommunicationIds = await revokeActiveCommunications(document.documentId, now);

  logEvent({
    eventType: 'LINK_REVOKED',
    documentId: document.documentId,
    userId: options.authMode === 'admin' ? options.revokedBy : undefined,
    metadata: {
      revokedBy: options.revokedBy,
      authMode: options.authMode,
      fileId: document.fileId,
      activeCommunicationIds,
      sharedFileRetained: !!document.file.s3Key,
    },
    ip: options.ip,
    userAgent: options.userAgent,
  });
}
