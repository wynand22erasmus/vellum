/**
 * Shared document link + file types for verify and upload flows.
 *
 * @packageDocumentation
 */

import type { Prisma } from '../../../generated/client.ts';
import type { DocumentFile, DocumentUserLink } from '../../../generated/client.ts';

/** Prisma include for loading a recipient link with its shared file. */
export const documentUserLinkWithFileInclude = {
  documentFile: true,
} satisfies Prisma.DocumentUserLinkInclude;

/** Recipient link row with joined {@link DocumentFile}. */
export type DocumentUserLinkWithFile = DocumentUserLink & {
  documentFile: DocumentFile;
};

/**
 * Flattened view matching the legacy single-table Document shape for verify/OTP/email.
 */
export type DocumentContext = DocumentUserLink & {
  s3Key: string | null;
  fileName: string;
  fileExpiresAt: Date;
  recordExpiresAt: Date;
  deletedAt: Date | null;
  sha256: string;
};

/** Maps a joined link + file into {@link DocumentContext}. */
export function toDocumentContext(link: DocumentUserLinkWithFile): DocumentContext {
  return {
    ...link,
    s3Key: link.documentFile.s3Key,
    fileName: link.documentFile.fileName,
    fileExpiresAt: link.documentFile.fileExpiresAt,
    recordExpiresAt: link.documentFile.recordExpiresAt,
    deletedAt: link.documentFile.deletedAt,
    sha256: link.documentFile.sha256,
  };
}
