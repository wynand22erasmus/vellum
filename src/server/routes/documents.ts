/**
 * Dashboard document list and link regeneration for authenticated recipients.
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { addHours } from 'date-fns';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { CompensationStack } from '../../lib/compensation/compensation-stack.ts';
import {
  createCommunication,
  revokeActiveCommunications,
} from '../../lib/documents/createCommunication.ts';
import { prisma } from '../../lib/prisma.ts';
import { ok, okMessage } from './http-helpers.ts';

/** Express router mounted at `/api/documents`. */
export const documentsRouter = Router();

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0]! : value;
}

documentsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const user = req.user!;
    const now = new Date();

    const documents = await prisma.document.findMany({
      where: { recipient: { email: user.email } },
      orderBy: { createdAt: 'desc' },
      include: {
        file: true,
        recipient: true,
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    ok(req, res, {
      Document: documents.map((document) => {
        const link = document.communications[0] ?? null;
        const linkExpiresAt = link?.linkExpiresAt ?? document.createdAt;

        return {
          documentId: document.documentId,
          fileName: document.file.fileName,
          recipientEmail: document.recipient.email,
          linkExpiresAt,
          fileExpiresAt: document.file.fileExpiresAt,
          recordExpiresAt: document.file.recordExpiresAt,
          maxDownloads: document.maxDownloads,
          downloadCount: document.downloadCount,
          revokedAt: link?.revokedAt ?? null,
          s3Key: document.file.s3Key,
          deletedAt: document.file.deletedAt,
          createdAt: document.createdAt,
          batchId: document.batchId,
          fileId: document.fileId,
          communicationId: link?.communicationId ?? null,
          linkActive:
            link !== null &&
            now <= link.linkExpiresAt &&
            !!document.file.s3Key &&
            !link.revokedAt,
          fileAvailable: !!document.file.s3Key && now <= document.file.fileExpiresAt,
          downloadsRemaining: Math.max(0, document.maxDownloads - document.downloadCount),
        };
      }),
    });
  }),
);

documentsRouter.post(
  '/:id/request-link',
  asyncHandler(async (req, res) => {
    const user = req.user!;

    const document = await prisma.document.findFirst({
      where: { documentId: routeParam(req.params.id), recipient: { email: user.email } },
      include: { file: true },
    });

    if (!document) {
      throw AppError.notFound(
        'Document not found. No document with this id exists for your account.',
      );
    }

    if (!document.file.s3Key || new Date() > document.file.fileExpiresAt) {
      throw AppError.gone(
        'The source file has been permanently deleted per the retention policy.',
      );
    }

    const requestedExpiry = addHours(new Date(), 24);
    const newLinkExpiresAt =
      requestedExpiry > document.file.fileExpiresAt
        ? document.file.fileExpiresAt
        : requestedExpiry;
    const linkTtlSeconds = Math.max(
      1,
      Math.floor((newLinkExpiresAt.getTime() - Date.now()) / 1000),
    );

    const stack = new CompensationStack();

    await stack.run(async () => {
      await revokeActiveCommunications(document.documentId);

      await createCommunication({
        document,
        linkTtlSeconds,
        stack,
        emailType: 'REGENERATE',
        requestedBy: user.id,
      });
    });

    okMessage(req, res, 'A fresh link has been sent to your email.');
  }),
);
