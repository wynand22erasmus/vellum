/**
 * Dashboard document list and link regeneration for authenticated recipients.
 *
 * @packageDocumentation
 */

import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { addHours } from 'date-fns';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { CompensationStack } from '../../lib/compensation/compensation-stack.ts';
import { revertDocumentLinkState } from '../../lib/compensation/document.ts';
import { documentUserLinkWithFileInclude } from '../../lib/documents/types.ts';
import { prisma } from '../../lib/prisma.ts';
import { emailQueue } from '../queues/emailQueue.ts';
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

    const links = await prisma.documentUserLink.findMany({
      where: { recipientEmail: user.email },
      orderBy: { createdAt: 'desc' },
      include: documentUserLinkWithFileInclude,
    });

    ok(req, res, {
      documents: links.map((link) => ({
        id: link.id,
        fileName: link.documentFile.fileName,
        recipientEmail: link.recipientEmail,
        linkExpiresAt: link.linkExpiresAt,
        fileExpiresAt: link.documentFile.fileExpiresAt,
        recordExpiresAt: link.documentFile.recordExpiresAt,
        isUsed: link.isUsed,
        maxDownloads: link.maxDownloads,
        downloadCount: link.downloadCount,
        revokedAt: link.revokedAt,
        s3Key: link.documentFile.s3Key,
        deletedAt: link.documentFile.deletedAt,
        createdAt: link.createdAt,
        batchId: link.batchId,
        fileId: link.documentFileId,
        linkActive:
          now <= link.linkExpiresAt && !!link.documentFile.s3Key && !link.revokedAt,
        fileAvailable: !!link.documentFile.s3Key && now <= link.documentFile.fileExpiresAt,
        downloadsRemaining: Math.max(0, link.maxDownloads - link.downloadCount),
      })),
    });
  }),
);

documentsRouter.post(
  '/:id/request-link',
  asyncHandler(async (req, res) => {
    const user = req.user!;

    const link = await prisma.documentUserLink.findFirst({
      where: { id: routeParam(req.params.id), recipientEmail: user.email },
      include: documentUserLinkWithFileInclude,
    });

    if (!link) {
      throw AppError.notFound(
        'Document not found. No document with this id exists for your account.',
      );
    }

    if (!link.documentFile.s3Key || new Date() > link.documentFile.fileExpiresAt) {
      throw AppError.gone(
        'The source file has been permanently deleted per the retention policy.',
      );
    }

    const snapshot = {
      downloadToken: link.downloadToken,
      linkExpiresAt: link.linkExpiresAt,
      isUsed: link.isUsed,
    };

    const requestedExpiry = addHours(new Date(), 24);
    const newLinkExpiresAt =
      requestedExpiry > link.documentFile.fileExpiresAt
        ? link.documentFile.fileExpiresAt
        : requestedExpiry;

    const stack = new CompensationStack();

    await stack.run(async () => {
      const updatedLink = await prisma.documentUserLink.update({
        where: { id: link.id },
        data: {
          downloadToken: randomBytes(32).toString('hex'),
          linkExpiresAt: newLinkExpiresAt,
          isUsed: false,
          verifySuccessCount: 0,
          lastVerifiedAt: null,
        },
      });

      stack.registerUndo('revert link state', () =>
        revertDocumentLinkState(link.id, snapshot),
      );

      try {
        await emailQueue.add('send-regenerate-link', {
          docId: updatedLink.id,
          type: 'REGENERATE',
          requestedBy: user.id,
        });
      } catch (err) {
        throw AppError.serviceUnavailable(
          'A new download link was prepared but the notification email could not be queued. Please try again in a few minutes.',
          { cause: err },
        );
      }
    });

    okMessage(req, res, 'A fresh link has been sent to your email.');
  }),
);
