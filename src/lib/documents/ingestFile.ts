/**
 * Ingests a file buffer into shared storage with SHA-256 deduplication.
 *
 * @packageDocumentation
 */

import { createHash, randomBytes } from 'node:crypto';
import { addSeconds, addYears } from 'date-fns';
import type { File as DbFile } from '../../../generated/client.ts';
import { scanBuffer } from '../clamav.ts';
import type { CompensationStack } from '../compensation/compensation-stack.ts';
import { deleteFileIfExists } from '../compensation/document.ts';
import { deleteObjectIfExists } from '../compensation/storage.ts';
import { AppError } from '../errors/app-error.ts';
import { env } from '../env.ts';
import { prisma } from '../prisma.ts';
import { uploadObject } from '../storage/s3Client.ts';

/** Computes SHA-256 hex digest for a buffer. */
export function computeSha256(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

export type IngestFileInput = {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  fileTtlSeconds: number;
  stack: CompensationStack;
  skipVirusScan?: boolean;
};

/**
 * Stores or reuses a {@link DbFile} keyed by content hash.
 */
export async function ingestFile(input: IngestFileInput): Promise<DbFile> {
  const sha256 = computeSha256(input.buffer);
  const now = new Date();
  const requestedFileExpiresAt = addSeconds(now, input.fileTtlSeconds);
  const requestedRecordExpiresAt = addYears(now, env.reportingLifetimeYears);

  const existing = await prisma.file.findUnique({ where: { sha256 } });
  if (existing?.s3Key) {
    const data: { fileExpiresAt?: Date; recordExpiresAt?: Date } = {};
    if (requestedFileExpiresAt > existing.fileExpiresAt) {
      data.fileExpiresAt = requestedFileExpiresAt;
    }
    if (requestedRecordExpiresAt > existing.recordExpiresAt) {
      data.recordExpiresAt = requestedRecordExpiresAt;
    }
    if (Object.keys(data).length > 0) {
      return prisma.file.update({ where: { fileId: existing.fileId }, data });
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

  const file = await prisma.file.create({
    data: {
      sha256,
      s3Key: null,
      fileName: input.fileName,
      fileExpiresAt: requestedFileExpiresAt,
      recordExpiresAt: requestedRecordExpiresAt,
      byteSize,
    },
  });

  input.stack.registerUndo(
    'delete file row',
    () => deleteFileIfExists(file.fileId),
    () => ({ kind: 'file', fileId: file.fileId }),
  );

  await uploadObject(s3Key, input.buffer, input.mimeType);

  input.stack.registerUndo(
    'delete S3 object',
    () => deleteObjectIfExists(s3Key),
    () => ({ kind: 's3Object', s3Key }),
  );

  return prisma.file.update({
    where: { fileId: file.fileId },
    data: { s3Key },
  });
}

