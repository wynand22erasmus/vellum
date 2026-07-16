/**
 * Recipient download verification (link token + file password + optional OTP).
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import argon2 from 'argon2';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { RecipientOtpChannel } from '../../../generated/enums.ts';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { validationErrorFromZod } from '../../lib/errors/validation-detail.ts';
import { isCaptchaRequired, verifyHcaptcha } from '../../lib/captcha/verifyHcaptcha.ts';
import {
  communicationGraphInclude,
  toCommunicationContext,
  type CommunicationContext,
} from '../../lib/documents/types.ts';
import { env } from '../../lib/env.ts';
import { completeDownload } from '../../lib/recipient-otp/completeDownload.ts';
import {
  isRecipientOtpRequired,
  resendRecipientOtp,
  startRecipientOtp,
  verifyRecipientOtp,
} from '../../lib/recipient-otp/recipientOtpService.ts';
import { getVerifyRejection } from '../../lib/verify-consumption.ts';
import { prisma } from '../../lib/prisma.ts';
import { logEvent } from '../queues/auditQueue.ts';
import { ok } from './http-helpers.ts';

/** @internal */
const verifySchema = z.object({
  token: z.string().min(1, 'Download link token is required.'),
  password: z.string().min(1, 'File password is required.'),
  hcaptchaToken: z.string().optional(),
});

/** @internal */
const otpVerifySchema = z.object({
  token: z.string().min(1, 'Download link token is required.'),
  otpSessionId: z.string().uuid('A valid OTP session id is required.'),
  code: z.string().min(4, 'Verification code is required.'),
});

/** @internal */
const otpResendSchema = z.object({
  token: z.string().min(1, 'Download link token is required.'),
  otpSessionId: z.string().uuid('A valid OTP session id is required.'),
});

/** @internal */
function logFileDownloadFailed(
  reason: string,
  options: {
    documentId?: string;
    communicationId?: string;
    ip?: string;
    userAgent?: string;
  } = {},
): void {
  logEvent({
    eventType: 'FILE_DOWNLOAD_FAILED',
    documentId: options.documentId,
    communicationId: options.communicationId,
    ip: options.ip,
    userAgent: options.userAgent,
    metadata: { reason },
  });
}

