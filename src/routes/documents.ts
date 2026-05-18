/**
 * Dashboard document list and link regeneration for authenticated recipients.
 *
 * @packageDocumentation
 * @remarks
 * - `GET /api/documents/` — list documents for `req.user.email`
 * - `POST /api/documents/:id/request-link` — new download token + email (requires {@link ../middleware/devAuth.ts})
 */

import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { addHours } from 'date-fns';
import { prisma } from '../lib/prisma.ts';
import { emailQueue } from '../queues/emailQueue.ts';

/** Express router mounted at `/api/documents`. */
export const documentsRouter = Router();

documentsRouter.get('/', async (req, res) => {
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
});

documentsRouter.post('/:id/request-link', async (req, res) => {
  const user = req.user!;

  const doc = await prisma.document.findFirst({
    where: { id: req.params.id, recipientEmail: user.email },
  });

  if (!doc) {
    res.status(404).json({ error: 'Document not found.' });
    return;
  }

  if (!doc.s3Key || new Date() > doc.fileExpiresAt) {
    res.status(410).json({
      error:
        'The source file has been permanently deleted per the retention policy.',
    });
    return;
  }

  const requestedExpiry = addHours(new Date(), 24);
  const newLinkExpiresAt =
    requestedExpiry > doc.fileExpiresAt ? doc.fileExpiresAt : requestedExpiry;

  const updatedDoc = await prisma.document.update({
    where: { id: doc.id },
    data: {
      downloadToken: randomBytes(32).toString('hex'),
      linkExpiresAt: newLinkExpiresAt,
      isUsed: false,
    },
  });

  await emailQueue.add('send-regenerate-link', {
    docId: updatedDoc.id,
    type: 'REGENERATE',
    requestedBy: user.id,
  });

  res.json({ message: 'A fresh link has been sent to your email.' });
});
