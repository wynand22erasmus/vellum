/**
 * Authenticated document upload API (virus scan, storage, email enqueue).
 *
 * @packageDocumentation
 */

import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { validationErrorFromZod } from '../../lib/errors/validation-detail.ts';
import { CompensationStack } from '../../lib/compensation/compensation-stack.ts';
import { createDocumentUserLink } from '../../lib/documents/createDocumentUserLink.ts';
import { ingestDocumentFile } from '../../lib/documents/ingestDocumentFile.ts';
import {
  batchRecipientSchema,
  uploadFieldsSchema,
} from '../../lib/documents/uploadSchemas.ts';
import { env } from '../../lib/env.ts';
import { created } from './http-helpers.ts';
import { resolveUploadFileName } from '../../lib/uploadFilename.ts';

/** @internal */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadBytes },
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
    const maxDownloads = parsed.data.maxDownloads ?? env.defaultMaxDownloads;
    const otpChannel = env.recipientOtpEnabled ? (parsed.data.otpChannel ?? null) : null;
    const recipientPhone =
      otpChannel === 'sms' || otpChannel === 'whatsapp' ? parsed.data.recipientPhone : null;

    const { safeFileName } = resolveUploadFileName(req.file.originalname, env.allowedUploadExtensions);
    const stack = new CompensationStack();

    const result = await stack.run(async () => {
      const documentFile = await ingestDocumentFile({
        buffer: req.file!.buffer,
        fileName: safeFileName,
        mimeType: req.file!.mimetype,
        fileTtlSeconds: fileTtl,
        stack,
      });

      const { link, totpProvisioningUri } = await createDocumentUserLink({
        documentFile,
        recipientEmail,
        password,
        linkTtlSeconds: linkTtl,
        maxDownloads,
        otpChannel,
        recipientPhone,
        stack,
      });

      return { link, documentFile, totpProvisioningUri, maxDownloads, otpChannel };
    });

    created(req, res, {
      id: result.link.id,
      linkId: result.link.id,
      fileId: result.documentFile.id,
      sha256: result.documentFile.sha256,
      maxDownloads: result.maxDownloads,
      otpChannel: result.otpChannel,
      ...(result.totpProvisioningUri ? { totpProvisioningUri: result.totpProvisioningUri } : {}),
      warning:
        'The file password must be communicated to the recipient via a separate channel (e.g., SMS, phone call). Do not include it in the same email as the download link.',
    });
  }),
);

uploadRouter.post(
  '/batch',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw AppError.badRequest(
        'Multipart batch upload must include a file field named "file".',
      );
    }

    const recipientsRaw = req.body.recipients;
    if (recipientsRaw === undefined || recipientsRaw === null || recipientsRaw === '') {
      throw AppError.badRequest(
        'Batch upload requires a "recipients" field containing a JSON array.',
      );
    }

    let recipientsJson: unknown;
    try {
      recipientsJson =
        typeof recipientsRaw === 'string' ? JSON.parse(recipientsRaw) : recipientsRaw;
    } catch {
      throw AppError.badRequest('The "recipients" field must be valid JSON.');
    }

    const recipientsParsed = z
      .array(batchRecipientSchema)
      .min(1)
      .max(env.maxBatchRecipients)
      .safeParse(recipientsJson);

    if (!recipientsParsed.success) {
      throw validationErrorFromZod(
        recipientsParsed.error,
        `Validation failed for batch recipients (max ${env.maxBatchRecipients}).`,
      );
    }

    const recipients = recipientsParsed.data;
    const { safeFileName } = resolveUploadFileName(req.file.originalname, env.allowedUploadExtensions);
    const maxFileTtl = Math.max(...recipients.map((r) => r.fileTtl));
    const batchId = randomUUID();
    const stack = new CompensationStack();

    const payload = await stack.run(async () => {
      const documentFile = await ingestDocumentFile({
        buffer: req.file!.buffer,
        fileName: safeFileName,
        mimeType: req.file!.mimetype,
        fileTtlSeconds: maxFileTtl,
        stack,
      });

      const links: Array<{ id: string; recipientEmail: string; totpProvisioningUri?: string }> = [];

      for (const recipient of recipients) {
        const otpChannel = env.recipientOtpEnabled ? (recipient.otpChannel ?? null) : null;
        const recipientPhone =
          otpChannel === 'sms' || otpChannel === 'whatsapp' ? recipient.recipientPhone : null;

        const { link, totpProvisioningUri } = await createDocumentUserLink({
          documentFile,
          recipientEmail: recipient.recipientEmail,
          password: recipient.password,
          linkTtlSeconds: recipient.linkTtl,
          maxDownloads: recipient.maxDownloads,
          otpChannel,
          recipientPhone,
          batchId,
          stack,
        });

        links.push({
          id: link.id,
          recipientEmail: link.recipientEmail,
          ...(totpProvisioningUri ? { totpProvisioningUri } : {}),
        });
      }

      return { documentFile, links };
    });

    created(req, res, {
      batchId,
      fileId: payload.documentFile.id,
      sha256: payload.documentFile.sha256,
      links: payload.links,
      warning:
        'Each recipient file password must be communicated via a separate channel. Do not include passwords in the same email as download links.',
    });
  }),
);
