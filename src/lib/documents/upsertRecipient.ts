/**
 * Upserts {@link Recipient} rows by source-system identity.
 *
 * @packageDocumentation
 */

import { generateSecret, generateURI } from 'otplib';
import type { Recipient, RecipientOtpChannel } from '../../../generated/client.ts';
import { getBrandPresetFromEnv } from '../brand/get-brand-preset.ts';
import { env } from '../env.ts';
import { prisma } from '../prisma.ts';
import { encryptTotpSecret } from '../recipient-otp/totpEncryption.ts';

export type UpsertRecipientInput = {
  sourceSystemKey?: string | null;
  email: string;
  phoneNumber?: string | null;
  otpChannel?: RecipientOtpChannel | null;
};

export type UpsertRecipientResult = {
  recipient: Recipient;
  totpProvisioningUri?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Upserts recipient identity and OTP prefs; enrolls authenticator secret on first use. */
export async function upsertRecipient(input: UpsertRecipientInput): Promise<UpsertRecipientResult> {
  const email = normalizeEmail(input.email);
  const sourceSystemKey = (input.sourceSystemKey?.trim() || email).toLowerCase();
  const otpChannel = env.recipientOtpEnabled ? (input.otpChannel ?? null) : null;
  const phoneNumber =
    otpChannel === 'SMS' || otpChannel === 'WHATSAPP' ? (input.phoneNumber ?? null) : null;

  const existing = await prisma.recipient.findUnique({ where: { sourceSystemKey } });

  let totpProvisioningUri: string | undefined;
  let authenticatorSecretEnc = existing?.authenticatorSecretEnc ?? null;

  if (otpChannel === 'AUTHENTICATOR' && !authenticatorSecretEnc) {
    const secret = generateSecret();
    authenticatorSecretEnc = encryptTotpSecret(secret);
    const brand = getBrandPresetFromEnv();
    totpProvisioningUri = generateURI({
      issuer: brand.displayName,
      label: email,
      secret,
    });
  }

  const recipient = await prisma.recipient.upsert({
    where: { sourceSystemKey },
    create: {
      sourceSystemKey,
      email,
      phoneNumber,
      otpChannel,
      authenticatorSecretEnc,
    },
    update: {
      email,
      ...(phoneNumber !== undefined ? { phoneNumber } : {}),
      ...(otpChannel !== undefined && otpChannel !== null ? { otpChannel } : {}),
      ...(authenticatorSecretEnc && !existing?.authenticatorSecretEnc
        ? { authenticatorSecretEnc }
        : {}),
    },
  });

  return {
    recipient,
    ...(totpProvisioningUri ? { totpProvisioningUri } : {}),
  };
}
