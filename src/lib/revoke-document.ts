/**
 * Shared document link revocation for admin and integrator API callers.
 *
 * @packageDocumentation
 */

import { prisma } from './prisma.ts';
import { AppError } from './errors/app-error.ts';
import { logEvent } from '../server/queues/auditQueue.ts';

export type RevokeDocumentOptions = {
  documentId: string;
  revokedBy: string;
  authMode: 'admin' | 'apiKey';
  ip?: string;
  userAgent?: string;
};

/**
 * Revokes a recipient link. Shared S3 objects are not deleted (other links may reference them).
 */
export async function revokeDocument(options: RevokeDocumentOptions): Promise<void> {
  const link = await prisma.documentUserLink.findUnique({
    where: { id: options.documentId },
    include: { documentFile: true },
  });
  if (!link) {
    throw AppError.notFound(
      `Document with id "${options.documentId}" was not found.`,
    );
  }

  const now = new Date();

  await prisma.documentUserLink.update({
    where: { id: link.id },
    data: {
      linkExpiresAt: now,
      revokedAt: now,
      isUsed: true,
    },
  });

  logEvent({
    eventType: 'LINK_REVOKED',
    documentId: link.id,
    userId: options.authMode === 'admin' ? options.revokedBy : undefined,
    metadata: {
      revokedBy: options.revokedBy,
      authMode: options.authMode,
      fileId: link.documentFileId,
      sharedFileRetained: !!link.documentFile.s3Key,
    },
    ip: options.ip,
    userAgent: options.userAgent,
  });
}
