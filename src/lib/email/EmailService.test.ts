/**
 * @vitest-environment node
 */

import { describe, expect, it, afterEach } from 'vitest';
import type { EmailPayload } from './IEmailProvider.ts';
import { EmailService } from './EmailService.ts';

function mockEmailService() {
  const sent: EmailPayload[] = [];
  const service = new EmailService();
  Object.assign(service, {
    provider: {
      send: async (payload: EmailPayload) => {
        sent.push(payload);
      },
    },
  });
  return { service, sent };
}

describe('EmailService branding', () => {
  const originalPreset = process.env.BRAND_PRESET;

  afterEach(() => {
    process.env.BRAND_PRESET = originalPreset;
  });

  it('uses client-example preset for verification email', async () => {
    process.env.BRAND_PRESET = 'client-example';
    const { service, sent } = mockEmailService();

    await service.sendAccountEmailVerification('user@example.com', 'https://example.com/verify');

    expect(sent[0]?.subject).toContain('Acme Secure Transfer');
    expect(sent[0]?.body).toContain('https://example.com/verify');
    expect(sent[0]?.from).toBe('Acme Secure Transfer <noreply@acme.example.com>');
    expect(sent[0]?.html).toContain('Verify email address');
    expect(sent[0]?.html).toContain('#C2410C');
  });

  it('uses vellum preset for download link email', async () => {
    process.env.BRAND_PRESET = 'vellum';
    const { service, sent } = mockEmailService();

    await service.sendDownloadLink('recipient@example.com', 'token-123', 'contract.pdf');

    expect(sent[0]?.subject).toContain('contract.pdf');
    expect(sent[0]?.body).toContain('/verify/token-123');
    expect(sent[0]?.body).toContain('Vellum');
    expect(sent[0]?.from).toContain('Vellum');
    expect(sent[0]?.html).toBeDefined();
    expect(sent[0]?.html).toContain('Download document');
    expect(sent[0]?.html).toContain('#2B6CB0');
  });

  it('uses alternate preset copy for download link email', async () => {
    process.env.BRAND_PRESET = 'client-example';
    const { service, sent } = mockEmailService();

    await service.sendDownloadLink('recipient@example.com', 'token-456', 'report.pdf');

    expect(sent[0]?.subject).toContain('report.pdf');
    expect(sent[0]?.body).toContain('Acme Secure Transfer');
    expect(sent[0]?.from).toContain('Acme Secure Transfer');
    expect(sent[0]?.html).toContain('#C2410C');
  });

  it('sends branded HTML for recipient OTP', async () => {
    process.env.BRAND_PRESET = 'vellum';
    const { service, sent } = mockEmailService();

    await service.sendRecipientOtp('recipient@example.com', '654321', 'invoice.pdf', 600);

    expect(sent[0]?.subject).toContain('invoice.pdf');
    expect(sent[0]?.body).toContain('654321');
    expect(sent[0]?.html).toContain('654321');
    expect(sent[0]?.html).not.toContain('Download document');
  });
});