/** @internal */
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const body = req.body as { token?: string };
    if (body?.token) return body.token;
    return ipKeyGenerator(req.ip ?? '127.0.0.1');
  },
  handler: (req, _res, next) => {
    logFileDownloadFailed('rate_limited', {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
    next(
      AppError.tooManyRequests(
        'Too many download verification attempts for this link or IP address. Please wait 15 minutes and try again.',
      ),
    );
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/** @internal */
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    const body = req.body as { token?: string; otpSessionId?: string };
    if (body?.otpSessionId) return body.otpSessionId;
    if (body?.token) return body.token;
    return ipKeyGenerator(req.ip ?? '127.0.0.1');
  },
  handler: (_req, _res, next) => {
    next(AppError.tooManyRequests('Too many OTP attempts. Please wait and try again.'));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

async function assertCaptcha(req: { body: { hcaptchaToken?: string }; ip?: string }): Promise<void> {
  if (!isCaptchaRequired()) {
    return;
  }

  const token = req.body.hcaptchaToken;
  if (!token) {
    logEvent({
      eventType: 'CAPTCHA_FAILED',
      ip: req.ip,
      metadata: { reason: 'missing_token' },
    });
    throw AppError.forbidden('Complete the captcha before submitting your password.');
  }

  const result = await verifyHcaptcha(token, req.ip);
  if (!result.success) {
    logEvent({
      eventType: 'CAPTCHA_FAILED',
      ip: req.ip,
      metadata: { reason: 'siteverify_failed', errorCodes: result.errorCodes },
    });
    throw AppError.forbidden('Captcha verification failed. Please try again.');
  }
}

async function loadDocumentForVerify(
  token: string,
  now: Date,
  requestMeta?: { ip?: string; userAgent?: string },
): Promise<{
  doc: CommunicationContext;
  consumptionConfig: { reverifyWindowMs: number; maxReverifyAttempts: number };
}> {
  const consumptionConfig = {
    reverifyWindowMs: env.reverifyWindowMs,
    maxReverifyAttempts: env.maxReverifyAttempts,
  };

  const link = await prisma.communication.findFirst({
    where: { downloadToken: token },
    include: communicationGraphInclude,
  });

  if (!link) {
    logFileDownloadFailed('invalid_token', requestMeta);
    throw AppError.notFound(
      'Invalid download link. No document matches this token; the link may have been replaced.',
    );
  }

  const doc = toCommunicationContext(link);

  if (doc.revokedAt) {
    logFileDownloadFailed('revoked', {
      documentId: doc.documentId,
      communicationId: doc.communicationId,
      ...requestMeta,
    });
    throw AppError.gone('This download link has been revoked.', {
      actionRequired: 'Contact the sender for a new transfer.',
    });
  }

  if (!doc.s3Key) {
    logFileDownloadFailed('file_purged', {
      documentId: doc.documentId,
      communicationId: doc.communicationId,
      ...requestMeta,
    });
    throw AppError.gone(
      'The source file has been permanently deleted per the retention policy.',
    );
  }

  if (new Date() > doc.linkExpiresAt) {
    logFileDownloadFailed('expired_link', {
      documentId: doc.documentId,
      communicationId: doc.communicationId,
      ...requestMeta,
    });
    throw AppError.gone('This link has expired.', {
      actionRequired: 'Please log in to your Vellum dashboard to request a new link.',
    });
  }

  const rejection = getVerifyRejection(doc, now, consumptionConfig);
  if (rejection === 'download_limit_reached') {
    logFileDownloadFailed('download_limit_reached', {
      documentId: doc.documentId,
      communicationId: doc.communicationId,
      ...requestMeta,
    });
    throw AppError.gone('This document has reached its download limit.', {
      actionRequired: 'Please log in to your Vellum dashboard to request a new link.',
    });
  }
  if (rejection === 'link_consumed') {
    logFileDownloadFailed('link_consumed', {
      documentId: doc.documentId,
      communicationId: doc.communicationId,
      ...requestMeta,
    });
    throw AppError.gone(
      'This link has already been used. If your download did not start, request a new link from the dashboard.',
      {
        actionRequired: 'Please log in to your Vellum dashboard to request a new link.',
      },
    );
  }

  return { doc, consumptionConfig };
}

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

    await assertCaptcha(req);

    const { token, password } = parsed.data;
    const now = new Date();
    const { doc } = await loadDocumentForVerify(token, now, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const isValid = await argon2.verify(doc.passwordHash, password);
    if (!isValid) {
      const correlationId = randomUUID();
      logEvent({
        eventType: 'FILE_DOWNLOAD_FAILED',
        documentId: doc.documentId,
        communicationId: doc.communicationId,
        correlationId,
        metadata: { correlationId, reason: 'Incorrect password' },
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      req.errorCorrelationId = correlationId;
      req.errorCommunicationId = doc.communicationId;
      throw AppError.unauthorized(
        'The file password does not match. Use the password provided separately by the sender.',
      );
    }

    if (isRecipientOtpRequired(doc)) {
      const otpSessionId = randomUUID();
      const { channel, expiresInSeconds } = await startRecipientOtp({
        sessionId: otpSessionId,
        doc,
      });

      if (channel !== RecipientOtpChannel.AUTHENTICATOR) {
        logEvent({
          eventType: 'RECIPIENT_OTP_SENT',
          documentId: doc.documentId,
          communicationId: doc.communicationId,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          metadata: { channel, otpSessionId },
        });
      }

      ok(req, res, {
        otpRequired: true,
        otpSessionId,
        otpChannel: channel,
        otpExpiresInSeconds: expiresInSeconds,
      });
      return;
    }

    const result = await completeDownload(doc, req, now);
    ok(req, res, result);
  }),
);

verifyRouter.post(
  '/otp',
  otpLimiter,
  asyncHandler(async (req, res) => {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success) {
      throw validationErrorFromZod(parsed.error, 'OTP verification requires token, session, and code.');
    }

    const { token, otpSessionId, code } = parsed.data;
    const now = new Date();
    const { doc } = await loadDocumentForVerify(token, now, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (!isRecipientOtpRequired(doc)) {
      throw AppError.badRequest('Recipient OTP is not enabled for this document.');
    }

    const otpResult = await verifyRecipientOtp({ sessionId: otpSessionId, code, doc });
    if (!otpResult.ok) {
      logEvent({
        eventType: 'RECIPIENT_OTP_FAILED',
        documentId: doc.documentId,
        communicationId: doc.communicationId,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { reason: otpResult.reason, otpSessionId },
      });

      if (otpResult.reason === 'expired') {
        throw AppError.gone('This verification code has expired. Submit your password again.');
      }
      if (otpResult.reason === 'max_attempts') {
        throw AppError.tooManyRequests('Too many incorrect codes. Submit your password again.');
      }
      throw AppError.unauthorized('The verification code is incorrect.');
    }

    logEvent({
      eventType: 'RECIPIENT_OTP_VERIFIED',
      documentId: doc.documentId,
      communicationId: doc.communicationId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { channel: doc.otpChannel, otpSessionId },
    });

    const result = await completeDownload(doc, req, now);
    ok(req, res, result);
  }),
);

verifyRouter.post(
  '/otp/resend',
  otpLimiter,
  asyncHandler(async (req, res) => {
    const parsed = otpResendSchema.safeParse(req.body);
    if (!parsed.success) {
      throw validationErrorFromZod(parsed.error, 'OTP resend requires token and session id.');
    }

    const { token, otpSessionId } = parsed.data;
    const now = new Date();
    const { doc } = await loadDocumentForVerify(token, now, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (!isRecipientOtpRequired(doc)) {
      throw AppError.badRequest('Recipient OTP is not enabled for this document.');
    }

    if (doc.otpChannel === RecipientOtpChannel.AUTHENTICATOR) {
      throw AppError.badRequest('Authenticator codes cannot be resent. Use your authenticator app.');
    }

    try {
      await resendRecipientOtp({ sessionId: otpSessionId, doc });
    } catch (err) {
      const reason = (err as { reason?: string }).reason;
      if (reason === 'expired') {
        throw AppError.gone('This OTP session has expired. Submit your password again.');
      }
      if (reason === 'max_resends') {
        throw AppError.tooManyRequests('Maximum OTP resend limit reached.');
      }
      throw err;
    }

    logEvent({
      eventType: 'RECIPIENT_OTP_RESENT',
      documentId: doc.documentId,
      communicationId: doc.communicationId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { channel: doc.otpChannel, otpSessionId },
    });

    ok(req, res, {
      otpExpiresInSeconds: env.otpTtlSeconds,
    });
  }),
);
