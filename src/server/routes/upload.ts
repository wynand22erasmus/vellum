/**
 * Authenticated document upload API (virus scan, storage, email enqueue).
 *
 * @packageDocumentation
 */

import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { RecipientOtpChannel } from '../../../generated/enums.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { validationErrorFromZod } from '../../lib/errors/validation-detail.ts';
import { CompensationStack } from '../../lib/compensation/compensation-stack.ts';
import { createDelivery } from '../../lib/documents/createDelivery.ts';
import { createDocument } from '../../lib/documents/createDocument.ts';
import { createCommunication } from '../../lib/documents/createCommunication.ts';
import { ingestFile } from '../../lib/documents/ingestFile.ts';
import { upsertRecipient } from '../../lib/documents/upsertRecipient.ts';
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
      otpChannel === RecipientOtpChannel.SMS || otpChannel === RecipientOtpChannel.WHATSAPP
        ? parsed.data.recipientPhone
        : null;

    const { safeFileName } = resolveUploadFileName(req.file.originalname, env.allowedUploadExtensions);
    const stack = new CompensationStack();

    const result = await stack.run(async () =>
      createDelivery({
        buffer: req.file!.buffer,
        fileName: safeFileName,
        mimeType: req.file!.mimetype,
        fileTtlSeconds: fileTtl,
        linkTtlSeconds: linkTtl,
        recipientEmail,
        sourceSystemKey: parsed.data.sourceSystemKey,
        password,
        maxDownloads,
        otpChannel,
        recipientPhone,
        stack,
      }),
    );

    created(req, res, {
      documentId: result.document.documentId,
      communicationId: result.link.communicationId,
      fileId: result.file.fileId,
      sha256: result.file.sha256,
      maxDownloads,
      otpChannel,
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
      const file = await ingestFile({
        buffer: req.file!.buffer,
        fileName: safeFileName,
        mimeType: req.file!.mimetype,
        fileTtlSeconds: maxFileTtl,
        stack,
      });

      const links: Array<{
        documentId: string;
        communicationId: string;
        recipientEmail: string;
        totpProvisioningUri?: string;
      }> = [];

      for (const recipient of recipients) {
        const otpChannel = env.recipientOtpEnabled ? (recipient.otpChannel ?? null) : null;
        const recipientPhone =
          otpChannel === RecipientOtpChannel.SMS || otpChannel === RecipientOtpChannel.WHATSAPP
            ? recipient.recipientPhone
            : null;

        const { recipient: recipientRow, totpProvisioningUri } = await upsertRecipient({
          sourceSystemKey: recipient.sourceSystemKey,
          email: recipient.recipientEmail,
          phoneNumber: recipientPhone,
          otpChannel,
        });

        const document = await createDocument({
          file,
          recipient: recipientRow,
          password: recipient.password,
          maxDownloads: recipient.maxDownloads,
          batchId,
          stack,
        });

        const { link } = await createCommunication({
          document,
          linkTtlSeconds: recipient.linkTtl,
          stack,
        });

        links.push({
          documentId: document.documentId,
          communicationId: link.communicationId,
          recipientEmail: recipientRow.email,
          ...(totpProvisioningUri ? { totpProvisioningUri } : {}),
        });
      }

      return { file, links };
    });

    created(req, res, {
      batchId,
      fileId: payload.file.fileId,
      sha256: payload.file.sha256,
      links: payload.links,
      warning:
        'Each recipient file password must be communicated via a separate channel. Do not include passwords in the same email as download links.',
    });
  }),
);
