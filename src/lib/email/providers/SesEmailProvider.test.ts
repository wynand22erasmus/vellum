/**
 * @vitest-environment node
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const sendMock = vi.fn().mockResolvedValue({});

vi.mock('@aws-sdk/client-ses', () => ({
  SESClient: class MockSesClient {
    send = sendMock;
  },
  SendEmailCommand: class MockSendEmailCommand {
    input: unknown;
    constructor(input: unknown) {
      this.input = input;
    }
  },
}));

import { SesEmailProvider } from './SesEmailProvider.ts';

describe('SesEmailProvider branding', () => {
  const originalPreset = process.env.BRAND_PRESET;

  beforeEach(() => {
    sendMock.mockClear();
    process.env.BRAND_PRESET = 'client-example';
  });

  afterEach(() => {
    process.env.BRAND_PRESET = originalPreset;
  });

  it('uses payload from when provided', async () => {
    const provider = new SesEmailProvider();
    await provider.send({
      to: 'user@example.com',
      subject: 'Test',
      body: 'Body',
      from: 'Custom Sender <custom@example.com>',
    });

    const command = sendMock.mock.calls[0]?.[0] as { input: { Source: string } };
    expect(command.input.Source).toBe('Custom Sender <custom@example.com>');
  });

  it('falls back to brand preset from address when from omitted', async () => {
    const provider = new SesEmailProvider();
    await provider.send({
      to: 'user@example.com',
      subject: 'Test',
      body: 'Body',
    });

    const command = sendMock.mock.calls[0]?.[0] as { input: { Source: string } };
    expect(command.input.Source).toBe('Acme Secure Transfer <noreply@acme.example.com>');
  });
});
