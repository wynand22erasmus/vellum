/**
 * Expiry predicates for domain purge and guarded deletes.
 *
 * @packageDocumentation
 */

import type { Document, Communication, File } from '../../../generated/client.ts';
import { prisma } from '../prisma.ts';

export type DocumentWithFile = Document & { file: File };

export function isCommunicationExpired(link: Pick<Communication, 'linkExpiresAt' | 'revokedAt'>, now: Date): boolean {
  if (link.revokedAt !== null) {
    return true;
  }
  return link.linkExpiresAt <= now;
}

export function isDocumentExpired(doc: DocumentWithFile, now: Date): boolean {
  return doc.file.recordExpiresAt <= now;
}

export function isFileStorageExpired(file: Pick<File, 'fileExpiresAt'>, now: Date): boolean {
  return file.fileExpiresAt <= now;
}

export function isFileRecordExpired(file: Pick<File, 'recordExpiresAt'>, now: Date): boolean {
  return file.recordExpiresAt <= now;
}

export async function canDeleteCommunication(communicationId: string, now: Date): Promise<boolean> {
  const link = await prisma.communication.findUnique({ where: { communicationId } });
  if (!link || !isCommunicationExpired(link, now)) {
    return false;
  }
  const blockingAudit = await prisma.auditLog.count({
    where: {
      communicationId,
      expiresAt: { gt: now },
    },
  });
  return blockingAudit === 0;
}

export async function canDeleteDocument(documentId: string, now: Date): Promise<boolean> {
  const doc = await prisma.document.findUnique({
    where: { documentId },
    include: { file: true, communications: true },
  });
  if (!doc || !isDocumentExpired(doc, now)) {
    return false;
  }
  for (const link of doc.communications) {
    if (!(await canDeleteCommunication(link.communicationId, now))) {
      return false;
    }
  }
  return true;
}

export async function canDeleteFile(fileId: string, now: Date): Promise<boolean> {
  const file = await prisma.file.findUnique({
    where: { fileId },
    include: { _count: { select: { documents: true } } },
  });
  if (!file || !isFileRecordExpired(file, now) || file.s3Key !== null) {
    return false;
  }
  return file._count.documents === 0;
}

export async function canDeleteRecipient(recipientId: string): Promise<boolean> {
  const count = await prisma.document.count({ where: { recipientId } });
  return count === 0;
}
