/**
 * SFTP drop ingestion pipeline with per-step audit events.
 *
 * @packageDocumentation
 */

import { rename, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { AuditEventType } from '../../../generated/enums.ts';
import { CompensationStack } from '../../lib/compensation/compensation-stack.ts';
import { createDelivery } from '../../lib/documents/createDelivery.ts';
import { scanBuffer } from '../../lib/clamav.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { env } from '../../lib/env.ts';
import { resolveUploadFileName } from '../../lib/uploadFilename.ts';
import { logEvent } from '../queues/auditQueue.ts';
import { mimeFromFileName } from './mimeFromExtension.ts';
import { parseManifestJson } from './parseManifest.ts';

export type SftpIngestContext = {
  filePath: string;
  manifestPath: string;
  sftpUser?: string;
};

type SftpFailureStep =
  | 'metadata'
  | 'virus_scan'
  | 'storage'
  | 'document'
  | 'email'
  | 'archive';

function logSftpFailure(step: SftpFailureStep, reason: string, metadata?: Record<string, unknown>): void {
  logEvent({
    eventType: AuditEventType.SFTP_INGESTION_FAILED,
    metadata: { step, reason, ...metadata },
  });
}

async function movePair(
  filePath: string,
  manifestPath: string,
  targetDir: string,
  prefix: string,
): Promise<string> {
  const stamp = new Date().toISOString().replace(/[:.]/gu, '-');
  const baseName = path.basename(filePath);
  const archivedFile = path.join(targetDir, `${prefix}${stamp}-${baseName}`);
  const archivedManifest = path.join(
    targetDir,
    `${prefix}${stamp}-${path.basename(manifestPath)}`,
  );
  await rename(filePath, archivedFile);
  await rename(manifestPath, archivedManifest);
  return archivedFile;
}

async function moveToFailed(
  ctx: SftpIngestContext,
  step: SftpFailureStep,
  reason: string,
): Promise<void> {
  logSftpFailure(step, reason, {
    remotePath: ctx.filePath,
    fileName: path.basename(ctx.filePath),
    sftpUser: ctx.sftpUser ?? env.sftpUser,
  });

  try {
    const stamp = new Date().toISOString().replace(/[:.]/gu, '-');
    const baseName = path.basename(ctx.filePath);
    const failedFile = path.join(env.sftpFailedPath, `${stamp}-${baseName}`);
    const failedManifest = path.join(
      env.sftpFailedPath,
      `${stamp}-${path.basename(ctx.manifestPath)}`,
    );
    await rename(ctx.filePath, failedFile);
    await rename(ctx.manifestPath, failedManifest);
    await writeFile(
      `${failedFile}.error.json`,
      JSON.stringify({ step, reason, at: new Date().toISOString() }, null, 2),
      'utf8',
    );
  } catch {
    // Best-effort quarantine; audit event already recorded.
  }
}

/**
 * Ingests one SFTP data file and its sidecar manifest through the Vellum lifecycle.
 */
export async function ingestSftpFile(ctx: SftpIngestContext): Promise<void> {
  const fileName = path.basename(ctx.filePath);
  const remotePath = ctx.filePath;
  const sftpUser = ctx.sftpUser ?? env.sftpUser;

  let buffer: Buffer;
  try {
    buffer = await readFile(ctx.filePath);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    logSftpFailure('metadata', `Could not read data file: ${reason}`, {
      remotePath,
      fileName,
      sftpUser,
    });
    return;
  }

  logEvent({
    eventType: AuditEventType.SFTP_FILE_RECEIVED,
    metadata: { remotePath, fileName, bytes: buffer.length, sftpUser },
  });

  let manifest;
  try {
    const manifestRaw = await readFile(ctx.manifestPath);
    manifest = parseManifestJson(manifestRaw);
    logEvent({
      eventType: AuditEventType.SFTP_METADATA_VALIDATED,
      metadata: {
        recipientEmail: manifest.recipientEmail,
        linkTtl: manifest.linkTtl,
        fileTtl: manifest.fileTtl,
        remotePath,
        fileName,
        sftpUser,
      },
    });
  } catch (err) {
    const reason =
      err instanceof Error
        ? err.message
        : 'Manifest JSON is invalid or missing required fields.';
    await moveToFailed(ctx, 'metadata', reason);
    return;
  }

  const scanStart = Date.now();
  if (!env.skipVirusScan) {
    try {
      const scanResult = await scanBuffer(buffer);
      if (!scanResult.clean) {
        await moveToFailed(
          ctx,
          'virus_scan',
          scanResult.reason ?? 'Malware detected',
        );
        return;
      }
    } catch (err) {
      const reason =
        err instanceof AppError
          ? (err.detail ?? err.message)
          : err instanceof Error
            ? err.message
            : String(err);
      await moveToFailed(ctx, 'virus_scan', reason);
      return;
    }
  }

  logEvent({
    eventType: AuditEventType.SFTP_VIRUS_SCAN_PASSED,
    metadata: {
      scanDurationMs: Date.now() - scanStart,
      remotePath,
      fileName,
      sftpUser,
    },
  });

  let safeFileName: string;
  try {
    ({ safeFileName } = resolveUploadFileName(fileName, env.allowedUploadExtensions));
  } catch (err) {
    const reason =
      err instanceof AppError
        ? (err.detail ?? err.message)
        : err instanceof Error
          ? err.message
          : String(err);
    await moveToFailed(ctx, 'storage', reason);
    return;
  }

  const stack = new CompensationStack();
  let delivery;
  try {
    delivery = await stack.run(async () =>
      createDelivery({
        buffer,
        fileName: safeFileName,
        mimeType: mimeFromFileName(safeFileName),
        fileTtlSeconds: manifest.fileTtl,
        linkTtlSeconds: manifest.linkTtl,
        recipientEmail: manifest.recipientEmail,
        password: manifest.password,
        stack,
        skipVirusScan: true,
      }),
    );
  } catch (err) {
    const reason =
      err instanceof AppError
        ? (err.detail ?? err.message)
        : err instanceof Error
          ? err.message
          : String(err);
    const step: SftpFailureStep =
      err instanceof AppError && err.status === 503 ? 'email' : 'document';
    await moveToFailed(ctx, step, reason);
    return;
  }

  logEvent({
    eventType: AuditEventType.SFTP_STORAGE_UPLOADED,
    metadata: {
      s3Key: delivery.file.s3Key,
      sha256: delivery.file.sha256,
      fileId: delivery.file.fileId,
      remotePath,
      fileName: safeFileName,
      sftpUser,
    },
  });

  logEvent({
    eventType: AuditEventType.SFTP_DOCUMENT_CREATED,
    documentId: delivery.document.documentId,
    communicationId: delivery.link.communicationId,
    metadata: {
      documentId: delivery.document.documentId,
      communicationId: delivery.link.communicationId,
      fileId: delivery.file.fileId,
      remotePath,
      fileName: safeFileName,
      sftpUser,
    },
  });

  logEvent({
    eventType: AuditEventType.SFTP_EMAIL_QUEUED,
    documentId: delivery.document.documentId,
    communicationId: delivery.link.communicationId,
    metadata: {
      jobId: delivery.emailJobId,
      documentId: delivery.document.documentId,
      communicationId: delivery.link.communicationId,
      remotePath,
      fileName: safeFileName,
      sftpUser,
    },
  });

  try {
    const archivedPath = await movePair(
      ctx.filePath,
      ctx.manifestPath,
      env.sftpArchivePath,
      '',
    );
    logEvent({
      eventType: AuditEventType.SFTP_INGESTION_COMPLETED,
      documentId: delivery.document.documentId,
      communicationId: delivery.link.communicationId,
      metadata: {
        archivedPath,
        documentId: delivery.document.documentId,
        communicationId: delivery.link.communicationId,
        remotePath,
        fileName: safeFileName,
        sftpUser,
      },
    });
  } catch (err) {
    const reason =
      err instanceof Error ? err.message : 'Failed to archive source files after ingest.';
    logSftpFailure('archive', reason, {
      documentId: delivery.document.documentId,
      communicationId: delivery.link.communicationId,
      remotePath,
      fileName: safeFileName,
      sftpUser,
    });
  }
}
