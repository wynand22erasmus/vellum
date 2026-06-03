/**
 * Authenticated document upload API (virus scan, storage, email enqueue).
 *
 * @packageDocumentation
 */

import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import argon2 from 'argon2';
import { addSeconds, addYears } from 'date-fns';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../lib/errors/app-error.ts';
import { validationErrorFromZod } from '../lib/errors/validation-detail.ts';
import { CompensationStack } from '../lib/compensation/compensation-stack.ts';
import { deleteDocumentIfExists } from '../lib/compensation/document.ts';
import { deleteObjectIfExists } from '../lib/compensation/storage.ts';
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

uploadRouter.post(
  '/',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw AppError.badRequest(
        'Multipart upload must include a file field named "file".',
      );
    }

    const parsed = uploadFieldsSchema.safeParse(req.body);
    if (!parsed.success) {
      throw validationErrorFromZod(parsed.error, 'Validation failed for upload metadata.');
    }

    const { recipientEmail, password, linkTtl, fileTtl } = parsed.data;
    const { safeFileName } = resolveUploadFileName(req.file.originalname, env.allowedUploadExtensions);

    let scanResult: { clean: boolean; reason?: string };
    if (env.skipVirusScan) {
      scanResult = { clean: true };
    } else {
      try {
        scanResult = await scanBuffer(req.file.buffer);
      } catch (err) {
        if (err instanceof AppError) {
          throw err;
        }
        throw AppError.serviceUnavailable(
          'Virus scanner is unavailable; the upload was rejected and no file was stored.',
        );
      }
    }

    if (!scanResult.clean) {
      const reason = scanResult.reason ?? 'Malware detected';
      throw AppError.unprocessableContent(
        `File rejected by virus scanner: ${reason}.`,
        { reason },
      );
    }

    const stack = new CompensationStack();
    const passwordHash = await argon2.hash(password);
    const now = new Date();
    const downloadToken = randomBytes(32).toString('hex');
    const s3Key = `documents/${randomBytes(16).toString('hex')}/${safeFileName}`;

    const docId = await stack.run(async () => {
      const doc = await prisma.document.create({
        data: {
          s3Key: null,
          fileName: safeFileName,
          recipientEmail,
          passwordHash,
          downloadToken,
          linkExpiresAt: addSeconds(now, linkTtl),
          fileExpiresAt: addSeconds(now, fileTtl),
          recordExpiresAt: addYears(now, env.reportingLifetimeYears),
        },
      });

      stack.registerUndo(
        'delete document row',
        () => deleteDocumentIfExists(doc.id),
        () => ({ kind: 'document', id: doc.id }),
      );

      await uploadObject(s3Key, req.file!.buffer, req.file!.mimetype);

      stack.registerUndo(
        'delete S3 object',
        () => deleteObjectIfExists(s3Key),
        () => ({ kind: 's3Object', s3Key }),
      );

      await prisma.document.update({
        where: { id: doc.id },
        data: { s3Key },
      });

      try {
        await emailQueue.add('send-initial-link', {
          docId: doc.id,
          type: 'INITIAL',
        });
      } catch (err) {
        throw AppError.serviceUnavailable(
          'The file was saved but the download-link email could not be queued. Retry the upload or contact support.',
          { cause: err },
        );
      }

      return doc.id;
    });

    res.status(201).json({
      id: docId,
      warning:
        'The file password must be communicated to the recipient via a separate channel (e.g., SMS, phone call). Do not include it in the same email as the download link.',
    });
  }),
);
