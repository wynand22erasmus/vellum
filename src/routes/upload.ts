/**
 * Authenticated document upload API (virus scan, storage, email enqueue).
 *
 * @packageDocumentation
 * @remarks
 * - `POST /api/upload/` — multipart upload; requires {@link ../middleware/apiKeyAuth.ts}
 * - Fields: `file`, `recipientEmail`, `password`, `linkTtl`, `fileTtl` (seconds)
 * - Original filenames are sanitized (trailing spoof extensions like `.pdf.exe` removed) and the
 *   effective extension must be allowed by `ALLOWED_UPLOAD_EXTENSIONS` (see {@link ../lib/env.ts}).
 */

import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import argon2 from 'argon2';
import { addSeconds, addYears } from 'date-fns';
import { z } from 'zod';
import { scanBuffer } from '../lib/clamav.ts';
import { env } from '../lib/env.ts';
import { resolveUploadFileName } from '../lib/uploadFilename.ts';
import { prisma } from '../lib/prisma.ts';
import { uploadObject } from '../lib/storage/s3Client.ts';
import { emailQueue } from '../queues/emailQueue.ts';

/** @internal */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadBytes },
});

/** @internal */
const uploadFieldsSchema = z
  .object({
    recipientEmail: z.string().email(),
    password: z.string().min(8),
    linkTtl: z.coerce.number().int().positive(),
    fileTtl: z.coerce.number().int().positive(),
  })
  .refine((data) => data.linkTtl <= data.fileTtl, {
    message: 'linkTtl cannot exceed fileTtl',
  });

/** Express router mounted at `/api/upload`. */
export const uploadRouter = Router();

uploadRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'File is required.' });
      return;
    }

    const parsed = uploadFieldsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { recipientEmail, password, linkTtl, fileTtl } = parsed.data;

    const nameResult = resolveUploadFileName(req.file.originalname, env.allowedUploadExtensions);
    if (!nameResult.ok) {
      res.status(nameResult.status).json({ error: nameResult.error });
      return;
    }
    const { safeFileName } = nameResult;

    let scanResult: { clean: boolean; reason?: string };
    if (env.skipVirusScan) {
      scanResult = { clean: true };
    } else {
      try {
        scanResult = await scanBuffer(req.file.buffer);
      } catch (err) {
        res.status(503).json({
          error: 'Virus scanner unavailable. Upload rejected.',
          detail: err instanceof Error ? err.message : 'Unknown error',
        });
        return;
      }
    }

    if (!scanResult.clean) {
      res.status(422).json({
        error: 'File rejected by virus scanner.',
        reason: scanResult.reason,
      });
      return;
    }

    const s3Key = `documents/${randomBytes(16).toString('hex')}/${safeFileName}`;
    await uploadObject(s3Key, req.file.buffer, req.file.mimetype);

    const passwordHash = await argon2.hash(password);
    const now = new Date();
    const downloadToken = randomBytes(32).toString('hex');

    const doc = await prisma.document.create({
      data: {
        s3Key,
        fileName: safeFileName,
        recipientEmail,
        passwordHash,
        downloadToken,
        linkExpiresAt: addSeconds(now, linkTtl),
        fileExpiresAt: addSeconds(now, fileTtl),
        recordExpiresAt: addYears(now, env.reportingLifetimeYears),
      },
    });

    await emailQueue.add('send-initial-link', {
      docId: doc.id,
      type: 'INITIAL',
    });

    res.status(201).json({
      id: doc.id,
      warning:
        'The file password must be communicated to the recipient via a separate channel (e.g., SMS, phone call). Do not include it in the same email as the download link.',
    });
  } catch (err) {
    console.error('[Upload]', err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});
