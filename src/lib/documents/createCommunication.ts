/**
 * Creates a {@link Communication} and enqueues the initial email.
 *
 * @packageDocumentation
 */

import { randomBytes } from 'node:crypto';
import { addSeconds } from 'date-fns';
import type { Document, Communication } from '../../../generated/client.ts';
import type { CompensationStack } from '../compensation/compensation-stack.ts';
import { deleteCommunicationIfExists } from '../compensation/document.ts';
import { AppError } from '../errors/app-error.ts';
import { prisma } from '../prisma.ts';
import { emailQueue } from '../../server/queues/emailQueue.ts';

export type CreateCommunicationInput = {
  document: Document;
  linkTtlSeconds: number;
  stack: CompensationStack;
  emailType?: 'INITIAL' | 'REGENERATE';
  requestedBy?: string;
};

export type CreateCommunicationResult = {
  link: Communication;
  emailJobId: string;
};

/** Creates a document link row and enqueues email delivery. */
export async function createCommunication(
  input: CreateCommunicationInput,
): Promise<CreateCommunicationResult> {
  const downloadToken = randomBytes(32).toString('hex');
  const emailType = input.emailType ?? 'INITIAL';

  const link = await prisma.communication.create({
    data: {
      documentId: input.document.documentId,
      downloadToken,
      linkExpiresAt: addSeconds(new Date(), input.linkTtlSeconds),
    },
  });

  input.stack.registerUndo(
    'delete document link',
    () => deleteCommunicationIfExists(link.communicationId),
    () => ({ kind: 'communication', communicationId: link.communicationId }),
  );

  let emailJobId: string;
  try {
    const job = await emailQueue.add(
      emailType === 'INITIAL' ? 'send-initial-link' : 'send-regenerate-link',
      {
        communicationId: link.communicationId,
        type: emailType,
        ...(input.requestedBy ? { requestedBy: input.requestedBy } : {}),
      },
    );
    emailJobId = job.id!;
  } catch (err) {
    throw AppError.serviceUnavailable(
      'The file was saved but the download-link email could not be queued. Retry the upload or contact support.',
      { cause: err },
    );
  }

  return { link, emailJobId };
}

/** Revokes all active links on a document envelope. */
export async function revokeActiveCommunications(documentId: string, now: Date = new Date()): Promise<string[]> {
  const active = await prisma.communication.findMany({
    where: {
      documentId,
      revokedAt: null,
      linkExpiresAt: { gt: now },
    },
    select: { communicationId: true },
  });

  if (active.length === 0) {
    return [];
  }

  await prisma.communication.updateMany({
    where: {
      documentId,
      revokedAt: null,
      linkExpiresAt: { gt: now },
    },
    data: { revokedAt: now, linkExpiresAt: now },
  });

  return active.map((l) => l.communicationId);
}
