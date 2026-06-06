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
  });

  it('uses vellum preset for download link email', async () => {
    process.env.BRAND_PRESET = 'vellum';
    const { service, sent } = mockEmailService();

    await service.sendDownloadLink('recipient@example.com', 'token-123', 'contract.pdf');

    expect(sent[0]?.subject).toContain('contract.pdf');
    expect(sent[0]?.body).toContain('/verify/token-123');
    expect(sent[0]?.body).toContain('Vellum');
    expect(sent[0]?.from).toContain('Vellum');
  });

  it('uses alternate preset copy for download link email', async () => {
    process.env.BRAND_PRESET = 'client-example';
    const { service, sent } = mockEmailService();

    await service.sendDownloadLink('recipient@example.com', 'token-456', 'report.pdf');

    expect(sent[0]?.subject).toContain('report.pdf');
    expect(sent[0]?.body).toContain('Acme Secure Transfer');
    expect(sent[0]?.from).toContain('Acme Secure Transfer');
  });
});
