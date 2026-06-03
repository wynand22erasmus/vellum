/**
 * Recipient download verification (link token + file password).
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import argon2 from 'argon2';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../lib/errors/app-error.ts';
import { validationErrorFromZod } from '../lib/errors/validation-detail.ts';
import { prisma } from '../lib/prisma.ts';
import { generatePresignedUrl } from '../lib/storage/s3Client.ts';
import { logEvent } from '../queues/auditQueue.ts';

/** @internal */
const verifySchema = z.object({
  token: z.string().min(1, 'Download link token is required.'),
  password: z.string().min(1, 'File password is required.'),
});

/** @internal */
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const body = req.body as { token?: string };
    if (body?.token) return body.token;
    return ipKeyGenerator(req.ip ?? '127.0.0.1');
  },
  handler: (_req, _res, next) => {
    next(
      AppError.tooManyRequests(
        'Too many download verification attempts for this link or IP address. Please wait 15 minutes and try again.',
      ),
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/** Express router mounted at `/api/verify` (public, no session). */
export const verifyRouter = Router();

verifyRouter.post(
  '/',
  verifyLimiter,
  asyncHandler(async (req, res) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      throw validationErrorFromZod(
        parsed.error,
        'Download verification requires both token and password.',
      );
    }

    const { token, password } = parsed.data;

    const doc = await prisma.document.findUnique({
      where: { downloadToken: token },
    });

    if (!doc) {
      throw AppError.notFound(
        'Invalid download link. No document matches this token; the link may have been replaced.',
      );
    }

    if (!doc.s3Key) {
      throw AppError.gone(
        'The source file has been permanently deleted per the retention policy.',
      );
    }

    if (new Date() > doc.linkExpiresAt) {
      throw AppError.gone('This link has expired.', {
        actionRequired: 'Please log in to your Vellum dashboard to request a new link.',
      });
    }

    const isValid = await argon2.verify(doc.passwordHash, password);
    if (!isValid) {
      const correlationId = randomUUID();
      logEvent({
        eventType: 'FILE_DOWNLOAD_FAILED',
        documentId: doc.id,
        correlationId,
        metadata: { correlationId, reason: 'Incorrect password' },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      req.errorCorrelationId = correlationId;
      req.errorDocumentId = doc.id;
      throw AppError.unauthorized(
        'The file password does not match. Use the password provided separately by the sender.',
      );
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
  }),
);
