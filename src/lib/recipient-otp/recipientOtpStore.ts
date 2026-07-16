/**
 * Redis-backed ephemeral recipient OTP sessions.
 *
 * @packageDocumentation
 */

import { createHash, randomInt } from 'node:crypto';
import type { RecipientOtpChannel } from '../../../generated/client.ts';
import { env } from '../env.ts';
import { redisConnection } from '../redis.ts';

export type OtpSessionRecord = {
  documentId: string;
  communicationId: string;
  channel: RecipientOtpChannel;
  codeHash: string | null;
  attempts: number;
  resends: number;
};

const KEY_PREFIX = 'recipient-otp:';

function sessionKey(sessionId: string): string {
  return `${KEY_PREFIX}${sessionId}`;
}

function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

/** Generates a six-digit numeric OTP code. */
export function generateOtpCode(): string {
  const devCode = env.recipientOtpDevCode();
  if (devCode && devCode.length >= 4) {
    return devCode;
  }
  return String(randomInt(100_000, 1_000_000));
}

/**
 * Creates a new OTP session after successful password verification.
 */
export async function createOtpSession(input: {
  sessionId: string;
  documentId: string;
  communicationId: string;
  channel: RecipientOtpChannel;
  code?: string;
}): Promise<{ code: string | null }> {
  const needsCode = input.channel !== 'AUTHENTICATOR';
  const code = needsCode ? (input.code ?? generateOtpCode()) : null;

  const record: OtpSessionRecord = {
    documentId: input.documentId,
    communicationId: input.communicationId,
    channel: input.channel,
    codeHash: code ? hashCode(code) : null,
    attempts: 0,
    resends: 0,
  };

  await redisConnection.set(
    sessionKey(input.sessionId),
    JSON.stringify(record),
    'EX',
    env.otpTtlSeconds,
  );

  return { code };
}

/** Loads an OTP session or null when missing/expired. */
export async function getOtpSession(sessionId: string): Promise<OtpSessionRecord | null> {
  const raw = await redisConnection.get(sessionKey(sessionId));
  if (!raw) return null;
  return JSON.parse(raw) as OtpSessionRecord;
}

/** Persists session updates while preserving TTL. */
async function saveSession(sessionId: string, record: OtpSessionRecord): Promise<void> {
  const ttl = await redisConnection.ttl(sessionKey(sessionId));
  const seconds = ttl > 0 ? ttl : env.otpTtlSeconds;
  await redisConnection.set(sessionKey(sessionId), JSON.stringify(record), 'EX', seconds);
}

/** Verifies a submitted code against the session hash. Returns updated attempts. */
export async function verifyOtpCode(
  sessionId: string,
  code: string,
): Promise<{ ok: boolean; record: OtpSessionRecord | null; reason?: 'expired' | 'max_attempts' | 'invalid' }> {
  const record = await getOtpSession(sessionId);
  if (!record) {
    return { ok: false, record: null, reason: 'expired' };
  }

  if (record.attempts >= env.otpMaxAttempts) {
    return { ok: false, record, reason: 'max_attempts' };
  }

  record.attempts += 1;

  if (!record.codeHash || hashCode(code) !== record.codeHash) {
    await saveSession(sessionId, record);
    return { ok: false, record, reason: 'invalid' };
  }

  await redisConnection.del(sessionKey(sessionId));
  return { ok: true, record };
}

/** Rotates OTP code for resend (email/SMS/WhatsApp only). */
export async function resendOtpCode(
  sessionId: string,
): Promise<{ ok: boolean; code?: string; reason?: 'expired' | 'max_resends' | 'authenticator' }> {
  const record = await getOtpSession(sessionId);
  if (!record) {
    return { ok: false, reason: 'expired' };
  }

  if (record.channel === 'AUTHENTICATOR') {
    return { ok: false, reason: 'authenticator' };
  }

  if (record.resends >= env.otpMaxResends) {
    return { ok: false, reason: 'max_resends' };
  }

  const code = generateOtpCode();
  record.codeHash = hashCode(code);
  record.resends += 1;
  record.attempts = 0;
  await saveSession(sessionId, record);
  return { ok: true, code };
}

/** Increments failed attempt counter for a session (e.g. TOTP mismatch). */
export async function incrementOtpAttempts(
  sessionId: string,
): Promise<{ record: OtpSessionRecord | null; maxAttemptsReached: boolean }> {
  const record = await getOtpSession(sessionId);
  if (!record) {
    return { record: null, maxAttemptsReached: false };
  }
  record.attempts += 1;
  if (record.attempts >= env.otpMaxAttempts) {
    await deleteOtpSession(sessionId);
    return { record, maxAttemptsReached: true };
  }
  await saveSession(sessionId, record);
  return { record, maxAttemptsReached: false };
}

/** Removes an OTP session after successful verification or abandonment. */
export async function deleteOtpSession(sessionId: string): Promise<void> {
  await redisConnection.del(sessionKey(sessionId));
}
