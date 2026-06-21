/**
 * Shared communication + graph types for verify and upload flows.
 *
 * @packageDocumentation
 */

import type { Prisma } from '../../../generated/client.ts';
import type { Document, Communication, File as DbFile, Recipient } from '../../../generated/client.ts';

/** Prisma include for loading a link with document, file, and recipient. */
export const communicationGraphInclude = {
  document: {
    include: {
      file: true,
      recipient: true,
    },
  },
} satisfies Prisma.CommunicationInclude;

export type CommunicationGraph = Communication & {
  document: Document & {
    file: DbFile;
    recipient: Recipient;
  };
};

/** Flattened verify context from a joined link graph. */
export type CommunicationContext = Communication & Document & {
  fileId: string;
  recipientId: string;
  s3Key: string | null;
  fileName: string;
  fileExpiresAt: Date;
  recordExpiresAt: Date;
  deletedAt: Date | null;
  sha256: string;
  sourceSystemKey: string;
  email: string;
  phoneNumber: string | null;
  otpChannel: Recipient['otpChannel'];
  authenticatorSecretEnc: string | null;
};

/** Maps a joined link graph into {@link CommunicationContext}. */
export function toCommunicationContext(link: CommunicationGraph): CommunicationContext {
  const { document: doc, ...linkFields } = link;
  const { file, recipient, ...docFields } = doc;
  return {
    ...docFields,
    ...linkFields,
    fileId: file.fileId,
    recipientId: recipient.recipientId,
    s3Key: file.s3Key,
    fileName: file.fileName,
    fileExpiresAt: file.fileExpiresAt,
    recordExpiresAt: file.recordExpiresAt,
    deletedAt: file.deletedAt,
    sha256: file.sha256,
    sourceSystemKey: recipient.sourceSystemKey,
    email: recipient.email,
    phoneNumber: recipient.phoneNumber,
    otpChannel: recipient.otpChannel,
    authenticatorSecretEnc: recipient.authenticatorSecretEnc,
  };
}
