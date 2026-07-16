/**
 * Orchestrates file ingest, recipient upsert, document envelope, and initial link.
 *
 * @packageDocumentation
 */

import type { Document, Communication, File as DbFile } from '../../../generated/client.ts';
import type { RecipientOtpChannel } from '../../../generated/enums.ts';
import type { CompensationStack } from '../compensation/compensation-stack.ts';
import { createDocument } from './createDocument.ts';
import { createCommunication } from './createCommunication.ts';
import { ingestFile } from './ingestFile.ts';
import { upsertRecipient } from './upsertRecipient.ts';

export type CreateDeliveryInput = {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  fileTtlSeconds: number;
  linkTtlSeconds: number;
  recipientEmail: string;
  sourceSystemKey?: string | null;
  password: string;
  maxDownloads?: number;
  otpChannel?: RecipientOtpChannel | null;
  recipientPhone?: string | null;
  batchId?: string | null;
  stack: CompensationStack;
  skipVirusScan?: boolean;
};

export type CreateDeliveryResult = {
  file: DbFile;
  document: Document;
  link: Communication;
  emailJobId: string;
  totpProvisioningUri?: string;
};

/** Full upload pipeline for one recipient delivery. */
export async function createDelivery(input: CreateDeliveryInput): Promise<CreateDeliveryResult> {
  const file = await ingestFile({
    buffer: input.buffer,
    fileName: input.fileName,
    mimeType: input.mimeType,
    fileTtlSeconds: input.fileTtlSeconds,
    stack: input.stack,
    skipVirusScan: input.skipVirusScan,
  });

  const { recipient, totpProvisioningUri } = await upsertRecipient({
    sourceSystemKey: input.sourceSystemKey,
    email: input.recipientEmail,
    phoneNumber: input.recipientPhone,
    otpChannel: input.otpChannel,
  });

  const document = await createDocument({
    file,
    recipient,
    password: input.password,
    maxDownloads: input.maxDownloads,
    batchId: input.batchId,
    stack: input.stack,
  });

  const { link, emailJobId } = await createCommunication({
    document,
    linkTtlSeconds: input.linkTtlSeconds,
    stack: input.stack,
  });

  return {
    file,
    document,
    link,
    emailJobId,
    ...(totpProvisioningUri ? { totpProvisioningUri } : {}),
  };
}

