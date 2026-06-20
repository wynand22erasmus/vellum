/**
 * Twilio SMS and WhatsApp delivery for recipient OTP codes.
 *
 * @packageDocumentation
 */

import { getBrandPresetFromEnv } from '../brand/get-brand-preset.ts';
import type { BrandPreset } from '../brand/presets.ts';
import { renderBrandTemplate } from '../brand/render-template.ts';
import { env } from '../env.ts';

export type SmsSendResult = {
  sent: boolean;
  devMode: boolean;
  sid?: string;
};

function twilioConfigured(): boolean {
  return Boolean(env.twilioAccountSid() && env.twilioAuthToken() && env.twilioFromNumber());
}

async function twilioPost(path: string, body: URLSearchParams): Promise<Response> {
  const sid = env.twilioAccountSid()!;
  const token = env.twilioAuthToken()!;
  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  return fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
}

/** Build branded OTP body for SMS or WhatsApp from the active preset. */
export function buildRecipientOtpMessage(
  channel: 'sms' | 'whatsapp',
  code: string,
  fileName: string,
  expiresInSeconds: number,
  preset: BrandPreset = getBrandPresetFromEnv(),
): string {
  const template =
    channel === 'sms'
      ? preset.sms.templates.recipientOtp
      : preset.whatsapp.templates.recipientOtp;
  const minutes = Math.max(1, Math.round(expiresInSeconds / 60));
  return renderBrandTemplate(template, {
    displayName: preset.displayName,
    code,
    fileName,
    expiresMinutes: String(minutes),
  });
}

/**
 * Sends an OTP via SMS. Logs to console when Twilio is not configured (dev fallback).
 */
export async function sendSmsOtp(
  to: string,
  code: string,
  fileName: string,
  expiresInSeconds: number,
): Promise<SmsSendResult> {
  const message = buildRecipientOtpMessage('sms', code, fileName, expiresInSeconds);

  if (!twilioConfigured()) {
    console.info(`[dev-sms] to=${to} code=${code} file=${fileName} message=${message}`);
    return { sent: true, devMode: true };
  }

  const body = new URLSearchParams({
    To: to,
    From: env.twilioFromNumber()!,
    Body: message,
  });
  const res = await twilioPost('/Messages.json', body);
  const data = (await res.json()) as { sid?: string; message?: string };
  if (!res.ok) {
    throw new Error(data.message ?? `Twilio SMS failed (${res.status})`);
  }
  return { sent: true, devMode: false, sid: data.sid };
}

/**
 * Sends an OTP via WhatsApp. Uses Twilio WhatsApp sandbox/from prefix when configured.
 */
export async function sendWhatsAppOtp(
  to: string,
  code: string,
  fileName: string,
  expiresInSeconds: number,
): Promise<SmsSendResult> {
  const message = buildRecipientOtpMessage('whatsapp', code, fileName, expiresInSeconds);

  if (!twilioConfigured()) {
    console.info(`[dev-whatsapp] to=${to} code=${code} file=${fileName} message=${message}`);
    return { sent: true, devMode: true };
  }

  const from = env.twilioFromNumber()!.startsWith('whatsapp:')
    ? env.twilioFromNumber()!
    : `whatsapp:${env.twilioFromNumber()}`;
  const toWhatsApp = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  const body = new URLSearchParams({
    To: toWhatsApp,
    From: from,
    Body: message,
  });
  const res = await twilioPost('/Messages.json', body);
  const data = (await res.json()) as { sid?: string; message?: string };
  if (!res.ok) {
    throw new Error(data.message ?? `Twilio WhatsApp failed (${res.status})`);
  }
  return { sent: true, devMode: false, sid: data.sid };
}
