/**
 * Ordered expiry-aware record purge for the record purge worker.
 *
 * @packageDocumentation
 */

import { subYears } from 'date-fns';
import { env } from '../env.ts';
import { prisma } from '../prisma.ts';
import {
  canDeleteDocument,
  canDeleteCommunication,
  canDeleteFile,
  canDeleteRecipient,
} from './expiry.ts';

/** Purges expired audit, link, document, file, and orphan recipient rows. */
export async function purgeExpiredRecords(now: Date = new Date()): Promise<void> {
  const retentionCutoff = subYears(now, env.reportingLifetimeYears);

  await prisma.auditLog.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  const expiredLinks = await prisma.communication.findMany({
    where: {
      OR: [{ linkExpiresAt: { lte: now } }, { revokedAt: { not: null } }],
    },
    select: { communicationId: true },
  });
  for (const { communicationId } of expiredLinks) {
    if (await canDeleteCommunication(communicationId, now)) {
      await prisma.communication.deleteMany({ where: { communicationId } });
    }
  }

  const expiredDocs = await prisma.document.findMany({
    where: { file: { recordExpiresAt: { lte: now } } },
    select: { documentId: true },
  });
  for (const { documentId } of expiredDocs) {
    if (await canDeleteDocument(documentId, now)) {
      await prisma.document.deleteMany({ where: { documentId } });
    }
  }

  const expiredFiles = await prisma.file.findMany({
    where: {
      recordExpiresAt: { lte: now },
      s3Key: null,
    },
    select: { fileId: true },
  });
  for (const { fileId } of expiredFiles) {
    if (await canDeleteFile(fileId, now)) {
      await prisma.file.deleteMany({ where: { fileId } });
    }
  }

  const recipients = await prisma.recipient.findMany({ select: { recipientId: true } });
  for (const { recipientId } of recipients) {
    if (await canDeleteRecipient(recipientId)) {
      await prisma.recipient.deleteMany({ where: { recipientId } });
    }
  }

  await prisma.processError.deleteMany({
    where: { createdAt: { lt: retentionCutoff } },
  });

  await prisma.deadLetter.deleteMany({
    where: { createdAt: { lt: retentionCutoff } },
  });
}
