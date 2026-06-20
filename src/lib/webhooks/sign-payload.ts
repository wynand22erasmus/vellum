/**
 * HMAC-SHA256 signing for outbound webhook payloads.
 *
 * @packageDocumentation
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

const SIGNATURE_PREFIX = 'sha256=';

/**
 * Computes the `X-Vellum-Signature` header value for a raw JSON body.
 *
 * @param rawBody - Exact bytes sent in the POST body
 * @param secret - `WEBHOOK_SECRET` value
 */
export function signWebhookPayload(rawBody: string, secret: string): string {
  const digest = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  return `${SIGNATURE_PREFIX}${digest}`;
}

/**
 * Verifies an incoming webhook signature over the raw request body.
 *
 * @param rawBody - Exact bytes received in the POST body
 * @param signatureHeader - Value of `X-Vellum-Signature`
 * @param secret - Shared HMAC secret
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): boolean {
  if (!signatureHeader.startsWith(SIGNATURE_PREFIX)) {
    return false;
  }

  const expected = signWebhookPayload(rawBody, secret);
  const received = signatureHeader.trim();

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}
