/**
 * hCaptcha server-side verification via siteverify API.
 *
 * @packageDocumentation
 */

import { env } from '../env.ts';

export type HcaptchaVerifyResult = {
  success: boolean;
  errorCodes?: string[];
};

/**
 * Validates an hCaptcha response token with the provider siteverify endpoint.
 *
 * @param token - Client-side hCaptcha response token
 * @param remoteIp - Optional client IP forwarded to hCaptcha
 */
export async function verifyHcaptcha(
  token: string,
  remoteIp?: string,
): Promise<HcaptchaVerifyResult> {
  const secret = env.hcaptchaSecretKey();
  if (!secret) {
    return { success: false, errorCodes: ['missing-secret'] };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteIp) {
    body.set('remoteip', remoteIp);
  }

  const res = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    return { success: false, errorCodes: [`http-${res.status}`] };
  }

  const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
  return {
    success: data.success === true,
    errorCodes: data['error-codes'],
  };
}

/** Whether captcha verification is required for verify requests. */
export function isCaptchaRequired(): boolean {
  return env.captchaProvider === 'hcaptcha' && !env.skipCaptcha;
}
