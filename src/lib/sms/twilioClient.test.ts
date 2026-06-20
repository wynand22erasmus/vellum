/**
 * @vitest-environment node
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { getBrandPreset } from '../brand/presets.ts';
import { renderBrandTemplate } from '../brand/render-template.ts';
import { buildRecipientOtpMessage, sendSmsOtp, sendWhatsAppOtp } from './twilioClient.ts';

vi.mock('../env.ts', () => ({
  env: {
    twilioAccountSid: () => undefined,
    twilioAuthToken: () => undefined,
    twilioFromNumber: () => undefined,
  },
}));

describe('buildRecipientOtpMessage', () => {
  it('renders vellum SMS template with OTP variables', () => {
    const preset = getBrandPreset('vellum');
    const message = buildRecipientOtpMessage('sms', '654321', 'report.pdf', 600, preset);
    expect(message).toBe(
      'Your Vellum download code for "report.pdf" is 654321. It expires in 10 minute(s).',
    );
  });

  it('renders client-example WhatsApp template', () => {
    const preset = getBrandPreset('client-example');
    const message = buildRecipientOtpMessage('whatsapp', '111222', 'invoice.pdf', 90, preset);
    expect(message).toBe(
      'Acme Secure Transfer: Your download code for "invoice.pdf" is 111222. Expires in 2 minute(s).',
    );
  });

  it('rounds expiresMinutes up to at least 1', () => {
    const preset = getBrandPreset('vellum');
    expect(buildRecipientOtpMessage('sms', '000000', 'a.pdf', 30, preset)).toContain(
      '1 minute(s)',
    );
  });
});

describe('sendSmsOtp / sendWhatsAppOtp', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs branded SMS body in dev mode', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const preset = getBrandPreset('vellum');
    const expected = buildRecipientOtpMessage('sms', '123456', 'contract.pdf', 600, preset);

    await sendSmsOtp('+15551234567', '123456', 'contract.pdf', 600);

    expect(info).toHaveBeenCalledWith(
      `[dev-sms] to=+15551234567 code=123456 file=contract.pdf message=${expected}`,
    );
  });

  it('logs branded WhatsApp body in dev mode', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const previous = process.env.BRAND_PRESET;
    process.env.BRAND_PRESET = 'client-example';
    const preset = getBrandPreset('client-example');
    const expected = buildRecipientOtpMessage(
      'whatsapp',
      '999888',
      'nda.pdf',
      600,
      preset,
    );

    await sendWhatsAppOtp('+15559876543', '999888', 'nda.pdf', 600);

    process.env.BRAND_PRESET = previous;
    expect(info).toHaveBeenCalledWith(
      `[dev-whatsapp] to=+15559876543 code=999888 file=nda.pdf message=${expected}`,
    );
  });
});

describe('recipient OTP template placeholders', () => {
  it('supports all documented SMS/WhatsApp vars', () => {
    const template =
      '{{displayName}} | {{code}} | {{fileName}} | {{expiresMinutes}}';
    expect(
      renderBrandTemplate(template, {
        displayName: 'Acme',
        code: '424242',
        fileName: 'x.pdf',
        expiresMinutes: '5',
      }),
    ).toBe('Acme | 424242 | x.pdf | 5');
  });
});
