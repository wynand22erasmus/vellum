/**
 * @vitest-environment node
 */

import { describe, expect, it } from 'vitest';
import { getBrandPreset, brandPresets } from './presets.ts';

describe('getBrandPreset', () => {
  it('returns vellum by default', () => {
    expect(getBrandPreset().id).toBe('vellum');
  });

  it('returns client-example when requested', () => {
    expect(getBrandPreset('client-example').displayName).toBe('Acme Secure Transfer');
  });

  it('falls back to vellum for unknown ids', () => {
    expect(getBrandPreset('unknown-client').id).toBe('vellum');
  });

  it('registers all expected presets', () => {
    expect(Object.keys(brandPresets).sort()).toEqual(['client-example', 'vellum']);
  });

  it('defines SMS and WhatsApp recipient OTP templates on every preset', () => {
    for (const preset of Object.values(brandPresets)) {
      expect(preset.sms.templates.recipientOtp.length).toBeGreaterThan(0);
      expect(preset.whatsapp.templates.recipientOtp.length).toBeGreaterThan(0);
      expect(preset.sms.templates.recipientOtp).toContain('{{code}}');
      expect(preset.whatsapp.templates.recipientOtp).toContain('{{fileName}}');
    }
  });
});
