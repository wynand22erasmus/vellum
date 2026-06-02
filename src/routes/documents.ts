/**
 * Dashboard document list and link regeneration for authenticated recipients.
 *
 * @packageDocumentation
 */

import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { addHours } from 'date-fns';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../lib/errors/app-error.ts';
import { CompensationStack } from '../lib/compensation/compensation-stack.ts';
import { revertDocumentLinkState } from '../lib/compensation/document.ts';
import { prisma } from '../lib/prisma.ts';
import { emailQueue } from '../queues/emailQueue.ts';

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
      where: { recipientEmail: user.email },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        recipientEmail: true,
        linkExpiresAt: true,
        fileExpiresAt: true,
        recordExpiresAt: true,
        isUsed: true,
        s3Key: true,
        deletedAt: true,
        createdAt: true,
      },
    });

    res.json({
      documents: documents.map((doc) => ({
        ...doc,
        linkActive: now <= doc.linkExpiresAt && !!doc.s3Key,
        fileAvailable: !!doc.s3Key && now <= doc.fileExpiresAt,
      })),
    });
  }),
);

documentsRouter.post(
  '/:id/request-link',
  asyncHandler(async (req, res) => {
    const user = req.user!;

    const doc = await prisma.document.findFirst({
      where: { id: routeParam(req.params.id), recipientEmail: user.email },
    });

    if (!doc) {
      throw AppError.notFound('Document not found.');
    }

    if (!doc.s3Key || new Date() > doc.fileExpiresAt) {
      throw AppError.gone(
        'The source file has been permanently deleted per the retention policy.',
      );
    }

    const snapshot = {
      downloadToken: doc.downloadToken,
      linkExpiresAt: doc.linkExpiresAt,
      isUsed: doc.isUsed,
    };

    const requestedExpiry = addHours(new Date(), 24);
    const newLinkExpiresAt =
      requestedExpiry > doc.fileExpiresAt ? doc.fileExpiresAt : requestedExpiry;

    const stack = new CompensationStack();

    await stack.run(async () => {
      const updatedDoc = await prisma.document.update({
        where: { id: doc.id },
        data: {
          downloadToken: randomBytes(32).toString('hex'),
          linkExpiresAt: newLinkExpiresAt,
          isUsed: false,
        },
      });

      stack.registerUndo('revert link state', () =>
        revertDocumentLinkState(doc.id, snapshot),
      );

      try {
        await emailQueue.add('send-regenerate-link', {
          docId: updatedDoc.id,
          type: 'REGENERATE',
          requestedBy: user.id,
        });
      } catch (err) {
        throw AppError.internal('Failed to send link email.', { cause: err });
      }
    });

    res.json({ message: 'A fresh link has been sent to your email.' });
  }),
);
