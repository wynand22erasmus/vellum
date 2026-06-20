/**
 * Completes a successful verify flow: presigned URL, consumption update, audit.
 *
 * @packageDocumentation
 */

import type { Request } from 'express';
import type { DocumentContext } from '../documents/types.ts';
import { env } from '../env.ts';
import {
  computeVerifyConsumptionUpdate,
  type VerifyConsumptionConfig,
} from '../verify-consumption.ts';
import { prisma } from '../prisma.ts';
import { generatePresignedUrl } from '../storage/s3Client.ts';
import { logEvent } from '../../server/queues/auditQueue.ts';

export type CompleteDownloadResult = {
  downloadUrl: string;
  fileName: string;
  sha256: string;
  downloadsUsed: number;
  maxDownloads: number;
};

/**
 * Issues presigned URL, updates download consumption counters, and logs success audit.
 */
export async function completeDownload(
  doc: DocumentContext,
  req: Pick<Request, 'ip' | 'headers'>,
  now: Date = new Date(),
  consumptionConfig: VerifyConsumptionConfig = {
    reverifyWindowMs: env.reverifyWindowMs,
    maxReverifyAttempts: env.maxReverifyAttempts,
  },
): Promise<CompleteDownloadResult> {
  const consumptionUpdate = computeVerifyConsumptionUpdate(doc, now, consumptionConfig);
  const downloadUrl = await generatePresignedUrl(doc.s3Key!, doc.fileName);

  await prisma.documentUserLink.update({
    where: { id: doc.id },
    data: {
      verifySuccessCount: consumptionUpdate.verifySuccessCount,
      lastVerifiedAt: consumptionUpdate.lastVerifiedAt,
      downloadCount: consumptionUpdate.downloadCount,
      isUsed: consumptionUpdate.isUsed,
    },
  });

  logEvent({
    eventType: 'FILE_DOWNLOAD_SUCCESS',
    documentId: doc.id,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    metadata: {
      sha256: doc.sha256,
      reverifyAttempt: consumptionUpdate.reverifyAttempt,
      isFinalConsumption: consumptionUpdate.isFinalConsumption,
      downloadCount: consumptionUpdate.downloadCount,
      maxDownloads: doc.maxDownloads,
    },
  });

  return {
    downloadUrl,
    fileName: doc.fileName,
    sha256: doc.sha256,
    downloadsUsed: consumptionUpdate.downloadCount,
    maxDownloads: doc.maxDownloads,
  };
}
