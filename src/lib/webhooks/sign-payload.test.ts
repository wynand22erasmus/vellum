import { describe, expect, it } from 'vitest';
import { signWebhookPayload, verifyWebhookSignature } from './sign-payload.ts';

describe('signWebhookPayload', () => {
  const secret = 'test-webhook-secret';
  const body = JSON.stringify({ eventType: 'FILE_DOWNLOAD_SUCCESS', auditLogId: 'abc' });

  it('returns sha256= prefixed hex digest', () => {
    const signature = signWebhookPayload(body, secret);
    expect(signature).toMatch(/^sha256=[a-f0-9]{64}$/);
  });

  it('is deterministic for the same body and secret', () => {
    expect(signWebhookPayload(body, secret)).toBe(signWebhookPayload(body, secret));
  });

  it('changes when body or secret changes', () => {
    const base = signWebhookPayload(body, secret);
    expect(signWebhookPayload(`${body} `, secret)).not.toBe(base);
    expect(signWebhookPayload(body, `${secret}-other`)).not.toBe(base);
  });
});

describe('verifyWebhookSignature', () => {
  const secret = 'test-webhook-secret';
  const body = '{"deliveryId":"550e8400-e29b-41d4-a716-446655440000"}';

  it('accepts a valid signature', () => {
    const signature = signWebhookPayload(body, secret);
    expect(verifyWebhookSignature(body, signature, secret)).toBe(true);
  });

  it('rejects wrong secret', () => {
    const signature = signWebhookPayload(body, secret);
    expect(verifyWebhookSignature(body, signature, 'wrong-secret')).toBe(false);
  });

  it('rejects tampered body', () => {
    const signature = signWebhookPayload(body, secret);
    expect(verifyWebhookSignature(`${body}x`, signature, secret)).toBe(false);
  });

  it('rejects missing sha256= prefix', () => {
    const signature = signWebhookPayload(body, secret).replace('sha256=', '');
    expect(verifyWebhookSignature(body, signature, secret)).toBe(false);
  });
});
