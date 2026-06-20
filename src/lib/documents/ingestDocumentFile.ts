/**
 * Ingests a file buffer into shared storage with SHA-256 deduplication.
 *
 * @packageDocumentation
 */

import { createHash, randomBytes } from 'node:crypto';
import { addSeconds, addYears } from 'date-fns';
import type { DocumentFile } from '../../../generated/client.ts';
import { scanBuffer } from '../clamav.ts';
import type { CompensationStack } from '../compensation/compensation-stack.ts';
import { deleteDocumentFileIfExists } from '../compensation/document.ts';
import { deleteObjectIfExists } from '../compensation/storage.ts';
import { AppError } from '../errors/app-error.ts';
import { env } from '../env.ts';
import { prisma } from '../prisma.ts';
import { uploadObject } from '../storage/s3Client.ts';

/** Computes SHA-256 hex digest for a buffer. */
export function computeSha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

export type IngestDocumentFileInput = {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  fileTtlSeconds: number;
  stack: CompensationStack;
  /** When true, skip ClamAV (caller already scanned, e.g. SFTP pipeline). */
  skipVirusScan?: boolean;
};

/**
 * Stores or reuses a {@link DocumentFile} keyed by content hash.
 *
 * When a non-scrubbed file with the same sha256 exists, skips virus scan and S3 upload.
 */
export async function ingestDocumentFile(input: IngestDocumentFileInput): Promise<DocumentFile> {
  const sha256 = computeSha256(input.buffer);
  const now = new Date();
  const requestedFileExpiresAt = addSeconds(now, input.fileTtlSeconds);

  const existing = await prisma.documentFile.findUnique({ where: { sha256 } });
  if (existing?.s3Key) {
    if (requestedFileExpiresAt > existing.fileExpiresAt) {
      return prisma.documentFile.update({
        where: { id: existing.id },
        data: { fileExpiresAt: requestedFileExpiresAt },
      });
    }
    return existing;
  }

  const shouldScan = !input.skipVirusScan && !env.skipVirusScan;
  if (shouldScan) {
    try {
      const scanResult = await scanBuffer(input.buffer);
      if (!scanResult.clean) {
        const reason = scanResult.reason ?? 'Malware detected';
        throw AppError.unprocessableContent(
          `File rejected by virus scanner: ${reason}.`,
          { reason },
        );
      }
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw AppError.serviceUnavailable(
        'Virus scanner is unavailable; the upload was rejected and no file was stored.',
      );
    }
  }

  const s3Key = `documents/${randomBytes(16).toString('hex')}/${input.fileName}`;
  const byteSize = input.buffer.length;

  const file = await prisma.documentFile.create({
    data: {
      sha256,
      s3Key: null,
      fileName: input.fileName,
      fileExpiresAt: requestedFileExpiresAt,
      recordExpiresAt: addYears(now, env.reportingLifetimeYears),
      byteSize,
    },
  });

  input.stack.registerUndo(
    'delete document file row',
    () => deleteDocumentFileIfExists(file.id),
    () => ({ kind: 'documentFile', id: file.id }),
  );

  await uploadObject(s3Key, input.buffer, input.mimeType);

  input.stack.registerUndo(
    'delete S3 object',
    () => deleteObjectIfExists(s3Key),
    () => ({ kind: 's3Object', s3Key }),
  );

  return prisma.documentFile.update({
    where: { id: file.id },
    data: { s3Key },
  });
}
