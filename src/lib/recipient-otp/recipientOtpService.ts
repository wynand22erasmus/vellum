/**
 * Recipient OTP orchestration: send, verify, resend.
 *
 * @packageDocumentation
 */

import { verifySync } from 'otplib';
import type { RecipientOtpChannel } from '../../../generated/client.ts';
import type { DocumentContext } from '../documents/types.ts';
import { EmailService } from '../email/EmailService.ts';
import { env } from '../env.ts';
import { sendSmsOtp, sendWhatsAppOtp } from '../sms/twilioClient.ts';
import { decryptTotpSecret } from './totpEncryption.ts';
import {
  createOtpSession,
  deleteOtpSession,
  getOtpSession,
  incrementOtpAttempts,
  resendOtpCode,
  verifyOtpCode,
} from './recipientOtpStore.ts';

const emailService = new EmailService();

/** Whether recipient OTP is required for the given document row. */
export function isRecipientOtpRequired(doc: Pick<DocumentContext, 'otpChannel'>): boolean {
  return env.recipientOtpEnabled && doc.otpChannel !== null;
}

/**
 * Creates OTP session and dispatches code for email/SMS/WhatsApp channels.
 */
export async function startRecipientOtp(input: {
  sessionId: string;
  doc: DocumentContext;
}): Promise<{ channel: RecipientOtpChannel; expiresInSeconds: number }> {
  const channel = input.doc.otpChannel!;
  const { code } = await createOtpSession({
    sessionId: input.sessionId,
    documentId: input.doc.id,
    channel,
  });

  if (channel === 'email' && code) {
    await emailService.sendRecipientOtp(
      input.doc.recipientEmail,
      code,
      input.doc.fileName,
      env.otpTtlSeconds,
    );
  } else if (channel === 'sms' && code && input.doc.recipientPhone) {
    await sendSmsOtp(
      input.doc.recipientPhone,
      code,
      input.doc.fileName,
      env.otpTtlSeconds,
    );
  } else if (channel === 'whatsapp' && code && input.doc.recipientPhone) {
    await sendWhatsAppOtp(
      input.doc.recipientPhone,
      code,
      input.doc.fileName,
      env.otpTtlSeconds,
    );
  }

  return { channel, expiresInSeconds: env.otpTtlSeconds };
}

/** Resends OTP for the given session (not supported for authenticator). */
export async function resendRecipientOtp(input: {
  sessionId: string;
  doc: DocumentContext;
}): Promise<void> {
  const result = await resendOtpCode(input.sessionId);
  if (!result.ok || !result.code) {
    throw result;
  }

  const channel = input.doc.otpChannel!;
  if (channel === 'email') {
    await emailService.sendRecipientOtp(
      input.doc.recipientEmail,
      result.code,
      input.doc.fileName,
      env.otpTtlSeconds,
    );
  } else if (channel === 'sms' && input.doc.recipientPhone) {
    await sendSmsOtp(
      input.doc.recipientPhone,
      result.code,
      input.doc.fileName,
      env.otpTtlSeconds,
    );
  } else if (channel === 'whatsapp' && input.doc.recipientPhone) {
    await sendWhatsAppOtp(
      input.doc.recipientPhone,
      result.code,
      input.doc.fileName,
      env.otpTtlSeconds,
    );
  }
}

/**
 * Verifies submitted OTP (Redis code or TOTP) for a session tied to a document.
 */
export async function verifyRecipientOtp(input: {
  sessionId: string;
  code: string;
  doc: DocumentContext;
}): Promise<{ ok: boolean; reason?: 'expired' | 'max_attempts' | 'invalid' | 'missing_secret' }> {
  const session = await getOtpSession(input.sessionId);
  if (!session || session.documentId !== input.doc.id) {
    return { ok: false, reason: 'expired' };
  }

  if (input.doc.otpChannel === 'authenticator') {
    if (session.attempts >= env.otpMaxAttempts) {
      return { ok: false, reason: 'max_attempts' };
    }
    if (!input.doc.totpSecretEnc) {
      return { ok: false, reason: 'missing_secret' };
    }
    const secret = decryptTotpSecret(input.doc.totpSecretEnc);
    const { valid } = verifySync({ token: input.code, secret });
    if (!valid) {
      const { maxAttemptsReached } = await incrementOtpAttempts(input.sessionId);
      if (maxAttemptsReached) {
        return { ok: false, reason: 'max_attempts' };
      }
      return { ok: false, reason: 'invalid' };
    }
    await deleteOtpSession(input.sessionId);
    return { ok: true };
  }

  const result = await verifyOtpCode(input.sessionId, input.code);
  if (result.ok) {
    return { ok: true };
  }
  return { ok: false, reason: result.reason ?? 'invalid' };
}
