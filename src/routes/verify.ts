import { Router } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import argon2 from 'argon2';
import { z } from 'zod';
import { prisma } from '../lib/prisma.ts';
import { generatePresignedUrl } from '../lib/storage/s3Client.ts';
import { logEvent } from '../queues/auditQueue.ts';

const verifySchema = z.object({
  token: z.string().min(1),
  password: z.string().min(1),
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const body = req.body as { token?: string };
    if (body?.token) return body.token;
    return ipKeyGenerator(req.ip ?? '127.0.0.1');
  },
  message: { error: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const verifyRouter = Router();

verifyRouter.post('/', verifyLimiter, async (req, res) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'token and password are required.' });
    return;
  }

  const { token, password } = parsed.data;

  const doc = await prisma.document.findUnique({
    where: { downloadToken: token },
  });

  if (!doc) {
    res.status(404).json({ error: 'Invalid link.' });
    return;
  }

  if (!doc.s3Key) {
    res.status(410).json({
      error: 'The source file has been permanently deleted per the retention policy.',
    });
    return;
  }

  if (new Date() > doc.linkExpiresAt) {
    res.status(410).json({
      error: 'This link has expired.',
      actionRequired:
        'Please log in to your Vellum dashboard to request a new link.',
    });
    return;
  }

  const isValid = await argon2.verify(doc.passwordHash, password);
  if (!isValid) {
    logEvent({
      eventType: 'FILE_DOWNLOAD_FAILED',
      documentId: doc.id,
      metadata: { reason: 'Incorrect password' },
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    res.status(401).json({ error: 'Invalid file password.' });
    return;
  }

  const downloadUrl = await generatePresignedUrl(doc.s3Key, doc.fileName);

  await prisma.document.update({
    where: { id: doc.id },
    data: { isUsed: true },
  });

  logEvent({
    eventType: 'FILE_DOWNLOAD_SUCCESS',
    documentId: doc.id,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });

  res.json({ downloadUrl, fileName: doc.fileName });
});
