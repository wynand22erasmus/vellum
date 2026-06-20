/**
 * Creates per-recipient {@link DocumentUserLink} rows after file ingest.
 *
 * @packageDocumentation
 */

import { randomBytes } from 'node:crypto';
import { addSeconds } from 'date-fns';
import argon2 from 'argon2';
import { generateSecret, generateURI } from 'otplib';
import type { DocumentFile, DocumentUserLink, RecipientOtpChannel } from '../../../generated/client.ts';
import type { CompensationStack } from '../compensation/compensation-stack.ts';
import { deleteDocumentUserLinkIfExists } from '../compensation/document.ts';
import { env } from '../env.ts';
import { getBrandPresetFromEnv } from '../brand/get-brand-preset.ts';
import { prisma } from '../prisma.ts';
import { encryptTotpSecret } from '../recipient-otp/totpEncryption.ts';
import { emailQueue } from '../../server/queues/emailQueue.ts';
import { AppError } from '../errors/app-error.ts';

export type CreateDocumentUserLinkInput = {
  documentFile: DocumentFile;
  recipientEmail: string;
  password: string;
  linkTtlSeconds: number;
  maxDownloads?: number;
  otpChannel?: RecipientOtpChannel | null;
  recipientPhone?: string | null;
  batchId?: string | null;
  stack: CompensationStack;
};

export type CreateDocumentUserLinkResult = {
  link: DocumentUserLink;
  emailJobId: string;
  totpProvisioningUri?: string;
};

/** Creates a recipient link, enqueues the initial email, and registers compensation undo. */
export async function createDocumentUserLink(
  input: CreateDocumentUserLinkInput,
): Promise<CreateDocumentUserLinkResult> {
  const maxDownloads = input.maxDownloads ?? env.defaultMaxDownloads;
  const otpChannel = env.recipientOtpEnabled ? (input.otpChannel ?? null) : null;
  const recipientPhone =
    otpChannel === 'sms' || otpChannel === 'whatsapp' ? (input.recipientPhone ?? null) : null;

  let totpSecretEnc: string | null = null;
  let totpProvisioningUri: string | undefined;
  if (otpChannel === 'authenticator') {
    const secret = generateSecret();
    totpSecretEnc = encryptTotpSecret(secret);
    const brand = getBrandPresetFromEnv();
    totpProvisioningUri = generateURI({
      issuer: brand.displayName,
      label: input.recipientEmail,
      secret,
    });
  }

  const passwordHash = await argon2.hash(input.password);
  const downloadToken = randomBytes(32).toString('hex');

  const link = await prisma.documentUserLink.create({
    data: {
      documentFileId: input.documentFile.id,
      recipientEmail: input.recipientEmail,
      passwordHash,
      downloadToken,
      linkExpiresAt: addSeconds(new Date(), input.linkTtlSeconds),
      maxDownloads,
      otpChannel,
      recipientPhone,
      totpSecretEnc,
      batchId: input.batchId ?? null,
    },
  });

  input.stack.registerUndo(
    'delete document user link',
    () => deleteDocumentUserLinkIfExists(link.id),
    () => ({ kind: 'document', id: link.id }),
  );

  let emailJobId: string;
  try {
    const job = await emailQueue.add('send-initial-link', {
      docId: link.id,
      type: 'INITIAL',
    });
    emailJobId = job.id!;
  } catch (err) {
    throw AppError.serviceUnavailable(
      'The file was saved but the download-link email could not be queued. Retry the upload or contact support.',
      { cause: err },
    );
  }

  return {
    link,
    emailJobId,
    ...(totpProvisioningUri ? { totpProvisioningUri } : {}),
  };
}
